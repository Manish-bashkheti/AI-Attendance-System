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

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // Create subject
    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectService.saveSubject(subject);
    }

    // Get all subjects
    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // Update subject
    @PutMapping("/{subjectId}")
    public Subject updateSubject(
            @PathVariable Integer subjectId,
            @RequestBody Subject subject) {

        Subject existingSubject =
                subjectService.getSubjectById(subjectId);

        existingSubject.setSubjectName(subject.getSubjectName());
        existingSubject.setSemester(subject.getSemester());

        return subjectService.saveSubject(existingSubject);
    }

    // Delete subject
    @DeleteMapping("/{subjectId}")
    public void deleteSubject(
            @PathVariable Integer subjectId) {

        subjectService.deleteSubject(subjectId);
    }
}