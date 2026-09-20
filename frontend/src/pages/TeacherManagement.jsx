import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [showAddTeacher, setShowAddTeacher] = useState(false);

  // Admin only enters these three fields.
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
  });

  const [addingTeacher, setAddingTeacher] = useState(false);
  const [updatingTeacher, setUpdatingTeacher] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createdCredentials, setCreatedCredentials] = useState(null);

  const [adminVerification, setAdminVerification] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");

  async function loadTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);

      if (!response.ok) {
        throw new Error("Failed to load teachers");
      }

      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const search = searchTerm.toLowerCase();

    return (
      teacher.name?.toLowerCase().includes(search) ||
      teacher.email?.toLowerCase().includes(search) ||
      String(teacher.teacherId).includes(search)
    );
  });

  // Add Teacher
  async function handleAddTeacher(event) {
    event.preventDefault();

    setAddingTeacher(true);

    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });

      if (!response.ok) {
        throw new Error("Failed to add teacher");
      }

      const createdTeacher = await response.json();

      // Automatically create teacher login account.
      const accountResponse = await fetch(
        `${API_BASE_URL}/teachers/${createdTeacher.teacherId}/create-account`,
        {
          method: "POST",
        },
      );

      const accountMessage = await accountResponse.text();

      if (!accountResponse.ok) {
        throw new Error(
          accountMessage || "Failed to create teacher account",
        );
      }

      // Backend returns "Initial password: ..."
      const passwordMatch = accountMessage.match(
        /Initial password:\s*(.+)$/i,
      );

      const initialPassword = passwordMatch
        ? passwordMatch[1].trim()
        : "Not available";

      setCreatedCredentials({
        name: createdTeacher.name,
        email: createdTeacher.email,
        teacherId: createdTeacher.teacherId,
        initialPassword: initialPassword,
      });

      setNewTeacher({
        name: "",
        email: "",
        dateOfBirth: "",
      });

      setShowAddTeacher(false);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to add teacher:", error);
      alert(error.message || "Failed to add teacher.");
    } finally {
      setAddingTeacher(false);
    }
  }

  // Update complete teacher profile.
  async function handleUpdate(event) {
    event.preventDefault();

    setUpdatingTeacher(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${editingTeacher.teacherId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingTeacher.name,
            dateOfBirth: editingTeacher.dateOfBirth,
            gender: editingTeacher.gender,
            phone: editingTeacher.phone,
            email: editingTeacher.email,
            address: editingTeacher.address,
            department: editingTeacher.department,
            ugQualification: editingTeacher.ugQualification,
            ugSpecialization: editingTeacher.ugSpecialization,
            pgQualification: editingTeacher.pgQualification,
            pgSpecialization: editingTeacher.pgSpecialization,
            doctorate: editingTeacher.doctorate,
            certifications: editingTeacher.certifications,
            experience: editingTeacher.experience,
            joiningDate: editingTeacher.joiningDate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      setEditingTeacher(null);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to update teacher:", error);
      alert(error.message || "Failed to update teacher.");
    } finally {
      setUpdatingTeacher(false);
    }
  }

  // Verify Admin password before sensitive teacher actions.
  async function verifyAdminPassword() {
    if (!adminVerification) {
      return;
    }

    if (!adminPassword) {
      alert("Please enter the admin password.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            password: adminPassword,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Invalid admin password.");
      }

      const action = adminVerification.action;
      const teacher = adminVerification.teacher;

      setAdminVerification(null);
      setAdminPassword("");

      if (action === "VIEW") {
        setSelectedTeacher(teacher);
      }

      if (action === "EDIT") {
        setEditingTeacher({ ...teacher });
      }

      if (action === "DELETE") {
        setDeletingTeacher(teacher);
      }
    } catch (error) {
      alert(error.message || "Admin verification failed.");
    }
  }

  // Delete Teacher
  async function handleDelete() {
    if (!deletingTeacher) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${deletingTeacher.teacherId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      setDeletingTeacher(null);

      await loadTeachers();
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      alert(error.message || "Failed to delete teacher.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold">
            Teacher Management
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage teacher accounts and information.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Teachers
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {teachers.length} teacher
              {teachers.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full sm:w-72 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Add Teacher */}
            <button
              onClick={() => setShowAddTeacher(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition whitespace-nowrap"
            >
              + Add Teacher
            </button>

          </div>
        </div>

        {/* Teacher Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-visible">

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading teachers...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-300">
                No teachers found.
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Try a different search term.
              </p>
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-slate-800/50">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Teacher ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                    Email
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.teacherId}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition"
                  >

                    <td className="px-6 py-4 text-slate-300">
                      {teacher.teacherId}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {teacher.name}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {teacher.email}
                    </td>

                    <td className="px-6 py-4 text-right relative">

                      <button
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === teacher.teacherId
                              ? null
                              : teacher.teacherId,
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition"
                      >
                        Actions ▾
                      </button>

                      {openActionMenu === teacher.teacherId && (

                        <div className="absolute right-6 top-14 z-30 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden text-left">

                          <button
                            onClick={() => {
                              setAdminVerification({
                                action: "VIEW",
                                teacher: teacher,
                              });

                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              setAdminVerification({
                                action: "EDIT",
                                teacher: teacher,
                              });

                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm hover:bg-slate-800 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setAdminVerification({
                                action: "DELETE",
                                teacher: teacher,
                              });

                              setOpenActionMenu(null);
                            }}
                            className="w-full px-4 py-3 text-sm text-red-400 hover:bg-slate-800 transition"
                          >
                            Delete
                          </button>

                        </div>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>
            </table>
          )}

        </div>
      </main>

      {/* Teacher Account Credentials Modal */}
      {createdCredentials && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                ✓
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  Teacher Account Created
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Login credentials are ready.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Teacher
                </p>

                <p className="mt-1 font-semibold">
                  {createdCredentials.name}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  User ID
                </p>

                <p className="mt-1 font-medium break-all">
                  {createdCredentials.email}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Initial Password
                </p>

                <p className="mt-1 font-semibold text-blue-400">
                  {createdCredentials.initialPassword}
                </p>
              </div>

            </div>

            <p className="text-sm text-yellow-400 mt-5">
              Share these credentials securely with the teacher.
            </p>

            <div className="flex justify-end mt-6">

              <button
                onClick={() =>
                  setCreatedCredentials(null)
                }
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
              >
                Done
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Add Teacher
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Enter only the basic information required to create the teacher account.
            </p>

            <form
              onSubmit={handleAddTeacher}
              className="mt-6 space-y-5"
            >

              {/* Name */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Teacher Name
                </label>

                <input
                  type="text"
                  placeholder="Enter teacher name"
                  value={newTeacher.name}
                  onChange={(event) =>
                    setNewTeacher({
                      ...newTeacher,
                      name: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Email */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Email / User ID
                </label>

                <input
                  type="email"
                  placeholder="Enter teacher email"
                  value={newTeacher.email}
                  onChange={(event) =>
                    setNewTeacher({
                      ...newTeacher,
                      email: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Date of Birth */}
              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={newTeacher.dateOfBirth}
                  onChange={(event) =>
                    setNewTeacher({
                      ...newTeacher,
                      dateOfBirth: event.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <p className="text-xs text-slate-500 mt-2">
                  The date of birth will be used as the initial password.
                </p>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowAddTeacher(false);

                    setNewTeacher({
                      name: "",
                      email: "",
                      dateOfBirth: "",
                    });
                  }}
                  disabled={addingTeacher}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingTeacher}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {addingTeacher ? "Creating..." : "Add Teacher"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Admin Verification Modal */}
      {adminVerification && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Admin Verification
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Enter your admin password to continue.
            </p>

            <div className="mt-6">

              <label className="block text-sm text-slate-400 mb-2">
                Admin Password
              </label>

              <input
                type="password"
                value={adminPassword}
                onChange={(event) =>
                  setAdminPassword(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    verifyAdminPassword();
                  }
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setAdminVerification(null);
                  setAdminPassword("");
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={verifyAdminPassword}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
              >
                Verify
              </button>

            </div>

          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {selectedTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto">

          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">

            <h3 className="text-2xl font-bold">
              Teacher Details
            </h3>

            {/* Personal Information */}
            <div className="mt-6">

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-sm text-slate-500">
                    Teacher ID
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.teacherId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Date of Birth
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.dateOfBirth || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Gender
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.gender || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Phone Number
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Email / User ID
                  </p>

                  <p className="mt-1 font-medium break-all">
                    {selectedTeacher.email}
                  </p>
                </div>

                <div className="md:col-span-2">

                  <p className="text-sm text-slate-500">
                    Address
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.address || "Not provided"}
                  </p>

                </div>

              </div>
            </div>

            {/* Academic Information */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Academic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-sm text-slate-500">
                    UG Qualification
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.ugQualification || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    UG Specialization
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.ugSpecialization || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    PG Qualification
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.pgQualification || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    PG Specialization
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.pgSpecialization || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Doctorate
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.doctorate || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Certifications
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.certifications || "Not provided"}
                  </p>
                </div>

              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Professional Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-sm text-slate-500">
                    Department
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.department || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Experience
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.experience !== null &&
                    selectedTeacher.experience !== undefined
                      ? `${selectedTeacher.experience} years`
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Joining Date
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedTeacher.joiningDate || "Not provided"}
                  </p>
                </div>

              </div>
            </div>

            {/* Login Information */}
            <div className="mt-8">

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Login Information
              </h4>

              <div className="bg-slate-800/60 rounded-xl p-4">

                <p className="text-sm text-slate-500">
                  User ID
                </p>

                <p className="mt-1 font-medium break-all">
                  {selectedTeacher.email}
                </p>

                <p className="text-sm text-slate-500 mt-4">
                  Password
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Password is securely stored and is not displayed here.
                </p>

              </div>
            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto">

          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">

            <h3 className="text-2xl font-bold">
              Edit Teacher
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Update the teacher profile information.
            </p>

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-8"
            >

              {/* Personal Information */}
              <div>

                <h4 className="text-lg font-semibold text-blue-400 mb-4">
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Teacher ID */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Teacher ID
                    </label>

                    <input
                      value={editingTeacher.teacherId}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500"
                    />

                  </div>

                  {/* Name */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.name || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          name: event.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  {/* DOB */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={editingTeacher.dateOfBirth || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          dateOfBirth: event.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  {/* Gender */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Gender
                    </label>

                    <select
                      value={editingTeacher.gender || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          gender: event.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                  </div>

                  {/* Phone */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={editingTeacher.phone || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          phone: event.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  {/* Email */}
                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Email / User ID
                    </label>

                    <input
                      type="email"
                      value={editingTeacher.email || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          email: event.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">

                    <label className="block text-sm text-slate-400 mb-2">
                      Address
                    </label>

                    <textarea
                      value={editingTeacher.address || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          address: event.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                </div>
              </div>

              {/* Academic Information */}
              <div>

                <h4 className="text-lg font-semibold text-blue-400 mb-4">
                  Academic Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      UG Qualification
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.ugQualification || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          ugQualification: event.target.value,
                        })
                      }
                      placeholder="e.g. B.Tech"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      UG Specialization
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.ugSpecialization || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          ugSpecialization: event.target.value,
                        })
                      }
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      PG Qualification
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.pgQualification || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          pgQualification: event.target.value,
                        })
                      }
                      placeholder="e.g. M.Tech"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      PG Specialization
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.pgSpecialization || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          pgSpecialization: event.target.value,
                        })
                      }
                      placeholder="e.g. Artificial Intelligence"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Doctorate
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.doctorate || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          doctorate: event.target.value,
                        })
                      }
                      placeholder="e.g. PhD in Computer Science"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Certifications
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.certifications || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          certifications: event.target.value,
                        })
                      }
                      placeholder="Enter certifications"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                </div>
              </div>

              {/* Professional Information */}
              <div>

                <h4 className="text-lg font-semibold text-blue-400 mb-4">
                  Professional Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Department
                    </label>

                    <input
                      type="text"
                      value={editingTeacher.department || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          department: event.target.value,
                        })
                      }
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={editingTeacher.experience ?? ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          experience:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Joining Date
                    </label>

                    <input
                      type="date"
                      value={editingTeacher.joiningDate || ""}
                      onChange={(event) =>
                        setEditingTeacher({
                          ...editingTeacher,
                          joiningDate: event.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
                    />

                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  disabled={updatingTeacher}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingTeacher}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition disabled:opacity-50"
                >
                  {updatingTeacher
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeacher && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <h3 className="text-2xl font-bold">
              Delete Teacher
            </h3>

            <p className="text-slate-400 mt-2">
              Are you sure you want to delete this teacher?
            </p>

            <div className="bg-slate-800/60 rounded-xl p-4 mt-6">

              <p className="font-semibold">
                {deletingTeacher.name}
              </p>

              <p className="text-sm text-slate-400 mt-1 break-all">
                {deletingTeacher.email}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Teacher ID: {deletingTeacher.teacherId}
              </p>

            </div>

            <p className="text-sm text-red-400 mt-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setDeletingTeacher(null)}
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Teacher"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default TeacherManagement;