export default {
	mount: {
		public: { url: "/", static: true },
		src: "/dist",
	},
	alias: {
		"@": "./src"
	},
	plugins: [
		"@snowpack/plugin-react-refresh"
	]
};