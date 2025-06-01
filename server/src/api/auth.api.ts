import express from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { app } from "../configs/express.config.js";
import User from "../schemas/user.schema.js";
import { createUser } from "./user.api.js";



// register route
app.post(
  "/auth/register",
  async (req: express.Request, res: express.Response): Promise<any> => {
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

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      return res.status(400).json({ error: "Email ou username existe déjà" });
    }
    // Crée un nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      email,
      username,
      password: hashedPassword,
    });

    // Pour l'instant, nous renvoyons simplement les données reçues
    return res.status(201).json({
      message: "Compte créé avec succès",
      user: newUser,
    });
  }
);

// login route
app.post(
  "/auth/login",
  async (req: express.Request, res: express.Response): Promise<any> => {
    if (!req.body) {
      return res.status(400).json({ error: "Aucune donnée reçue" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Here you would typically check the database for the user and validate the password
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    await user.updateOne({
      isLoggedIn: true,
      lastLogin: new Date(),
    });
    const updatedUser = await User.findById(user._id)?.then((u) =>
      u?.toObject()
    );

    if (updatedUser) {
      const token = generateAuthToken(
        updatedUser._id.toString(),
        updatedUser.username
      );
      return res.status(200).json({
        message: "Login successful",
        user: { ...updatedUser, token },
      });
    }
  }
);

// logout route
app.post(
  "/auth/logout",
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { userId } = req?.query;

    const user = await User.findOne({ _id: userId });
    if (user) {
      await user.updateOne({ isLoggedIn: false });
      res.json(true);
      return;
    }
    res.json(false);
  }
);

function generateAuthToken(_id: string, username: string) {
  const token = jwt.sign(
    { _id, username },
    process.env.JWT_SECRET || "shortner-secret-key",
    { expiresIn: "1h" }
  );
  return token;
}
