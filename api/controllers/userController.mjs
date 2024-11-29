import express from "express";
import { User } from "../models/user.mjs";
import { ResponseError } from "../utils.mjs";

/**
 * Récupère la liste des utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getUsers(req, res, next) {
   User.find().then(res.json, next);
}

/**
 * Obtient les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getUser(req, res, next) {
   req.resource instanceof User
      ? res.json(req.resource)
      : next(new ResponseError(404, "L'utilisateur n'existe pas"));
}

/**
 * Met à jour les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function updateUser(req, res, next) {
   req.resource instanceof User && req.user
      ? req.resource.updateOne({
         first_name: req.body.firstName,
         last_name: req.body.lastName,
         email: req.body.email,
         password: req.body.password,
         avatar: req.body.avatar,
      }, { new: true }).then(res.json, next)
      : next(new ResponseError(404, "L'utilisateur n'existe pas"));
}

/**
 * Supprime l'utilisateur connecté ou un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function deleteUser(req, res, next) {
   req.resource instanceof User
      ? req.resource.deleteOne().then(res.json, next)
      : next(new ResponseError(404, "L'utilisateur n'existe pas"));
}