import express, { Router } from "express";

import {
    createLoan,
    deleteLoan,
    getAllLoans,
    getLoanById,
    updateLoan
} from "../controllers/loanController";

const router: Router = express.Router();

router.get("/loans", getAllLoans);
router.get("/loans/:id", getLoanById);
router.post("/loans", createLoan);
router.put("/loans/:id", updateLoan);
router.delete("/loans/:id", deleteLoan);

export default router;
