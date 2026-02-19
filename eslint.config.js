import js from "@eslint/js";
import react from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	// 1. Common settings and ignores
	{
		ignores: [
			"node_modules/",
			"dist/",
			"build/",
			"coverage/",
			"*.config.js",
			"*.config.ts",
		],
	},

	// 2. Base JavaScript
	js.configs.recommended,

	// 3. TypeScript with type checking
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: globals.browser,
			ecmaVersion: "latest",
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},

	// 4. React
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],
	{
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: reactHooks.configs.recommended.rules,
	},

	// 5. Additional plugins
	{
		plugins: {
			"react-refresh": reactRefresh,
		},
		rules: {
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},

	// 6. Main configuration
	{
		plugins: {
			"unused-imports": unusedImports,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			/* ------- Style -------- */
			quotes: ["error", "double", { avoidEscape: true }],
			semi: ["error", "always"],
			indent: ["error", "tab", { SwitchCase: 1 }],

			/* ------- React Hooks -- */
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
			"@typescript-eslint/only-throw-error": "off",

			/* ------- Import Sorting & Cleanup ---- */
			"unused-imports/no-unused-imports": "error",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",

			/* ------- Other  ------ */
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
		},
		settings: { react: { version: "detect" } },
	},

	// 7. Special import groups for src/**
	{
		files: ["src/**/*.{js,ts,jsx,tsx}"],
		rules: {
			"simple-import-sort/imports": ["error", {
				groups: [
					// React first, then other packages
					["^react", "^@?\\w"],
					// Internal packages (libs, constants)
					["^(@|libs|constants)(/.*|$)"],
					// Components
					["^(@|components)(/.*|$)"],
					// Storage
					["^(@|storage)(/.*|$)"],
					// Side effect imports
					["^\\u0000"],
					// Parent imports (../)
					["^\\.\\.(?!/?$)", "^\\.\\./?$"],
					// Relative imports (./)
					["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
					// Style imports
					["^.+\\.css$"],
				],
			}],
		},
	}
);
