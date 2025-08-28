// eslint.config.mjs
import next from 'eslint-config-next';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    // Base Next.js + React + TS rules
    ...next,

    // Project-specific rules (optional)
    {
        rules: {
            // Example: tweak rules as needed
            "no-console": "warn",
            "no-debugger": "error"
        }
    },

    // Keep this LAST to turn off ESLint style rules Prettier handles
    eslintConfigPrettier
];