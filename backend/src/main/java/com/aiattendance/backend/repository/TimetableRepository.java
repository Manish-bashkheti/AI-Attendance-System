package com.aiattendance.backend.repository;

import java.time.LocalTime;
import java.util.List;

import com.aiattendance.backend.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {

    List<Timetable> findByDayOfWeekAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            String dayOfWeek,
            LocalTime currentTime,
            LocalTime currentTime2);

    List<Timetable> findByDayOfWeekAndTeacherIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            String dayOfWeek,
            Integer teacherId,
            LocalTime currentTime,
            LocalTime currentTime2);

    List<Timetable> findByDayOfWeekAndTeacherId(
            String dayOfWeek,
            Integer teacherId);
}