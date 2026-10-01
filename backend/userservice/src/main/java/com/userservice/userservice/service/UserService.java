package com.userservice.userservice.service;

import java.util.Locale;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.userservice.userservice.dto.UserResponse;
import com.userservice.userservice.dto.UserUpdateRequest;
import com.userservice.userservice.model.User;
import com.userservice.userservice.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getProfile(String email) {
        return UserResponse.from(findByEmail(email));
    }

    public UserResponse updateProfile(String email, UserUpdateRequest request) {
        User user = findByEmail(email);
        user.setName(request.getName().trim());

        if (request.getAvatar() != null) {
            String avatar = request.getAvatar().trim();
            user.setAvatar(avatar.isEmpty() ? null : avatar);
        }

        return UserResponse.from(userRepository.save(user));
    }

    private User findByEmail(String email) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }
}
