import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function TimetableManagement() {
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [deletingTimetable, setDeletingTimetable] = useState(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [showAddTimetable, setShowAddTimetable] = useState(false);

  const [newTimetable, setNewTimetable] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });

  const [addingTimetable, setAddingTimetable] = useState(false);
  const [updatingTimetable, setUpdatingTimetable] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Load all data
  async function loadData() {
    try {
      setLoading(true);

      const [
        timetableResponse,
        classResponse,
        subjectResponse,
        teacherResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/timetables`),
        fetch(`${API_BASE_URL}/classes`),
        fetch(`${API_BASE_URL}/subjects`),
        fetch(`${API_BASE_URL}/teachers`),
      ]);

      if (
        !timetableResponse.ok ||
        !classResponse.ok ||
        !subjectResponse.ok ||
        !teacherResponse.ok
      ) {
        throw new Error("Failed to load timetable data");
      }

      const timetableData = await timetableResponse.json();
      const classData = await classResponse.json();
      const subjectData = await subjectResponse.json();
      const teacherData = await teacherResponse.json();

      setTimetables(timetableData);
      setClasses(classData);
      setSubjects(subjectData);
      setTeachers(teacherData);
    } catch (error) {
      console.error("Failed to load timetable data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getClassName(classId) {
    const classItem = classes.find(
      (item) => item.classId === classId
    );

    if (!classItem) {
      return "Unknown Class";
    }

    return `${classItem.branch} ${classItem.semester} ${classItem.section}`;
  }

  function getSubjectName(subjectId) {
    const subject = subjects.find(
      (item) => item.subjectId === subjectId
    );

    return subject ? subject.subjectName : "Unknown Subject";
  }

  function getTeacherName(teacherId) {
    const teacher = teachers.find(
      (item) => item.teacherId === teacherId
    );

    return teacher ? teacher.name : "Unknown Teacher";
  }

  function formatTime(time) {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  }

  const filteredTimetables = timetables.filter((timetable) => {
    const search = searchTerm.toLowerCase();

    const className = getClassName(timetable.classId).toLowerCase();
    const subjectName = getSubjectName(
      timetable.subjectId
    ).toLowerCase();
    const teacherName = getTeacherName(
      timetable.teacherId
    ).toLowerCase();

    return (
      className.includes(search) ||
      subjectName.includes(search) ||
      teacherName.includes(search) ||
      timetable.dayOfWeek.toLowerCase().includes(search)
    );
  });

  // Add timetable
  async function handleAddTimetable(event) {
    event.preventDefault();

    setAddingTimetable(true);

    try {
      const response = await fetch(`${API_BASE_URL}/timetables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: Number(newTimetable.classId),
          subjectId: Number(newTimetable.subjectId),
          teacherId: Number(newTimetable.teacherId),
          dayOfWeek: newTimetable.dayOfWeek,
          startTime: newTimetable.startTime,
          endTime: newTimetable.endTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add timetable");
      }

      setNewTimetable({
        classId: "",
        subjectId: "",
        teacherId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
      });

      setShowAddTimetable(false);

      await loadData();
    } catch (error) {
      console.error("Failed to add timetable:", error);
      alert("Failed to add timetable.");
    } finally {
      setAddingTimetable(false);
    }
  }

  // Update timetable
  async function handleUpdate(event) {
    event.preventDefault();

    setUpdatingTimetable(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/timetables/${editingTimetable.timetableId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: Number(editingTimetable.classId),
            subjectId: Number(editingTimetable.subjectId),
            teacherId: Number(editingTimetable.teacherId),
            dayOfWeek: editingTimetable.dayOfWeek,
            startTime: editingTimetable.startTime,
            endTime: editingTimetable.endTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update timetable");
      }

      setEditingTimetable(null);

      await loadData();
    } catch (error) {
      console.error("Failed to update timetable:", error);
      alert("Failed to update timetable.");
    } finally {
      setUpdatingTimetable(false);
    }
  }

  // Delete timetable
  async function handleDelete() {
    if (!deletingTimetable) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/timetables/${deletingTimetable.timetableId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete timetable");
      }

      setDeletingTimetable(null);

      await loadData();
    } catch (error) {
      console.error("Failed to delete timetable:", error);
      alert("Failed to delete timetable.");
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
            Timetable Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage classes, subjects, teachers and lecture timings.
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Timetable
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {timetables.length} lecture
              {timetables.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              placeholder="Search timetable..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full sm:w-72 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              onClick={() => setShowAddTimetable(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition whitespace-nowrap"
            >
              + Add Timetable
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible">

          {loading ? (

            <div className="p-10 text-center text-slate-400">
              Loading timetable...
            </div>

          ) : filteredTimetables.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-slate-300">
                No timetable entries found.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Add a timetable entry or try another search.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-800/50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Day
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Time
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Class
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Subject
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Teacher
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredTimetables.map((timetable) => (

                    <tr
                      key={timetable.timetableId}
                      className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                    >

                      <td className="px-6 py-4 font-medium">
                        {timetable.dayOfWeek}
                      </td>

                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {formatTime(timetable.startTime)}
                        {" - "}
                        {formatTime(timetable.endTime)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {getClassName(timetable.classId)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {getSubjectName(timetable.subjectId)}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {getTeacherName(timetable.teacherId)}
                      </td>

                      <td className="px-6 py-4 text-right relative">

                        <button
                          onClick={() =>
                            setOpenActionMenu(
                              openActionMenu === timetable.timetableId
                                ? null
                                : timetable.timetableId
                            )
                          }
                          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                        >
                          Actions ▾
                        </button>

                        {openActionMenu === timetable.timetableId && (

                          <div className="absolute right-6 top-14 z-30 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">

                            <button
                              onClick={() => {
                                setSelectedTimetable(timetable);
                                setOpenActionMenu(null);
                              }}
                              className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                setEditingTimetable({
                                  ...timetable,
                                  startTime: formatTime(
                                    timetable.startTime
                                  ),
                                  endTime: formatTime(
                                    timetable.endTime
                                  ),
                                });
                                setOpenActionMenu(null);
                              }}
                              className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                setDeletingTimetable(timetable);
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

            </div>

          )}

        </div>

      </main>

      {/* Add Timetable Modal */}
      {showAddTimetable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

            <h3 className="text-2xl font-bold">
              Add Timetable
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Schedule a lecture for a class.
            </p>

            <form
              onSubmit={handleAddTimetable}
              className="mt-6 space-y-5"
            >

              {/* Class */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Class
                </label>

                <select
                  value={newTimetable.classId}
                  onChange={(event) =>
                    setNewTimetable({
                      ...newTimetable,
                      classId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select Class
                  </option>

                  {classes.map((item) => (

                    <option
                      key={item.classId}
                      value={item.classId}
                    >
                      {item.branch} {item.semester}{" "}
                      {item.section}
                    </option>

                  ))}

                </select>

              </div>

              {/* Subject */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Subject
                </label>

                <select
                  value={newTimetable.subjectId}
                  onChange={(event) =>
                    setNewTimetable({
                      ...newTimetable,
                      subjectId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map((subject) => (

                    <option
                      key={subject.subjectId}
                      value={subject.subjectId}
                    >
                      {subject.subjectName} - Semester{" "}
                      {subject.semester}
                    </option>

                  ))}

                </select>

              </div>

              {/* Teacher */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher
                </label>

                <select
                  value={newTimetable.teacherId}
                  onChange={(event) =>
                    setNewTimetable({
                      ...newTimetable,
                      teacherId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select Teacher
                  </option>

                  {teachers.map((teacher) => (

                    <option
                      key={teacher.teacherId}
                      value={teacher.teacherId}
                    >
                      {teacher.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* Day */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Day
                </label>

                <select
                  value={newTimetable.dayOfWeek}
                  onChange={(event) =>
                    setNewTimetable({
                      ...newTimetable,
                      dayOfWeek: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select Day
                  </option>

                  {days.map((day) => (

                    <option key={day} value={day}>
                      {day}
                    </option>

                  ))}

                </select>

              </div>

              {/* Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={newTimetable.startTime}
                    onChange={(event) =>
                      setNewTimetable({
                        ...newTimetable,
                        startTime: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={newTimetable.endTime}
                    onChange={(event) =>
                      setNewTimetable({
                        ...newTimetable,
                        endTime: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowAddTimetable(false)}
                  disabled={addingTimetable}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingTimetable}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {addingTimetable
                    ? "Adding..."
                    : "Add Timetable"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Modal */}
      {selectedTimetable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Timetable Details
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Day
                </p>

                <p className="mt-1 font-medium">
                  {selectedTimetable.dayOfWeek}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Time
                </p>

                <p className="mt-1 font-medium">
                  {formatTime(selectedTimetable.startTime)}
                  {" - "}
                  {formatTime(selectedTimetable.endTime)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Class
                </p>

                <p className="mt-1 font-medium">
                  {getClassName(selectedTimetable.classId)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Subject
                </p>

                <p className="mt-1 font-medium">
                  {getSubjectName(selectedTimetable.subjectId)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Teacher
                </p>

                <p className="mt-1 font-medium">
                  {getTeacherName(selectedTimetable.teacherId)}
                </p>
              </div>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedTimetable(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Edit Modal */}
      {editingTimetable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

            <h3 className="text-2xl font-bold">
              Edit Timetable
            </h3>

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              {/* Class */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Class
                </label>

                <select
                  value={editingTimetable.classId}
                  onChange={(event) =>
                    setEditingTimetable({
                      ...editingTimetable,
                      classId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  {classes.map((item) => (

                    <option
                      key={item.classId}
                      value={item.classId}
                    >
                      {item.branch} {item.semester}{" "}
                      {item.section}
                    </option>

                  ))}

                </select>

              </div>

              {/* Subject */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Subject
                </label>

                <select
                  value={editingTimetable.subjectId}
                  onChange={(event) =>
                    setEditingTimetable({
                      ...editingTimetable,
                      subjectId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  {subjects.map((subject) => (

                    <option
                      key={subject.subjectId}
                      value={subject.subjectId}
                    >
                      {subject.subjectName} - Semester{" "}
                      {subject.semester}
                    </option>

                  ))}

                </select>

              </div>

              {/* Teacher */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher
                </label>

                <select
                  value={editingTimetable.teacherId}
                  onChange={(event) =>
                    setEditingTimetable({
                      ...editingTimetable,
                      teacherId: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  {teachers.map((teacher) => (

                    <option
                      key={teacher.teacherId}
                      value={teacher.teacherId}
                    >
                      {teacher.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* Day */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Day
                </label>

                <select
                  value={editingTimetable.dayOfWeek}
                  onChange={(event) =>
                    setEditingTimetable({
                      ...editingTimetable,
                      dayOfWeek: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                >

                  {days.map((day) => (

                    <option key={day} value={day}>
                      {day}
                    </option>

                  ))}

                </select>

              </div>

              {/* Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={editingTimetable.startTime}
                    onChange={(event) =>
                      setEditingTimetable({
                        ...editingTimetable,
                        startTime: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={editingTimetable.endTime}
                    onChange={(event) =>
                      setEditingTimetable({
                        ...editingTimetable,
                        endTime: event.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditingTimetable(null)}
                  disabled={updatingTimetable}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingTimetable}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {updatingTimetable
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Modal */}
      {deletingTimetable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Delete Timetable
            </h3>

            <p className="text-slate-400 mt-2">
              Are you sure you want to delete this timetable entry?
            </p>

            <div className="bg-slate-800/60 rounded-xl p-4 mt-6">

              <p className="font-semibold">
                {getClassName(deletingTimetable.classId)}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                {getSubjectName(deletingTimetable.subjectId)}
              </p>

              <p className="text-sm text-slate-400 mt-1">
                {deletingTimetable.dayOfWeek}{" "}
                {formatTime(deletingTimetable.startTime)}
                {" - "}
                {formatTime(deletingTimetable.endTime)}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {getTeacherName(deletingTimetable.teacherId)}
              </p>

            </div>

            <p className="text-sm text-red-400 mt-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeletingTimetable(null)}
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
                {deleting ? "Deleting..." : "Delete Timetable"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TimetableManagement;