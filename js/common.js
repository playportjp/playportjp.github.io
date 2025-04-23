// common.js - 共通で使用される関数やオブジェクト

// 国別税率データベース
window.taxRates = {
    'US': 0.00,  // アメリカ
    'CA': 0.05,  // カナダ
    'MX': 0.16,  // メキシコ
    'UK': 0.20,  // イギリス
    'DE': 0.19,  // ドイツ
    'FR': 0.20,  // フランス
    'IT': 0.22,  // イタリア
    'ES': 0.21,  // スペイン
    'NL': 0.21,  // オランダ
    'BE': 0.21,  // ベルギー
    'SE': 0.25,  // スウェーデン
    'PL': 0.23,  // ポーランド
    'AU': 0.10,  // オーストラリア
    'SG': 0.08,  // シンガポール
    'AE': 0.05,  // アラブ首長国連邦
    'SA': 0.15,  // サウジアラビア
    'JP': 0.10,  // 日本
    'GB': 0.20,  // イギリス（GBコード用）
    'EU': 0.21,  // EUの平均税率
};

// グローバル変数として現在選択されている国と通貨情報を保持
window.currentCountry = null;
window.countries = [];

// 通貨表示用のフォーマッタ関数
window.formatCurrency = function(price, country = null) {
    // 通貨情報がない場合はデフォルト（CAD）を使用
    if (!country && !window.currentCountry) {
        return `${price.toFixed(2)} CAD`;
    }
    
    const currencyInfo = country ? country.currency : window.currentCountry.currency;
    
    // 通貨シンボルの位置に基づいてフォーマット
    if (currencyInfo.position === "before") {
        return `${currencyInfo.symbol}${price.toFixed(2)} ${currencyInfo.code}`;
    } else {
        return `${price.toFixed(2)}${currencyInfo.symbol} ${currencyInfo.code}`;
    }
};

// 国際販売用の価格計算ロジック
window.internationalPricing = {
    // 固定の推定総額から各種金額を計算する
    calculatePrices: function(estimatedTotal, countryCode) {
        // デフォルト値または指定された国の税率を取得
        const taxRate = window.taxRates[countryCode] || 0.20;  // デフォルト値は20%
        
        // カード決済額（税抜金額）を計算 = 総額 / (1 + 税率)
        const cardPayment = estimatedTotal / (1 + taxRate);
        
        // 輸入手数料（税金）を計算 = 総額 - カード決済額
        const importFees = estimatedTotal - cardPayment;
        
        return {
            estimatedTotal: estimatedTotal,
            cardPayment: cardPayment,
            importFees: importFees,
            taxRate: taxRate
        };
    },
    
    // 固定金額に調整するためのヘルパー関数（.99などで終わるようにする）
    adjustToNicePrice: function(price) {
        // 整数部分を取得
        const integerPart = Math.floor(price);
        
        // .99で終わる価格に調整
        return integerPart + 0.99;
    },
    
    // カート合計からの国際価格の計算と表示を更新
    updateCartInternationalPricing: function(countryCode = 'CA') {
        // カートの合計金額（元々の税込み価格）を取得
        const cartTotal = window.cartManager.getCartTotal();
        
        // 表示用にきれいな固定金額に調整（オプション）
        // const estimatedTotal = this.adjustToNicePrice(cartTotal);
        const estimatedTotal = cartTotal; // 調整なしでそのまま使用する場合
        
        // 各種金額を計算
        const prices = this.calculatePrices(estimatedTotal, countryCode);
        
       // HTMLの更新
        const estimatedTotalElement = document.getElementById('estimated-total');
        const cardPaymentElement = document.getElementById('card-payment');
        const importFeesElement = document.getElementById('import-fees');
        
        if (estimatedTotalElement) {
            estimatedTotalElement.textContent = window.formatCurrency(prices.estimatedTotal);
        }
        
        if (cardPaymentElement) {
            cardPaymentElement.textContent = window.formatCurrency(prices.cardPayment);
        }
        
        if (importFeesElement) {
            importFeesElement.textContent = `~${window.formatCurrency(prices.importFees)}`;
        }
        
        return prices;
    }
};

// 国情報を取得する
async function loadCountriesData() {
    try {
        const response = await fetch('data/countries.json');
        const data = await response.json();
        window.countries = data.countries;
        
        // ドロップダウンを設定
        setupCountryDropdown();
        
        // ローカルストレージから国コードを取得するか、デフォルトを設定
        const savedCountryCode = localStorage.getItem('selectedCountry') || 'CA'; // CAをデフォルトに
        setCountry(savedCountryCode);
        
        // ページ上のすべての価格を更新
        updateAllPrices();
    } catch (error) {
        console.error('Failed to load countries data:', error);
    }
}

// 国選択ドロップダウンを設定
function setupCountryDropdown() {
    const dropdown = document.getElementById('country-dropdown');
    if (!dropdown) return;
    
    // ドロップダウンをクリア
    dropdown.innerHTML = '';
    
    // 各国のオプションを追加
    window.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.name} (${country.currency.code})`;
        dropdown.appendChild(option);
    });
    
    // 保存された選択を設定
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
        dropdown.value = savedCountry;
    }
    
    // 変更イベントリスナーを追加
    dropdown.addEventListener('change', function() {
        setCountry(this.value);
        updateAllPrices();
    });
}

// 国を設定する
function setCountry(countryCode) {
    // 国コードに一致する国オブジェクトを見つける
    window.currentCountry = window.countries.find(country => country.code === countryCode);
    
    if (window.currentCountry) {
        // 選択をローカルストレージに保存
        localStorage.setItem('selectedCountry', countryCode);
        
        // ドロップダウンを更新（存在する場合）
        const dropdown = document.getElementById('country-dropdown');
        if (dropdown) {
            dropdown.value = countryCode;
        }
    } else {
        console.error('Invalid country code:', countryCode);
    }
}

// ページ上のすべての価格表示を更新する
function updateAllPrices() {
    if (!window.currentCountry) return;
    
    // 商品カードの価格
    const productPrices = document.querySelectorAll('.product-price');
    productPrices.forEach(priceElement => {
        const originalPrice = parseFloat(priceElement.getAttribute('data-price') || priceElement.textContent);
        if (!isNaN(originalPrice)) {
            priceElement.textContent = window.formatCurrency(originalPrice);
        }
    });
    
    // カートアイテムの価格
    const cartItemPrices = document.querySelectorAll('.item-price');
    cartItemPrices.forEach(priceElement => {
        const originalPrice = parseFloat(priceElement.getAttribute('data-price') || priceElement.textContent);
        if (!isNaN(originalPrice)) {
            priceElement.textContent = window.formatCurrency(originalPrice);
        }
    });
    
    // カート合計の価格
    if (window.internationalPricing && document.querySelector('.cart-order-summary')) {
        window.internationalPricing.updateCartInternationalPricing(window.currentCountry.code);
    }
    
    // チェックアウトページの価格
    const checkoutPrices = document.querySelectorAll('.checkout-item-price');
    checkoutPrices.forEach(priceElement => {
        const priceText = priceElement.textContent;
        const priceMatch = priceText.match(/(\d+\.\d+)/);
        if (priceMatch) {
            const originalPrice = parseFloat(priceMatch[1]);
            // 数量表示を保持
            const quantityElement = priceElement.querySelector('.checkout-item-quantity');
            const quantityText = quantityElement ? quantityElement.outerHTML : '';
            priceElement.innerHTML = `${window.formatCurrency(originalPrice)} ${quantityText}`;
        }
    });
}

// カート管理機能
window.cartManager = {
    items: [],
    
    // カートにアイテムを追加
    addItem: function(productId, name, price, image, quantity = 1) {
        console.log(`Adding to cart: ${name}, ID: ${productId}, Price: ${price}, Quantity: ${quantity}`);
        
        // 既存のアイテムがあるか確認
        const existingItem = this.items.find(item => item.id === productId);
        
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
    console.log('DOM loaded, initializing cart manager and country selector');
    
    // 国情報を取得
    loadCountriesData();
    
    // カート情報を読み込み、カウントを更新
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
        console.log('Cart initialized with items:', window.cartManager.items);
        
        // 商品カードのイベントリスナーを設定
        setupProductCardEvents();
    } else {
        console.error('Cart manager not available');
    }
    
    // チェックアウトページ用の処理
    initCheckoutPage();
    
    // カートページの場合、国際価格計算を実行
    if (document.querySelector('.cart-order-summary')) {
        // 少し遅延させて既存の処理が終わった後に実行
        setTimeout(function() {
            if (window.internationalPricing && window.currentCountry) {
                window.internationalPricing.updateCartInternationalPricing(window.currentCountry.code);
            }
        }, 100);
    }
});

// カート更新時に国際価格計算を実行
document.addEventListener('cart:updated', function() {
    // ユーザーの国情報
    if (!window.currentCountry) return;
    
    // カートページの場合のみ実行
    if (document.querySelector('.cart-order-summary') && window.internationalPricing) {
        window.internationalPricing.updateCartInternationalPricing(window.currentCountry.code);
    }
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
                    <div class="checkout-item-price" data-price="${item.price}">
                        ${window.formatCurrency(item.price)}
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
    
    // 合計（税込み価格）
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 国際価格計算が利用可能な場合、それを使用
    if (window.internationalPricing && window.currentCountry) {
        const prices = window.internationalPricing.calculatePrices(total, window.currentCountry.code);
        
        // 表示を更新
        subtotalElement.textContent = window.formatCurrency(prices.cardPayment);
        taxElement.textContent = window.formatCurrency(prices.importFees);
        document.getElementById('checkout-shipping').textContent = `Free`;
        totalElement.textContent = window.formatCurrency(prices.estimatedTotal);
    } else {
        // 旧来の方法で計算
        const subtotal = total;
        const taxRate = 0.1;
        const estimatedTax = (total * taxRate) / (1 + taxRate);
        
        // 表示を更新
        subtotalElement.textContent = window.formatCurrency(subtotal);
        taxElement.textContent = `Included in price`;
        document.getElementById('checkout-shipping').textContent = `Free`;
        totalElement.textContent = window.formatCurrency(total);
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
