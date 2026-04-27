import { readFile, writeFile, mkdir, readdir, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify  } from 'terser';
import cssnano from 'cssnano';
import postcss from 'postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, 'src');
const distDir = join(__dirname, 'dist');

const distJsDir = join(distDir, 'js');
const distCssDir = join(distDir, 'css');

const postcssPlugins = [
    cssnano({ preset: 'default' })
];

async function cleanDist() {
	if (existsSync(distDir)) {
		await rm(distDir, { recursive: true, force: true });
	}
}

async function copyIndexHtml() {
	const srcPath = join(srcDir, 'index.html');
	const destPath = join(distDir, 'index.html');
	await cp(srcPath, destPath);
}

function isMinified(filename) {
	return filename.endsWith('.min.js');
}

async function processJsFiles() {
	const jsSrcDir = join(srcDir, 'js');
	await processDirectory(jsSrcDir, distJsDir, async (srcPath, destPath) => {
		const filename = basename(srcPath);
		if (isMinified(filename)) {
			await cp(srcPath, destPath);
		} else {
			const code = await readFile(srcPath, 'utf-8');
			const result = await minify (code, { compress: true, mangle: true });
			await writeFile(destPath, result.code, 'utf-8');
		}
	});
}

async function processCssFiles() {
	const cssSrcDir = join(srcDir, 'css');
	await processDirectory(cssSrcDir, distCssDir, async (srcPath, destPath) => {
		const code = await readFile(srcPath, 'utf-8');
		const result = await postcss(postcssPlugins).process(code, { from: srcPath, to: destPath });
		await writeFile(destPath, result.css, 'utf-8');
	});
}

async function walk(dir, destRoot, processor, relativePath = '') {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = join(relativePath, entry.name);
        const destPath = join(destRoot, relPath);
        if (entry.isDirectory()) {
            await mkdir(destPath, { recursive: true });
            await walk(fullPath, destRoot, processor, relPath);
        } else if (entry.isFile()) {
            await processor(fullPath, destPath);
        }
    }
}

async function processDirectory(srcRoot, destRoot, processor) {
	await mkdir(destRoot, { recursive: true });
	await walk(srcRoot, destRoot, processor);
}

async function main() {
	await cleanDist();
	await copyIndexHtml();
	await processJsFiles();
	await processCssFiles();
	console.log('Build complete');
}

main().catch(err => {
	console.error('Build failed:', err);
	process.exit(1);
});
