import mongoose from "mongoose";

// Définition du schéma des documents (équivalent d'une "table")
const linkSchema = new mongoose.Schema({
  userId: { type: String, require: false },
  shortUrl: { type: String, required: false },
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Création du modèle basé sur le schéma
const Link = mongoose.model("Link", linkSchema);
export default Link;
