package com.fruitecom.backend.service;

import com.fruitecom.backend.entity.Product;
import com.fruitecom.backend.exception.BizException;
import com.fruitecom.backend.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Map<String, Object> list(String keyword,
                                    String category,
                                    String origin,
                                    BigDecimal minPrice,
                                    BigDecimal maxPrice,
                                    String sort,
                                    int page,
                                    int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), resolveSort(sort));

        Specification<Product> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), "ON_SALE"));

            if (StringUtils.hasText(keyword)) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (StringUtils.hasText(origin)) {
                predicates.add(cb.equal(root.get("originPlace"), origin));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> pageData = productRepository.findAll(specification, pageable);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("records", pageData.getContent().stream().map(this::toSimpleMap).toList());
        result.put("page", pageData.getNumber());
        result.put("size", pageData.getSize());
        result.put("total", pageData.getTotalElements());
        result.put("totalPages", pageData.getTotalPages());
        return result;
    }

    public Map<String, Object> detail(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> "ON_SALE".equals(p.getStatus()))
                .orElseThrow(() -> new BizException(404, "商品不存在或已下架"));
        return toDetailMap(product);
    }

    public List<Map<String, Object>> recommend() {
        List<Product> products = productRepository.findTop8ByFeaturedTrueAndStatusOrderBySalesDesc("ON_SALE");
        if (products.isEmpty()) {
            products = productRepository.findAll(PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "sales"))).getContent();
        }
        return products.stream().map(this::toSimpleMap).toList();
    }

    private Sort resolveSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return Sort.by(Sort.Direction.DESC, "id");
        }
        return switch (sort) {
            case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
            case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
            case "salesDesc" -> Sort.by(Sort.Direction.DESC, "sales");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "id");
        };
    }

    private Map<String, Object> toSimpleMap(Product product) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("category", product.getCategory());
        map.put("originPlace", product.getOriginPlace());
        map.put("price", product.getPrice());
        map.put("stock", product.getStock());
        map.put("sales", product.getSales());
        map.put("coverImage", product.getCoverImage());
        map.put("featured", product.getFeatured());
        map.put("seasonal", product.getSeasonal());
        return map;
    }

    private Map<String, Object> toDetailMap(Product product) {
        Map<String, Object> map = toSimpleMap(product);
        map.put("description", product.getDescription());
        map.put("nutritionInfo", product.getNutritionInfo());
        map.put("status", product.getStatus());
        map.put("createdAt", product.getCreatedAt());
        return map;
    }
}
