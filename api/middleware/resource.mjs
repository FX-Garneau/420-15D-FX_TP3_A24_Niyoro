import express from 'express';
import mongoose from 'mongoose';
import { ResponseError } from '../utils.mjs';

/**
 * Middleware pour obtenir une ressource préalablement à l'exécution d'une route
 * @param {typeof mongoose.Model} model Modèle de la ressource
 * @param {string|((req: express.Request) => string)} target Nom du paramètre contenant l'ID de la ressource ou fonction pour obtenir l'ID
 * @returns {express.RequestHandler} Middleware
 */
export function prefetch(model, target) {
   return async (req, res, next) => {
      // Obtenir l'ID de la ressource
      const id = typeof target === "function" ? target(req) : req.params[target];
      // Vérifier si l'ID est valide
      if (!mongoose.isValidObjectId(id)) return next(new ResponseError(400, "ID de ressource invalide"));
      // Rechercher la ressource
      req.resource = await model.findById(id);
      // Vérifier si la ressource a été trouvée
      next(req.resource
         ? undefined
         : new ResponseError(404, "Ressource non trouvée")
      );
   };
}

/**
 * Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
 * @param {string} field Champ de la ressource contenant l'ID de l'utilisateur
 * @param {(res: express.Request["resource"]) => boolean} [condition] Condition supplémentaire pour vérifier si l'utilisateur doit être propriétaire
 * @returns {express.RequestHandler} Middleware
 */
export function isOwner(field, condition) {
   return (req, res, next) => {
      next(req.user?._id != req.resource?.[field] && (condition?.(req.resource) ?? true)
         ? undefined
         : new ResponseError(403, "Vous n'êtes pas autorisé à accéder à cette ressource")
      );
   };
}