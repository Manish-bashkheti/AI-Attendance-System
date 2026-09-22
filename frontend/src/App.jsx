import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==================== HOME ====================
import Home from "./pages/Home";

// ==================== AUTH ====================
import Login from "./pages/Login";
import TeacherLogin from "./pages/TeacherLogin";

// ==================== ADMIN ====================
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import TeacherManagement from "./pages/TeacherManagement";
import ClassManagement from "./pages/ClassManagement";
import SubjectManagement from "./pages/SubjectManagement";
import TimetableManagement from "./pages/TimetableManagement";
import AttendanceManagement from "./pages/AttendanceManagement";

// ==================== TEACHER ====================
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherTimetable from "./pages/TeacherTimetable";
import TeacherAttendance from "./pages/TeacherAttendance";

// ==================== PROTECTED ROUTE ====================
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================== HOME PAGE ==================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ==================== AUTH ==================== */}

        {/* Admin Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Teacher Login */}
        <Route
          path="/teacher-login"
          element={<TeacherLogin />}
        />


        {/* ==================== ADMIN ==================== */}

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Management */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <StudentManagement />
            </ProtectedRoute>
          }
        />

        {/* Teacher Management */}
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <TeacherManagement />
            </ProtectedRoute>
          }
        />

        {/* Class Management */}
        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ClassManagement />
            </ProtectedRoute>
          }
        />

        {/* Subject Management */}
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <SubjectManagement />
            </ProtectedRoute>
          }
        />

        {/* Timetable Management */}
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <TimetableManagement />
            </ProtectedRoute>
          }
        />

        {/* Attendance Management */}
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AttendanceManagement />
            </ProtectedRoute>
          }
        />


        {/* ==================== TEACHER ==================== */}

        {/* Teacher Dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Profile */}
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        {/* Teacher Timetable */}
        <Route
          path="/teacher/timetable"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherTimetable />
            </ProtectedRoute>
          }
        />

        {/* Teacher Attendance */}
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute allowedRole="TEACHER">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;