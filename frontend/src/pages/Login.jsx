import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Login failed.");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);

            if (data.studentId !== null && data.studentId !== undefined) {
                localStorage.setItem("studentId", data.studentId);
            }
            if (data.teacherId !== null && data.teacherId !== undefined) {
                localStorage.setItem("teacherId", data.teacherId);
            }

            if (data.role === "ADMIN") navigate("/admin");
            else setError("This account does not have access to the Admin dashboard.");
        } catch (loginError) {
            setError(loginError.message || "Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-admin">
            <div className="auth-topbar">
                <button className="auth-brand" type="button" onClick={() => navigate("/")}>
                    <span className="auth-brand-mark">A<span>+</span></span>
                    <span>Attend<span className="auth-brand-light">AI</span><small>SMART ATTENDANCE PLATFORM</small></span>
                </button>
                <button className="auth-back-home" type="button" onClick={() => navigate("/")}>← <span>Back to home</span></button>
            </div>

            <main className="auth-layout">
                <section className="auth-showcase">
                    <div className="auth-eyebrow"><span className="auth-live-dot" /> INTELLIGENT CAMPUS MANAGEMENT</div>
                    <h1>Attendance,<br />made <span>intelligent.</span></h1>
                    <p className="auth-showcase-copy">One secure workspace to manage your campus, people and attendance — with the power of AI.</p>
                    <div className="auth-visual" aria-hidden="true">
                        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" />
                        <div className="auth-scan-card">
                            <div className="auth-scan-header"><span><i /> AI RECOGNITION</span><b>LIVE</b></div>
                            <div className="auth-face-graphic"><div className="auth-face-halo" /><div className="auth-face-head"><i className="eye eye-left"/><i className="eye eye-right"/><i className="face-nose"/><i className="face-mouth"/></div><div className="scan-corner corner-tl"/><div className="scan-corner corner-tr"/><div className="scan-corner corner-bl"/><div className="scan-corner corner-br"/><div className="auth-scan-line"/></div>
                            <div className="auth-scan-footer"><span><b>98.6%</b><small>Match confidence</small></span><span className="auth-scan-check">✓</span></div>
                        </div>
                        <div className="auth-float-chip chip-one"><span>✓</span><div><b>Secure access</b><small>Identity verified</small></div></div>
                        <div className="auth-float-chip chip-two"><span className="chip-spark">✦</span><div><b>AI-powered</b><small>Smart recognition</small></div></div>
                        <div className="auth-grid-glow" />
                    </div>
                    <div className="auth-trust-row"><span>✦ Built for modern campuses</span><span>·</span><span>Secure by design</span></div>
                </section>

                <section className="auth-form-side">
                    <div className="auth-form-card">
                        <div className="auth-role-icon admin-role-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        <div className="auth-form-kicker">ADMIN PORTAL</div>
                        <h2>Welcome back</h2>
                        <p className="auth-form-subtitle">Sign in to manage your campus workspace.</p>
                        <form onSubmit={handleLogin}>
                            <label className="auth-label" htmlFor="admin-email">Email address</label>
                            <div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcampus.edu" autoComplete="username" required /></div>
                            <div className="auth-label-row"><label className="auth-label" htmlFor="admin-password">Password</label></div>
                            <div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button className="auth-show-password" type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></div>
                            {error && <div className="auth-error" role="alert"><span>!</span>{error}</div>}
                            <button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "Signing in…" : "Sign in to Admin"}</span><span className="auth-submit-arrow">↗</span></button>
                        </form>
                        <div className="auth-secure-note"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5"/><path d="m9.5 12 1.7 1.7 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Your session is protected with secure authentication.</div>
                        <div className="auth-role-switch"><span>Not an administrator?</span><button type="button" onClick={() => navigate("/teacher-login")}>Teacher</button><i /> <button type="button" onClick={() => navigate("/student-login")}>Student</button></div>
                    </div>
                    <footer className="auth-page-footer">© 2026 AttendAI <span>·</span> AI Attendance System</footer>
                </section>
            </main>
        </div>
    );
}

export default Login;
