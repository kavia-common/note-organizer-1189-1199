import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { AuthContext } from "../App";
import "./auth.css";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await register(form.username, form.email, form.password);
      window.localStorage.setItem("token", token);
      setUser(user);
      navigate("/", {replace:true});
    } catch (err) {
      setError(err?.message || err?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="form-error">{error}</div>}
        <label>Username</label>
        <input name="username" required disabled={loading} value={form.username} onChange={handleChange}></input>
        <label>Email</label>
        <input type="email" name="email" required disabled={loading} value={form.email} onChange={handleChange}></input>
        <label>Password</label>
        <input type="password" name="password" required disabled={loading} value={form.password} onChange={handleChange}></input>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
