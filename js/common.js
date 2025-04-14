// checkout.js - チェックアウトページ用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    // checkout-items要素が存在する場合のみ実行
    if (document.getElementById('checkout-items')) {
        // カートからアイテムを取得して表示
        displayCheckoutItems();
    }
    
    // 注文フォームの送信処理
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // フォームフィールドのリアルタイムバリデーション設定
    if (document.querySelector('[name="full-name"]')) {
        setupFormValidation();
    }
});

// チェックアウトアイテムの表示
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    // CartManagerからアイテムを取得（common.jsとの互換性を確保）
    const cartItems = window.cartManager.items;
    
    // カートが空の場合
    if (cartItems.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
        updateOrderTotals(0);
        
        // 注文ボタンを無効化
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }
        return;
    }
    
    // カート内の商品を表示
    let html = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="placeholder-image"></div>'}
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
    
    checkoutItems.innerHTML = html;
    updateOrderTotals(subtotal);
}

// 注文合計の更新
function updateOrderTotals(subtotal) {
    const shipping = 15.00; // 固定送料
    const tax = subtotal * 0.05; // 5%の税金（GST/HST相当）
    const total = subtotal + shipping + tax;
    
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} CAD`;
    document.getElementById('checkout-shipping').textContent = `${shipping.toFixed(2)} CAD`;
    
    // 税金の表示要素があれば更新
    const taxElement = document.getElementById('checkout-tax');
    if (taxElement) {
        taxElement.textContent = `${tax.toFixed(2)} CAD`;
    }
    
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} CAD`;
}

// フォームバリデーションの設定
function setupFormValidation() {
    const requiredFields = [
        'full-name', 'email', 'address', 'city', 'postal-code', 'country', 'phone'
    ];
    
    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        }
    });
    
    // メールアドレスの特別なバリデーション
    const emailField = document.querySelector('[name="email"]');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
}

// 個別フィールドのバリデーション
function validateField(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!field.value.trim()) {
        field.classList.add('invalid');
        
        if (errorElement) {
            errorElement.textContent = 'This field is required';
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        field.classList.remove('invalid');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// メールアドレスのバリデーション
function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('email-error');
    
    if (!field.value.trim()) {
        field.classList.add('invalid');
        
        if (errorElement) {
            errorElement.textContent = 'Email is required';
            errorElement.style.display = 'block';
        }
        return false;
    } else if (!emailRegex.test(field.value)) {
        field.classList.add('invalid');
        
        if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        field.classList.remove('invalid');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// フォーム全体のバリデーション
function validateForm() {
    const requiredFields = [
        'full-name', 'email', 'address', 'city', 'postal-code', 'country', 'phone'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (fieldName === 'email') {
                isValid = validateEmail(field) && isValid;
            } else {
                isValid = validateField(field) && isValid;
            }
        }
    });
    
    return isValid;
}

// 注文フォーム送信処理
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // フォームのバリデーション
    if (!validateForm()) {
        const firstInvalid = document.querySelector('.invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
        return;
    }
    
    // フォームデータの取得
    const formData = new FormData(e.target);
    const cartItems = window.cartManager.items;
    
    // 小計、税金、送料、合計を計算
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    const orderData = {
        customerInfo: {
            name: formData.get('full-name'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postal-code'),
            country: formData.get('country'),
            phone: formData.get('phone'),
            notes: formData.get('notes')
        },
        items: cartItems,
        summary: {
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total
        },
        paymentMethod: formData.get('payment-method'),
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };
    
    // 注文データをlocalStorageに保存
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // 注文処理（デモ用）
    console.log('Order submitted:', orderData);
    
    // カートをクリア
    window.cartManager.items = [];
    window.cartManager.saveCart();
    window.cartManager.updateCartCount();
    
    // order-confirmation.htmlにリダイレクト
    window.location.href = 'order-confirmation.html';
}

// 注文番号の生成
function generateOrderNumber() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `PP-${timestamp}-${random}`;
}
