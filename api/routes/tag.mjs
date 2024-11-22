import express from "express";
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from "../controllers/tagController.mjs";

const router = express.Router();

// Crée un nouveau tag
router.post("/tags", createTag);
// Récupère tous les tags
router.get("/tags", getAllTags);
// Récupère un tag spécifique par son identifiant
router.get("/tags/:tag_id", getTagById);
// Met à jour un tag spécifique par son identifiant
router.put("/tags/:tag_id", updateTag);
// Supprime un tag spécifique par son identifiant
router.delete("/tags/:tag_id", deleteTag);

export default router;