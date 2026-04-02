// ============================================================
// SUPERMARKET TYCOON - ENHANCED RENDERER v2.0
// ============================================================

const WIN_GOAL = 15000;

// ---- PRODUCT TEMPLATES ----
const PRODUCT_TEMPLATES = {
    milk:       { name: "Sữa tươi",    emoji: "🥛", baseCost: 2,  basePrice: 5,  demand: 0.85, perishable: true,  unlockLevel: 1 },
    bread:      { name: "Bánh mì",     emoji: "🍞", baseCost: 3,  basePrice: 8,  demand: 0.80, perishable: true,  unlockLevel: 1 },
    eggs:       { name: "Trứng gà",    emoji: "🥚", baseCost: 5,  basePrice: 12, demand: 0.75, perishable: true,  unlockLevel: 1 },
    water:      { name: "Nước uống",   emoji: "💧", baseCost: 2,  basePrice: 6,  demand: 0.90, perishable: false, unlockLevel: 1 },
    meat:       { name: "Thịt tươi",   emoji: "🥩", baseCost: 14, basePrice: 30, demand: 0.55, perishable: true,  unlockLevel: 1 },
    vegetables: { name: "Rau xanh",    emoji: "🥦", baseCost: 6,  basePrice: 15, demand: 0.70, perishable: true,  unlockLevel: 1 },
    juice:      { name: "Nước ép",     emoji: "🧃", baseCost: 8,  basePrice: 18, demand: 0.65, perishable: false, unlockLevel: 2 },
    soda:       { name: "Nước ngọt",   emoji: "🥤", baseCost: 4,  basePrice: 10, demand: 0.70, perishable: false, unlockLevel: 2 },
    chips:      { name: "Snack",       emoji: "🍟", baseCost: 5,  basePrice: 12, demand: 0.65, perishable: false, unlockLevel: 3 },
    chocolate:  { name: "Socola",      emoji: "🍫", baseCost: 7,  basePrice: 16, demand: 0.60, perishable: false, unlockLevel: 3 },
    coffee:     { name: "Cà phê lon",  emoji: "☕", baseCost: 9,  basePrice: 22, demand: 0.58, perishable: false, unlockLevel: 4 },
    soap:       { name: "Xà phòng",    emoji: "🧼", baseCost: 9,  basePrice: 22, demand: 0.50, perishable: false, unlockLevel: 4 },
    shampoo:    { name: "Dầu gội",     emoji: "🧴", baseCost: 16, basePrice: 38, demand: 0.45, perishable: false, unlockLevel: 5 },
};

// ---- UPGRADE DEFINITIONS ----
const UPGRADE_DEFS = {
    advertising: {
        icon: "📢", description: "Quảng cáo",
        levels: [
            { cost: 300,  label: "Tờ rơi",             effect: "+25% khách hàng/ngày" },
            { cost: 600,  label: "Mạng xã hội",         effect: "+30% khách hàng thêm" },
            { cost: 1000, label: "Billboard",            effect: "+35% khách, danh tiếng +1/ngày" },
            { cost: 1800, label: "TV quảng cáo",         effect: "+40% khách + thu hút khách VIP" },
            { cost: 3000, label: "Chiến dịch quốc gia",  effect: "+50% khách, bùng nổ doanh thu!" },
        ]
    },
    quality: {
        icon: "⭐", description: "Chất lượng hàng",
        levels: [
            { cost: 400,  label: "Tiêu chuẩn tốt", effect: "+15% giá bán tất cả sản phẩm" },
            { cost: 800,  label: "Tiêu chuẩn cao",  effect: "+15% giá bán & tăng nhu cầu" },
            { cost: 1500, label: "Cao cấp",          effect: "+20% giá bán & ít hàng hỏng hơn" },
        ]
    },
    staff: {
        icon: "👨‍💼", description: "Nhân viên",
        levels: [
            { cost: 500,  label: "Nhân viên bán hàng",   effect: "+3 giao dịch/ngày" },
            { cost: 900,  label: "Quản lý kho",           effect: "+5 giao dịch, giảm hàng hỏng" },
            { cost: 1400, label: "Đội ngũ chuyên nghiệp", effect: "+5 giao dịch, tốc độ x1.5" },
            { cost: 2500, label: "Giám đốc vận hành",     effect: "+8 giao dịch, tối ưu toàn bộ" },
        ]
    },
    storage: {
        icon: "🏭", description: "Kho & Bảo quản",
        levels: [
            { cost: 350,  label: "Tủ lạnh nhỏ",    effect: "Giảm 50% tỉ lệ hàng tươi hư hỏng" },
            { cost: 700,  label: "Kho lạnh",         effect: "Hàng tươi gần như không hư hỏng" },
            { cost: 1200, label: "Hệ thống FIFO",    effect: "Bảo quản tự động, 0% hàng hỏng" },
            { cost: 2000, label: "Kho tự động hóa",  effect: "Không bao giờ mất hàng tươi!" },
        ]
    }
};

// ---- ACHIEVEMENTS ----
const ACHIEVEMENTS = [
    { id: 'first_sale',  emoji: '🥇', name: 'Giao dịch đầu tiên', desc: 'Kiếm được tiền ngày đầu tiên',    check: gs => gs.totalSales > 0 },
    { id: 'day10',       emoji: '📅', name: 'Kiên trì',           desc: 'Tồn tại đến ngày thứ 10',         check: gs => gs.day >= 10 },
    { id: 'money1000',   emoji: '💵', name: 'Vốn tích lũy',       desc: 'Có $1,000 trong tay',             check: gs => gs.money >= 1000 },
    { id: 'money5000',   emoji: '💰', name: 'Gần về đích',        desc: 'Tích lũy $5,000',                 check: gs => gs.money >= 5000 },
    { id: 'level3',      emoji: '🏪', name: 'Siêu thị hạng trung', desc: 'Đạt cấp độ 3',                  check: gs => gs.level >= 3 },
    { id: 'level5',      emoji: '🏬', name: 'Tập đoàn bán lẻ',   desc: 'Đạt cấp độ 5',                    check: gs => gs.level >= 5 },
    { id: 'rep50',       emoji: '😍', name: 'Được yêu mến',       desc: 'Danh tiếng đạt 50',               check: gs => gs.reputation >= 50 },
    { id: 'rep100',      emoji: '🌟', name: 'Huyền thoại',        desc: 'Danh tiếng đạt 100',              check: gs => gs.reputation >= 100 },
    { id: 'upgrade4',    emoji: '👑', name: 'Nhà đầu tư chiến lược', desc: 'Mua ít nhất 4 loại nâng cấp', check: gs => Object.values(gs.upgrades).filter(u => u.currentLevel > 0).length >= 4 },
    { id: 'unlock_all',  emoji: '🗝️', name: 'Mở khóa hết',       desc: 'Mở khóa tất cả sản phẩm',        check: gs => Object.values(gs.inventory).every(i => i.unlocked) },
];

// ---- CREATE INITIAL STATE ----
function createInitialState() {
    const inventory = {};
    Object.entries(PRODUCT_TEMPLATES).forEach(([key, t]) => {
        inventory[key] = {
            ...t,
            price: t.basePrice,
            stock: 0,
            unlocked: t.unlockLevel === 1,
            totalSold: 0,
            totalRevenue: 0,
        };
    });

    const upgrades = {};
    Object.entries(UPGRADE_DEFS).forEach(([key, def]) => {
        upgrades[key] = { icon: def.icon, description: def.description, currentLevel: 0 };
    });

    return {
        money: 1500,
        day: 1,
        reputation: 10,
        level: 1,
        customers: 0,
        totalSales: 0,
        totalCustomers: 0,
        dayHistory: [],
        achievements: [],
        inventory,
        upgrades,
        gameOver: false,
        gameWon: false,
        isBusy: false,
    };
}

let gameState = createInitialState();

// ============================================================
// INIT
// ============================================================
function initGame() {
    createShelves();
    updateUI();
    addLog("🛒 Chào mừng đến với Supermarket Tycoon v2!", "success");
    addLog(`💡 Mục tiêu: kiếm $${WIN_GOAL.toLocaleString()} để chiến thắng!`);
    addLog("📦 Bắt đầu bằng cách nhập hàng nhé!");
}

// ============================================================
// SHELVES
// ============================================================
function createShelves() {
    const container = document.getElementById('supermarket');
    container.innerHTML = '';

    Object.entries(gameState.inventory).forEach(([key, product]) => {
        const shelf = document.createElement('div');

        if (!product.unlocked) {
            shelf.className = 'shelf locked-shelf';
            shelf.innerHTML = `
                <div style="font-size:2.2em; filter:grayscale(1) brightness(0.6);">${product.emoji}</div>
                <div style="text-align:center; opacity:0.5; font-size:0.85em; margin-top:8px;">
                    <div style="font-weight:bold;">${product.name}</div>
                    <div>🔒 Mở khóa cấp ${product.unlockLevel}</div>
                </div>
            `;
        } else {
            shelf.className = 'shelf';
            shelf.id = `shelf-${key}`;
            const { bar, color } = getStockBar(product);
            shelf.innerHTML = `
                <div class="product-icon">${product.emoji}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="price-row">💵 $${product.baseCost} nhập → <strong>$${product.price}</strong> bán</div>
                    <div class="product-stock" style="color:${color}">📦 ${product.stock} đơn vị</div>
                    <div class="profit-row">💹 Lời $${product.price - product.baseCost}/sp</div>
                    <div class="stock-bar-wrap"><div class="stock-bar" style="width:${bar}%; background:${color};"></div></div>
                </div>
                <button class="price-btn" onclick="event.stopPropagation(); editPrice('${key}')">✏️ Sửa giá</button>
            `;
        }
        container.appendChild(shelf);
    });
}

function getStockBar(product) {
    const pct = Math.min(100, (product.stock / 50) * 100);
    const color = pct < 20 ? '#f44336' : pct < 50 ? '#ff9800' : '#4CAF50';
    return { bar: pct, color };
}

function updateShelves() {
    Object.entries(gameState.inventory).filter(([, p]) => p.unlocked).forEach(([key, product]) => {
        const shelf = document.getElementById(`shelf-${key}`);
        if (!shelf) return;
        const { bar, color } = getStockBar(product);
        const stockEl = shelf.querySelector('.product-stock');
        if (stockEl) { stockEl.textContent = `📦 ${product.stock} đơn vị`; stockEl.style.color = color; }
        const barEl = shelf.querySelector('.stock-bar');
        if (barEl) { barEl.style.width = bar + '%'; barEl.style.background = color; }
        const priceRow = shelf.querySelector('.price-row');
        if (priceRow) priceRow.innerHTML = `💵 $${product.baseCost} nhập → <strong>$${product.price}</strong> bán`;
        const profitRow = shelf.querySelector('.profit-row');
        if (profitRow) profitRow.textContent = `💹 Lời $${product.price - product.baseCost}/sp`;
    });
}

// ============================================================
// UI UPDATE
// ============================================================
function updateUI() {
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('reputation').textContent = gameState.reputation;
    document.getElementById('money').textContent = gameState.money.toLocaleString();
    document.getElementById('customers').textContent = gameState.customers;
    document.getElementById('totalSales').textContent = gameState.totalSales.toLocaleString();

    const levelGoal = gameState.level * 2000;
    const progress = Math.min(100, (gameState.totalSales / levelGoal) * 100);
    const progressEl = document.getElementById('levelProgress');
    if (progressEl) progressEl.style.width = progress + '%';
    const progressLbl = document.getElementById('levelProgressLabel');
    if (progressLbl) progressLbl.textContent = `Cấp tiếp: $${Math.max(0, levelGoal - gameState.totalSales).toLocaleString()} nữa`;

    updateShelves();
    checkAchievements();
    checkGameConditions();
}

// ============================================================
// HANDLE BUSINESS (simulate a day)
// ============================================================
async function handleBusiness() {
    if (gameState.gameOver || gameState.gameWon || gameState.isBusy) return;
    gameState.isBusy = true;
    disableButtons(true);

    addLog(`📅 ─── Ngày ${gameState.day} bắt đầu ───`, "warning");

    let dailySales = 0;
    let dailyCustomers = 0;
    let dayEvents = [];
    const salesLog = {};

    // Customer calculation
    const baseCustomers = 5 + Math.floor(gameState.reputation / 3);
    let adsMultiplier = 1;
    const adsLevels = [0.25, 0.30, 0.35, 0.40, 0.50];
    for (let i = 0; i < gameState.upgrades.advertising.currentLevel; i++) {
        adsMultiplier += adsLevels[i];
    }
    const staffBonus = getStaffBonus();
    const customerCount = Math.floor((baseCustomers + staffBonus) * adsMultiplier) + Math.floor(Math.random() * 8);

    for (let i = 0; i < customerCount; i++) {
        await sleep(150);
        const available = Object.entries(gameState.inventory)
            .filter(([, item]) => item.unlocked && item.stock > 0);
        if (available.length === 0) {
            if (i < 3) addLog("❌ Hết hàng! Nhiều khách phải quay về tay không.", "error");
            break;
        }

        // Each customer browses 1-2 items
        const browseCount = Math.min(available.length, 1 + Math.floor(Math.random() * 2));
        const shuffled = [...available].sort(() => Math.random() - 0.5);

        for (let j = 0; j < browseCount; j++) {
            const [key, item] = shuffled[j];
            if (item.stock <= 0) continue;

            // Price sensitivity: demand drops if price > base
            const priceFactor = item.basePrice / item.price;
            const effectiveDemand = item.demand * Math.min(1.2, Math.max(0.3, priceFactor));

            if (Math.random() < effectiveDemand) {
                item.stock--;
                item.totalSold++;
                item.totalRevenue += item.price;
                dailySales += item.price;
                dailyCustomers++;

                if (!salesLog[key]) salesLog[key] = { qty: 0, revenue: 0, name: item.name, emoji: item.emoji };
                salesLog[key].qty++;
                salesLog[key].revenue += item.price;
            }
        }
    }

    // Random events
    const events = generateRandomEvents();
    events.forEach(e => {
        addLog(`📢 ${e.name}`, e.type || "warning");
        dayEvents.push(e.name);
    });

    // Perishables spoilage
    const spoilageRate = getSpoilageRate();
    let totalSpoiled = 0;
    if (spoilageRate > 0) {
        Object.values(gameState.inventory).forEach(item => {
            if (item.perishable && item.unlocked && item.stock > 0) {
                const spoiled = Math.floor(item.stock * spoilageRate * (0.5 + Math.random() * 0.5));
                if (spoiled > 0) {
                    item.stock -= spoiled;
                    totalSpoiled += spoiled;
                }
            }
        });
        if (totalSpoiled > 0) {
            addLog(`🗑️ ${totalSpoiled} sản phẩm tươi bị hư hỏng do bảo quản kém`, "error");
        }
    }

    // Update state
    gameState.money += dailySales;
    gameState.totalSales += dailySales;
    gameState.customers = dailyCustomers;
    gameState.totalCustomers += dailyCustomers;

    // Reputation
    if (dailyCustomers > 0) {
        gameState.reputation += Math.max(1, Math.floor(dailySales / 60));
    } else {
        gameState.reputation = Math.max(1, gameState.reputation - 1);
    }
    if (gameState.upgrades.advertising.currentLevel >= 3) gameState.reputation++;

    // Level up
    const levelGoal = gameState.level * 2000;
    if (gameState.totalSales >= levelGoal) {
        gameState.level++;
        const reward = 300 * gameState.level;
        gameState.money += reward;
        addLog(`🎉 LEVEL UP! Cấp ${gameState.level}! Thưởng $${reward}!`, "success");
        unlockProductsForLevel(gameState.level);
        createShelves();
    }

    // Day history
    gameState.dayHistory.push({
        day: gameState.day,
        revenue: dailySales,
        customers: dailyCustomers,
        spoiled: totalSpoiled,
        events: dayEvents,
        salesLog
    });

    gameState.day++;
    addLog(`📊 Kết quả ngày ${gameState.day - 1}: +$${dailySales} | ${dailyCustomers} giao dịch`, "success");

    updateUI();
    gameState.isBusy = false;
    disableButtons(false);

    showDayReport(gameState.dayHistory[gameState.dayHistory.length - 1]);
}

function getStaffBonus() {
    const bonuses = [0, 3, 8, 13, 21];
    return bonuses[gameState.upgrades.staff.currentLevel] || 0;
}

function getSpoilageRate() {
    const rates = [0.12, 0.06, 0.02, 0.005, 0];
    return rates[gameState.upgrades.storage.currentLevel] || 0.12;
}

function unlockProductsForLevel(level) {
    const newItems = [];
    Object.values(gameState.inventory).forEach(product => {
        if (!product.unlocked && product.unlockLevel <= level) {
            product.unlocked = true;
            newItems.push(product.name);
        }
    });
    if (newItems.length > 0) {
        addLog(`🔓 Sản phẩm mới được mở khóa: ${newItems.join(', ')}!`, "success");
    }
}

// ============================================================
// DAY REPORT MODAL
// ============================================================
function showDayReport(report) {
    const modal = document.getElementById('dayReportModal');
    const content = document.getElementById('dayReportContent');

    let salesRows = '';
    if (report.salesLog && Object.keys(report.salesLog).length > 0) {
        salesRows = Object.values(report.salesLog)
            .sort((a, b) => b.revenue - a.revenue)
            .map(item => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                    <td style="padding:7px 10px;">${item.emoji} ${item.name}</td>
                    <td style="padding:7px 10px; text-align:center;">${item.qty}</td>
                    <td style="padding:7px 10px; text-align:right; color:#a5d6a7;">$${item.revenue}</td>
                </tr>`).join('');
        salesRows = `<table style="width:100%;border-collapse:collapse;margin:12px 0;">
            <tr style="background:rgba(255,255,255,0.12); font-size:0.85em; color:#ccc;">
                <th style="padding:7px 10px; text-align:left;">Sản phẩm</th>
                <th style="padding:7px 10px;">SL</th>
                <th style="padding:7px 10px; text-align:right;">Doanh thu</th>
            </tr>${salesRows}</table>`;
    } else {
        salesRows = `<div style="text-align:center; color:#ff8a80; padding:20px; font-size:1.1em;">😞 Không bán được gì hôm nay!</div>`;
    }

    content.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:15px; text-align:center;">
            <div style="background:rgba(76,175,80,0.2); padding:14px; border-radius:10px; border:1px solid #4CAF50;">
                <div style="font-size:1.7em; font-weight:bold;">$${report.revenue}</div>
                <div style="font-size:0.78em; color:#a5d6a7; margin-top:3px;">Doanh thu</div>
            </div>
            <div style="background:rgba(33,150,243,0.2); padding:14px; border-radius:10px; border:1px solid #2196F3;">
                <div style="font-size:1.7em; font-weight:bold;">${report.customers}</div>
                <div style="font-size:0.78em; color:#90caf9; margin-top:3px;">Giao dịch</div>
            </div>
            <div style="background:rgba(244,67,54,0.2); padding:14px; border-radius:10px; border:1px solid #f44336;">
                <div style="font-size:1.7em; font-weight:bold;">${report.spoiled}</div>
                <div style="font-size:0.78em; color:#ef9a9a; margin-top:3px;">Hàng hỏng</div>
            </div>
        </div>
        ${salesRows}
        ${report.events.length > 0 ? `
        <div style="background:rgba(255,152,0,0.1); padding:12px; border-radius:8px; border-left:4px solid #ff9800; margin-top:10px;">
            <div style="font-weight:bold; margin-bottom:8px; font-size:0.9em;">📢 Sự kiện hôm nay:</div>
            ${report.events.map(e => `<div style="font-size:0.85em; margin:4px 0; opacity:0.9;">${e}</div>`).join('')}
        </div>` : ''}
        <button onclick="closeModal('dayReportModal')"
            style="margin-top:18px; width:100%; padding:12px; background:linear-gradient(135deg,#3498db,#2980b9); border:none; border-radius:10px; color:white; font-size:1em; font-weight:bold; cursor:pointer;">
            ✅ Tiếp tục kinh doanh
        </button>
    `;

    modal.style.display = 'flex';
}

// ============================================================
// RANDOM EVENTS
// ============================================================
function generateRandomEvents() {
    const triggered = [];

    const eventDefs = [
        { prob: 0.15, type: "success", fn: () => {
            gameState.reputation += 8;
            return "📰 Viral trên mạng! Danh tiếng +8";
        }},
        { prob: 0.20, type: "success", fn: () => {
            const b = 80 + Math.floor(Math.random() * 150);
            gameState.money += b;
            return `🎯 Khuyến mãi thành công! Thu thêm $${b}`;
        }},
        { prob: 0.12, type: "error", fn: () => {
            let lost = 0;
            Object.values(gameState.inventory).filter(i => i.perishable && i.unlocked && i.stock > 2).forEach(item => {
                const l = Math.floor(item.stock * 0.15);
                item.stock -= l; lost += l;
            });
            return `🚨 Sự cố điện lạnh! Mất thêm ${lost} sp hàng tươi`;
        }},
        { prob: 0.10, type: "success", fn: () => {
            gameState.money += 150; gameState.reputation += 5;
            return "🌟 Khách VIP tặng quà! +$150 và danh tiếng +5";
        }},
        { prob: 0.08, type: "error", fn: () => {
            gameState.reputation = Math.max(1, gameState.reputation - 5);
            return "⚡ Mất điện đột ngột! Danh tiếng -5";
        }},
        { prob: 0.12, type: "warning", fn: () => {
            const extra = 6 * 8;
            gameState.money += extra; gameState.totalSales += extra; gameState.totalCustomers += 6;
            return "🏫 Đoàn học sinh đến tham quan! +$48 doanh thu";
        }},
        { prob: 0.10, type: "success", fn: () => {
            const keys = Object.keys(gameState.inventory).filter(k => gameState.inventory[k].unlocked);
            if (keys.length > 0) {
                const k = keys[Math.floor(Math.random() * keys.length)];
                gameState.inventory[k].stock += 8;
                return `📦 Nhà cung cấp tặng 8x ${gameState.inventory[k].emoji}${gameState.inventory[k].name}!`;
            }
            return null;
        }},
        { prob: 0.10, type: "error", fn: () => {
            const fee = 60 + Math.floor(Math.random() * 60);
            gameState.money = Math.max(0, gameState.money - fee);
            return `💸 Chi phí bảo trì bất ngờ! -$${fee}`;
        }},
        { prob: 0.08, type: "success", fn: () => {
            gameState.reputation += 10; gameState.money += 200;
            return "🏆 Được bình chọn siêu thị tốt nhất khu vực! +$200 và danh tiếng +10";
        }},
        { prob: 0.07, type: "warning", fn: () => {
            Object.values(gameState.inventory).filter(i => i.unlocked).forEach(item => {
                item.demand = Math.min(0.95, item.demand + 0.05);
            });
            return "📈 Xu hướng mua sắm tăng cao! Nhu cầu tất cả sản phẩm tăng hôm nay";
        }},
        { prob: 0.07, type: "warning", fn: () => {
            Object.values(gameState.inventory).filter(i => i.unlocked).forEach(item => {
                item.demand = Math.max(0.1, item.demand - 0.03);
            });
            return "🌧️ Thời tiết xấu, ít khách ra đường... Nhu cầu giảm nhẹ";
        }},
        { prob: 0.06, type: "success", fn: () => {
            const bonus = 100;
            gameState.money += bonus;
            return `🎁 Nhận được hoàn thuế! +$${bonus} tiền mặt`;
        }},
    ];

    eventDefs.forEach(ev => {
        if (Math.random() < ev.prob) {
            const msg = ev.fn();
            if (msg) triggered.push({ name: msg, type: ev.type });
        }
    });

    return triggered;
}

// ============================================================
// RESTOCK MODAL
// ============================================================
function handleRestock() {
    const modal = document.getElementById('restockModal');
    renderRestockOptions();
    modal.style.display = 'flex';
}

function renderRestockOptions() {
    const container = document.getElementById('restockOptions');
    container.innerHTML = '';

    Object.entries(gameState.inventory)
        .filter(([, p]) => p.unlocked)
        .forEach(([key, product]) => {
            const div = document.createElement('div');
            div.className = 'restock-option';

            const qtys = [5, 10, 20, 50];
            const btnHtml = qtys.map(qty => {
                const cost = qty * product.baseCost;
                const canBuy = gameState.money >= cost;
                return `<button onclick="restockProduct('${key}', ${qty})"
                    class="qty-btn ${canBuy ? 'can-buy' : 'cant-buy'}"
                    ${!canBuy ? 'disabled' : ''}>
                    x${qty}<br><small>$${cost}</small>
                </button>`;
            }).join('');

            const pct = Math.min(100, (product.stock / 50) * 100);
            const stockColor = pct < 20 ? '#f44336' : pct < 50 ? '#ff9800' : '#4CAF50';

            div.innerHTML = `
                <div style="font-size:1.9em; margin-bottom:5px;">${product.emoji}</div>
                <div style="font-weight:bold; margin-bottom:3px; font-size:1.05em;">${product.name}</div>
                <div style="font-size:0.82em; color:#aaa; margin-bottom:5px;">Giá nhập: $${product.baseCost}/sp</div>
                <div style="font-size:0.88em; font-weight:bold; margin-bottom:10px; color:${stockColor};">Tồn kho: ${product.stock}</div>
                <div class="qty-btns">${btnHtml}</div>
            `;
            container.appendChild(div);
        });
}

function restockProduct(productKey, quantity) {
    const product = gameState.inventory[productKey];
    const totalCost = quantity * product.baseCost;

    if (totalCost > gameState.money) {
        addLog(`❌ Không đủ tiền nhập ${quantity}x ${product.name}! Cần $${totalCost}`, "error");
        return;
    }

    gameState.money -= totalCost;
    product.stock += quantity;

    addLog(`✅ Nhập ${quantity}x ${product.emoji}${product.name} − $${totalCost}`, "success");
    updateUI();
    renderRestockOptions(); // refresh without closing modal
}

// ============================================================
// PRICE EDITOR
// ============================================================
function editPrice(productKey) {
    const product = gameState.inventory[productKey];
    const modal = document.getElementById('priceModal');
    const content = document.getElementById('priceContent');

    const minPrice = product.baseCost + 1;
    const maxPrice = product.baseCost * 6;
    const suggested = product.basePrice;

    content.innerHTML = `
        <div style="text-align:center; padding:5px;">
            <div style="font-size:3em; margin-bottom:8px;">${product.emoji}</div>
            <div style="font-size:1.3em; font-weight:bold; margin-bottom:18px;">${product.name}</div>

            <div style="background:rgba(255,255,255,0.08); padding:14px; border-radius:10px; margin-bottom:20px; font-size:0.9em; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div>💰 Giá nhập: <strong>$${product.baseCost}</strong></div>
                <div>📊 Nhu cầu: <strong>${Math.round(product.demand * 100)}%</strong></div>
                <div>🎯 Giá gợi ý: <strong>$${suggested}</strong></div>
                <div>📦 Tồn kho: <strong>${product.stock}</strong></div>
            </div>

            <label style="display:block; font-size:1.1em; margin-bottom:12px;">
                Giá bán mới: <strong id="priceDisplay" style="color:#f39c12; font-size:1.3em;">$${product.price}</strong>
            </label>
            <input type="range" id="priceSlider"
                min="${minPrice}" max="${maxPrice}" value="${product.price}"
                style="width:100%; accent-color:#f39c12; cursor:pointer;"
                oninput="document.getElementById('priceDisplay').textContent='$'+this.value; updatePriceHint(${product.baseCost}, ${product.basePrice}, this.value)">
            <div style="display:flex; justify-content:space-between; font-size:0.75em; color:#aaa; margin-top:4px;">
                <span>Min $${minPrice}</span><span>Gợi ý $${suggested}</span><span>Max $${maxPrice}</span>
            </div>

            <div id="priceHint" style="margin:14px 0; padding:10px; border-radius:8px; font-size:0.88em; background:rgba(255,255,255,0.06);"></div>

            <button onclick="applyPrice('${productKey}')"
                style="width:100%; padding:13px; background:linear-gradient(135deg,#27ae60,#2ecc71); border:none; border-radius:10px; color:white; font-size:1.05em; cursor:pointer; font-weight:bold;">
                ✅ Xác nhận giá mới
            </button>
        </div>
    `;

    modal.style.display = 'flex';
    updatePriceHint(product.baseCost, product.basePrice, product.price);
}

function updatePriceHint(cost, suggested, newPrice) {
    const hint = document.getElementById('priceHint');
    if (!hint) return;
    const profit = newPrice - cost;
    const ratio = newPrice / suggested;
    let msg = `💹 Lợi nhuận mỗi sp: <strong style="color:#2ecc71;">$${profit}</strong> | `;
    if (ratio <= 1.0) msg += `🟢 Giá hấp dẫn, nhu cầu cao`;
    else if (ratio <= 1.3) msg += `🟡 Giá hợp lý, nhu cầu bình thường`;
    else if (ratio <= 1.8) msg += `🟠 Giá khá cao, nhu cầu giảm ~30%`;
    else msg += `🔴 Giá quá cao, nhu cầu giảm mạnh!`;
    hint.innerHTML = msg;
}

function applyPrice(productKey) {
    const slider = document.getElementById('priceSlider');
    const product = gameState.inventory[productKey];
    const newPrice = parseInt(slider.value);
    const oldPrice = product.price;
    product.price = newPrice;
    const diff = newPrice - oldPrice;
    const sign = diff >= 0 ? '+' : '';
    addLog(`✏️ ${product.emoji}${product.name}: giá ${sign}$${diff} → $${newPrice}`, "success");
    closeModal('priceModal');
    updateUI();
}

// ============================================================
// UPGRADES
// ============================================================
function showUpgrades() {
    const modal = document.getElementById('upgradesModal');
    const content = document.getElementById('upgradesContent');
    content.innerHTML = '';

    Object.entries(gameState.upgrades).forEach(([key, upgrade]) => {
        const def = UPGRADE_DEFS[key];
        const currentLevel = upgrade.currentLevel;
        const maxLevel = def.levels.length;
        const isMax = currentLevel >= maxLevel;
        const nextLevel = isMax ? null : def.levels[currentLevel];
        const canAfford = !isMax && gameState.money >= nextLevel.cost;

        const dots = Array.from({ length: maxLevel }, (_, i) =>
            `<span style="display:inline-block; width:13px; height:13px; border-radius:50%; margin-right:5px; background:${i < currentLevel ? '#f39c12' : 'rgba(255,255,255,0.2)'};"></span>`
        ).join('');

        const borderColor = isMax ? '#f39c12' : canAfford ? '#2ecc71' : 'rgba(255,255,255,0.15)';

        const div = document.createElement('div');
        div.style.cssText = `background:rgba(255,255,255,0.07); padding:18px; margin-bottom:14px; border-radius:12px; border-left:4px solid ${borderColor};`;

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="color:#f39c12; font-size:1.1em;">${def.icon} ${def.description}</h3>
                <div>${dots} <span style="font-size:0.8em; color:#aaa;">${currentLevel}/${maxLevel}</span></div>
            </div>
            ${isMax
                ? `<div style="color:#f39c12; text-align:center; padding:10px; background:rgba(243,156,18,0.1); border-radius:8px; font-weight:bold;">🏆 Đã đạt cấp tối đa!</div>`
                : `<div style="font-size:0.88em; color:#ccc; margin-bottom:4px;">Cấp tiếp: <strong>${nextLevel.label}</strong></div>
                   <div style="font-size:0.88em; color:#a5d6a7; margin-bottom:14px;">${nextLevel.effect}</div>
                   <div style="display:flex; justify-content:space-between; align-items:center;">
                       <span style="font-weight:bold; font-size:1.1em; color:${canAfford ? '#2ecc71' : '#e74c3c'};">💰 $${nextLevel.cost}</span>
                       <button onclick="buyUpgrade('${key}')" ${!canAfford ? 'disabled' : ''}
                           style="padding:10px 22px; background:${canAfford ? 'linear-gradient(135deg,#27ae60,#2ecc71)' : '#7f8c8d'}; border:none; border-radius:8px; color:white; cursor:${canAfford ? 'pointer' : 'not-allowed'}; font-weight:bold;">
                           ${canAfford ? '🚀 Nâng cấp!' : '❌ Chưa đủ tiền'}
                       </button>
                   </div>`
            }
        `;
        content.appendChild(div);
    });

    modal.style.display = 'flex';
}

function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    const def = UPGRADE_DEFS[upgradeKey];
    const maxLevel = def.levels.length;

    if (upgrade.currentLevel >= maxLevel) {
        addLog(`❌ ${upgrade.description} đã đạt tối đa!`, "error"); return;
    }

    const nextLevel = def.levels[upgrade.currentLevel];
    if (gameState.money < nextLevel.cost) {
        addLog(`❌ Cần $${nextLevel.cost} để nâng cấp!`, "error"); return;
    }

    gameState.money -= nextLevel.cost;
    upgrade.currentLevel++;
    applyUpgradeEffect(upgradeKey, upgrade.currentLevel);

    addLog(`✅ Nâng cấp ${def.icon} ${def.description} → cấp ${upgrade.currentLevel} "${nextLevel.label}"!`, "success");
    updateUI();
    closeModal('upgradesModal');
}

function applyUpgradeEffect(upgradeKey, level) {
    if (upgradeKey === 'quality') {
        const multiplier = level === 3 ? 1.20 : 1.15;
        Object.values(gameState.inventory).forEach(item => {
            item.price = Math.round(item.price * multiplier);
            item.demand = Math.min(0.95, item.demand * 1.05);
        });
        addLog(`⭐ Chất lượng nâng cấp! Giá bán tăng ${level === 3 ? 20 : 15}%`, "success");
    }
}

// ============================================================
// STATISTICS
// ============================================================
function showStatistics() {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');

    const avgDailySales = gameState.day > 1 ? Math.floor(gameState.totalSales / (gameState.day - 1)) : 0;
    const winProgress = Math.min(100, (gameState.money / WIN_GOAL) * 100);
    const moneyToWin = Math.max(0, WIN_GOAL - gameState.money);

    const topProducts = Object.values(gameState.inventory)
        .filter(p => p.unlocked && p.totalSold > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 6);

    const last7 = gameState.dayHistory.slice(-7);
    const maxRev = Math.max(1, ...last7.map(d => d.revenue));
    const sparkline = last7.map(d => {
        const h = Math.round((d.revenue / maxRev) * 65);
        return `<div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">
            <div style="font-size:0.65em; color:#ccc;">$${d.revenue}</div>
            <div style="width:22px; background:linear-gradient(to top,#2ecc71,#27ae60); border-radius:4px 4px 0 0; height:${h}px; min-height:4px;"></div>
            <div style="font-size:0.62em; color:#888;">N${d.day}</div>
        </div>`;
    }).join('');

    content.innerHTML = `
        <div style="display:grid; gap:14px;">
            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px;">
                <div style="font-weight:bold; color:#f39c12; margin-bottom:10px;">🎯 Tiến độ chiến thắng</div>
                <div style="background:rgba(255,255,255,0.1); border-radius:20px; height:18px; overflow:hidden;">
                    <div style="width:${winProgress}%; height:100%; background:linear-gradient(90deg,#f39c12,#e74c3c); border-radius:20px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.82em; margin-top:6px; color:#ccc;">
                    <span>$${gameState.money.toLocaleString()} hiện có</span>
                    <span style="color:#f39c12; font-weight:bold;">${winProgress.toFixed(1)}%</span>
                    <span>Mục tiêu $${WIN_GOAL.toLocaleString()}</span>
                </div>
                ${moneyToWin > 0 ? `<div style="font-size:0.82em; color:#90caf9; margin-top:4px; text-align:center;">Còn cần: $${moneyToWin.toLocaleString()}</div>` : ''}
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${[
                    { v: '$' + gameState.totalSales.toLocaleString(), l: 'Tổng doanh thu', c: '#4CAF50' },
                    { v: '$' + avgDailySales, l: 'Trung bình/ngày', c: '#2196F3' },
                    { v: gameState.totalCustomers, l: 'Tổng giao dịch', c: '#ff9800' },
                    { v: gameState.reputation, l: 'Danh tiếng', c: '#e91e63' },
                ].map(s => `<div style="background:rgba(255,255,255,0.07); padding:12px; border-radius:10px; text-align:center;">
                    <div style="font-size:1.5em; font-weight:bold; color:${s.c};">${s.v}</div>
                    <div style="font-size:0.8em; color:#aaa; margin-top:3px;">${s.l}</div>
                </div>`).join('')}
            </div>

            ${last7.length > 0 ? `
            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px;">
                <div style="font-weight:bold; color:#f39c12; margin-bottom:12px;">📊 Doanh thu 7 ngày gần nhất</div>
                <div style="display:flex; align-items:flex-end; gap:5px; height:85px;">${sparkline}</div>
            </div>` : ''}

            ${topProducts.length > 0 ? `
            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px;">
                <div style="font-weight:bold; color:#f39c12; margin-bottom:12px;">🏆 Top sản phẩm</div>
                ${topProducts.map((p, i) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                        <span>${['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]} ${p.emoji} ${p.name}</span>
                        <span style="color:#a5d6a7; font-size:0.88em;">${p.totalSold} sp | $${p.totalRevenue.toLocaleString()}</span>
                    </div>`).join('')}
            </div>` : ''}

            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px;">
                <div style="font-weight:bold; color:#f39c12; margin-bottom:12px;">🏅 Thành tích (${gameState.achievements.length}/${ACHIEVEMENTS.length})</div>
                <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:10px; text-align:center;">
                    ${ACHIEVEMENTS.map(a => `
                        <div title="${a.name}: ${a.desc}" style="font-size:1.8em; filter:${gameState.achievements.includes(a.id) ? 'none' : 'grayscale(1) opacity(0.25)'}; cursor:help;">${a.emoji}</div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
        if (!gameState.achievements.includes(a.id) && a.check(gameState)) {
            gameState.achievements.push(a.id);
            showAchievementToast(a);
        }
    });
}

function showAchievementToast(achievement) {
    addLog(`🏅 Thành tích: ${achievement.emoji} ${achievement.name} — ${achievement.desc}`, "success");
    const toast = document.getElementById('achievementToast');
    if (toast) {
        toast.innerHTML = `
            <div style="font-size:2em;">${achievement.emoji}</div>
            <div style="font-size:0.75em; color:#f39c12; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Thành tích mới!</div>
            <div style="font-size:0.95em; font-weight:bold; margin-top:2px;">${achievement.name}</div>
            <div style="font-size:0.78em; color:#ccc; margin-top:2px;">${achievement.desc}</div>
        `;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(120%)';
        }, 3500);
    }
}

// ============================================================
// INSTRUCTIONS
// ============================================================
function showInstructions() {
    const modal = document.getElementById('instructionsModal');
    const content = document.getElementById('instructionsContent');

    content.innerHTML = `
        <div style="line-height:1.7; font-size:0.97em;">
            <div style="background:rgba(243,156,18,0.15); padding:14px 16px; border-radius:10px; margin-bottom:18px; border-left:4px solid #f39c12;">
                🎯 <strong>Mục tiêu:</strong> Tích lũy <strong>$${WIN_GOAL.toLocaleString()}</strong> để trở thành Tập đoàn bán lẻ số 1!
            </div>

            <h3 style="color:#3498db; margin-bottom:8px;">📦 Nhập hàng</h3>
            <p style="margin-bottom:14px;">Chọn số lượng nhập (x5/x10/x20/x50) cho từng sản phẩm. Hàng tươi sẽ <strong>hư hỏng hàng ngày</strong> — đừng nhập quá dư!</p>

            <h3 style="color:#3498db; margin-bottom:8px;">✏️ Điều chỉnh giá</h3>
            <p style="margin-bottom:14px;">Nhấn nút <strong>"✏️ Sửa giá"</strong> trên mỗi kệ. Giá cao → lãi hơn nhưng khách mua ít hơn. Cân bằng giá là chìa khoá!</p>

            <h3 style="color:#3498db; margin-bottom:8px;">🚀 Nâng cấp (ưu tiên theo thứ tự)</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
                <div style="background:rgba(255,255,255,0.07); padding:10px; border-radius:8px;">🏭 <strong>Kho lạnh</strong> — nâng sớm nhất, giảm mất hàng tươi</div>
                <div style="background:rgba(255,255,255,0.07); padding:10px; border-radius:8px;">📢 <strong>Quảng cáo</strong> — tăng lượng khách, tăng doanh thu</div>
                <div style="background:rgba(255,255,255,0.07); padding:10px; border-radius:8px;">👨‍💼 <strong>Nhân viên</strong> — thêm giao dịch mỗi ngày</div>
                <div style="background:rgba(255,255,255,0.07); padding:10px; border-radius:8px;">⭐ <strong>Chất lượng</strong> — tự động tăng giá bán</div>
            </div>

            <h3 style="color:#3498db; margin-bottom:8px;">🔓 Sản phẩm mới</h3>
            <p style="margin-bottom:14px;">Lên cấp sẽ mở khóa các sản phẩm mới có lợi nhuận cao hơn (Nước ép, Snack, Cà phê, Dầu gội...).</p>

            <div style="background:rgba(52,152,219,0.1); padding:14px; border-radius:10px; border-left:4px solid #3498db;">
                💡 <strong>Mẹo hay:</strong> Mỗi tối trước khi nhấn "Qua ngày", hãy nhập đủ hàng — khi hết hàng sẽ mất khách và mất danh tiếng!
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

// ============================================================
// GAME CONDITIONS
// ============================================================
function checkGameConditions() {
    if (gameState.gameOver || gameState.gameWon) return;

    if (gameState.money <= 0) {
        const totalStock = Object.values(gameState.inventory)
            .filter(i => i.unlocked)
            .reduce((s, i) => s + i.stock, 0);
        if (totalStock === 0 && gameState.day > 1) {
            gameState.gameOver = true;
            addLog("💸 PHÁ SẢN! Hết tiền và hết hàng. Game Over!", "error");
            setTimeout(() => showGameEndModal(false), 1500);
            disableButtons(true);
        }
    }

    if (gameState.money >= WIN_GOAL && !gameState.gameWon) {
        gameState.gameWon = true;
        addLog(`🏆 CHÚC MỪNG! Bạn đã đạt $${WIN_GOAL.toLocaleString()}! CHIẾN THẮNG! 🎉`, "success");
        setTimeout(() => showGameEndModal(true), 1000);
        disableButtons(true);
    }
}

function showGameEndModal(isWin) {
    const modal = document.getElementById('gameEndModal');
    const content = document.getElementById('gameEndContent');

    content.innerHTML = isWin ? `
        <div style="text-align:center; padding:15px;">
            <div style="font-size:4em; margin-bottom:12px;">🏆</div>
            <h2 style="color:#f39c12; font-size:1.9em; margin-bottom:12px;">CHIẾN THẮNG!</h2>
            <p style="color:#ccc; margin-bottom:8px;">Bạn đã xây dựng Tập đoàn bán lẻ thành công!</p>
            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px; margin:15px 0; display:grid; gap:8px;">
                <div>📅 Số ngày kinh doanh: <strong>${gameState.day - 1}</strong></div>
                <div>💰 Tổng doanh thu: <strong>$${gameState.totalSales.toLocaleString()}</strong></div>
                <div>🏅 Thành tích: <strong>${gameState.achievements.length}/${ACHIEVEMENTS.length}</strong></div>
                <div>😊 Danh tiếng cuối: <strong>${gameState.reputation}</strong></div>
            </div>
            <button onclick="newGame()" style="margin-top:10px; padding:14px 40px; background:linear-gradient(135deg,#f39c12,#e67e22); border:none; border-radius:12px; color:white; font-size:1.15em; cursor:pointer; font-weight:bold; width:100%;">
                🔄 Chơi ván mới
            </button>
        </div>
    ` : `
        <div style="text-align:center; padding:15px;">
            <div style="font-size:4em; margin-bottom:12px;">😢</div>
            <h2 style="color:#e74c3c; font-size:1.9em; margin-bottom:12px;">PHÁ SẢN!</h2>
            <p style="color:#ccc; margin-bottom:8px;">Siêu thị đã đóng cửa vì hết vốn...</p>
            <div style="background:rgba(255,255,255,0.07); padding:14px; border-radius:10px; margin:15px 0; display:grid; gap:8px;">
                <div>📅 Tồn tại: <strong>${gameState.day - 1} ngày</strong></div>
                <div>💰 Doanh thu đạt được: <strong>$${gameState.totalSales.toLocaleString()}</strong></div>
                <div>🏅 Thành tích: <strong>${gameState.achievements.length}/${ACHIEVEMENTS.length}</strong></div>
            </div>
            <button onclick="newGame()" style="margin-top:10px; padding:14px 40px; background:linear-gradient(135deg,#e74c3c,#c0392b); border:none; border-radius:12px; color:white; font-size:1.15em; cursor:pointer; font-weight:bold; width:100%;">
                🔄 Thử lại
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

function newGame() {
    localStorage.removeItem('supermarketSave');
    gameState = createInitialState();
    closeModal('gameEndModal');
    document.getElementById('log').innerHTML = '';
    createShelves();
    updateUI();
    disableButtons(false);
    addLog("🛒 Ván mới bắt đầu! Chúc bạn may mắn!", "success");
    addLog(`💡 Mục tiêu: kiếm $${WIN_GOAL.toLocaleString()} để chiến thắng!`);
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveGame() {
    try {
        localStorage.setItem('supermarketSave', JSON.stringify(gameState));
        addLog("💾 Game đã được lưu!", "success");
    } catch (e) {
        addLog("❌ Lỗi lưu: " + e.message, "error");
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('supermarketSave');
        if (!saved) return;
        const data = JSON.parse(saved);
        // Merge to preserve new fields added in upgrades
        const fresh = createInitialState();
        gameState = { ...fresh, ...data };

        // Ensure inventory has all products
        Object.entries(PRODUCT_TEMPLATES).forEach(([key, t]) => {
            if (!gameState.inventory[key]) {
                gameState.inventory[key] = { ...t, price: t.basePrice, stock: 0, unlocked: t.unlockLevel === 1, totalSold: 0, totalRevenue: 0 };
            }
        });
        // Ensure upgrades exist
        Object.keys(UPGRADE_DEFS).forEach(key => {
            if (!gameState.upgrades[key]) {
                gameState.upgrades[key] = { icon: UPGRADE_DEFS[key].icon, description: UPGRADE_DEFS[key].description, currentLevel: 0 };
            }
        });

        createShelves();
        updateUI();
        addLog("📂 Đã tải game đã lưu! Tiếp tục kinh doanh!", "success");
    } catch (e) {
        console.log('Load error:', e);
    }
}

// ============================================================
// UTILITIES
// ============================================================
function addLog(message, type = "") {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function clearLog() {
    const log = document.getElementById('log');
    if (log) log.innerHTML = '';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function disableButtons(disabled) {
    document.querySelectorAll('.controls button').forEach(b => {
        b.disabled = disabled;
        b.style.opacity = disabled ? '0.5' : '1';
    });
}

// ============================================================
// AUTO-SAVE & BOOT
// ============================================================
setInterval(() => {
    if (!gameState.gameOver && !gameState.gameWon) saveGame();
}, 30000);

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    loadGame();
});

window.addEventListener('error', e => {
    if (e.error) addLog(`❌ Lỗi: ${e.error.message}`, "error");
});
