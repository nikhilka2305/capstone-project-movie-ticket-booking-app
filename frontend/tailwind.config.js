/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
import daisyui from "daisyui";

module.exports = withMT({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			aspectRatio: {
				"3/4": "3 / 4",
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: ["light", "dark", "cupcake"],
	},
	darkMode: "selector",
});
