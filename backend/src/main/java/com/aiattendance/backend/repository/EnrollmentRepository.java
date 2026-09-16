package com.aiattendance.backend.repository;

import java.util.List;

import com.aiattendance.backend.Enrollment;
import com.aiattendance.backend.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    boolean existsByStudentIdAndClassId(Integer studentId, Integer classId);

    List<Enrollment> findByClassId(Integer classId);
}