package com.userservice.userservice.service;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.userservice.userservice.dto.LoginRequest;
import com.userservice.userservice.dto.LoginResponse;
import com.userservice.userservice.dto.RegisterRequest;
import com.userservice.userservice.dto.RegisterResponse;
import com.userservice.userservice.exeptions.EmailAlreadyExistsException;
import com.userservice.userservice.model.User;
import com.userservice.userservice.repository.UserRepository;
import com.userservice.userservice.security.JwtService;

@Service
public class RegisterService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public RegisterResponse register(RegisterRequest registerRequest){
        String email = registerRequest.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email is already in use!");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setName(registerRequest.getName());
        user.setRole(registerRequest.getRole());

        userRepository.save(user);
        RegisterResponse registerResponse = new RegisterResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().toString());
        return registerResponse;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
        return new LoginResponse(jwtService.generateToken(userDetails), user.getEmail(), user.getRole());
    }
}
