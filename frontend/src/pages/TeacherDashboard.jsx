function TeacherDashboard() {
    const teacherId = localStorage.getItem("teacherId");

    return (
        <div>
            <h1>Teacher Dashboard</h1>

            <p>Welcome to the Teacher Dashboard.</p>

            <p>
                Teacher ID: {teacherId || "Not available"}
            </p>
        </div>
    );
}

export default TeacherDashboard;