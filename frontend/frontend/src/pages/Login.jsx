import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      navigate("/chat");
    } catch (error) {
      console.error(error);

      alert("Invalid email or password");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <br />

      <Link to="/register">
        Create account
      </Link>
    </div>
  );
}