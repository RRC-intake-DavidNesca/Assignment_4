import express, { Router } from "express";

import { setCustomClaims } from "../controllers/adminController";

const router: Router = express.Router();

/**
 * Route for setting custom claims on Firebase users.
 * Authentication and authorization are added in later phases.
 */
router.post("/setCustomClaims", setCustomClaims);

export default router;

