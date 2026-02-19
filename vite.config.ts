import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import Inspect from "vite-plugin-inspect";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	server: {
		host: true,
		port: 3000,
	},
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
	plugins: [
		Inspect(),
		tailwindcss(),
		react(),
		checker({
			typescript: true,
			overlay: true,
			eslint: {
				lintCommand: "eslint \"./src/**/*.{ts,tsx}\"",
				useFlatConfig: true,
			},
		}),
	],
});

