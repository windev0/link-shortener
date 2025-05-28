import { connectToMongoDB } from "./db";
import { app, PORT, SERVER_URL } from "./configs/express.config";

// apis
import "./api/link.api";
import "./api/user.api";

// Connexion à la base de données MongoDB
connectToMongoDB();

app.get("/", (_req, res) => {
  res.send("<h1>Bienvenue sur le service de raccourcissement d'URL !</h1>");
});

// Lance le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur ${SERVER_URL}`);
});
