import { bold, gray } from 'kolorist'
import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig ((options) => {
  const buildBanner = `\n 🌈  ${bold(`${pkg.name}`)} ${gray(`v${pkg.version}`)} \n`

  return {
    entry: ['src/index.ts'],
    format: options.watch ? 'esm' : ['cjs', 'esm', 'iife'],
    target: 'node14',
    tsconfig: './tsconfig.json',
    external: ['shikiji'],
    dts: true,
    publicDir: './src/types',
    minify: true,
    onSuccess: async () => {
      // eslint-disable-next-line no-console
      console.log(buildBanner)
      return Promise.resolve()
    },
  }
})
