// DOM読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js loaded and initialized');
    
    // common.jsに自分が処理を担当することを伝えるフラグを設定
    window.checkoutJsLoaded = true;
    
    // 注文フォーム要素の取得
    const orderForm = document.getElementById('order-form');
    
    // フォームにnovalidate属性を追加してブラウザのデフォルトバリデーションを無効化
    if (orderForm) {
        orderForm.setAttribute('novalidate', 'novalidate');
        orderForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // フォームバリデーションの初期化
    initFormValidation();
    
    // カートアイテムの読み込み
    loadCartItems();
});

// チェックアウトフォーム送信の処理
function handleCheckoutSubmit(event) {
    // デフォルトのフォーム送信を防止
    event.preventDefault();
    
    console.log('Handling checkout submission in checkout.js');
    
    // フォームのバリデーション
    if (!validateForm()) {
        console.log('Form validation failed');
        // 最初のエラーにスクロール
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    try {
        console.log('Form is valid, collecting order data...');
        
        // 処理中の状態を表示
        showProcessingState();
        
        // 注文データの収集 - collectOrderData関数を直接呼び出し
        const orderData = collectOrderData();
        console.log('Order data collected:', orderData);
        
        // 注文データをlocalStorageに保存
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        console.log('Order data saved to localStorage');
        
        // カートをクリア
        if (window.cartManager) {
            window.cartManager.clearCart();
            console.log('Cart cleared');
        }
        
        // 短い遅延後に注文確認ページへリダイレクト（処理中のメッセージを表示するため）
        setTimeout(function() {
            console.log('Redirecting to order-confirmation.html');
            window.location.href = 'order-confirmation.html';
        }, 800);
        
    } catch (error) {
        console.error('Error during checkout process:', error);
        
        // 処理中の状態を非表示
        hideProcessingState();
        
        // エラーメッセージを表示
        showCheckoutError('An error occurred while processing your order. Please try again.');
    }
}

// 処理中の状態を表示
function showProcessingState() {
    // 送信ボタンを取得
    const submitButton = document.querySelector('.checkout-btn');
    if (submitButton) {
        // 元のテキストを保存
        submitButton.dataset.originalText = submitButton.textContent;
        
        // 処理中のテキストを表示しボタンを無効化
        submitButton.textContent = 'Processing order...';
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#999';
        submitButton.style.cursor = 'wait';
    }
    
    // 処理中メッセージを作成または更新
    let processingMessage = document.getElementById('processing-message');
    if (!processingMessage) {
        processingMessage = document.createElement('div');
        processingMessage.id = 'processing-message';
        processingMessage.style.marginTop = '1rem';
        processingMessage.style.padding = '0.75rem';
        processingMessage.style.backgroundColor = 'rgba(0,0,0,0.1)';
        processingMessage.style.borderRadius = '4px';
        processingMessage.style.textAlign = 'center';
        processingMessage.style.color = 'var(--text-primary)';
        
        // 送信ボタンの後に追加
        const submitButton = document.querySelector('.checkout-btn');
        if (submitButton && submitButton.parentNode) {
            submitButton.parentNode.appendChild(processingMessage);
        }
    }
    
    processingMessage.textContent = 'Processing your order. Please wait...';
    processingMessage.style.display = 'block';
}

// 処理中の状態を非表示
function hideProcessingState() {
    // 送信ボタンを元に戻す
    const submitButton = document.querySelector('.checkout-btn');
    if (submitButton && submitButton.dataset.originalText) {
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
        submitButton.style.cursor = '';
    }
    
    // 処理中メッセージを非表示
    const processingMessage = document.getElementById('processing-message');
    if (processingMessage) {
        processingMessage.style.display = 'none';
    }
}

// チェックアウトエラーメッセージを表示
function showCheckoutError(message) {
    let errorElement = document.getElementById('checkout-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'checkout-error';
        errorElement.className = 'error-message';
        
        // フォームの先頭に挿入
        const form = document.getElementById('order-form');
        if (form) {
            form.insertBefore(errorElement, form.firstChild);
        }
    }
    
    errorElement.style.display = 'block';
    errorElement.textContent = message;
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// フォームのバリデーション
function validateForm() {
    let isValid = true;
    
    // 以前のエラーメッセージをクリア
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.textContent = '');
    
    // 必須フィールドのバリデーション
    const requiredFields = [
        { id: 'full-name', error: 'name-error', message: 'Please enter your full name' },
        { id: 'email', error: 'email-error', message: 'Please enter a valid email address' },
        { id: 'phone', error: 'phone-error', message: 'Please enter a valid phone number' },
        { id: 'address', error: 'address-error', message: 'Please enter your street address' },
        { id: 'city', error: 'city-error', message: 'Please enter your city' },
        { id: 'postal-code', error: 'postal-error', message: 'Please enter a valid postal code' },
        { id: 'country', error: 'country-error', message: 'Please select your country' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.error);
        
        if (!element || !errorElement) return;
        
        if (!element.value.trim()) {
            errorElement.textContent = field.message;
            element.classList.add('invalid');
            isValid = false;
        } else {
            element.classList.remove('invalid');
            element.classList.add('valid');
        }
    });
    
    // Emailのバリデーション
    const emailElement = document.getElementById('email');
    const emailErrorElement = document.getElementById('email-error');
    if (emailElement && emailErrorElement && emailElement.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailElement.value.trim())) {
            emailErrorElement.textContent = 'Please enter a valid email address';
            emailElement.classList.add('invalid');
            isValid = false;
        }
    }
    
    // クレジットカード選択時のフィールドチェック
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (paymentMethod && paymentMethod.value === 'credit') {
        const cardFields = [
            { id: 'card-number', error: 'card-number-error', message: 'Please enter a valid card number' },
            { id: 'expiry-date', error: 'expiry-error', message: 'Please enter a valid expiry date (MM/YY)' },
            { id: 'cvv', error: 'cvv-error', message: 'Please enter a valid CVV code' }
        ];
        
        cardFields.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.error);
            
            if (!element || !errorElement) return;
            
            if (!element.value.trim()) {
                errorElement.textContent = field.message;
                element.classList.add('invalid');
                isValid = false;
            } else {
                element.classList.remove('invalid');
                element.classList.add('valid');
            }
        });
    }
    
    // 利用規約同意チェックボックス
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');
    if (termsCheckbox && termsError && !termsCheckbox.checked) {
        termsError.textContent = 'Please check this box to continue';
        isValid = false;
    }
    
    return isValid;
}

// 入力フィールドのバリデーション初期化
function initFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // フォーカスを失った時にバリデーション
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        // 入力中にエラーが表示されている場合はリアルタイムでバリデーション
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateInput(this);
            }
        });
    });
    
    // 支払い方法フィールドの切り替え
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentFields);
    });
    
    // プロモコードボタン
    const promoButton = document.getElementById('apply-promo');
    if (promoButton) {
        promoButton.addEventListener('click', applyPromoCode);
    }
}

// 支払い方法フィールドの切り替え
function togglePaymentFields() {
    const creditFields = document.getElementById('credit-card-fields');
    const paypalFields = document.getElementById('paypal-fields');
    
    if (this.value === 'credit') {
        creditFields.style.display = 'block';
        paypalFields.style.display = 'none';
    } else if (this.value === 'paypal') {
        creditFields.style.display = 'none';
        paypalFields.style.display = 'block';
    }
}

// 個別入力フィールドのバリデーション
function validateInput(input) {
    if (!input.id) return;
    
    let errorElement;
    let errorMessage = '';
    
    switch (input.id) {
        case 'full-name':
            errorElement = document.getElementById('name-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your full name';
            }
            break;
            
        case 'email':
            errorElement = document.getElementById('email-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your email address';
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    errorMessage = 'Please enter a valid email address';
                }
            }
            break;
            
        case 'phone':
            errorElement = document.getElementById('phone-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your phone number';
            }
            break;
            
        case 'address':
            errorElement = document.getElementById('address-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your street address';
            }
            break;
            
        case 'city':
            errorElement = document.getElementById('city-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your city';
            }
            break;
            
        case 'postal-code':
            errorElement = document.getElementById('postal-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your postal code';
            }
            break;
            
        case 'country':
            errorElement = document.getElementById('country-error');
            if (!input.value) {
                errorMessage = 'Please select your country';
            }
            break;
            
        case 'card-number':
            errorElement = document.getElementById('card-number-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your card number';
            }
            break;
            
        case 'expiry-date':
            errorElement = document.getElementById('expiry-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter the expiry date';
            } else {
                const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!expiryPattern.test(input.value.trim())) {
                    errorMessage = 'Please use MM/YY format';
                }
            }
            break;
            
        case 'cvv':
            errorElement = document.getElementById('cvv-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter the CVV code';
            } else if (!/^\d{3,4}$/.test(input.value.trim())) {
                errorMessage = 'CVV must be 3 or 4 digits';
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        
        if (errorMessage) {
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
        }
    }
}

// プロモコードの適用
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code-input');
    
    if (!promoInput || !promoInput.value.trim()) {
        return;
    }
    
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // プロモコード検証のシミュレーション（実際はサーバーサイドで行う）
    if (promoCode === 'WELCOME10') {
        // 10%割引を適用
        applyDiscount(0.1);
        // アラートの代わりにインラインメッセージを表示
        showPromoMessage('Promo code applied: 10% discount!', 'success');
    } else {
        showPromoMessage('Invalid promo code. Please try again.', 'error');
    }
}

// プロモコードメッセージを表示
function showPromoMessage(message, type) {
    // メッセージ要素を探すか作成
    let messageElement = document.getElementById('promo-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'promo-message';
        messageElement.style.marginTop = '0.5rem';
        messageElement.style.padding = '0.5rem';
        messageElement.style.borderRadius = '4px';
        messageElement.style.fontSize = '0.8rem';
        messageElement.style.textAlign = 'center';
        
        // プロモボタンの後に挿入
        const promoGroup = document.querySelector('.promo-input-group');
        if (promoGroup && promoGroup.parentNode) {
            promoGroup.parentNode.appendChild(messageElement);
        }
    }
    
    // メッセージとタイプに基づいてスタイルを設定
    messageElement.textContent = message;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        messageElement.style.color = '#4caf50';
    } else {
        messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        messageElement.style.color = '#f44336';
    }
    
    // メッセージを表示
    messageElement.style.display = 'block';
    
    // 数秒後に自動的に非表示
    setTimeout(function() {
        messageElement.style.display = 'none';
    }, 3000);
}

// 割引を注文合計に適用
function applyDiscount(discountPercentage) {
    const totalElement = document.getElementById('checkout-total');
    
    if (!totalElement) {
        return;
    }
    
    const currentTotal = parseFloat(totalElement.textContent.replace(/[^0-9.]/g, ''));
    const discountAmount = currentTotal * discountPercentage;
    const newTotal = currentTotal - discountAmount;
    
    totalElement.textContent = newTotal.toFixed(2) + ' CAD';
    
    // 関連する他の要素も更新
    const cardPaymentElement = document.getElementById('checkout-card-payment');
    const importFeesElement = document.getElementById('checkout-import-fees');
    
    if (cardPaymentElement && importFeesElement) {
        // 輸入手数料は合計の約10%と仮定
        const importFeesRate = 0.1;
        const importFees = newTotal * importFeesRate;
        const cardPayment = newTotal - importFees;
        
        cardPaymentElement.textContent = `${cardPayment.toFixed(2)} CAD`;
        importFeesElement.textContent = `~${importFees.toFixed(2)} CAD`;
    }
}

// カートアイテムをチェックアウト表示に読み込む
function loadCartItems() {
    // common.jsが既にアイテムを表示している場合は重複処理を防ぐ
    if (document.getElementById('checkout-items').children.length > 0) {
        console.log('Items already loaded by common.js');
        return;
    }
    
    if (!window.cartManager || !window.cartManager.items || window.cartManager.items.length === 0) {
        return;
    }
    
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) {
        return;
    }
    
    // 既存のアイテムをクリア
    checkoutItemsContainer.innerHTML = '';
    
    // 各カートアイテムを追加
    let subtotal = 0;
    
    window.cartManager.items.forEach(item => {
        // アイテム要素を作成
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        // アイテムコンテンツを作成
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        itemElement.innerHTML = `
            <div class="checkout-item-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            </div>
            <div class="checkout-item-details">
                <div class="checkout-item-title">${item.name}</div>
                <div class="checkout-item-price">${item.price} CAD <span class="checkout-item-quantity">x${item.quantity}</span></div>
            </div>
        `;
        
        // コンテナに追加
        checkoutItemsContainer.appendChild(itemElement);
    });
    
    // 注文サマリーを更新
    updateOrderSummary(subtotal);
}

// 注文サマリーを計算値で更新
function updateOrderSummary(subtotalWithTax) {
    console.log("updateOrderSummary called with:", subtotalWithTax); // デバッグ用

    const totalElement = document.getElementById('checkout-total');
    const cardPaymentElement = document.getElementById('checkout-card-payment');
    const importFeesElement = document.getElementById('checkout-import-fees');

    if (!totalElement || !cardPaymentElement || !importFeesElement) {
        console.log("Some elements not found"); // デバッグ用
        return;
    }

    // 合計金額（税込み）
    const total = subtotalWithTax;

    // 輸入手数料を計算（合計の約10%と仮定）
    const importFeesRate = 0.1;
    const importFees = total * importFeesRate;

    // カード支払い額を計算（合計 - 輸入手数料）
    const cardPayment = total - importFees;

    // 表示を更新
    totalElement.textContent = `${total.toFixed(2)} CAD`;
    cardPaymentElement.textContent = `${cardPayment.toFixed(2)} CAD`;
    importFeesElement.textContent = `~${importFees.toFixed(2)} CAD`;

    console.log("Updated values:", { total, cardPayment, importFees }); // デバッグ用
}

// 注文データ収集 - エラーハンドリングを改善
function collectOrderData() {
    console.log('Collecting order data...');
    // カートアイテム
    if (!window.cartManager || !window.cartManager.items) {
        throw new Error('Cart is not available');
    }

    const cartItems = window.cartManager.items;
    if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    // 合計金額を取得 - より柔軟なチェック
    const totalElement = document.getElementById('checkout-total');

    // totalElementが見つからない場合でも処理を続行するためにフォールバック
    let total = 0;
    if (totalElement) {
        const totalText = totalElement.textContent || '0.00 CAD';
        total = parseFloat(totalText.replace(/[^0-9.]/g, '')) || 0;
    } else {
        console.log('checkout-total element not found, using cart total');
        // カートの合計から計算
        if (cartItems && cartItems.length > 0) {
            total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
    }

    // 輸入手数料 - オプションで取得
    let importFees = 0;
    const importFeesElement = document.getElementById('checkout-import-fees');
    if (importFeesElement) {
        const importFeesText = importFeesElement.textContent || '0.00 CAD';
        importFees = parseFloat(importFeesText.replace(/[^0-9.]/g, '')) || 0;
    } else {
        // 見つからない場合は合計の約5%として計算
        importFees = Math.round(total * 0.05 * 100) / 100;
    }

    const shipping = 0; // 送料無料と仮定
    const subtotal = total - importFees; // 小計を計算
    const tax = importFees; // 輸入手数料を税金として扱う

    console.log('Order data calculation:', { total, importFees, subtotal, tax });

    // フォームから顧客情報を取得
    const fullNameElement = document.getElementById('full-name');
    const emailElement = document.getElementById('email');
    const phoneElement = document.getElementById('phone');
    const addressElement = document.getElementById('address');
    const cityElement = document.getElementById('city');
    const postalCodeElement = document.getElementById('postal-code');
    const countryElement = document.getElementById('country');

    if (!fullNameElement || !emailElement || !phoneElement || !addressElement ||
        !cityElement || !postalCodeElement || !countryElement) {
        throw new Error('Customer information form elements not found');
    }

    // 顧客情報
    const customerInfo = {
        name: fullNameElement.value.trim(),
        email: emailElement.value.trim(),
        phone: phoneElement.value.trim(),
        address: addressElement.value.trim(),
        city: cityElement.value.trim(),
        postalCode: postalCodeElement.value.trim(),
        country: countryElement.value
    };

    // 支払い方法
    const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodElement) {
        throw new Error('Payment method not selected');
    }
    const paymentMethod = paymentMethodElement.value;

    // 支払い情報（クレジットカードの場合）
    let paymentDetails = {};
    if (paymentMethod === 'credit') {
        const cardNumberElement = document.getElementById('card-number');
        const expiryDateElement = document.getElementById('expiry-date');
        const cvvElement = document.getElementById('cvv');

        if (!cardNumberElement || !expiryDateElement || !cvvElement) {
            throw new Error('Credit card form elements not found');
        }

        // セキュリティのため、カード番号の最後の4桁だけを保存
        const cardNumber = cardNumberElement.value.replace(/\s/g, '');
        const lastFourDigits = cardNumber.slice(-4);

        paymentDetails = {
            cardType: detectCardType(cardNumber),
            lastFourDigits: lastFourDigits,
            expiry: expiryDateElement.value
        };
    }

    // 注文番号の生成
    const orderNumber = generateOrderNumber();

    // 注文日時
    const orderDate = new Date();

    return {
        orderNumber: orderNumber,
        orderDate: orderDate,
        items: cartItems,
        customerInfo: customerInfo,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
        summary: {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        }
    };
}

// カード種類の判別
function detectCardType(cardNumber) {
    // カード番号の先頭から種類を判別
    if (/^4/.test(cardNumber)) {
        return 'Visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
        return 'MasterCard';
    } else if (/^3[47]/.test(cardNumber)) {
        return 'American Express';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
        return 'Discover';
    } else {
        return 'Unknown';
    }
}

// 注文番号の生成
function generateOrderNumber() {
    // タイムスタンプとランダム数字で注文番号を生成
    const timestamp = new Date().getTime().toString().slice(-10);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${timestamp}-${random}`;
}
