import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css";

function StudentLogin() {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        if (!studentId || !password) {
            setError("Student ID and password are required.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8080/auth/login", {
                studentId: Number(studentId), password
            });
            const data = response.data;
            if (data.role !== "STUDENT") {
                setError("This account is not a student account.");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("studentId", data.studentId);
            navigate("/student");
        } catch (loginError) {
            console.error("Student login failed:", loginError);
            if (loginError.response) {
                setError(typeof loginError.response.data === "string" ? loginError.response.data : "Invalid Student ID or password.");
            } else {
                setError("Unable to connect to server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-student"><div className="auth-topbar"><button className="auth-brand" type="button" onClick={() => navigate("/")}><span className="auth-brand-mark">A<span>+</span></span><span>Attend<span className="auth-brand-light">AI</span><small>SMART ATTENDANCE PLATFORM</small></span></button><button className="auth-back-home" type="button" onClick={() => navigate("/")}>← <span>Back to home</span></button></div>
            <main className="auth-layout"><section className="auth-showcase"><div className="auth-eyebrow"><span className="auth-live-dot"/> YOUR CAMPUS LIFE, AT A GLANCE</div><h1>Your progress.<br/><span>Your future.</span></h1><p className="auth-showcase-copy">Stay on top of your attendance, timetable and academic journey — wherever learning takes you.</p>
                <div className="auth-visual" aria-hidden="true"><div className="auth-orbit auth-orbit-one"/><div className="auth-orbit auth-orbit-two"/><div className="auth-scan-card student-preview"><div className="auth-scan-header"><span><i/> MY ATTENDANCE</span><b className="student-status-pill">ON TRACK</b></div><div className="student-progress-ring"><svg viewBox="0 0 140 140"><circle className="student-ring-track" cx="70" cy="70" r="54"/><circle className="student-ring-value" cx="70" cy="70" r="54"/></svg><div><strong>92<span>%</span></strong><small>Attendance</small></div></div><div className="student-preview-bottom"><span><i className="student-dot-green"/> Present <b>23</b></span><span><i className="student-dot-muted"/> Classes held <b>25</b></span></div><div className="student-preview-foot">Keep up the great work <b>✦</b></div></div><div className="auth-float-chip chip-one"><span>✓</span><div><b>Progress tracked</b><small>Your journey, clearly</small></div></div><div className="auth-float-chip chip-two"><span className="chip-spark">✦</span><div><b>Always in sync</b><small>Timetable at a glance</small></div></div><div className="auth-grid-glow"/></div><div className="auth-trust-row"><span>✦ Made for student success</span><span>·</span><span>Your progress matters</span></div></section>
                <section className="auth-form-side"><div className="auth-form-card"><div className="auth-role-icon student-role-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M6.5 11.3v4.3c3.2 2.7 7.8 2.7 11 0v-4.3M21.5 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></div><div className="auth-form-kicker">STUDENT PORTAL</div><h2>Welcome back</h2><p className="auth-form-subtitle">Sign in to view your student dashboard.</p>
                    <form onSubmit={handleLogin}><label className="auth-label" htmlFor="student-id">Student ID</label><div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 16c.7-1.5 2-2.2 4-2.2s3.3.7 4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><input id="student-id" type="number" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Enter your Student ID" autoComplete="username" min="1" required/></div><div className="auth-label-row"><label className="auth-label" htmlFor="student-password">Password</label></div><div className="auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><input id="student-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button className="auth-show-password" type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button></div>{error && <div className="auth-error" role="alert"><span>!</span>{error}</div>}<button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "Signing in…" : "Sign in to Student Portal"}</span><span className="auth-submit-arrow">↗</span></button></form>
                    <div className="auth-secure-note"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5"/><path d="m9.5 12 1.7 1.7 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>Your academic information stays protected.</div><div className="auth-role-switch"><span>Are you a different user?</span><button type="button" onClick={() => navigate("/login")}>Admin</button><i/><button type="button" onClick={() => navigate("/teacher-login")}>Teacher</button></div></div><footer className="auth-page-footer">© 2026 AttendAI <span>·</span> AI Attendance System</footer></section></main>
        </div>
    );
}
export default StudentLogin;
