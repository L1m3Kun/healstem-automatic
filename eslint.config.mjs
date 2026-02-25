import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Enforce strict equality (===, !==) for safer comparisons.
      eqeqeq: ["error", "always"],

      // Always require braces for if/else/loops for readability and safety.
      curly: ["error", "all"],

      // Discourage browser alert in production code.
      "no-alert": "warn",

      // Catch accidental debugger commits.
      "no-debugger": "warn",

      // Allow only warn/error console calls in app code.
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Prefer object shorthand: { foo } instead of { foo: foo }.
      "object-shorthand": ["error", "always"],

      // Prefer const when variables are not reassigned.
      "prefer-const": "error",

      // Keep unused vars visible but practical with underscore ignore.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Encourage explicit type imports: import type { Foo } ...
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // Keep import member order tidy (line-level readability).
      "sort-imports": [
        "warn",
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
    },
  },
]);

export default eslintConfig;
