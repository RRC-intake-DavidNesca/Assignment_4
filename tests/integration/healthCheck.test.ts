import request, { Response } from "supertest";

import app from "../../src/app";

describe("GET /api/v1/health", (): void => {
    it("should return server health status", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body).toHaveProperty("uptime");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("version");
    });
});

