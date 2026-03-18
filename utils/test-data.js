/**
 * Test Data - Quản lý dữ liệu test tập trung
 * Đọc thông tin từ biến môi trường, không hard-code dữ liệu nhạy cảm
 */
require('dotenv').config();

const testData = {
  // URL cơ sở
  baseUrl: process.env.BASE_URL || 'https://econtractdev.mobifone.ai',

  // Thông tin đăng nhập hợp lệ
  // TODO: Thiết lập biến môi trường thực tế trong file .env
  validUser: {
    username: process.env.TEST_USERNAME || 'TODO_REPLACE_USERNAME',
    password: process.env.TEST_PASSWORD || 'TODO_REPLACE_PASSWORD',
  },

  // Thông tin đăng nhập không hợp lệ (dùng cho negative test)
  invalidUser: {
    username: 'invalid_user_12345',
    password: 'wrong_password_67890',
  },

  // Dữ liệu rỗng
  emptyUser: {
    username: '',
    password: '',
  },

  // Thông báo lỗi validation (tiếng Việt)
  errorMessages: {
    emptyUsername: 'Tên đăng nhập không được để trống',
    emptyPassword: 'Mật khẩu không được để trống',
    // TODO: Thêm thông báo lỗi khi đăng nhập sai
    invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không đúng',
  },

  // Page titles & text
  pageText: {
    title: 'Mobifone eContract',
    loginHeader: 'Đăng nhập',
    loginSubHeader: 'Nhập thông tin tài khoản để đăng nhập',
    loginButton: 'ĐĂNG NHẬP',
    forgotPassword: 'Quên mật khẩu?',
    copyright: 'Bản quyền thuộc về Tổng công ty viễn thông MobiFone',
  },

  // URLs
  urls: {
    login: '/login',
    forgotPassword: '/forgot-password',
    // TODO: Cập nhật URL dashboard sau khi đăng nhập thành công
    dashboard: '/dashboard',
  },
};

module.exports = testData;
