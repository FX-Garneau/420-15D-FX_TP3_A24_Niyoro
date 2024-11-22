import { Router } from "express";

import { seed } from "../controllers/dbController.mjs";

const router = Router();

router.get("/db/seed", seed);

export default router;
