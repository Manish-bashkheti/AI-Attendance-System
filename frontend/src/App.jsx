import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin/students" element={<StudentManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
