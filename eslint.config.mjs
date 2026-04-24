// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    },
    {
        files: ["**/*.ts"],
        rules: {
            // Allman style: opening curly brace on its own line
            "brace-style": ["error", "allman", { "allowSingleLine": false }],
            // Four-space indentation
            "indent": ["error", 4, { "SwitchCase": 1 }],
            // Spaces, not tabs
            "no-tabs": "error"
        }
    }
);
