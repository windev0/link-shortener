import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/shortener";

// Fonction de connexion à MongoDB
export const connectToMongoDB = async () => {
  try {
    // Connexion à la base (remplace le lien par le tien si tu as un vrai compte MongoDB)
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1); // quitte l'app si la connexion échoue
  }
};
