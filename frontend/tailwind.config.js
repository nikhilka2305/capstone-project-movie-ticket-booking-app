/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			aspectRatio: {
				"3/4": "3 / 4",
			},
		},
	},
	plugins: [],
	darkMode: "selector",
});
