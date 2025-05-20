const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [...defaultConfig.module.rules],
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin({
			patterns: [
				{ from: "./src/tailwind.config.js" },
				{ from: "./src/tailwind-input.css" },
			],
		}),
	],
};
