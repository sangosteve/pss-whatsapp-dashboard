/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"], // Class-based dark mode
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"], // Ensure all your source files are included
	theme: {
		extend: {
			borderRadius: {
				lg: "var(--radius)", // Custom radius variable
				md: "calc(var(--radius) - 2px)", // Custom radius variable
				sm: "calc(var(--radius) - 4px)", // Custom radius variable
			},
			colors: {
				primary: "#47a260", // Main brand color (green)
				secondary: "#ecf3e6", // Light background color (light green)
				accent: "#101013", // Dark accent color (dark gray/black)
				background: "#fffefe", // Light background for light mode (off-white)
				backgroundDark: "#101013", // Dark background for dark mode (dark gray/black)
				textLight: "#101013", // Dark text for light mode
				textDark: "#ecf3e6", // Light text for dark mode
				buttonText: "#fffefe", // White button text in light mode
				buttonTextDark: "#47a260", // Green button text in dark mode
				border: "#ecf3e6",
			},
			textColor: {
				foreground: "var(--foreground)", // Add custom foreground class
			},
			backgroundColor: {
				light: "#fffefe", // Light background for light mode
				dark: "#101013", // Dark background for dark mode
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
