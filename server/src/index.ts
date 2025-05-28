import bodyParser from "body-parser";
import { connectToMongoDB } from "./db";
import { app, PORT } from "./configs/express.config";
import "./api/links.api";
import "./api/user.api";

// Connexion à la base de données MongoDB
connectToMongoDB();

app.get("/", (_req, res) => {
  res.send(
    "<h1>Bienvenue sur le service de raccourcissement d'URL !</h1> <h2>Utilisez POST /shorten pour raccourcir une URL</h2>"
  );
});


// Lance le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
