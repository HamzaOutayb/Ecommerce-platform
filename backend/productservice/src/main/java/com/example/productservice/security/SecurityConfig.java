package com.example.productservice.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.productservice.exception.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
                ObjectMapper objectMapper
    ) throws Exception {
        
        return http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(authz -> authz

                        // Public endpoints
                        .requestMatchers(HttpMethod.GET, "/products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()

                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/auth/register",
                                "/auth/login"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/products/**")
                        .hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT, "/products/**")
                        .hasRole("SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/products/**")
                        .hasRole("SELLER")
                        .anyRequest().authenticated()
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint((request, response, authException) ->
                                writeSecurityError(
                                        response,
                                        objectMapper,
                                        HttpStatus.UNAUTHORIZED,
                                        "Authentication is required",
                                        request.getRequestURI()
                                )
                        )

                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                writeSecurityError(
                                        response,
                                        objectMapper,
                                        HttpStatus.FORBIDDEN,
                                        "You do not have permission to access this resource",
                                        request.getRequestURI()
                                )
                        )
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    private void writeSecurityError(
            HttpServletResponse response,
            ObjectMapper objectMapper,
            HttpStatus status,
            String message,
            String path
    ) throws java.io.IOException {

        response.setStatus(status.value());
        response.setContentType("application/json");

        objectMapper.writeValue(
                response.getOutputStream(),
                new ApiError(
                        status.value(),
                        status.getReasonPhrase(),
                        message,
                        path
                )
        );
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
