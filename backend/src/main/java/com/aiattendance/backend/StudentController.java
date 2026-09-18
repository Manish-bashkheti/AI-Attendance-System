package com.aiattendance.backend;

import java.util.List;
import com.aiattendance.backend.repository.StudentRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }
    @PutMapping("/{studentId}")
public Student updateStudent(
        @PathVariable Integer studentId,
        @RequestBody Student student) {

    Student existingStudent =
            studentRepository.findById(studentId)
                    .orElseThrow(
                            () -> new RuntimeException("Student not found")
                    );

    existingStudent.setName(student.getName());
    existingStudent.setBranch(student.getBranch());
    existingStudent.setSemester(student.getSemester());

    return studentRepository.save(existingStudent);
}
@DeleteMapping("/{studentId}")
public void deleteStudent(@PathVariable Integer studentId) {

    if (!studentRepository.existsById(studentId)) {
        throw new RuntimeException("Student not found");
    }

    studentRepository.deleteById(studentId);
}
}