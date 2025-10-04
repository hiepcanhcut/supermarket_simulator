const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Tạo cửa sổ browser
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'icon.ico'),
    title: 'Supermarket Tycoon',
    show: false, // Ẩn cửa sổ cho đến khi sẵn sàng
    backgroundColor: '#1e3c72'
  });

  // Tải file index.html - SỬ DỤNG path.join để đảm bảo đúng đường dẫn
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hiển thị cửa sổ khi đã sẵn sàng
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Mở DevTools để debug (có thể gỡ bỏ khi build production)
  mainWindow.webContents.openDevTools();

  // Xử lý lỗi load trang
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
  });
}

// Khi app sẵn sàng
app.whenReady().then(() => {
  console.log('🛒 Starting Supermarket Tycoon...');
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Thoát khi tất cả cửa sổ đóng
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Xử lý lỗi toàn cục
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});