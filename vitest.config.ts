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
                "src/types/**",
                // Type-only files with no executable runtime code
                "src/highscorewinner.ts",
                "src/iobserver.ts",
                "src/observerdata.ts",
                "src/offset.ts",
                "src/commands/icommand.ts",
                "src/strategies/computerstrategytype.ts",
                "src/strategies/icomputerstrategy.ts",
                "src/strategies/strategyinput.ts",
                "src/strategies/types.ts"
            ]
        }
    }
});
