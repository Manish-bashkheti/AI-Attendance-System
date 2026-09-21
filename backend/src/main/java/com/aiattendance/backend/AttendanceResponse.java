package com.aiattendance.backend;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceResponse {

    private Integer attendanceId;
    private Integer studentId;
    private String studentName;
    private Integer classId;
    private Integer subjectId;
    private LocalDate attendanceDate;
    private String status;
    private LocalTime markedTime;
    private Integer sessionId;

    public AttendanceResponse() {
    }

    public AttendanceResponse(
            Integer attendanceId,
            Integer studentId,
            String studentName,
            Integer classId,
            Integer subjectId,

            LocalDate attendanceDate,
            String status,
            LocalTime markedTime,
            Integer sessionId) {

        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.classId = classId;
        this.subjectId = subjectId;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.markedTime = markedTime;
        this.sessionId = sessionId;
    }

    public Integer getAttendanceId() {
        return attendanceId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Integer getClassId() {
        return classId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public LocalTime getMarkedTime() {
        return markedTime;
    }

    public Integer getSessionId() {
        return sessionId;
    }
}