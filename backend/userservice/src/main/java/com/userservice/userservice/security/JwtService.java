package com.userservice.userservice.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${security.jwt.secret}")
	private String jwt_secret;

	@Value("${security.jwt.expiration-ms}")
	private long jwt_expiration;

	public String generateToken(UserDetails userDetails) {
		return Jwts.builder()
			.subject(userDetails.getUsername())
			.claim("role", userDetails.getAuthorities().stream().findFirst()
				.map(authority -> authority.getAuthority()).orElse("ROLE_CLIENT"))
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + jwt_expiration))
			.signWith(getSigningKey())
			.compact();
	}

	public String extractEmail(String token) {
		return extractClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		String email = extractEmail(token);
		return email.equals(userDetails.getUsername())
			&& !isTokenExpired(extractClaims(token).getExpiration());
	}

	private boolean isTokenExpired(Date expiration) {
		return expiration == null || expiration.before(new Date());
	}

	private Claims extractClaims(String token) {
		return Jwts.parser()
			.verifyWith(getSigningKey())
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(jwt_secret.getBytes(StandardCharsets.UTF_8));
	}

}
