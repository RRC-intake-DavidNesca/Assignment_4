import request, { Response } from "supertest";

import { app } from "../../src/app";
import { HTTP_STATUS } from "../../src/constants/httpConstants";

describe("Loan Routes", (): void => {
    jest.setTimeout(60000);
    let createdLoanId: string = "";

    it("should return all loan applications", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/loans");

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.message).toBe("Loan applications retrieved");
        expect(response.body.count).toBeGreaterThanOrEqual(4);
        expect(response.body.data).toEqual(expect.any(Array));
    }, 60000);

    it("should return a single loan application by id", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/loans/1");

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "Loan application retrieved",
            data: {
                id: "1",
                applicant: "John Smith",
                amount: 50000,
                status: "pending",
                createdAt: "2025-01-10T10:00:00.000Z"
            }
        });
    });

    it("should return not found for a missing loan application", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/loans/999");

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Loan application not found",
                code: "LOAN_NOT_FOUND"
            },
            timestamp: expect.any(String)
        });
    });

    it("should return bad request when create input is incomplete", async (): Promise<void> => {
        const response: Response = await request(app)
            .post("/api/v1/loans")
            .send({});

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Applicant and amount are required",
                code: "INVALID_LOAN_INPUT"
            },
            timestamp: expect.any(String)
        });
    });

    it("should create a new loan application", async (): Promise<void> => {
        const response: Response = await request(app)
            .post("/api/v1/loans")
            .send({
                applicant: "New Applicant",
                amount: 125000
            });

        createdLoanId = response.body.data.id as string;

        expect(response.status).toBe(HTTP_STATUS.CREATED);
        expect(response.body).toEqual({
            message: "Loan application created",
            data: {
                id: expect.any(String),
                applicant: "New Applicant",
                amount: 125000,
                status: "pending",
                createdAt: expect.any(String)
            }
        });
    });

    it("should return bad request when update input is incomplete", async (): Promise<void> => {
        const response: Response = await request(app)
            .put(`/api/v1/loans/${createdLoanId}`)
            .send({});

        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Loan status is required",
                code: "INVALID_LOAN_UPDATE"
            },
            timestamp: expect.any(String)
        });
    });

    it("should update an existing loan application", async (): Promise<void> => {
        const response: Response = await request(app)
            .put(`/api/v1/loans/${createdLoanId}`)
            .send({
                status: "under_review"
            });

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "Loan application updated",
            data: {
                id: createdLoanId,
                applicant: "New Applicant",
                amount: 125000,
                status: "under_review",
                createdAt: expect.any(String)
            }
        });
    });

    it("should delete an existing loan application", async (): Promise<void> => {
        const response: Response = await request(app).delete(
            `/api/v1/loans/${createdLoanId}`
        );

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "Loan application deleted"
        });
    });

    it("should return not found when deleting a missing loan application", async (): Promise<void> => {
        const response: Response = await request(app).delete("/api/v1/loans/999");

        expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Loan application not found",
                code: "LOAN_NOT_FOUND"
            },
            timestamp: expect.any(String)
        });
    });
});
