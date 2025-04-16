// checkout.js - チェックアウトページ用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    // カートからアイテムを取得して表示
    displayCheckoutItems();
    
    // 注文フォームの送信処理
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // フォームフィールドのリアルタイムバリデーション設定
    setupFormValidation();
});

// チェックアウトアイテムの表示
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    
    // CartManagerからアイテムを取得（common.jsとの互換性を確保）
    const cartItems = window.cartManager ? window.cartManager.items : [];
    
    // カートが空の場合
    if (!cartItems || cartItems.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
        updateOrderTotals(0);
        
        // 注文ボタンを無効化
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
        return;
    }
    
    // カート内の商品を表示
    let html = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // 商品名が長い場合にはタイトル属性を使用して、ホバー時に完全な名前を表示できるようにする
        const itemName = item.name || 'Unknown Item';
        
        html += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${itemName}">` : `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bb0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.01.15v6.52c0 1.66 1.34 3 3 3h14.64c1.66 0 3-1.34 3-3v-6.52c0-.049-.004-.098-.01-.15A4 4 0 0017.32 5z"></path>
                    </svg>
                    `}
                </div>
                <div class="checkout-item-details">
                    <div class="checkout-item-title" title="${itemName}">${itemName}</div>
                    <div class="checkout-item-meta">
                        ${item.condition ? item.condition : ''} 
                        ${item.platform ? ' | ' + item.platform : ''}
                    </div>
                    <div class="checkout-item-price">
                        <span>Qty: ${item.quantity}</span>
                        <span class="price">${item.price.toFixed(2)} CAD</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = html;
    updateOrderTotals(subtotal);
}

// 注文合計の更新 - パフォーマンス最適化版
function updateOrderTotals(subtotal) {
    // 値固定の設定値をより明確に
    const shipping = 15.00; // 固定送料
    const taxRate = 0.05; // 5%の税金（GST/HST相当）
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    // DOM操作の最小化
    const elements = {
        subtotal: document.getElementById('checkout-subtotal'),
        shipping: document.getElementById('checkout-shipping'),
        tax: document.getElementById('checkout-tax'),
        total: document.getElementById('checkout-total')
    };
    
    // フォーマット関数を定義（国際化対応の準備）
    const formatCurrency = (value) => `${value.toFixed(2)} CAD`;
    
    // 更新処理
    if (elements.subtotal) elements.subtotal.textContent = formatCurrency(subtotal);
    if (elements.shipping) elements.shipping.textContent = formatCurrency(shipping);
    if (elements.tax) elements.tax.textContent = formatCurrency(tax);
    if (elements.total) elements.total.textContent = formatCurrency(total);
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
            
            // 入力中のエラー修正時に即時バリデーション
            field.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        }
    });
    
    // メールアドレスの特別なバリデーション
    const emailField = document.querySelector('[name="email"]');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
        
        // 入力中のエラー修正時に即時バリデーション
        emailField.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateEmail(this);
            }
        });
    }
}

// 個別フィールドのバリデーション
function validateField(field) {
    // エラーメッセージを管理する要素を取得
    let errorElement = field.nextElementSibling;
    const isErrorElement = errorElement && errorElement.classList.contains('error-message');
    
    // 新しいエラー要素の作成関数
    const createErrorElement = (message) => {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        return error;
    };
    
    // 値がない場合はエラー
    if (!field.value.trim()) {
        field.classList.add('invalid');
        
        if (isErrorElement) {
            errorElement.textContent = 'This field is required';
            errorElement.style.display = 'block';
        } else {
            errorElement = createErrorElement('This field is required');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        return false;
    } else {
        field.classList.remove('invalid');
        if (isErrorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// メールアドレスのバリデーション - 改善版
function validateEmail(field) {
    // より堅牢なメールアドレス判定
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errorElement = field.nextElementSibling;
    const isErrorElement = errorElement && errorElement.classList.contains('error-message');
    
    // 新しいエラー要素の作成関数
    const createErrorElement = (message) => {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        return error;
    };
    
    // 値がない場合はエラー
    if (!field.value.trim()) {
        field.classList.add('invalid');
        
        if (isErrorElement) {
            errorElement.textContent = 'Email is required';
            errorElement.style.display = 'block';
        } else {
            errorElement = createErrorElement('Email is required');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        return false;
    } 
    // メールアドレスの形式が正しくない場合
    else if (!emailRegex.test(field.value)) {
        field.classList.add('invalid');
        
        if (isErrorElement) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
        } else {
            errorElement = createErrorElement('Please enter a valid email address');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        return false;
    } 
    // 正常な場合
    else {
        field.classList.remove('invalid');
        if (isErrorElement) {
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// フォーム全体のバリデーション - パフォーマンス改善版
function validateForm() {
    const requiredFields = [
        'full-name', 'email', 'address', 'city', 'postal-code', 'country', 'phone'
    ];
    
    // すべてのフィールドを一度に検証（配列を使用した効率的な処理）
    const validationResults = requiredFields.map(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return true; // フィールドが存在しない場合はスキップ
        
        // メールアドレス特有のバリデーション
        if (fieldName === 'email') {
            return validateEmail(field);
        } else {
            return validateField(field);
        }
    });
