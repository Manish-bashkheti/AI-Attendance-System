package com.aiattendance.backend;

import java.time.LocalTime;

public class TimetableResponse {

    private Integer timetableId;
    private Integer classId;
    private String className;
    private Integer subjectId;
    private String subjectName;
    private Integer teacherId;
    private String teacherName;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    public TimetableResponse() {
    }

    public TimetableResponse(
            Integer timetableId,
            Integer classId,
            String className,
            Integer subjectId,
            String subjectName,
            Integer teacherId,
            String teacherName,
            String dayOfWeek,
            LocalTime startTime,
            LocalTime endTime) {

        this.timetableId = timetableId;
        this.classId = classId;
        this.className = className;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getTimetableId() {
        return timetableId;
    }

    public Integer getClassId() {
        return classId;
    }

    public String getClassName() {
        return className;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}