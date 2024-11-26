import express from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../app.mjs";
import { ResponseError } from "../utils.mjs";
import { User } from "../models/user.mjs";

/**
 * Middleware d'authentification
 * @param {boolean} isRequired Requiert une authentification
 * @param {boolean} isAdmin Requiert des droits d'administrateur
 * @returns {express.Handler} La fonction middleware
 */
export function authentication(isRequired, isAdmin = false) {
   return async function (req, res, next) {
      // Récupère le jeton depuis l'en-tête Authorization de la requête
      const authHeader = req.get('Authorization');
      // Vérifie si l'en-tête Authorization est présent
      if (authHeader)
         try {
            // Récupére les données associées les ajoute à l'objet de requête pour utilisation ultérieure
            const session = jwt.verify(authHeader.split(' ')[1], ENV.JWT_SECRET);
            if (typeof session === "object") {
               // Store la session dans l'objet de requête
               req.session = session;
               // Obtenir l'utilisateur depuis la base de données
               req.user = await User.findById(req.session.userId);
               // Vérifie si l'utilisateur existe (si requis)
               if (isRequired && req.user) {
                  // Vérifie si l'utilisateur est un administrateur (si requis)
                  if (isAdmin && !req.user.is_admin)
                     throw new ResponseError(403, "Vous n'avez pas les droits nécessaires pour accéder à cette ressource");
                  // Passe au middleware suivant
                  return next();
               } else
                  throw new ResponseError(401, "L'utilisateur associé au jeton d'authentification est introuvable");
            } else
               throw new ResponseError(401, "Le jeton d'authentification est invalide");
         } catch (error) {
            return next(error);
         }
      else if (isRequired)
         throw new ResponseError(401, "Vous devez être authentifié pour accéder à cette ressource");
   }
}