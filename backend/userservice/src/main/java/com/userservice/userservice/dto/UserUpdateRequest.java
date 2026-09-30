package com.userservice.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
	@NotBlank private String name;
	private String avatar;
}