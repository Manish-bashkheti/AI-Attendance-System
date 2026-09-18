package com.aiattendance.backend;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aiattendance.backend.repository.TimetableRepository;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;

    public TimetableService(TimetableRepository timetableRepository) {
        this.timetableRepository = timetableRepository;
    }

    public Timetable saveTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }
}