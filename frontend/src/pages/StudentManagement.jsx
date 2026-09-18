import { useEffect, useState } from "react";
import { getStudents } from "../services/api";

const API_BASE_URL = "http://localhost:8080";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    branch: "",
    semester: ""
  });

  useEffect(() => {
    loadStudents();
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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: Number(formData.studentId),
          name: formData.name,
          branch: formData.branch,
          semester: Number(formData.semester)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      await response.json();

      setFormData({
        studentId: "",
        name: "",
        branch: "",
        semester: ""
      });

      setShowForm(false);

      await loadStudents();

    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student.");
    } finally {
      setSaving(false);
    }
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
              Student Management
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            Back
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Students
            </h2>

            <p className="text-slate-400 mt-2">
              Manage registered students and their face profiles.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold hover:scale-[1.02] transition"
          >
            + Add Student
          </button>

        </div>

        {/* Add Student Form */}
        {showForm && (
          <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="text-xl font-semibold">
                  Add New Student
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Enter student academic details.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Student ID */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Student ID
                  </label>

                  <input
                    type="number"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter student ID"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Student Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Example: CSE"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="Example: 6"
                    min="1"
                    max="8"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Student"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Student Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800/60">

                <tr>

                  <th className="text-left px-6 py-4 text-sm text-slate-400">
                    Student ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm text-slate-400">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm text-slate-400">
                    Branch
                  </th>

                  <th className="text-left px-6 py-4 text-sm text-slate-400">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      Loading students...
                    </td>
                  </tr>

                ) : students.length === 0 ? (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      No students found.
                    </td>
                  </tr>

                ) : (

                  students.map((student) => (

                    <tr
                      key={student.studentId}
                      className="border-t border-slate-800"
                    >

                      <td className="px-6 py-4">
                        {student.studentId}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {student.name}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {student.branch}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {student.semester}
                      </td>

                      <td className="px-6 py-4">

                        <button className="text-blue-400 hover:text-blue-300">
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentManagement;