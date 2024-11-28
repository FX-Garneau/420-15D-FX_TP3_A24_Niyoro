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

// Obtenir un utilisateur par ID
/**
 * Obtiens les informations de l'utilisateur connecté
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function getUser(req, res, next) {
   if (req.user) res.json(req.user.toJSON());
   else next(new ResponseError(401));
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