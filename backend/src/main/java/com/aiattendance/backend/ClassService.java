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

    public Class saveClass(Class classEntity) {
        return classRepository.save(classEntity);
    }

    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }
}