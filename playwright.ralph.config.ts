import { defineConfig, devices } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

export default defineConfig({
  testDir: './e2e/ralph',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    locale: 'pt-BR',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'yarn dev --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_BASE_URL: 'http://127.0.0.1:3000',
    },
  },
  projects: VIEWPORTS.map((vp) => ({
    name: vp.name,
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: vp.width, height: vp.height },
    },
  })),
});
