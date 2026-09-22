import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function TeacherAttendance() {
  const teacherId = localStorage.getItem("teacherId");

  const [teacher, setTeacher] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [session, setSession] = useState(null);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadTeacher();
    loadTodayClasses();

    const interval = setInterval(() => {
      if (!session) {
        loadTodayClasses();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

  const getTodayName = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const loadTeacher = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${teacherId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load teacher.");
      }

      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      console.error("Failed to load teacher:", err);
    }
  };

  /*
   * Find the class that is running RIGHT NOW.
   * Upcoming and completed classes are not considered current.
   */
  const findCurrentClass = (classes) => {
    const now = new Date();

    return classes.find((item) => {
      if (!item.startTime || !item.endTime) {
        return false;
      }

      const [startHour, startMinute] = item.startTime
        .split(":")
        .map(Number);

      const [endHour, endMinute] = item.endTime
        .split(":")
        .map(Number);

      const start = new Date();
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMinute, 0, 0);

      return now >= start && now < end;
    });
  };

  /*
   * Load today's timetable.
   *
   * Important:
   * We DO NOT select the first class automatically.
   * Only the currently running class can be selected.
   */
  const loadTodayClasses = async () => {
    setLoading(true);
    setError("");

    try {
      const today = getTodayName();

      const response = await fetch(
        `${API_BASE_URL}/timetables/teacher/${teacherId}?dayOfWeek=${today}`
      );

      if (!response.ok) {
        throw new Error("Failed to load timetable.");
      }

      const data = await response.json();

      const sorted = [...data].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      setTodayClasses(sorted);

      const current = findCurrentClass(sorted);

      if (current) {
        setSelectedClass(current);
        setError("");
      } else {
        setSelectedClass(null);
        setError(
          "No timetable found for this teacher at the current time."
        );
      }
    } catch (err) {
      console.error("Failed to load timetable:", err);

      setTodayClasses([]);
      setSelectedClass(null);

      setError("Unable to load today's classes.");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classId) => {
    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/enrollments/class/${classId}/students`
      );

      if (!response.ok) {
        throw new Error("Failed to load enrolled students.");
      }

      const studentList = await response.json();

      setStudents(studentList);

      const initialAttendance = {};

      studentList.forEach((student) => {
        initialAttendance[student.studentId] = "ABSENT";
      });

      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Failed to load enrolled students:", err);

      setStudents([]);
      setAttendance({});

      setError("Unable to load enrolled students.");
    }
  };

  const startAttendance = async () => {
    /*
     * Double-check the current class from the latest timetable.
     * This prevents starting attendance for an upcoming/completed class.
     */
    const current = findCurrentClass(todayClasses);

    if (!current) {
      setSelectedClass(null);
      setError(
        "There is no active class at the current time."
      );
      return;
    }

    if (
      !selectedClass ||
      selectedClass.timetableId !== current.timetableId
    ) {
      setSelectedClass(current);
      setError(
        "Only the currently running class can start attendance."
      );
      return;
    }

    setStarting(true);
    setError("");
    setMessage("");

    try {
      const today = getTodayName();

      const now = new Date();

      const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");

      const response = await fetch(
        `${API_BASE_URL}/attendance-sessions/start?dayOfWeek=${today}&time=${currentTime}&teacherId=${teacherId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text || "Unable to start attendance."
        );
      }

      const data = await response.json();

      setSession(data);

      await loadStudents(data.classId);

      setMessage(
        "Attendance session started successfully."
      );
    } catch (err) {
      console.error("Failed to start attendance:", err);

      setError(
        err.message || "Unable to start attendance."
      );
    } finally {
      setStarting(false);
    }
  };

  const markStudent = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

 const finishAttendance = async () => {
  if (!session) {
    setError("No active attendance session.");
    return;
  }

  setFinishing(true);
  setError("");
  setMessage("");

  try {
    /*
     * First save all students marked PRESENT.
     * Students marked ABSENT are not sent here.
     * Backend will mark remaining enrolled students ABSENT
     * when the session is finished.
     */
    const presentStudents = students.filter(
      (student) =>
        attendance[student.studentId] === "PRESENT"
    );

    for (const student of presentStudents) {
      const attendanceResponse = await fetch(
        `${API_BASE_URL}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
  studentId: student.studentId,
  classId: session.classId,
  subjectId: session.subjectId,
  status: "PRESENT",
  attendanceDate: new Date()
    .toISOString()
    .split("T")[0],
  markedTime: new Date().toTimeString().split(" ")[0],
  sessionId: session.sessionId,
}),
        }
      );

      /*
       * 409 means the student was already marked PRESENT
       * by AI recognition. We can safely continue.
       */
      if (
        !attendanceResponse.ok &&
        attendanceResponse.status !== 409
      ) {
        const text = await attendanceResponse.text();

        throw new Error(
          text ||
            `Failed to save attendance for student ${student.studentId}.`
        );
      }
    }

    /*
     * Now finish the session.
     *
     * Backend will automatically create ABSENT records
     * for enrolled students who do not already have an
     * attendance record for this session.
     */
    const finishResponse = await fetch(
      `${API_BASE_URL}/attendance-sessions/${session.sessionId}/finish`,
      {
        method: "POST",
      }
    );

    if (!finishResponse.ok) {
      const text = await finishResponse.text();

      throw new Error(
        text || "Unable to finish attendance."
      );
    }

    const finishedSession =
      await finishResponse.json();

    setSession(finishedSession);

    /*
     * Reload attendance records for this session.
     */
    const attendanceResponse = await fetch(
      `${API_BASE_URL}/attendance`
    );

    if (attendanceResponse.ok) {
      const allRecords =
        await attendanceResponse.json();

      const sessionRecords = allRecords.filter(
        (record) =>
          record.sessionId ===
          finishedSession.sessionId
      );

      const finalAttendance = {};

      sessionRecords.forEach((record) => {
        finalAttendance[record.studentId] =
          record.status;
      });

      setAttendance(finalAttendance);
    }

    setShowPreview(true);

    setMessage(
      "Attendance session finished. Please verify the attendance."
    );
  } catch (err) {
    console.error(
      "Failed to finish attendance:",
      err
    );

    setError(
      err.message ||
        "Unable to finish attendance."
    );
  } finally {
    setFinishing(false);
  }
};

  const getPresentCount = () => {
    return Object.values(attendance).filter(
      (status) => status === "PRESENT"
    ).length;
  };

  const getAbsentCount = () => {
    return Object.values(attendance).filter(
      (status) => status === "ABSENT"
    ).length;
  };

  /*
   * Convert backend time like 10:05:00
   * into 10:05 AM.
   */
  const formatTime = (time) => {
    if (!time) {
      return "--";
    }

    const [hour, minute] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const goDashboard = () => {
    window.location.href = "/teacher";
  };

  return (
    <div style={styles.page}>

      {/* ================= SIDEBAR ================= */}

      <aside style={styles.sidebar}>

        <div style={styles.logoArea}>

          <div style={styles.logoIcon}>
            AI
          </div>

          <div>
            <h2 style={styles.logoTitle}>
              AI AttendEase
            </h2>

            <p style={styles.logoSubtitle}>
              Teacher Portal
            </p>
          </div>

        </div>

        <nav style={styles.navigation}>

          <div
            style={styles.navItem}
            onClick={() =>
              (window.location.href = "/teacher")
            }
          >
            <span>⌂</span>
            Dashboard
          </div>

          <div
            style={styles.navItem}
            onClick={() =>
              (window.location.href =
                "/teacher/timetable")
            }
          >
            <span>▣</span>
            My Timetable
          </div>

          <div
            style={{
              ...styles.navItem,
              ...styles.activeNavItem,
            }}
          >
            <span>✓</span>
            Attendance
          </div>

          <div
            style={styles.navItem}
            onClick={() =>
              (window.location.href =
                "/teacher/attendance-history")
            }
          >
            <span>◷</span>
            Attendance History
          </div>

          <div
            style={styles.navItem}
            onClick={() =>
              (window.location.href =
                "/teacher/profile")
            }
          >
            <span>◉</span>
            My Profile
          </div>

        </nav>

        <div style={styles.sidebarBottom}>

          <div style={styles.helpBox}>

            <div style={styles.helpIcon}>
              ?
            </div>

            <div>

              <strong style={styles.helpTitle}>
                Need Help?
              </strong>

              <p style={styles.helpText}>
                Contact your administrator
              </p>

            </div>

          </div>

          <button
            style={styles.logoutButton}
            onClick={() => {
              localStorage.clear();

              window.location.href =
                "/teacher-login";
            }}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main style={styles.main}>

        {/* HEADER */}

        <header style={styles.header}>

          <div>

            <button
              onClick={goDashboard}
              style={styles.backButton}
            >
              ← Back to Dashboard
            </button>

            <h1 style={styles.heading}>
              Take Attendance
            </h1>

            <p style={styles.subHeading}>
              Start a class session and manage
              student attendance.
            </p>

          </div>

          <div style={styles.teacherBox}>

            <div style={styles.avatar}>
              {teacher?.name
                ? teacher.name
                    .charAt(0)
                    .toUpperCase()
                : "T"}
            </div>

            <div>

              <strong style={styles.teacherName}>
                {teacher?.name || "Teacher"}
              </strong>

              <p style={styles.teacherRole}>
                Teacher ID: {teacherId}
              </p>

            </div>

          </div>

        </header>


        {/* LOADING */}

        {loading && (
          <div style={styles.infoMessage}>
            Loading today's timetable...
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}


        {/* ================= CURRENT CLASS ================= */}

        <section style={styles.classCard}>

          <div style={styles.classLeft}>

            <div style={styles.classIcon}>
              📚
            </div>

            <div>

              <p style={styles.smallLabel}>
                {selectedClass
                  ? "CURRENT CLASS"
                  : "NO ACTIVE CLASS"}
              </p>

              <h2 style={styles.classTitle}>
                {selectedClass?.subjectName ||
                  "No class selected"}
              </h2>

              <p style={styles.classDetails}>

                {selectedClass?.className ||
                  "There is no active class right now."}

                {selectedClass && (
                  <>
                    {" • "}

                    {formatTime(
                      selectedClass.startTime
                    )}

                    {" - "}

                    {formatTime(
                      selectedClass.endTime
                    )}
                  </>
                )}

              </p>

            </div>

          </div>


          <div style={styles.classRight}>

            {!session ? (

              <button
                style={{
                  ...styles.startButton,
                  ...(starting || !selectedClass
                    ? styles.disabledStartButton
                    : {}),
                }}
                onClick={startAttendance}
                disabled={
                  starting || !selectedClass
                }
              >
                {starting
                  ? "Starting..."
                  : "▶ Start Attendance"}
              </button>

            ) : (

              <div style={styles.sessionActive}>

                <span style={styles.liveDot}>
                </span>

                Attendance Session Active

              </div>

            )}

          </div>

        </section>


        {/* ================= CLASS SELECTOR ================= */}

        {!session &&
          todayClasses.length > 0 && (

            <section style={styles.selectorCard}>

              <div style={styles.sectionHeader}>

                <div>

                  <h2 style={styles.sectionTitle}>
                    Today's Classes
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Only the currently running class
                    can be selected for attendance.
                  </p>

                </div>

              </div>


              <div style={styles.classGrid}>

                {todayClasses.map((item) => {

                  const current =
                    findCurrentClass(
                      todayClasses
                    );

                  const isCurrent =
                    current?.timetableId ===
                    item.timetableId;

                  const selected =
                    selectedClass?.timetableId ===
                    item.timetableId;

                  return (
                    <button
                      key={item.timetableId}
                      disabled={!isCurrent}
                      onClick={() => {
                        if (isCurrent) {
                          setSelectedClass(item);
                        }
                      }}
                      style={{
                        ...styles.classOption,

                        ...(selected
                          ? styles.selectedClassOption
                          : {}),

                        ...(!isCurrent
                          ? styles.disabledClassOption
                          : {}),
                      }}
                    >

                      <div style={styles.optionTime}>
                        {formatTime(
                          item.startTime
                        )}

                        {" - "}

                        {formatTime(
                          item.endTime
                        )}
                      </div>

                      <div style={styles.optionSubject}>
                        {item.subjectName}
                      </div>

                      <div style={styles.optionClass}>
                        {item.className}
                      </div>

                      <div style={styles.optionStatus}>

                        {isCurrent
                          ? "CURRENT"
                          : new Date() <
                            (() => {
                              const [
                                h,
                                m,
                              ] =
                                item.startTime
                                  .split(":")
                                  .map(Number);

                              const date =
                                new Date();

                              date.setHours(
                                h,
                                m,
                                0,
                                0
                              );

                              return date;
                            })()
                          ? "UPCOMING"
                          : "COMPLETED"}

                      </div>

                      {selected && (
                        <div
                          style={
                            styles.selectedMark
                          }
                        >
                          ✓
                        </div>
                      )}

                    </button>
                  );
                })}

              </div>

            </section>
          )}


        {/* ================= ATTENDANCE ================= */}

        {session && !showPreview && (

          <section style={styles.attendanceCard}>

            <div style={styles.attendanceHeader}>

              <div>

                <h2 style={styles.sectionTitle}>
                  Student Attendance
                </h2>

                <p style={styles.sectionSubtitle}>
                  Mark students manually. AI recognition
                  will also be connected here.
                </p>

              </div>

              <div style={styles.liveIndicator}>

                <span style={styles.liveDot}>
                </span>

                LIVE SESSION

              </div>

            </div>


            {/* STATS */}

            <div style={styles.statsGrid}>

              <div style={styles.statCard}>

                <span style={styles.statLabel}>
                  TOTAL STUDENTS
                </span>

                <strong style={styles.statValue}>
                  {students.length}
                </strong>

              </div>


              <div style={styles.statCard}>

                <span style={styles.statLabel}>
                  PRESENT
                </span>

                <strong
                  style={{
                    ...styles.statValue,
                    color: "#16a34a",
                  }}
                >
                  {getPresentCount()}
                </strong>

              </div>


              <div style={styles.statCard}>

                <span style={styles.statLabel}>
                  ABSENT
                </span>

                <strong
                  style={{
                    ...styles.statValue,
                    color: "#dc2626",
                  }}
                >
                  {getAbsentCount()}
                </strong>

              </div>

            </div>


            {/* STUDENTS */}

            {students.length === 0 ? (

              <div style={styles.emptyStudents}>
                No students are enrolled in this class.
              </div>

            ) : (

              <div style={styles.studentTableWrapper}>

                <table style={styles.studentTable}>

                  <thead>

                    <tr>

                      <th style={styles.th}>
                        Student
                      </th>

                      <th style={styles.th}>
                        Student ID
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>

                      <th style={styles.th}>
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map((student) => {

                      const status =
                        attendance[
                          student.studentId
                        ] || "ABSENT";

                      return (
                        <tr
                          key={student.studentId}
                          style={styles.studentRow}
                        >

                          <td style={styles.td}>

                            <div
                              style={
                                styles.studentInfo
                              }
                            >

                              <div
                                style={
                                  styles.studentAvatar
                                }
                              >
                                {student.name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <strong>
                                  {student.name}
                                </strong>

                              </div>

                            </div>

                          </td>


                          <td style={styles.td}>
                            {student.studentId}
                          </td>


                          <td style={styles.td}>

                            <span
                              style={{
                                ...styles.attendanceBadge,

                                ...(status ===
                                "PRESENT"
                                  ? styles.presentBadge
                                  : styles.absentBadge),
                              }}
                            >
                              {status}
                            </span>

                          </td>


                          <td style={styles.td}>

                            <div
                              style={
                                styles.actionButtons
                              }
                            >

                              <button
                                onClick={() =>
                                  markStudent(
                                    student.studentId,
                                    "PRESENT"
                                  )
                                }
                                style={{
                                  ...styles.presentButton,

                                  ...(status ===
                                  "PRESENT"
                                    ? styles.presentActive
                                    : {}),
                                }}
                              >
                                ✓ Present
                              </button>

                              <button
                                onClick={() =>
                                  markStudent(
                                    student.studentId,
                                    "ABSENT"
                                  )
                                }
                                style={{
                                  ...styles.absentButton,

                                  ...(status ===
                                  "ABSENT"
                                    ? styles.absentActive
                                    : {}),
                                }}
                              >
                                ✕ Absent
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}


            {/* FINISH */}

            <div style={styles.finishArea}>

              <div>

                <strong>
                  Ready to finish?
                </strong>

                <p style={styles.finishText}>
                  Students not marked present will
                  remain absent when the session is
                  finished.
                </p>

              </div>

              <button
                style={styles.finishButton}
                onClick={finishAttendance}
                disabled={finishing}
              >
                {finishing
                  ? "Finishing..."
                  : "Finish Attendance"}
              </button>

            </div>

          </section>
        )}


        {/* ================= PREVIEW ================= */}

        {showPreview && session && (

          <section style={styles.previewCard}>

            <div style={styles.previewHeader}>

              <div>

                <div style={styles.previewCheck}>
                  ✓
                </div>

                <h2 style={styles.previewTitle}>
                  Attendance Preview
                </h2>

                <p style={styles.previewSubtitle}>
                  Session #{session.sessionId} has
                  been completed.
                </p>

              </div>

            </div>


            {/* SUMMARY */}

            <div style={styles.previewStats}>

              <div style={styles.previewStat}>

                <span>
                  Total Students
                </span>

                <strong>
                  {students.length}
                </strong>

              </div>


              <div style={styles.previewStat}>

                <span>
                  Present
                </span>

                <strong
                  style={{ color: "#16a34a" }}
                >
                  {getPresentCount()}
                </strong>

              </div>


              <div style={styles.previewStat}>

                <span>
                  Absent
                </span>

                <strong
                  style={{ color: "#dc2626" }}
                >
                  {getAbsentCount()}
                </strong>

              </div>

            </div>


            {/* PREVIEW TABLE */}

            <div style={styles.studentTableWrapper}>

              <table style={styles.studentTable}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Student
                    </th>

                    <th style={styles.th}>
                      Student ID
                    </th>

                    <th style={styles.th}>
                      Final Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.map((student) => {

                    const status =
                      attendance[
                        student.studentId
                      ] || "ABSENT";

                    return (
                      <tr
                        key={student.studentId}
                        style={styles.studentRow}
                      >

                        <td style={styles.td}>
                          <strong>
                            {student.name}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          {student.studentId}
                        </td>

                        <td style={styles.td}>

                          <span
                            style={{
                              ...styles.attendanceBadge,

                              ...(status ===
                              "PRESENT"
                                ? styles.presentBadge
                                : styles.absentBadge),
                            }}
                          >
                            {status}
                          </span>

                        </td>

                      </tr>
                    );

                  })}

                </tbody>

              </table>

            </div>


            {/* SAVE AREA */}

            <div style={styles.saveArea}>

              <div>

                <strong>
                  Verify before saving
                </strong>

                <p style={styles.finishText}>
                  The final Save Attendance action
                  will commit the attendance records
                  to the database.
                </p>

              </div>

              <button
                style={styles.saveButton}
                onClick={() => {
                  setMessage(
                    "Preview verified. Database save will be connected in the next step."
                  );
                }}
              >
                ✓ Save Attendance
              </button>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}


/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#0f172a",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "#ffffff",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    zIndex: 10,
  },

  logoArea: {
    height: "85px",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    borderBottom: "1px solid #1e293b",
    gap: "12px",
  },

  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  logoTitle: {
    margin: 0,
    fontSize: "16px",
  },

  logoSubtitle: {
    margin: "3px 0 0",
    fontSize: "11px",
    color: "#94a3b8",
  },

  navigation: {
    padding: "24px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  navItem: {
    padding: "13px 15px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#94a3b8",
    fontSize: "14px",
    cursor: "pointer",
  },

  activeNavItem: {
    background: "#1e3a8a",
    color: "#ffffff",
  },

  sidebarBottom: {
    marginTop: "auto",
    padding: "18px",
    borderTop: "1px solid #1e293b",
  },

  helpBox: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    background: "#172033",
    borderRadius: "10px",
    marginBottom: "14px",
  },

  helpIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  helpTitle: {
    fontSize: "12px",
  },

  helpText: {
    margin: "3px 0 0",
    fontSize: "10px",
    color: "#94a3b8",
  },

  logoutButton: {
    width: "100%",
    padding: "11px",
    border: "1px solid #334155",
    borderRadius: "8px",
    background: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },

  main: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    padding: "30px 38px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  heading: {
    margin: 0,
    fontSize: "30px",
  },

  subHeading: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  teacherBox: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#ffffff",
    padding: "9px 13px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  teacherName: {
    fontSize: "13px",
  },

  teacherRole: {
    margin: "3px 0 0",
    fontSize: "11px",
    color: "#64748b",
  },

  infoMessage: {
    padding: "13px 16px",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "9px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  errorMessage: {
    padding: "13px 16px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "9px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  successMessage: {
    padding: "13px 16px",
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: "9px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  classCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  classLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  classRight: {
    display: "flex",
    alignItems: "center",
  },

  classIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "13px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  smallLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.6px",
  },

  classTitle: {
    margin: "5px 0",
    fontSize: "20px",
  },

  classDetails: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
  },

  startButton: {
    padding: "13px 20px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    fontWeight: "700",
    cursor: "pointer",
  },

  disabledStartButton: {
    background: "#94a3b8",
    cursor: "not-allowed",
    opacity: 0.7,
  },

  sessionActive: {
    padding: "12px 16px",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  liveDot: {
    width: "8px",
    height: "8px",
    background: "#22c55e",
    borderRadius: "50%",
    display: "inline-block",
  },

  selectorCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "20px",
  },

  sectionHeader: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  classGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "12px",
  },

  classOption: {
    position: "relative",
    textAlign: "left",
    padding: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "11px",
    cursor: "pointer",
    minHeight: "125px",
  },

  selectedClassOption: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
  },

  disabledClassOption: {
    opacity: 0.55,
    cursor: "not-allowed",
    background: "#f8fafc",
  },

  optionTime: {
    fontSize: "11px",
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: "7px",
  },

  optionSubject: {
    fontWeight: "700",
    fontSize: "14px",
  },

  optionClass: {
    marginTop: "5px",
    color: "#64748b",
    fontSize: "11px",
  },

  optionStatus: {
    marginTop: "10px",
    fontSize: "9px",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "0.5px",
  },

  selectedMark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
  },

  attendanceCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
  },

  attendanceHeader: {
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },

  liveIndicator: {
    padding: "8px 12px",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    gap: "7px",
    alignItems: "center",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "12px",
    padding: "20px",
    background: "#f8fafc",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "15px",
  },

  statLabel: {
    display: "block",
    fontSize: "9px",
    color: "#94a3b8",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  statValue: {
    display: "block",
    marginTop: "6px",
    fontSize: "25px",
  },

  studentTableWrapper: {
    overflowX: "auto",
  },

  studentTable: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "13px 18px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  studentRow: {
    borderTop: "1px solid #f1f5f9",
  },

  td: {
    padding: "15px 18px",
    fontSize: "13px",
  },

  studentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  studentAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
  },

  attendanceBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  presentBadge: {
    background: "#dcfce7",
    color: "#15803d",
  },

  absentBadge: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  actionButtons: {
    display: "flex",
    gap: "7px",
  },

  presentButton: {
    padding: "7px 10px",
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  presentActive: {
    background: "#16a34a",
    color: "#ffffff",
  },

  absentButton: {
    padding: "7px 10px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  absentActive: {
    background: "#dc2626",
    color: "#ffffff",
  },

  finishArea: {
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  finishText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  finishButton: {
    padding: "12px 18px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyStudents: {
    padding: "60px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
  },

  previewCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
  },

  previewHeader: {
    padding: "25px",
    borderBottom: "1px solid #e2e8f0",
  },

  previewCheck: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  previewTitle: {
    margin: 0,
    fontSize: "20px",
  },

  previewSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  previewStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    padding: "20px",
    background: "#f8fafc",
  },

  previewStat: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "15px",
  },

  saveArea: {
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  saveButton: {
    padding: "12px 20px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default TeacherAttendance;