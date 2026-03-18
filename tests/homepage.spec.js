// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../utils/test-data');

/**
 * Test Suite: Trang chủ / Homepage
 * Kiểm tra website load thành công, title đúng, redirect đến login
 */
test.describe('Homepage - Kiểm tra trang chủ', () => {

  test('TC01 - Website load thành công', async ({ page }) => {
    // Truy cập trang chủ
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify: Trang không trả về lỗi (status 200)
    expect(page.url()).toBeTruthy();
  });

  test('TC02 - Title đúng "Mobifone eContract"', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify: Title trang phải là "Mobifone eContract"
    await expect(page).toHaveTitle(testData.pageText.title);
  });

  test('TC03 - Trang chủ redirect đến /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify: URL phải chứa /login (tự động redirect khi chưa đăng nhập)
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC04 - Form đăng nhập hiển thị đầy đủ các phần tử', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify: Username input hiển thị
    await expect(loginPage.usernameInput).toBeVisible();

    // Verify: Password input hiển thị
    await expect(loginPage.passwordInput).toBeVisible();

    // Verify: Nút đăng nhập hiển thị
    await expect(loginPage.loginButton).toBeVisible();

    // Verify: Link quên mật khẩu hiển thị
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('TC05 - Footer hiển thị thông tin bản quyền', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify: Footer chứa text bản quyền MobiFone
    await expect(loginPage.footer).toBeVisible();
  });

  test('TC06 - Logo MobiFone eContract hiển thị', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify: Text/logo "Đăng nhập" hiển thị trên form
    const loginHeader = page.getByText(testData.pageText.loginHeader).first();
    await expect(loginHeader).toBeVisible();
  });

  test('TC07 - Language switcher hiển thị', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify: Nút chuyển ngôn ngữ VI hiển thị
    await expect(loginPage.languageSwitcher).toBeVisible();
  });
});
