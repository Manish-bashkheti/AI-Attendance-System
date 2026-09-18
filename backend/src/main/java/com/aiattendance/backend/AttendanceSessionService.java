package com.aiattendance.backend;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aiattendance.backend.repository.AttendanceSessionRepository;
import com.aiattendance.backend.repository.TimetableRepository;
import com.aiattendance.backend.repository.AttendanceRepository;
import com.aiattendance.backend.repository.EnrollmentRepository;

@Service
public class AttendanceSessionService {

    private final AttendanceSessionRepository attendanceSessionRepository;
    private final TimetableRepository timetableRepository;
    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AttendanceSessionService(
            AttendanceSessionRepository attendanceSessionRepository,
            TimetableRepository timetableRepository,
            AttendanceRepository attendanceRepository,
            EnrollmentRepository enrollmentRepository) {

        this.attendanceSessionRepository = attendanceSessionRepository;
        this.timetableRepository = timetableRepository;
        this.attendanceRepository = attendanceRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public AttendanceSession startSession(
            String dayOfWeek,
            LocalTime currentTime) {

        List<Timetable> currentTimetables = timetableRepository
                .findByDayOfWeekAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                        dayOfWeek,
                        currentTime,
                        currentTime);

        if (currentTimetables.isEmpty()) {
            throw new RuntimeException(
                    "No timetable found for the current time.");
        }

        Timetable timetable = currentTimetables.get(0);

        AttendanceSession session = new AttendanceSession();

        session.setClassId(timetable.getClassId());
        session.setSubjectId(timetable.getSubjectId());
        session.setTeacherId(timetable.getTeacherId());

        session.setSessionDate(LocalDate.now());
        session.setStartTime(currentTime);
        session.setStatus("STARTED");

        return attendanceSessionRepository.save(session);
    }

    public AttendanceSession finishSession(Integer sessionId) {

        AttendanceSession session = attendanceSessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance session not found."));

        if ("FINISHED".equals(session.getStatus())) {
            throw new RuntimeException(
                    "Attendance session is already finished.");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByClassId(session.getClassId());

        for (Enrollment enrollment : enrollments) {

            Integer studentId = enrollment.getStudentId();

            boolean attendanceExists = attendanceRepository
                    .existsBySessionIdAndStudentId(
                            sessionId,
                            studentId);

            if (!attendanceExists) {

                Attendance attendance = new Attendance();

                attendance.setStudentId(studentId);
                attendance.setClassId(session.getClassId());
                attendance.setSubjectId(session.getSubjectId());
                attendance.setAttendanceDate(session.getSessionDate());
                attendance.setStatus("ABSENT");
                attendance.setMarkedTime(LocalTime.now());
                attendance.setSessionId(sessionId);

                attendanceRepository.save(attendance);
            }
        }

        session.setEndTime(LocalTime.now());
        session.setStatus("FINISHED");

        return attendanceSessionRepository.save(session);
    }
}