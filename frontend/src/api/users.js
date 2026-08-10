
const API_URL = "http://localhost:3000";

export async function getUsers() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/user/all`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get users");
  }

  return response.json();
}
