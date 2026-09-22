import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ================= HEADER ================= */}

            <header className="bg-blue-600 text-white py-6 px-6 shadow-md">
                <div className="max-w-6xl mx-auto text-center">

                    <h1 className="text-4xl font-bold">
                        AI Attendance System
                    </h1>

                    <p className="mt-2 text-blue-100">
                        Smart Face Recognition Based Attendance System
                    </p>

                </div>
            </header>


            {/* ================= MAIN ================= */}

            <main className="max-w-6xl mx-auto px-6 py-12">

                <div className="text-center mb-10">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Welcome
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Select your role to continue
                    </p>

                </div>


                {/* ================= ROLE CARDS ================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


                    {/* ================= ADMIN ================= */}

                    <div
                        onClick={() => navigate("/login")}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer
                                   hover:shadow-2xl hover:-translate-y-2
                                   transition-all duration-300"
                    >

                        <div className="text-6xl text-center mb-5">
                            👨‍💼
                        </div>

                        <h3 className="text-2xl font-bold text-center text-gray-800">
                            Admin
                        </h3>

                        <p className="text-center text-gray-500 mt-3">
                            Manage students, teachers, classes, subjects,
                            timetable and attendance.
                        </p>

                        <button
                            className="w-full mt-6 bg-blue-600 text-white
                                       py-3 rounded-lg font-semibold
                                       hover:bg-blue-700 transition"
                        >
                            Admin Login
                        </button>

                    </div>


                    {/* ================= TEACHER ================= */}

                    <div
                        onClick={() => navigate("/teacher-login")}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer
                                   hover:shadow-2xl hover:-translate-y-2
                                   transition-all duration-300"
                    >

                        <div className="text-6xl text-center mb-5">
                            👨‍🏫
                        </div>

                        <h3 className="text-2xl font-bold text-center text-gray-800">
                            Teacher
                        </h3>

                        <p className="text-center text-gray-500 mt-3">
                            Manage attendance, timetable and
                            teacher profile.
                        </p>

                        <button
                            className="w-full mt-6 bg-green-600 text-white
                                       py-3 rounded-lg font-semibold
                                       hover:bg-green-700 transition"
                        >
                            Teacher Login
                        </button>

                    </div>


                    {/* ================= STUDENT ================= */}

                    <div
                        onClick={() => navigate("/student-login")}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer
                                   hover:shadow-2xl hover:-translate-y-2
                                   transition-all duration-300"
                    >

                        <div className="text-6xl text-center mb-5">
                            🎓
                        </div>

                        <h3 className="text-2xl font-bold text-center text-gray-800">
                            Student
                        </h3>

                        <p className="text-center text-gray-500 mt-3">
                            View your profile, attendance,
                            timetable and academic information.
                        </p>

                        <button
                            className="w-full mt-6 bg-purple-600 text-white
                                       py-3 rounded-lg font-semibold
                                       hover:bg-purple-700 transition"
                        >
                            Student Login
                        </button>

                    </div>

                </div>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="text-center py-6 text-gray-500">
                © 2026 AI Attendance System
            </footer>

        </div>
    );
}

export default Home;