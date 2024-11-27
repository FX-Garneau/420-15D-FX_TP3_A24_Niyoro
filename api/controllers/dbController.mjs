import express from "express";
import { User } from "../models/user.mjs";
import { Item } from "../models/item.mjs";
import { Tag } from "../models/tag.mjs";
import { Reaction } from "../models/reaction.mjs";
import items from "../seeds/items.mjs";
import reactions from "../seeds/reactions.mjs";
import tags from "../seeds/tags.mjs";
import users from "../seeds/users.mjs";

/**
 * Seed the database with the items, reactions, tags, and users from the seeds directory.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function seed(req, res, next) {
   const result = {};

   try {
      await Promise.all([
         Item.deleteMany(),
         Reaction.deleteMany(),
         Tag.deleteMany(),
         User.deleteMany(),
      ]);

      const [itemsInsert, reactionsInsert, tagsInsert, usersInsert] = [
         await Item.insertMany(items),
         await Reaction.insertMany(reactions),
         await Tag.insertMany(tags),
         await User.insertMany(users)
      ];

      if (tagsInsert.length > 0)
         result.comments = tagsInsert;

      if (reactionsInsert.length > 0)
         result.reactions = reactionsInsert;

      if (itemsInsert.length > 0)
         result.boycotts = itemsInsert;

      if (usersInsert.length > 0)
         result.users = usersInsert;

      res.status(200).json(result);
   } catch (err) {
      if (!err.statusCode)
         err.statusCode = 500;
      next(err);
   }
}