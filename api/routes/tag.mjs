import express from "express";
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from "../controllers/tagController.mjs";
import { isAuth } from "../middleware/authentication.mjs";
import { prefetch } from "../middleware/resource.mjs";
import { Tag } from "../models/tag.mjs";

const router = express.Router();

// Crée un nouveau tag
router.post("/tags", isAuth(true), createTag);
// Récupère tous les tags
router.get("/tags", isAuth(true), getAllTags);
// Récupère un tag spécifique par son identifiant
router.get("/tags/:tag_id", prefetch(Tag, "tag_id"), isAuth(true), getTagById);
// Met à jour un tag spécifique par son identifiant
router.put("/tags/:tag_id", prefetch(Tag, "tag_id"), isAuth(true), updateTag);
// Supprime un tag spécifique par son identifiant
router.delete("/tags/:tag_id", prefetch(Tag, "tag_id"), isAuth(true), deleteTag);

export default router;