import { useEffect, useState } from "react";

function TeacherDashboard() {
  const teacherId = localStorage.getItem("teacherId");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const startAttendance = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const now = new Date();

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const dayOfWeek = dayNames[now.getDay()];

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const currentTime = `${hours}:${minutes}:${seconds}`;

      const response = await fetch(
        `http://localhost:8080/attendance-sessions/start?dayOfWeek=${dayOfWeek}&time=${currentTime}&teacherId=${teacherId}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setSession(data);
      setAttendanceRecords([]);
      setMessage("Attendance session started successfully.");
    } catch (error) {
      setError(error.message || "Failed to start attendance.");
    } finally {
      setLoading(false);
    }
  };
  const loadAttendanceReport = async (sessionId) => {
    try {
      const response = await fetch("http://localhost:8080/attendance");

      if (!response.ok) {
        throw new Error("Failed to load attendance report.");
      }

      const data = await response.json();

      const sessionRecords = data.filter(
        (record) => record.sessionId === sessionId,
      );

      setAttendanceRecords(sessionRecords);
    } catch (error) {
      setError(error.message || "Failed to load attendance report.");
    }
  };

  const finishAttendance = async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/attendance-sessions/${session.sessionId}/finish`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setSession(data);

      await loadAttendanceReport(data.sessionId);

      setMessage("Attendance session finished successfully.");
    } catch (error) {
      setError(error.message || "Failed to finish attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/attendance-sessions/active",
        );

        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (error) {
        console.log("No active attendance session.");
      }
    };

    checkActiveSession();
  }, []);

  return (
    <div>
      <h1>Teacher Dashboard</h1>

      <p>Welcome to the Teacher Dashboard.</p>

      <p>Teacher ID: {teacherId || "Not available"}</p>

      <hr />

      <h2>Attendance</h2>

      {!session && (
        <div>
          <p>No attendance session is currently running.</p>

          <button onClick={startAttendance} disabled={loading}>
            {loading ? "Starting..." : "Start Attendance"}
          </button>
        </div>
      )}

      {session && session.status === "STARTED" && (
        <div>
          <p>
            <strong>Attendance Status:</strong> Running
          </p>

          <p>
            <strong>Session ID:</strong> {session.sessionId}
          </p>

          <p>
            <strong>Class ID:</strong> {session.classId}
          </p>

          <p>
            <strong>Subject ID:</strong> {session.subjectId}
          </p>

          <button onClick={finishAttendance} disabled={loading}>
            {loading ? "Finishing..." : "Finish Attendance"}
          </button>
        </div>
      )}

      {session && session.status === "FINISHED" && (
        <div>
          <p>
            <strong>Attendance Status:</strong> Completed
          </p>

          <p>Session ID: {session.sessionId}</p>

          <button
            onClick={() => {
              setSession(null);
              setMessage("");
            }}
          >
            Start New Attendance
          </button>
        </div>
      )}
      {attendanceRecords.length > 0 && (
        <div>
          <hr />

          <h2>Attendance Report</h2>

          <p>
            <strong>Total Students:</strong> {attendanceRecords.length}
          </p>

          <p>
            <strong>Present:</strong>{" "}
            {
              attendanceRecords.filter((record) => record.status === "PRESENT")
                .length
            }
          </p>

          <p>
            <strong>Absent:</strong>{" "}
            {
              attendanceRecords.filter((record) => record.status === "ABSENT")
                .length
            }
          </p>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Marked Time</th>
              </tr>
            </thead>

            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.attendanceId}>
                  <td>{record.studentId}</td>
                  <td>{record.studentName}</td>
                  <td>{record.status}</td>
                  <td>{record.markedTime || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default TeacherDashboard;
