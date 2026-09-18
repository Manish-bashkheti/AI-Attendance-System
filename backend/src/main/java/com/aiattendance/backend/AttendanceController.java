package com.aiattendance.backend;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public Attendance markAttendance(@RequestBody Attendance attendance) {
        return attendanceService.markAttendance(attendance);
    }

    @GetMapping
    public List<AttendanceResponse> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }
    @GetMapping("/percentage/{studentId}")
public double getAttendancePercentage(@PathVariable Integer studentId) {
    return attendanceService.getAttendancePercentage(studentId);
}
@PostMapping("/mark-absent")
public void markAbsentStudents(
        @RequestParam Integer classId,
        @RequestParam Integer subjectId,
        @RequestParam String attendanceDate) {

    attendanceService.markAbsentStudents(
            classId,
            subjectId,
            java.time.LocalDate.parse(attendanceDate)
    );
}

    @ExceptionHandler(AttendanceAlreadyMarkedException.class)
    public ResponseEntity<AttendanceErrorResponse> handleAttendanceAlreadyMarked(
            AttendanceAlreadyMarkedException exception) {

        AttendanceErrorResponse errorResponse = new AttendanceErrorResponse(
                HttpStatus.CONFLICT.value(),
                exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errorResponse);
    }
    @ExceptionHandler(RuntimeException.class)
public ResponseEntity<AttendanceErrorResponse> handleRuntimeException(
        RuntimeException exception) {

    AttendanceErrorResponse errorResponse =
            new AttendanceErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    exception.getMessage());

    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorResponse);
}
}