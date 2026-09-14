package com.aiattendance.backend;

public class EnrollmentAlreadyExistsException extends RuntimeException {

    public EnrollmentAlreadyExistsException(String message) {
        super(message);
    }
}