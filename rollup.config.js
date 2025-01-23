import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import url from "@rollup/plugin-url";
import { defineConfig } from "rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
	input: "src/index.jsx",
	output: [
		{
			dir: "dist",
			format: "es",
			name: "piller9_npm_user",
			sourcemap: true,
		},
	],
	plugins: [
		peerDepsExternal(),
		resolve({
			extensions: [".js", ".jsx"],
		}),
		commonjs(),
		babel({
			exclude: "node_modules/**",
			presets: ["@babel/preset-env", "@babel/preset-react"],
			babelHelpers: "bundled",
		}),
		alias({
			entries: [
				{
					find: /\.svg\?react$/,
					replacement: (id) => id.replace("?react", ""),
				},
			],
		}),
		url({
			include: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg", "", "**/*.webp"],
			limit: 8192,
			emitFiles: true,
		}),
		json(),
		terser(),
		postcss(),
	],
	external: [
		"react",
		"react-dom",
		"react-router-dom",
		"react-toastify",
		"localstorage-slim",
		"axios",
		"react-redux",
		"react-toastify",
	],
});
