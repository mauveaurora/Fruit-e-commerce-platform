package com.fruitecom.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String category;

    @Column(name = "origin_place", length = 100)
    private String originPlace;

    @Column(length = 1000)
    private String description;

    @Column(name = "nutrition_info", length = 1000)
    private String nutritionInfo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Integer sales;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(nullable = false)
    private Boolean featured;

    @Column(nullable = false)
    private Boolean seasonal;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (sales == null) {
            sales = 0;
        }
        if (featured == null) {
            featured = false;
        }
        if (seasonal == null) {
            seasonal = false;
        }
        if (status == null) {
            status = "ON_SALE";
        }
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
