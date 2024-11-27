import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mjs";
import { ResponseError } from "../utils.mjs";
import { ENV } from "../app.mjs";

/**
 * Connecte un utilisateur
 * @param {express.Request<any, any, { email?: string, password?: string }>} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function login(req, res, next) {
   const email = req.body?.email?.toString()?.trim()?.toLowerCase() ?? "";
   const password = req.body?.password?.toString()?.trim() ?? "";
   // Validation des données
   if (!email) throw new ResponseError(400, "Le champ `email` est requis.");
   if (!password) throw new ResponseError(400, "Le champ `password` est requis.");
   // Recherche de l'utilisateur
   const user = await User.findOne({ email });
   if (!user) throw new ResponseError(404, "Utilisateur non trouvé.");
   // Vérification du mot de passe
   if (await bcrypt.compare(password, user.password)) throw new ResponseError(401, "Mot de passe incorrect.");
   // Génération du token
   const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: "24h" });
   // Envoi de la réponse
   res.json({ token });
}

/**
 * Crée un nouvel utilisateur
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function signup(req, res, next) {
   // Validation des données et création de l'utilisateur
   User.create(req.body)
      .then(user => {
         // TODO: Set 'Location' header?
         // Génération du token
         const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: "24h" });
         // Envoi de la réponse
         res.status(201).json({ token });
      })
      .catch(next);
}