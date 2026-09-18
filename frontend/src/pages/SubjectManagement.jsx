import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [showAddSubject, setShowAddSubject] = useState(false);

  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    semester: "",
  });

  const [addingSubject, setAddingSubject] = useState(false);
  const [updatingSubject, setUpdatingSubject] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadSubjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`);

      if (!response.ok) {
        throw new Error("Failed to load subjects");
      }

      const data = await response.json();

      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const search = searchTerm.toLowerCase();

    return (
      String(subject.subjectId).includes(search) ||
      subject.subjectName.toLowerCase().includes(search) ||
      String(subject.semester).includes(search)
    );
  });

  // Add Subject
  async function handleAddSubject(event) {
    event.preventDefault();

    setAddingSubject(true);

    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: newSubject.subjectName,
          semester: Number(newSubject.semester),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add subject");
      }

      setNewSubject({
        subjectName: "",
        semester: "",
      });

      setShowAddSubject(false);

      await loadSubjects();
    } catch (error) {
      console.error("Failed to add subject:", error);
      alert("Failed to add subject.");
    } finally {
      setAddingSubject(false);
    }
  }

  // Update Subject
  async function handleUpdate(event) {
    event.preventDefault();

    setUpdatingSubject(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/subjects/${editingSubject.subjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectName: editingSubject.subjectName,
            semester: Number(editingSubject.semester),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subject");
      }

      setEditingSubject(null);

      await loadSubjects();
    } catch (error) {
      console.error("Failed to update subject:", error);
      alert("Failed to update subject.");
    } finally {
      setUpdatingSubject(false);
    }
  }

  // Delete Subject
  async function handleDelete() {
    if (!deletingSubject) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/subjects/${deletingSubject.subjectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      setDeletingSubject(null);

      await loadSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject.");
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
            Subject Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage academic subjects and semesters.
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Subjects
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {subjects.length} subject
              {subjects.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full sm:w-72 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Add Subject */}
            <button
              onClick={() => setShowAddSubject(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition whitespace-nowrap"
            >
              + Add Subject
            </button>

          </div>

        </div>

        {/* Subject Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible">

          {loading ? (

            <div className="p-10 text-center text-slate-400">
              Loading subjects...
            </div>

          ) : filteredSubjects.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-slate-300">
                No subjects found.
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
                    Subject ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Subject Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Semester
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredSubjects.map((subject) => (

                  <tr
                    key={subject.subjectId}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                  >

                    <td className="px-6 py-4 text-slate-300">
                      {subject.subjectId}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {subject.subjectName}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      Semester {subject.semester}
                    </td>

                    <td className="px-6 py-4 text-right relative">

                      <button
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === subject.subjectId
                              ? null
                              : subject.subjectId
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                      >
                        Actions ▾
                      </button>

                      {openActionMenu === subject.subjectId && (

                        <div className="absolute right-6 top-14 z-30 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">

                          <button
                            onClick={() => {
                              setSelectedSubject(subject);
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              setEditingSubject({ ...subject });
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setDeletingSubject(subject);
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

      {/* Add Subject Modal */}
      {showAddSubject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Add Subject
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Create a new academic subject.
            </p>

            <form
              onSubmit={handleAddSubject}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Subject Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Operating Systems"
                  value={newSubject.subjectName}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      subjectName: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Semester
                </label>

                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Example: 6"
                  value={newSubject.semester}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      semester: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  disabled={addingSubject}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingSubject}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {addingSubject ? "Adding..." : "Add Subject"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Subject Modal */}
      {selectedSubject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Subject Details
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Subject ID
                </p>

                <p className="mt-1 font-medium">
                  {selectedSubject.subjectId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Subject Name
                </p>

                <p className="mt-1 font-medium">
                  {selectedSubject.subjectName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Semester
                </p>

                <p className="mt-1 font-medium">
                  {selectedSubject.semester}
                </p>
              </div>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedSubject(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Edit Subject Modal */}
      {editingSubject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Edit Subject
            </h3>

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Subject ID
                </label>

                <input
                  value={editingSubject.subjectId}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Subject Name
                </label>

                <input
                  type="text"
                  value={editingSubject.subjectName}
                  onChange={(event) =>
                    setEditingSubject({
                      ...editingSubject,
                      subjectName: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Semester
                </label>

                <input
                  type="number"
                  min="1"
                  max="12"
                  value={editingSubject.semester}
                  onChange={(event) =>
                    setEditingSubject({
                      ...editingSubject,
                      semester: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  disabled={updatingSubject}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingSubject}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {updatingSubject ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Confirmation Modal */}
      {deletingSubject && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Delete Subject
            </h3>

            <p className="text-slate-400 mt-2">
              Are you sure you want to delete this subject?
            </p>

            <div className="bg-slate-800/60 rounded-xl p-4 mt-6">

              <p className="font-semibold">
                {deletingSubject.subjectName}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Semester {deletingSubject.semester}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Subject ID: {deletingSubject.subjectId}
              </p>

            </div>

            <p className="text-sm text-red-400 mt-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeletingSubject(null)}
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
                {deleting ? "Deleting..." : "Delete Subject"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default SubjectManagement;