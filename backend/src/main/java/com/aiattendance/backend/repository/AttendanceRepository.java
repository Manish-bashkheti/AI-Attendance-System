package com.aiattendance.backend.repository;

import com.aiattendance.backend.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    boolean existsByStudentIdAndClassIdAndSubjectIdAndAttendanceDate(
            Integer studentId,
            Integer classId,
            Integer subjectId,
            java.time.LocalDate attendanceDate);

    long countByStudentIdAndStatus(
            Integer studentId,
            String status);

    long countByStudentId(Integer studentId);
}