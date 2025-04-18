// cart.js - カート画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js is loaded and initializing');
    
    // ローディング表示の参照
    const loadingElement = document.getElementById('cart-loading');
    
    // カートマネージャーとの連携
    if (window.cartManager) {
        // カート読み込み
        window.cartManager.loadCart();
        
        // カート表示を更新
        updateCartDisplay();

        // カート更新イベントをリッスン
        document.addEventListener('cart:updated', function() {
            updateCartDisplay();
        });
    } else {
        console.error('Cart manager is not available');
        // カートマネージャーがない場合はエラーメッセージを表示
        showLoadingError();
    }

    // プロモーションコードボタン
    const promoBtn = document.getElementById('apply-promo');
    if (promoBtn) {
        promoBtn.addEventListener('click', function() {
            const promoInput = document.getElementById('promo-code-input');
            if (promoInput && promoInput.value.trim() !== '') {
                // アラートを使わずにインラインメッセージで表示
                showPromoMessage('Promo code "' + promoInput.value + '" applied successfully.', 'success');
                // 実際の割引処理はここに実装
            } else {
                showPromoMessage('Please enter a promo code.', 'error');
            }
        });
    }
    
    // common.js がすでに商品カードのイベントを設定しているので、
    // ここでは設定しない（二重登録による二重追加を防止）
    // setupRecentlyViewedEvents()はコメントアウトまたは削除します
});

// プロモーションコードのメッセージを表示
function showPromoMessage(message, type) {
    // 既存のメッセージ要素を探す
    let messageElement = document.getElementById('promo-message');
    
    // なければ作成
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'promo-message';
        messageElement.style.marginTop = '0.5rem';
        messageElement.style.padding = '0.5rem';
        messageElement.style.borderRadius = '4px';
        messageElement.style.fontSize = '0.85rem';
        messageElement.style.textAlign = 'center';
        
        // プロモーションコード入力欄の後に追加
        const promoElement = document.querySelector('.promo-code');
        if (promoElement) {
            promoElement.appendChild(messageElement);
        }
    }
    
    // メッセージのスタイルを設定
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        messageElement.style.color = '#4caf50';
    } else {
        messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        messageElement.style.color = '#f44336';
    }
    
    // メッセージを設定して表示
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // 3秒後に消す
    setTimeout(function() {
        messageElement.style.display = 'none';
    }, 3000);
}

// ローディングエラーを表示
function showLoadingError() {
    const loadingElement = document.getElementById('cart-loading');
    if (loadingElement) {
        loadingElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>There was an error loading your cart. Please refresh the page and try again.</p>
        `;
        loadingElement.style.display = 'block';
    }
}

// カート表示の更新
function updateCartDisplay() {
    console.log('Updating cart display');
    
    // ローディング、カート商品セクション、カート空表示を取得
    const loadingElement = document.getElementById('cart-loading');
    const cartSection = document.querySelector('.cart-section');
    const cartEmptySection = document.querySelector('.cart-section-empty');
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // カート内のアイテムを取得
    const cartItems = window.cartManager.items;
    
    // ローディング表示を非表示
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // カートが空の場合
    if (!cartItems || cartItems.length === 0) {
        if (cartSection) cartSection.style.display = 'none';
        if (cartEmptySection) cartEmptySection.style.display = 'block';
        return;
    }
    
    // カートに商品がある場合
    if (cartSection) cartSection.style.display = 'block';
    if (cartEmptySection) cartEmptySection.style.display = 'none';
    
    // カート数量の表示を更新
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = itemCount;
    });
    
    // カートヘッダーの商品数表示を更新
    const cartHeaderCount = document.querySelector('.cart-header .cart-count');
    if (cartHeaderCount) {
        cartHeaderCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    }
    
    // カート内商品リストをクリア
    if (cartItemsContainer) {
        // ヘッダー部分を保持
        const cartHeader = cartItemsContainer.querySelector('.cart-header');
        cartItemsContainer.innerHTML = '';
        if (cartHeader) cartItemsContainer.appendChild(cartHeader);
        
        // 各商品をカートに追加
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // イベントリスナーを再設定
        setupCartItemEvents();
    }
    
    // 注文サマリーを更新
    updateOrderSummary(cartItems);
}

// カート内の商品要素を作成
function createCartItemElement(item) {
    // カテゴリとサブカテゴリの仮設定（実際には商品データから取得すべき）
    const categoryClass = 'game';
    const categoryName = 'Game';
    const subcategoryName = item.subcategory || 'Other';
    
    // 商品画像がない場合のプレースホルダー
    const imageContent = item.image
        ? ''
        : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bb0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;
    
    // 商品の状態（仮設定 - 実際には商品データから取得）
    const conditionClass = 'used';
    const conditionText = 'USED';
    
    // 商品属性の仮設定
    const attributes = 'Region: Japan (NTSC-J) | Language: Japanese';
    
    // 商品要素のHTML
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.setAttribute('data-product-id', item.id);
    
    cartItemElement.innerHTML = `
        <div class="item-image" ${item.image ? `style="background-image: url('${item.image}'); background-size: cover;"` : ''}>
            ${imageContent}
        </div>
        <div class="item-details">
            <h3 class="item-title">
                <a href="product-detail.html?id=${item.id}">${item.name}</a>
                <button class="remove-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </h3>
            <div class="item-meta">
                <span class="meta-tag ${categoryClass}">${categoryName}</span>
                <span class="meta-tag other">${subcategoryName}</span>
                <span class="condition-badge ${conditionClass}">${conditionText}</span>
            </div>
            <div class="item-attributes">
                ${attributes}
            </div>
            <div class="item-price-qty">
                <div class="item-price">${item.price.toFixed(2)} CAD</div>
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
        </div>
    `;
    
    return cartItemElement;
}

// カート内の商品要素にイベントリスナーを設定
function setupCartItemEvents() {
    // 数量減少ボタン
    const minusBtns = document.querySelectorAll('.quantity-btn.minus');
    minusBtns.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.productId;
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            
            if (value > 1) {
                value--;
                input.value = value;
                window.cartManager.updateQuantity(productId, value);
            }
        });
    });
    
    // 数量増加ボタン
    const plusBtns = document.querySelectorAll('.quantity-btn.plus');
    plusBtns.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.productId;
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            
            if (value < 10) {
                value++;
                input.value = value;
                window.cartManager.updateQuantity(productId, value);
            }
        });
    });
    
    // 数量入力フィールドの変更
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.productId;
            let value = parseInt(this.value);
            
            if (isNaN(value) || value < 1) {
                value = 1;
                this.value = 1;
            } else if (value > 10) {
                value = 10;
                this.value = 10;
            }
            
            window.cartManager.updateQuantity(productId, value);
        });
    });
    
    // 商品削除ボタン
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = cartItem.dataset.productId;
            
            // アニメーションとともに削除
            cartItem.style.opacity = '0';
            cartItem.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.cartManager.removeItem(productId);
            }, 300);
        });
    });
}

// setupRecentlyViewedEvents関数は削除または非アクティブ化
// この関数は不要になりました。common.jsの同様の機能が使用されます
/* 
function setupRecentlyViewedEvents() {
    // この関数はcommon.jsの重複を避けるため削除
}
*/

// 注文サマリーを更新
function updateOrderSummary(cartItems) {
    if (!cartItems || cartItems.length === 0) return;
    
    // 小計を計算
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 税金（小計の10%と仮定）
    const tax = subtotal * 0.1;
    
    // 合計
    const total = subtotal + tax;
    
    // 小計の表示を更新
    const subtotalElement = document.querySelector('.summary-row:nth-child(1) .summary-value');
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toFixed(2)} CAD`;
    }
    
    // 税金の表示を更新
    const taxElement = document.querySelector('.summary-row:nth-child(3) .summary-value');
    if (taxElement) {
        taxElement.textContent = `${tax.toFixed(2)} CAD`;
    }
    
    // 合計の表示を更新
    const totalElement = document.querySelector('.summary-row.total .summary-value');
    if (totalElement) {
        totalElement.textContent = `${total.toFixed(2)} CAD`;
    }
    
    // 小計の商品数表示を更新
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const subtotalLabel = document.querySelector('.summary-row:nth-child(1) .summary-label');
    if (subtotalLabel) {
        subtotalLabel.textContent = `Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`;
    }
}
