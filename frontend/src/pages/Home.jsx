import { useNavigate } from "react-router-dom";
import "./Home.css";

const roles = [
  {
    id: "admin",
    title: "Administrator",
    subtitle: "Control center",
    description: "Manage students, teachers, classes, subjects and the complete academic timetable.",
    route: "/login",
    icon: "⌘",
    className: "admin",
    action: "Continue as Admin",
    points: ["Manage campus data", "Monitor attendance", "Organize academics"],
  },
  {
    id: "teacher",
    title: "Teacher",
    subtitle: "Teaching workspace",
    description: "Start attendance sessions, review AI recognition and manage your daily classes.",
    route: "/teacher-login",
    icon: "▤",
    className: "teacher",
    action: "Continue as Teacher",
    points: ["Start attendance sessions", "Review student records", "View class timetable"],
  },
  {
    id: "student",
    title: "Student",
    subtitle: "Your learning space",
    description: "Check your attendance, personal details, timetable and academic information.",
    route: "/student-login",
    icon: "⌂",
    className: "student",
    action: "Continue as Student",
    points: ["Track attendance", "View your timetable", "Access your profile"],
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="attendance-home">
      <header className="home-nav">
        <button className="brand" onClick={() => navigate("/")} aria-label="AI Attendance home">
          <span className="brand-mark"><span>◎</span></span>
          <span className="brand-copy"><strong>AttendAI</strong><small>SMART CAMPUS PLATFORM</small></span>
        </button>
        <div className="nav-status"><span className="status-dot" /> Intelligent attendance <span className="nav-divider" /> Face recognition powered</div>
        <a className="nav-help" href="#choose-role">Get started <span>↗</span></a>
      </header>

      <main>
        <section className="home-hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-icon">✳</span> THE SMARTER WAY TO TAKE ATTENDANCE</div>
            <h1>Every presence.<br /><span>Precisely recorded.</span></h1>
            <p className="hero-description">A smarter campus starts here. Face recognition technology helps make attendance simple, organized and transparent for everyone.</p>
            <div className="hero-actions">
              <a className="primary-cta" href="#choose-role">Explore your workspace <span>→</span></a>
              <div className="trust-note"><span className="trust-icon">✓</span><span><strong>One platform, three workspaces</strong><small>Built for your campus community</small></span></div>
            </div>
            <div className="hero-proof"><div className="proof-symbols"><span>AD</span><span>TE</span><span>ST</span></div><span>Designed for administrators, teachers<br className="proof-break" /> and students alike</span></div>
          </div>

          <div className="hero-visual" aria-label="Illustration of an attendance dashboard">
            <div className="visual-glow" />
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="scan-card">
              <div className="scan-top"><span className="scan-live"><i /> AI RECOGNITION</span><span className="scan-menu">•••</span></div>
              <div className="scan-face-wrap">
                <div className="scan-grid" />
                <div className="scan-face"><div className="face-hair" /><div className="face-oval"><span className="face-eye eye-left" /><span className="face-eye eye-right" /><span className="face-nose" /><span className="face-mouth" /></div><div className="face-neck" /><div className="face-shirt" /></div>
                <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
                <div className="face-tag"><span>✓</span> Face detected</div>
              </div>
              <div className="scan-bottom"><div><small>RECOGNITION STATUS</small><strong><span className="status-dot" /> Ready to identify</strong></div><span className="scan-percent">AI <b>LIVE</b></span></div>
            </div>
            <div className="floating-card floating-attendance"><span className="float-icon green">✓</span><div><small>ATTENDANCE</small><strong>Smart & seamless</strong><span>Teacher controlled sessions</span></div></div>
            <div className="floating-card floating-campus"><span className="float-icon violet">✦</span><div><small>ONE CONNECTED CAMPUS</small><strong>3 dedicated workspaces</strong></div></div>
            <div className="visual-caption"><span className="caption-line" /> INTELLIGENT. EFFICIENT. CONNECTED.</div>
          </div>
          <div className="hero-bottom-line"><span>01 / A BETTER CAMPUS EXPERIENCE</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
        </section>

        <section className="role-section" id="choose-role">
          <div className="section-heading">
            <div><div className="section-kicker">YOUR CAMPUS, YOUR WORKSPACE</div><h2>Where would you like to go?</h2><p>Choose your role to enter your personalized workspace.</p></div>
            <div className="secure-label"><span>♧</span> Secure role-based access</div>
          </div>
          <div className="role-grid">
            {roles.map((role, index) => (
              <article className={`role-card ${role.className}`} key={role.id}>
                <div className="role-card-top"><div className="role-icon">{role.icon}</div><span className="role-number">0{index + 1} / 03</span></div>
                <div className="role-subtitle">{role.subtitle}</div>
                <h3>{role.title}</h3>
                <p className="role-description">{role.description}</p>
                <ul className="role-points">{role.points.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>
                <button className="role-button" onClick={() => navigate(role.route)}>{role.action}<span>↗</span></button>
              </article>
            ))}
          </div>
          <div className="privacy-strip"><span className="privacy-icon">◇</span><p><strong>Your role. Your access.</strong> Each workspace is designed around the tools and information relevant to you.</p><span className="privacy-end">MADE FOR MODERN CAMPUSES <b>✳</b></span></div>
        </section>
      </main>

      <footer className="home-footer"><div className="footer-brand"><span className="footer-mark">◎</span> AttendAI</div><span>© 2026 AI Attendance System</span><span>SMARTER ATTENDANCE, BETTER CAMPUS <b>↗</b></span></footer>
    </div>
  );
}

export default Home;
