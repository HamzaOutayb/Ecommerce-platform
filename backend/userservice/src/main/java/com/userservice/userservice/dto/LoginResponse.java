package com.userservice.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.userservice.userservice.model.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
	private String token;
	private String email;
	private Role role;
}
