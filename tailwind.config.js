/** @type {import('tailwindcss').Config} */

module.exports = {
	// content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/container-queries"),
	],
	corePlugins: {
    preflight: false,
  },
	important: true,
};
