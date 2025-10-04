# 🛒 Supermarket Tycoon - Game Quản Lý Siêu Thị

![Supermarket Tycoon](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Electron](https://img.shields.io/badge/Built%20with-Electron-47848F.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)

Một game mô phỏng quản lý siêu thị đầy thú vị, nơi bạn có thể xây dựng đế chế bán lẻ của riêng mình và trở thành triệu phú!

## 🎮 Giới Thiệu

Supermarket Tycoon là game mô phỏng kinh doanh siêu thị được phát triển bằng Electron. Người chơi sẽ bắt đầu với số vốn nhỏ và dần dần phát triển thành một chuỗi siêu thị lớn thông qua việc quản lý thông minh và chiến lược kinh doanh khôn ngoan.

### ✨ Tính Năng Nổi Bật

- 🏪 **Quản lý 6 loại sản phẩm** đa dạng
- 📈 **Hệ thống kinh tế phức tạp** với lợi nhuận thực tế
- 🚀 **Nâng cấp và mở rộng** siêu thị
- 🎯 **Sự kiện ngẫu nhiên** thú vị
- 💾 **Tự động lưu game**
- 🎨 **Giao diện đẹp mắt** với hiệu ứng
- 🏆 **Hệ thống cấp độ và thành tích**

## 🚀 Cài Đặt & Chạy Game

### Yêu Cầu Hệ Thống
- **Windows 7/10/11** hoặc **macOS** hoặc **Linux**
- **Node.js 16+** (chỉ cần cho development)

### Cách 1: Chạy Trực Tiếp (Dành cho người dùng)
1. Tải file `Supermarket-Tycoon.exe` từ [releases](../../releases)
2. Click đúp để chạy - **không cần cài đặt Node.js**

### Cách 2: Chạy Từ Source Code (Dành cho developer)

```bash
# Clone repository
git clone [repository-url]
cd supermarket-tycoon

# Cài đặt dependencies
npm install

# Chạy game
npm start

# Build thành file .exe
npm run build
```

## 🎯 Hướng Dẫn Chơi

### Mục Tiêu
**Kiếm $10,000** để trở thành triệu phú siêu thị!

### Cách Chơi Cơ Bản

#### 1. 📦 Nhập Hàng
- Click **"Nhập hàng"** → chọn mặt hàng
- Mỗi lần nhập thêm **10 sản phẩm**
- Chi phí = Giá nhập × Số lượng

#### 2. 🏪 Kinh Doanh
- Click **"Kinh doanh (Qua ngày)"**
- Khách hàng tự động đến mua hàng
- Doanh thu = Số lượng bán × Giá bán

#### 3. 🚀 Nâng Cấp
Có 3 loại nâng cấp:
- **📦 Kệ hàng**: Tăng sức chứa (+5 sản phẩm/lần nhập)
- **📢 Quảng cáo**: Tăng số khách (+20% khách hàng)
- **⭐ Chất lượng**: Tăng giá bán (+15% giá)

### Chiến Thuật Chơi

#### Giai Đoạn Đầu (Ngày 1-5)
```javascript
// Ưu tiên hàng lợi nhuận cao
🥩 Thịt:     Lời $13/sản phẩm
🍎 Hoa quả:  Lời $11/sản phẩm  
🥚 Trứng:    Lời $7/sản phẩm
```

#### Giai Đoạn Giữa (Ngày 6-15)
- Nâng cấp **Quảng cáo** trước để tăng lượng khách
- Sau đó nâng cấp **Chất lượng** để tăng lợi nhuận

#### Giai Đoạn Cuối (Ngày 16+)
- Nâng cấp tối đa tất cả tính năng
- Tập trung vào Thịt và Hoa quả

### Các Chỉ Số Quan Trọng

| Chỉ Số | Ý Nghĩa | Mục Tiêu |
|--------|---------|----------|
| 💰 Tiền | Số dư tài khoản | $10,000 |
| 😊 Danh tiếng | Số khách hàng tiềm năng | > 50 |
| 🏪 Cấp độ | Quy mô siêu thị | Càng cao càng tốt |
| 📦 Tồn kho | Lượng hàng trong kho | Không để hết hàng |

## 🗂️ Cấu Trúc Dự Án

```
supermarket-tycoon/
├── 📄 package.json          # Cấu hình dự án
├── ⚡ main.js               # Electron main process
├── 🎨 index.html           # Giao diện chính
├── 🧠 renderer.js          # Logic game
├── 📁 dist/                # Thư mục build
│   └── 🎯 Supermarket-Tycoon.exe
└── 📖 README.md            # Tài liệu này
```

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Desktop App**: Electron
- **Build Tool**: electron-builder
- **Icons**: Emoji & Custom CSS

## 🐛 Xử Lý Sự Cố

### Lỗi Thường Gặp

**Game không chạy:**
```bash
# Xóa cache và cài đặt lại
npm cache clean --force
rmdir /s node_modules
npm install
```

**Màn hình trắng:**
- Nhấn **F12** để mở Developer Tools
- Kiểm tra lỗi trong tab **Console**

**Lỗi build:**
```bash
# Build phiên bản portable
npm run build
```

### Hỗ Trợ
Nếu gặp vấn đề, vui lòng:
1. Kiểm tra phiên bản Node.js: `node --version`
2. Mở issue trên repository
3. Cung cấp thông tin lỗi từ Console (F12)

## 🔄 Phiên Bản

- **v1.0.0** (Hiện tại)
  - Gameplay cơ bản hoàn chỉnh
  - 6 loại sản phẩm
  - Hệ thống nâng cấp
  - Tự động lưu game

## 👥 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy:
1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push đến branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 Giấy Phép

Phân phối theo giấy phép MIT. Xem `LICENSE` để biết thêm chi tiết.

## 🙏 Ghi Nhận

Cảm ơn đã chơi Supermarket Tycoon! Nếu bạn thích game này, hãy:
- ⭐ Star repository này
- 🔄 Chia sẻ với bạn bè
- 🐛 Báo cáo lỗi nếu có

---

**🎮 Chúc bạn sớm trở thành triệu phú siêu thị!**

> *"Trong kinh doanh, bạn không được trả tiền vì những gì bạn biết. Bạn được trả tiền cho những gì bạn làm với những gì bạn biết."* - Zig Ziglar
