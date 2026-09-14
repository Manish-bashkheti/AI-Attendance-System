package com.aiattendance.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "enrollments")
@IdClass(EnrollmentId.class)
public class Enrollment {

    @Id
    private Integer studentId;

    @Id
    private Integer classId;

    public Enrollment() {
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }
}