package com.aiattendance.backend;

import java.io.Serializable;
import java.util.Objects;

public class EnrollmentId implements Serializable {

    private Integer studentId;
    private Integer classId;

    public EnrollmentId() {
    }

    public EnrollmentId(Integer studentId, Integer classId) {
        this.studentId = studentId;
        this.classId = classId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof EnrollmentId)) {
            return false;
        }

        EnrollmentId that = (EnrollmentId) o;

        return Objects.equals(studentId, that.studentId)
                && Objects.equals(classId, that.classId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, classId);
    }
}