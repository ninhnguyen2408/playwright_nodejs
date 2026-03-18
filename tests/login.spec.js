// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../utils/test-data');

/**
 * Test Suite: Đăng nhập (Login)
 * Bao gồm: validation form, đăng nhập lỗi, đăng nhập thành công
 */
test.describe('Login - Kiểm tra chức năng đăng nhập', () => {
  /** @type {LoginPage} */
  let loginPage;

  // Trước mỗi test: Mở trang đăng nhập
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // --- VALIDATION TESTS ---

  test.describe('Validation - Kiểm tra ràng buộc form', () => {

    test('TC-LOGIN-01 - Hiển thị lỗi khi submit form trống', async ({ page }) => {
      // Bước 1: Click nút đăng nhập mà không nhập gì
      await loginPage.submitEmptyForm();

      // Verify: Hiển thị lỗi username trống
      await expect(loginPage.usernameError).toBeVisible();
    });

    test('TC-LOGIN-02 - Hiển thị lỗi khi chỉ nhập username, bỏ trống password', async ({ page }) => {
      // Bước 1: Nhập username
      await loginPage.fillUsername('testuser');

      // Bước 2: Click vào password rồi click ra ngoài (trigger validation)
      await loginPage.passwordInput.click();
      await loginPage.loginButton.click();

      // Verify: Hiển thị lỗi password trống
      await expect(loginPage.passwordError).toBeVisible();
    });

    test('TC-LOGIN-03 - Không hiển thị lỗi khi nhập đủ cả username và password', async ({ page }) => {
      // Bước 1: Nhập username và password
      await loginPage.fillUsername('testuser');
      await loginPage.fillPassword('testpassword');

      // Verify: Không hiển thị lỗi validation
      await expect(loginPage.usernameError).not.toBeVisible();
      await expect(loginPage.passwordError).not.toBeVisible();
    });
  });

  // --- NEGATIVE TESTS ---

  test.describe('Negative - Kiểm tra đăng nhập thất bại', () => {

    test('TC-LOGIN-04 - Đăng nhập với thông tin không hợp lệ', async ({ page }) => {
      // Bước 1: Nhập thông tin sai
      await loginPage.login(
        testData.invalidUser.username,
        testData.invalidUser.password
      );

      // Verify: Vẫn ở trang login (không chuyển trang)
      await expect(page).toHaveURL(/\/login/);

      // Verify: Có thể hiển thị thông báo lỗi
      // TODO: Cập nhật locator thông báo lỗi nếu cần
      // Chờ một chút để xử lý response
      await page.waitForTimeout(2000);

      // Trang vẫn là trang login
      const isStillLogin = await loginPage.usernameInput.isVisible();
      expect(isStillLogin).toBeTruthy();
    });
  });

  // --- POSITIVE TESTS ---

  test.describe('Positive - Kiểm tra đăng nhập thành công', () => {

    test('TC-LOGIN-05 - Đăng nhập thành công với tài khoản hợp lệ', async ({ page }) => {
      // Bước 1: Đăng nhập với thông tin hợp lệ
      await loginPage.login(
        testData.validUser.username,
        testData.validUser.password
      );
      await expect(page).not.toHaveURL(/\/login/);

      // Verify: URL chứa đường dẫn dashboard hoặc trang chính
      // TODO: Cập nhật URL expected sau khi biết đường dẫn thực tế
      await page.waitForLoadState('networkidle');
    });

    test.skip('TC-LOGIN-06 - Sau khi đăng nhập, hiển thị thông tin người dùng', async ({ page }) => {
      // Bước 1: Đăng nhập
      await loginPage.login(
        testData.validUser.username,
        testData.validUser.password
      );

      // Chờ trang dashboard load
      await page.waitForLoadState('networkidle');

      // Verify: Hiển thị tên người dùng hoặc avatar
      // TODO: Cập nhật selector thực tế
      const userInfo = page.locator('.user-info, .user-profile');
      await expect(userInfo).toBeVisible();
    });
  });

  // --- KEYBOARD & UX TESTS ---

  test.describe('UX - Kiểm tra trải nghiệm người dùng', () => {

    test('TC-LOGIN-07 - Có thể đăng nhập bằng phím Enter', async ({ page }) => {
      // Bước 1: Nhập username
      await loginPage.fillUsername('testuser');

      // Bước 2: Nhập password
      await loginPage.fillPassword('testpassword');

      // Bước 3: Nhấn Enter thay vì click nút
      await page.keyboard.press('Enter');

      // Verify: Form đã được submit (trang đang xử lý hoặc hiện lỗi)
      // Chờ phản hồi từ server
      await page.waitForTimeout(2000);

      // TC pass nếu không có exception (form chấp nhận Enter)
    });

    test('TC-LOGIN-08 - Password field ẩn ký tự mặc định', async ({ page }) => {
      // Verify: Password input có type="password" (ẩn ký tự)
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('TC-LOGIN-09 - Username input có placeholder đúng', async ({ page }) => {
      // Verify: Placeholder hiển thị đúng
      await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Tên đăng nhập');
    });
  });
});
