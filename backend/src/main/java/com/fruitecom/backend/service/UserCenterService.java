package com.fruitecom.backend.service;

import com.fruitecom.backend.dto.AddressRequest;
import com.fruitecom.backend.entity.FavoriteItem;
import com.fruitecom.backend.entity.Product;
import com.fruitecom.backend.entity.UserAddress;
import com.fruitecom.backend.exception.BizException;
import com.fruitecom.backend.repository.FavoriteItemRepository;
import com.fruitecom.backend.repository.ProductRepository;
import com.fruitecom.backend.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCenterService {

    private final UserAddressRepository userAddressRepository;
    private final FavoriteItemRepository favoriteItemRepository;
    private final ProductRepository productRepository;

    public List<Map<String, Object>> listAddresses(Long userId) {
        return userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId)
                .stream()
                .map(this::toAddressMap)
                .toList();
    }

    @Transactional
    public Map<String, Object> addAddress(Long userId, AddressRequest request) {
        List<UserAddress> exists = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
        boolean setDefault = Boolean.TRUE.equals(request.getIsDefault()) || exists.isEmpty();
        if (setDefault) {
            clearDefault(userId);
        }

        UserAddress address = UserAddress.builder()
                .userId(userId)
                .receiver(request.getReceiver())
                .phone(request.getPhone())
                .province(request.getProvince())
                .city(request.getCity())
                .detailAddress(request.getDetailAddress())
                .isDefault(setDefault)
                .build();
        userAddressRepository.save(address);
        return toAddressMap(address);
    }

    @Transactional
    public Map<String, Object> updateAddress(Long userId, Long addressId, AddressRequest request) {
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new BizException(404, "地址不存在"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefault(userId);
            address.setIsDefault(true);
        }

        address.setReceiver(request.getReceiver());
        address.setPhone(request.getPhone());
        address.setProvince(request.getProvince());
        address.setCity(request.getCity());
        address.setDetailAddress(request.getDetailAddress());

        userAddressRepository.save(address);
        return toAddressMap(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new BizException(404, "地址不存在"));
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        userAddressRepository.delete(address);

        if (wasDefault) {
            List<UserAddress> remain = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
            if (!remain.isEmpty()) {
                UserAddress first = remain.get(0);
                first.setIsDefault(true);
                userAddressRepository.save(first);
            }
        }
    }

    public List<Map<String, Object>> listFavorites(Long userId) {
        List<FavoriteItem> favorites = favoriteItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (favorites.isEmpty()) {
            return List.of();
        }

        Map<Long, Product> productMap = productRepository.findAllById(
                        favorites.stream().map(FavoriteItem::getProductId).toList())
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (FavoriteItem favorite : favorites) {
            Product product = productMap.get(favorite.getProductId());
            if (product == null) {
                continue;
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("favoriteId", favorite.getId());
            map.put("productId", product.getId());
            map.put("name", product.getName());
            map.put("coverImage", product.getCoverImage());
            map.put("price", product.getPrice());
            map.put("status", product.getStatus());
            map.put("createdAt", favorite.getCreatedAt());
            result.add(map);
        }
        return result;
    }

    @Transactional
    public void addFavorite(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BizException(404, "商品不存在"));
        if (!"ON_SALE".equals(product.getStatus())) {
            throw new BizException(400, "商品已下架");
        }

        if (favoriteItemRepository.existsByUserIdAndProductId(userId, productId)) {
            return;
        }

        FavoriteItem favorite = FavoriteItem.builder()
                .userId(userId)
                .productId(productId)
                .build();
        favoriteItemRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        favoriteItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    private void clearDefault(Long userId) {
        List<UserAddress> list = userAddressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
        for (UserAddress address : list) {
            if (Boolean.TRUE.equals(address.getIsDefault())) {
                address.setIsDefault(false);
                userAddressRepository.save(address);
            }
        }
    }

    private Map<String, Object> toAddressMap(UserAddress address) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", address.getId());
        map.put("receiver", address.getReceiver());
        map.put("phone", address.getPhone());
        map.put("province", address.getProvince());
        map.put("city", address.getCity());
        map.put("detailAddress", address.getDetailAddress());
        map.put("isDefault", address.getIsDefault());
        return map;
    }
}
