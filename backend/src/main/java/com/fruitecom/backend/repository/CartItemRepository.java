package com.fruitecom.backend.repository;

import com.fruitecom.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    List<CartItem> findByUserIdAndIdIn(Long userId, Collection<Long> ids);

    void deleteByUserIdAndIdIn(Long userId, Collection<Long> ids);
}
