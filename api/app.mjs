"use strict";

import express from "express";
import mongoose, { connect as mongooseConnect } from "mongoose";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import authRoutes from "./routes/auth.mjs";
import itemRoutes from "./routes/item.mjs";
import tagRoutes from "./routes/tag.mjs";
import userRoutes from "./routes/user.mjs";
import reactionRoutes from "./routes/reaction.mjs";
import { isValidationError, ResponseError } from "./utils.mjs";
// import seedRoutes from "./routes/db.mjs";

dotenvFlow.config();
const app = express();

const port = process.env.PORT ?? 3000;

app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // application/json

app.use("/auth", authRoutes);
app.use(userRoutes);
app.use(itemRoutes);
app.use(tagRoutes);
app.use(reactionRoutes);
// app.use(seedRoutes);

/**
 * Gestionnaire d'erreurs
 * @param {any} error L'erreur à gérer
 */
app.use((error, _req, res, next) => {
   if (error instanceof ResponseError === false)
      // Si l'erreur n'est pas une erreur de réponse, on la transforme en erreur de réponse
      if (isValidationError(error)) error = new ResponseError(422, "Erreur de validation",);
      else error = new ResponseError(500, "Erreur interne du serveur", error);
   console.error(error);
   res.status(error).json({ message: error.message, data: error.data });
});

/**
 * Gestionnaire de 404
 */
app.use((_req, res) => {
   res.status(404).json(...new ResponseError(404, "Ressource non trouvée").toJSON());
});

if (process.env.MONGODB != null) {
   mongooseConnect(process.env.MONGODB)
      .then(() => {
         app.listen(port);
         console.log("Serveur à l'écoute sur : http://localhost:" + port);
      })
      .catch((err) => console.log(err));
} else {
   console.log("La variable d'environnement MONGODB n'est pas définie.");
   process.exit(1);
}
