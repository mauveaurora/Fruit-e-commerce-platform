package com.fruitecom.backend.service;

import com.fruitecom.backend.dto.AddCartItemRequest;
import com.fruitecom.backend.entity.CartItem;
import com.fruitecom.backend.entity.Product;
import com.fruitecom.backend.exception.BizException;
import com.fruitecom.backend.repository.CartItemRepository;
import com.fruitecom.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public List<Map<String, Object>> list(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (items.isEmpty()) {
            return List.of();
        }

        Map<Long, Product> productMap = productRepository.findAllById(
                        items.stream().map(CartItem::getProductId).toList())
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (CartItem item : items) {
            Product product = productMap.get(item.getProductId());
            if (product == null) {
                continue;
            }
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", item.getId());
            row.put("productId", product.getId());
            row.put("name", product.getName());
            row.put("coverImage", product.getCoverImage());
            row.put("price", product.getPrice());
            row.put("stock", product.getStock());
            row.put("quantity", item.getQuantity());
            row.put("subtotal", subtotal);
            result.add(row);
        }
        return result;
    }

    @Transactional
    public void add(Long userId, AddCartItemRequest request) {
        Product product = getAvailableProduct(request.getProductId());

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElseGet(() -> CartItem.builder()
                        .userId(userId)
                        .productId(request.getProductId())
                        .quantity(0)
                        .build());

        int targetQuantity = item.getQuantity() + request.getQuantity();
        if (targetQuantity > product.getStock()) {
            throw new BizException(400, "库存不足");
        }

        item.setQuantity(targetQuantity);
        cartItemRepository.save(item);
    }

    @Transactional
    public void updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BizException(404, "购物车条目不存在"));

        if (!Objects.equals(item.getUserId(), userId)) {
            throw new BizException(403, "无权限操作该购物车条目");
        }

        Product product = getAvailableProduct(item.getProductId());
        if (quantity > product.getStock()) {
            throw new BizException(400, "库存不足");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    @Transactional
    public void remove(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new BizException(404, "购物车条目不存在"));

        if (!Objects.equals(item.getUserId(), userId)) {
            throw new BizException(403, "无权限操作该购物车条目");
        }

        cartItemRepository.delete(item);
    }

    public List<CartItem> loadForOrder(Long userId, List<Long> cartItemIds) {
        List<CartItem> cartItems;
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            cartItems = cartItemRepository.findByUserIdAndIdIn(userId, cartItemIds);
        }

        if (cartItems.isEmpty()) {
            throw new BizException(400, "购物车为空");
        }
        return cartItems;
    }

    @Transactional
    public void removeBatch(Long userId, Collection<Long> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            return;
        }
        cartItemRepository.deleteByUserIdAndIdIn(userId, cartItemIds);
    }

    private Product getAvailableProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BizException(404, "商品不存在"));
        if (!"ON_SALE".equals(product.getStatus())) {
            throw new BizException(400, "商品已下架");
        }
        return product;
    }
}
