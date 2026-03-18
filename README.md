# 🧪 Playwright Automation Tests - Mobifone eContract

Bộ test automation cho website [Mobifone eContract](https://econtractdev.mobifone.ai/) sử dụng **Playwright** + **Node.js**, tổ chức theo **Page Object Model**.

## 📁 Cấu trúc project

```
econtract-playwright-tests/
├── pages/                      # Page Object classes
│   ├── BasePage.js             # Lớp cơ sở (navigate, title, screenshot)
│   ├── LoginPage.js            # Trang đăng nhập
│   ├── DashboardPage.js        # Dashboard sau login (template)
│   └── ForgotPasswordPage.js   # Trang quên mật khẩu
├── tests/                      # Test spec files
│   ├── homepage.spec.js        # Tests trang chủ (7 TC)
│   ├── login.spec.js           # Tests đăng nhập (9 TC)
│   ├── forgot-password.spec.js # Tests quên mật khẩu (4 TC)
│   └── navigation.spec.js      # Tests điều hướng (5 TC - template)
├── utils/
│   └── test-data.js            # Dữ liệu test tập trung
├── fixtures/
│   └── auth.fixture.js         # Custom fixture (authenticated state)
├── playwright.config.js        # Cấu hình Playwright
├── package.json
├── .env.example                # Template biến môi trường
├── .gitignore
└── README.md
```

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài đặt Playwright browsers

```bash
npx playwright install
```

### 3. Cấu hình biến môi trường (nếu có tài khoản test)

```bash
# Copy file mẫu
cp .env.example .env

# Sửa file .env, thay thông tin đăng nhập thực tế
```

### 4. Chạy test

```bash
# Chạy tất cả test
npx playwright test

# Chạy từng file test
npx playwright test tests/homepage.spec.js
npx playwright test tests/login.spec.js

# Chạy ở chế độ headed (có giao diện browser)
npx playwright test --headed

# Chạy ở chế độ debug
npx playwright test --debug

# Chạy với Playwright UI mode
npx playwright test --ui
```

### 5. Xem report

```bash
npx playwright show-report
```

## 📝 Danh sách Test Cases

| File | Test Case | Mô tả | Status |
|------|-----------|--------|--------|
| homepage | TC01-TC07 | Load trang, title, redirect, UI elements | ✅ Ready |
| login | TC-LOGIN-01~03 | Validation form trống | ✅ Ready |
| login | TC-LOGIN-04 | Đăng nhập sai thông tin | ✅ Ready |
| login | TC-LOGIN-05~06 | Đăng nhập thành công | ⏭️ Skip (cần credentials) |
| login | TC-LOGIN-07~09 | UX: Enter, password mask, placeholder | ✅ Ready |
| forgot-password | TC-FP-01~04 | Quên mật khẩu flow | ✅ Ready |
| navigation | TC-NAV-01~05 | Dashboard, menu, logout | ⏭️ Skip (template) |

## ⚠️ Lưu ý quan trọng

1. **Chưa có tài khoản test**: Các test đăng nhập thành công và navigation đã được `skip`. Cần cung cấp credentials trong file `.env` rồi bỏ `skip`.

2. **Locator strategy**: Sử dụng thứ tự ưu tiên:
   - `id` (ổn định nhất, ví dụ: `#username`)
   - `role` + `name` (ví dụ: `getByRole('button', { name: 'ĐĂNG NHẬP' })`)
   - `text` (ví dụ: `getByText('Quên mật khẩu?')`)
   - `placeholder` (ví dụ: `input[placeholder="Mật khẩu"]`)

3. **Angular SPA**: Website dùng Angular, nên cần chờ `networkidle` hoặc `domcontentloaded` khi navigate.

4. **Retry & Trace**: Config đã bật retry 1 lần, trace + video khi retry để dễ debug.

## 🔧 Mở rộng

Để thêm test cho module mới sau khi đăng nhập:

1. Tạo Page Object mới trong `pages/` (kế thừa `BasePage`)
2. Tạo test file mới trong `tests/`
3. Sử dụng `authenticatedPage` fixture từ `fixtures/auth.fixture.js`
