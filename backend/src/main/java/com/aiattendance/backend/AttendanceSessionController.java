package com.aiattendance.backend;

import java.time.LocalTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/attendance-sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService attendanceSessionService;

    public AttendanceSessionController(
            AttendanceSessionService attendanceSessionService) {

        this.attendanceSessionService =
                attendanceSessionService;
    }

    @PostMapping("/start")
    public AttendanceSession startSession(
            @RequestParam String dayOfWeek,
            @RequestParam String time) {

        return attendanceSessionService.startSession(
                dayOfWeek,
                LocalTime.parse(time)
        );
    }

   @GetMapping("/active")
public ResponseEntity<?> getActiveSession() {

    try {
        return ResponseEntity.ok(
                attendanceSessionService.getActiveSession()
        );

    } catch (RuntimeException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exception.getMessage());
    }
}
    @PostMapping("/{sessionId}/finish")
    public AttendanceSession finishSession(
            @PathVariable Integer sessionId) {

        return attendanceSessionService.finishSession(
                sessionId
        );
    }
}