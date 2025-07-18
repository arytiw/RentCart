import React, { useState } from "react";
import { loginUser } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";

const LoginForm = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(emailId, password);
      localStorage.setItem("token", response.token); // adjust if backend returns token in another key
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Login failed. Check console for details.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="emailId">Email</label>
          <input
            type="email"
            id="emailId"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">Login</button>
      </form>
      <Link to="/register" className="link">Don't have an account? Register</Link>
    </div>
  );
};

export default LoginForm;
