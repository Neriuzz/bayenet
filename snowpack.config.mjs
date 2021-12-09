export default {
	mount: {
		public: { url: "/", static: true },
		src: "/dist",
	},
	alias: {
		"@": "./src",
		"@styles": "./src/styles",
		"@components": "./src/components"
	},
	plugins: [
		"@snowpack/plugin-react-refresh",
		"@snowpack/plugin-sass"
	]
};