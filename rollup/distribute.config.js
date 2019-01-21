const path = require('path')

const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

module.exports = {
	input: 'src/index.js',
	output: {
		file: 'index.js',
		dir: 'dist',
		format: 'cjs',
		exports: 'named',
	},
	// external: Object.keys(require('../package.json').dependencies || {}),
	plugins: [
		resolve(),
		commonjs(),
		babel({
			exclude: 'node_modules/**'
		}),
		builtins(),
		globals(),
	]
}
