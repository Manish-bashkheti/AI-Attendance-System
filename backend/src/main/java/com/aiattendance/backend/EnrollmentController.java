package com.aiattendance.backend;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiattendance.backend.repository.EnrollmentRepository;
import com.aiattendance.backend.repository.StudentRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    public EnrollmentController(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/class/{classId}")
    public List<Enrollment> getEnrollmentsByClass(
            @PathVariable Integer classId) {

        return enrollmentRepository.findByClassId(classId);
    }

    @GetMapping("/class/{classId}/students")
    public List<Student> getStudentsByClass(
            @PathVariable Integer classId) {

        List<Enrollment> enrollments =
                enrollmentRepository.findByClassId(classId);

        List<Integer> studentIds = enrollments.stream()
                .map(Enrollment::getStudentId)
                .toList();

        return studentRepository.findAllById(studentIds);
    }
}