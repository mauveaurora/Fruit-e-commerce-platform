package com.fruitecom.backend.repository;

import com.fruitecom.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsernameOrPhone(String username, String phone);

    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);
}
