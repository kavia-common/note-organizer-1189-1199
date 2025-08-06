import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { AuthContext } from "../App";
import "./auth.css";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
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
      const {token, user} = await login(form.email, form.password);
      window.localStorage.setItem("token", token);
      setUser(user);
      navigate("/", {replace:true});
    } catch (err) {
      setError(err?.message || err?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login to Notes</h2>
        {error && <div className="form-error">{error}</div>}
        <label>Email</label>
        <input type="email" name="email" required disabled={loading} value={form.email} onChange={handleChange}></input>
        <label>Password</label>
        <input type="password" name="password" required disabled={loading} value={form.password} onChange={handleChange}></input>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="form-footer">
          New user? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
