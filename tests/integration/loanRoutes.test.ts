import request, { Response } from "supertest";

jest.mock("../../config/firebaseConfig", () => {
    const actual: Record<string, unknown> = jest.requireActual(
        "../../config/firebaseConfig"
    ) as Record<string, unknown>;

    return {
        ...actual,
        auth: {
            verifyIdToken: jest.fn()
        }
    };
});

import { auth } from "../../config/firebaseConfig";
import { app } from "../../src/app";
import { HTTP_STATUS } from "../../src/constants/httpConstants";

const mockedAuth: { verifyIdToken: jest.Mock } = auth as unknown as {
    verifyIdToken: jest.Mock;
};

describe("Loan Routes", (): void => {
    let createdLoanId: string = "";

    beforeEach((): void => {
        jest.clearAllMocks();
    });

    it("should return 401 when no token is provided for a protected loan route", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/loans");

        expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Unauthorized: No token provided",
                code: "TOKEN_NOT_FOUND"
            },
            timestamp: expect.any(String)
        });
    });

    it("should return 401 when the token is invalid", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockRejectedValueOnce(
            new Error("Invalid token")
        );

        const response: Response = await request(app)
            .get("/api/v1/loans")
            .set("Authorization", "Bearer invalid.token.here");

        expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Unauthorized: Invalid token",
                code: "TOKEN_INVALID"
            },
            timestamp: expect.any(String)
        });
    });

    it("should allow officer access to get all loans", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "officer-uid",
            role: "officer"
        });

        const response: Response = await request(app)
            .get("/api/v1/loans")
            .set("Authorization", "Bearer officer-token");

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.message).toBe("Loan applications retrieved");
        expect(response.body.data).toEqual(expect.any(Array));
    });

    it("should allow officer access to get a loan by id and reach handler-level 404 when missing", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "officer-uid",
            role: "officer"
        });

        const response: Response = await request(app)
            .get("/api/v1/loans/999")
            .set("Authorization", "Bearer officer-token");

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

    it("should forbid officer access to create a loan", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "officer-uid",
            role: "officer"
        });

        const response: Response = await request(app)
            .post("/api/v1/loans")
            .set("Authorization", "Bearer officer-token")
            .send({
                applicant: "Officer Attempt",
                amount: 250000
            });

        expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE"
            },
            timestamp: expect.any(String)
        });
    });

    it("should allow manager access to create a loan", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "manager-uid",
            role: "manager"
        });

        const response: Response = await request(app)
            .post("/api/v1/loans")
            .set("Authorization", "Bearer manager-token")
            .send({
                applicant: "Manager Created Loan",
                amount: 125000
            });

        createdLoanId = response.body.data.id as string;

        expect(response.status).toBe(HTTP_STATUS.CREATED);
        expect(response.body).toEqual({
            message: "Loan application created",
            data: {
                id: expect.any(String),
                applicant: "Manager Created Loan",
                amount: 125000,
                status: "pending",
                createdAt: expect.any(String)
            }
        });
    });

    it("should allow manager access to update a loan", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "manager-uid",
            role: "manager"
        });

        const response: Response = await request(app)
            .put(`/api/v1/loans/${createdLoanId}`)
            .set("Authorization", "Bearer manager-token")
            .send({
                status: "under_review"
            });

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "Loan application updated",
            data: {
                id: createdLoanId,
                applicant: "Manager Created Loan",
                amount: 125000,
                status: "under_review",
                createdAt: expect.any(String)
            }
        });
    });

    it("should forbid manager access to delete a loan", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "manager-uid",
            role: "manager"
        });

        const response: Response = await request(app)
            .delete(`/api/v1/loans/${createdLoanId}`)
            .set("Authorization", "Bearer manager-token");

        expect(response.status).toBe(HTTP_STATUS.FORBIDDEN);
        expect(response.body).toEqual({
            success: false,
            error: {
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE"
            },
            timestamp: expect.any(String)
        });
    });

    it("should allow admin access to delete a loan", async (): Promise<void> => {
        mockedAuth.verifyIdToken.mockResolvedValueOnce({
            uid: "admin-uid",
            role: "admin"
        });

        const response: Response = await request(app)
            .delete(`/api/v1/loans/${createdLoanId}`)
            .set("Authorization", "Bearer admin-token");

        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body).toEqual({
            message: "Loan application deleted"
        });
    });
});
