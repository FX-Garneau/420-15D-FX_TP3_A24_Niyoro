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
         // Express.json
         case caught instanceof SyntaxError && caught["status"] === 400 && "body" in caught:
            error = new ResponseError(400, "Le corps de la requête est invalide");
         // MongoDB
         case caught instanceof mongo.MongoServerError && caught.code === 11000:
            error = new ResponseError(409, "Un champ unique est déjà utilisé");
            break;
         // Mongoose
         case caught instanceof mongoose.Error.CastError:
            error = new ResponseError(400, "ID de ressource invalide : " + caught.value);
            break;
         case caught instanceof mongoose.Error.ValidationError:
            error = new ResponseError(422, getValidationErrorMessage(caught),
               Object.fromEntries(Object.entries(caught.errors).map(entry => [entry[1].path, entry[1].message])));
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
      error.statusCode !== 500
         ? console.error(`${error.name}: ${error.message}`)
         : console.error(caught);
   } else {
      // Affichage de l'erreur dans la console
      console.warn("Erreur non gérée : ", caught);
   }
}