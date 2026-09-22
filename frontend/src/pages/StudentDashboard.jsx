import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentDashboard() {
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!studentId || !token) {
            navigate("/student-login");
            return;
        }

        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/students/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStudent(response.data);

        } catch (error) {
            console.error("Failed to fetch student:", error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                localStorage.clear();
                navigate("/student-login");

            } else {
                setError("Unable to load student information.");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("studentId");

        navigate("/student-login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ================= HEADER ================= */}

            <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold">
                        Student Dashboard
                    </h1>

                    <p className="text-blue-100 text-sm">
                        AI Attendance System
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                    Logout
                </button>

            </header>


            {/* ================= CONTENT ================= */}

            <main className="p-6 max-w-7xl mx-auto">

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {student && (
                    <>
                        {/* ================= WELCOME ================= */}

                        <div className="bg-white rounded-xl shadow p-6 mb-6">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Welcome, {student.name}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Here is your student information.
                            </p>

                        </div>


                        {/* ================= STUDENT INFO ================= */}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Student ID */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <p className="text-gray-500 text-sm">
                                    Student ID
                                </p>

                                <h3 className="text-xl font-bold mt-2">
                                    {student.studentId}
                                </h3>
                            </div>


                            {/* Branch */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <p className="text-gray-500 text-sm">
                                    Branch
                                </p>

                                <h3 className="text-xl font-bold mt-2">
                                    {student.branch}
                                </h3>
                            </div>


                            {/* Semester */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <p className="text-gray-500 text-sm">
                                    Semester
                                </p>

                                <h3 className="text-xl font-bold mt-2">
                                    {student.semester}
                                </h3>
                            </div>


                            {/* Section */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <p className="text-gray-500 text-sm">
                                    Section
                                </p>

                                <h3 className="text-xl font-bold mt-2">
                                    {student.section}
                                </h3>
                            </div>

                        </div>


                        {/* ================= MENU ================= */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                            {/* Profile */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-bold">
                                    👤 Profile
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    View your student information.
                                </p>
                            </div>


                            {/* Attendance */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-bold">
                                    📊 Attendance
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Check your attendance records.
                                </p>
                            </div>


                            {/* Timetable */}

                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-xl font-bold">
                                    📅 Timetable
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    View your class timetable.
                                </p>
                            </div>

                        </div>

                    </>
                )}

            </main>

        </div>
    );
}

export default StudentDashboard;