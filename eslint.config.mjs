import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**", "logs/**", "*.log", "jest.config.js"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/typedef": [
                "error",
                {
                    parameter: true,
                    propertyDeclaration: true,
                    variableDeclaration: true,
                    memberVariableDeclaration: true,
                    variableDeclarationIgnoreFunction: true,
                },
            ],
            "no-console": "warn",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-var-requires": "off"
        },
    }
);
