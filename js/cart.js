// cart.js - カート画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
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
    }

    // プロモーションコードボタン
    const promoBtn = document.getElementById('apply-promo');
    if (promoBtn) {
        promoBtn.addEventListener('click', function() {
            const promoInput = document.getElementById('promo-code-input');
            if (promoInput && promoInput.value.trim() !== '') {
                alert('プロモーションコード「' + promoInput.value + '」が適用されました。');
                // 実際の割引処理はここに実装
            } else {
                alert('プロモーションコードを入力してください。');
            }
        });
    }
});

// カート表示の更新
function updateCartDisplay() {
    // カート商品セクションとカート空表示を取得
    const cartSection = document.querySelector('.cart-section');
    const cartEmptySection = document.querySelector('.cart-section-empty');
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // カート内のアイテムを取得
    const cartItems = window.cartManager.items;
    
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
