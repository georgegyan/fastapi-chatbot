import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const styles = {
  container: { display: "flex", height: "100vh" },
  sidebar: { width: 300, borderRight: "1px solid #ccc", padding: "1rem" },
  main: { flex: 1, padding: "1rem" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  messagesArea: { minHeight: 400, marginBottom: 20 },
  input: { width: "80%" },
  chatItem: { cursor: "pointer", marginBottom: 10 },
  message: { marginBottom: 15 },
};

function Sidebar({ chats, title, setTitle, onCreateChat, onOpenChat }) {
  return (
    <div style={styles.sidebar}>
      <h2>Chats</h2>

      <form onSubmit={onCreateChat}>
        <input
          type="text"
          placeholder="Chat title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>

      <hr />

      {chats.map((chat) => (
        <div key={chat.id} onClick={() => onOpenChat(chat)} style={styles.chatItem}>
          {chat.title}
        </div>
      ))}
    </div>
  );
}

function ChatWindow({
  user,
  logout,
  selectedChat,
  messages,
  messagesEndRef,
  loading,
  message,
  setMessage,
  onSendMessage,
}) {
  return (
    <div style={styles.main}>
      <div style={styles.header}>
        <div>{user && <p>Logged in as {user.email}</p>}</div>
        <button onClick={logout}>Logout</button>
      </div>

      <h2>{selectedChat ? selectedChat.title : "Select a Chat"}</h2>

      <div style={styles.messagesArea}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            <strong>{msg.role}</strong>
            <p>{msg.content}</p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {loading && <p>AI is thinking...</p>}

      {selectedChat && (
        <form onSubmit={onSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />

          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}

export default function Chat() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function createChat(e) {
    e.preventDefault();

    try {
      const response = await api.post("/api/v1/chats", { title });
      setChats([response.data, ...chats]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }

  async function openChat(chat) {
    setSelectedChat(chat);

    try {
      const response = await api.get(`/api/v1/chats/${chat.id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await api.post(`/api/v1/chats/${selectedChat.id}/messages`, {
        content: message,
      });

      setMessages((prev) => [
        ...prev,
        response.data.user_message,
        response.data.assistant_message,
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <Sidebar chats={chats} title={title} setTitle={setTitle} onCreateChat={createChat} onOpenChat={openChat} />

      <ChatWindow
        user={user}
        logout={logout}
        selectedChat={selectedChat}
        messages={messages}
        messagesEndRef={messagesEndRef}
        loading={loading}
        message={message}
        setMessage={setMessage}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

