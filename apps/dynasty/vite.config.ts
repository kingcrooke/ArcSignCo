/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import deployConfig from './deploy.config.json' with { type: 'json' }

const base = `/${deployConfig.deploySlug}/`

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  server: {
    port: 4318,
    host: '127.0.0.1',
  },
  preview: {
    port: 4318,
    host: '127.0.0.1',
  },
})
