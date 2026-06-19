import { useEffect, useState } from "react";
import api from "../api/api";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const userResponse = await api.get("/api/v1/auth/me");
        if (!isMounted) return;

        setUser(userResponse.data);

        const chatsResponse = await api.get("/api/v1/chats");
        if (!isMounted) return;

        setChats(chatsResponse.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);


  async function createChat(e) {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/v1/chats",
        {
          title,
        }
      );

      setChats([
        response.data,
        ...chats,
      ]);

      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }

  async function openChat(chat) {
    setSelectedChat(chat);

    try {
      const response = await api.get(
        `/api/v1/chats/${chat.id}/messages`
      );

      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();

    if (!selectedChat) return;

    try {
      const response = await api.post(
        `/api/v1/chats/${selectedChat.id}/messages`,
        {
          content: message,
        }
      );

      setMessages((prev) => [
        ...prev,
        response.data.user_message,
        response.data.assistant_message,
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <h2>Chats</h2>

        <form onSubmit={createChat}>
          <input
            type="text"
            placeholder="Chat title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button type="submit">
            Create
          </button>
        </form>

        <hr />

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => openChat(chat)}
            style={{
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            {chat.title}
          </div>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          padding: "1rem",
        }}
      >
        {user && (
          <p>
            Logged in as {user.email}
          </p>
        )}

        <h2>
          {selectedChat
            ? selectedChat.title
            : "Select a Chat"}
        </h2>

        <div
          style={{
            minHeight: "400px",
            marginBottom: "20px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "15px",
              }}
            >
              <strong>
                {msg.role}
              </strong>

              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        {selectedChat && (
          <form onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              style={{
                width: "80%",
              }}
            />

            <button type="submit">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}