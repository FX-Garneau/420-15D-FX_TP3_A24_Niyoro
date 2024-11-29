import { Router } from "express";
import { createItem, getItems, getItemsByUser, getItem, updateItem, deleteItem } from "../controllers/itemController.mjs";
import { isAuth } from "../middleware/authentication.mjs";
import { isOwner, prefetch } from "../middleware/resource.mjs";
import { Item } from "../models/item.mjs";
import { User } from "../models/user.mjs";

const router = Router();

// Affiche la liste des items publics de tous les utilisateurs
router.get("/items", isAuth(true), getItems);
// Affiche la liste des items publics de l'utilisateur spécifié
router.get("/users/:id_user/items", isAuth(true), prefetch(User, "id_user"), getItemsByUser);
// Affiche la liste des items de l'utilisateur connecté
router.get("/me/items", isAuth(true), getItemsByUser);
// Crée un item
router.post("/items", isAuth(true), createItem);
// Affiche un item spécifique
router.get("/items/:id_item", isAuth(true), prefetch(Item, "id_item"), getItem);
// Supprime un item spécifique (seulement pour le propriétaire)
router.delete("/items/:id_item", isAuth(true), prefetch(Item, "id_item"), isOwner("created_by"), deleteItem);
// Met à jour un item spécifique (seulement pour le propriétaire)
router.put("/items/:id_item", isAuth(true), prefetch(Item, "id_item"), isOwner("created_by"), updateItem);

export default router;