import { useEffect, useMemo, useState } from "react";
import "./TeacherProfile.css";

const EMPTY_PROFILE = {
  name: "", dateOfBirth: "", gender: "", phone: "", email: "", address: "",
  department: "", ugQualification: "", ugSpecialization: "", pgQualification: "",
  pgSpecialization: "", doctorate: "", certifications: "", experience: "", joiningDate: ""
};

function TeacherProfile() {
  const teacherId = localStorage.getItem("teacherId");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      if (!teacherId) {
        setNotice({ type: "error", text: "Teacher ID nahi mila. Please dobara login karein." });
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/teachers/${teacherId}`);
        if (!response.ok) throw new Error("Profile load nahi ho payi. Backend connection check karein.");
        const data = await response.json();
        if (!cancelled) {
          setProfile({
            name: data.name || "", dateOfBirth: data.dateOfBirth || "", gender: data.gender || "",
            phone: data.phone || "", email: data.email || "", address: data.address || "",
            department: data.department || "", ugQualification: data.ugQualification || "",
            ugSpecialization: data.ugSpecialization || "", pgQualification: data.pgQualification || "",
            pgSpecialization: data.pgSpecialization || "", doctorate: data.doctorate || "",
            certifications: data.certifications || "", experience: data.experience ?? "",
            joiningDate: data.joiningDate || ""
          });
        }
      } catch (error) {
        if (!cancelled) setNotice({ type: "error", text: error.message || "Profile load karte waqt error aaya." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, [teacherId]);

  const initials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("") : "TC";
  }, [profile.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    if (notice.text) setNotice({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice({ type: "", text: "" });
    try {
      const response = await fetch(`http://localhost:8080/teachers/${teacherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name, dateOfBirth: profile.dateOfBirth, gender: profile.gender,
          phone: profile.phone, email: profile.email, address: profile.address,
          department: profile.department, ugQualification: profile.ugQualification,
          ugSpecialization: profile.ugSpecialization, pgQualification: profile.pgQualification,
          pgSpecialization: profile.pgSpecialization, doctorate: profile.doctorate,
          certifications: profile.certifications,
          experience: profile.experience === "" ? null : Number(profile.experience),
          joiningDate: profile.joiningDate
        })
      });
      if (!response.ok) throw new Error("Profile save nahi hui. Please details check karke dobara try karein.");
      setNotice({ type: "success", text: "Your profile has been saved successfully." });
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Profile save karte waqt error aaya." });
    } finally {
      setSaving(false);
    }
  };

  const completionFields = [profile.name, profile.email, profile.phone, profile.department, profile.ugQualification, profile.joiningDate];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const field = (label, name, options = {}) => (
    <div className={`tp-field ${options.full ? "tp-field-full" : ""}`} key={name}>
      <label htmlFor={`tp-${name}`}>{label}{options.required && <span className="tp-required"> *</span>}</label>
      {options.type === "select" ? (
        <select id={`tp-${name}`} name={name} value={profile[name]} onChange={handleChange}>
          <option value="">{options.placeholder || "Select option"}</option>
          {options.options.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      ) : options.type === "textarea" ? (
        <textarea id={`tp-${name}`} name={name} value={profile[name]} onChange={handleChange} placeholder={options.placeholder || `Enter ${label.toLowerCase()}`} rows={3} />
      ) : (
        <input id={`tp-${name}`} type={options.type || "text"} name={name} value={profile[name]} onChange={handleChange} placeholder={options.placeholder || `Enter ${label.toLowerCase()}`} min={options.min} />
      )}
    </div>
  );

  return (
    <main className="tp-page">
      <div className="tp-shell">
        <header className="tp-page-heading">
          <div>
            <div className="tp-eyebrow"><span className="tp-eyebrow-dot" /> FACULTY WORKSPACE</div>
            <h1>My Profile</h1>
            <p>Manage your personal details, qualifications and professional information.</p>
          </div>
          <div className="tp-heading-chip"><span>●</span> Teacher account</div>
        </header>

        <section className="tp-hero-card">
          <div className="tp-hero-glow tp-hero-glow-one" /><div className="tp-hero-glow tp-hero-glow-two" />
          <div className="tp-profile-identity">
            <div className="tp-avatar-wrap"><div className="tp-avatar">{initials}</div><span className="tp-avatar-status" /></div>
            <div className="tp-identity-copy">
              <span className="tp-identity-label">FACULTY PROFILE</span>
              <h2>{profile.name || (loading ? "Loading profile…" : "Your name")}</h2>
              <p>{profile.department || "Department not added yet"}</p>
              <div className="tp-identity-meta"><span className="tp-id-pill">ID&nbsp; {teacherId || "—"}</span><span className="tp-active-pill"><i /> Active account</span></div>
            </div>
          </div>
          <div className="tp-completion">
            <div className="tp-completion-top"><span>Profile completion</span><strong>{completion}%</strong></div>
            <div className="tp-progress-track"><div className="tp-progress-value" style={{ width: `${completion}%` }} /></div>
            <p>{completion === 100 ? "Great! Your key details are complete." : "Add your key details to complete your profile."}</p>
          </div>
        </section>

        {notice.text && <div className={`tp-notice tp-notice-${notice.type}`} role="status"><span>{notice.type === "success" ? "✓" : "!"}</span>{notice.text}</div>}

        {loading ? <div className="tp-loading"><span className="tp-spinner" /> Loading your profile details…</div> : (
          <form onSubmit={handleSubmit} className="tp-form">
            <section className="tp-section-card">
              <div className="tp-section-heading"><div className="tp-section-icon tp-icon-blue">01</div><div><h3>Personal information</h3><p>Basic details used to identify your faculty account.</p></div></div>
              <div className="tp-fields-grid">
                <div className="tp-field"><label htmlFor="tp-teacherId">Teacher ID</label><input id="tp-teacherId" value={teacherId || ""} disabled /><small>Your assigned ID cannot be edited.</small></div>
                {field("Full name", "name", { required: true })}
                {field("Date of birth", "dateOfBirth", { type: "date" })}
                {field("Gender", "gender", { type: "select", placeholder: "Select gender", options: ["Male", "Female", "Other"] })}
                {field("Phone number", "phone", { type: "tel", placeholder: "+91 00000 00000" })}
                {field("Email address", "email", { type: "email", placeholder: "name@college.edu" })}
                {field("Residential address", "address", { type: "textarea", full: true, placeholder: "Enter your address" })}
              </div>
            </section>

            <section className="tp-section-card">
              <div className="tp-section-heading"><div className="tp-section-icon tp-icon-purple">02</div><div><h3>Academic background</h3><p>Your education, specializations and certifications.</p></div></div>
              <div className="tp-fields-grid">
                {field("UG qualification", "ugQualification", { placeholder: "e.g. B.Tech, B.Sc." })}
                {field("UG specialization", "ugSpecialization", { placeholder: "e.g. Computer Science" })}
                {field("PG qualification", "pgQualification", { placeholder: "e.g. M.Tech, M.Sc." })}
                {field("PG specialization", "pgSpecialization", { placeholder: "e.g. Artificial Intelligence" })}
                {field("Doctorate", "doctorate", { type: "select", placeholder: "Select status", options: ["Yes", "No", "Pursuing"] })}
                {field("Certifications", "certifications", { placeholder: "e.g. AWS, Java, Python" })}
              </div>
            </section>

            <section className="tp-section-card">
              <div className="tp-section-heading"><div className="tp-section-icon tp-icon-green">03</div><div><h3>Professional details</h3><p>Your department and experience at the institution.</p></div></div>
              <div className="tp-fields-grid">
                {field("Department", "department", { placeholder: "e.g. Computer Science & Engineering" })}
                {field("Teaching experience (years)", "experience", { type: "number", min: "0", placeholder: "e.g. 5" })}
                {field("Joining date", "joiningDate", { type: "date" })}
              </div>
            </section>

            <div className="tp-form-footer"><div className="tp-save-hint"><span>🔒</span><span>Your profile information is managed securely within your institution.</span></div><div className="tp-form-actions"><button type="button" className="tp-btn tp-btn-secondary" onClick={() => window.location.reload()}>Discard changes</button><button type="submit" className="tp-btn tp-btn-primary" disabled={saving}><span>{saving ? "Saving…" : "Save changes"}</span><span aria-hidden="true">{saving ? "◌" : "→"}</span></button></div></div>
          </form>
        )}
        <footer className="tp-footer"><span>AttendAI · Faculty portal</span><span>Profile & account settings</span></footer>
      </div>
    </main>
  );
}

export default TeacherProfile;
