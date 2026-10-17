import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

function TeacherLogin() {
    const navigate = useNavigate();
    const [teacherId, setTeacherId] = useState("");
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
                body: JSON.stringify({ teacherId: Number(teacherId), password })
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Login failed.");
            }
            const data = await response.json();
            if (data.role !== "TEACHER") {
                setError("This account is not a teacher account.");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);
            if (data.teacherId !== null && data.teacherId !== undefined) localStorage.setItem("teacherId", data.teacherId);
            navigate("/teacher");
        } catch (loginError) {
            setError(loginError.message || "Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-teacher">
            <div className="auth-topbar"><button className="auth-brand" type="button" onClick={() => navigate("/")}><span className="auth-brand-mark">A<span>+</span></span><span>Attend<span className="auth-brand-light">AI</span><small>SMART ATTENDANCE PLATFORM</small></span></button><button className="auth-back-home" type="button" onClick={() => navigate("/")}>← <span>Back to home</span></button></div>
            <main className="auth-layout">
                <section className="auth-showcase"><div className="auth-eyebrow"><span className="auth-live-dot" /> YOUR CLASSROOM, CONNECTED</div><h1>Teach more.<br /><span>Track smarter.</span></h1><p className="auth-showcase-copy">Your daily teaching tools, timetable and attendance — all together in one simple workspace.</p>
                    <div className="auth-visual" aria-hidden="true"><div className="auth-orbit auth-orbit-one"/><div className="auth-orbit auth-orbit-two"/><div className="auth-scan-card teacher-preview"><div className="auth-scan-header"><span><i/> TODAY'S CLASS</span><b className="teacher-live-pill">SCHEDULED</b></div><div className="teacher-preview-content"><div className="teacher-avatar-stack"><span>CS</span><span>AI</span><span>DB</span></div><div><strong>Computer Science</strong><small>Semester 6 · Section A</small></div></div><div className="teacher-preview-stats"><span><b>32</b><small>Students</small></span><span><b>09:30</b><small>Class starts</small></span></div><div className="teacher-progress"><span/></div><div className="teacher-preview-foot">Your next class is ready <b>→</b></div></div><div className="auth-float-chip chip-one"><span>✓</span><div><b>Attendance ready</b><small>One click to begin</small></div></div><div className="auth-float-chip chip-two"><span className="chip-spark">✦</span><div><b>Less paperwork</b><small>More time to teach</small></div></div><div className="auth-grid-glow"/></div>
                    <div className="auth-trust-row"><span>✦ Built for educators</span><span>·</span><span>Simple, secure access</span></div></section>
                <section className="auth-form-side"><div className="auth-form-card"><div className="auth-role-icon teacher-role-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M5 20v-1.5a7 7 0 0 1 14 0V20M18 4.5a3.5 3.5 0 0 1 0 7M20 16a4.5 4.5 0 0 1 2 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></div><div className="auth-form-kicker">TEACHER PORTAL</div><h2>Welcome back</h2><p className="auth-form-subtitle">Sign in to access your teaching workspace.</p>
                    <form onSubmit={handleLogin}><label className="auth-label" htmlFor="teacher-id">Teacher ID</label><div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 16c.7-1.5 2-2.2 4-2.2s3.3.7 4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><input id="teacher-id" type="number" value={teacherId} onChange={e => setTeacherId(e.target.value)} placeholder="Enter your Teacher ID" autoComplete="username" required min="1"/></div><div className="auth-label-row"><label className="auth-label" htmlFor="teacher-password">Password</label></div><div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><input id="teacher-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button className="auth-show-password" type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></div>{error && <div className="auth-error" role="alert"><span>!</span>{error}</div>}<button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "Signing in…" : "Sign in to Teacher Portal"}</span><span className="auth-submit-arrow">↗</span></button></form>
                    <div className="auth-secure-note"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5"/><path d="m9.5 12 1.7 1.7 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Your account is provisioned securely by your administrator.</div><div className="auth-role-switch"><span>Logging in as someone else?</span><button type="button" onClick={() => navigate("/login")}>Admin</button><i/><button type="button" onClick={() => navigate("/student-login")}>Student</button></div></div><footer className="auth-page-footer">© 2026 AttendAI <span>·</span> AI Attendance System</footer></section>
            </main>
        </div>
    );
}
export default TeacherLogin;
