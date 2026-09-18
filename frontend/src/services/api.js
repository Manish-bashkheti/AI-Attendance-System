const API_BASE_URL = "http://localhost:8080";

export async function getStudents() {
  const response = await fetch(`${API_BASE_URL}/students`);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}