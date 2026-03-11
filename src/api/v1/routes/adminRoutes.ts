import express, { Router } from "express";

import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router: Router = express.Router();

/**
 * Only admins can assign custom claims after the initial bootstrap phase.
 */
router.post(
    "/setCustomClaims",
    authenticate,
    authorize(["admin"]),
    setCustomClaims
);

export default router;

