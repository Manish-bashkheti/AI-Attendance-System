package com.aiattendance.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiattendance.backend.Class;

public interface ClassRepository extends JpaRepository<Class, Integer> {

    Optional<Class> findByBranchAndSemesterAndSection(
            String branch,
            Integer semester,
            String section
    );
}