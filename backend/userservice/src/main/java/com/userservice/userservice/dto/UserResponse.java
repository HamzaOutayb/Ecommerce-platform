package com.userservice.userservice.dto;

import com.userservice.userservice.model.User;

public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String role;
    private String avatar;

    public UserResponse() {
    }

    public UserResponse(String id, String email, String name, String role, String avatar) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
    }

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole() == null ? null : user.getRole().name(),
                user.getAvatar());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
