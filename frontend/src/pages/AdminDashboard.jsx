import { useEffect, useState } from "react";
import {
  getStudents,
  getTeachers,
  getSubjects,
  getClasses,
} from "../services/api";

function AdminDashboard() {
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
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Attendance</h1>

            <p className="text-sm text-slate-400">Admin Dashboard</p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>

          <p className="text-slate-400 mt-2">
            Manage students, teachers, classes and attendance.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Students */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Students</p>

            <h3 className="text-3xl font-bold mt-3">
              {loading ? "..." : students.length}
            </h3>
          </div>

          {/* Teachers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Teachers</p>

            <h3 className="text-3xl font-bold mt-3">
              {teachersLoading ? "..." : teachers.length}
            </h3>
          </div>

          {/* Classes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Classes</p>

            <h3 className="text-3xl font-bold mt-3">
              {classesLoading ? "..." : classes.length}
            </h3>
          </div>

          {/* Subjects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">Total Subjects</p>

            <h3 className="text-3xl font-bold mt-3">
              {subjectsLoading ? "..." : subjects.length}
            </h3>
          </div>
        </div>

        {/* Management */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-5">Management</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Student Management</h4>

              <p className="text-sm text-slate-400 mt-2">
                Add students, update details and register faces.
              </p>
            </button>

            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Teacher Management</h4>

              <p className="text-sm text-slate-400 mt-2">
                Add and manage teacher accounts.
              </p>
            </button>

            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Class Management</h4>

              <p className="text-sm text-slate-400 mt-2">
                Manage branches, semesters and sections.
              </p>
            </button>

            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Subject Management</h4>

              <p className="text-sm text-slate-400 mt-2">
                Create and manage academic subjects.
              </p>
            </button>

            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Timetable</h4>

              <p className="text-sm text-slate-400 mt-2">
                Configure subjects, teachers and lecture timings.
              </p>
            </button>

            <button className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
              <h4 className="text-lg font-semibold">Attendance</h4>

              <p className="text-sm text-slate-400 mt-2">
                View attendance records and reports.
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
