import { useEffect, useState } from "react";

function TeacherTimetable() {
  const teacherId = localStorage.getItem("teacherId");

  const [teacher, setTeacher] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    loadTeacher();
  }, []);

  useEffect(() => {
    if (teacherId) {
      loadTimetable(selectedDay);
    }
  }, [selectedDay, teacherId]);

  const loadTeacher = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/teachers/${teacherId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load teacher profile.");
      }

      const data = await response.json();
      setTeacher(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTimetable = async (day) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/timetables/teacher/${teacherId}?dayOfWeek=${day}`
      );

      if (!response.ok) {
        throw new Error("Failed to load timetable.");
      }

      const data = await response.json();

      const sortedData = [...data].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      setTimetable(sortedData);
    } catch (err) {
      console.error(err);
      setError("Unable to load timetable.");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getClassStatus = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "Upcoming";
    }

    const now = new Date();

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    if (now < start) {
      return "Upcoming";
    }

    if (now >= start && now <= end) {
      return "Current";
    }

    return "Completed";
  };

  const getStatusStyle = (status) => {
    if (status === "Current") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "Completed") {
      return {
        background: "#f1f5f9",
        color: "#64748b",
      };
    }

    return {
      background: "#eff6ff",
      color: "#2563eb",
    };
  };

  const goBack = () => {
    window.location.href = "/teacher";
  };

  return (
    <div style={styles.page}>

      {/* Sidebar */}

      <aside style={styles.sidebar}>

        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>AI</div>

          <div>
            <h2 style={styles.logoTitle}>AI AttendEase</h2>
            <p style={styles.logoSubtitle}>Teacher Portal</p>
          </div>
        </div>

        <nav style={styles.navigation}>

          <div
            style={styles.navItem}
            onClick={() => (window.location.href = "/teacher")}
          >
            <span>⌂</span>
            Dashboard
          </div>

          <div
            style={{
              ...styles.navItem,
              ...styles.activeNavItem,
            }}
          >
            <span>▣</span>
            My Timetable
          </div>

          <div
            style={styles.navItem}
            onClick={() => (window.location.href = "/teacher/attendance")}
          >
            <span>✓</span>
            Attendance
          </div>

          <div
            style={styles.navItem}
            onClick={() =>
              (window.location.href = "/teacher/attendance-history")
            }
          >
            <span>◷</span>
            Attendance History
          </div>

          <div
            style={styles.navItem}
            onClick={() => (window.location.href = "/teacher/profile")}
          >
            <span>◉</span>
            My Profile
          </div>

        </nav>

        <div style={styles.sidebarBottom}>

          <div style={styles.helpBox}>
            <div style={styles.helpIcon}>?</div>

            <div>
              <strong style={styles.helpTitle}>Need Help?</strong>
              <p style={styles.helpText}>
                Contact your administrator
              </p>
            </div>
          </div>

          <button
            style={styles.logoutButton}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/teacher-login";
            }}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Main Content */}

      <main style={styles.main}>

        {/* Header */}

        <header style={styles.header}>

          <div>
            <button
              onClick={goBack}
              style={styles.backButton}
            >
              ← Back to Dashboard
            </button>

            <h1 style={styles.heading}>
              My Timetable
            </h1>

            <p style={styles.subHeading}>
              View your scheduled classes and lectures.
            </p>
          </div>

          <div style={styles.teacherBox}>

            <div style={styles.avatar}>
              {teacher?.name
                ? teacher.name.charAt(0).toUpperCase()
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


        {/* Day Selector */}

        <section style={styles.dayCard}>

          <div style={styles.dayHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Weekly Schedule
              </h2>

              <p style={styles.cardSubtitle}>
                Select a day to view your classes.
              </p>
            </div>

            <div style={styles.totalBadge}>
              {timetable.length}{" "}
              {timetable.length === 1 ? "Lecture" : "Lectures"}
            </div>
          </div>


          <div style={styles.dayButtons}>

            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  ...styles.dayButton,
                  ...(selectedDay === day
                    ? styles.selectedDayButton
                    : {}),
                }}
              >
                {day}
              </button>
            ))}

          </div>

        </section>


        {/* Timetable */}

        <section style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>
              <h2 style={styles.tableTitle}>
                {selectedDay}
              </h2>

              <p style={styles.tableSubtitle}>
                Your classes scheduled for {selectedDay}
              </p>
            </div>

            <div style={styles.calendarIcon}>
              📅
            </div>

          </div>


          {loading ? (

            <div style={styles.centerMessage}>
              <div style={styles.loader}></div>
              <p>Loading timetable...</p>
            </div>

          ) : error ? (

            <div style={styles.errorBox}>
              {error}
            </div>

          ) : timetable.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📚
              </div>

              <h3 style={styles.emptyTitle}>
                No Classes Scheduled
              </h3>

              <p style={styles.emptyText}>
                You don't have any classes scheduled for{" "}
                {selectedDay}.
              </p>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>

                    <th style={styles.th}>
                      Time
                    </th>

                    <th style={styles.th}>
                      Class
                    </th>

                    <th style={styles.th}>
                      Subject
                    </th>

                    <th style={styles.th}>
                      Teacher
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

                  {timetable.map((item) => {

                    const status = getClassStatus(
                      item.startTime,
                      item.endTime
                    );

                    return (
                      <tr
                        key={item.timetableId}
                        style={
                          status === "Current"
                            ? styles.currentRow
                            : styles.tableRow
                        }
                      >

                        <td style={styles.td}>

                          <div style={styles.timeBox}>

                            <strong>
                              {formatTime(item.startTime)}
                            </strong>

                            <span>
                              {formatTime(item.endTime)}
                            </span>

                          </div>

                        </td>


                        <td style={styles.td}>

                          <div style={styles.className}>
                            {item.className || "Class"}
                          </div>

                          <div style={styles.classId}>
                            Class ID: {item.classId}
                          </div>

                        </td>


                        <td style={styles.td}>

                          <div style={styles.subjectName}>
                            {item.subjectName || "Subject"}
                          </div>

                          <div style={styles.subjectId}>
                            Subject ID: {item.subjectId}
                          </div>

                        </td>


                        <td style={styles.td}>

                          <span style={styles.teacherIdBadge}>
                            ID {item.teacherId}
                          </span>

                        </td>


                        <td style={styles.td}>

                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusStyle(status),
                            }}
                          >
                            {status}
                          </span>

                        </td>


                        <td style={styles.td}>

                          {status === "Current" ? (

                            <button
                              style={styles.takeAttendanceButton}
                              onClick={() =>
                                (window.location.href =
                                  "/teacher/attendance")
                              }
                            >
                              Take Attendance
                            </button>

                          ) : (

                            <span style={styles.noAction}>
                              —
                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* Information Cards */}

        <section style={styles.infoGrid}>

          <div style={styles.infoCard}>

            <div style={styles.infoIcon}>
              👨‍🏫
            </div>

            <div>
              <h3 style={styles.infoTitle}>
                Teacher Schedule
              </h3>

              <p style={styles.infoText}>
                Your timetable is managed by the administrator.
                Any changes made by the admin will automatically
                appear here.
              </p>
            </div>

          </div>


          <div style={styles.infoCard}>

            <div style={styles.infoIcon}>
              📷
            </div>

            <div>
              <h3 style={styles.infoTitle}>
                Smart Attendance
              </h3>

              <p style={styles.infoText}>
                Start attendance from your current class and
                the AI camera will identify students automatically.
              </p>
            </div>

          </div>

        </section>

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
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
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
    fontSize: "14px",
  },

  logoTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
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
    transition: "0.2s",
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
    fontSize: "13px",
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
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
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
    marginBottom: "30px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    padding: 0,
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  heading: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "750",
    letterSpacing: "-0.5px",
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

  dayCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "22px",
  },

  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "17px",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  totalBadge: {
    padding: "8px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
  },

  dayButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  dayButton: {
    padding: "10px 20px",
    borderRadius: "9px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  selectedDayButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "22px",
  },

  tableHeader: {
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "18px",
  },

  tableSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  calendarIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 18px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },

  tableRow: {
    borderTop: "1px solid #f1f5f9",
  },

  currentRow: {
    borderTop: "1px solid #dbeafe",
    background: "#f8fbff",
  },

  td: {
    padding: "17px 18px",
    fontSize: "13px",
    verticalAlign: "middle",
  },

  timeBox: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  className: {
    fontWeight: "700",
    color: "#0f172a",
  },

  classId: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#94a3b8",
  },

  subjectName: {
    fontWeight: "600",
    color: "#334155",
  },

  subjectId: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#94a3b8",
  },

  teacherIdBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "600",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  takeAttendanceButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },

  noAction: {
    color: "#cbd5e1",
  },

  centerMessage: {
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "13px",
  },

  loader: {
    width: "28px",
    height: "28px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    marginBottom: "12px",
  },

  errorBox: {
    margin: "25px",
    padding: "18px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
  },

  emptyState: {
    minHeight: "270px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "17px",
  },

  emptyText: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  infoCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    gap: "13px",
  },

  infoIcon: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  infoTitle: {
    margin: 0,
    fontSize: "13px",
  },

  infoText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.6",
  },
};

export default TeacherTimetable;