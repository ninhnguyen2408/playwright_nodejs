/**
 * BasePage - Lớp cơ sở cho tất cả Page Objects
 * Chứa các phương thức dùng chung giữa các trang
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Điều hướng đến một URL path
   * @param {string} path - Đường dẫn tương đối (ví dụ: '/login')
   */
  async navigate(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Lấy title của trang hiện tại
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Lấy URL hiện tại của trang
   * @returns {string}
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Chờ trang load xong (Angular app)
   * Đợi cho đến khi network idle hoặc DOM content loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Chụp screenshot với tên tùy chỉnh
   * @param {string} name - Tên file screenshot
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}

module.exports = { BasePage };
