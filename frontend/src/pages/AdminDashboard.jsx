import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudents,
  getTeachers,
  getSubjects,
  getClasses,
} from "../services/api";
import "./AdminDashboard.css";

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  teacher: <><path d="m3 8 9-5 9 5-9 5-9-5Z"/><path d="M7 10.2v5.1c3 2.5 7 2.5 10 0v-5.1M21 8v6"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6a1 1 0 0 0 1-1v-1H8v1a1 1 0 0 0 1 1ZM8 11h8M8 15h8"/></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
};
function Icon({ name, size = 20 }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name] || iconPaths.grid}</svg>;
}

const navGroups = [
  { title: "WORKSPACE", items: [{ label: "Overview", path: "/admin", icon: "grid" }] },
  { title: "MANAGEMENT", items: [
    { label: "Students", path: "/admin/students", icon: "users" },
    { label: "Teachers", path: "/admin/teachers", icon: "teacher" },
    { label: "Classes", path: "/admin/classes", icon: "layers" },
    { label: "Subjects", path: "/admin/subjects", icon: "book" },
    { label: "Timetable", path: "/admin/timetable", icon: "calendar" },
    { label: "Attendance records", path: "/admin/attendance", icon: "clipboard" },
  ]},
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    const results = await Promise.allSettled([getStudents(), getTeachers(), getSubjects(), getClasses()]);
    const setters = [setStudents, setTeachers, setSubjects, setClasses];
    let failed = false;
    results.forEach((result, index) => {
      if (result.status === "fulfilled") setters[index](Array.isArray(result.value) ? result.value : []);
      else failed = true;
    });
    if (failed) setError("Some dashboard data could not be loaded. Check that the backend is running, then refresh.");
    setLoading(false);
  }

  useEffect(() => { loadDashboard(); }, []);

  const stats = useMemo(() => [
    { label: "Total students", value: students.length, icon: "users", tone: "violet", note: "Registered in the system", path: "/admin/students" },
    { label: "Total teachers", value: teachers.length, icon: "teacher", tone: "blue", note: "Faculty accounts", path: "/admin/teachers" },
    { label: "Classes & sections", value: classes.length, icon: "layers", tone: "mint", note: "Academic groups", path: "/admin/classes" },
    { label: "Subjects", value: subjects.length, icon: "book", tone: "amber", note: "Available subjects", path: "/admin/subjects" },
  ], [students, teachers, classes, subjects]);

  const actions = [
    { label: "Manage students", detail: "Add students and update records", icon: "users", tone: "violet", path: "/admin/students" },
    { label: "Manage teachers", detail: "Maintain faculty information", icon: "teacher", tone: "blue", path: "/admin/teachers" },
    { label: "Set up classes", detail: "Organise sections and semesters", icon: "layers", tone: "mint", path: "/admin/classes" },
    { label: "Manage subjects", detail: "Keep subject records up to date", icon: "book", tone: "amber", path: "/admin/subjects" },
    { label: "Build timetable", detail: "Arrange classes and lecture times", icon: "calendar", tone: "pink", path: "/admin/timetable" },
    { label: "Attendance reports", detail: "Review saved attendance records", icon: "clipboard", tone: "cyan", path: "/admin/attendance" },
  ];
  const filteredActions = actions.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" onClick={() => navigate("/admin")} aria-label="AttendAI overview">
          <span className="admin-brand-mark"><Icon name="spark" size={23} /></span>
          <span className="admin-brand-copy"><strong>Attend<span>AI</span></strong><small>SMART CAMPUS</small></span>
        </button>
        <div className="admin-side-label">MAIN MENU</div>
        <nav className="admin-nav">
          {navGroups.map((group) => <div className="admin-nav-group" key={group.title}>
            <div className="admin-nav-heading">{group.title}</div>
            {group.items.map((item) => <button key={item.path} className={`admin-nav-item ${item.path === "/admin" ? "active" : ""}`} onClick={() => navigate(item.path)}>
              <Icon name={item.icon} size={18} /><span>{item.label}</span>{item.path === "/admin" && <span className="admin-active-dot" />}
            </button>)}
          </div>)}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-help-card"><span className="admin-help-icon"><Icon name="spark" size={18} /></span><strong>Campus at a glance</strong><p>Manage your academic operations from one place.</p></div>
          <button className="admin-nav-item admin-logout" onClick={() => navigate("/login")}><Icon name="logout" size={18} /><span>Log out</span></button>
          <div className="admin-sidebar-user"><div className="admin-avatar">AD</div><div><strong>Administrator</strong><small>System access</small></div><span className="admin-online" title="Online" /></div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Workspace</span><b>/</b><strong>Overview</strong></div>
          <div className="admin-topbar-right">
            <label className="admin-search"><Icon name="search" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quick actions..." aria-label="Search quick actions" /><kbd>⌘ K</kbd></label>
            <div className="admin-top-avatar" title="Administrator">AD</div>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome-row">
            <div><div className="admin-eyebrow"><span className="admin-eyebrow-dot" /> ADMIN CONTROL CENTER</div><h1>Good to see you, Admin <span>✦</span></h1><p>Here’s your campus overview. Everything you need, all in one place.</p></div>
            <button className="admin-refresh-btn" onClick={loadDashboard} disabled={loading}><span className={loading ? "admin-spin" : ""}>↻</span> {loading ? "Refreshing" : "Refresh data"}</button>
          </section>

          {error && <div className="admin-error" role="status"><span>!</span><div>{error}</div><button onClick={loadDashboard}>Try again</button></div>}

          <section className="admin-stats-grid" aria-label="Campus statistics">
            {stats.map((stat, index) => <button className="admin-stat-card" key={stat.label} onClick={() => navigate(stat.path)}>
              <div className="admin-stat-top"><span className={`admin-stat-icon ${stat.tone}`}><Icon name={stat.icon} size={21} /></span><span className="admin-stat-arrow"><Icon name="arrow" size={17} /></span></div>
              <div className="admin-stat-value">{loading ? <span className="admin-skeleton" /> : stat.value}</div>
              <div className="admin-stat-label">{stat.label}</div><div className="admin-stat-note"><span className="admin-note-dot" />{stat.note}</div>
              <span className={`admin-stat-bottom ${stat.tone}`} />
            </button>)}
          </section>

          <section className="admin-section-heading"><div><div className="admin-section-kicker">GET THINGS DONE</div><h2>Quick access</h2><p>Jump straight into the tasks you use most.</p></div><span className="admin-action-count">{filteredActions.length} shortcuts</span></section>
          <section className="admin-actions-grid" aria-label="Management shortcuts">
            {filteredActions.map((action) => <button className="admin-action-card" key={action.path} onClick={() => navigate(action.path)}>
              <span className={`admin-action-icon ${action.tone}`}><Icon name={action.icon} size={21} /></span>
              <span className="admin-action-text"><strong>{action.label}</strong><small>{action.detail}</small></span>
              <span className="admin-action-arrow"><Icon name="arrow" size={17} /></span>
            </button>)}
            {filteredActions.length === 0 && <div className="admin-empty-search">No shortcuts match “{search}”. Try another search.</div>}
          </section>

          <section className="admin-bottom-grid">
            <div className="admin-insight-card"><div className="admin-insight-art"><div className="admin-orbit orbit-one"/><div className="admin-orbit orbit-two"/><span><Icon name="spark" size={29}/></span></div><div className="admin-insight-copy"><span className="admin-section-kicker">BUILT FOR YOUR CAMPUS</span><h3>A smarter way to manage attendance.</h3><p>Keep student records, faculty, timetables and attendance workflows organised from one dashboard.</p><button onClick={() => navigate("/admin/attendance")}>Explore attendance <Icon name="arrow" size={16}/></button></div></div>
            <div className="admin-system-card"><div className="admin-system-head"><span className="admin-system-check"><Icon name="check" size={17}/></span><div><strong>System overview</strong><small>Live data connection status</small></div></div><div className="admin-system-row"><span>Student records</span><span className={loading ? "status-loading" : "status-ready"}><i/>{loading ? "Loading" : "Loaded"}</span></div><div className="admin-system-row"><span>Teacher records</span><span className={loading ? "status-loading" : "status-ready"}><i/>{loading ? "Loading" : "Loaded"}</span></div><div className="admin-system-row"><span>Academic setup</span><span className={loading ? "status-loading" : "status-ready"}><i/>{loading ? "Loading" : "Loaded"}</span></div><p className="admin-system-foot">Status reflects the latest dashboard request.</p></div>
          </section>
          <footer className="admin-footer"><span>© {new Date().getFullYear()} AttendAI · Smart Campus Management</span><span><i/> Designed for simpler campus operations</span></footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
