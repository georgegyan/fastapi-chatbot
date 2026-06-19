import { useEffect, useState } from "react";
import api from "../api/api";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const userResponse = await api.get("/api/v1/auth/me");
        const chatsResponse = await api.get("/api/v1/chats");

        if (!isMounted) return;

        setUser(userResponse.data);
        setChats(chatsResponse.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();

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
        ...chats
      ]);

      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Chatbot</h1>

      {user && (
        <p>
          Logged in as: {user.email}
        </p>
      )}

      <hr />

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
          Create Chat
        </button>
      </form>

      <hr />

      <h2>Your Chats</h2>

      {chats.map((chat) => (
        <div key={chat.id}>
          <strong>{chat.title}</strong>
        </div>
      ))}
    </div>
  );
}