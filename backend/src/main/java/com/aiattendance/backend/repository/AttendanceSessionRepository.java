package com.aiattendance.backend.repository;

import com.aiattendance.backend.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, Integer> {

    boolean existsBySessionIdAndStatus(
            Integer sessionId,
            String status);
}