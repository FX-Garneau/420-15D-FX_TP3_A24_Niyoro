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
   const email = req.body?.email?.trim()?.toLowerCase() ?? "";
   const password = req.body?.password?.trim() ?? "";
   // Validation des données
   if (!email) return next(new ResponseError(400, "Le champ `email` est requis"));
   if (!password) return next(new ResponseError(400, "Le champ `password` est requis"));
   // Recherche de l'utilisateur
   const user = await User.findOne({ email });
   // Vérification du mot de passe
   if (!user || !await bcrypt.compare(password, user.password)) return next(new ResponseError(401, "Les informations sont incorrectes"));
   // Génération du token
   const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: "24h" });
   // Envoi de la réponse
   res.setHeader("X-ID", user.id);
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
   User.create({
      first_name: req.body?.first_name?.trim(),
      last_name: req.body?.last_name?.trim(),
      username: req.body?.username?.trim(),
      password: req.body?.password?.trim(),
      email: req.body?.email?.trim()?.toLowerCase(),
   }).then(user => {
      // TODO: Set 'Location' header?
      // Génération du token
      const token = jwt.sign({ userId: user.id }, ENV.JWT_SECRET, { expiresIn: "24h" });
      // Envoi de la réponse
      res.setHeader("X-ID", user.id);
      res.status(201).json({ token });
   }).catch(next);
}