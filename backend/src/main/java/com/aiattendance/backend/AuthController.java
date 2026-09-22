package com.aiattendance.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiattendance.backend.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        User user = null;

        /*
         * ADMIN LOGIN
         * Admin logs in using email
         */
        if (loginRequest.getEmail() != null
                && !loginRequest.getEmail().isBlank()) {

            user = userRepository
                    .findByEmail(loginRequest.getEmail())
                    .orElse(null);
        }

        /*
         * STUDENT LOGIN
         * Student logs in using Student ID
         */
        else if (loginRequest.getStudentId() != null) {

            user = userRepository
                    .findByStudentId(loginRequest.getStudentId())
                    .orElse(null);
        }

        /*
         * TEACHER LOGIN
         * Teacher logs in using Teacher ID
         */
        else if (loginRequest.getTeacherId() != null) {

            user = userRepository
                    .findByTeacherId(loginRequest.getTeacherId())
                    .orElse(null);
        }

        /*
         * USER NOT FOUND
         */
        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid ID or password.");
        }

        /*
         * PASSWORD CHECK
         */
        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid ID or password.");
        }

        /*
         * JWT TOKEN
         */
        String token = jwtService.generateToken(user);

        /*
         * LOGIN RESPONSE
         */
        LoginResponse response = new LoginResponse(
                token,
                user.getRole(),
                user.getUserId(),
                user.getStudentId(),
                user.getTeacherId()
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // VERIFY ADMIN PASSWORD
    // =========================================================

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String password = request.get("password");

        /*
         * Password required
         */
        if (password == null || password.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required.");
        }

        /*
         * Get logged-in user
         */
        User user = (User) authentication.getPrincipal();

        /*
         * Only ADMIN can verify password
         */
        if (!"ADMIN".equals(user.getRole())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only admin can perform this action.");
        }

        /*
         * Verify admin password
         */
        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid admin password.");
        }

        return ResponseEntity.ok(
                "Admin verification successful."
        );
    }
}