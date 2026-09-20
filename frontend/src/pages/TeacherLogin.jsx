import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
    const navigate = useNavigate();

    const [teacherId, setTeacherId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await fetch(
            "http://localhost:8080/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    teacherId: Number(teacherId),
                    password: password
                })
            }
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Login failed.");
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);

        if (data.teacherId !== null) {
            localStorage.setItem(
                "teacherId",
                data.teacherId
            );
        }

        if (data.role === "TEACHER") {
            navigate("/teacher");
        } else {
            setError("This account is not a teacher account.");
        }

    } catch (error) {
        setError(
            error.message || "Unable to connect to server."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Teacher Login
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Sign in to your teacher account
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
                >

                    {/* Teacher ID */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm text-slate-300">
                            Teacher ID
                        </label>

                        <input
                            type="number"
                            value={teacherId}
                            onChange={(event) =>
                                setTeacherId(event.target.value)
                            }
                            placeholder="Enter your Teacher ID"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-4 w-full rounded-lg border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
                    >
                        Back
                    </button>

                </form>

            </div>

        </div>
    );
}

export default TeacherLogin;