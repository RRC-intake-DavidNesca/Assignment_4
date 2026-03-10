import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/health", (_req: Request, res: Response): void => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default router;
