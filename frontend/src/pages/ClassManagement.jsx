import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [showAddClass, setShowAddClass] = useState(false);

  const [newClass, setNewClass] = useState({
    branch: "",
    semester: "",
    section: "",
  });

  const [addingClass, setAddingClass] = useState(false);
  const [updatingClass, setUpdatingClass] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadClasses() {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);

      if (!response.ok) {
        throw new Error("Failed to load classes");
      }

      const data = await response.json();

      setClasses(data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      String(item.classId).includes(search) ||
      item.branch.toLowerCase().includes(search) ||
      String(item.semester).includes(search) ||
      item.section.toLowerCase().includes(search)
    );
  });

  // Add Class
  async function handleAddClass(event) {
    event.preventDefault();

    setAddingClass(true);

    try {
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: newClass.branch,
          semester: Number(newClass.semester),
          section: newClass.section,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add class");
      }

      setNewClass({
        branch: "",
        semester: "",
        section: "",
      });

      setShowAddClass(false);

      await loadClasses();
    } catch (error) {
      console.error("Failed to add class:", error);
      alert("Failed to add class.");
    } finally {
      setAddingClass(false);
    }
  }

  // Update Class
  async function handleUpdate(event) {
    event.preventDefault();

    setUpdatingClass(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/classes/${editingClass.classId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branch: editingClass.branch,
            semester: Number(editingClass.semester),
            section: editingClass.section,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update class");
      }

      setEditingClass(null);

      await loadClasses();
    } catch (error) {
      console.error("Failed to update class:", error);
      alert("Failed to update class.");
    } finally {
      setUpdatingClass(false);
    }
  }

  // Delete Class
  async function handleDelete() {
    if (!deletingClass) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/classes/${deletingClass.classId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      setDeletingClass(null);

      await loadClasses();
    } catch (error) {
      console.error("Failed to delete class:", error);
      alert("Failed to delete class.");
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
            Class Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage branches, semesters and sections.
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Classes
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {classes.length} class
              {classes.length !== 1 ? "es" : ""} registered
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full sm:w-72 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              onClick={() => setShowAddClass(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition whitespace-nowrap"
            >
              + Add Class
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible">

          {loading ? (

            <div className="p-10 text-center text-slate-400">
              Loading classes...
            </div>

          ) : filteredClasses.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-slate-300">
                No classes found.
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
                    Class ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Branch
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Section
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredClasses.map((item) => (

                  <tr
                    key={item.classId}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                  >

                    <td className="px-6 py-4 text-slate-300">
                      {item.classId}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.branch}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      Semester {item.semester}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      Section {item.section}
                    </td>

                    <td className="px-6 py-4 text-right relative">

                      <button
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === item.classId
                              ? null
                              : item.classId
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                      >
                        Actions ▾
                      </button>

                      {openActionMenu === item.classId && (

                        <div className="absolute right-6 top-14 z-30 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">

                          <button
                            onClick={() => {
                              setSelectedClass(item);
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              setEditingClass({ ...item });
                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setDeletingClass(item);
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

      {/* Add Class Modal */}
      {showAddClass && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Add Class
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Create a new academic class.
            </p>

            <form
              onSubmit={handleAddClass}
              className="mt-6 space-y-5"
            >

              {/* Branch */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Branch
                </label>

                <input
                  type="text"
                  placeholder="Example: CSE"
                  value={newClass.branch}
                  onChange={(event) =>
                    setNewClass({
                      ...newClass,
                      branch: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />

              </div>

              {/* Semester */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Semester
                </label>

                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Example: 6"
                  value={newClass.semester}
                  onChange={(event) =>
                    setNewClass({
                      ...newClass,
                      semester: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />

              </div>

              {/* Section */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Section
                </label>

                <input
                  type="text"
                  placeholder="Example: A"
                  value={newClass.section}
                  onChange={(event) =>
                    setNewClass({
                      ...newClass,
                      section: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  disabled={addingClass}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingClass}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {addingClass ? "Adding..." : "Add Class"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Modal */}
      {selectedClass && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Class Details
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Class ID
                </p>

                <p className="mt-1 font-medium">
                  {selectedClass.classId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Branch
                </p>

                <p className="mt-1 font-medium">
                  {selectedClass.branch}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Semester
                </p>

                <p className="mt-1 font-medium">
                  {selectedClass.semester}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Section
                </p>

                <p className="mt-1 font-medium">
                  {selectedClass.section}
                </p>
              </div>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedClass(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Edit Modal */}
      {editingClass && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Edit Class
            </h3>

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Class ID
                </label>

                <input
                  value={editingClass.classId}
                  disabled
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Branch
                </label>

                <input
                  type="text"
                  value={editingClass.branch}
                  onChange={(event) =>
                    setEditingClass({
                      ...editingClass,
                      branch: event.target.value,
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
                  value={editingClass.semester}
                  onChange={(event) =>
                    setEditingClass({
                      ...editingClass,
                      semester: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Section
                </label>

                <input
                  type="text"
                  value={editingClass.section}
                  onChange={(event) =>
                    setEditingClass({
                      ...editingClass,
                      section: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  disabled={updatingClass}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingClass}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {updatingClass ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Modal */}
      {deletingClass && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Delete Class
            </h3>

            <p className="text-slate-400 mt-2">
              Are you sure you want to delete this class?
            </p>

            <div className="bg-slate-800/60 rounded-xl p-4 mt-6">

              <p className="font-semibold">
                {deletingClass.branch} - Semester{" "}
                {deletingClass.semester}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Section {deletingClass.section}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Class ID: {deletingClass.classId}
              </p>

            </div>

            <p className="text-sm text-red-400 mt-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeletingClass(null)}
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
                {deleting ? "Deleting..." : "Delete Class"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ClassManagement;