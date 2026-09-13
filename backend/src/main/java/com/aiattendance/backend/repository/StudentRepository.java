package com.aiattendance.backend.repository;

import com.aiattendance.backend.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}