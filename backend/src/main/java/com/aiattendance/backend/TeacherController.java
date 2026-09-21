package com.aiattendance.backend;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiattendance.backend.repository.TeacherRepository;
import com.aiattendance.backend.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final TeacherService teacherService;
    private final UserRepository userRepository;

    public TeacherController(
            TeacherRepository teacherRepository,
            TeacherService teacherService,
            UserRepository userRepository) {

        this.teacherRepository = teacherRepository;
        this.teacherService = teacherService;
        this.userRepository = userRepository;
    }

    // Get all teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // Get teacher by ID
    @GetMapping("/{teacherId}")
    public Teacher getTeacherById(
            @PathVariable Integer teacherId) {

        return teacherRepository
                .findById(teacherId)
                .orElseThrow(
                        () -> new RuntimeException("Teacher not found")
                );
    }

    // Add teacher
    @PostMapping
    public Teacher addTeacher(@RequestBody Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    // Update teacher
    @PutMapping("/{teacherId}")
    public Teacher updateTeacher(
            @PathVariable Integer teacherId,
            @RequestBody Teacher teacher) {

        Teacher existingTeacher =
                teacherRepository.findById(teacherId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Teacher not found"
                                )
                        );

        String oldEmail = existingTeacher.getEmail();
        String newEmail = teacher.getEmail();

        existingTeacher.setName(teacher.getName());
        existingTeacher.setDateOfBirth(teacher.getDateOfBirth());
        existingTeacher.setGender(teacher.getGender());
        existingTeacher.setPhone(teacher.getPhone());
        existingTeacher.setEmail(newEmail);
        existingTeacher.setAddress(teacher.getAddress());
        existingTeacher.setDepartment(teacher.getDepartment());

        existingTeacher.setUgQualification(
                teacher.getUgQualification()
        );

        existingTeacher.setUgSpecialization(
                teacher.getUgSpecialization()
        );

        existingTeacher.setPgQualification(
                teacher.getPgQualification()
        );

        existingTeacher.setPgSpecialization(
                teacher.getPgSpecialization()
        );

        existingTeacher.setDoctorate(
                teacher.getDoctorate()
        );

        existingTeacher.setCertifications(
                teacher.getCertifications()
        );

        existingTeacher.setExperience(
                teacher.getExperience()
        );

        existingTeacher.setJoiningDate(
                teacher.getJoiningDate()
        );

        Teacher savedTeacher =
                teacherRepository.save(existingTeacher);

        // Keep teacher login email synchronized.
        if (oldEmail != null
                && newEmail != null
                && !oldEmail.equals(newEmail)) {

            userRepository.findByEmail(oldEmail)
                    .ifPresent(user -> {
                        user.setEmail(newEmail);
                        userRepository.save(user);
                    });
        }

        return savedTeacher;
    }

    // Delete teacher
    @DeleteMapping("/{teacherId}")
    public ResponseEntity<?> deleteTeacher(
            @PathVariable Integer teacherId) {

        if (!teacherRepository.existsById(teacherId)) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Delete linked teacher login account first.
        userRepository.findByTeacherId(teacherId)
                .ifPresent(user -> {
                    userRepository.delete(user);
                });

        // Delete teacher profile.
        teacherRepository.deleteById(teacherId);

        return ResponseEntity.ok(
                "Teacher and linked login account deleted successfully."
        );
    }

    // Create teacher login account
    @PostMapping("/{teacherId}/create-account")
    public ResponseEntity<?> createTeacherAccount(
            @PathVariable Integer teacherId) {

        return teacherService.createTeacherAccount(teacherId);
    }
}