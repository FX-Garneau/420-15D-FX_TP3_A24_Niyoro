import express from "express";
import { createReaction, getReactionsByItem, deleteReaction } from "../controllers/reactionController.mjs";
import { isAuth } from "../middleware/authentication.mjs";
import { prefetch } from "../middleware/resource.mjs";
import { Item } from "../models/item.mjs";
import { Reaction } from "../models/reaction.mjs";

const router = express.Router();

// Crée une nouvelle réaction pour un item spécifique
router.post("/items/:item_id/reactions", isAuth(true), prefetch(Item, "item_id"), createReaction);

// Récupère toutes les réactions pour un item spécifique
router.get("/items/:item_id/reactions", isAuth(true), prefetch(Item, "item_id"), getReactionsByItem);

// Supprime une réaction spécifique par son identifiant
router.delete("/reactions/:reaction_id", isAuth(true), prefetch(Reaction, "reaction_id"), deleteReaction);

export default router;