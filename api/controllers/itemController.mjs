import express from 'express';
import { Item } from '../models/item.mjs';
import { Reaction } from "../models/reaction.mjs";
import { ResponseError } from '../utils.mjs';
import { User } from '../models/user.mjs';
import { Tag } from '../models/tag.mjs';
import mongoose from 'mongoose';

/**
 * Crée un nouvel item
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function createItem(req, res, next) {
   req.user
      ? Item.create({
         title: req.body.title.trim(),
         content: req.body.content.trim(),
         latitude: req.body.latitude,
         longitude: req.body.longitude,
         private: req.body.private,
         sticky: req.body.sticky,
         created_by: req.user?._id,
         tags: Promise.all(
            req.body.tags?.map?.(async tag =>
               mongoose.isValidObjectId(tag) ? tag : (
                  await Tag.findOne({ name: tag }, {}, { upsert: true }).lean()
               )?._id ?? tag
            )
         )
      }).then(res.status(201).json.bind(res), next)
      : next(new Error);
};

/**
 * Récupère tous les items publics de tous les utilisateurs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getItems(req, res, next) {
   req.user
      ? Item.find({ private: false }).then(res.json.bind(res), next)
      : next(new Error);
};

/**
 * Récupère tous les items de l'utilisateur connecté ou d'un utilisateur spécifique par son ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getItemsByUser(req, res, next) {
   const user = req.resource ?? req.user;
   req.user && user instanceof User
      ? Item.find({
         created_by: user._id,
         ...(req.user._id === user._id ? {} : { private: false })
      }).then(res.json.bind(res), next)
      : next(new Error);
};

/**
 * Récupère un item spécifique par son ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function getItem(req, res, next) {
   req.user && req.resource instanceof Item
      ? res.json(req.resource)
      : next(new Error);
};

/**
 * Met à jour un item spécifique par son ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function updateItem(req, res, next) {
   req.user && req.resource instanceof Item
      ? req.resource.updateOne({
         title: req.body.title.trim(),
         content: req.body.content.trim(),
         latitude: req.body.latitude,
         longitude: req.body.longitude,
         private: req.body.private,
         sticky: req.body.sticky,
         created_by: req.user._id,
         tags: req.body.tags,
      }).then(res.json.bind(res), next)
      : next(new Error);
};

/**
 * Supprime un item spécifique par son ID
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export async function deleteItem(req, res, next) {
   req.user && req.resource instanceof Item
      ? req.resource.deleteOne().then(res.json.bind(res), next)
      : next(new Error);
};