// Game state
const gameState = {
    money: 1000,
    day: 1,
    reputation: 10,
    level: 1,
    customers: 0,
    totalSales: 0,
    inventory: {
        milk: { name: "Sữa", emoji: "🥛", price: 5, cost: 2, stock: 10, demand: 0.8 },
        bread: { name: "Bánh mì", emoji: "🍞", price: 8, cost: 3, stock: 8, demand: 0.7 },
        eggs: { name: "Trứng", emoji: "🥚", price: 12, cost: 5, stock: 6, demand: 0.6 },
        meat: { name: "Thịt", emoji: "🥩", price: 25, cost: 12, stock: 4, demand: 0.5 },
        vegetables: { name: "Rau", emoji: "🥦", price: 15, cost: 7, stock: 5, demand: 0.6 },
        fruits: { name: "Hoa quả", emoji: "🍎", price: 20, cost: 9, stock: 5, demand: 0.5 }
    },
    upgrades: {
        shelf: { 
            level: 1, 
            cost: 200, 
            effect: "+5 sức chứa mỗi lần nhập hàng",
            description: "📦 Kệ hàng mở rộng",
            maxLevel: 5
        },
        advertising: { 
            level: 1, 
            cost: 300, 
            effect: "+20% số khách hàng mỗi ngày",
            description: "📢 Chiến dịch quảng cáo",
            maxLevel: 5
        },
        quality: { 
            level: 1, 
            cost: 400, 
            effect: "+15% giá bán tất cả sản phẩm",
            description: "⭐ Nâng cao chất lượng",
            maxLevel: 3
        }
    }
};

// Khởi tạo game
function initGame() {
    console.log('🎮 Initializing Supermarket Tycoon...');
    createShelves();
    updateUI();
    addLog("🛒 Game đã khởi động! Bắt đầu kinh doanh nào!", "success");
}

// Tạo kệ hàng
function createShelves() {
    const supermarket = document.getElementById('supermarket');
    supermarket.innerHTML = '';
    
    Object.values(gameState.inventory).forEach((product) => {
        const shelf = document.createElement('div');
        shelf.className = 'shelf';
        shelf.innerHTML = `
            <div class="product-icon">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div>💰 Giá bán: $${product.price}</div>
                <div class="product-stock">📦 Tồn kho: ${product.stock}</div>
                <div>💵 Lợi nhuận: $${product.price - product.cost}</div>
            </div>
        `;
        supermarket.appendChild(shelf);
    });
}

// Cập nhật UI
function updateUI() {
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('reputation').textContent = gameState.reputation;
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('customers').textContent = gameState.customers;
    document.getElementById('totalSales').textContent = gameState.totalSales;
    
    // Cập nhật số lượng tồn kho trên kệ
    const shelves = document.querySelectorAll('.shelf');
    Object.values(gameState.inventory).forEach((product, index) => {
        if (shelves[index]) {
            const stockElement = shelves[index].querySelector('.product-stock');
            if (stockElement) {
                stockElement.textContent = `📦 Tồn kho: ${product.stock}`;
            }
        }
    });

    // Kiểm tra điều kiện thắng/thua
    checkGameConditions();
}

// Xử lý nhập hàng
function handleRestock() {
    const modal = document.getElementById('restockModal');
    const optionsContainer = document.getElementById('restockOptions');
    optionsContainer.innerHTML = '';
    
    Object.entries(gameState.inventory).forEach(([key, product]) => {
        const restockOption = document.createElement('div');
        restockOption.className = 'restock-option';
        restockOption.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">${product.emoji}</div>
            <div style="font-weight: bold; margin-bottom: 5px;">${product.name}</div>
            <div>Giá nhập: $${product.cost}</div>
            <div>Tồn kho: ${product.stock}</div>
            <div style="margin-top: 10px; color: #4CAF50;">
                Nhập 10 cái: $${product.cost * 10}
            </div>
        `;
        restockOption.onclick = () => restockProduct(key, 10);
        optionsContainer.appendChild(restockOption);
    });
    
    modal.style.display = 'flex';
}

function restockProduct(productKey, quantity) {
    const product = gameState.inventory[productKey];
    const totalCost = quantity * product.cost;
    
    if (totalCost > gameState.money) {
        addLog(`❌ Không đủ tiền nhập ${quantity} ${product.name}! Cần $${totalCost}`, "error");
        return;
    }
    
    gameState.money -= totalCost;
    product.stock += quantity;
    
    addLog(`✅ Đã nhập ${quantity} ${product.name} - Tổng chi: $${totalCost}`, "success");
    updateUI();
    closeModal('restockModal');
}

// Xử lý kinh doanh
async function handleBusiness() {
    addLog("🔄 Đang kinh doanh...", "warning");
    
    let dailySales = 0;
    let dailyCustomers = 0;
    
    // Tính số khách hàng dựa trên danh tiếng và nâng cấp
    const baseCustomers = 5 + Math.floor(gameState.reputation / 2);
    const advertisingBonus = Math.floor(baseCustomers * (gameState.upgrades.advertising.level - 1) * 0.2);
    const customerCount = baseCustomers + advertisingBonus + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < customerCount; i++) {
        await sleep(400);
        const availableItems = Object.values(gameState.inventory).filter(item => item.stock > 0);
        if (availableItems.length === 0) {
            addLog("❌ Đã hết hàng! Không thể bán tiếp.", "error");
            break;
        }
        
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        if (Math.random() < randomItem.demand) {
            randomItem.stock--;
            const saleAmount = randomItem.price;
            dailySales += saleAmount;
            dailyCustomers++;
            addLog(`💰 Khách ${i+1} mua ${randomItem.emoji} ${randomItem.name} - $${saleAmount}`);
        }
    }
    
    gameState.money += dailySales;
    gameState.totalSales += dailySales;
    gameState.customers = dailyCustomers;
    gameState.day++;
    
    // Tăng danh tiếng dựa trên doanh thu
    if (dailySales > 0) {
        const repGain = Math.max(1, Math.floor(dailySales / 50));
        gameState.reputation += repGain;
    }
    
    // Kiểm tra level up
    if (gameState.totalSales > gameState.level * 1000) {
        gameState.level++;
        addLog(`🎉 LEVEL UP! Siêu thị đạt cấp ${gameState.level}! Thưởng $200!`, "success");
        gameState.money += 200;
    }
    
    // Sự kiện ngẫu nhiên
    handleRandomEvents();
    
    addLog(`📊 Kết quả ngày ${gameState.day - 1}: $${dailySales} từ ${dailyCustomers} khách hàng`, "success");
    updateUI();
}

// Sự kiện ngẫu nhiên
function handleRandomEvents() {
    const events = [
        {
            name: "📰 Quảng cáo viral trên mạng xã hội!",
            probability: 0.2,
            effect: () => {
                gameState.reputation += 5;
                return "Danh tiếng +5!";
            }
        },
        {
            name: "🎯 Khuyến mãi thành công ngoài dự kiến!",
            probability: 0.3,
            effect: () => {
                const bonus = 50 + Math.floor(Math.random() * 100);
                gameState.money += bonus;
                return `Thu thêm $${bonus} từ khuyến mãi!`;
            }
        },
        {
            name: "🚨 Hàng hóa hư hỏng do bảo quản!",
            probability: 0.15,
            effect: () => {
                const randomItem = Object.values(gameState.inventory)[Math.floor(Math.random() * 6)];
                const lost = Math.max(1, Math.floor(randomItem.stock * 0.1));
                randomItem.stock -= lost;
                return `Mất ${lost} ${randomItem.name} do hư hỏng!`;
            }
        },
        {
            name: "🌟 Khách hàng trung thành tặng quà!",
            probability: 0.1,
            effect: () => {
                gameState.money += 100;
                gameState.reputation += 3;
                return "Nhận quà $100 và danh tiếng +3 từ khách hàng trung thành!";
            }
        }
    ];

    events.forEach(event => {
        if (Math.random() < event.probability) {
            const result = event.effect();
            addLog(`📢 ${event.name} - ${result}`, "warning");
        }
    });
}

// Hiển thị thống kê
function showStatistics() {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');
    
    let inventoryValue = 0;
    let totalProfit = 0;
    
    Object.values(gameState.inventory).forEach(item => {
        inventoryValue += item.stock * item.cost;
        totalProfit += item.stock * (item.price - item.cost);
    });
    
    const totalCustomers = Math.floor(gameState.totalSales / 15);
    const avgDailySales = Math.floor(gameState.totalSales / (gameState.day - 1) || 0);
    const moneyToWin = Math.max(0, 10000 - gameState.money);
    
    content.innerHTML = `
        <div style="display: grid; gap: 15px; font-size: 1.1em;">
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <div>💰 <strong>Tổng doanh thu:</strong> $${gameState.totalSales}</div>
                <div>📅 <strong>Số ngày kinh doanh:</strong> ${gameState.day - 1}</div>
                <div>📈 <strong>Doanh thu trung bình/ngày:</strong> $${avgDailySales}</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <div>🏪 <strong>Cấp độ siêu thị:</strong> ${gameState.level}</div>
                <div>😊 <strong>Điểm danh tiếng:</strong> ${gameState.reputation}</div>
                <div>👥 <strong>Tổng khách hàng ước tính:</strong> ${totalCustomers}</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <div>📦 <strong>Giá trị kho hàng:</strong> $${inventoryValue}</div>
                <div>💵 <strong>Lợi nhuận tiềm năng:</strong> $${totalProfit}</div>
                <div>🎯 <strong>Còn lại để thắng:</strong> $${moneyToWin}</div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Hiển thị nâng cấp
function showUpgrades() {
    const modal = document.getElementById('upgradesModal');
    const content = document.getElementById('upgradesContent');
    content.innerHTML = '';
    
    Object.entries(gameState.upgrades).forEach(([key, upgrade]) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.style.cssText = `
            background: rgba(255,255,255,0.1);
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 12px;
            border-left: 4px solid #3498db;
        `;
        
        const canAfford = gameState.money >= upgrade.cost;
        const isMaxLevel = upgrade.level >= upgrade.maxLevel;
        
        upgradeElement.innerHTML = `
            <h3 style="margin-bottom: 10px; color: #3498db;">${upgrade.description}</h3>
            <p style="margin-bottom: 5px;">${upgrade.effect}</p>
            <p style="margin-bottom: 10px;">Cấp hiện tại: ${upgrade.level}/${upgrade.maxLevel}</p>
            <p style="margin-bottom: 15px; font-weight: bold; color: ${canAfford ? '#4CAF50' : '#e74c3c'}">
                Giá nâng cấp: $${upgrade.cost}
            </p>
            <button 
                onclick="buyUpgrade('${key}')" 
                ${!canAfford || isMaxLevel ? 'disabled' : ''}
                style="width: 100%; padding: 12px; background: ${isMaxLevel ? '#95a5a6' : canAfford ? '#2ecc71' : '#e74c3c'}; color: white; border: none; border-radius: 8px; cursor: ${isMaxLevel ? 'default' : canAfford ? 'pointer' : 'not-allowed'};"
            >
                ${isMaxLevel ? '🎉 Đã đạt cấp tối đa!' : canAfford ? '🚀 Nâng cấp ngay!' : '❌ Không đủ tiền'}
            </button>
        `;
        
        content.appendChild(upgradeElement);
    });
    
    modal.style.display = 'flex';
}

// Mua nâng cấp
function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    
    if (gameState.money < upgrade.cost) {
        addLog(`❌ Không đủ tiền để nâng cấp! Cần $${upgrade.cost}`, "error");
        return;
    }
    
    if (upgrade.level >= upgrade.maxLevel) {
        addLog(`❌ ${upgrade.description} đã đạt cấp tối đa!`, "error");
        return;
    }
    
    gameState.money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.cost * 1.8); // Tăng giá cho lần nâng cấp tiếp theo
    
    // Áp dụng hiệu ứng nâng cấp
    applyUpgradeEffect(upgradeKey);
    
    addLog(`✅ Đã nâng cấp ${upgrade.description} lên cấp ${upgrade.level}`, "success");
    updateUI();
    closeModal('upgradesModal');
}

// Áp dụng hiệu ứng nâng cấp
function applyUpgradeEffect(upgradeKey) {
    switch (upgradeKey) {
        case 'quality':
            // Tăng giá bán cho tất cả sản phẩm
            Object.values(gameState.inventory).forEach(item => {
                item.price = Math.floor(item.price * 1.15);
            });
            addLog("⭐ Chất lượng sản phẩm được cải thiện! Giá bán tăng 15%", "success");
            break;
        case 'shelf':
            addLog("📦 Kệ hàng được mở rộng! Sức chứa tăng lên", "success");
            break;
        case 'advertising':
            addLog("📢 Quảng cáo hiệu quả! Sẽ có nhiều khách hàng hơn", "success");
            break;
    }
}

// Hiển thị hướng dẫn
function showInstructions() {
    const modal = document.getElementById('instructionsModal');
    const content = document.getElementById('instructionsContent');
    
    content.innerHTML = `
        <div style="line-height: 1.6;">
            <h3 style="color: #3498db; margin-bottom: 15px;">🎯 Mục tiêu trò chơi</h3>
            <p>Kiếm <strong>$10,000</strong> để trở thành triệu phú siêu thị!</p>
            
            <h3 style="color: #3498db; margin: 20px 0 10px;">📦 Cách chơi</h3>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
                <li><strong>Nhập hàng:</strong> Mua hàng với giá gốc, bán với giá lời</li>
                <li><strong>Kinh doanh:</strong> Mỗi ngày khách hàng sẽ tự động đến mua hàng</li>
                <li><strong>Nâng cấp:</strong> Cải thiện siêu thị để thu hút nhiều khách hơn</li>
                <li><strong>Quản lý:</strong> Theo dõi kho hàng và tài chính</li>
            </ul>
            
            <h3 style="color: #3498db; margin: 20px 0 10px;">💡 Mẹo chiến thắng</h3>
            <ul style="margin-left: 20px;">
                <li>Luôn giữ kho hàng đa dạng</li>
                <li>Nâng cấp quảng cáo để tăng số khách hàng</li>
                <li>Nâng cấp chất lượng để tăng lợi nhuận</li>
                <li>Theo dõi danh tiếng - càng cao càng nhiều khách</li>
            </ul>
            
            <div style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>⚡ Tính năng đặc biệt:</strong>
                <br>• Sự kiện ngẫu nhiên mỗi ngày
                <br>• Hệ thống nâng cấp đa dạng
                <br>• Tự động lưu game
                <br>• Đồ họa đẹp mắt và hiệu ứng
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Utility functions
function addLog(message, type = "normal") {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkGameConditions() {
    if (gameState.money < 0) {
        addLog("💸 BẠN ĐÃ PHÁ SẢN! GAME OVER! Làm lại từ đầu nào!", "error");
        disableGame();
    } else if (gameState.money >= 10000) {
        addLog("🏆 CHÚC MỪNG! BẠN ĐÃ TRỞ THÀNH TRIỆU PHÚ SIÊU THỊ! 🎉", "success");
        disableGame();
    }
}

function disableGame() {
    const buttons = document.querySelectorAll('button:not(.close-modal)');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    });
}

function saveGame() {
    try {
        localStorage.setItem('supermarketSave', JSON.stringify(gameState));
        addLog("💾 Game đã được lưu tự động!", "success");
    } catch (error) {
        addLog("❌ Lỗi khi lưu game: " + error.message, "error");
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('supermarketSave');
        if (saved) {
            const savedState = JSON.parse(saved);
            Object.assign(gameState, savedState);
            updateUI();
            addLog("📂 Đã tải game đã lưu! Tiếp tục kinh doanh nào!", "success");
        }
    } catch (error) {
        console.log('No saved game found or error loading:', error);
    }
}

// Auto-save mỗi 30 giây
setInterval(saveGame, 30000);

// Khởi chạy game khi trang load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing game...');
    initGame();
    loadGame();
});

// Xử lý lỗi toàn cục
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    addLog(`❌ Lỗi: ${e.error.message}`, "error");
});
