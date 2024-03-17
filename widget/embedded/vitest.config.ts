/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['./src/setup-vitest.ts'],
  },
});