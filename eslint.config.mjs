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
            "brace-style": "off",
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "no-tabs": "error"
        }
    },
    {
        files: [
            "src/board.ts",
            "src/definitions.ts",
            "src/liquidcolor.ts",
            "src/observerdata.ts",
            "src/player.ts",
            "src/scoreobserver.ts"
        ],
        rules: {
            "brace-style": ["error", "1tbs", { "allowSingleLine": false }]
        }
    }
);
