package com.aiattendance.backend.repository;

import com.aiattendance.backend.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
}