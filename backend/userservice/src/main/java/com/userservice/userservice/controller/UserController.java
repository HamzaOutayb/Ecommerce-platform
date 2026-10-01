package com.userservice.userservice.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.userservice.userservice.dto.UserResponse;
import com.userservice.userservice.dto.UserUpdateRequest;
import com.userservice.userservice.service.UserService;

import jakarta.validation.Valid;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    @PutMapping("/me")
    public UserResponse updateProfile(Principal principal, @Valid @RequestBody UserUpdateRequest request) {
        return userService.updateProfile(principal.getName(), request);
    }
}
