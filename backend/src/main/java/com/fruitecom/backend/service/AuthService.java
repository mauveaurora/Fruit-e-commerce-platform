package com.fruitecom.backend.service;

import com.fruitecom.backend.dto.LoginRequest;
import com.fruitecom.backend.dto.RegisterRequest;
import com.fruitecom.backend.entity.User;
import com.fruitecom.backend.exception.BizException;
import com.fruitecom.backend.repository.UserRepository;
import com.fruitecom.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BizException(400, "用户名已存在");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BizException(400, "手机号已被注册");
        }

        User user = User.builder()
                .username(request.getUsername())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status("ACTIVE")
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return buildAuthResult(user, token);
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByUsernameOrPhone(request.getAccount(), request.getAccount())
                .orElseThrow(() -> new BizException(400, "账号不存在"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BizException(400, "密码错误");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BizException(403, "账号已被禁用");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return buildAuthResult(user, token);
    }

    public Map<String, Object> profile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BizException(404, "用户不存在"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("username", user.getUsername());
        result.put("phone", user.getPhone());
        result.put("status", user.getStatus());
        result.put("createdAt", user.getCreatedAt());
        return result;
    }

    private Map<String, Object> buildAuthResult(User user, String token) {
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("phone", user.getPhone());
        userMap.put("status", user.getStatus());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("user", userMap);
        return result;
    }
}
