
const API_URL = import.meta.env.VITE_API_URL;

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
