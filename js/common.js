// common.js - 共通で使用される関数やオブジェクト

// カート管理機能
window.cartManager = {
    items: [],
    
    // カートにアイテムを追加
    addItem: function (productId, name, price, image, quantity = 1) {
        console.log(`Adding to cart: ${name}, ID: ${productId}, Price: ${price}, Quantity: ${quantity}`);

        // 既存のアイテムがあるか確認
        const existingItem = this.items.find(item => item.id === productId);

        // 画像の有無を確認（割引適用済みの価格が渡されることを前提）
        const hasImage = image && image !== '';

        if (existingItem) {
            // 既存アイテムの数量を増やす
            existingItem.quantity += quantity;
            console.log(`Updated quantity for ${name} to ${existingItem.quantity}`);
        } else {
            // 新しいアイテムを追加
            this.items.push({
                id: productId,
                name: name,
                price: parseFloat(price), // 確実に数値として扱う
                image: image,
                hasImage: hasImage, // 画像の有無を保存
                quantity: quantity
            });
            console.log(`Added new item: ${name}`);
        }

        // カートを保存
        this.saveCart();

        // カート数量を更新
        this.updateCartCount();

        // カート更新イベントを発火
        document.dispatchEvent(new CustomEvent('cart:updated'));

        return true; // 成功を示す
    },
    
    // カートを保存
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        console.log('Cart saved to localStorage:', this.items);
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
            console.log(`Cart count updated: ${itemCount} items`);
            
            // カート数を同期（モバイル用とデスクトップ用）
            syncCartCounts();
        }
    },
    
    // カート内のアイテムの数量を更新
    updateQuantity: function(productId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity = parseInt(quantity);
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
            console.log(`Updated quantity for product ${productId} to ${quantity}`);
        }
    },
    
    // カートからアイテムを削除
    removeItem: function(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
            console.log(`Removed product ${productId} from cart`);
            
            return removedItem; // 削除したアイテムを返す
        }
        
        return null; // アイテムが見つからなかった
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
        console.log('Cart cleared');
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
        
        // 追加：起動時に明示的にカート数を同期
        syncCartCounts();
        
        // 商品カードのイベントリスナーを設定
        setupProductCardEvents();
    } else {
        console.error('Cart manager not available');
    }
    
    // チェックアウトページ用の処理
    initCheckoutPage();
    
    // ヘッダーのモバイルナビゲーション機能を初期化
    initMobileHeader();
    
    // 現在のページに基づいてナビゲーションアイテムの表示制御
    controlNavItems();
});

// 商品カードのイベントリスナーを設定
function setupProductCardEvents() {
    // 全ページの「Add to Cart」ボタンに対してイベントリスナーを設定
    const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart');
    
    addToCartButtons.forEach(button => {
        // 既存のイベントリスナーを削除（重複防止）
        button.removeEventListener('click', handleAddToCart);
        // 新しいイベントリスナーを追加
        button.addEventListener('click', handleAddToCart);
    });
    
    console.log(`Set up event listeners for ${addToCartButtons.length} product cards`);
}

// 「Add to Cart」ボタンのクリックハンドラ
function handleAddToCart(event) {
    // イベントの伝播を停止
    event.preventDefault();
    event.stopPropagation();
    
    // 商品カード要素を取得
    const productCard = this.closest('.product-card');
    if (!productCard) {
        console.error('Product card not found');
        return;
    }
    
    // 商品情報を取得
    const productId = productCard.dataset.productId;
    const productName = productCard.dataset.productName || productCard.querySelector('h3')?.textContent || 'Unknown Product';
    const productPrice = parseFloat(productCard.dataset.productPrice) || parseFloat(productCard.querySelector('.product-price')?.textContent) || 0;
    const productImage = productCard.dataset.productImage || '';
    
    console.log('Add to cart clicked:', {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
    });
    
    // カートに追加
    if (window.cartManager && productId) {
        const success = window.cartManager.addItem(productId, productName, productPrice, productImage);
        
        if (success) {
            // 視覚的なフィードバックを表示
            showAddedToCartFeedback(productCard);
        }
    } else {
        console.error('Cart manager not available or product ID missing');
    }
}

// カートに追加された時の視覚的フィードバック
function showAddedToCartFeedback(productCard) {
    // 既存のフィードバック要素を削除
    const existingFeedback = document.querySelector('.cart-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // フィードバック要素を作成
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
        <div class="cart-feedback-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="16 12 12 8 8 12"></polyline>
                <line x1="12" y1="16" x2="12" y2="8"></line>
            </svg>
            <span>Added to cart</span>
        </div>
    `;
    
    // スタイルを設定
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    feedback.style.color = 'white';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '4px';
    feedback.style.zIndex = '1000';
    feedback.style.display = 'flex';
    feedback.style.alignItems = 'center';
    feedback.style.justifyContent = 'center';
    feedback.style.animation = 'fadeInOut 2s forwards';
    
    // アニメーションを追加
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
        .cart-feedback-content {
            display: flex;
            align-items: center;
        }
        .cart-feedback-content svg {
            margin-right: 8px;
        }
    `;
    
    // ドキュメントに追加
    document.head.appendChild(style);
    document.body.appendChild(feedback);
    
    // 自動的に削除
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// チェックアウトページの初期化
function initCheckoutPage() {
    // checkout-items要素が存在する場合のみ実行
    if (document.getElementById('checkout-items')) {
        console.log('Checkout page detected, displaying items');
        // カートからアイテムを取得して表示
        displayCheckoutItems();
    }
    
    // checkout.jsがすでにフォーム送信処理を行っている場合は、common.jsでは処理をスキップします
    if (!window.checkoutJsLoaded) {
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', handleOrderSubmit);
        }
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
    // カートマネージャーからアイテムを取得
    const cartItems = window.cartManager.items;
    if (!cartItems || cartItems.length === 0) return;

    // 合計金額を計算
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    console.log("Total calculated in updateOrderTotals:", total); // デバッグ用

    // 注文サマリーを更新
    if (typeof updateOrderSummary === 'function') {
        // checkout.jsの新しい関数を呼び出す
        updateOrderSummary(total);
    } else {
        // もし関数が見つからない場合は元のコード実行
        const subtotalElement = document.getElementById('checkout-subtotal');
        const taxElement = document.getElementById('checkout-tax');
        const totalElement = document.getElementById('checkout-total');

        if (!subtotalElement || !taxElement || !totalElement) return;

        subtotalElement.textContent = `${total.toFixed(2)} CAD`;
        taxElement.textContent = `Included in price`;
        document.getElementById('checkout-shipping').textContent = `Free`;
        totalElement.textContent = `${total.toFixed(2)} CAD`;
    }
}

// 注文フォームの送信ハンドラ（基本的な実装）
function handleOrderSubmit(event) {
    if (event) event.preventDefault();
    console.log('Order form submitted');
    
    // checkout.jsがすでに読み込まれている場合は処理をスキップ
    if (window.checkoutJsLoaded) {
        console.log('Checkout.js is handling form submission');
        return false;
    }
    
    // checkout.jsがない場合のみバリデーションと処理を行う
    if (typeof validateForm === 'function' && !validateForm()) {
        console.log('Form validation failed');
        return false;
    }
    
    // Alertを表示せず、代わりにボタンを無効化して処理中メッセージを表示
    const submitButton = document.querySelector('.checkout-btn');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
    }
    
    // 処理中メッセージを表示
    const processingMessage = document.createElement('div');
    processingMessage.id = 'processing-message';
    processingMessage.style.marginTop = '1rem';
    processingMessage.style.padding = '0.75rem';
    processingMessage.style.backgroundColor = 'rgba(0,0,0,0.1)';
    processingMessage.style.borderRadius = '4px';
    processingMessage.style.textAlign = 'center';
    processingMessage.style.color = 'var(--text-primary)';
    processingMessage.textContent = 'Processing your order. Please wait...';
    
    // 送信ボタンの後に追加
    if (submitButton && submitButton.parentNode) {
        submitButton.parentNode.appendChild(processingMessage);
    }
    
    // しばらく待ってから注文確認ページへリダイレクト
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 1000);
    
    return false;
}

// モバイルヘッダーの初期化
function initMobileHeader() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const nav = document.querySelector('nav');
    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    
    // メニュー開閉のイベントリスナー設定
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden'; // スクロール防止
        });
    }
    
    if (menuClose && nav) {
        menuClose.addEventListener('click', function() {
            nav.classList.remove('active');
            document.body.style.overflow = ''; // スクロールを戻す
        });
    }
    
    // 検索フォーム表示切替のイベントリスナー設定
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', function() {
            searchContainer.classList.toggle('active');
        });
    }
    
    // 画面外クリックでメニューを閉じる
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (searchContainer && searchContainer.classList.contains('active') && 
            !searchContainer.contains(event.target) && 
            !searchToggle.contains(event.target)) {
            searchContainer.classList.remove('active');
        }
    });
}

// ナビゲーションアイテムの表示制御
function controlNavItems() {
    const currentPath = window.location.pathname;
    const orderHistoryItem = document.querySelector('.nav-item.order-history');
    const accountItem = document.querySelector('.nav-item.account');
    
    if (orderHistoryItem && accountItem) {
        // Account画面ではAccountボタンを非表示
        if (currentPath.includes('account.html')) {
            accountItem.style.display = 'none';
        }
        
        // Order History画面ではOrder Historyボタンを非表示
        if (currentPath.includes('order-history.html')) {
            orderHistoryItem.style.display = 'none';
        }
    }
}

// カート数の同期（モバイル表示用とデスクトップ表示用）
function syncCartCounts() {
    const mainCartCount = document.getElementById('cart-count');
    const desktopCartCount = document.getElementById('cart-count-desktop');
    const mobileCartCount = document.getElementById('cart-count-mobile');
    
    if (mainCartCount) {
        const itemCount = mainCartCount.textContent;
        
        if (desktopCartCount) {
            desktopCartCount.textContent = itemCount;
        }
        
        if (mobileCartCount) {
            mobileCartCount.textContent = itemCount;
        }
    }
}
