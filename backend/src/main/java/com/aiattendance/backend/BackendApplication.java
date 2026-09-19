package com.aiattendance.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;

    public BackendApplication(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        String password = "Admin@123";

        String hash = passwordEncoder.encode(password);

        System.out.println();
        System.out.println("BCrypt Password Hash:");
        System.out.println(hash);
        System.out.println();
    }
}