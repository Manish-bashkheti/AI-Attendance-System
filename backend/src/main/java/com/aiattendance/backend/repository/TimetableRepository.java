package com.aiattendance.backend.repository;

import com.aiattendance.backend.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {
}