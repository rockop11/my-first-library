import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, ('src/index.ts')),
            name: 'my-first-library'
        }
    },
    resolve: {
        alias: {
            '@src': resolve(__dirname, '/src')
        }
    },
    plugins: [
        dts({ outDir: 'dist' }),
        viteConfigPaths({

        })
    ]
})