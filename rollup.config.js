import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
	{
		treeshake: false,
		input: 'src/tamper_load_script/index.js',
		output: {
			file: 'dist/load-9.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			commonjs(),
		],
	},
	{
		input: 'src/bili_tamper/bili.js',
		output: {
			file: 'dist/bili.js',
		},
		plugins: [
			resolve(),
		],
	},

	{
		input: 'src/all_script/all.js',
		output: {
			file: 'dist/all.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			commonjs(),
		],
	},

	{
		treeshake: false,
		input: 'src/bar/bar.js',
		output: {
			file: 'dist/bar.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			commonjs(),
		],
	},
];


