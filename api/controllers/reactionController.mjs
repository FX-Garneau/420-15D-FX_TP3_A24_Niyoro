import express from "express";
import { Reaction } from "../models/reaction.mjs";
import { ResponseError } from "../utils.mjs";

/**
 * Récupère toutes les réactions associées à un item spécifique
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getReactionsByItem(req, res, next) {
   req.user && req.resource instanceof Reaction
      ? res.json(req.resource)
      : next(new Error);
}

/**
 * Crée une nouvelle réaction pour un item spécifique
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function createReaction(req, res, next) {
   req.user && req.resource instanceof Reaction
      ? !await Reaction.exists({ user_id: req.user._id, item_id: req.resource.item_id })
         ? Reaction.create({
            type: req.body.type,
            user_id: req.user._id,
            item_id: req.resource.item_id
         }).then(res.status(201).json.bind(res), next)
         : next(new ResponseError(409, "Vous avez déjà réagi à cet item"))
      : next(new Error);
}

/**
 * Supprime une réaction existante par son identifiant
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function deleteReaction(req, res, next) {
   req.user && req.resource instanceof Reaction
      ? req.resource.deleteOne().then(res.json.bind(res), next)
      : next(new Error);
}