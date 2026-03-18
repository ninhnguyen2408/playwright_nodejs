const { BasePage } = require('./BasePage');

/**
 * DashboardPage - Page Object cho trang chính sau khi đăng nhập
 *
 * TODO: Cập nhật các locator sau khi có quyền truy cập trang dashboard
 * Các phần tử dưới đây là template dựa trên giả định cấu trúc
 * của ứng dụng eContract (Angular + PrimeNG)
 */
class DashboardPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // === LOCATORS (TODO: Cập nhật selectors thực tế) ===

    // Sidebar / Menu điều hướng
    // TODO: Thay selector thực tế sau khi xác định DOM của dashboard
    this.sidebar = page.locator('.sidebar, nav.sidebar, .menu-sidebar');

    // Header / Thanh trên cùng
    this.header = page.locator('.header, .top-bar, .navbar');

    // Thông tin người dùng (avatar, tên)
    this.userInfo = page.locator('.user-info, .user-profile, .avatar');

    // Nút đăng xuất
    // TODO: Xác định locator chính xác cho nút logout
    this.logoutButton = page.getByText('Đăng xuất').or(
      page.getByText('Logout')
    );

    // Menu items chính (giả định dựa trên ứng dụng eContract)
    // TODO: Cập nhật danh sách menu items theo thực tế
    this.menuItems = {
      contracts: page.getByText('Hợp đồng').first(),
      templates: page.getByText('Mẫu hợp đồng').first(),
      reports: page.getByText('Báo cáo').first(),
      settings: page.getByText('Cài đặt').first(),
    };
  }

  // === ACTIONS ===

  /**
   * Kiểm tra dashboard đã load thành công
   * TODO: Cập nhật điều kiện check load phù hợp
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    try {
      // Chờ một phần tử đặc trưng của dashboard xuất hiện
      await this.sidebar.or(this.header).waitFor({ state: 'visible', timeout: 10_000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click vào menu item trong sidebar
   * @param {'contracts' | 'templates' | 'reports' | 'settings'} menuName
   */
  async clickMenu(menuName) {
    const menuItem = this.menuItems[menuName];
    if (menuItem) {
      await menuItem.click();
    } else {
      throw new Error(`Menu item "${menuName}" không tồn tại`);
    }
  }

  /**
   * Thực hiện đăng xuất
   * TODO: Xác định flow đăng xuất chính xác (có thể cần click avatar trước)
   */
  async logout() {
    // Một số ứng dụng cần click avatar/user info trước khi hiện nút logout
    try {
      await this.userInfo.click();
    } catch {
      // Nếu không có user info dropdown, bỏ qua
    }
    await this.logoutButton.click();
  }
}

module.exports = { DashboardPage };
