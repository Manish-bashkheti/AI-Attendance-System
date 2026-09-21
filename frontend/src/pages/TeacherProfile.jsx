import { useEffect, useState } from "react";

function TeacherProfile() {
    const teacherId = localStorage.getItem("teacherId");

    const [profile, setProfile] = useState({
        name: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        department: "",
        ugQualification: "",
        ugSpecialization: "",
        pgQualification: "",
        pgSpecialization: "",
        doctorate: "",
        certifications: "",
        experience: "",
        joiningDate: ""
    });
    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/teachers/${teacherId}`
            );

            if (!response.ok) {
                throw new Error("Failed to load teacher profile.");
            }

            const data = await response.json();

            setProfile({
                name: data.name || "",
                dateOfBirth: data.dateOfBirth || "",
                gender: data.gender || "",
                phone: data.phone || "",
                email: data.email || "",
                address: data.address || "",
                department: data.department || "",
                ugQualification: data.ugQualification || "",
                ugSpecialization: data.ugSpecialization || "",
                pgQualification: data.pgQualification || "",
                pgSpecialization: data.pgSpecialization || "",
                doctorate: data.doctorate || "",
                certifications: data.certifications || "",
                experience: data.experience ?? "",
                joiningDate: data.joiningDate || ""
            });

        } catch (error) {
            console.error(
                "Error loading teacher profile:",
                error
            );
        }
    };

    if (teacherId) {
        fetchProfile();
    }
}, [teacherId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile({
            ...profile,
            [name]: value
        });
    };

   const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(
            `http://localhost:8080/teachers/${teacherId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: profile.name,
                    dateOfBirth: profile.dateOfBirth,
                    gender: profile.gender,
                    phone: profile.phone,
                    email: profile.email,
                    address: profile.address,
                    department: profile.department,
                    ugQualification: profile.ugQualification,
                    ugSpecialization: profile.ugSpecialization,
                    pgQualification: profile.pgQualification,
                    pgSpecialization: profile.pgSpecialization,
                    doctorate: profile.doctorate,
                    certifications: profile.certifications,
                    experience: profile.experience === ""
                        ? null
                        : Number(profile.experience),
                    joiningDate: profile.joiningDate
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save teacher profile.");
        }

        alert("Profile saved successfully.");

    } catch (error) {
        console.error("Error saving teacher profile:", error);
        alert("Failed to save profile.");
    }
};

    return (
        <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

            <div className="mx-auto max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        My Profile
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Complete and manage your teacher profile.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* Personal Information */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            Personal Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Teacher ID
                                </label>

                                <input
                                    type="text"
                                    value={teacherId || ""}
                                    disabled
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={profile.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                >
                                    <option value="">
                                        Select Gender
                                    </option>
                                    <option value="Male">
                                        Male
                                    </option>
                                    <option value="Female">
                                        Female
                                    </option>
                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Email / User ID
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm text-slate-300">
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                    rows="3"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Academic Information */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            Academic Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    UG Qualification
                                </label>

                                <input
                                    type="text"
                                    name="ugQualification"
                                    value={profile.ugQualification}
                                    onChange={handleChange}
                                    placeholder="e.g. B.Tech"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    UG Specialization
                                </label>

                                <input
                                    type="text"
                                    name="ugSpecialization"
                                    value={profile.ugSpecialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    PG Qualification
                                </label>

                                <input
                                    type="text"
                                    name="pgQualification"
                                    value={profile.pgQualification}
                                    onChange={handleChange}
                                    placeholder="e.g. M.Tech"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    PG Specialization
                                </label>

                                <input
                                    type="text"
                                    name="pgSpecialization"
                                    value={profile.pgSpecialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Artificial Intelligence"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Doctorate
                                </label>

                                <select
                                    name="doctorate"
                                    value={profile.doctorate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                >
                                    <option value="">
                                        Select
                                    </option>
                                    <option value="Yes">
                                        Yes
                                    </option>
                                    <option value="No">
                                        No
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Certifications
                                </label>

                                <input
                                    type="text"
                                    name="certifications"
                                    value={profile.certifications}
                                    onChange={handleChange}
                                    placeholder="Enter certifications"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Professional Information */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            Professional Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    placeholder="Enter department"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Experience (Years)
                                </label>

                                <input
                                    type="number"
                                    name="experience"
                                    value={profile.experience}
                                    onChange={handleChange}
                                    placeholder="Enter experience"
                                    min="0"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={profile.joiningDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
                        >
                            Save Profile
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default TeacherProfile;