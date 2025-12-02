const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier/standalone');
const prettierPHPPlugin = require('@prettier/plugin-php/standalone');
const json2php = require('json2php');
const { isString } = require('lodash');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const filterOutWooBlocks = (resourcePath) => {
	const normalizedPath = resourcePath.replace(/\\/gim, '/');
	const WOO_BLOCKS = [
		'billing-address',
		'order-note',
		'ordered-products',
		'recommended-product',
		'related-products',
		'shipping-address',
	];

	const isWoo = WOO_BLOCKS.some((currentBlock) => {
		return normalizedPath.indexOf(`blocks/${currentBlock}`) !== -1;
	});

	return !isWoo;
};
const convertJSONtoPHPArray = async (json) => {
	const content = json2php(JSON.parse(JSON.stringify(json)));

	return prettier.format(
		`<?php\n\n/** Mail builder - automatically generated file **/\n\nreturn ${content};`,
		{
			plugins: [prettierPHPPlugin],
			phpVersion: '5.6',
			singleQuote: true,
			parser: 'php',
			printWidth: 80, // make print width small to force multi-lines
		}
	);
};
let ignoreWarnings = _.get(defaultConfig, 'ignoreWarnings', []);
const extraIgnoreWarnings = [
	{
		message: /only default export is available soon/,
	},
];
ignoreWarnings = ignoreWarnings.concat(extraIgnoreWarnings);

// process.env.WP_SRC_DIRECTORY = paths.srcDir;
const getBlockName = (absPath) =>
	absPath.replace(/\\/gim, '/').match(/.*\/(.*?)\/(.*)$/i)[1];

const getBlockRelPath = (absPath) =>
	absPath.replace(/\\/gim, '/').match(/blocks\/(.*)/i)[1];
const defaultEntries = {
	'admin/edit-mail': './src/edit-mail/index.js',
	'admin/admin-pages': './src/admin-pages/index.js',
};
const entries = {};

Object.entries(defaultEntries).forEach(([key, value]) => {
	let newKey = key;

	if (isString(key)) {
		if (value.endsWith('.scss')) {
			newKey = `${key}/style`;
		} else {
			newKey = `${key}/index`;
		}
	}

	entries[newKey] = value;
});

const WEBPACK_WATCH = process.argv.indexOf('WEBPACK_WATCH') !== -1;
module.exports = {
	...defaultConfig,
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: './src/blocks/*/{block.json,*.php}',
					to: './blocks/[1]',
					filter: filterOutWooBlocks,
					transformPath(targetPath, absolutePath) {
						const blockName = getBlockName(absolutePath);
						const rel = getBlockRelPath(absolutePath);

						targetPath = targetPath.replace('[1]', rel);

						return targetPath;
					},
				},
			],
		}),
		new RemoveEmptyScriptsPlugin(),

		...defaultConfig.plugins,
		{
			apply(compiler) {
				compiler.hooks.afterEmit.tapAsync(
					'done',
					async (params, callback) => {
						console.log('Generating assets-manifest.php');
						fs.writeFileSync(
							'build/assets-manifest.php',
							await convertJSONtoPHPArray(
								Object.keys(defaultEntries)
							)
						);

						callback();
					}
				);
			},
		},
	],
	entry: entries,
	resolve: {
		alias: {
			'@kubio': path.join(__dirname, './src/kubio/'),
			'@iconvertem': path.join(__dirname, './src/'),
		},
	},
	ignoreWarnings,
	stats: WEBPACK_WATCH ? 'minimal' : undefined,
};
