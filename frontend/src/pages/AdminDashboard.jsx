import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStudents,
  getTeachers,
  getSubjects,
  getClasses,
} from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    loadStudents();
    loadTeachers();
    loadSubjects();
    loadClasses();
  }, []);

  async function loadStudents() {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeachers() {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    } finally {
      setTeachersLoading(false);
    }
  }

  async function loadSubjects() {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setSubjectsLoading(false);
    }
  }

  async function loadClasses() {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setClassesLoading(false);
    }
  }

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AI Attendance
            </h1>

            <p className="text-sm text-slate-400">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Heading */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-slate-400 mt-2">
            Manage students, teachers, classes and attendance.
          </p>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400 text-sm">
              Total Students
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {loading ? "..." : students.length}
            </h3>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400 text-sm">
              Total Teachers
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {teachersLoading ? "..." : teachers.length}
            </h3>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400 text-sm">
              Total Classes
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {classesLoading ? "..." : classes.length}
            </h3>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400 text-sm">
              Total Subjects
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {subjectsLoading ? "..." : subjects.length}
            </h3>

          </div>

        </div>

        {/* Management */}
        <div className="mt-10">

          <h3 className="text-xl font-semibold mb-5">
            Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Students */}
            <button
              onClick={() => navigate("/admin/students")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Student Management
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                Add students, update details and manage student records.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Management →
              </p>

            </button>

            {/* Teachers */}
            <button
              onClick={() => navigate("/admin/teachers")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Teacher Management
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                Add and manage teacher accounts and information.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Management →
              </p>

            </button>

            {/* Classes */}
            <button
              onClick={() => navigate("/admin/classes")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Class Management
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                Manage branches, semesters and sections.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Management →
              </p>

            </button>

            {/* Subjects */}
            <button
              onClick={() => navigate("/admin/subjects")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Subject Management
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                Create and manage academic subjects.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Management →
              </p>

            </button>

            {/* Timetable */}
            <button
              onClick={() => navigate("/admin/timetable")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Timetable
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                Configure subjects, teachers and lecture timings.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Timetable →
              </p>

            </button>

            {/* Attendance */}
            <button
              onClick={() => navigate("/admin/attendance")}
              className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-900/80 transition"
            >

              <h4 className="text-lg font-semibold">
                Attendance
              </h4>

              <p className="text-sm text-slate-400 mt-2">
                View attendance records and reports.
              </p>

              <p className="text-blue-400 text-sm mt-5">
                Open Reports →
              </p>

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;