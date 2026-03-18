const { BasePage } = require('./BasePage');

/**
 * LoginPage - Page Object cho trang đăng nhập eContract
 * URL: /login
 *
 * Các phần tử chính:
 * - Input username (id='username')
 * - Input password (placeholder='Mật khẩu')
 * - Nút đăng nhập (text='ĐĂNG NHẬP')
 * - Link quên mật khẩu
 * - Thông báo lỗi validation
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // === LOCATORS ===

    // Input fields
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('input[placeholder="Mật khẩu"]');

    // Nút toggle hiện/ẩn mật khẩu (icon con mắt)
    this.passwordToggle = page.locator('input[placeholder="Mật khẩu"] + *');

    // Nút đăng nhập
    this.loginButton = page.getByRole('button', { name: 'ĐĂNG NHẬP' });

    // Link quên mật khẩu
    this.forgotPasswordLink = page.locator('a[href="/forgot-password"]');

    // Thông báo lỗi validation
    this.usernameError = page.getByText('Tên đăng nhập không được để trống');
    this.passwordError = page.getByText('Mật khẩu không được để trống');

    // Thông báo lỗi đăng nhập (sai thông tin) - TODO: Cập nhật text chính xác
    this.loginError = page.locator('.error-message, .alert-danger, .toast-message');

    // Logo và branding
    this.logo = page.locator('img[alt*="mobiFone"], img[alt*="eContract"]').first();

    // Footer
    this.footer = page.getByText('Bản quyền thuộc về Tổng công ty viễn thông MobiFone');

    // Language switcher
    this.languageSwitcher = page.getByText('VI').first();
  }

  // === ACTIONS ===

  /**
   * Truy cập trang đăng nhập
   */
  async goto() {
    await this.navigate('/login');
    // Chờ form đăng nhập xuất hiện
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Thực hiện đăng nhập với username và password
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Nhập username
   * @param {string} username
   */
  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  /**
   * Nhập password
   * @param {string} password
   */
  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click nút đăng nhập
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Click link quên mật khẩu
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Kiểm tra trang đăng nhập đã load thành công
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    await this.usernameInput.waitFor({ state: 'visible' });
    return await this.usernameInput.isVisible() && await this.loginButton.isVisible();
  }

  /**
   * Lấy nội dung thông báo lỗi username
   * @returns {Promise<boolean>}
   */
  async isUsernameErrorVisible() {
    return await this.usernameError.isVisible();
  }

  /**
   * Lấy nội dung thông báo lỗi password
   * @returns {Promise<boolean>}
   */
  async isPasswordErrorVisible() {
    return await this.passwordError.isVisible();
  }

  /**
   * Click nút đăng nhập mà không nhập gì (test validation)
   */
  async submitEmptyForm() {
    // Click vào username rồi bỏ trống để trigger validation
    await this.usernameInput.click();
    await this.passwordInput.click();
    await this.usernameInput.click();
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
