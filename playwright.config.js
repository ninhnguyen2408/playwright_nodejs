// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Playwright Configuration for Mobifone eContract Tests
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Thư mục chứa test files
  testDir: './tests',

  // Timeout cho mỗi test case (30 giây)
  timeout: 30_000,

  // Timeout cho mỗi expect assertion (10 giây)
  expect: {
    timeout: 10_000,
  },

  // Chạy test tuần tự trong mỗi file, song song giữa các file
  fullyParallel: true,

  // Fail build nếu có test.only trong CI
  forbidOnly: !!process.env.CI,

  // Số lần retry khi test fail
  retries: process.env.CI ? 2 : 1,

  // Số worker chạy song song
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report + console output
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Cấu hình chung cho tất cả test
  use: {
    // Base URL cho navigation
    baseURL: process.env.BASE_URL || 'https://econtractdev.mobifone.ai',

    // Chụp screenshot khi test fail
    screenshot: 'only-on-failure',

    // Ghi trace khi test fail (dùng để debug)
    trace: 'on-first-retry',

    // Video recording khi fail
    video: 'on-first-retry',

    // Viewport mặc định
    viewport: { width: 1280, height: 720 },

    // Bỏ qua HTTPS errors (môi trường dev)
    ignoreHTTPSErrors: true,

    // Action timeout (click, fill, etc.)
    actionTimeout: 10_000,

    // Navigation timeout
    navigationTimeout: 30_000,
  },

  // Cấu hình browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment để test trên nhiều browser
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Thư mục lưu kết quả test (screenshots, videos, traces)
  outputDir: 'test-results/',
});
