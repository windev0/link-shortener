import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(bodyParser.json()); // Middleware pour permettre de lire le corps des requêtes au format JSON

export { app, PORT, SERVER_URL };
