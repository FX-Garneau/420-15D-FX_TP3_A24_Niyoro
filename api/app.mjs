"use strict";

import express from "express";
import { connect as mongooseConnect } from "mongoose";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import authRoutes from "./routes/auth.mjs";
import itemRoutes from "./routes/item.mjs";
import tagRoutes from "./routes/tag.mjs";
import userRoutes from "./routes/user.mjs";
import reactionRoutes from "./routes/reaction.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import { ResponseError } from "./utils.mjs";
import seedRoutes from "./routes/db.mjs";

dotenvFlow.config();
const app = express();

// Extraction des variables d'environnement
export const ENV = {
   JWT_SECRET: process.env.JWT_SECRET ?? console.warn("La variable d'environnement JWT_SECRET n'est pas définie, utilisation de la clé 'maphrasesupersecrete'") ?? "maphrasesupersecrete",
   MONGODB: process.env.MONGODB ?? console.warn("La variable d'environnement MONGODB n'est pas définie, utilisation de la base de données locale 'test'.") ?? "mongodb://localhost:27017/test",
   PORT: process.env.PORT ?? console.warn("La variable d'environnement PORT n'est pas définie, utilisation du port 8080.") ?? 8080,
};

app.use(cors({
   origin: "*",
   credentials: true
})); // Cross-Origin Resource Sharing
app.use(express.json({ strict: true, })); // application/json

if (process.env.NODE_ENV !== "production")
   app.use(seedRoutes);

app.use("/auth", authRoutes);
app.use(userRoutes);
app.use(itemRoutes);
app.use(tagRoutes);
app.use(reactionRoutes);

// Routes non trouvées
app.all("*", (req, res, next) => {
   return next(new ResponseError(404, "Ressource non trouvée"));
});

// Gestion des erreurs
app.use(errorHandler);

// Connexion à la base de données
mongooseConnect(ENV.MONGODB)
   .then(() => {
      console.log("Connexion à la base de données réussie.");
      // Lancement du serveur
      app.listen(ENV.PORT);
      console.log("Serveur à l'écoute sur : http://localhost:" + ENV.PORT);
      if (process.env.NODE_ENV !== "production") {
         console.log("Mode de développement : les routes de seed sont activées.");
         fetch("http://localhost:" + ENV.PORT + "/db/seed").catch(console.error);
      }
   })
   .catch(console.error);