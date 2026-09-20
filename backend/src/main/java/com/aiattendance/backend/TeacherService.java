package com.aiattendance.backend;

import com.aiattendance.backend.repository.TeacherRepository;
import com.aiattendance.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(
            TeacherRepository teacherRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
    public ResponseEntity<?> createTeacherAccount(
        Integer teacherId) {

    Teacher teacher = teacherRepository
            .findById(teacherId)
            .orElseThrow(
                    () -> new RuntimeException("Teacher not found")
            );

    if (userRepository
            .findByEmail(teacher.getEmail())
            .isPresent()) {

        return ResponseEntity
                .badRequest()
                .body("A login account already exists for this teacher.");
    }

    String temporaryPassword = "Teacher@123";

    User user = new User();

    user.setEmail(teacher.getEmail());
    user.setPasswordHash(
            passwordEncoder.encode(temporaryPassword)
    );
    user.setRole("TEACHER");
    user.setTeacherId(teacher.getTeacherId());

    userRepository.save(user);

    return ResponseEntity.ok(
            "Teacher account created successfully. "
            + "Temporary password: "
            + temporaryPassword
    );
}
}