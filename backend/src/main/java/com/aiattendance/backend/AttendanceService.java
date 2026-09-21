package com.aiattendance.backend;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aiattendance.backend.repository.AttendanceRepository;
import com.aiattendance.backend.repository.StudentRepository;
import com.aiattendance.backend.repository.EnrollmentRepository;
import com.aiattendance.backend.repository.AttendanceSessionRepository;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceSessionRepository attendanceSessionRepository;

 public AttendanceService(
        AttendanceRepository attendanceRepository,
        StudentRepository studentRepository,
        EnrollmentRepository enrollmentRepository,
        AttendanceSessionRepository attendanceSessionRepository) {

    this.attendanceRepository = attendanceRepository;
    this.studentRepository = studentRepository;
    this.enrollmentRepository = enrollmentRepository;
    this.attendanceSessionRepository = attendanceSessionRepository;
}

    public Attendance markAttendance(Attendance attendance) {
        AttendanceSession session =
        attendanceSessionRepository
                .findById(attendance.getSessionId())
                .orElseThrow(() ->
                        new RuntimeException("Attendance session not found."));

if (!"STARTED".equals(session.getStatus())) {
    throw new RuntimeException(
            "Attendance session is not active.");
}
boolean alreadyMarked =
        attendanceRepository.existsBySessionIdAndStudentId(
                attendance.getSessionId(),
                attendance.getStudentId()
        );

        if (alreadyMarked) {
            throw new AttendanceAlreadyMarkedException(
                    "Attendance is already marked for this student."
            );
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
        attendance.getMarkedTime(),
        attendance.getSessionId()
);
                })
                .toList();
    }

    public double getAttendancePercentage(Integer studentId) {

        long presentCount =
                attendanceRepository.countByStudentIdAndStatus(
                        studentId,
                        "PRESENT"
                );

        long totalCount =
                attendanceRepository.countByStudentId(studentId);

        if (totalCount == 0) {
            return 0.0;
        }

        return (presentCount * 100.0) / totalCount;
    }
    public void markAbsentStudents(
        Integer classId,
        Integer subjectId,
        java.time.LocalDate attendanceDate) {

    List<Enrollment> enrollments =
            enrollmentRepository.findByClassId(classId);

    for (Enrollment enrollment : enrollments) {

        Integer studentId = enrollment.getStudentId();

        boolean alreadyMarked =
                attendanceRepository
                        .existsByStudentIdAndClassIdAndSubjectIdAndAttendanceDate(
                                studentId,
                                classId,
                                subjectId,
                                attendanceDate);

        if (!alreadyMarked) {

            Attendance attendance = new Attendance();

            attendance.setStudentId(studentId);
            attendance.setClassId(classId);
            attendance.setSubjectId(subjectId);
            attendance.setAttendanceDate(attendanceDate);
            attendance.setStatus("ABSENT");
            attendance.setMarkedTime(java.time.LocalTime.now());

            attendanceRepository.save(attendance);
        }
    }
}
}