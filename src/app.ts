import express, { Express, Request, Response } from "express";
import morgan from "morgan";

/**
 * Represents the response structure for the health check endpoint.
 */
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

app.get("/api/v1/health", (_req: Request, res: Response): void => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

export default app;

