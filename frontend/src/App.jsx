import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import TeacherManagement from "./pages/TeacherManagement";
import ClassManagement from "./pages/ClassManagement";
import SubjectManagement from "./pages/SubjectManagement";
import TimetableManagement from "./pages/TimetableManagement";
import AttendanceManagement from "./pages/AttendanceManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherProfile from "./pages/TeacherProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

       <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/students"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <StudentManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/teachers"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <TeacherManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/classes"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <ClassManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/subjects"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <SubjectManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/timetable"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <TimetableManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/attendance"
    element={
        <ProtectedRoute allowedRole="ADMIN">
            <AttendanceManagement />
        </ProtectedRoute>
    }
/>
<Route
    path="/teacher"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/teacher-login"
    element={<TeacherLogin />}
/>
<Route
    path="/teacher/profile"
    element={
        <ProtectedRoute allowedRole="TEACHER">
            <TeacherProfile />
        </ProtectedRoute>
    }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
