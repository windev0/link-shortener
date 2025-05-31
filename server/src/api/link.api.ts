import { nanoid } from "nanoid";
import express from "express";
import { app, SERVER_URL } from "../configs/express.config.js";
import Link from "../schemas/link.schema.js";

// Dictionnaire en mémoire pour stocker les URLs (clé = ID court, valeur = URL longue)
// const urlDatabase: Record<string, string> = {};
/**
 * Route POST /shorten
 * Reçoit une URL longue dans le corps de la requête
 * Renvoie une URL courte
 */

app.post("/links/shorten", async (req: express.Request, res: any) => {
  if (!req.body) {
    return res.status(400).json({ error: "Body cannot be empty" });
  }
  const { originalUrl, userID: userId } = req.body;
  const { offline } = req.query;

  console.log("offline", offline);
  console.log("userId", userId);

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
    const newLink = new Link({ shortId, originalUrl, userId });
    const savedLink = await newLink.save();

    const shortUrl = `${SERVER_URL}/links/${shortId}`;

    if (offline) {
      const link = { shortUrl, ...newLink.toObject() };
      res.json(link);
      return;
    }

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
app.get("/links", async (req: express.Request, res: express.Response) => {
  try {
    const { userID: userId } = req.query;

    // Renvoie toutes les URL courtes par ordre decroissant de date

    const allLinks = await Link.find({ userId }).sort({
      createdAt: -1,
    });
    
    allLinks.forEach((link) => {
      link.shortUrl = `${SERVER_URL}/links/${link.shortId}`;
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
app.get("/links/:shortId", async (req: any, res: any) => {
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
