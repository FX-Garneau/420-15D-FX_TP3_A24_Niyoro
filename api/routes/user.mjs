import { Router } from "express";
import {
	getUser,
	getUsers,
	updateUser,
	deleteUser,
} from "../controllers/userController.mjs";


const router = Router();

// Routes pour l'utilisateur connecté
// Obtenir les informations de l'utilisateur connecté
router.get("/me", getUser);
// Mettre à jour les informations de l'utilisateur connecté
router.put("/me", updateUser);
// Supprimer le compte de l'utilisateur connecté
router.delete("/me", deleteUser);

// Routes pour l'accès par ID (ex : admin ou vue de profil)
// Obtenir les informations d'un utilisateur spécifique
router.get("/users/:id", getUser);
// Mise à jour d'un utilisateur spécifique (réservée aux administrateurs)
router.put("/users/:id", updateUser);
// Suppression d'un utilisateur spécifique (réservée aux administrateurs)
router.delete("/users/:id", deleteUser);

// Route pour lister tous les utilisateurs
router.get("/users", getUsers);


export default router;


