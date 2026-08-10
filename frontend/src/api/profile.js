
import { apiRequest } from "./api";

export async function updateProfile(
  name,
  profileImage
) {
  const formData = new FormData();

  formData.append("name", name);

  if (profileImage) {
    formData.append(
      "profileImage",
      profileImage
    );
  }

  return apiRequest("/user/update", {
    method: "PUT",
    body: formData
  });
}
