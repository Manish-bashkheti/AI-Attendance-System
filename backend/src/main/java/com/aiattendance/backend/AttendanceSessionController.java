package com.aiattendance.backend;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalTime;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/attendance-sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService attendanceSessionService;
    private Process aiProcess;

    public AttendanceSessionController(
            AttendanceSessionService attendanceSessionService) {
        this.attendanceSessionService = attendanceSessionService;
    }

    private synchronized void startAIProcess() throws IOException {
        if (aiProcess != null && aiProcess.isAlive()) {
            return;
        }

        Path aiDirectory = Paths.get(
                "C:\\Users\\manis\\AI-attendence-System\\ai-server");

        Path python = aiDirectory.resolve("venv")
                .resolve("Scripts").resolve("python.exe");

        Path script = aiDirectory.resolve("mobile_face_recognition.py");

        if (!python.toFile().exists() || !script.toFile().exists()) {
            throw new IOException(
                    "Python executable or AI script was not found. Check the ai-server path.");
        }

        ProcessBuilder builder = new ProcessBuilder(
                python.toString(), script.toString());

        builder.directory(aiDirectory.toFile());
        builder.redirectErrorStream(true);
        builder.redirectOutput(ProcessBuilder.Redirect.appendTo(
                aiDirectory.resolve("ai-server.log").toFile()));

        aiProcess = builder.start();
    }

    private synchronized void stopAIProcess() {
        if (aiProcess != null && aiProcess.isAlive()) {
            aiProcess.destroy();

            try {
                if (!aiProcess.waitFor(3, TimeUnit.SECONDS)) {
                    aiProcess.destroyForcibly();
                }
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                aiProcess.destroyForcibly();
            }
        }

        aiProcess = null;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startSession(
            @RequestParam String dayOfWeek,
            @RequestParam String time,
            @RequestParam Integer teacherId) {

        try {
            AttendanceSession session =
                    attendanceSessionService.startSession(
                            dayOfWeek,
                            LocalTime.parse(time),
                            teacherId);

            startAIProcess();

            return ResponseEntity.ok(session);

        } catch (RuntimeException | IOException exception) {
            stopAIProcess();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSession() {
        try {
            return ResponseEntity.ok(
                    attendanceSessionService.getActiveSession());

        } catch (RuntimeException exception) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(exception.getMessage());
        }
    }

    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<?> finishSession(
            @PathVariable Integer sessionId) {

        try {
            AttendanceSession session =
                    attendanceSessionService.finishSession(sessionId);

            stopAIProcess();

            return ResponseEntity.ok(session);

        } catch (RuntimeException exception) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }
}