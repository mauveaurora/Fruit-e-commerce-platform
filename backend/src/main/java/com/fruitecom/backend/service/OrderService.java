package com.fruitecom.backend.service;

import com.fruitecom.backend.dto.CreateOrderRequest;
import com.fruitecom.backend.entity.*;
import com.fruitecom.backend.exception.BizException;
import com.fruitecom.backend.repository.OrderItemRepository;
import com.fruitecom.backend.repository.OrderMainRepository;
import com.fruitecom.backend.repository.ProductRepository;
import com.fruitecom.backend.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMainRepository orderMainRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;
    private final CartService cartService;

    public Map<String, Object> preview(Long userId, CreateOrderRequest request) {
        List<CartItem> cartItems = cartService.loadForOrder(userId, request.getCartItemIds());
        return buildPreviewResult(cartItems);
    }

    @Transactional
    public Map<String, Object> create(Long userId, CreateOrderRequest request) {
        UserAddress address = getAddress(userId, request.getAddressId());
        List<CartItem> cartItems = cartService.loadForOrder(userId, request.getCartItemIds());

        Map<Long, Product> productMap = productRepository.findAllById(
                        cartItems.stream().map(CartItem::getProductId).toList())
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productMap.get(cartItem.getProductId());
            if (product == null || !"ON_SALE".equals(product.getStatus())) {
                throw new BizException(400, "存在不可购买商品");
            }
            if (cartItem.getQuantity() > product.getStock()) {
                throw new BizException(400, "商品库存不足: " + product.getName());
            }

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(subtotal);

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .productNameSnapshot(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build());

            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setSales(product.getSales() + cartItem.getQuantity());
            productRepository.save(product);
        }

        String orderNo = "FS" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + ThreadLocalRandom.current().nextInt(1000, 9999);

        OrderMain orderMain = OrderMain.builder()
                .orderNo(orderNo)
                .userId(userId)
                .totalAmount(totalAmount)
                .payAmount(totalAmount)
                .orderStatus("CREATED")
                .payStatus("UNPAID")
                .addressSnapshot(buildAddressSnapshot(address))
                .build();

        orderMainRepository.save(orderMain);

        for (OrderItem orderItem : orderItems) {
            orderItem.setOrderId(orderMain.getId());
        }
        orderItemRepository.saveAll(orderItems);

        cartService.removeBatch(userId, cartItems.stream().map(CartItem::getId).toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("orderId", orderMain.getId());
        result.put("orderNo", orderMain.getOrderNo());
        result.put("payAmount", orderMain.getPayAmount());
        return result;
    }

    public List<Map<String, Object>> list(Long userId, boolean includeCancelled) {
        List<OrderMain> orders;
        if (includeCancelled) {
            orders = orderMainRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            orders = orderMainRepository.findByUserIdAndOrderStatusNotOrderByCreatedAtDesc(userId, "CANCELLED");
        }
        return orders.stream().map(order -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", order.getId());
            item.put("orderNo", order.getOrderNo());
            item.put("totalAmount", order.getTotalAmount());
            item.put("payAmount", order.getPayAmount());
            item.put("orderStatus", order.getOrderStatus());
            item.put("payStatus", order.getPayStatus());
            item.put("createdAt", order.getCreatedAt());
            item.put("itemCount", orderItemRepository.findByOrderId(order.getId()).size());
            return item;
        }).toList();
    }

    public Map<String, Object> detail(Long userId, Long orderId) {
        OrderMain order = orderMainRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new BizException(404, "订单不存在"));

        List<Map<String, Object>> items = orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(orderItem -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", orderItem.getId());
                    map.put("productId", orderItem.getProductId());
                    map.put("productName", orderItem.getProductNameSnapshot());
                    map.put("unitPrice", orderItem.getUnitPrice());
                    map.put("quantity", orderItem.getQuantity());
                    map.put("subtotal", orderItem.getSubtotal());
                    return map;
                })
                .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", order.getId());
        result.put("orderNo", order.getOrderNo());
        result.put("totalAmount", order.getTotalAmount());
        result.put("payAmount", order.getPayAmount());
        result.put("orderStatus", order.getOrderStatus());
        result.put("payStatus", order.getPayStatus());
        result.put("addressSnapshot", order.getAddressSnapshot());
        result.put("createdAt", order.getCreatedAt());
        result.put("items", items);
        return result;
    }

    @Transactional
    public void cancel(Long userId, Long orderId) {
        OrderMain order = orderMainRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new BizException(404, "订单不存在"));

        if (!"CREATED".equals(order.getOrderStatus())) {
            throw new BizException(400, "当前状态不可取消");
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setOrderStatus("CANCELLED");
        orderMainRepository.save(order);
    }

    private UserAddress getAddress(Long userId, Long addressId) {
        if (addressId != null) {
            return userAddressRepository.findByIdAndUserId(addressId, userId)
                    .orElseThrow(() -> new BizException(404, "收货地址不存在"));
        }
        return userAddressRepository.findByUserIdAndIsDefaultTrue(userId)
                .orElseThrow(() -> new BizException(400, "请先新增收货地址"));
    }

    private Map<String, Object> buildPreviewResult(List<CartItem> cartItems) {
        Map<Long, Product> productMap = productRepository.findAllById(
                        cartItems.stream().map(CartItem::getProductId).toList())
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Map<String, Object>> items = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productMap.get(cartItem.getProductId());
            if (product == null || !"ON_SALE".equals(product.getStatus())) {
                throw new BizException(400, "存在不可购买商品");
            }
            if (cartItem.getQuantity() > product.getStock()) {
                throw new BizException(400, "商品库存不足: " + product.getName());
            }

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(subtotal);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("cartItemId", cartItem.getId());
            row.put("productId", product.getId());
            row.put("productName", product.getName());
            row.put("coverImage", product.getCoverImage());
            row.put("unitPrice", product.getPrice());
            row.put("quantity", cartItem.getQuantity());
            row.put("subtotal", subtotal);
            items.add(row);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("totalAmount", totalAmount);
        result.put("payAmount", totalAmount);
        return result;
    }

    private String buildAddressSnapshot(UserAddress address) {
        return address.getReceiver() + " " + address.getPhone() + " " +
                address.getProvince() + address.getCity() + address.getDetailAddress();
    }
}
