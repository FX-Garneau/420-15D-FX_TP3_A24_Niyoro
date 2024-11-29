import { Router } from "express";
import { getUser, getUsers, updateUser, deleteUser } from "../controllers/userController.mjs";
import { isAdmin, isAuth } from "../middleware/authentication.mjs";

const router = Router();

// Routes pour l'utilisateur connecté
// Obtenir les informations de l'utilisateur connecté
router.get("/me", isAuth(true), getUser);
// Mettre à jour les informations de l'utilisateur connecté
router.put("/me", isAuth(true), updateUser); // TODO: Test this route
// Supprimer le compte de l'utilisateur connecté
router.delete("/me", isAuth(true), deleteUser); // TODO: Test this route

// Routes pour l'accès par ID (ex : admin ou vue de profil)
// Obtenir les informations d'un utilisateur spécifique
router.get("/users/:id", isAuth(true), getUser);
// Mise à jour d'un utilisateur spécifique (réservée aux administrateurs)
router.put("/users/:id", isAuth(true), isAdmin, updateUser); // TODO: Test this route
// Suppression d'un utilisateur spécifique (réservée aux administrateurs)
router.delete("/users/:id", isAuth(true), isAdmin, deleteUser); // TODO: Test this route

// Route pour lister tous les utilisateurs
router.get("/users", isAuth(true), getUsers);

export default router;