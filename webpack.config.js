const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SCSS_LOADER = path.resolve('./scss-loader.js');

module.exports = {
	entry: ['babel-polyfill', './src/js/main.js'],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
							plugins: () => [autoprefixer()],
						},
					},
					SCSS_LOADER,
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
	],
};
