package com.userservice.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userservice.userservice.dto.LoginRequest;
import com.userservice.userservice.dto.LoginResponse;
import com.userservice.userservice.dto.RegisterRequest;
import com.userservice.userservice.dto.RegisterResponse;
import com.userservice.userservice.service.RegisterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class AuthController {
    RegisterService registerService;

    AuthController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/login")
    private ResponseEntity<LoginResponse> login( @Valid @RequestBody LoginRequest loginRequest) {

        return ResponseEntity.ok(registerService.login(loginRequest));
    }
    @PostMapping("/register")
    private ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest loginRequest) {
        return ResponseEntity.ok(registerService.register(loginRequest));
    }

    
}
