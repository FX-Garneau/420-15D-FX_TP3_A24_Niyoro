import express from "express";
import { Tag } from "../models/tag.mjs";
import { ResponseError } from "../utils.mjs";

/**
 * Crée un nouveau tag si il n'existe pas déjà
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function createTag(req, res, next) {
   req.user
      ? await Tag.exists({ name: req.body.name.trim() })
         ? Tag.create({ name: req.body.name.trim() }).then(res.json, next)
         : next(new ResponseError(409, "Le tag existe déjà"))
      : next(new Error);
};

/**
 * Récupère tous les tags
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getAllTags(req, res, next) {
   req.user
      ? Tag.find({}).then(res.json, next)
      : next(new Error);
};

/**
 * Récupère un tag spécifique par son identifiant
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getTagById(req, res, next) {
   req.user && req.resource instanceof Tag
      ? res.json(req.resource)
      : next(new Error);
};

/**
 * Met à jour un tag spécifique par son identifiant
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function updateTag(req, res, next) {
   req.user && req.resource instanceof Tag
      ? req.resource.updateOne({ name: req.body.name.trim() }).then(res.json, next)
      : next(new Error);
};

/**
 * Supprime un tag spécifique par son identifiant
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function deleteTag(req, res, next) {
   req.user && req.resource instanceof Tag
      ? req.resource.deleteOne().then(res.json, next)
      : next(new Error);
};