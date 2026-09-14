package com.aiattendance.backend.repository;

import com.aiattendance.backend.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {
}