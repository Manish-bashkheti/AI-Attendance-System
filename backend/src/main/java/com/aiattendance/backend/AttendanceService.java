package com.aiattendance.backend;

import com.aiattendance.backend.repository.AttendanceRepository;
import com.aiattendance.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public Attendance markAttendance(Attendance attendance) {

        boolean alreadyMarked = attendanceRepository.existsByStudentIdAndClassIdAndSubjectIdAndAttendanceDate(
                attendance.getStudentId(),
                attendance.getClassId(),
                attendance.getSubjectId(),
                attendance.getAttendanceDate());

        if (alreadyMarked) {
            throw new AttendanceAlreadyMarkedException(
                    "Attendance already marked for this student.");
        }

        return attendanceRepository.save(attendance);
    }

    public List<AttendanceResponse> getAllAttendance() {

        List<Attendance> attendanceList = attendanceRepository.findAll();

        return attendanceList.stream()
                .map(attendance -> {

                    Student student = studentRepository
                            .findById(attendance.getStudentId())
                            .orElse(null);

                    String studentName = student != null
                            ? student.getName()
                            : "Unknown";

                    return new AttendanceResponse(
                            attendance.getAttendanceId(),
                            attendance.getStudentId(),
                            studentName,
                            attendance.getClassId(),
                            attendance.getSubjectId(),
                            attendance.getAttendanceDate(),
                            attendance.getStatus(),
                            attendance.getMarkedTime());
                })
                .toList();
    }
}