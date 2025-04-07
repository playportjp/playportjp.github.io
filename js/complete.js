/**
 * PlayPortJP - E-commerce functionality
 * 
 * 主な機能:
 * - 商品データの管理
 * - カート機能 (追加、削除、数量変更)
 * - 検索機能
 * - ページ間連携
 * - 商品詳細表示
 */

// =====================
// 初期化処理
// =====================

/**
 * DOMが読み込まれた後に実行する初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    // カートUIを更新
    updateCartUI();
    
    // 検索フォームのイベントリスナー設定
    initSearchForm();
    
    // 現在のページに応じた処理を実行
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            renderFeaturedProducts();
            break;
        case 'product-detail':
            renderProductDetail();
            break;
        case 'cart':
            renderCart();
            break;
        case 'search-results':
            renderSearchResults();
            break;
    }
});

/**
 * 現在のページを取得
 * @returns {string} - ページ識別子
 */
function getCurrentPage() {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        return 'index';
    } else if (path.includes('product-detail.html')) {
        return 'product-detail';
    } else if (path.includes('cart.html')) {
        return 'cart';
    } else if (path.includes('search-results.html')) {
        return 'search-results';
    }
    
    return 'unknown';
}

/**
 * 検索フォームの初期化
 */
function initSearchForm() {
    const searchForms = document.querySelectorAll('form[action="search-results.html"]');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const searchInput = form.querySelector('input[type="search"]');
            if (!searchInput || !searchInput.value.trim()) return;
            
            const searchQuery = encodeURIComponent(searchInput.value.trim());
            window.location.href = `search-results.html?q=${searchQuery}`;
        });
    });
}

// =====================
// 商品データ (サンプル)
// =====================
// 後にCSVやAPIから取得する実装に置き換え可能
const products = [
    {
        id: 1,
        name: "Final Fantasy VII Remake - PS4 Japanese Edition",
        category: "game",
        subcategory: "ps4",
        tags: ["RPG", "Square Enix"],
        price: 64.99,
        condition: "used", // new, used
        conditionDetail: "Excellent", // 状態の詳細説明
        region: "Japan (NTSC-J)",
        language: "Japanese (Some English UI options)",
        stockStatus: "in-stock", // in-stock, low-stock, out-of-stock
        stockCount: 5,
        description: "Japanese version of Final Fantasy VII Remake. Complete with original box and all inserts. Disc is in pristine condition with no scratches.",
        imageType: "game", // 画像の種類 (SVGアイコン選択用)
        imagePlaceholder: "PlayStation Game", // プレースホルダーテキスト
        rating: 4.5,
        reviewCount: 48
    },
    {
        id: 2,
        name: "Final Fantasy X/X-2 HD Remaster - Nintendo Switch",
        category: "game",
        subcategory: "switch",
        tags: ["RPG", "Square Enix"],
        price: 49.99,
        condition: "used",
        conditionDetail: "Very Good",
        region: "Japan",
        language: "Japanese",
        stockStatus: "in-stock",
        stockCount: 3,
        description: "Japanese version of Final Fantasy X/X-2 HD Remaster for Nintendo Switch. Box has minor shelf wear but game cartridge is like new.",
        imageType: "game",
        imagePlaceholder: "Nintendo Switch Game",
        rating: 4.2,
        reviewCount: 12
    },
    {
        id: 3,
        name: "Final Fantasy XIV: Endwalker Expansion - PS5",
        category: "game",
        subcategory: "ps5",
        tags: ["MMORPG", "Square Enix"],
        price: 39.99,
        condition: "new",
        conditionDetail: "New",
        region: "Japan",
        language: "Japanese",
        stockStatus: "in-stock",
        stockCount: 10,
        description: "Japanese version of Final Fantasy XIV: Endwalker expansion for PS5. Brand new, sealed in original packaging.",
        imageType: "game",
        imagePlaceholder: "PlayStation 5 Game",
        rating: 4.8,
        reviewCount: 36
    },
    {
        id: 4,
        name: "Cloud Strife Figurine - Play Arts Kai",
        category: "collectible",
        subcategory: "figure",
        tags: ["Square Enix", "Figure"],
        price: 129.99,
        condition: "used",
        conditionDetail: "Very Good",
        region: "Japan",
        language: "N/A",
        stockStatus: "in-stock",
        stockCount: 2,
        description: "Play Arts Kai Cloud Strife action figure from Final Fantasy VII. Figure is in very good condition with minor paint wear. Comes with original accessories and stand.",
        imageType: "collectible",
        imagePlaceholder: "Collectible Figure",
        rating: 4.6,
        reviewCount: 23
    },
    {
        id: 5,
        name: "Final Fantasy VIII Original Soundtrack",
        category: "music",
        subcategory: "cd",
        tags: ["Soundtrack", "Square Enix"],
        price: 89.99,
        condition: "used",
        conditionDetail: "Good",
        region: "Japan",
        language: "Japanese",
        stockStatus: "in-stock",
        stockCount: 1,
        description: "Original 4-CD soundtrack for Final Fantasy VIII, composed by Nobuo Uematsu. Limited edition with artbook. Box has some corner wear but CDs are in good condition with minimal scratches.",
        imageType: "music",
        imagePlaceholder: "Music CD",
        rating: 4.9,
        reviewCount: 15
    },
    {
        id: 6,
        name: "Final Fantasy IX - Original PS1 (2000)",
        category: "game",
        subcategory: "ps1",
        tags: ["RPG", "Square Enix", "Rare"],
        price: 75.99,
        condition: "used",
        conditionDetail: "Good",
        region: "Japan",
        language: "Japanese",
        stockStatus: "in-stock",
        stockCount: 1,
        description: "Original PlayStation release of Final Fantasy IX. Japanese version with manual. Discs show some light scratches but tested and working perfectly. Case has light wear consistent with age.",
        imageType: "game",
        imagePlaceholder: "Vintage PS1 Game",
        rating: 4.7,
        reviewCount: 42
    }
];

// =====================
// ユーティリティ関数
// =====================

/**
 * 商品IDから商品データを取得
 * @param {number} id - 商品ID
 * @returns {object|null} - 商品データまたはnull(見つからない場合)
 */
function getProductById(id) {
    return products.find(product => product.id === parseInt(id)) || null;
}

/**
 * URLからクエリパラメータを取得
 * @param {string} param - 取得したいパラメータ名
 * @returns {string|null} - パラメータの値またはnull
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * 金額を通貨形式にフォーマット
 * @param {number} amount - 金額
 * @returns {string} - フォーマットされた金額文字列
 */
function formatCurrency(amount) {
    return amount.toFixed(2) + " CAD";
}

// =====================
// カート関連の機能
// =====================

/**
 * ローカルストレージからカートを取得
 * @returns {Array} - カートアイテムの配列
 */
function getCart() {
    const cart = localStorage.getItem('playport_cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * カートをローカルストレージに保存
 * @param {Array} cart - カートアイテムの配列
 */
function saveCart(cart) {
    localStorage.setItem('playport_cart', JSON.stringify(cart));
    updateCartUI();
}

/**
 * カートに商品を追加
 * @param {number} productId - 追加する商品ID
 * @param {number} quantity - 数量 (デフォルト: 1)
 */
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // 既存アイテムの数量を更新
        existingItem.quantity += quantity;
    } else {
        // 新規アイテムを追加
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            subcategory: product.subcategory,
            condition: product.condition,
            conditionDetail: product.conditionDetail,
            imageType: product.imageType,
            imagePlaceholder: product.imagePlaceholder,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification('商品をカートに追加しました');
}

/**
 * カートから商品を削除
 * @param {number} productId - 削除する商品ID
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

/**
 * カート内の商品数量を更新
 * @param {number} productId - 商品ID
 * @param {number} quantity - 新しい数量
 */
function updateCartQuantity(productId, quantity) {
    if (quantity < 1) return;
    
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
}

/**
 * カートの合計金額を計算
 * @returns {object} - 小計、税金、合計を含むオブジェクト
 */
function calculateCartTotals() {
    const cart = getCart();
    
    // 小計
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 税金 (10%と仮定)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    
    // 送料 (100CAD以上は送料無料と仮定)
    const shipping = subtotal >= 100 ? 0 : 10;
    
    // 合計
    const total = subtotal + tax + shipping;
    
    return {
        subtotal,
        tax,
        shipping,
        total,
        itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
}

/**
 * カートUIを更新
 */
function updateCartUI() {
    const cart = getCart();
    const { itemCount } = calculateCartTotals();
    
    // カートアイコンの数量表示を更新
    const cartCountElements = document.querySelectorAll('.cart-count');
    if (cartCountElements) {
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            element.style.display = itemCount > 0 ? 'block' : 'none';
        });
    }
}

/**
 * カートページのUIをレンダリング
 */
function renderCart() {
    const cartContainer = document.querySelector('.cart-section');
    const emptyCartContainer = document.querySelector('.cart-section-empty');
    
    if (!cartContainer || !emptyCartContainer) return;
    
    const cart = getCart();
    
    // カートが空の場合
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCartContainer.style.display = 'block';
        return;
    }
    
    // カートに商品がある場合
    cartContainer.style.display = 'block';
    emptyCartContainer.style.display = 'none';
    
    // カート内の商品リストを取得
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    // ヘッダー部分を保持
    const cartHeader = cartItemsContainer.querySelector('.cart-header');
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(cartHeader);
    
    // カート内の商品数を更新
    const cartCountElement = cartHeader.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = `${cart.length} item${cart.length > 1 ? 's' : ''}`;
    }
    
    // 各商品をレンダリング
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        // 画像アイコンのSVGを選択
        let iconSvg = '';
        switch(item.imageType) {
            case 'game':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bb0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.01.15v6.52c0 1.66 1.34 3 3 3h14.64c1.66 0 3-1.34 3-3v-6.52c0-.049-.004-.098-.01-.15A4 4 0 0017.32 5z"></path></svg>';
                break;
            case 'collectible':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>';
                break;
            case 'music':
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                break;
            default:
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0277bd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polygon points="12 8 5 13 5 21 19 21 19 13"></polygon></svg>';
        }
        
        // カテゴリタグを生成
        let categoryTag = '';
        switch(item.category) {
            case 'game':
                categoryTag = '<span class="meta-tag game">Game</span>';
                break;
            case 'collectible':
                categoryTag = '<span class="meta-tag collectible">Collectible</span>';
                break;
            case 'music':
                categoryTag = '<span class="meta-tag music">Music</span>';
                break;
            case 'book':
                categoryTag = '<span class="meta-tag book">Book</span>';
                break;
            default:
                categoryTag = '<span class="meta-tag other">Other</span>';
        }
        
        // サブカテゴリタグを生成
        const subcategoryTag = item.subcategory 
            ? `<span class="meta-tag other">${item.subcategory}</span>` 
            : '';
        
        // 商品状態バッジを生成
        const conditionBadge = item.condition === 'new'
            ? '<span class="condition-badge new">NEW</span>'
            : '<span class="condition-badge used">USED</span>';
        
        cartItem.innerHTML = `
            <div class="item-image">
                ${iconSvg}
            </div>
            <div class="item-details">
                <h3 class="item-title">
                    <a href="product-detail.html?id=${item.id}">${item.name}</a>
                    <button class="remove-item" data-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </h3>
                <div class="item-meta">
                    ${categoryTag}
                    ${subcategoryTag}
                    ${conditionBadge}
                </div>
                <div class="item-attributes">
                    Condition: ${item.conditionDetail}
                </div>
                <div class="item-price-qty">
                    <div class="item-price">${formatCurrency(item.price)}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // カートの合計金額を計算して表示
    const { subtotal, tax, shipping, total, itemCount } = calculateCartTotals();
    
    const summarySubtotalElement = document.querySelector('.summary-row:nth-child(1) .summary-value');
    const summaryShippingElement = document.querySelector('.summary-row:nth-child(2) .summary-value');
    const summaryTaxElement = document.querySelector('.summary-row:nth-child(3) .summary-value');
    const summaryTotalElement = document.querySelector('.summary-row.total .summary-value');
    
    if (summarySubtotalElement) {
        summarySubtotalElement.textContent = formatCurrency(subtotal);
    }
    
    if (summaryShippingElement) {
        summaryShippingElement.textContent = shipping > 0 
            ? formatCurrency(shipping) 
            : 'Free';
    }
    
    if (summaryTaxElement) {
        summaryTaxElement.textContent = formatCurrency(tax);
    }
    
    if (summaryTotalElement) {
        summaryTotalElement.textContent = formatCurrency(total);
    }
    
    // 削除ボタンにイベントリスナーを追加
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
            renderCart();
        });
    });
    
    // 数量調整ボタンにイベントリスナーを追加
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                updateCartQuantity(productId, item.quantity - 1);
                renderCart();
            }
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity < 10) {
                updateCartQuantity(productId, item.quantity + 1);
                renderCart();
            }
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = parseInt(input.getAttribute('data-id'));
            const newQuantity = parseInt(input.value);
            if (newQuantity >= 1 && newQuantity <= 10) {
                updateCartQuantity(productId, newQuantity);
            } else {
                // 不正な値の場合は1に設定
                input.value = input.value < 1 ? 1 : 10;
                updateCartQuantity(productId, parseInt(input.value));
            }
            renderCart();
        });
    });
}

// =====================
// 通知機能
// =====================

/**
 * 通知メッセージを表示
 * @param {string} message - 表示するメッセージ
 * @param {string} type - 通知タイプ ('success', 'error', 'info')
 * @param {number} duration - 表示時間(ミリ秒) デフォルト3秒
 */
function showNotification(message, type = 'success', duration = 3000) {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.notification-container');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知コンテナを作成
    const notification = document.createElement('div');
    notification.className = 'notification-container';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? 'rgba(66, 190, 66, 0.9)' : 
                                          type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 
                                          'rgba(23, 162, 184, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    notification.style.opacity = '0';
    
    // メッセージを設定
    notification.textContent = message;
    
    // ドキュメントに追加
    document.body.appendChild(notification);
    
    // フェードイン
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // 指定時間後にフェードアウト・削除
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// =====================
// 商品検索機能
// =====================

/**
 * 商品を検索
 * @param {string} query - 検索クエリ
 * @returns {Array} - 検索結果の商品配列
 */
function searchProducts(query) {
    if (!query) return [];
    
    query = query.toLowerCase();
    
    return products.filter(product => {
        // 商品名で検索
        if (product.name.toLowerCase().includes(query)) return true;
        
        // 説明文で検索
        if (product.description && product.description.toLowerCase().includes(query)) return true;
        
        // カテゴリで検索
        if (product.category && product.category.toLowerCase().includes(query)) return true;
        
        // サブカテゴリで検索
        if (product.subcategory && product.subcategory.toLowerCase().includes(query)) return true;
        
        // タグで検索
        if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) return true;
        
        return false;
    });
}

/**
 * 検索結果ページをレンダリング
 */
function renderSearchResults() {
    const searchQuery = getQueryParam('q');
    if (!searchQuery) return;
    
    // 検索クエリを検索ボックスに表示
    const searchInput = document.querySelector('.search-container input[type="search"]');
    if (searchInput) {
        searchInput.value = searchQuery;
    }
    
    // 検索結果情報を更新
    const searchTitleElement = document.querySelector('.search-info h1');
    const searchCountElement = document.querySelector('.search-info p');
    
    // 検索を実行
    const results = searchProducts(searchQuery);
    
    if (searchTitleElement) {
        searchTitleElement.textContent = `Search results for "${searchQuery}"`;
    }
    
    if (searchCountElement) {
        if (results.length === 0) {
            searchCountElement.textContent = `No results found`;
        } else {
            searchCountElement.textContent = `Showing 1-${results.length} of ${results.length} results`;
        }
    }
    
    // 検索結果リストを更新
    const resultsGrid = document.querySelector('.results-grid');
    if (!resultsGrid) return;
    
    // リストをクリア
    resultsGrid.innerHTML = '';
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.gridColumn = '1 / -1';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '2rem';
        noResults.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3 style="margin-bottom: 0.5rem;">No results found</h3>
            <p style="color: var(--text-secondary);">Try different keywords or browse our categories.</p>
        `;
        resultsGrid.appendChild(noResults);
        return;
    }
    
    // 結果を表示
    results.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // 画像タイプに応じたSVGを選択
        let iconSvg = '';
        let iconColor = '';
        
        switch(product.imageType) {
            case 'game':
                iconSvg = '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.01.15v6.52c0 1.66 1.34 3 3 3h14.64c1.66 0 3-1.34 3-3v-6.52c0-.049-.004-.098-.01-.15A4 4 0 0017.32 5z"></path>';
                iconColor = '#bb0000';
                break;
            case 'collectible':
                iconSvg = '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path>';
                iconColor = '#e65100';
                break;
            case 'music':
                iconSvg = '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>';
                iconColor = '#9c27b0';
                break;
            case 'book':
                iconSvg = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>';
                iconColor = '#2e7d32';
                break;
            default:
                iconSvg = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polygon points="12 8 5 13 5 21 19 21 19 13"></polygon>';
                iconColor = '#0277bd';
        }
        
        // カテゴリタグを生成
        let categoryTag = '';
        switch(product.category) {
            case 'game':
                categoryTag = '<span class="meta-tag game">Game</span>';
                break;
            case 'collectible':
                categoryTag = '<span class="meta-tag collectible">Collectible</span>';
                break;
            case 'music':
                categoryTag = '<span class="meta-tag music">Music</span>';
                break;
            case 'book':
                categoryTag = '<span class="meta-tag book">Book</span>';
                break;
            default:
                categoryTag = '<span class="meta-tag other">Other</span>';
        }
        
        // サブカテゴリタグを生成
        const subcategoryTag = product.subcategory 
            ? `<span class="meta-tag other">${product.subcategory}</span>` 
            : '';
        
        // タグを生成
        let tagHtml = '';
        if (product.tags && product.tags.length > 0) {
            // 最初の2つのタグのみ表示
            product.tags.slice(0, 2).forEach(tag => {
                tagHtml += `<span class="meta-tag other">${tag}</span>`;
            });
        }
        
        // 商品状態バッジを生成
        const conditionBadge = product.condition === 'new'
            ? '<span class="condition-badge new">NEW</span>'
            : '<span class="condition-badge used">USED</span>';
        
        // 在庫状況を生成
        let stockStatusHtml = '';
        switch(product.stockStatus) {
            case 'in-stock':
                stockStatusHtml = '<span class="stock-status in-stock">In Stock</span>';
                break;
            case 'low-stock':
                stockStatusHtml = '<span class="stock-status low-stock">Low Stock</span>';
                break;
            case 'out-of-stock':
                stockStatusHtml = '<span class="stock-status out-of-stock">Out of Stock</span>';
                break;
        }
        
        productCard.innerHTML = `
            <div class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));">
                    ${iconSvg}
                </svg>
                <div>${product.imagePlaceholder}</div>
                <a href="#" class="search-image-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Google
                </a>
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <div class="product-meta">
                    ${categoryTag}
                    ${subcategoryTag}
                    ${tagHtml}
                </div>
                <div class="product-condition">
                    ${conditionBadge}
                    ${stockStatusHtml}
                </div>
                <div class="shipping-time">Ships within 1-2 business days</div>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <div class="product-actions">
                    <a href="#" class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</a>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">Details</a>
                </div>
            </div>
        `;
        
        resultsGrid.appendChild(productCard);
    });
    
    // 「カートに追加」ボタンにイベントリスナーを追加
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// =====================
// 商品一覧関連
// =====================

/**
 * トップページの商品一覧をレンダリング
 */
function renderFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // 表示する商品を選択 (実装例: すべての商品を表示)
    const featuredProducts = products.slice(0, 6);  // 最大6個まで表示
    
    // 商品カードを生成
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // 商品状態のテキスト
        let conditionText = product.condition === 'new' ? 'New' : product.conditionDetail;
        
        productCard.innerHTML = `
            <div class="product-image"></div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-condition">${conditionText}</p>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // 「カートに追加」ボタンにイベントリスナーを追加
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// =====================
// 商品詳細ページ関連
// =====================

/**
 * 商品詳細ページを表示
 */
function renderProductDetail() {
    // URLからIDを取得
    const productId = parseInt(getQueryParam('id'));
    if (!productId) return;
    
    // 商品データを取得
    const product = getProductById(productId);
    if (!product) return;
    
    // パンくずリストの商品名を更新
    const breadcrumbProductName = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = product.name;
    }
    
    // 商品タイトルを更新
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // 商品メタタグを更新
    const productMeta = document.querySelector('.product-meta');
    if (productMeta) {
        let metaHtml = '';
        
        // カテゴリタグ
        switch(product.category) {
            case 'game':
                metaHtml += '<span class="meta-tag game">Game</span>';
                break;
            case 'collectible':
                metaHtml += '<span class="meta-tag collectible">Collectible</span>';
                break;
            case 'music':
                metaHtml += '<span class="meta-tag music">Music</span>';
                break;
            case 'book':
                metaHtml += '<span class="meta-tag book">Book</span>';
                break;
        }
        
        // サブカテゴリとタグを追加
        if (product.subcategory) {
            metaHtml += `<span class="meta-tag other">${product.subcategory}</span>`;
        }
        
        if (product.tags && product.tags.length > 0) {
            product.tags.forEach(tag => {
                metaHtml += `<span class="meta-tag other">${tag}</span>`;
            });
        }
        
        productMeta.innerHTML = metaHtml;
    }
    
    // レビュー評価を更新
    const ratingStars = document.querySelector('.rating-stars');
    const ratingCount = document.querySelector('.rating-count');
    
    if (ratingStars && product.rating) {
        // 星評価を表示
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        
        ratingStars.innerHTML = '';
        
        // 全星
        for (let i = 0; i < fullStars; i++) {
            ratingStars.innerHTML += `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
        }
        
        // 半星
        if (hasHalfStar) {
            ratingStars.innerHTML += `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <defs>
                        <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" style="stop-color:currentColor;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:transparent;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfFill)" stroke="currentColor" />
                </svg>
            `;
        }
        
        // 空星
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            ratingStars.innerHTML += `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `;
        }
    }
    
    if (ratingCount && product.reviewCount) {
        ratingCount.textContent = `${product.reviewCount} reviews`;
    }
    
    // 価格を更新
    const priceElement = document.querySelector('.product-price');
    if (priceElement) {
        priceElement.textContent = formatCurrency(product.price);
    }
    
    // 商品状態を更新
    const conditionValue = document.querySelector('.condition-row:first-child .condition-value');
    if (conditionValue) {
        const conditionBadge = product.condition === 'new'
            ? '<span class="condition-badge new">NEW</span>'
            : '<span class="condition-badge used">USED</span>';
        
        conditionValue.innerHTML = `${conditionBadge} - ${product.conditionDetail}`;
    }
    
    // 在庫状況を更新
    const stockStatusElement = document.querySelector('.condition-row:nth-child(2) .condition-value .stock-status');
    if (stockStatusElement) {
        let stockStatusText = '';
        let stockStatusClass = '';
        
        switch(product.stockStatus) {
            case 'in-stock':
                stockStatusText = 'In Stock';
                stockStatusClass = 'in-stock';
                break;
            case 'low-stock':
                stockStatusText = 'Low Stock';
                stockStatusClass = 'low-stock';
                break;
            case 'out-of-stock':
                stockStatusText = 'Out of Stock';
                stockStatusClass = 'out-of-stock';
                break;
        }
        
        stockStatusElement.textContent = stockStatusText;
        stockStatusElement.className = `stock-status ${stockStatusClass}`;
    }
    
    // 地域を更新
    const regionElement = document.querySelector('.condition-row:nth-child(3) .condition-value');
    if (regionElement && product.region) {
        regionElement.textContent = product.region;
    }
    
    // 言語を更新
    const languageElement = document.querySelector('.condition-row:nth-child(4) .condition-value');
    if (languageElement && product.language) {
        languageElement.textContent = product.language;
    }
    
    // 商品説明を更新
    const descriptionContent = document.querySelector('.description-content');
    if (descriptionContent && product.description) {
        // 改行で分割して段落に変換
        const paragraphs = product.description.split('\n');
        descriptionContent.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    
    // 数量調整UIのイベントリスナー設定
    initQuantityControls();
    
    // カートに追加ボタンのイベントリスナー設定
    const addToCartBtn = document.querySelector('.btn-primary');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantityInput = document.querySelector('.quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            addToCart(product.id, quantity);
        });
    }
}

/**
 * 数量調整UIの初期化
 */
function initQuantityControls() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (!minusBtn || !plusBtn || !quantityInput) return;
    
    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < 10) {  // 最大10個まで
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 10) {
            quantityInput.value = 10;
        }
    });
