import express from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../app.mjs";
import { ResponseError } from "../utils.mjs";
import { User } from "../models/user.mjs";
import mongoose from "mongoose";

/**
 * Middleware d'authentification
 * @param {boolean} isRequired Requiert une authentification
 * @returns {express.Handler} La fonction middleware
 */
export function isAuth(isRequired) {
   return async function (req, res, next) {
      // Annule l'opération si la session est déjà définie
      if (req.session && req.user) return next();
      // Récupère le jeton depuis l'en-tête Authorization de la requête
      const authHeader = req.get('Authorization');
      // Vérifie si l'en-tête Authorization est présent
      if (authHeader)
         try {
            // Récupére les données associées les ajoute à l'objet de requête pour utilisation ultérieure
            const session = jwt.verify(authHeader.split(' ')[1], ENV.JWT_SECRET);
            // Vérifie si une session est présente
            if (isRequired && !session)
               return next(new ResponseError(401, "Vous devez être authentifié pour accéder à cette ressource"));
            // Vérifie si la session est un objet
            if (typeof session === "object" && session.userId && mongoose.isValidObjectId(session.userId)) {
               // Store la session dans l'objet de requête
               req.session = session;
               // Obtenir l'utilisateur depuis la base de données
               req.user = await User.findById(req.session.userId);
               // Vérifie si l'utilisateur existe (si requis)
               if (isRequired && req.user)
                  return next();
               else
                  return next(new ResponseError(401, "L'utilisateur associé au jeton d'authentification est introuvable"));
            } else
               return next(new ResponseError(401, "Le jeton d'authentification est invalide"));
         } catch (error) {
            return next(error);
         }
      else if (isRequired)
         return next(new ResponseError(401, "Vous devez être authentifié pour accéder à cette ressource"));
   }
}

/**
 * Middleware de vérification des droits d'administrateur
 * @param {express.Request} req La requête
 * @param {express.Response} res La réponse
 * @param {express.NextFunction} next Le prochain middleware
 */
export function isAdmin(req, res, next) {
   next(req.user?.is_admin
      ? undefined
      : new ResponseError(403, "Vous n'avez pas les droits nécessaires pour accéder à cette ressource")
   );
}