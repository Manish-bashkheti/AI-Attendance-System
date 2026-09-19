package com.aiattendance.backend;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "AIAttendanceSystemSecretKeyForJWTAuthentication2026";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 10;

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getUserId())
                .claim("studentId", user.getStudentId())
                .claim("teacherId", user.getTeacherId())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}