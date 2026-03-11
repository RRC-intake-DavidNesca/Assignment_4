import express, { Router } from "express";

import { validateRequest } from "../middleware/validate";
import { loanSchemas } from "../validation/loanSchemas";
import {
    createLoan,
    deleteLoan,
    getAllLoans,
    getLoanById,
    updateLoan
} from "../controllers/loanController";

const router: Router = express.Router();

router.get("/loans", getAllLoans);
router.get("/loans/:id", validateRequest(loanSchemas.getById), getLoanById);
router.post("/loans", validateRequest(loanSchemas.create), createLoan);
router.put("/loans/:id", validateRequest(loanSchemas.update), updateLoan);
router.delete("/loans/:id", validateRequest(loanSchemas.delete), deleteLoan);

export default router;
