const { BasePage } = require('./BasePage');

/**
 * ForgotPasswordPage - Page Object cho trang quên mật khẩu
 * URL: /forgot-password
 */
class ForgotPasswordPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // === LOCATORS ===

    // Tiêu đề trang quên mật khẩu
    this.pageTitle = page.getByText('Quên mật khẩu').first();

    // Input nhập username để khôi phục (dùng cùng id='username' như trang login)
    this.emailInput = page.locator('#username');

    // Nút gửi yêu cầu (text viết hoa: 'GỬI YÊU CẦU')
    this.submitButton = page.getByRole('button', { name: 'GỬI YÊU CẦU' });

    // Lưu ý: Trang forgot-password hiện KHÔNG có link quay lại login
    // Sẽ dùng browser back navigation thay thế

    // Subtitle hướng dẫn
    this.subtitle = page.getByText('Vui lòng nhập email đã đăng ký tài khoản');

    // Thông báo thành công
    this.successMessage = page.locator('.success-message, .alert-success');
  }

  // === ACTIONS ===

  /**
   * Truy cập trang quên mật khẩu
   */
  async goto() {
    await this.navigate('/forgot-password');
  }

  /**
   * Nhập email để khôi phục mật khẩu
   * @param {string} email
   */
  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  /**
   * Gửi yêu cầu khôi phục mật khẩu
   * @param {string} email
   */
  async submitForgotPassword(email) {
    await this.fillEmail(email);
    await this.submitButton.click();
  }

  /**
   * Click quay lại trang đăng nhập
   */
  async goBackToLogin() {
    // Không có link back trên trang, dùng browser navigation
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Kiểm tra trang quên mật khẩu đã load
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    try {
      await this.pageTitle.waitFor({ state: 'visible', timeout: 5_000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { ForgotPasswordPage };
