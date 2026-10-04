package com.mediaservice.mediaservice.security;

import java.security.Principal;

public class AuthenticatedUser implements Principal {
    private final String userId;
    private final String email;
    private final String role;

    public AuthenticatedUser(String userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String getName() {
        return email;
    }
}
