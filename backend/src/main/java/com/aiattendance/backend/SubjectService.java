package com.aiattendance.backend;

import com.aiattendance.backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Create or save subject
    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    // Get all subjects
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Get subject by ID
    public Subject getSubjectById(Integer subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(
                        () -> new RuntimeException("Subject not found")
                );
    }

    // Delete subject
    public void deleteSubject(Integer subjectId) {

        if (!subjectRepository.existsById(subjectId)) {
            throw new RuntimeException("Subject not found");
        }

        subjectRepository.deleteById(subjectId);
    }
}