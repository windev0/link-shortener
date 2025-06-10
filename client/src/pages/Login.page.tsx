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
      setError("Saisir le nom d'utilisateur et le mot de passe.");
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
        setError("La connexion a échoué.Veuillez vérifier vos identifiants.");
        throw new Error("Login failed");
      }
      return response.json();
    });

    if (data) {
      window.localStorage.setItem("user", JSON.stringify(data?.user));
      window.localStorage.setItem("isLoggedIn", "true");
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data?.user?.token}`;

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
        <a href="/" className="no-underline text-gray-800 font-bold">
          <span className="text-blue-500">LINK - SHORTNER</span>
        </a>
      </div>
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 px-2">
        <div
          className="w-full max-w-md p-6 border border-gray-200 shadow-lg bg-white rounded-lg"
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-center mb-6 text-black text-xl font-semibold">
            Vos identifiants de connexion
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-black text-base">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-black text-base">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="text-red-600 mb-3">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-black bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200 disabled:opacity-60"
            >
              Je me connecte
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-black">
            Vous n'avez pas de compte?{" "}
            <Link
              to={RoutesEnum.REGISTER}
              className="text-blue-600 hover:underline"
            >
              Créer maintenant
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
