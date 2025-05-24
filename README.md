# 🔗 Link Shortener — Fullstack App (Node.js + React + MongoDB + Tailwind CSS)

Un projet complet de raccourcisseur de liens personnel ✂️ — réalisé avec **Node.js** pour le backend, **React + Vite** pour le frontend, **MongoDB** pour la base de données, et **Tailwind CSS** pour un design moderne.

---

## 🚀 Fonctionnalités

- ✅ Raccourcir une URL longue vers un lien court unique
- 📋 Copier le lien court d’un simple clic
- 🧾 Historique de tous les liens générés (via MongoDB)
- 🗑️ Supprimer un lien (bientôt)
- 🔎 Tri et recherche dans l'historique (à venir)
- 🌐 API REST exposée (POST /shorten, GET /all)

---

## 🧱 Stack technique

### 🖥️ Frontend (React + Vite + Tailwind CSS)
- React + TypeScript
- Axios pour les appels API
- Tailwind CSS pour le style
- Vite pour un dev ultra-rapide

### ⚙️ Backend (Node.js + Express + MongoDB)
- Express.js
- Mongoose (ODM MongoDB)
- Nanoid pour générer des IDs uniques
- CORS, dotenv, body-parser

---

## 📁 Structure du repo

```bash
📦 link-shortener/
├── client/         # Frontend React (Vite)
│   ├── src/
│   ├── index.css   # Tailwind config
│   └── ...
├── server/         # Backend Node.js + Express
│   ├── models/
│   ├── routes/
│   └── ...
├── README.md
└── ...
