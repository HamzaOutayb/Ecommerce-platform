package com.userservice.userservice.dto;

import com.userservice.userservice.model.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank
    @Email 
    @Size(max = 254)
    private String email;
    
    @NotBlank
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters long")
    private String password;
    
    @NotBlank @Size(max = 100)
    private String name;
    
    @NotNull
    private Role role;
}
