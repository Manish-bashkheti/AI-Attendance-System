package com.aiattendance.backend;

public class AttendanceAlreadyMarkedException extends RuntimeException {

    public AttendanceAlreadyMarkedException(String message) {
        super(message);
    }
}