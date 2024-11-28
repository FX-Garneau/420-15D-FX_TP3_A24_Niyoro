import express from "express";
import { createReaction, getReactionsByItem, deleteReaction } from "../controllers/reactionController.mjs";
import { isAuth } from "../middleware/authentication.mjs";

const router = express.Router();

// Crée une nouvelle réaction pour un item spécifique
router.post("/items/:item_id/reactions", isAuth(true), createReaction);

// Récupère toutes les réactions pour un item spécifique
router.get("/items/:item_id/reactions", isAuth(true), getReactionsByItem);

// Supprime une réaction spécifique par son identifiant
router.delete("/reactions/:reaction_id", isAuth(true), deleteReaction);

export default router;