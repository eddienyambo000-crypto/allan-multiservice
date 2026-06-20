import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "*.config.*"] },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow the few intentional `as unknown as` interop casts (Next 16 cache API).
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
