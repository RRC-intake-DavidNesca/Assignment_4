import express, { Router } from "express";

import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const router: Router = express.Router();

router.get("/me", authenticate, getUserDetails);

export default router;

