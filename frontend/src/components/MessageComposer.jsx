
import { useState } from "react";
import { sendMessage } from "../api/messages";

function MessageComposer({ receiverId, onMessageSent }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim() || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await sendMessage(
        content.trim(),
        receiverId
      );

      const newMessage = response.data || response;

      onMessageSent(newMessage);

      setContent("");
    } catch (error) {
      console.error(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Write a letter..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={sending}
      />

      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default MessageComposer;
