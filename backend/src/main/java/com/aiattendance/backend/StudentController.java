package com.aiattendance.backend;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiattendance.backend.repository.ClassRepository;
import com.aiattendance.backend.repository.EnrollmentRepository;
import com.aiattendance.backend.repository.StudentRepository;
import com.aiattendance.backend.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public StudentController(
            StudentRepository studentRepository,
            ClassRepository classRepository,
            EnrollmentRepository enrollmentRepository,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @GetMapping("/{studentId}")
    public Student getStudent(
            @PathVariable Integer studentId) {

        return studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found."
                        )
                );
    }

    // =========================================================
    // ADD NEW STUDENT
    // =========================================================

    @PostMapping
    public Student addStudent(
            @RequestBody Student student) {

        System.out.println("=================================");
        System.out.println("ADD STUDENT REQUEST");
        System.out.println("Student ID: " + student.getStudentId());
        System.out.println("Name: " + student.getName());
        System.out.println("Email: " + student.getEmail());
        System.out.println("DOB: " + student.getDob());
        System.out.println("Course: " + student.getCourse());
        System.out.println("Branch: " + student.getBranch());
        System.out.println("Semester: " + student.getSemester());
        System.out.println("Section: " + student.getSection());
        System.out.println("=================================");

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (student.getStudentId() == null) {
            throw new RuntimeException(
                    "Student ID is required."
            );
        }

        if (studentRepository.existsById(
                student.getStudentId())) {

            throw new RuntimeException(
                    "Student ID already exists."
            );
        }

        if (student.getName() == null
                || student.getName().isBlank()) {

            throw new RuntimeException(
                    "Student name is required."
            );
        }

        if (student.getEmail() == null
                || student.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Student email is required."
            );
        }

        if (student.getDob() == null
                || student.getDob().isBlank()) {

            throw new RuntimeException(
                    "Date of birth is required."
            );
        }

        // DOB must be DDMMYYYY
        if (!student.getDob().matches("\\d{8}")) {

            throw new RuntimeException(
                    "DOB must be in DDMMYYYY format."
            );
        }

        if (student.getCourse() == null
                || student.getCourse().isBlank()) {

            throw new RuntimeException(
                    "Course is required."
            );
        }

        if (student.getBranch() == null
                || student.getBranch().isBlank()) {

            throw new RuntimeException(
                    "Branch is required."
            );
        }

        if (student.getSection() == null
                || student.getSection().isBlank()) {

            throw new RuntimeException(
                    "Section is required."
            );
        }

        // -----------------------------------------------------
        // DOB = DEFAULT PASSWORD
        // -----------------------------------------------------

        String defaultPassword =
                student.getDob();

        String hashedPassword =
                passwordEncoder.encode(
                        defaultPassword
                );

        student.setPasswordHash(
                hashedPassword
        );

        // -----------------------------------------------------
        // SAVE STUDENT
        // -----------------------------------------------------

        Student savedStudent =
                studentRepository.save(student);

        System.out.println(
                "STUDENT SAVED: "
                        + savedStudent.getStudentId()
        );

        // -----------------------------------------------------
        // CREATE USER ACCOUNT
        // -----------------------------------------------------

        createUserForStudent(
                savedStudent
        );

        // -----------------------------------------------------
        // ASSIGN CLASS
        // -----------------------------------------------------

        assignStudentToClass(
                savedStudent
        );

        return savedStudent;
    }

    // =========================================================
    // CREATE USER ACCOUNT FOR EXISTING STUDENT
    // =========================================================

    @PostMapping("/{studentId}/create-user")
    public String createStudentUser(
            @PathVariable Integer studentId) {

        System.out.println(
                "================================="
        );

        System.out.println(
                "CREATE USER REQUEST"
        );

        System.out.println(
                "Student ID: " + studentId
        );

        System.out.println(
                "================================="
        );

        // -----------------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------------

        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found."
                                )
                        );

        // -----------------------------------------------------
        // CHECK USER ALREADY EXISTS
        // -----------------------------------------------------

        if (userRepository
                .findByStudentId(studentId)
                .isPresent()) {

            return "User already exists for student ID: "
                    + studentId;
        }

        // -----------------------------------------------------
        // CHECK DOB
        // -----------------------------------------------------

        if (student.getDob() == null
                || student.getDob().isBlank()) {

            throw new RuntimeException(
                    "DOB is missing for this student."
            );
        }

        // -----------------------------------------------------
        // CREATE USER
        // -----------------------------------------------------

        User user = new User();

        user.setEmail(
                student.getEmail()
        );

        user.setStudentId(
                student.getStudentId()
        );

        user.setTeacherId(null);

        user.setRole(
                "STUDENT"
        );

        // DOB becomes initial password
        String hashedPassword =
                passwordEncoder.encode(
                        student.getDob()
                );

        user.setPasswordHash(
                hashedPassword
        );

        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        User savedUser =
                userRepository.save(user);

        System.out.println(
                "STUDENT USER CREATED"
        );

        System.out.println(
                "User ID: "
                        + savedUser.getUserId()
        );

        System.out.println(
                "Student ID: "
                        + savedUser.getStudentId()
        );

        return "Student user created successfully.";
    }

    // =========================================================
    // UPDATE STUDENT
    // =========================================================

    @PutMapping("/{studentId}")
    public Student updateStudent(
            @PathVariable Integer studentId,
            @RequestBody Student student) {

        Student existingStudent =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found."
                                )
                        );

        // -----------------------------------------------------
        // UPDATE STUDENT DETAILS
        // -----------------------------------------------------

        existingStudent.setName(
                student.getName()
        );

        existingStudent.setEmail(
                student.getEmail()
        );

        existingStudent.setDob(
                student.getDob()
        );

        existingStudent.setCourse(
                student.getCourse()
        );

        existingStudent.setBranch(
                student.getBranch()
        );

        existingStudent.setSemester(
                student.getSemester()
        );

        existingStudent.setSection(
                student.getSection()
        );

        // -----------------------------------------------------
        // SAVE STUDENT
        // -----------------------------------------------------

        Student updatedStudent =
                studentRepository.save(
                        existingStudent
                );

        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByStudentId(
                                studentId
                        )
                        .orElse(null);

        // -----------------------------------------------------
        // CREATE USER IF MISSING
        // -----------------------------------------------------

        if (user == null) {

            System.out.println(
                    "USER NOT FOUND."
            );

            System.out.println(
                    "CREATING STUDENT USER..."
            );

            if (updatedStudent.getDob() == null
                    || updatedStudent.getDob().isBlank()) {

                throw new RuntimeException(
                        "DOB is required to create student user."
                );
            }

            user = new User();

            user.setStudentId(
                    studentId
            );

            user.setTeacherId(null);

            user.setRole(
                    "STUDENT"
            );

            String hashedPassword =
                    passwordEncoder.encode(
                            updatedStudent.getDob()
                    );

            user.setPasswordHash(
                    hashedPassword
            );
        }

        // Always update email
        user.setEmail(
                updatedStudent.getEmail()
        );

        User savedUser =
                userRepository.save(user);

        System.out.println(
                "STUDENT USER SAVED/UPDATED"
        );

        System.out.println(
                "User ID: "
                        + savedUser.getUserId()
        );

        // -----------------------------------------------------
        // UPDATE ENROLLMENT
        // -----------------------------------------------------

        updateStudentEnrollment(
                updatedStudent
        );

        return updatedStudent;
    }

    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @DeleteMapping("/{studentId}")
    public void deleteStudent(
            @PathVariable Integer studentId) {

        if (!studentRepository.existsById(
                studentId)) {

            throw new RuntimeException(
                    "Student not found."
            );
        }

        // -----------------------------------------------------
        // DELETE ENROLLMENTS
        // -----------------------------------------------------

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudentId(
                                studentId
                        );

        enrollmentRepository.deleteAll(
                enrollments
        );

        // -----------------------------------------------------
        // DELETE USER
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByStudentId(
                                studentId
                        )
                        .orElse(null);

        if (user != null) {

            userRepository.delete(user);

            System.out.println(
                    "STUDENT USER DELETED: "
                            + studentId
            );
        }

        // -----------------------------------------------------
        // DELETE STUDENT
        // -----------------------------------------------------

        studentRepository.deleteById(
                studentId
        );

        System.out.println(
                "STUDENT DELETED: "
                        + studentId
        );
    }

    // =========================================================
    // CREATE USER HELPER
    // =========================================================

    private User createUserForStudent(
            Student student) {

        User user = new User();

        user.setEmail(
                student.getEmail()
        );

        user.setStudentId(
                student.getStudentId()
        );

        user.setTeacherId(null);

        user.setRole(
                "STUDENT"
        );

        user.setPasswordHash(
                student.getPasswordHash()
        );

        System.out.println(
                "CREATING STUDENT USER"
        );

        System.out.println(
                "User Email: "
                        + user.getEmail()
        );

        System.out.println(
                "User Role: "
                        + user.getRole()
        );

        System.out.println(
                "User Student ID: "
                        + user.getStudentId()
        );

        User savedUser =
                userRepository.save(user);

        System.out.println(
                "STUDENT USER SAVED"
        );

        System.out.println(
                "Generated User ID: "
                        + savedUser.getUserId()
        );

        return savedUser;
    }

    // =========================================================
    // ASSIGN STUDENT TO CLASS
    // =========================================================

    private void assignStudentToClass(
            Student student) {

        System.out.println(
                "FINDING CLASS..."
        );

        System.out.println(
                "Branch: "
                        + student.getBranch()
        );

        System.out.println(
                "Semester: "
                        + student.getSemester()
        );

        System.out.println(
                "Section: "
                        + student.getSection()
        );

        Class matchingClass =
                classRepository
                        .findByBranchAndSemesterAndSection(
                                student.getBranch(),
                                student.getSemester(),
                                student.getSection()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No class found for "
                                                + student.getBranch()
                                                + " Semester "
                                                + student.getSemester()
                                                + " Section "
                                                + student.getSection()
                                )
                        );

        // -----------------------------------------------------
        // CHECK EXISTING ENROLLMENT
        // -----------------------------------------------------

        boolean alreadyEnrolled =
                enrollmentRepository
                        .existsByStudentIdAndClassId(
                                student.getStudentId(),
                                matchingClass.getClassId()
                        );

        if (!alreadyEnrolled) {

            Enrollment enrollment =
                    new Enrollment();

            enrollment.setStudentId(
                    student.getStudentId()
            );

            enrollment.setClassId(
                    matchingClass.getClassId()
            );

            enrollmentRepository.save(
                    enrollment
            );

            System.out.println(
                    "STUDENT ENROLLED SUCCESSFULLY"
            );
        }
    }

    // =========================================================
    // UPDATE ENROLLMENT
    // =========================================================

    private void updateStudentEnrollment(
            Student student) {

        List<Enrollment> existingEnrollments =
                enrollmentRepository
                        .findByStudentId(
                                student.getStudentId()
                        );

        enrollmentRepository.deleteAll(
                existingEnrollments
        );

        assignStudentToClass(
                student
        );
    }
}