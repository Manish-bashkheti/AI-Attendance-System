package com.aiattendance.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getRole(),
                user.getUserId(),
                user.getStudentId(),
                user.getTeacherId()
        );

        return ResponseEntity.ok(response);
    }
}