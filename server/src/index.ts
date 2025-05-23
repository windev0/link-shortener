import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";

// Création de l'application Express
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send(
    "<h1>Bienvenue sur le service de raccourcissement d'URL !</h1> <h2>Utilisez POST /shorten pour raccourcir une URL</h2>"
  );
});
// Middleware pour permettre de lire le corps des requêtes au format JSON
app.use(bodyParser.json());

// Dictionnaire en mémoire pour stocker les URLs (clé = ID court, valeur = URL longue)
const urlDatabase: Record<string, string> = {};

/**
 * Route POST /shorten
 * Reçoit une URL longue dans le corps de la requête
 * Renvoie une URL courte
 */

app.post("/shorten", (req: any, res: any) => {
  const { originalUrl } = req.body;

  // Vérifie que l'utilisateur a bien fourni une URL
  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl est requis" });
  }

  // Génère un identifiant court (ex: "abc123")
  const shortId = nanoid(6);

  // Stocke l'association entre l'ID et l'URL d'origine
  urlDatabase[shortId] = originalUrl;

  // Renvoie l'URL courte au format http://localhost:5000/abc123
  const shortUrl = `http://localhost:${PORT}/${shortId}`;
  res.json({ shortUrl });
});

/**
 * Route GET /stats/:shortId
 * Renvoie la liste de toutes les URL courtes
 */
app.get("/all", (req: any, res: any) => {
  // Renvoie toutes les URL courtes
  return res.json(urlDatabase);
});

/**
 * Route GET /:shortId
 * Redirige toute requête contenant un ID court vers l'URL d’origine
 */
app.get("/:shortId", (req: any, res: any) => {
  const { shortId } = req.params;

  // Recherche l'URL longue associée à l'identifiant
  const originalUrl = urlDatabase[shortId];

  // Si non trouvée, erreur 404
  if (!originalUrl) {
    return res.status(404).send("Lien non trouvé");
  }

  // Redirige vers l'URL longue
  res.redirect(originalUrl);
});

// Lance le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
