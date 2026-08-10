
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  sendMessage,
  updateMessage,
  deleteMessage
} from "../api/messages";

function ChatWindow({
  users,
  messages,
  selectedUser,
  setMessages
}) {
  const { user } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [sending, setSending] = useState(false);

  const selectedPerson = users.find(
    (person) => person.id === selectedUser
  );

  const conversationMessages = useMemo(() => {
    if (!selectedUser || !user) {
      return [];
    }

    return messages
      .filter(
        (message) =>
          (message.senderId === user.id &&
            message.receiverId === selectedUser) ||
          (message.senderId === selectedUser &&
            message.receiverId === user.id)
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
  }, [messages, selectedUser, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim() || !selectedUser) {
      return;
    }

    try {
      setSending(true);

      const response = await sendMessage(
        content.trim(),
        selectedUser
      );

      const newMessage = response.data || response;

      setMessages((currentMessages) => [
        ...currentMessages,
        newMessage
      ]);

      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const startEditing = (message) => {
    setEditingId(message.id);
    setEditingContent(message.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleUpdate = async (messageId) => {
    if (!editingContent.trim()) {
      return;
    }

    try {
      const response = await updateMessage(
        messageId,
        editingContent.trim()
      );

      const updatedMessage =
        response.data || response;

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? updatedMessage
            : message
        )
      );

      cancelEditing();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMessage(messageId);

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== messageId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!selectedUser) {
    return (
      <section className="chat-window empty-chat">
        <h2>Your Correspondence</h2>

        <p>
          Choose someone to begin a conversation.
        </p>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <header className="chat-header">
        <div className="chat-avatar">
          {selectedPerson?.profileImage ? (
            <img
              src={selectedPerson.profileImage}
              alt={selectedPerson.name}
            />
          ) : (
            selectedPerson?.name
              ?.charAt(0)
              .toUpperCase()
          )}
        </div>

        <div>
          <h2>{selectedPerson?.name}</h2>

          <span>
            {selectedPerson?.email}
          </span>
        </div>
      </header>

      <div className="messages">
        {conversationMessages.length === 0 ? (
          <div className="empty-chat">
            <p>No letters yet.</p>
            <p>Write the first one.</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isMine =
              message.senderId === user.id;

            const isEditing =
              editingId === message.id;

            return (
              <article
                key={message.id}
                className={
                  isMine
                    ? "message mine"
                    : "message theirs"
                }
              >
                <div className="message-content">
                  {isEditing ? (
                    <>
                      <input
                        className="edit-message-input"
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(
                            event.target.value
                          )
                        }
                        autoFocus
                      />

                      <div className="message-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              message.id
                            )
                          }
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
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
                            type="button"
                            onClick={() =>
                              startEditing(message)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                message.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <form
        className="message-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder={`Write to ${
            selectedPerson?.name || "them"
          }...`}
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
        />

        <button
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}

export default ChatWindow;
