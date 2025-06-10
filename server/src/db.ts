import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/shortener";

// Fonction de connexion à MongoDB
export const connectToMongoDB = async () => {
  try {
    console.log("MongoDB URI:", MONGODB_URI);
    if (MONGODB_URI) {
      console.log("🔗 Tentative de connexion à MongoDB...");
      await mongoose.connect(MONGODB_URI).then(() => {
        console.log("✅ Connecté à MongoDB");
      });
    } else {
      console.error("❌ MONGODB_URI n'est pas défini dans le fichier .env");
      process.exit(1); // quitte l'app si l'URI n'est pas défini
    }
    // Connexion à la base (remplace le lien par le tien si tu as un vrai compte MongoDB)
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1); // quitte l'app si la connexion échoue
  }
};
