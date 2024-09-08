/// <reference types="vitest" />
import { defineConfig } from 'vite'
import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
