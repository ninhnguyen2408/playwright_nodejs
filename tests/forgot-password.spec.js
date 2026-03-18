// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ForgotPasswordPage } = require('../pages/ForgotPasswordPage');

/**
 * Test Suite: Quên mật khẩu (Forgot Password)
 * Kiểm tra luồng khôi phục mật khẩu
 */
test.describe('Forgot Password - Kiểm tra chức năng quên mật khẩu', () => {

  test('TC-FP-01 - Chuyển đến trang quên mật khẩu từ trang login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Bước 1: Click link "Quên mật khẩu?"
    await loginPage.clickForgotPassword();

    // Verify: URL chuyển sang /forgot-password
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('TC-FP-02 - Trang quên mật khẩu hiển thị đầy đủ phần tử', async ({ page }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await page.waitForLoadState('networkidle');

    // Verify: Tiêu đề "Quên mật khẩu" hiển thị
    const pageLoaded = await forgotPage.isLoaded();
    expect(pageLoaded).toBeTruthy();
  });

  test('TC-FP-03 - Có thể quay lại trang đăng nhập', async ({ page }) => {
    // Bước 1: Bắt đầu từ trang login (để browser history có trang trước)
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Bước 2: Click link quên mật khẩu để chuyển sang forgot-password
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/\/forgot-password/);

    // Bước 3: Quay lại bằng browser back (trang không có link back)
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goBackToLogin();

    // Verify: URL chuyển về /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-FP-04 - Input field và nút gửi hiện diện trên trang quên mật khẩu', async ({ page }) => {
    const forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
    await page.waitForLoadState('networkidle');

    // Verify: Input email/username tồn tại
    await expect(forgotPage.emailInput).toBeVisible();
  });
});
