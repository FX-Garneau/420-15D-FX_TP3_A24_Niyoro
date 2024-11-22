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
 */
app.use((error, _req, res, next) => {
	console.log("Erreur:", error);
	const { message, data, name, statusCode } = error;
	const status = statusCode ?? (name === "ValidationError" ? 422 : 500);
	res.status(status).json({ message: message, data: data });
});

/**
 * Gestionnaire de 404
 */
app.use((_req, res) => {
	res.status(404).json({ message: "Route ou ressource introuvable" });
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
