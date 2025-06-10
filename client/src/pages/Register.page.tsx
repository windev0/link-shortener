import React, { useState } from "react";
import { RoutesEnum } from "../configs/router";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      }
    ).then((res) => {
      if (!res.ok) {
        setError("Registration failed. Please try again.");
        return;
      }
      return res.json();
    });

    if (data) {
      navigate(RoutesEnum.LOGIN);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div
        style={{
          maxWidth: 400,
          margin: "3rem 1.5rem",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "#333",
            fontSize: 24,
          }}
        >
          Création de compte
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#444",
                fontWeight: 500,
              }}
            >
              Nom d'utilisateur
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  marginTop: 4,
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#444",
                fontWeight: 500,
              }}
            >
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  marginTop: 4,
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#444",
                fontWeight: 500,
              }}
            >
              Mot de passe
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  marginTop: 4,
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#444",
                fontWeight: 500,
              }}
            >
              Confirmez le mot de passe
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  marginTop: 4,
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>
          {error && (
            <div
              style={{
                color: "#d32f2f",
                background: "#fdecea",
                border: "1px solid #f5c6cb",
                borderRadius: 6,
                padding: "10px 12px",
                marginBottom: 18,
                fontSize: 15,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 17,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1565c0")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1976d2")}
          >
            Créer mon compte
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              color: "#666",
              fontSize: 15,
            }}
          >
           Vous avez déjà un compte?{" "}
            <a
              href={RoutesEnum.LOGIN}
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Connectez-vous ici
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
