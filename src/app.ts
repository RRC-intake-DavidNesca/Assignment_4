import express, { Express } from "express";
import morgan from "morgan";

import { APP_CONFIG } from "../config/config";
import errorHandler from "./api/v1/middleware/errorHandler";
import healthRoutes from "./api/v1/routes/healthRoutes";
import loanRoutes from "./api/v1/routes/loanRoutes";

const app: Express = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(APP_CONFIG.apiPrefix, healthRoutes);
app.use(APP_CONFIG.apiPrefix, loanRoutes);
app.use(errorHandler);

export { app };
export default app;
