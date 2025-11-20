// src/components/Signup.js
import React, { useState } from "react";
import api from "../api";
import "./css/Signup.css";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page reload / GET request
    setMessage("");

    if (!username || !email || !password || !confirmPassword || !address) {
      setMessage("❌ All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await api.post("signup/", { username, email, phone, password, address });

      setMessage("✅ Signup successful! You can now log in.");
      // Optionally, clear fields
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setAddress("");

      // Optional callback after signup
      if (onSignup) onSignup(username);

    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.response?.data?.error || "Signup failed"));
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* Left Image */}
        <div className="signup-image">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="Food"
          />
        </div>

        {/* Right Form */}
        <div className="signup-form-card">
          <h2>Welcome to Foodies!</h2>
          <p>Sign up to order delicious meals at your doorstep.</p>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fas fa-map-marker-alt"></i>
              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />
            </div>

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>
{/* 
          <div className="social-login">
            <p>Or sign up with</p>
            <button className="google-btn">Google</button>
            <button className="phone-btn">Phone OTP</button>
          </div> */}

          <p className="message">{message}</p>
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
