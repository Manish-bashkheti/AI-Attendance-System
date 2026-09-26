import { useEffect, useState } from "react";
import axios from "axios";

function StudentManagement() {

    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        email: "",
        dob: "",
        course: "",
        branch: "",
        customBranch: "",
        semester: "",
        section: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const courses = {
        "B.Tech": [
            "CSE",
            "ECE",
            "ME",
            "Civil",
            "AI & ML",
            "Data Science"
        ],

        "BCA": [
            "Computer Applications"
        ],

        "MCA": [
            "Computer Applications"
        ],

        "BBA": [
            "General",
            "Finance",
            "Marketing",
            "Human Resources"
        ],

        "MBA": [
            "Finance",
            "Marketing",
            "Human Resources",
            "International Business"
        ]
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/students"
            );

            setStudents(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch students:",
                error
            );
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "course") {

            setFormData((prev) => ({
                ...prev,
                course: value,
                branch: "",
                customBranch: ""
            }));

            return;
        }

        if (name === "branch") {

            if (value === "CUSTOM") {

                setFormData((prev) => ({
                    ...prev,
                    branch: "CUSTOM",
                    customBranch: ""
                }));

            } else {

                setFormData((prev) => ({
                    ...prev,
                    branch: value,
                    customBranch: ""
                }));
            }

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // DOB CHANGE
    // =========================

    const handleDobChange = (e) => {

        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        setFormData((prev) => ({
            ...prev,
            dob: value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            studentId: "",
            name: "",
            email: "",
            dob: "",
            course: "",
            branch: "",
            customBranch: "",
            semester: "",
            section: ""
        });

        setEditingId(null);
        setError("");
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const finalBranch =
            formData.branch === "CUSTOM"
                ? formData.customBranch.trim()
                : formData.branch.trim();

        // =========================
        // VALIDATION
        // =========================

        if (
            !formData.studentId ||
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.dob ||
            !formData.course ||
            !finalBranch ||
            !formData.semester ||
            !formData.section.trim()
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }

        if (!/^\d{8}$/.test(formData.dob)) {

            setError(
                "DOB must be in DDMMYYYY format."
            );

            return;
        }

        // =========================
        // DATA SENT TO BACKEND
        // =========================

        const data = {
            studentId: Number(formData.studentId),

            name: formData.name.trim(),

            email: formData.email.trim(),

            dob: formData.dob,

            course: formData.course,

            branch: finalBranch,

            semester: Number(formData.semester),

            section: formData.section.trim()
        };

        // DEBUG
        console.log(
            "DATA BEING SENT TO BACKEND:",
            data
        );

        try {

            if (editingId) {

                await axios.put(
                    `http://localhost:8080/students/${editingId}`,
                    data
                );

                setSuccess(
                    "Student updated successfully."
                );

            } else {

                await axios.post(
                    "http://localhost:8080/students",
                    data
                );

                setSuccess(
                    "Student added successfully."
                );
            }

            resetForm();

            fetchStudents();

        } catch (error) {

            console.error(
                "Student save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            setError(
                typeof error.response?.data === "string"
                    ? error.response.data
                    : "Failed to save student."
            );
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (student) => {

        const isCustomBranch =
            !courses[student.course]?.includes(
                student.branch
            );

        setFormData({

            studentId:
                student.studentId || "",

            name:
                student.name || "",

            email:
                student.email || "",

            dob:
                student.dob || "",

            course:
                student.course || "",

            branch:
                isCustomBranch
                    ? "CUSTOM"
                    : student.branch || "",

            customBranch:
                isCustomBranch
                    ? student.branch || ""
                    : "",

            semester:
                student.semester || "",

            section:
                student.section || ""
        });

        setEditingId(
            student.studentId
        );

        setError("");
        setSuccess("");
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (studentId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:8080/students/${studentId}`
            );

            setSuccess(
                "Student deleted successfully."
            );

            fetchStudents();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                "Failed to delete student."
            );
        }
    };

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Student Management
            </h1>

            {/* ERROR */}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            {/* =========================
                FORM
            ========================= */}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow mb-8"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* STUDENT ID */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Student ID
                        </label>

                        <input
                            type="number"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            disabled={!!editingId}
                            placeholder="Enter Student ID"
                            className="w-full px-4 py-3 border rounded-lg"
                        />

                    </div>

                    {/* NAME */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                            className="w-full px-4 py-3 border rounded-lg"
                        />

                    </div>

                    {/* EMAIL */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full px-4 py-3 border rounded-lg"
                        />

                    </div>

                    {/* DOB */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Date of Birth
                        </label>

                        <input
                            type="text"
                            name="dob"
                            value={formData.dob}
                            onChange={handleDobChange}
                            placeholder="DDMMYYYY"
                            maxLength={8}
                            className="w-full px-4 py-3 border rounded-lg"
                        />

                        <p className="text-sm text-gray-500 mt-1">
                            Example: 01102006
                        </p>

                    </div>

                    {/* COURSE */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Course
                        </label>

                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg"
                        >

                            <option value="">
                                Select Course
                            </option>

                            {Object.keys(courses).map(
                                (course) => (

                                    <option
                                        key={course}
                                        value={course}
                                    >
                                        {course}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* BRANCH */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Branch
                        </label>

                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            disabled={!formData.course}
                            className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-100"
                        >

                            <option value="">
                                Select Branch
                            </option>

                            {formData.course &&
                                courses[
                                    formData.course
                                ]?.map(
                                    (branch) => (

                                        <option
                                            key={branch}
                                            value={branch}
                                        >
                                            {branch}
                                        </option>

                                    )
                                )}

                            <option value="CUSTOM">
                                + Add Custom Branch
                            </option>

                        </select>

                    </div>

                    {/* CUSTOM BRANCH */}

                    {formData.branch === "CUSTOM" && (

                        <div>

                            <label className="block mb-2 font-medium">
                                Custom Branch
                            </label>

                            <input
                                type="text"
                                name="customBranch"
                                value={formData.customBranch}
                                onChange={handleChange}
                                placeholder="Enter custom branch"
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                        </div>

                    )}

                    {/* SEMESTER */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Semester
                        </label>

                        <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg"
                        >

                            <option value="">
                                Select Semester
                            </option>

                            {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                (semester) => (

                                    <option
                                        key={semester}
                                        value={semester}
                                    >
                                        Semester {semester}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* SECTION */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Section
                        </label>

                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            placeholder="Example: A"
                            className="w-full px-4 py-3 border rounded-lg"
                        />

                    </div>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                        {editingId
                            ? "Update Student"
                            : "Add Student"}
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 bg-gray-200 rounded-lg font-semibold"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

            {/* =========================
                STUDENT TABLE
            ========================= */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-3 text-left">
                                Student ID
                            </th>

                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Email
                            </th>

                            <th className="p-3 text-left">
                                DOB
                            </th>

                            <th className="p-3 text-left">
                                Course
                            </th>

                            <th className="p-3 text-left">
                                Branch
                            </th>

                            <th className="p-3 text-left">
                                Semester
                            </th>

                            <th className="p-3 text-left">
                                Section
                            </th>

                            <th className="p-3 text-left">
                                Password
                            </th>

                            <th className="p-3 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {students.map((student) => (

                            <tr
                                key={student.studentId}
                                className="border-t"
                            >

                                <td className="p-3">
                                    {student.studentId}
                                </td>

                                <td className="p-3">
                                    {student.name}
                                </td>

                                <td className="p-3">
                                    {student.email}
                                </td>

                                <td className="p-3">
                                    {student.dob}
                                </td>

                                <td className="p-3">
                                    {student.course}
                                </td>

                                <td className="p-3">
                                    {student.branch}
                                </td>

                                <td className="p-3">
                                    {student.semester}
                                </td>

                                <td className="p-3">
                                    {student.section}
                                </td>

                                <td className="p-3">
                                    ••••••••
                                </td>

                                <td className="p-3">

                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(student)
                                            }
                                            className="px-3 py-2 bg-yellow-500 text-white rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    student.studentId
                                                )
                                            }
                                            className="px-3 py-2 bg-red-600 text-white rounded"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default StudentManagement;