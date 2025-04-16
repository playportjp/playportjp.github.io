// common.js - 共通で使用される関数やオブジェクト

// カート管理機能
window.cartManager = {
    items: [],
    
    // カートにアイテムを追加
    addItem: function(productId, name, price, image, quantity = 1) {
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                image: image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        console.log(`Added to cart: ${name}`);
        
        // カート更新イベントを発火
        document.dispatchEvent(new CustomEvent('cart:updated'));
    },
    
    // カートを保存
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // カートを読み込み
    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
                console.log('Cart loaded successfully:', this.items);
            } catch (e) {
                console.error('Error parsing cart data:', e);
                this.items = [];
                localStorage.removeItem('cart');
            }
        } else {
            console.log('No cart data found in localStorage');
            this.items = [];
        }
    },
    
    // カート数を更新
    updateCartCount: function() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
            cartCountElement.textContent = itemCount;
        }
    },
    
    // カート内のアイテムの数量を更新
    updateQuantity: function(productId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity = quantity;
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
        }
    },
    
    // カートからアイテムを削除
    removeItem: function(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
        }
    },
    
    // カートの合計金額を計算
    getCartTotal: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // カートの税金を計算（10%と仮定）
    getCartTax: function() {
        return this.getCartTotal() * 0.1;
    },
    
    // カートの商品数を取得
    getItemCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    // カートをクリア
    clearCart: function() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        
        // カート更新イベントを発火
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }
};

// DOM読み込み完了時にカート情報を読み込む
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart manager');
    
    // カート情報を読み込み、カウントを更新
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
        console.log('Cart initialized with items:', window.cartManager.items);
    } else {
        console.error('Cart manager not available');
    }
    
    // チェックアウトページ用の処理
    initCheckoutPage();
});

// チェックアウトページの初期化
function initCheckoutPage() {
    // checkout-items要素が存在する場合のみ実行
    if (document.getElementById('checkout-items')) {
        console.log('Checkout page detected, displaying items');
        // カートからアイテムを取得して表示
        displayCheckoutItems();
    }
    
    // 注文フォームの送信処理
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
}

// チェックアウトページのアイテム表示
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;
    
    // カートが未ロードの場合、ロードする
    if (!window.cartManager.items || window.cartManager.items.length === 0) {
        window.cartManager.loadCart();
    }
    
    const cartItems = window.cartManager.items;
    console.log('Displaying checkout items:', cartItems);
    
    // カートが空の場合の処理
    if (!cartItems || cartItems.length === 0) {
        console.warn('Cart is empty, redirecting to cart page');
        // リダイレクトする前に少し遅延させる
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 100);
        return;
    }
    
    let html = '';
    
    // 各商品をHTMLに変換
    cartItems.forEach(item => {
        html += `
            <div class="checkout-item" data-product-id="${item.id}">
                <div class="checkout-item-image" ${item.image ? `style="background-image: url('${item.image}'); background-size: cover;"` : ''}>
                    ${!item.image ? `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    ` : ''}
                </div>
                <div class="checkout-item-details">
                    <div class="checkout-item-title">${item.name}</div>
                    <div class="checkout-item-price">
                        ${item.price.toFixed(2)} CAD
                        <span class="checkout-item-quantity">x${item.quantity}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    checkoutItemsContainer.innerHTML = html;
    
    // 合計金額を更新
    updateOrderTotals();
}

// 注文合計の更新
function updateOrderTotals() {
    // DOMに要素が存在するか確認
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !taxElement || !totalElement) return;
    
    // カートマネージャーからアイテムを取得
    const cartItems = window.cartManager.items;
    if (!cartItems || cartItems.length === 0) return;
    
    // 小計を計算
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 税金（小計の10%と仮定）
    const tax = subtotal * 0.1;
    
    // 送料（free shipping と仮定）
    const shipping = 0;
    
    // 合計
    const total = subtotal + tax + shipping;
    
    // 表示を更新
    subtotalElement.textContent = `${subtotal.toFixed(2)} CAD`;
    taxElement.textContent = `${tax.toFixed(2)} CAD`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : `${shipping.toFixed(2)} CAD`;
    totalElement.textContent = `${total.toFixed(2)} CAD`;
}

// 注文フォームの送信ハンドラ（基本的な実装）
function handleOrderSubmit(event) {
    if (event) event.preventDefault();
    console.log('Order form submitted');
    
    // 実際の実装はcheckout.jsにあります
    if (typeof validateForm === 'function' && !validateForm()) {
        console.log('Form validation failed');
        return false;
    }
    
    alert('Processing your order...');
    return false;
}
