package com.aiattendance.backend;
import com.aiattendance.backend.repository.StudentRepository;
import java.util.List;
import com.aiattendance.backend.repository.AttendanceRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

   public AttendanceController(
        AttendanceRepository attendanceRepository,
        StudentRepository studentRepository) {

    this.attendanceRepository = attendanceRepository;
    this.studentRepository = studentRepository;
}

    @PostMapping
public Attendance markAttendance(@RequestBody Attendance attendance) {
    return attendanceRepository.save(attendance);
}

@GetMapping
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
                        attendance.getMarkedTime()
                );
            })
            .toList();
}
}