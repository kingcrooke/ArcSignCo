import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  use: {
    baseURL: 'http://127.0.0.1:4318/dynasty-1581d86a/',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4318/dynasty-1581d86a/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
