const { test: base } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const testData = require('../utils/test-data');

/**
 * Custom test fixture mở rộng từ Playwright test
 * Cung cấp page objects sẵn sàng sử dụng trong test
 */
const test = base.extend({
  // Fixture: LoginPage đã sẵn sàng
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture: DashboardPage đã sẵn sàng
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  // Fixture: Trang đã đăng nhập (authenticated state)
  // TODO: Kích hoạt khi có thông tin đăng nhập thực tế
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Đăng nhập với thông tin từ env
    await loginPage.login(
      testData.validUser.username,
      testData.validUser.password
    );

    // Chờ chuyển hướng sau đăng nhập
    await page.waitForURL('**/!(login)**', { timeout: 15_000 });

    await use(page);
  },
});

module.exports = { test };
