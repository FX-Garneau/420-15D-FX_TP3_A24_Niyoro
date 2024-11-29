import { Router } from "express";
import { getUser, getUsers, updateUser, deleteUser } from "../controllers/userController.mjs";
import { isAdmin, isAuth } from "../middleware/authentication.mjs";
import { prefetch } from "../middleware/resource.mjs";
import { User } from "../models/user.mjs";

const router = Router();

// Routes pour l'utilisateur connecté
// Obtenir les informations de l'utilisateur connecté
router.get("/me", isAuth(true), prefetch(User, r => r.user?.id), getUser);
// Mettre à jour les informations de l'utilisateur connecté
router.put("/me", isAuth(true), prefetch(User, r => r.user?.id), updateUser);
// Supprimer le compte de l'utilisateur connecté
router.delete("/me", isAuth(true), prefetch(User, r => r.user?.id), deleteUser);

// Routes pour l'accès par ID (ex : admin ou vue de profil)
// Obtenir les informations d'un utilisateur spécifique
router.get("/users/:id", isAuth(true), prefetch(User, "id"), getUser);
// Mise à jour d'un utilisateur spécifique (réservée aux administrateurs)
router.put("/users/:id", isAuth(true), isAdmin, prefetch(User, "id"), updateUser);
// Suppression d'un utilisateur spécifique (réservée aux administrateurs)
router.delete("/users/:id", isAuth(true), isAdmin, prefetch(User, "id"), deleteUser);

// Route pour lister tous les utilisateurs
router.get("/users", isAuth(true), getUsers);

export default router;