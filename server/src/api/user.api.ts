import { app } from "../configs/express.config.js";
import express from "express";
import User from "../schemas/user.schema.js";
import { UserData } from "../utils/types.js";

app.post("/users", async (req, res): Promise<any> => {
  if (!req.body) {
    return res.status(400).json({ error: "Aucune donnée reçue" });
  }
  const { username, email, password } = req.body;

  // Vérifie que l'utilisateur a bien fourni un nom d'utilisateur et un email
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username,  email, password sont requis" });
  }

  if (typeof username !== "string" || typeof email !== "string") {
    return res.status(400).json({
      error: "username et email doivent être des chaînes de caractères",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "email invalide" });
  }

  let existedUser = await User.findOne({ $equals: { email } });
  if (!existedUser) {
    existedUser = await User.findOne({ $equals: { username } });
  }

  console.log(existedUser);
  if (existedUser) {
    return res.status(400).json({ error: "Email ou username existe déjà" });
  }

  // Crée un nouvel utilisateur
  const newUser = await createUser({ email, username, password });

  // Pour l'instant, nous renvoyons simplement les données reçues
  return res.status(201).json({
    message: "Utilisateur créé avec succès",
    user: newUser,
  });
});

app.get("/users", async (_req, res: express.Response) => {
  try {
    // Récupère tous les utilisateurs
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get(
  "/users/:id",
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;

    try {
      // Récupère un utilisateur par son ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

app.put(
  "/users/:id",
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
      // Met à jour un utilisateur par son ID
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

app.delete(
  "/users/:id",
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;

    try {
      // Supprime un utilisateur par son ID
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

export async function createUser(data: UserData) {
  const newUser = new User({
    username: data.username,
    email: data.email,
    password: data.password, // Assurez-vous de hacher le mot de passe avant de le stocker
  });

  const user = await newUser.save();
  user.toObject();
}
