import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		treeshake: false,
		input: 'src/tamper_load_script/index.js',
		output: {
			file: 'dist/load-4.js',
			format: 'esm', // or 'cjs' based on your needs
		},
		plugins: [
			resolve(), // Resolves third-party modules
			commonjs(), // Converts CommonJS modules to ES6
		],
	},
	{
		input: 'src/bili_tamper/bili.js',
		output: {
			file: 'dist/bili.js',
		},
		plugins: [
			resolve(), // Resolves third-party modules
		],
	},

	{
		input: 'src/all_script/all.js',
		output: {
			file: 'dist/all.js',
			format: 'esm', // or 'cjs' based on your needs
		},
		plugins: [
			resolve(), // Resolves third-party modules
			commonjs(), // Converts CommonJS modules to ES6
		],
	},
];


