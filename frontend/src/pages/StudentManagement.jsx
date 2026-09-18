import { useEffect, useState } from "react";
import { getStudents } from "../services/api";

const API_BASE_URL = "http://localhost:8080";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    branch: "",
    semester: "",
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

  const branches = [
    ...new Set(students.map((student) => student.branch).filter(Boolean)),
  ];

  const semesters = [
    ...new Set(students.map((student) => student.semester).filter(Boolean)),
  ].sort((a, b) => a - b);

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(search) ||
      student.studentId.toString().includes(search);

    const matchesBranch =
      branchFilter === "All" || student.branch === branchFilter;

    const matchesSemester =
      semesterFilter === "All" ||
      student.semester.toString() === semesterFilter;

    return matchesSearch && matchesBranch && matchesSemester;
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: Number(formData.studentId),
          name: formData.name,
          branch: formData.branch,
          semester: Number(formData.semester),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      await response.json();

      setFormData({
        studentId: "",
        name: "",
        branch: "",
        semester: "",
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

  async function handleUpdate(event) {
    event.preventDefault();

    setUpdating(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${editingStudent.studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingStudent.name,
            branch: editingStudent.branch,
            semester: Number(editingStudent.semester),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      await response.json();

      setEditingStudent(null);

      await loadStudents();
    } catch (error) {
      console.error("Failed to update student:", error);
      alert("Failed to update student.");
    } finally {
      setUpdating(false);
    }
  }
  async function handleDelete() {
    if (!deletingStudent) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${deletingStudent.studentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setDeletingStudent(null);

      await loadStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student.");
    } finally {
      setDeleting(false);
    }
  }

  function clearFilters() {
    setBranchFilter("All");
    setSemesterFilter("All");
    setSearchTerm("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Attendance</h1>

            <p className="text-sm text-slate-400">Student Management</p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Students</h2>

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
                <h3 className="text-xl font-semibold">Add New Student</h3>

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

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              Filters
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl z-40">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-semibold">Filters</h4>

                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Clear
                  </button>
                </div>

                {/* Branch */}
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">
                    Branch
                  </label>

                  <select
                    value={branchFilter}
                    onChange={(event) => setBranchFilter(event.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  >
                    <option value="All">All Branches</option>

                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Semester
                  </label>

                  <select
                    value={semesterFilter}
                    onChange={(event) => setSemesterFilter(event.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none"
                  >
                    <option value="All">All Semesters</option>

                    {semesters.map((semester) => (
                      <option key={semester} value={semester.toString()}>
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

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
                    Actions
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
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      No students match your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-t border-slate-800"
                    >
                      <td className="px-6 py-4">{student.studentId}</td>

                      <td className="px-6 py-4 font-medium">{student.name}</td>

                      <td className="px-6 py-4 text-slate-400">
                        {student.branch}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {student.semester}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenActionMenu(
                                openActionMenu === student.studentId
                                  ? null
                                  : student.studentId,
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                          >
                            Actions ▾
                          </button>

                          {openActionMenu === student.studentId && (
                            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-30 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition"
                              >
                                View
                              </button>

                              <button
                                onClick={() => {
                                  setEditingStudent({ ...student });
                                  setOpenActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 transition"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => {
                                  setDeletingStudent(student);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Student Details</h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Student profile information
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Student ID</span>

                  <span className="font-medium">
                    {selectedStudent.studentId}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Name</span>

                  <span className="font-medium">{selectedStudent.name}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Branch</span>

                  <span className="font-medium">{selectedStudent.branch}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Semester</span>

                  <span className="font-medium">
                    {selectedStudent.semester}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Face Profile</span>

                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 text-yellow-400">
                    Not Registered
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Edit Student</h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Update student information
                  </p>
                </div>

                <button
                  onClick={() => setEditingStudent(null)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdate}>
                {/* Student ID */}
                <div className="mb-5">
                  <label className="block text-sm text-slate-300 mb-2">
                    Student ID
                  </label>

                  <input
                    type="number"
                    value={editingStudent.studentId}
                    disabled
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500"
                  />
                </div>

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-sm text-slate-300 mb-2">
                    Student Name
                  </label>

                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(event) =>
                      setEditingStudent({
                        ...editingStudent,
                        name: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Branch */}
                <div className="mb-5">
                  <label className="block text-sm text-slate-300 mb-2">
                    Branch
                  </label>

                  <input
                    type="text"
                    value={editingStudent.branch}
                    onChange={(event) =>
                      setEditingStudent({
                        ...editingStudent,
                        branch: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Semester */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-300 mb-2">
                    Semester
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editingStudent.semester}
                    onChange={(event) =>
                      setEditingStudent({
                        ...editingStudent,
                        semester: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
{deletingStudent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

      <div className="mb-6">

        <h3 className="text-2xl font-bold">
          Delete Student
        </h3>

        <p className="text-slate-400 mt-2">
          Are you sure you want to delete this student?
        </p>

      </div>

      <div className="bg-slate-800/60 rounded-xl p-4 mb-6">

        <p className="font-semibold">
          {deletingStudent.name}
        </p>

        <p className="text-sm text-slate-400 mt-1">
          Student ID: {deletingStudent.studentId}
        </p>

      </div>

      <p className="text-sm text-red-400 mb-6">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={() => setDeletingStudent(null)}
          disabled={deleting}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Student"}
        </button>

      </div>

    </div>

  </div>
)}
      </main>
    </div>
  );
}

export default StudentManagement;
