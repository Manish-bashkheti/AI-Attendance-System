import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedAttendance, setSelectedAttendance] = useState(null);

  async function loadData() {
    try {
      setLoading(true);

      const [
        attendanceResponse,
        studentResponse,
        subjectResponse,
        classResponse,
        teacherResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/attendance`),
        fetch(`${API_BASE_URL}/students`),
        fetch(`${API_BASE_URL}/subjects`),
        fetch(`${API_BASE_URL}/classes`),
        fetch(`${API_BASE_URL}/teachers`),
      ]);

      if (
        !attendanceResponse.ok ||
        !studentResponse.ok ||
        !subjectResponse.ok ||
        !classResponse.ok ||
        !teacherResponse.ok
      ) {
        throw new Error("Failed to load attendance data");
      }

      const attendanceData = await attendanceResponse.json();
      const studentData = await studentResponse.json();
      const subjectData = await subjectResponse.json();
      const classData = await classResponse.json();
      const teacherData = await teacherResponse.json();

      setAttendance(attendanceData);
      setStudents(studentData);
      setSubjects(subjectData);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (error) {
      console.error("Failed to load attendance data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getStudentName(studentId) {
    const student = students.find(
      (item) => item.studentId === studentId
    );

    return student ? student.name : "Unknown Student";
  }

  function getSubjectName(subjectId) {
    const subject = subjects.find(
      (item) => item.subjectId === subjectId
    );

    return subject ? subject.subjectName : "Unknown Subject";
  }

  function getClassName(classId) {
    const classItem = classes.find(
      (item) => item.classId === classId
    );

    if (!classItem) {
      return "Unknown Class";
    }

    return `${classItem.branch} ${classItem.semester} ${classItem.section}`;
  }

  function formatTime(time) {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  }

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const search = searchTerm.toLowerCase();

      const studentName = getStudentName(
        record.studentId
      ).toLowerCase();

      const subjectName = getSubjectName(
        record.subjectId
      ).toLowerCase();

      const className = getClassName(
        record.classId
      ).toLowerCase();

      const matchesSearch =
        studentName.includes(search) ||
        String(record.studentId).includes(search) ||
        subjectName.includes(search) ||
        className.includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        record.status === statusFilter;

      const matchesSubject =
        subjectFilter === "ALL" ||
        String(record.subjectId) === subjectFilter;

      const matchesClass =
        classFilter === "ALL" ||
        String(record.classId) === classFilter;

      const matchesDate =
        !dateFilter ||
        record.attendanceDate === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSubject &&
        matchesClass &&
        matchesDate
      );
    });
  }, [
    attendance,
    students,
    subjects,
    classes,
    searchTerm,
    statusFilter,
    subjectFilter,
    classFilter,
    dateFilter,
  ]);

  const totalRecords = filteredAttendance.length;

  const presentCount = filteredAttendance.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const absentCount = filteredAttendance.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const attendancePercentage =
    totalRecords > 0
      ? ((presentCount / totalRecords) * 100).toFixed(1)
      : "0.0";

  const uniqueStudents = new Set(
    filteredAttendance.map(
      (record) => record.studentId
    )
  ).size;

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSubjectFilter("ALL");
    setClassFilter("ALL");
    setDateFilter("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <h1 className="text-2xl font-bold">
            Attendance & Reports
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            View attendance records and attendance statistics.
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Total Records
            </p>

            <h3 className="text-3xl font-bold mt-3">
              {loading ? "..." : totalRecords}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Present
            </p>

            <h3 className="text-3xl font-bold mt-3 text-emerald-400">
              {loading ? "..." : presentCount}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Absent
            </p>

            <h3 className="text-3xl font-bold mt-3 text-red-400">
              {loading ? "..." : absentCount}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Attendance Rate
            </p>

            <h3 className="text-3xl font-bold mt-3 text-blue-400">
              {loading ? "..." : `${attendancePercentage}%`}
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              {uniqueStudents} student
              {uniqueStudents !== 1 ? "s" : ""} in current view
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <div className="flex-1">

              <label className="block text-sm text-slate-400 mb-2">
                Search
              </label>

              <input
                type="text"
                placeholder="Search student, ID, subject or class..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />

            </div>

            {/* Status */}
            <div className="w-full lg:w-44">

              <label className="block text-sm text-slate-400 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>

            </div>

            {/* Subject */}
            <div className="w-full lg:w-56">

              <label className="block text-sm text-slate-400 mb-2">
                Subject
              </label>

              <select
                value={subjectFilter}
                onChange={(event) =>
                  setSubjectFilter(event.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              >

                <option value="ALL">
                  All Subjects
                </option>

                {subjects.map((subject) => (

                  <option
                    key={subject.subjectId}
                    value={subject.subjectId}
                  >
                    {subject.subjectName}
                  </option>

                ))}

              </select>

            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">

            {/* Class */}
            <div className="w-full sm:w-56">

              <label className="block text-sm text-slate-400 mb-2">
                Class
              </label>

              <select
                value={classFilter}
                onChange={(event) =>
                  setClassFilter(event.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              >

                <option value="ALL">
                  All Classes
                </option>

                {classes.map((classItem) => (

                  <option
                    key={classItem.classId}
                    value={classItem.classId}
                  >
                    {classItem.branch}{" "}
                    {classItem.semester}{" "}
                    {classItem.section}
                  </option>

                ))}

              </select>

            </div>

            {/* Date */}
            <div className="w-full sm:w-56">

              <label className="block text-sm text-slate-400 mb-2">
                Date
              </label>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Clear */}
            <div className="flex items-end">

              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition"
              >
                Clear Filters
              </button>

            </div>

          </div>

        </div>

        {/* Attendance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-slate-400">
              Loading attendance records...
            </div>

          ) : filteredAttendance.length === 0 ? (

            <div className="p-10 text-center">

              <p className="text-slate-300">
                No attendance records found.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your filters.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-800/50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Student
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Class
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Subject
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Time
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAttendance.map((record) => (

                    <tr
                      key={record.attendanceId}
                      className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                    >

                      <td className="px-6 py-4">

                        <p className="font-medium">
                          {record.studentName ||
                            getStudentName(record.studentId)}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          ID: {record.studentId}
                        </p>

                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {getClassName(record.classId)}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {getSubjectName(record.subjectId)}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {record.attendanceDate}
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {formatTime(record.markedTime)}
                      </td>

                      <td className="px-6 py-4">

                        {record.status === "PRESENT" ? (

                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            PRESENT
                          </span>

                        ) : (

                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            ABSENT
                          </span>

                        )}

                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          onClick={() =>
                            setSelectedAttendance(record)
                          }
                          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

      {/* View Attendance Modal */}
      {selectedAttendance && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Attendance Details
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Student
                </p>

                <p className="mt-1 font-medium">
                  {selectedAttendance.studentName ||
                    getStudentName(
                      selectedAttendance.studentId
                    )}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  ID: {selectedAttendance.studentId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Class
                </p>

                <p className="mt-1 font-medium">
                  {getClassName(
                    selectedAttendance.classId
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Subject
                </p>

                <p className="mt-1 font-medium">
                  {getSubjectName(
                    selectedAttendance.subjectId
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-medium">
                  {selectedAttendance.attendanceDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Marked Time
                </p>

                <p className="mt-1 font-medium">
                  {formatTime(
                    selectedAttendance.markedTime
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    selectedAttendance.status === "PRESENT"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedAttendance.status}
                </p>
              </div>

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() =>
                  setSelectedAttendance(null)
                }
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AttendanceManagement;