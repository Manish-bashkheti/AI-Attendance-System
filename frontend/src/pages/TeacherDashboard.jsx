import { useEffect, useState } from "react";

function TeacherDashboard() {
    const teacherId = localStorage.getItem("teacherId");

    const [teacher, setTeacher] = useState(null);
    const [todayClasses, setTodayClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [timetableLoading, setTimetableLoading] = useState(true);
    const [timetableError, setTimetableError] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!teacherId) {
                setLoading(false);
                setTimetableLoading(false);
                return;
            }

            try {
                const teacherResponse = await fetch(
                    `http://localhost:8080/teachers/${teacherId}`
                );

                if (teacherResponse.ok) {
                    const teacherData =
                        await teacherResponse.json();

                    setTeacher(teacherData);
                }
            } catch (error) {
                console.log("Failed to load teacher profile.");
            } finally {
                setLoading(false);
            }

            try {
                const dayNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ];

                const today =
                    dayNames[new Date().getDay()];

                const response = await fetch(
                    `http://localhost:8080/timetables/teacher/${teacherId}?dayOfWeek=${today}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load today's timetable."
                    );
                }

                const data = await response.json();

                setTodayClasses(data);
                setTimetableError("");

            } catch (error) {
                console.log(error);

                setTimetableError(
                    "Unable to load today's timetable."
                );
            } finally {
                setTimetableLoading(false);
            }
        };

        loadDashboardData();
    }, [teacherId]);

    const teacherName =
        teacher?.name || "Teacher";

    const openAttendance = () => {
        window.location.href = "/teacher/attendance";
    };

    const openProfile = () => {
        window.location.href = "/teacher/profile";
    };

    const openTimetable = () => {
        window.location.href = "/teacher/timetable";
    };

    const openAttendanceHistory = () => {
        window.location.href =
            "/teacher/attendance-history";
    };

    const getClassStatus = (
        startTime,
        endTime
    ) => {

        const now = new Date();

        const [startHour, startMinute] =
            startTime.split(":").map(Number);

        const [endHour, endMinute] =
            endTime.split(":").map(Number);

        const start =
            startHour * 60 + startMinute;

        const end =
            endHour * 60 + endMinute;

        const current =
            now.getHours() * 60 +
            now.getMinutes();

        if (current < start) {
            return "Upcoming";
        }

        if (current >= start && current <= end) {
            return "Current";
        }

        return "Completed";
    };

    return (
        <div style={styles.page}>

            <aside style={styles.sidebar}>

                <div style={styles.logoSection}>

                    <div style={styles.logoIcon}>
                        AI
                    </div>

                    <div>
                        <div style={styles.logoTitle}>
                            AI AttendEase
                        </div>

                        <div style={styles.logoSubtitle}>
                            Smart Attendance System
                        </div>
                    </div>

                </div>

                <nav style={styles.navigation}>

                    <div
                        style={{
                            ...styles.navItem,
                            ...styles.activeNavItem
                        }}
                    >
                        <span>⌂</span>
                        Dashboard
                    </div>

                    <div
                        style={styles.navItem}
                        onClick={openTimetable}
                    >
                        <span>▣</span>
                        My Timetable
                    </div>

                    <div
                        style={styles.navItem}
                        onClick={openAttendance}
                    >
                        <span>◉</span>
                        Attendance
                    </div>

                    <div
                        style={styles.navItem}
                        onClick={openAttendanceHistory}
                    >
                        <span>▤</span>
                        Attendance History
                    </div>

                    <div
                        style={styles.navItem}
                        onClick={openProfile}
                    >
                        <span>♙</span>
                        Profile
                    </div>

                </nav>

                <div style={styles.sidebarBottom}>

                    <div
                        style={styles.navItem}
                        onClick={() => {
                            localStorage.clear();
                            window.location.href =
                                "/teacher-login";
                        }}
                    >
                        <span>↪</span>
                        Logout
                    </div>

                </div>

            </aside>

            <main style={styles.main}>

                <header style={styles.header}>

                    <div>

                        <h1 style={styles.pageTitle}>
                            Teacher Dashboard
                        </h1>

                        <p style={styles.pageSubtitle}>
                            Manage your classes and attendance.
                        </p>

                    </div>

                    <div
                        style={styles.profile}
                        onClick={openProfile}
                    >

                        <div style={styles.avatar}>
                            {teacherName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>

                            <strong style={styles.profileName}>
                                {loading
                                    ? "Loading..."
                                    : teacherName}
                            </strong>

                            <span style={styles.profileId}>
                                Teacher ID:{" "}
                                {teacherId || "N/A"}
                            </span>

                        </div>

                    </div>

                </header>

                <section style={styles.welcomeBanner}>

                    <div>

                        <p style={styles.smallText}>
                            Welcome back
                        </p>

                        <h2 style={styles.welcomeTitle}>
                            Good Afternoon,{" "}
                            {teacherName}!
                        </h2>

                        <p style={styles.welcomeDescription}>
                            Manage your classes and record
                            student attendance from one place.
                        </p>

                    </div>

                    <div style={styles.dateBox}>

                        <div style={styles.dateIcon}>
                            ▣
                        </div>

                        <div>

                            <strong>
                                {new Date().toLocaleDateString(
                                    "en-IN",
                                    {
                                        weekday: "long"
                                    }
                                )}
                            </strong>

                            <span style={styles.dateText}>
                                {new Date().toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }
                                )}
                            </span>

                        </div>

                    </div>

                </section>

                <section style={styles.statsGrid}>

                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>
                            ▦
                        </div>

                        <div>
                            <span style={styles.statLabel}>
                                My Classes
                            </span>

                            <strong style={styles.statValue}>
                                {todayClasses.length}
                            </strong>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>
                            ▤
                        </div>

                        <div>
                            <span style={styles.statLabel}>
                                My Subjects
                            </span>

                            <strong style={styles.statValue}>
                                {
                                    new Set(
                                        todayClasses.map(
                                            (item) =>
                                                item.subjectId
                                        )
                                    ).size
                                }
                            </strong>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>
                            ♙
                        </div>

                        <div>
                            <span style={styles.statLabel}>
                                Today's Lectures
                            </span>

                            <strong style={styles.statValue}>
                                {todayClasses.length}
                            </strong>
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>
                            ▥
                        </div>

                        <div>
                            <span style={styles.statLabel}>
                                Attendance Rate
                            </span>

                            <strong style={styles.statValue}>
                                —
                            </strong>
                        </div>
                    </div>

                </section>

                <section style={styles.actionGrid}>

                    <div style={styles.attendanceCard}>

                        <div style={styles.cameraIcon}>
                            ◉
                        </div>

                        <div style={styles.attendanceContent}>

                            <h2 style={styles.attendanceTitle}>
                                Take Attendance
                            </h2>

                            <p style={styles.attendanceDescription}>
                                Start today's classroom attendance
                                using AI face recognition. You will
                                also be able to manually mark students
                                Present or Absent.
                            </p>

                            <button
                                style={styles.primaryButton}
                                onClick={openAttendance}
                            >
                                Open Attendance
                                <span>→</span>
                            </button>

                        </div>

                    </div>

                    <div style={styles.quickActions}>

                        <div
                            style={styles.quickCard}
                            onClick={openTimetable}
                        >

                            <div style={styles.quickIcon}>
                                ▣
                            </div>

                            <div>

                                <h3 style={styles.quickTitle}>
                                    My Timetable
                                </h3>

                                <p style={styles.quickText}>
                                    Check your scheduled classes
                                    and subjects.
                                </p>

                            </div>

                            <span style={styles.arrow}>
                                →
                            </span>

                        </div>

                        <div
                            style={styles.quickCard}
                            onClick={openAttendanceHistory}
                        >

                            <div style={styles.quickIcon}>
                                ▤
                            </div>

                            <div>

                                <h3 style={styles.quickTitle}>
                                    Attendance History
                                </h3>

                                <p style={styles.quickText}>
                                    View previous attendance
                                    records.
                                </p>

                            </div>

                            <span style={styles.arrow}>
                                →
                            </span>

                        </div>

                    </div>

                </section>

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <div>

                            <h2 style={styles.sectionTitle}>
                                Today's Classes
                            </h2>

                            <p style={styles.sectionSubtitle}>
                                Your scheduled lectures for today.
                            </p>

                        </div>

                        <button
                            style={styles.linkButton}
                            onClick={openTimetable}
                        >
                            View Timetable →
                        </button>

                    </div>

                    <div style={styles.tableCard}>

                        {timetableLoading && (
                            <div style={styles.loadingMessage}>
                                Loading today's classes...
                            </div>
                        )}

                        {!timetableLoading &&
                            timetableError && (
                                <div style={styles.errorMessage}>
                                    {timetableError}
                                </div>
                            )}

                        {!timetableLoading &&
                            !timetableError &&
                            todayClasses.length === 0 && (
                                <div style={styles.emptyCard}>

                                    <div style={styles.emptyIcon}>
                                        ▣
                                    </div>

                                    <h3 style={styles.emptyTitle}>
                                        No classes scheduled
                                    </h3>

                                    <p style={styles.emptyText}>
                                        No timetable entry is
                                        configured for you today.
                                    </p>

                                </div>
                            )}

                        {!timetableLoading &&
                            !timetableError &&
                            todayClasses.length > 0 && (
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
                                                    Teacher ID
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

                                            {todayClasses.map(
                                                (item) => {

                                                    const status =
                                                        getClassStatus(
                                                            item.startTime,
                                                            item.endTime
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                item.timetableId
                                                            }
                                                        >

                                                            <td style={styles.td}>
                                                                {item.startTime.slice(
                                                                    0,
                                                                    5
                                                                )}
                                                                {" - "}
                                                                {item.endTime.slice(
                                                                    0,
                                                                    5
                                                                )}
                                                            </td>

                                                            <td style={styles.td}>
                                                                <strong>
                                                                    {item.className}
                                                                </strong>
                                                            </td>

                                                            <td style={styles.td}>
                                                                {item.subjectName}
                                                            </td>

                                                            <td style={styles.td}>
                                                                {item.teacherId}
                                                            </td>

                                                            <td style={styles.td}>

                                                                <span
                                                                    style={{
                                                                        ...styles.statusBadge,
                                                                        ...(status ===
                                                                        "Current"
                                                                            ? styles.currentBadge
                                                                            : status ===
                                                                              "Completed"
                                                                            ? styles.completedBadge
                                                                            : styles.upcomingBadge)
                                                                    }}
                                                                >
                                                                    {status}
                                                                </span>

                                                            </td>

                                                            <td style={styles.td}>

                                                                {status ===
                                                                    "Current" && (
                                                                    <button
                                                                        style={
                                                                            styles.smallActionButton
                                                                        }
                                                                        onClick={
                                                                            openAttendance
                                                                        }
                                                                    >
                                                                        Take
                                                                    </button>
                                                                )}

                                                                {status !==
                                                                    "Current" && (
                                                                    <span
                                                                        style={
                                                                            styles.mutedText
                                                                        }
                                                                    >
                                                                        —
                                                                    </span>
                                                                )}

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                    </div>

                </section>

                <section style={styles.infoCard}>

                    <div style={styles.infoIcon}>
                        AI
                    </div>

                    <div>

                        <h3 style={styles.infoTitle}>
                            AI Attendance
                        </h3>

                        <p style={styles.infoText}>
                            Attendance is controlled by the scheduled
                            timetable. The system is designed to support
                            laptop camera testing and future IP CCTV /
                            RTSP integration.
                        </p>

                    </div>

                </section>

                <footer style={styles.footer}>
                    AI AttendEase • Smart Attendance System
                </footer>

            </main>

        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
        color: "#172033",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    },

    sidebar: {
        width: "245px",
        minHeight: "100vh",
        background: "#101a31",
        color: "#ffffff",
        padding: "24px 16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "4px 8px 30px"
    },

    logoIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        background: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "13px"
    },

    logoTitle: {
        fontSize: "17px",
        fontWeight: "700"
    },

    logoSubtitle: {
        fontSize: "10px",
        color: "#94a3b8",
        marginTop: "2px"
    },

    navigation: {
        display: "flex",
        flexDirection: "column",
        gap: "7px"
    },

    navItem: {
        padding: "12px 13px",
        borderRadius: "9px",
        color: "#b7c2d8",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "14px"
    },

    activeNavItem: {
        background: "#2563eb",
        color: "#ffffff"
    },

    sidebarBottom: {
        marginTop: "auto"
    },

    main: {
        marginLeft: "245px",
        width: "calc(100% - 245px)",
        padding: "28px 34px",
        boxSizing: "border-box"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },

    pageTitle: {
        margin: 0,
        fontSize: "27px",
        fontWeight: "750"
    },

    pageSubtitle: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "14px"
    },

    profile: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer"
    },

    avatar: {
        width: "43px",
        height: "43px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    profileName: {
        display: "block",
        fontSize: "14px"
    },

    profileId: {
        display: "block",
        color: "#64748b",
        fontSize: "12px",
        marginTop: "3px"
    },

    welcomeBanner: {
        background:
            "linear-gradient(135deg, #172554, #2563eb)",
        color: "#ffffff",
        borderRadius: "18px",
        padding: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        boxShadow:
            "0 12px 30px rgba(37, 99, 235, 0.15)"
    },

    smallText: {
        margin: 0,
        color: "#bfdbfe",
        fontSize: "13px"
    },

    welcomeTitle: {
        margin: "7px 0",
        fontSize: "26px"
    },

    welcomeDescription: {
        margin: 0,
        color: "#dbeafe",
        fontSize: "14px"
    },

    dateBox: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(255,255,255,0.12)",
        padding: "13px 16px",
        borderRadius: "12px"
    },

    dateIcon: {
        fontSize: "20px"
    },

    dateText: {
        display: "block",
        marginTop: "2px"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, 1fr)",
        gap: "15px",
        marginBottom: "20px"
    },

    statCard: {
        background: "#ffffff",
        border: "1px solid #e5eaf2",
        borderRadius: "14px",
        padding: "19px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.04)"
    },

    statIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "11px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    statLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "12px"
    },

    statValue: {
        display: "block",
        fontSize: "22px",
        marginTop: "3px"
    },

    actionGrid: {
        display: "grid",
        gridTemplateColumns:
            "1.6fr 1fr",
        gap: "18px",
        marginBottom: "25px"
    },

    attendanceCard: {
        background: "#ecfdf5",
        border: "1px solid #ccefe0",
        borderRadius: "16px",
        padding: "25px",
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },

    cameraIcon: {
        width: "62px",
        height: "62px",
        borderRadius: "16px",
        background: "#16a34a",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "25px",
        flexShrink: 0
    },

    attendanceContent: {
        flex: 1
    },

    attendanceTitle: {
        margin: 0,
        fontSize: "21px"
    },

    attendanceDescription: {
        color: "#527064",
        fontSize: "13px",
        lineHeight: "1.6",
        margin: "7px 0 15px"
    },

    primaryButton: {
        border: "none",
        background: "#16a34a",
        color: "#ffffff",
        padding: "11px 17px",
        borderRadius: "9px",
        fontWeight: "650",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px"
    },

    quickActions: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    quickCard: {
        background: "#ffffff",
        border: "1px solid #e5eaf2",
        borderRadius: "14px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.04)"
    },

    quickIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    quickTitle: {
        margin: 0,
        fontSize: "14px"
    },

    quickText: {
        margin: "4px 0 0",
        color: "#64748b",
        fontSize: "11px"
    },

    arrow: {
        marginLeft: "auto",
        color: "#2563eb",
        fontSize: "18px"
    },

    section: {
        marginBottom: "20px"
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    },

    sectionTitle: {
        margin: 0,
        fontSize: "18px"
    },

    sectionSubtitle: {
        margin: "4px 0 0",
        color: "#64748b",
        fontSize: "12px"
    },

    linkButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "600"
    },

    tableCard: {
        background: "#ffffff",
        border: "1px solid #e5eaf2",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow:
            "0 4px 15px rgba(15, 23, 42, 0.04)"
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "13px"
    },

    th: {
        textAlign: "left",
        padding: "15px",
        background: "#f8fafc",
        color: "#64748b",
        fontWeight: "650",
        borderBottom:
            "1px solid #e5eaf2"
    },

    td: {
        padding: "15px",
        borderBottom:
            "1px solid #eef2f7",
        color: "#334155"
    },

    statusBadge: {
        display: "inline-block",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "650"
    },

    currentBadge: {
        background: "#dcfce7",
        color: "#15803d"
    },

    completedBadge: {
        background: "#f1f5f9",
        color: "#64748b"
    },

    upcomingBadge: {
        background: "#dbeafe",
        color: "#2563eb"
    },

    smallActionButton: {
        border: "none",
        background: "#2563eb",
        color: "#ffffff",
        padding: "7px 12px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    mutedText: {
        color: "#94a3b8"
    },

    loadingMessage: {
        padding: "35px",
        textAlign: "center",
        color: "#64748b"
    },

    errorMessage: {
        padding: "25px",
        textAlign: "center",
        color: "#dc2626"
    },

    emptyCard: {
        padding: "35px",
        textAlign: "center"
    },

    emptyIcon: {
        width: "45px",
        height: "45px",
        margin: "0 auto 10px",
        borderRadius: "12px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    emptyTitle: {
        margin: 0,
        fontSize: "15px"
    },

    emptyText: {
        color: "#64748b",
        fontSize: "12px"
    },

    infoCard: {
        background: "#ffffff",
        border: "1px solid #e5eaf2",
        borderRadius: "14px",
        padding: "17px",
        display: "flex",
        gap: "13px",
        alignItems: "flex-start"
    },

    infoIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "11px"
    },

    infoTitle: {
        margin: 0,
        fontSize: "14px"
    },

    infoText: {
        margin: "4px 0 0",
        color: "#64748b",
        fontSize: "12px",
        lineHeight: "1.5"
    },

    footer: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "11px",
        marginTop: "25px"
    }
};

export default TeacherDashboard;