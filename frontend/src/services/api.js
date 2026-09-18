const API_BASE_URL = "http://localhost:8080";

export async function getStudents() {
  const response = await fetch(`${API_BASE_URL}/students`);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}
export async function getTeachers() {
  const response = await fetch(`${API_BASE_URL}/teachers`);

  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }

  return response.json();
}
export async function getSubjects() {
  const response = await fetch(`${API_BASE_URL}/subjects`);

  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return response.json();
}
export async function getClasses() {
  const response = await fetch(`${API_BASE_URL}/classes`);

  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }

  return response.json();
}