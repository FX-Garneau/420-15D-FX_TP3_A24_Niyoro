import express from 'express';
import mongoose from 'mongoose';
import { ResponseError } from '../utils.mjs';

/**
 * Middleware pour obtenir une ressource préalablement à l'exécution d'une route
 * @param {typeof mongoose.Model} model Modèle de la ressource
 * @param {string} param Paramètre de la requête contenant l'ID de la ressource
 * @returns {express.RequestHandler} Middleware
 */
export function prefetch(model, param) {
   return async (req, res, next) => {
      req.resource = await model.findById(req.params[param]);
      if (!req.resource) return next(new ResponseError(404, "Ressource non trouvée"));
   };
}

/**
 * Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
 * @param {string} field Champ de la ressource contenant l'ID de l'utilisateur
 * @returns {express.RequestHandler} Middleware
 */
export function isOwner(field) {
   return (req, res, next) => {
      if (req.user?.id !== req.resource?.[field])
         return next(new ResponseError(403, "Vous n'êtes pas autorisé à accéder à cette ressource"));
   };
}