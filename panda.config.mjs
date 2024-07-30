import { defineConfig } from "@pandacss/dev";
import { textStyles } from "./src/panda/textStyles";
export default defineConfig({
	// Whether to use css reset
	preflight: true,
	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {
			textStyles,
			tokens: {
				colors: {
					primary: {
						50: {
							value: "#eef2ff",
						},
						100: {
							value: "#e0e7ff",
						},
						200: {
							value: "#c7d2fe",
						},
						300: {
							value: "#a5b4fc",
						},
						400: {
							value: "#818cf8",
						},
						500: {
							value: "#6366f1",
						},
						600: {
							value: "#4f46e5",
						},
						700: {
							value: "#4338ca",
						},
						800: {
							value: "#3730a3",
						},
						900: {
							value: "#312e81",
						},
						950: {
							value: "#1e1b4b",
						},
					},
				},
			},
			semanticTokens: {
				colors: {
					button: {
						primary: {
							value: "colors.primary.500",
						},
						secondary: {
							value: "red",
						},
					},
				},
			},
		},
	},

	jsxFramework: "react",
	importMap: "@panda-css",
	// The output directory for your css system
	outdir: "styled-system",
});
