package com.aiattendance.backend;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teacherId;

    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String department;

    private String ugQualification;
    private String ugSpecialization;

    private String pgQualification;
    private String pgSpecialization;

    private String doctorate;
    private String certifications;
    private Integer experience;
    private LocalDate joiningDate;

    public Teacher() {
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getUgQualification() {
        return ugQualification;
    }

    public void setUgQualification(String ugQualification) {
        this.ugQualification = ugQualification;
    }

    public String getUgSpecialization() {
        return ugSpecialization;
    }

    public void setUgSpecialization(String ugSpecialization) {
        this.ugSpecialization = ugSpecialization;
    }

    public String getPgQualification() {
        return pgQualification;
    }

    public void setPgQualification(String pgQualification) {
        this.pgQualification = pgQualification;
    }

    public String getPgSpecialization() {
        return pgSpecialization;
    }

    public void setPgSpecialization(String pgSpecialization) {
        this.pgSpecialization = pgSpecialization;
    }

    public String getDoctorate() {
        return doctorate;
    }

    public void setDoctorate(String doctorate) {
        this.doctorate = doctorate;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }
}