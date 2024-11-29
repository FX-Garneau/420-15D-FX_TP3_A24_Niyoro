import express from 'express';
import { Item } from '../models/item.mjs';
import { Reaction } from "../models/reaction.mjs";
import { ResponseError } from '../utils.mjs';
import { User } from '../models/user.mjs';

/**
 * Crée un nouvel item
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function createItem(req, res, next) {
   if (!req.user) return next(new ResponseError(401));
   Item.create({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      private: req.body.private,
      sticky: req.body.sticky,
      created_by: req.user._id,
      tags: req.body.tags,
   }).then(item => {
      res.status(201).json(item);
   }).catch(next);
};

// Récupère tous les items non privés
export async function getItems(req, res, next) {
};

/**
 * Récupère tous les items de l'utilisateur connecté ou d'un utilisateur spécifique
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function getItemsByUser(req, res, next) {
   const user = req.resource ?? req.user;
   if (user instanceof User === false) return next(new Error);
   else Item.find({ created_by: user._id }).then(res.json, next);
};

// Récupère un item spécifique
export async function getItem(req, res, next) {
   
};

// Met à jour un item spécifique
// TODO/JsDoc: Document this function
export async function updateItem(req, res, next) {
};

// Supprime un item spécifique
// TODO/JsDoc: Document this function
export async function deleteItem(req, res, next) {
};