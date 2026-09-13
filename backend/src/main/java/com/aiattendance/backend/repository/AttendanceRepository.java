package com.aiattendance.backend.repository;

import com.aiattendance.backend.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    boolean existsByStudentIdAndClassIdAndSubjectIdAndAttendanceDate(
            Integer studentId,
            Integer classId,
            Integer subjectId,
            LocalDate attendanceDate
    );
}