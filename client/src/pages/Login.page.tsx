import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RoutesEnum } from "../configs/router";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const data = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    ).then((response) => {
      if (!response.ok) {
        setError("Login failed. Please check your credentials.");
        throw new Error("Login failed");
      }
      return response.json();
    });

    if (data) {
      window.localStorage.setItem("user", JSON.stringify(data?.user));
      window.localStorage.setItem("isLoggedIn", "true");
      axios.defaults.headers.common['Authorization'] = `Bearer ${data?.user?.token}`;


      setIsLoading(false);

      // navigate(RoutesEnum.URL_SHORTENER);
      navigate(RoutesEnum.HOME, { replace: true });
    }
  };

  return (
    <>
      <div
        style={{ fontSize: "1.2rem", fontWeight: "bold" }}
        className="bg-gray-100 p-3"
      >
        <a href="/" style={{ fontSize: "25px" }}>
          Retour
        </a>
      </div>
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div
          style={{
            minWidth: 400,
            padding: 24,
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            borderRadius: 8,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 24,
              color: "black",
              fontSize: 22,
            }}
          >
            Please enter your credentials
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  color: "#000",
                  fontSize: 16,
                }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
                autoComplete="username"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  color: "#000",
                  fontSize: 16,
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: 10,
                color: "#fff",
                backgroundColor: "#007bff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to={RoutesEnum.REGISTER}>Register</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
