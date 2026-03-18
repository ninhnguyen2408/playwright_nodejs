// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../utils/test-data');

const lockedUser = {
  username: process.env.LOCKED_USERNAME || '',
  password: process.env.LOCKED_PASSWORD || '',
};

/**
 * Login test suite based on the requested test plan.
 */
test.describe('Login - Danh sach testcase dang nhap', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  /**
   * @param {string} username
   * @param {string} password
   */
  async function loginWith(username, password) {
    await loginPage.login(username, password);
  }

  async function loginWithValidUser() {
    await loginWith(testData.validUser.username, testData.validUser.password);
  }

  /**
   * @param {import('@playwright/test').Page} page
   */
  async function expectStayOnLogin(page) {
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  }

  test('TC-LOGIN-01 - Login thanh cong voi tai khoan hop le', async ({ page }) => {
    await loginWithValidUser();

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');
  });

  test('TC-LOGIN-02 - Login that bai khi sai username', async ({ page }) => {
    await loginWith('invalid_username_12345', testData.validUser.password);

    await page.waitForTimeout(2000);
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-03 - Login that bai khi sai password', async ({ page }) => {
    await loginWith(testData.validUser.username, 'wrong_password_67890');

    await page.waitForTimeout(2000);
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-04 - Login that bai khi sai ca username va password', async ({ page }) => {
    await loginWith(
      testData.invalidUser.username,
      testData.invalidUser.password
    );

    await page.waitForTimeout(2000);
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-05 - Khong cho login khi de trong username', async () => {
    await loginPage.passwordInput.click();
    await loginPage.fillPassword('testpassword');
    await loginPage.loginButton.click();

    await expect(loginPage.usernameError).toBeVisible();
  });

  test('TC-LOGIN-06 - Khong cho login khi de trong password', async () => {
    await loginPage.fillUsername('testuser');
    await loginPage.passwordInput.click();
    await loginPage.loginButton.click();

    await expect(loginPage.passwordError).toBeVisible();
  });

  test('TC-LOGIN-07 - Khong cho login khi de trong ca username va password', async ({ page }) => {
    await loginPage.submitEmptyForm();

    await expect(loginPage.usernameError).toBeVisible();
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-08 - Xu ly khoang trang dau cuoi username', async ({ page }) => {
    await loginWith(`  ${testData.validUser.username}  `, testData.validUser.password);

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');
  });

  test('TC-LOGIN-09 - Phan biet hoa thuong password', async ({ page }) => {
    await loginWith(
      testData.validUser.username,
      String(testData.validUser.password).toUpperCase()
    );

    await page.waitForTimeout(2000);
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-10 - Login voi tai khoan bi khoa', async ({ page }) => {
    test.skip(
      !lockedUser.username || !lockedUser.password,
      'Can cau hinh LOCKED_USERNAME va LOCKED_PASSWORD trong moi truong test.'
    );

    await loginWith(lockedUser.username, lockedUser.password);

    await page.waitForTimeout(2000);
    await expectStayOnLogin(page);
  });

  test('TC-LOGIN-11 - Login bang phim Enter', async ({ page }) => {
    await loginPage.fillUsername(testData.validUser.username);
    await loginPage.fillPassword(testData.validUser.password);
    await page.keyboard.press('Enter');

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');
  });

  test('TC-LOGIN-12 - Dieu huong sang chuc nang Quen mat khau', async ({ page }) => {
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('TC-LOGIN-13 - Giu session sau khi login thanh cong', async ({ page }) => {
    await loginWithValidUser();
    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/\/login/);
  });
});
