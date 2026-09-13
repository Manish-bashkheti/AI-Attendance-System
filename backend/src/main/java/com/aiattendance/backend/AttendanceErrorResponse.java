package com.aiattendance.backend;

public class AttendanceErrorResponse {

    private int status;
    private String message;

    public AttendanceErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}