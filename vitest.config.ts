import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            exclude: [
                // Compiled output
                "dist/**",
                // Build / lint config
                "eslint.config.mjs",
                "vitest.config.ts",
                // TypeScript declaration file
                "vue-compiler-build.d.ts",
                // Type-only files with no executable runtime code
                "highscorewinner.ts",
                "iobserver.ts",
                "observerdata.ts",
                "offset.ts",
                "commands/icommand.ts",
                "strategies/computerstrategytype.ts",
                "strategies/icomputerstrategy.ts",
                "strategies/strategyinput.ts",
                "strategies/types.ts"
            ]
        }
    }
});
