package com.userservice.userservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank
    @Email
    @Size(max = 254)
    private String email;
    @JsonIgnore
    @NotBlank
    @Size(max = 72)
    private String password;
    @NotBlank
    @Size(max = 100)
    private String name;
    @NotNull
    private Role role;
    @Size(max = 500)
    private String avatar;

}
