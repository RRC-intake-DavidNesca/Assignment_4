import { loanSchemas } from "../../src/api/v1/validation/loanSchemas";

describe("loanSchemas", (): void => {
    describe("create.body", (): void => {
        it("should pass for valid create-loan input", (): void => {
            const { error, value } = loanSchemas.create.body.validate({
                applicant: "John Smith",
                amount: 50000
            });

            expect(error).toBeUndefined();
            expect(value).toEqual({
                applicant: "John Smith",
                amount: 50000
            });
        });

        it("should fail when create-loan input is incomplete", (): void => {
            const { error } = loanSchemas.create.body.validate(
                {},
                { abortEarly: false }
            );

            expect(error).toBeDefined();
            expect(error?.details.map((detail): string => detail.message)).toEqual([
                "Applicant is required",
                "Amount is required"
            ]);
        });
    });

    describe("getById.params", (): void => {
        it("should pass for valid get-loan-by-id params", (): void => {
            const { error, value } = loanSchemas.getById.params.validate({
                id: "1"
            });

            expect(error).toBeUndefined();
            expect(value).toEqual({
                id: "1"
            });
        });

        it("should fail when get-loan-by-id params are invalid", (): void => {
            const { error } = loanSchemas.getById.params.validate({
                id: ""
            });

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe("Loan ID cannot be empty");
        });
    });

    describe("update", (): void => {
        it("should pass for valid update-loan body", (): void => {
            const { error, value } = loanSchemas.update.body.validate({
                status: "under_review"
            });

            expect(error).toBeUndefined();
            expect(value).toEqual({
                status: "under_review"
            });
        });

        it("should fail when update-loan body is incomplete", (): void => {
            const { error } = loanSchemas.update.body.validate({});

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe("Loan status is required");
        });
    });

    describe("delete.params", (): void => {
        it("should pass for valid delete-loan params", (): void => {
            const { error, value } = loanSchemas.delete.params.validate({
                id: "1"
            });

            expect(error).toBeUndefined();
            expect(value).toEqual({
                id: "1"
            });
        });

        it("should fail when delete-loan params are invalid", (): void => {
            const { error } = loanSchemas.delete.params.validate({
                id: ""
            });

            expect(error).toBeDefined();
            expect(error?.details[0].message).toBe("Loan ID cannot be empty");
        });
    });
});

