package com.fruitecom.backend.repository;

import com.fruitecom.backend.entity.OrderMain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderMainRepository extends JpaRepository<OrderMain, Long> {
    List<OrderMain> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<OrderMain> findByUserIdAndOrderStatusNotOrderByCreatedAtDesc(Long userId, String orderStatus);

    Optional<OrderMain> findByIdAndUserId(Long id, Long userId);
}
