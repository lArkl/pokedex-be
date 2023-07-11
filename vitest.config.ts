/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
