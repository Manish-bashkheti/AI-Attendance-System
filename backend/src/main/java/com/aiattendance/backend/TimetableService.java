package com.aiattendance.backend;

import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aiattendance.backend.repository.ClassRepository;
import com.aiattendance.backend.repository.SubjectRepository;
import com.aiattendance.backend.repository.TeacherRepository;
import com.aiattendance.backend.repository.TimetableRepository;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    public TimetableService(
            TimetableRepository timetableRepository,
            ClassRepository classRepository,
            SubjectRepository subjectRepository,
            TeacherRepository teacherRepository) {

        this.timetableRepository = timetableRepository;
        this.classRepository = classRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
    }

    // Create or save timetable
    public Timetable saveTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    // Get all timetables
    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    // Get timetable by ID
    public Timetable getTimetableById(Integer timetableId) {
        return timetableRepository.findById(timetableId)
                .orElseThrow(
                        () -> new RuntimeException("Timetable not found")
                );
    }

    // Delete timetable
    public void deleteTimetable(Integer timetableId) {

        if (!timetableRepository.existsById(timetableId)) {
            throw new RuntimeException("Timetable not found");
        }

        timetableRepository.deleteById(timetableId);
    }

    // Get current timetable
    public List<TimetableResponse> getCurrentTimetable(
            String dayOfWeek,
            LocalTime currentTime) {

        List<Timetable> timetables =
                timetableRepository
                        .findByDayOfWeekAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                                dayOfWeek,
                                currentTime,
                                currentTime
                        );

        return timetables.stream()
                .map(timetable -> {

                    Class classEntity =
                            classRepository
                                    .findById(timetable.getClassId())
                                    .orElse(null);

                    Subject subject =
                            subjectRepository
                                    .findById(timetable.getSubjectId())
                                    .orElse(null);

                    Teacher teacher =
                            teacherRepository
                                    .findById(timetable.getTeacherId())
                                    .orElse(null);

                    String className =
                            classEntity != null
                                    ? classEntity.getBranch()
                                        + " "
                                        + classEntity.getSemester()
                                        + " "
                                        + classEntity.getSection()
                                    : "Unknown";

                    String subjectName =
                            subject != null
                                    ? subject.getSubjectName()
                                    : "Unknown";

                    String teacherName =
                            teacher != null
                                    ? teacher.getName()
                                    : "Unknown";

                    return new TimetableResponse(
                            timetable.getTimetableId(),
                            timetable.getClassId(),
                            className,
                            timetable.getSubjectId(),
                            subjectName,
                            timetable.getTeacherId(),
                            teacherName,
                            timetable.getDayOfWeek(),
                            timetable.getStartTime(),
                            timetable.getEndTime()
                    );
                })
                .toList();
    }
}