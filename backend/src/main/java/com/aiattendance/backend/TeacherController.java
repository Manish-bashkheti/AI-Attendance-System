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

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final TeacherService teacherService;

    public TeacherController(
            TeacherRepository teacherRepository,
            TeacherService teacherService) {

        this.teacherRepository = teacherRepository;
        this.teacherService = teacherService;
    }

    // Get all teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
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
                                () -> new RuntimeException("Teacher not found")
                        );

        existingTeacher.setName(teacher.getName());
        existingTeacher.setDateOfBirth(teacher.getDateOfBirth());
        existingTeacher.setGender(teacher.getGender());
        existingTeacher.setPhone(teacher.getPhone());
        existingTeacher.setEmail(teacher.getEmail());
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

        return teacherRepository.save(existingTeacher);
    }

    // Delete teacher
    @DeleteMapping("/{teacherId}")
    public void deleteTeacher(
            @PathVariable Integer teacherId) {

        if (!teacherRepository.existsById(teacherId)) {
            throw new RuntimeException("Teacher not found");
        }

        teacherRepository.deleteById(teacherId);
    }

    // Create teacher login account
    @PostMapping("/{teacherId}/create-account")
    public ResponseEntity<?> createTeacherAccount(
            @PathVariable Integer teacherId) {

        return teacherService.createTeacherAccount(teacherId);
    }
}