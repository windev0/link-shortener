import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import cors from "cors";

import Link from "./schemas/link.schema";
import { connectToMongoDB } from "./db";

// Création de l'application Express
const app = express();
app.use(cors());
const PORT = 5000;

// Connexion à la base de données MongoDB
connectToMongoDB();

app.get("/", (_req, res) => {
  res.send(
    "<h1>Bienvenue sur le service de raccourcissement d'URL !</h1> <h2>Utilisez POST /shorten pour raccourcir une URL</h2>"
  );
});
// Middleware pour permettre de lire le corps des requêtes au format JSON
app.use(bodyParser.json());

// Dictionnaire en mémoire pour stocker les URLs (clé = ID court, valeur = URL longue)
// const urlDatabase: Record<string, string> = {};

/**
 * Route POST /shorten
 * Reçoit une URL longue dans le corps de la requête
 * Renvoie une URL courte
 */

app.post("/shorten", async (req: express.Request, res: any) => {
  const { originalUrl } = req.body;

  // Vérifie que l'utilisateur a bien fourni une URL
  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl est requis" });
  }

  // Génère un identifiant court (ex: "abc123")
  const shortId = nanoid(6);

  // Stocke l'association entre l'ID et l'URL d'origine
  // urlDatabase[shortId] = originalUrl;

  try {
    // Crée et sauvegarde un nouveau lien dans la base
    const newLink = new Link({ shortId, originalUrl });
    const savedLink = await newLink.save();

    const shortUrl = `http://localhost:${PORT}/${shortId}`;
    res.json({ shortUrl, ...savedLink.toObject() });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du lien :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }

  // Renvoie l'URL courte au format http://localhost:5000/abc123
  // const shortUrl = `http://localhost:${PORT}/${shortId}`;
  // res.json({ shortUrl });
});

/**
 * Route GET /stats/:shortId
 * Renvoie la liste de toutes les URL courtes
 */
app.get("/all", async (_req: express.Request, res: express.Response) => {
  try {
    // Renvoie toutes les URL courtes par ordre decroissant de date

    const allLinks = await Link.find().sort({ createdAt: -1 });
    allLinks.forEach((link) => {
      link.shortUrl = `http://localhost:${PORT}/${link.shortId}`;
    });
    res.json(allLinks);
  } catch (error) {
    console.error("Erreur lors de la récupération des liens :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * Route GET /:shortId
 * Redirige toute requête contenant un ID court vers l'URL d’origine
 */
app.get("/:shortId", async (req: any, res: any) => {
  const { shortId } = req.params;

  // Recherche l'URL longue associée à l'identifiant
  // const originalUrl = urlDatabase[shortId];

  // // Si non trouvée, erreur 404
  // if (!originalUrl) {
  //   return res.status(404).send("Lien non trouvé");
  // }

  // // Redirige vers l'URL longue
  // res.redirect(originalUrl);

  try {
    // Recherche dans MongoDB un document correspondant à l'ID
    const link = await Link.findOne({ shortId });

    if (!link) {
      return res.status(404).send("Lien non trouvé");
    }

    // Redirige vers l’URL d’origine
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Erreur pendant la redirection :", error);
    res.status(500).send("Erreur serveur");
  }
});

// Lance le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
