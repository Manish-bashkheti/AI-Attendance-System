import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import TeacherManagement from "./pages/TeacherManagement";
import ClassManagement from "./pages/ClassManagement";
import SubjectManagement from "./pages/SubjectManagement";
import TimetableManagement from "./pages/TimetableManagement";
import AttendanceManagement from "./pages/AttendanceManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/teachers" element={<TeacherManagement />} />
        <Route path="/admin/classes" element={<ClassManagement />} />
        <Route path="/admin/subjects" element={<SubjectManagement />} />
        <Route path="/admin/timetable" element={<TimetableManagement />} />
        <Route path="/admin/attendance" element={<AttendanceManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
