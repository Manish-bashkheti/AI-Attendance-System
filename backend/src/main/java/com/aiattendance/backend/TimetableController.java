package com.aiattendance.backend;

import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping
    public Timetable createTimetable(
            @RequestBody Timetable timetable) {

        return timetableService.saveTimetable(timetable);
    }

    @GetMapping
    public List<Timetable> getAllTimetables() {

        return timetableService.getAllTimetables();
    }

    @GetMapping("/current")
    public List<TimetableResponse> getCurrentTimetable(
            @RequestParam String dayOfWeek,
            @RequestParam String time) {

        return timetableService.getCurrentTimetable(
                dayOfWeek,
                LocalTime.parse(time)
        );
    }

    @GetMapping("/teacher/{teacherId}")
    public List<TimetableResponse> getTeacherDayTimetable(
            @PathVariable Integer teacherId,
            @RequestParam String dayOfWeek) {

        return timetableService.getTeacherDayTimetable(
                teacherId,
                dayOfWeek
        );
    }

    @PutMapping("/{timetableId}")
    public Timetable updateTimetable(
            @PathVariable Integer timetableId,
            @RequestBody Timetable timetable) {

        Timetable existingTimetable =
                timetableService.getTimetableById(timetableId);

        existingTimetable.setClassId(timetable.getClassId());
        existingTimetable.setSubjectId(timetable.getSubjectId());
        existingTimetable.setTeacherId(timetable.getTeacherId());
        existingTimetable.setDayOfWeek(timetable.getDayOfWeek());
        existingTimetable.setStartTime(timetable.getStartTime());
        existingTimetable.setEndTime(timetable.getEndTime());

        return timetableService.saveTimetable(existingTimetable);
    }

    @DeleteMapping("/{timetableId}")
    public void deleteTimetable(
            @PathVariable Integer timetableId) {

        timetableService.deleteTimetable(timetableId);
    }
}