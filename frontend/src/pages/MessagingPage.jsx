
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUsers } from "../api/users";
import { getMessages } from "../api/messages";

import Sidebar from "../components/SideBar";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";

function MessagingPage() {
  const { user, loading: authLoading } =
    useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersResponse, messagesResponse] =
          await Promise.all([
            getUsers(),
            getMessages()
          ]);

        /*
          Some APIs return:

          [
            {...},
            {...}
          ]

          Others return:

          {
            data: [...]
          }

          Handle both.
        */

        const usersData =
          Array.isArray(usersResponse)
            ? usersResponse
            : usersResponse?.data || [];

        const messagesData =
          Array.isArray(messagesResponse)
            ? messagesResponse
            : messagesResponse?.data || [];

        setUsers(usersData);
        setMessages(messagesData);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Unable to load your messages."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="loading-page">
        <p>Opening your correspondence...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="error-page">
        <h2>Something went wrong.</h2>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="messaging-page">
      <Sidebar />

      <ConversationList
        users={users}
        messages={messages}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <ChatWindow
        users={users}
        messages={messages}
        selectedUser={selectedUser}
        setMessages={setMessages}
      />
    </main>
  );
}

export default MessagingPage;
