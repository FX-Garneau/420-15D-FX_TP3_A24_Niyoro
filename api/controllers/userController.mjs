import express from "express";
import mongoose from "mongoose";
import { User } from "../models/user.mjs";
import { Item } from "../models/item.mjs";
import { Reaction } from "../models/reaction.mjs";
import { ResponseError } from "../utils.mjs";

// Récupère les utilisateurs
// TODO/JsDoc: Document this function
export async function getUsers(req, res, next) {
   // TODO: Implement getUsers function
}

/**
 * Obtiens les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request<{id?:string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function getUser(req, res, next) {
   if (req.params.id) {
      // Valider l'ID de l'utilisateur
      if (!mongoose.isValidObjectId(req.params.id)) return next(new ResponseError(400));
      // Obtenir les informations de l'utilisateur par ID
      else User.findById(req.params.id).then(user => {
         if (user) res.json(user.toJSON());
         else next(new ResponseError(404, "L'utilisateur n'existe pas"));
      }).catch(next);
   } else {
      // Obtenir les informations de l'utilisateur connecté
      if (req.user) res.json(req.user.toJSON());
      else next(new ResponseError(401));
   }
}

// Mettre à jour un utilisateur par ID
// TODO/JsDoc: Document this function
export async function updateUser(req, res, next) {
   // TODO: Implement updateUser function
}

// Supprimer un utilisateur par ID
// TODO/JsDoc: Document this function
export async function deleteUser(req, res, next) {
   // TODO: Implement deleteUser function
}