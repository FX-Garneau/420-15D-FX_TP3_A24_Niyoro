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
 * Obtienir les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request<{id?:string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function getUser(req, res, next) {
   if (req.params.id) {
      // Valider l'ID de l'utilisateur
      if (!mongoose.isValidObjectId(req.params.id)) return next(new ResponseError(400));
      // Obtenir les informations de l'utilisateur par ID
      else User.findById(req.params.id)
         .then(user => {
            if (user) res.json(user.toJSON());
            else next(new ResponseError(404, "L'utilisateur n'existe pas"));
         }).catch(next);
   } else {
      // Obtenir les informations de l'utilisateur connecté
      if (req.user) res.json(req.user.toJSON());
      else next(new ResponseError(401));
   }
}

// 
/**
 * Mettre à jour les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request<{id?:string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function updateUser(req, res, next) {
   // Filtrer les options modifiables
   const options = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
   };

   if (req.params.id) {
      // Valider l'ID de l'utilisateur
      if (!mongoose.isValidObjectId(req.params.id)) return next(new ResponseError(400));
      // Mettre à jour les informations de l'utilisateur par ID
      else User.findByIdAndUpdate(req.params.id, options, { new: true })
         .then(user => {
            if (user) res.json(user.toJSON());
            else next(new ResponseError(404, "L'utilisateur n'existe pas"));
         }).catch(next);
   } else {
      // Mettre à jour les informations de l'utilisateur connecté
      if (req.user) {
         // Mettre à jour les informations de l'utilisateur
         Object.assign(req.user, options);
         req.user.save()
            .then(user => res.status(204).end())
            .catch(next);
      } else next(new ResponseError(401));
   }
}

// Supprimer un utilisateur par ID
/**
 * Supprimer l'utilisateur connecté ou un utilisateur spécifique par ID
 */
export async function deleteUser(req, res, next) {
   if (req.params.id) {
      // Valider l'ID de l'utilisateur
      if (!mongoose.isValidObjectId(req.params.id)) return next(new ResponseError(400));
      // Supprimer l'utilisateur par ID
      else User.findByIdAndDelete(req.params.id)
         .then(user => {
            if (user) res.status(204).end();
            else next(new ResponseError(404, "L'utilisateur n'existe pas"));
         }).catch(next);
   } else {
      // Supprimer l'utilisateur connecté
      if (req.user) {
         // Supprimer l'utilisateur connecté
         req.user.delete()
            .then(() => res.status(204).end())
            .catch(next);
      } else next(new ResponseError(401));
   }
}