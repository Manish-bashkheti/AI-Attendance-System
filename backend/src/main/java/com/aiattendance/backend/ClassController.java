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
@RequestMapping("/classes")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    // Create class
    @PostMapping
    public Class createClass(@RequestBody Class classEntity) {
        return classService.saveClass(classEntity);
    }

    // Get all classes
    @GetMapping
    public List<Class> getAllClasses() {
        return classService.getAllClasses();
    }

    // Update class
    @PutMapping("/{classId}")
    public Class updateClass(
            @PathVariable Integer classId,
            @RequestBody Class classEntity) {

        Class existingClass =
                classService.getClassById(classId);

        existingClass.setBranch(classEntity.getBranch());
        existingClass.setSemester(classEntity.getSemester());
        existingClass.setSection(classEntity.getSection());

        return classService.saveClass(existingClass);
    }

    // Delete class
    @DeleteMapping("/{classId}")
    public void deleteClass(
            @PathVariable Integer classId) {

        classService.deleteClass(classId);
    }
}