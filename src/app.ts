import express, { Express } from "express";

import { APP_CONFIG } from "../config/config";
import errorHandler from "./api/v1/middleware/errorHandler";
import {
    accessLogger,
    consoleLogger,
    errorLogger,
} from "./api/v1/middleware/logger";
import adminRoutes from "./api/v1/routes/adminRoutes";
import authRoutes from "./api/v1/routes/authRoutes";
import healthRoutes from "./api/v1/routes/healthRoutes";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";

const app: Express = express();

/**
 * Applies request logging early in the middleware pipeline.
 */
if (process.env.NODE_ENV === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(consoleLogger);
}

/**
 * Parses JSON request bodies before route handling.
 */
app.use(express.json());

/**
 * Mounts versioned API routes.
 */
app.use(APP_CONFIG.apiPrefix, healthRoutes);
app.use(APP_CONFIG.apiPrefix, loanRoutes);
app.use(`${APP_CONFIG.apiPrefix}/auth`, authRoutes);
app.use(`${APP_CONFIG.apiPrefix}/users`, userRoutes);
app.use(`${APP_CONFIG.apiPrefix}/admin`, adminRoutes);

/**
 * Applies the global error handler last.
 */
app.use(errorHandler);

export { app };
export default app;
