import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

// Création de l'application Express
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); // Middleware pour permettre de lire le corps des requêtes au format JSON

export { app, PORT };
