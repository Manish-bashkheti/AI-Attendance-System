package com.aiattendance.backend.repository;

import com.aiattendance.backend.Enrollment;
import com.aiattendance.backend.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    boolean existsByStudentIdAndClassId(Integer studentId, Integer classId);
}