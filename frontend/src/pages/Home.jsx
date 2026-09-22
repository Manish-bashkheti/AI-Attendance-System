import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-950/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <h1 className="text-2xl font-bold">
                        AI Attendance System
                    </h1>

                    <span className="text-sm text-slate-400">
                        Smart Attendance Management
                    </span>

                </div>
            </nav>

            {/* Hero */}
            <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">

                <div className="w-full max-w-6xl">

                    <div className="mb-12 text-center">

                        <h2 className="text-4xl font-bold md:text-5xl">
                            Welcome to AI Attendance System
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
                            Manage attendance easily with our smart and
                            secure attendance management system.
                        </p>

                    </div>

                    {/* Role Cards */}
                    <div className="grid gap-6 md:grid-cols-3">

                        {/* Teacher */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500">

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-4xl">
                                👨‍🏫
                            </div>

                            <h3 className="text-2xl font-bold">
                                Teacher
                            </h3>

                            <p className="mt-3 min-h-[72px] text-slate-400">
                                Access your teacher dashboard, manage
                                attendance and view your timetable.
                            </p>

                            <button
                                onClick={() => navigate("/teacher-login")}
                                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500"
                            >
                                Teacher Login
                            </button>

                        </div>


                        {/* Student */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-green-500">

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-4xl">
                                🎓
                            </div>

                            <h3 className="text-2xl font-bold">
                                Student
                            </h3>

                            <p className="mt-3 min-h-[72px] text-slate-400">
                                Access your attendance information and
                                student dashboard.
                            </p>

                            <button
                                onClick={() =>
                                    alert("Student login will be available soon.")
                                }
                                className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold transition hover:bg-green-500"
                            >
                                Student Login
                            </button>

                        </div>


                        {/* Admin */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500">

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-4xl">
                                🛡️
                            </div>

                            <h3 className="text-2xl font-bold">
                                Admin
                            </h3>

                            <p className="mt-3 min-h-[72px] text-slate-400">
                                Manage students, teachers, classes, subjects,
                                timetable and attendance.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold transition hover:bg-purple-500"
                            >
                                Admin Login
                            </button>

                        </div>

                    </div>

                    <p className="mt-10 text-center text-sm text-slate-500">
                        AI-powered attendance management system
                    </p>

                </div>

            </main>

        </div>
    );
}

export default Home;