package com.aiattendance.backend.repository;

import com.aiattendance.backend.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
}