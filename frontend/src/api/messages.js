
import { apiRequest } from "./api";

export async function getMessages() {
  return apiRequest("/messages");
}

export async function getMessage(id) {
  return apiRequest(`/messages/${id}`);
}

export async function sendMessage(content, receiverId) {
  return apiRequest("/messages/send", {
    method: "POST",
    body: JSON.stringify({
      content,
      receiverId
    })
  });
}

export async function updateMessage(id, content) {
  return apiRequest(`/messages/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      content
    })
  });
}

export async function deleteMessage(id) {
  return apiRequest(`/messages/${id}`, {
    method: "DELETE"
  });
}

export async function getConversation(userId) {
  return apiRequest(`/messages/conversation/${userId}`);
}
