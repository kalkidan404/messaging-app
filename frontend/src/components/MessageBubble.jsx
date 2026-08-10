
import { useState } from "react";
import { updateMessage, deleteMessage } from "../api/messages";

function MessageBubble({ message, isMine, onMessageUpdated, onMessageDeleted }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim() || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await updateMessage(
        message.id,
        content.trim()
      );

      const updatedMessage = response.data || response;

      onMessageUpdated(updatedMessage);

      setEditing(false);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await deleteMessage(message.id);

      onMessageDeleted(message.id);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isMine
          ? "message mine"
          : "message theirs"
      }
    >
      {editing ? (
        <div>
          <input
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
          >
            Save
          </button>

          <button
            onClick={() => {
              setContent(message.content);
              setEditing(false);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p>{message.content}</p>

          <small>
            {new Date(
              message.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </small>

          {isMine && (
            <div className="message-actions">
              <button
                onClick={() => setEditing(true)}
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MessageBubble;
