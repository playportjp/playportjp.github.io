// checkout.js - チェックアウト画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み時に少し遅延を入れてカートを確実に読み込む
    setTimeout(() => {
        // カートの初期化を確認
        if (window.cartManager) {
            window.cartManager.loadCart();
            console.log('Cart loaded:', window.cartManager.items);
            
            // カートからアイテムを取得して表示
            displayCheckoutItems();
            
            // 合計金額の計算と表示
            updateOrderTotals();
        } else {
            console.error('Cart manager not initialized');
        }
    }, 100);
    
    // 注文フォームの送信処理
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // フォームフィールドのリアルタイムバリデーション設定
    setupFormValidation();
    
    // 支払い方法の切り替え
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', togglePaymentFields);
    });
    
    // プロモーションコードボタン
    const promoBtn = document.getElementById('apply-promo');
    if (promoBtn) {
        promoBtn.addEventListener('click', applyPromoCode);
    }
});

// チェックアウトアイテムの表示
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;
    
    // カートマネージャーからアイテムを取得
    if (!window.cartManager) {
        console.error('Cart manager is not available');
        return;
    }
    
    // カートが未ロードの場合、ロードする
    if (!window.cartManager.items || window.cartManager.items.length === 0) {
        window.cartManager.loadCart();
    }
    
    const cartItems = window.cartManager.items;
    
    // デバッグログを追加
    console.log('Cart items in checkout:', cartItems);
    
    // カートが空の場合はカートページにリダイレクト
    if (!cartItems || cartItems.length === 0) {
        console.log('Cart is empty, redirecting to cart.html');
        // window.location.href = 'cart.html'; // 一時的にコメントアウト
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
}

// 注文合計の更新
function updateOrderTotals() {
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
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} CAD`;
    document.getElementById('checkout-tax').textContent = `${tax.toFixed(2)} CAD`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : `${shipping.toFixed(2)} CAD`;
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} CAD`;
}

// 支払い方法フィールドの切り替え
function togglePaymentFields() {
    const creditCardFields = document.getElementById('credit-card-fields');
    const paypalFields = document.getElementById('paypal-fields');
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (selectedMethod === 'credit') {
        creditCardFields.style.display = 'block';
        paypalFields.style.display = 'none';
    } else if (selectedMethod === 'paypal') {
        creditCardFields.style.display = 'none';
        paypalFields.style.display = 'block';
    }
}

// フォームバリデーションの設定
function setupFormValidation() {
    // 名前フィールドのバリデーション
    const nameInput = document.getElementById('full-name');
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateField(this, 'name-error', value => {
                return value.trim().length >= 3 || 'Please enter your full name';
            });
        });
    }
    
    // メールフィールドのバリデーション
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateField(this, 'email-error', value => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || 'Please enter a valid email address';
            });
        });
    }
    
    // 電話番号フィールドのバリデーション
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            validateField(this, 'phone-error', value => {
                const phoneRegex = /^\+?[\d\s-]{10,15}$/;
                return phoneRegex.test(value) || 'Please enter a valid phone number';
            });
        });
    }
    
    // 住所フィールドのバリデーション
    const addressInput = document.getElementById('address');
    if (addressInput) {
        addressInput.addEventListener('blur', function() {
            validateField(this, 'address-error', value => {
                return value.trim().length >= 5 || 'Please enter your complete address';
            });
        });
    }
    
    // 市区町村フィールドのバリデーション
    const cityInput = document.getElementById('city');
    if (cityInput) {
        cityInput.addEventListener('blur', function() {
            validateField(this, 'city-error', value => {
                return value.trim().length >= 2 || 'Please enter your city';
            });
        });
    }
    
    // 郵便番号フィールドのバリデーション
    const postalInput = document.getElementById('postal-code');
    if (postalInput) {
        postalInput.addEventListener('blur', function() {
            validateField(this, 'postal-error', value => {
                return value.trim().length >= 3 || 'Please enter your postal/ZIP code';
            });
        });
    }
    
    // クレジットカード番号のバリデーション
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // スペースを自動で追加する
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });
        
        cardNumberInput.addEventListener('blur', function() {
            validateField(this, 'card-number-error', value => {
                const cardNumberRegex = /^[\d\s]{15,19}$/;
                return cardNumberRegex.test(value) || 'Please enter a valid card number';
            });
        });
    }
    
    // 有効期限のバリデーション
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            // スラッシュを自動で追加する
            this.value = this.value.replace(/\//g, '').replace(/^(\d{2})(\d{0,2})/, '$1/$2').trim();
        });
        
        expiryInput.addEventListener('blur', function() {
            validateField(this, 'expiry-error', value => {
                const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!expiryRegex.test(value)) {
                    return 'Please enter expiry in MM/YY format';
                }
                
                // 有効期限が現在より未来かチェック
                const [month, year] = value.split('/');
                const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                const currentDate = new Date();
                
                return expiryDate > currentDate || 'Card is expired';
            });
        });
    }
    
    // CVVのバリデーション
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('blur', function() {
            validateField(this, 'cvv-error', value => {
                const cvvRegex = /^\d{3,4}$/;
                return cvvRegex.test(value) || 'Please enter a valid CVV';
            });
        });
    }
}

// フィールドのバリデーション
function validateField(field, errorId, validationFn) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;
    
    const result = validationFn(field.value);
    
    if (result === true || result === undefined) {
        // バリデーション成功
        field.classList.remove('invalid');
        field.classList.add('valid');
        errorElement.textContent = '';
        return true;
    } else {
        // バリデーション失敗
        field.classList.remove('valid');
        field.classList.add('invalid');
        errorElement.textContent = result;
        return false;
    }
}

// フォーム全体のバリデーション
function validateForm() {
    let isValid = true;
    
    // 必須フィールドの確認
    const requiredFields = [
        { field: 'full-name', error: 'name-error', message: 'Please enter your full name' },
        { field: 'email', error: 'email-error', message: 'Please enter your email address' },
        { field: 'phone', error: 'phone-error', message: 'Please enter your phone number' },
        { field: 'address', error: 'address-error', message: 'Please enter your address' },
        { field: 'city', error: 'city-error', message: 'Please enter your city' },
        { field: 'postal-code', error: 'postal-error', message: 'Please enter your postal/ZIP code' },
        { field: 'country', error: 'country-error', message: 'Please select your country' }
    ];
    
    // 支払い方法に基づく追加フィールド
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    if (paymentMethod === 'credit') {
        requiredFields.push(
            { field: 'card-number', error: 'card-number-error', message: 'Please enter your card number' },
            { field: 'expiry-date', error: 'expiry-error', message: 'Please enter card expiry date' },
            { field: 'cvv', error: 'cvv-error', message: 'Please enter CVV' }
        );
    }
    
    // 各フィールドをチェック
    requiredFields.forEach(item => {
        const field = document.getElementById(item.field);
        const errorElement = document.getElementById(item.error);
        
        if (field && field.value.trim() === '') {
            field.classList.add('invalid');
            if (errorElement) {
                errorElement.textContent = item.message;
            }
            isValid = false;
        }
    });
    
    // 利用規約の同意確認
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');
    if (termsCheckbox && !termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions';
        isValid = false;
    } else if (termsError) {
        termsError.textContent = '';
    }
    
    return isValid;
}

// プロモーションコードの適用
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code-input');
    if (!promoInput || promoInput.value.trim() === '') {
        alert('Please enter a promotion code.');
        return;
    }
    
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // プロモーションコードのバリデーション（サンプル）
    if (promoCode === 'WELCOME10') {
        // 10% 割引を適用
        alert('Promotion code "WELCOME10" applied! 10% discount on your order.');
        
        // 割引後の金額を計算（例として単純に10%割引）
        applyDiscount(0.1);
    } else {
        alert('Invalid promotion code. Please try again.');
    }
}

// 割引の適用
function applyDiscount(discountRate) {
    // 現在の小計を取得
    const subtotalElement = document.getElementById('checkout-subtotal');
    const subtotalText = subtotalElement.textContent;
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    
    // 割引額を計算
    const discount = subtotal * discountRate;
    
    // 税額を再計算（割引後の小計に対して）
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.1;
    
    // 合計を更新
    const total = discountedSubtotal + tax;
    
    // 表示を更新
    document.getElementById('checkout-subtotal').textContent = `${discountedSubtotal.toFixed(2)} CAD`;
    document.getElementById('checkout-tax').textContent = `${tax.toFixed(2)} CAD`;
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} CAD`;
    
    // プロモーションコード適用済みの表示
    const promoInput = document.getElementById('promo-code-input');
    promoInput.disabled = true;
    promoInput.value = 'WELCOME10 - 10% OFF';
    document.getElementById('apply-promo').disabled = true;
}

// 注文フォームの送信処理
function handleOrderSubmit(event) {
    event.preventDefault();
    
    // フォームのバリデーション
    if (!validateForm()) {
        // スクロールしてエラー箇所を表示
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // 注文データの収集
    const orderData = collectOrderData();
    
    // 注文データをlocalStorageに保存
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // カートをクリア
    window.cartManager.items = [];
    window.cartManager.saveCart();
    
    // 注文確認ページへリダイレクト
    window.location.href = 'order-confirmation.html';
}

// 注文データの収集
function collectOrderData() {
    // カートアイテム
    const cartItems = window.cartManager.items;
    
    // 小計、税金、合計を取得
    const subtotalText = document.getElementById('checkout-subtotal').textContent;
    const taxText = document.getElementById('checkout-tax').textContent;
    const totalText = document.getElementById('checkout-total').textContent;
    
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const shipping = 0; // 送料無料と仮定
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    
    // 顧客情報
    const customerInfo = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postal-code').value,
        country: document.getElementById('country').value
    };
    
    // 支払い方法
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // 注文番号の生成（ダミー）
    const orderNumber = generateOrderNumber();
    
    // 注文日時
    const orderDate = new Date();
    
    return {
        orderNumber: orderNumber,
        orderDate: orderDate,
        items: cartItems,
        customerInfo: customerInfo,
        paymentMethod: paymentMethod,
        summary: {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        }
    };
}

// 注文番号の生成（ダミー）
function generateOrderNumber() {
    // 現在の時刻からランダムな注文番号を生成
    const timestamp = new Date().getTime().toString().slice(-10);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${timestamp}-${random}`;
}
