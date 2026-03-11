import express, { Router } from "express";

import {
    createLoan,
    deleteLoan,
    getAllLoans,
    getLoanById,
    updateLoan
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { loanSchemas } from "../validation/loanSchemas";

const router: Router = express.Router();

router.get(
    "/loans",
    authenticate,
    authorize(["officer", "manager", "admin"]),
    getAllLoans
);

router.get(
    "/loans/:id",
    authenticate,
    authorize(["officer", "manager", "admin"]),
    validateRequest(loanSchemas.getById),
    getLoanById
);

router.post(
    "/loans",
    authenticate,
    authorize(["manager", "admin"]),
    validateRequest(loanSchemas.create),
    createLoan
);

router.put(
    "/loans/:id",
    authenticate,
    authorize(["manager", "admin"]),
    validateRequest(loanSchemas.update),
    updateLoan
);

router.delete(
    "/loans/:id",
    authenticate,
    authorize(["admin"]),
    validateRequest(loanSchemas.delete),
    deleteLoan
);

export default router;
