package com.fruitecom.backend.controller;

import com.fruitecom.backend.dto.AddressRequest;
import com.fruitecom.backend.service.UserCenterService;
import com.fruitecom.backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserCenterController {

    private final UserCenterService userCenterService;

    @GetMapping("/addresses")
    public ApiResponse<List<Map<String, Object>>> addresses(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(userCenterService.listAddresses(userId));
    }

    @PostMapping("/addresses")
    public ApiResponse<Map<String, Object>> addAddress(HttpServletRequest request,
                                                       @Valid @RequestBody AddressRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(userCenterService.addAddress(userId, body));
    }

    @PutMapping("/addresses/{id}")
    public ApiResponse<Map<String, Object>> updateAddress(HttpServletRequest request,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody AddressRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(userCenterService.updateAddress(userId, id, body));
    }

    @DeleteMapping("/addresses/{id}")
    public ApiResponse<Void> deleteAddress(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        userCenterService.deleteAddress(userId, id);
        return ApiResponse.success();
    }

    @GetMapping("/favorites")
    public ApiResponse<List<Map<String, Object>>> favorites(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.success(userCenterService.listFavorites(userId));
    }

    @PostMapping("/favorites/{productId}")
    public ApiResponse<Void> addFavorite(HttpServletRequest request, @PathVariable Long productId) {
        Long userId = (Long) request.getAttribute("userId");
        userCenterService.addFavorite(userId, productId);
        return ApiResponse.success();
    }

    @DeleteMapping("/favorites/{productId}")
    public ApiResponse<Void> removeFavorite(HttpServletRequest request, @PathVariable Long productId) {
        Long userId = (Long) request.getAttribute("userId");
        userCenterService.removeFavorite(userId, productId);
        return ApiResponse.success();
    }
}
