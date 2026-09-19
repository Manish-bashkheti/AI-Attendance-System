package com.aiattendance.backend;

public class LoginResponse {

    private String token;
    private String role;
    private Integer userId;
    private Integer studentId;
    private Integer teacherId;

    public LoginResponse(
            String token,
            String role,
            Integer userId,
            Integer studentId,
            Integer teacherId) {

        this.token = token;
        this.role = role;
        this.userId = userId;
        this.studentId = studentId;
        this.teacherId = teacherId;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }
}