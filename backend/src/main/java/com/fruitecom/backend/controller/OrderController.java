package com.fruitecom.backend.controller;

import com.fruitecom.backend.dto.CreateOrderRequest;
import com.fruitecom.backend.service.OrderService;
import com.fruitecom.backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/preview")
    public ApiResponse<Map<String, Object>> preview(HttpServletRequest request,
                                                    @RequestBody CreateOrderRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(orderService.preview(userId, body));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> create(HttpServletRequest request,
                                                   @RequestBody CreateOrderRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(orderService.create(userId, body));
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list(HttpServletRequest request,
                                                        @RequestParam(defaultValue = "false") boolean includeCancelled) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(orderService.list(userId, includeCancelled));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(orderService.detail(userId, id));
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<Void> cancel(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        orderService.cancel(userId, id);
        return ApiResponse.success();
    }
}
