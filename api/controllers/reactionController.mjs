import express from "express";
import { Reaction } from "../models/reaction.mjs";

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
      ? Reaction.create(req.body).then(res.status(201).json, next)
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
      ? req.resource.deleteOne().then(res.json, next)
      : next(new Error);
}