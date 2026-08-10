
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MessageBubble from "./MessageBubble";

function MessageList({
  messages,
  selectedUser,
  onMessageUpdated,
  onMessageDeleted
}) {
  const { user } = useContext(AuthContext);

  const conversationMessages = messages
    .filter((message) => {
      const involvesSelectedUser =
        message.senderId === selectedUser ||
        message.receiverId === selectedUser;

      const involvesMe =
        message.senderId === user.id ||
        message.receiverId === user.id;

      return involvesSelectedUser && involvesMe;
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    );

  if (conversationMessages.length === 0) {
    return (
      <section className="messages">
        <p>No letters yet.</p>
      </section>
    );
  }

  return (
    <section className="messages">
      {conversationMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isMine={message.senderId === user.id}
          onMessageUpdated={onMessageUpdated}
          onMessageDeleted={onMessageDeleted}
        />
      ))}
    </section>
  );
}

export default MessageList;