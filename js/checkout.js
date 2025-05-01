// checkout.js - チェックアウトページの機能管理

// 全体スコープで使用する変数
let orderData = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
};

// チェックアウト処理が既に初期化されていることを示すフラグ
window.checkoutJsLoaded = true;

// DOMの読み込みが完了したときの処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // カート情報をロード
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
        
        // カートが空の場合はカートページにリダイレクト
        if (window.cartManager.items.length === 0) {
            console.warn('Cart is empty, redirecting to cart page');
            window.location.href = 'cart.html';
        }
    }
    
    // チェックアウトページの初期化
    initCheckoutPage();
    
    // フォーム送信イベントを設定
    setupFormSubmission();
});

// チェックアウトページの初期化
function initCheckoutPage() {
    // チェックアウトアイテムを表示
    displayCheckoutItems();
    
    // 住所自動入力のセットアップ
    setupAddressAutofill();
    
    // 支払い方法の選択処理
    setupPaymentMethods();
    
    // フォームバリデーションを設定
    setupFormValidation();
}

// チェックアウトアイテムの表示
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;
    
    // カートアイテムを取得
    const cartItems = window.cartManager.items;
    console.log('Displaying checkout items:', cartItems);
    
    // カートが空の場合、カートページにリダイレクト
    if (!cartItems || cartItems.length === 0) {
        console.warn('Cart is empty, redirecting to cart page');
        window.location.href = 'cart.html';
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
        
        // 注文データに商品情報を追加
        orderData.items.push({
            id: item.id,
            name: item.name,
            price: `${item.price.toFixed(2)} CAD`,
            quantity: `x${item.quantity}`,
            image: item.image || null
        });
    });
    
    checkoutItemsContainer.innerHTML = html;
    
    // 合計金額を更新
    updateOrderSummary();
}

// 注文サマリーの更新
function updateOrderSummary(override = null) {
    // 合計金額を計算
    const subtotal = override !== null ? override : window.cartManager.getCartTotal();
    const shipping = 0; // 今回の実装では送料無料
    const taxRate = 0.13; // 13%の税率（カナダのGST/HST）
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shipping;
    
    // 注文データに金額情報を追加
    orderData.subtotal = subtotal;
    orderData.tax = tax;
    orderData.shipping = shipping;
    orderData.total = total;
    
    console.log("Order summary updated:", { subtotal, tax, shipping, total });
    
    // 注文サマリー要素を取得
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !taxElement || !totalElement) return;
    
    // 金額を表示
    subtotalElement.textContent = `${subtotal.toFixed(2)} CAD`;
    taxElement.textContent = `${tax.toFixed(2)} CAD`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : `${shipping.toFixed(2)} CAD`;
    totalElement.textContent = `${total.toFixed(2)} CAD`;
}

// 住所自動入力のセットアップ
function setupAddressAutofill() {
    // 保存された住所情報があれば自動入力
    const savedAddress = localStorage.getItem('user-address');
    if (savedAddress) {
        try {
            const addressData = JSON.parse(savedAddress);
            
            // 各フィールドに値を設定
            document.getElementById('full-name')?.value = addressData.fullName || '';
            document.getElementById('email')?.value = addressData.email || '';
            document.getElementById('phone')?.value = addressData.phone || '';
            document.getElementById('address')?.value = addressData.address || '';
            document.getElementById('city')?.value = addressData.city || '';
            document.getElementById('postal-code')?.value = addressData.postalCode || '';
            document.getElementById('country')?.value = addressData.country || '';
            
            console.log('Autofilled address information');
        } catch (e) {
            console.error('Error parsing saved address:', e);
        }
    }
    
    // 住所保存のチェックボックスを設定
    const saveAddressCheckbox = document.getElementById('save-address');
    if (saveAddressCheckbox) {
        saveAddressCheckbox.checked = !!savedAddress;
    }
}

// 支払い方法の選択処理
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const creditCardFields = document.getElementById('credit-card-fields');
    
    if (paymentOptions.length === 0 || !creditCardFields) return;
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const paymentMethod = this.value;
            
            // クレジットカード選択時のみカード情報入力欄を表示
            if (paymentMethod === 'credit-card') {
                creditCardFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'none';
            }
            
            // 注文データに支払い方法を追加
            orderData.paymentMethod = paymentMethod;
            
            console.log('Payment method selected:', paymentMethod);
        });
    });
    
    // デフォルトで最初の支払い方法を選択
    if (paymentOptions[0]) {
        paymentOptions[0].checked = true;
        
        // 支払い方法の変更イベントを発火
        const event = new Event('change');
        paymentOptions[0].dispatchEvent(event);
    }
}

// フォームバリデーションの設定
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        // フォーカスアウト時にバリデーション
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// フィールドのバリデーション
function validateField(field) {
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // 必須チェック
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // フィールドタイプに応じたバリデーション
        switch (fieldName) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid email address';
                break;
                
            case 'phone':
                isValid = /^[\d\+\-\(\)\s]{7,20}$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid phone number';
                break;
                
            case 'postal-code':
                isValid = /^[A-Za-z0-9\s-]{3,10}$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid postal code';
                break;
                
            case 'card-number':
                isValid = /^[\d\s-]{13,19}$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid card number';
                break;
                
            case 'card-expiry':
                isValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid expiry date (MM/YY)';
                break;
                
            case 'card-cvv':
                isValid = /^[0-9]{3,4}$/.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid CVV code';
                break;
        }
    }
    
    // エラー表示
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = isValid ? 'none' : 'block';
    }
    
    // フィールドスタイル
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    return isValid;
}

// フォーム全体のバリデーション
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const fieldIsValid = validateField(field);
        isValid = isValid && fieldIsValid;
    });
    
    return isValid;
}

// フォーム送信の設定
function setupFormSubmission() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// 注文送信ハンドラ
function handleOrderSubmit(event) {
    if (event) event.preventDefault();
    console.log('Order form submitted');
    
    // フォームバリデーション
    if (!validateForm()) {
        console.log('Form validation failed');
        return false;
    }
    
    // ボタンを無効化
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
    
    // 注文データを準備
    prepareOrderData()
        .then(createOrder)
        .then(() => {
            // 注文が完了したらカートをクリア
            if (window.cartManager) {
                window.cartManager.clearCart();
            }
            
            // 注文確認ページへリダイレクト
            window.location.href = 'order-confirmation.html';
        })
        .catch(error => {
            console.error('Error processing order:', error);
            
            // エラーメッセージを表示
            processingMessage.textContent = 'There was an error processing your order. Please try again.';
            processingMessage.style.backgroundColor = 'rgba(255,0,0,0.1)';
            
            // ボタンを再度有効化
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Place Order';
            }
        });
    
    return false;
}

// 注文データの準備
function prepareOrderData() {
    return new Promise((resolve, reject) => {
        try {
            // フォームからデータを取得
            const form = document.getElementById('order-form');
            if (!form) {
                reject(new Error('Order form not found'));
                return;
            }
            
            // お客様情報
            const fullName = document.getElementById('full-name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            
            // 配送先住所
            const address = document.getElementById('address')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const postalCode = document.getElementById('postal-code')?.value || '';
            const country = document.getElementById('country')?.value || '';
            
            // 支払い情報
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || '';
            
            // 住所を保存するかどうか
            const saveAddress = document.getElementById('save-address')?.checked || false;
            
            // 住所情報を保存
            if (saveAddress) {
                const addressData = {
                    fullName,
                    email,
                    phone,
                    address,
                    city,
                    postalCode,
                    country
                };
                
                localStorage.setItem('user-address', JSON.stringify(addressData));
                console.log('Address saved to localStorage');
            }
            
            // 注文日時
            const now = new Date();
            const orderDate = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // 注文番号の生成
            const orderPrefix = 'PP-';
            const orderNumber = orderPrefix + now.getFullYear() +
                                String(now.getMonth() + 1).padStart(2, '0') +
                                String(now.getDate()).padStart(2, '0') +
                                String(Math.floor(Math.random() * 100)).padStart(2, '0');
            
            // 注文ステータス
            const orderStatus = 'Processing';
            
            // 顧客情報と配送情報を注文データに追加
            orderData.id = orderNumber.replace(orderPrefix, '');
            orderData.number = orderNumber;
            orderData.date = orderDate;
            orderData.status = orderStatus;
            orderData.fullName = fullName;
            orderData.email = email;
            orderData.phone = phone;
            orderData.shippingAddress = address;
            orderData.shippingCity = city;
            orderData.shippingPostalCode = postalCode;
            orderData.shippingCountry = country;
            orderData.paymentMethod = paymentMethod;
            
            // 商品点数
            const itemCount = orderData.items.length === 1 
                ? '1 Item' 
                : `${orderData.items.length} Items`;
            
            orderData.itemCount = itemCount;
            
            // 合計金額（表示用）
            orderData.totalFormatted = `${orderData.total.toFixed(2)} CAD`;
            
            // 詳細情報の構造化
            orderData.details = {
                items: orderData.items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                totals: {
                    'Subtotal': `${orderData.subtotal.toFixed(2)} CAD`,
                    'Shipping': orderData.shipping === 0 ? 'Free' : `${orderData.shipping.toFixed(2)} CAD`,
                    'Tax': `${orderData.tax.toFixed(2)} CAD`,
                    'Total': `${orderData.total.toFixed(2)} CAD`
                }
            };
            
            // トラッキング番号を仮生成
            orderData.trackingNumber = orderData.id + Math.random().toString(36).substr(2, 8).toUpperCase();
            
            console.log('Order data prepared:', orderData);
            resolve(orderData);
        } catch (error) {
            console.error('Error preparing order data:', error);
            reject(error);
        }
    });
}

// 注文の作成と保存
function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        try {
            // APIを使用する場合は、ここでAPIリクエストを行う
            // モックデータとして、ローカルストレージに保存
            
            // 注文を確認ページで表示するために保存
            localStorage.setItem('current-order', JSON.stringify(orderData));
            
            // 注文履歴に追加
            if (window.orderHistoryManager && typeof window.orderHistoryManager.addOrderToHistory === 'function') {
                window.orderHistoryManager.addOrderToHistory(orderData)
                    .then(() => {
                        console.log('Order added to history');
                        resolve(orderData);
                    })
                    .catch(error => {
                        console.error('Error adding order to history:', error);
                        // 履歴への追加に失敗しても、注文自体は処理を続行
                        resolve(orderData);
                    });
            } else {
                // orderHistoryManagerが利用できない場合
                console.warn('orderHistoryManager not available, order history will not be updated');
                
                // ローカルストレージから直接履歴を更新
                try {
                    const savedOrderHistory = localStorage.getItem('order-history');
                    let orders = [];
                    
                    if (savedOrderHistory) {
                        orders = JSON.parse(savedOrderHistory);
                    }
                    
                    // 新しい注文を追加
                    orders.unshift(orderData);
                    
                    // 注文履歴を保存
                    localStorage.setItem('order-history', JSON.stringify(orders));
                    console.log('Order added to history directly via localStorage');
                } catch (e) {
                    console.error('Error saving to order history in localStorage:', e);
                }
                
                resolve(orderData);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            reject(error);
        }
    });
}

// 外部からアクセスできるように関数をエクスポート
window.checkoutManager = {
    updateOrderSummary: updateOrderSummary,
    validateForm: validateForm,
    handleOrderSubmit: handleOrderSubmit
};

// このコードを確認するための表示
console.log('checkout.js loaded successfully');
