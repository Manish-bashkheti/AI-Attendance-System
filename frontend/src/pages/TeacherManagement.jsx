import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [showAddTeacher, setShowAddTeacher] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
  });

  const [addingTeacher, setAddingTeacher] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);

      if (!response.ok) {
        throw new Error("Failed to load teachers");
      }

      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const search = searchTerm.toLowerCase();

    return (
      teacher.name.toLowerCase().includes(search) ||
      teacher.email.toLowerCase().includes(search) ||
      String(teacher.teacherId).includes(search)
    );
  });

  // Add Teacher
  async function handleAddTeacher(event) {
    event.preventDefault();

    setAddingTeacher(true);

    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });

      if (!response.ok) {
        throw new Error("Failed to add teacher");
      }

      setNewTeacher({
        name: "",
        email: "",
      });

      setShowAddTeacher(false);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to add teacher:", error);
      alert("Failed to add teacher.");
    } finally {
      setAddingTeacher(false);
    }
  }

  // Update Teacher
  async function handleUpdate(event) {
    event.preventDefault();

    setUpdatingTeacher(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${editingTeacher.teacherId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingTeacher.name,
            email: editingTeacher.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      setEditingTeacher(null);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to update teacher:", error);
      alert("Failed to update teacher.");
    } finally {
      setUpdatingTeacher(false);
    }
  }

  // Delete Teacher
  async function handleDelete() {
    if (!deletingTeacher) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${deletingTeacher.teacherId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      setDeletingTeacher(null);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      alert("Failed to delete teacher.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <h1 className="text-2xl font-bold">
            Teacher Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage teacher accounts and information.
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Teachers
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {teachers.length} teacher
              {teachers.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full sm:w-72 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Add Teacher */}
            <button
              onClick={() => setShowAddTeacher(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition whitespace-nowrap"
            >
              + Add Teacher
            </button>

          </div>

        </div>

        {/* Teacher Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible">

          {loading ? (

            <div className="p-10 text-center text-slate-400">
              Loading teachers...
            </div>

          ) : filteredTeachers.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-slate-300">
                No teachers found.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Try a different search term.
              </p>

            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-slate-800/50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Teacher ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Email
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.teacherId}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                  >

                    <td className="px-6 py-4 text-slate-300">
                      {teacher.teacherId}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {teacher.name}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {teacher.email}
                    </td>

                    <td className="px-6 py-4 text-right relative">

                      <button
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === teacher.teacherId
                              ? null
                              : teacher.teacherId
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                      >
                        Actions ▾
                      </button>

                      {openActionMenu === teacher.teacherId && (

                        <div className="absolute right-6 top-14 z-30 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">

                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              setEditingTeacher({ ...teacher });
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setDeletingTeacher(teacher);
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm text-red-400 hover:bg-slate-800 transition"
                          >
                            Delete
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </main>

      {/* Add Teacher Modal */}
      {showAddTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Add Teacher
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Create a new teacher account.
            </p>

            <form
              onSubmit={handleAddTeacher}
              className="mt-6 space-y-5"
            >

              {/* Name */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher Name
                </label>

                <input
                  type="text"
                  placeholder="Enter teacher name"
                  value={newTeacher.name}
                  onChange={(event) =>
                    setNewTeacher({
                      ...newTeacher,
                      name: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Email */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter teacher email"
                  value={newTeacher.email}
                  onChange={(event) =>
                    setNewTeacher({
                      ...newTeacher,
                      email: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  disabled={addingTeacher}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingTeacher}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {addingTeacher ? "Adding..." : "Add Teacher"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Teacher Modal */}
      {selectedTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Teacher Details
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Teacher ID
                </p>

                <p className="mt-1 font-medium">
                  {selectedTeacher.teacherId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="mt-1 font-medium">
                  {selectedTeacher.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1 font-medium break-all">
                  {selectedTeacher.email}
                </p>
              </div>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Edit Teacher
            </h3>

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              {/* Teacher ID */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher ID
                </label>

                <input
                  value={editingTeacher.teacherId}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500"
                />

              </div>

              {/* Name */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher Name
                </label>

                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(event) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      name: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Email */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(event) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      email: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  disabled={updatingTeacher}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingTeacher}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {updatingTeacher ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Confirmation Modal */}
      {deletingTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Delete Teacher
            </h3>

            <p className="text-slate-400 mt-2">
              Are you sure you want to delete this teacher?
            </p>

            <div className="bg-slate-800/60 rounded-xl p-4 mt-6">

              <p className="font-semibold">
                {deletingTeacher.name}
              </p>

              <p className="text-sm text-slate-400 mt-1 break-all">
                {deletingTeacher.email}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Teacher ID: {deletingTeacher.teacherId}
              </p>

            </div>

            <p className="text-sm text-red-400 mt-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeletingTeacher(null)}
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Teacher"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TeacherManagement;