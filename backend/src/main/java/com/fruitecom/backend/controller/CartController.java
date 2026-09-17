package com.fruitecom.backend.controller;

import com.fruitecom.backend.dto.AddCartItemRequest;
import com.fruitecom.backend.dto.UpdateCartItemRequest;
import com.fruitecom.backend.service.CartService;
import com.fruitecom.backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart/items")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(cartService.list(userId));
    }

    @PostMapping
    public ApiResponse<Void> add(HttpServletRequest request, @Valid @RequestBody AddCartItemRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.add(userId, body);
        return ApiResponse.success();
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id,
                                    HttpServletRequest request,
                                    @Valid @RequestBody UpdateCartItemRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.updateQuantity(userId, id, body.getQuantity());
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> remove(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        cartService.remove(userId, id);
        return ApiResponse.success();
    }
}
