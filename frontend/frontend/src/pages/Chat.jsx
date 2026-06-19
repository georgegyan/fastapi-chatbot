import { useEffect, useState } from "react";
import api from "../api/api";

export default function Chat() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get(
          "/api/v1/auth/me"
        );

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Chat Page</h1>

      {user && (
        <>
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
}