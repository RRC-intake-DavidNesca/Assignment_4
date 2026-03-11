import express, { Router } from "express";

import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

/**
 * Route for retrieving the current authenticated user's details.
 * Authentication is added in a later phase.
 */
router.get("/me", getUserDetails);

export default router;

