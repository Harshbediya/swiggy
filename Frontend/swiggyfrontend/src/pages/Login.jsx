// src/components/Login.js
import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import "./css/Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevents GET request and page reload
    setMsg(""); // clear previous messages

    if (!username || !password) {
      setMsg("❌ Please fill in all fields");
      return;
    }

    try {
      // Send POST request to Django login endpoint
      const res = await api.post("login/", { username, password });

      // Store JWT token in localStorage
      const token = res.data.access;
      localStorage.setItem("token", token);
      setAuthToken(token);

      // Call onLogin callback (optional, e.g., for redirect or state update)
      if (onLogin) onLogin(username);

      setMsg("✅ Login successful!");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <p>Enter your credentials to access your account.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="message">{msg}</p>
        <p className="login-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
