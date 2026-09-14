package com.aiattendance.backend;

import com.aiattendance.backend.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    public Enrollment saveEnrollment(Enrollment enrollment) {

        boolean alreadyExists =
                enrollmentRepository.existsByStudentIdAndClassId(
                        enrollment.getStudentId(),
                        enrollment.getClassId()
                );

        if (alreadyExists) {
            throw new EnrollmentAlreadyExistsException(
                    "Student is already enrolled in this class."
            );
        }

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}