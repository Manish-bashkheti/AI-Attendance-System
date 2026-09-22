import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentLogin() {
    const navigate = useNavigate();

    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!studentId || !password) {
            setError("Student ID and password are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/auth/login",
                {
                    studentId: Number(studentId),
                    password: password
                }
            );

            const data = response.data;

            // Make sure this is a student account
            if (data.role !== "STUDENT") {
                setError("This account is not a student account.");
                return;
            }

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("studentId", data.studentId);

            // Go to student dashboard
            navigate("/student");

        } catch (error) {
            console.error("Student login failed:", error);

            if (error.response) {
                setError(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Invalid Student ID or password."
                );
            } else {
                setError("Unable to connect to server.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Student Login
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Login using your Student ID
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Student ID
                        </label>

                        <input
                            type="number"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Enter Student ID"
                            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-4 text-gray-600 hover:text-blue-600"
                >
                    ← Back to Home
                </button>

            </div>

        </div>
    );
}

export default StudentLogin;