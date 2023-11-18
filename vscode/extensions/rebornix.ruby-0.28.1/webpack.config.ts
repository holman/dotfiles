import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

module.exports = {
	entry: './src/ruby.ts',
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'ruby.js',
		path: path.resolve(__dirname, 'dist', 'client'),
		libraryTarget: 'commonjs2',
		devtoolModuleFilenameTemplate: '../../[resource-path]',
	},
	node: {
		__dirname: false,
	},
	devtool: 'source-map',
	externals: {
		vscode: 'commonjs vscode',
	},
	plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
};
