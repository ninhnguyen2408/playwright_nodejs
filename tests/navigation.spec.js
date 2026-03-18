// @ts-check
const { expect } = require('@playwright/test');
const { test } = require('../fixtures/auth.fixture');
const { DashboardPage } = require('../pages/DashboardPage');
const testData = require('../utils/test-data');

/**
 * Test Suite: Điều hướng sau đăng nhập (Navigation)
 *
 * ⚠️  TOÀN BỘ SUITE NÀY ĐƯỢC SKIP cho đến khi:
 * 1. Có thông tin đăng nhập thực tế trong file .env
 * 2. Cập nhật các selector trong DashboardPage.js
 *
 * TODO: Bỏ test.describe.skip → test.describe khi đã sẵn sàng
 */
test.describe.skip('Navigation - Điều hướng sau đăng nhập', () => {

  test('TC-NAV-01 - Chuyển đến dashboard sau khi đăng nhập', async ({ authenticatedPage }) => {
    // Verify: URL không còn là /login
    await expect(authenticatedPage).not.toHaveURL(/\/login/);
  });

  test('TC-NAV-02 - Dashboard hiển thị sidebar/menu', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    // Verify: Dashboard đã load thành công
    const isLoaded = await dashboard.isLoaded();
    expect(isLoaded).toBeTruthy();
  });

  test('TC-NAV-03 - Có thể điều hướng đến module Hợp đồng', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    // Bước 1: Click menu "Hợp đồng"
    // TODO: Cập nhật tên menu thực tế
    await dashboard.clickMenu('contracts');

    // Verify: URL thay đổi tương ứng
    // TODO: Cập nhật URL expected
    await authenticatedPage.waitForLoadState('networkidle');
  });

  test('TC-NAV-04 - Đăng xuất thành công', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    // Bước 1: Thực hiện đăng xuất
    await dashboard.logout();

    // Verify: Chuyển về trang login
    await expect(authenticatedPage).toHaveURL(/\/login/);
  });

  test('TC-NAV-05 - Sau đăng xuất, không thể truy cập dashboard', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    // Bước 1: Đăng xuất
    await dashboard.logout();
    await expect(authenticatedPage).toHaveURL(/\/login/);

    // Bước 2: Thử truy cập lại dashboard
    // TODO: Cập nhật URL dashboard thực tế
    await authenticatedPage.goto(testData.urls.dashboard);

    // Verify: Bị redirect về login
    await expect(authenticatedPage).toHaveURL(/\/login/);
  });
});
