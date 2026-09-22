package com.aiattendance.backend;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiattendance.backend.repository.ClassRepository;
import com.aiattendance.backend.repository.EnrollmentRepository;
import com.aiattendance.backend.repository.StudentRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;

    public StudentController(
            StudentRepository studentRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository) {

        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{studentId}")
    public Student getStudent(
            @PathVariable Integer studentId) {

        return studentRepository.findById(studentId)
                .orElseThrow(
                        () -> new RuntimeException("Student not found")
                );
    }

    @PostMapping
    public Student addStudent(
            @RequestBody Student student) {

        if (studentRepository.existsById(student.getStudentId())) {
            throw new RuntimeException(
                    "Student ID already exists."
            );
        }

        if (student.getSection() == null
                || student.getSection().isBlank()) {

            throw new RuntimeException(
                    "Section is required."
            );
        }

        Student savedStudent =
                studentRepository.save(student);

        assignStudentToClass(savedStudent);

        return savedStudent;
    }

    @PutMapping("/{studentId}")
    public Student updateStudent(
            @PathVariable Integer studentId,
            @RequestBody Student student) {

        Student existingStudent =
                studentRepository.findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found"
                                )
                        );

        existingStudent.setName(student.getName());
        existingStudent.setBranch(student.getBranch());
        existingStudent.setSemester(student.getSemester());
        existingStudent.setSection(student.getSection());

        Student updatedStudent =
                studentRepository.save(existingStudent);

        updateStudentEnrollment(updatedStudent);

        return updatedStudent;
    }

    @DeleteMapping("/{studentId}")
    public void deleteStudent(
            @PathVariable Integer studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException(
                    "Student not found"
            );
        }

        List<Enrollment> enrollments =
                enrollmentRepository.findByStudentId(studentId);

        enrollmentRepository.deleteAll(enrollments);

        studentRepository.deleteById(studentId);
    }

    private void assignStudentToClass(
            Student student) {

        Class matchingClass =
                classRepository
                        .findByBranchAndSemesterAndSection(
                                student.getBranch(),
                                student.getSemester(),
                                student.getSection()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "No class found for "
                                                + student.getBranch()
                                                + " Semester "
                                                + student.getSemester()
                                                + " Section "
                                                + student.getSection()
                                )
                        );

        boolean alreadyEnrolled =
                enrollmentRepository
                        .existsByStudentIdAndClassId(
                                student.getStudentId(),
                                matchingClass.getClassId()
                        );

        if (!alreadyEnrolled) {

            Enrollment enrollment =
                    new Enrollment();

            enrollment.setStudentId(
                    student.getStudentId()
            );

            enrollment.setClassId(
                    matchingClass.getClassId()
            );

            enrollmentRepository.save(enrollment);
        }
    }

    private void updateStudentEnrollment(
            Student student) {

        List<Enrollment> existingEnrollments =
                enrollmentRepository
                        .findByStudentId(
                                student.getStudentId()
                        );

        enrollmentRepository.deleteAll(
                existingEnrollments
        );

        assignStudentToClass(student);
    }
}