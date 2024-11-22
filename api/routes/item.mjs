import { Router } from "express";
import { createItem, getItems, getItemsByUser, getItem, updateItem, deleteItem } from "../controllers/itemController.mjs";

const router = Router();

// Affiche la liste des items publics de tous les utilisateurs
router.get("/items", getItems);
// Affiche la liste des items publics de l'utilisateur spécifié
router.get("/users/:id_user/items", getItemsByUser);
// Affiche la liste des items de l'utilisateur connecté
router.get("/me/items", getItemsByUser);
// Crée un item
router.post("/items", createItem);
// Affiche un item spécifique
router.get("/items/:id_item", getItem);
// Supprime un item spécifique (seulement pour le propriétaire)
router.delete("/items/:id_item", deleteItem);
// Met à jour un item spécifique (seulement pour le propriétaire)
router.put("/items/:id_item", updateItem);

export default router;