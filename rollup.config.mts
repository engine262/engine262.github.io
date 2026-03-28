import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3'
import { extname, join, relative } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { mkdir, readdir, readFile, rm, writeFile, access } from 'fs/promises'
import { LOCALES } from './src/devtools/generated/locales.js'

const libRoot = fileURLToPath(new URL('./node_modules/chrome-devtools-frontend', import.meta.url))
const exists = async (path: string) => {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

// workers to bundle:
// entrypoints/wasmparser_worker/wasmparser_worker-entrypoint.js
// entrypoints/formatter_worker/formatter_worker-entrypoint.js
// entrypoints/lighthouse_worker/lighthouse_worker.js
// entrypoints/heap_snapshot_worker/heap_snapshot_worker-entrypoint.js

export default defineConfig({
    onLog(level, log, handler) {
        if (log.code === 'CIRCULAR_DEPENDENCY' || log.code === 'THIS_IS_UNDEFINED') {
            return
        }
        console.log(`[${level}] ${log.code}: ${log.message}`)
        handler(level, log)
    },
    external: ['https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm', /engine262.mjs/],
    input: {
        index: './src/devtools/index.mts',
        formatter_worker: join(libRoot, 'front_end/entrypoints/formatter_worker/formatter_worker-entrypoint.ts'),
    },
    output: {
        dir: './lib/devtools/',
        format: 'esm',
        entryFileNames(chunkInfo) {
            if (chunkInfo.name === 'index') return 'index.js'
            if (chunkInfo.name === 'formatter_worker') return 'formatter_worker.js'
            throw new Error(`Unexpected chunk name ${chunkInfo.name}`)
        },
    },
    plugins: [
        {
            name: 'clear output dir',
            async buildStart() {
                await rm('./lib/devtools', { recursive: true }).catch(() => null)
            }
        },
        {
            name: 'prepare i18n locales',
            async buildStart() {
                if (!(await exists(join(libRoot, '/front_end/core/i18n/locales')))) {
                    await mkdir(join(libRoot, '/front_end/core/i18n/locales'), { recursive: true })
                }
                for (const locale of LOCALES) {
                    const localePath = join(libRoot, `/front_end/core/i18n/locales/${locale}.json`)
                    if (!(await exists(localePath)) || (await readFile(localePath, 'utf-8')).length < 100) {
                        // find matching revision at https://github.com/chromium/chromium/commits
                        const url = `https://chrome-devtools-frontend.appspot.com/serve_rev/@2a603a3da846fbf3977ae997477009b8d3491962/core/i18n/locales/${locale}.json`
                        console.log(`Fetching locale data for ${locale} from ${url}`)
                        const res = await fetch(url)
                        const text = await res.text()
                        if (text.length < 100) {
                            throw new Error(`Locale data ${locale} is not valid (likely gateway error)`)
                        }
                        await writeFile(join(libRoot, `/front_end/core/i18n/locales/${locale}.json`), text)
                    }
                }
            }
        },
        {
            name: 'special resolver and generated sources',
            async load(id) {
                if (id === join(libRoot, 'front_end/core/platform/node/node.ts')) {
                    return 'throw new Error("Unsupported platform")'
                }
                if (id === '\0virtual:front_end/panels/timeline/EasterEgg.js') {
                    return 'export const SHOULD_SHOW_EASTER_EGG = true;'
                }
                if (id === `\0virtual:front_end/Images/Images.js`) {
                    const promises = []
                    const text: string[] = []
                    for (const image of await readdir(join(libRoot, 'front_end/Images/src'))) {
                        const imagePath = join(libRoot, `front_end/Images/src/${image}`)
                        promises.push(
                            readFile(imagePath).then((data) => {
                                const base64 = `data:image/svg+xml;base64,${data.toString('base64')}`
                                const styleName = image.replace('src/', '').replace(extname(image), '')
                                text.push(`  --image-file-${styleName}: url(${JSON.stringify(base64)});`)
                            }),
                        )
                    }
                    await Promise.all(promises)
                    return [
                        'const style = new CSSStyleSheet();',
                        `style.replaceSync(\`:root {\n${text.sort().join('\n')}\n}\`);`,
                        'document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];',
                    ].join(`\n`)
                }
                if (id.endsWith('.css')) {
                    return [`export default ${JSON.stringify(await readFile(id, 'utf-8'))}`].join('\n')
                }
            },
            async resolveId(imported, importer) {
                if (imported.startsWith('.') && importer && importer.startsWith(libRoot)) {
                    let resolved = fileURLToPath(new URL(imported, pathToFileURL(importer)))
                    const relativePath = relative(libRoot, resolved)
                    if (await exists(resolved)) return resolved

                    if (resolved.endsWith('.css.js')) {
                        resolved = resolved.replace(/\.css\.js$/, '.css')
                        if (await exists(resolved)) return resolved
                    }

                    if (resolved.endsWith('.js')) {
                        resolved = resolved.slice(0, -3) + '.ts'
                        if (await exists(resolved)) return resolved
                    }

                    if (relativePath === 'front_end/core/i18n/locales.js') {
                        return fileURLToPath(new URL('./src/devtools/generated/locales.js', import.meta.url))
                    }

                    if (
                        relativePath === 'front_end/Images/Images.js' ||
                        relativePath === 'front_end/panels/timeline/EasterEgg.js'
                    ) {
                        return `\0virtual:${relativePath}`
                    }
                    console.warn(`Cannot resolve ${relativePath}`)
                }
            },
        },
        nodeResolve(),
        (commonjs.default || commonjs)(),
        swc(
            defineRollupSwcOption({
                extensions: ['.mts', '.ts'],
                include: ['src/**/*.mts', 'node_modules/chrome-devtools-frontend/**/*.ts'],
                exclude: [],
                tsconfig: false,
                jsc: { parser: { syntax: 'typescript' }, target: 'esnext' },
                minify: true,
            }),
        ),
        {
            name: 'copy-assets',
            async generateBundle() {
                const promises = []
                for (const locale of LOCALES) {
                    promises.push(
                        readFile(join(libRoot, `/front_end/core/i18n/locales/${locale}.json`)).then((source) =>
                            this.emitFile({
                                type: 'asset',
                                fileName: `locales/${locale}.json`,
                                name: `locales/${locale}.json`,
                                source,
                            }),
                        ),
                    )
                }
                await Promise.all(promises)
            },
        },
        {
            name: 'fix path',
            generateBundle() {
                this.emitFile({
                    type: 'asset',
                    fileName: `lib/engine262.mjs`,
                    name: `lib/engine262.mjs`,
                    source: 'export * from "/lib/engine262.mjs";',
                })
            },
        },
    ],
})
