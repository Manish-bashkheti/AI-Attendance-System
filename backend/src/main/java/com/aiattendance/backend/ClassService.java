package com.aiattendance.backend;

import com.aiattendance.backend.repository.ClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    // Create or save class
    public Class saveClass(Class classEntity) {
        return classRepository.save(classEntity);
    }

    // Get all classes
    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    // Get class by ID
    public Class getClassById(Integer classId) {
        return classRepository.findById(classId)
                .orElseThrow(
                        () -> new RuntimeException("Class not found")
                );
    }

    // Delete class
    public void deleteClass(Integer classId) {

        if (!classRepository.existsById(classId)) {
            throw new RuntimeException("Class not found");
        }

        classRepository.deleteById(classId);
    }
}