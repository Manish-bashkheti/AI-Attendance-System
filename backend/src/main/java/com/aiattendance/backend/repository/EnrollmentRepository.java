package com.aiattendance.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiattendance.backend.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Integer> {

    List<Enrollment> findByClassId(Integer classId);

    List<Enrollment> findByStudentId(Integer studentId);

    boolean existsByStudentIdAndClassId(
            Integer studentId,
            Integer classId
    );
}