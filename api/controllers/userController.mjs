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
   req.user
      ? User.find().then(res.json.bind(res), next)
      : next(new Error);
}

/**
 * Obtient les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getUser(req, res, next) {
   req.user && req.resource instanceof User
      ? res.json(req.resource)
      : next(new Error);
}

/**
 * Met à jour les informations de l'utilisateur connecté ou d'un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function updateUser(req, res, next) {
   req.user && req.resource instanceof User
      ? User.findByIdAndUpdate(req.resource._id, {
         first_name: req.body.firstName,
         last_name: req.body.lastName,
         email: req.body.email,
         password: req.body.password,
         avatar: req.body.avatar,
      }, { new: true }).then(res.json.bind(res), next)
      : next(new Error);
}

/**
 * Supprime l'utilisateur connecté ou un utilisateur spécifique par ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function deleteUser(req, res, next) {
   req.user && req.resource instanceof User
      ? req.resource.deleteOne().then(() => res.json(req.resource), next)
      : next(new Error);
}