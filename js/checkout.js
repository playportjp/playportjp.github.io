// 注文フォームの送信処理
function handleCheckoutSubmit(event) {
    console.log('Handling checkout submission...');
    
    // プロセス中の表示を追加
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
    }
    
    // フォームのバリデーション
    if (!validateForm()) {
        console.log('Form validation failed');
        // スクロールしてエラー箇所を表示
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // ボタンを元に戻す
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
        return;
    }
    
    try {
        console.log('Form is valid, collecting order data...');
        // 注文データの収集
        const orderData = collectOrderData();
        console.log('Order data collected:', orderData);
        
        // 注文データをlocalStorageに保存
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        console.log('Order data saved to localStorage');
        
        // カートをクリア
        window.cartManager.clearCart();
        console.log('Cart cleared');
        
        // 注文確認ページへリダイレクト
        console.log('Redirecting to order-confirmation.html');
        window.location.href = 'order-confirmation.html';
    } catch (error) {
        console.error('Error during checkout process:', error);
        alert('An error occurred while processing your order. Please try again.');
        
        // ボタンを元に戻す
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
}

// 注文データの収集
function collectOrderData() {
    // カートアイテム
    if (!window.cartManager || !window.cartManager.items) {
        throw new Error('Cart is not available');
    }
    
    const cartItems = window.cartManager.items;
    if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }
    
    // 小計、税金、合計を取得
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !taxElement || !totalElement) {
        throw new Error('Price summary elements not found');
    }
    
    const subtotalText = subtotalElement.textContent;
    const taxText = taxElement.textContent;
    const totalText = totalElement.textContent;
    
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const shipping = 0; // 送料無料と仮定
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    
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
    // 現在の時刻からランダムな注文番号を生成
    const timestamp = new Date().getTime().toString().slice(-10);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${timestamp}-${random}`;
}
