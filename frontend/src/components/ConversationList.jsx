
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ConversationList({
  users,
  messages,
  selectedUser,
  setSelectedUser
}) {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");

  const otherUsers = users.filter(
    (person) => person.id !== user?.id
  );

  const getConversationMessages = (userId) => {
    return messages
      .filter(
        (message) =>
          (message.senderId === user.id &&
            message.receiverId === userId) ||
          (message.senderId === userId &&
            message.receiverId === user.id)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
  };

  const conversations = otherUsers
    .map((person) => ({
      ...person,
      conversation: getConversationMessages(
        person.id
      )
    }))
    .filter(
      (person) => person.conversation.length > 0
    )
    .sort((a, b) => {
      const dateA = new Date(
        a.conversation[0].createdAt
      );

      const dateB = new Date(
        b.conversation[0].createdAt
      );

      return dateB - dateA;
    });

  const searchResults = otherUsers.filter(
    (person) =>
      person.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      person.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const displayedUsers = search.trim()
    ? searchResults
    : conversations;

  return (
    <section className="conversation-list">
      <h2>
        {search.trim()
          ? "Find Someone"
          : "Correspondence"}
      </h2>

      <input
        className="people-search"
        type="text"
        placeholder="Find someone..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      {displayedUsers.length === 0 ? (
        <p>
          {search.trim()
            ? "No one found."
            : "Your correspondence will appear here."}
        </p>
      ) : (
        displayedUsers.map((person) => {
          const conversation =
            getConversationMessages(person.id);

          const lastMessage =
            conversation[0];

          return (
            <button
              key={person.id}
              className={
                selectedUser === person.id
                  ? "conversation active"
                  : "conversation"
              }
              onClick={() =>
                setSelectedUser(person.id)
              }
            >
              <div className="conversation-avatar">
                {person.profileImage ? (
                  <img
                    src={person.profileImage}
                    alt={person.name}
                  />
                ) : (
                  person.name
                    ?.charAt(0)
                    .toUpperCase()
                )}
              </div>

              <div className="conversation-info">
                <strong>
                  {person.name}
                </strong>

                <span>
                  {lastMessage
                    ? lastMessage.content
                    : "Start a conversation"}
                </span>
              </div>
            </button>
          );
        })
      )}
    </section>
  );
}

export default ConversationList;
