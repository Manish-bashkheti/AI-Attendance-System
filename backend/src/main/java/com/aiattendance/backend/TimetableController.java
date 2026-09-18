package com.aiattendance.backend;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalTime;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping
    public Timetable createTimetable(@RequestBody Timetable timetable) {
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
}