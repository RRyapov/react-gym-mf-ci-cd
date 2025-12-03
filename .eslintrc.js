module.exports = {
	root: true,
	extends: ["@rshbintech.rprul.ecp/eslint-config/fsd"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	ignorePatterns: [
		"build",
		"node_modules",
		".eslintrc.js",
		"*.config.js",
		"*.config.ts",
	],
	rules: {
		"prettier/prettier": [
			"error",
			{
				endOfLine: "auto",
			},
		],
		"@typescript-eslint/consistent-type-definitions": "off",
	},
};
