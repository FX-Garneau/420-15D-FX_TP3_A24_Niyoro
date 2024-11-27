import express from 'express';
import mongoose, { mongo } from 'mongoose';
import jwt from 'jsonwebtoken';
import { getValidationErrorMessage, ResponseError } from '../utils.mjs';

/**
 * Middleware de gestion des erreurs
 * @param {unknown} caught L'erreur à gérer
 * @param {express.Request} req La requête
 * @param {express.Response} res La réponse
 * @param {express.NextFunction} next Le prochain middleware
 */
export async function errorHandler(caught, req, res, next) {
   // Vérifie si l'erreur a déjà été envoyée au client
   if (!res.headersSent) {
      // Création d'une erreur par défaut
      let error = caught instanceof ResponseError
         ? caught
         : new ResponseError(500, "Erreur interne du serveur");
      // Gestion d'erreurs spécifiques
      switch (true) {
         // MongoDB
         case caught instanceof mongo.MongoServerError && caught.code === 11000:
            error = new ResponseError(409, "Un champ unique est déjà utilisé.");
            break;
         // Mongoose
         case caught instanceof mongoose.Error.ValidationError:
            error = new ResponseError(422, getValidationErrorMessage(caught));
            break;
         // JWT
         case caught instanceof jwt.JsonWebTokenError:
         case caught instanceof jwt.TokenExpiredError:
         case caught instanceof jwt.NotBeforeError:
            error = new ResponseError(401, "Non authentifié");
            break;
      }
      // Envoi de l'erreur au client
      res.status(error.statusCode).json(error.toJSON());
      // Affichage de l'erreur dans la console
      console.error(`${error.name}: ${error.message}`);
   } else {
      // Affichage de l'erreur dans la console
      console.warn("Erreur non gérée : ", caught);
   }
}