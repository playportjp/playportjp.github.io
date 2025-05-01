// order-confirmation.js - 注文確認画面の機能管理

document.addEventListener('DOMContentLoaded', function() {
    console.log('Order confirmation page loaded');
    
    // カート情報をロード（共通）
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
    }
    
    // localStorageから注文データを取得
    // キーの名前を 'current-order' に修正
    const orderData = JSON.parse(localStorage.getItem('current-order'));
    
    console.log('Order data retrieved:', orderData);
    
    if (!orderData) {
        console.warn('No order data found, redirecting to index page');
        // 注文データがない場合はインデックスページにリダイレクト
        window.location.href = 'index.html';
        return;
    }
    
    // 注文情報を表示
    displayOrderInformation(orderData);
    
    // 配送情報を表示
    displayShippingInformation(orderData);
    
    // 注文アイテムを表示
    displayOrderItems(orderData);
    
    // 注文合計を表示
    displayOrderSummary(orderData);
    
    // 「Continue Shopping」ボタンのイベントリスナーを設定
    const continueShoppingBtn = document.querySelector('.actions .btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            // 現在の注文データをクリア（一度だけ表示するため）
            localStorage.removeItem('current-order');
        });
    }
});

// 注文情報を表示
function displayOrderInformation(orderData) {
    // console.log('Displaying order information:', orderData);
    
    // 注文番号の表示
    const orderNumberElement = document.getElementById('order-number');
    if (orderNumberElement && orderData.number) {
        orderNumberElement.textContent = orderData.number;
    }
    
    // 注文日の表示
    const orderDateElement = document.getElementById('order-date');
    if (orderDateElement && orderData.date) {
        orderDateElement.textContent = orderData.date;
    }
    
    // 支払い方法の表示
    const paymentMethodElement = document.getElementById('payment-method');
    if (paymentMethodElement && orderData.paymentMethod) {
        // 支払い方法のマッピング
        const paymentMethodMap = {
            'credit-card': 'Credit Card',
            'paypal': 'PayPal',
            'bank-transfer': 'Bank Transfer'
        };
        
        paymentMethodElement.textContent = paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod;
    }
}

// 配送情報を表示
function displayShippingInformation(orderData) {
    // console.log('Displaying shipping information:', orderData);
    
    // 名前の表示
    const nameElement = document.getElementById('shipping-name');
    if (nameElement) {
        nameElement.textContent = orderData.fullName || 'N/A';
    }
    
    // 住所の表示
    const addressElement = document.getElementById('shipping-address');
    if (addressElement) {
        addressElement.textContent = orderData.shippingAddress || 'N/A';
    }
    
    // 都市の表示
    const cityElement = document.getElementById('shipping-city');
    if (cityElement) {
        const city = orderData.shippingCity || '';
        const postalCode = orderData.shippingPostalCode || '';
        cityElement.textContent = city && postalCode ? `${city}, ${postalCode}` : (city || postalCode || 'N/A');
    }
    
    // 国の表示
    const countryElement = document.getElementById('shipping-country');
    if (countryElement) {
        // 国コードのマッピング
        const countryMap = {
            'CA': 'Canada',
            'US': 'United States',
            'JP': 'Japan',
            'UK': 'United Kingdom',
            'GB': 'United Kingdom',
            'AU': 'Australia',
            'DE': 'Germany',
            'FR': 'France'
        };
        
        countryElement.textContent = countryMap[orderData.shippingCountry] || orderData.shippingCountry || 'N/A';
    }
}

// 注文アイテムを表示
function displayOrderItems(orderData) {
    const orderedItemsContainer = document.getElementById('ordered-items');
    if (!orderedItemsContainer) return;
    
    // console.log('Displaying order items:', orderData.details?.items);
    
    // 注文アイテムがない場合
    if (!orderData.details || !orderData.details.items || orderData.details.items.length === 0) {
        orderedItemsContainer.innerHTML = '<p>No items in this order.</p>';
        return;
    }
    
    let html = '';
    
    // 各アイテムのHTMLを生成
    orderData.details.items.forEach(item => {
        // 画像の有無を確認
        const hasImage = item.image ? true : false;
        
        html += `
            <div class="order-item">
                <div class="item-image">
                    ${hasImage 
                        ? `<img src="${item.image}" alt="${item.name}">` 
                        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>`
                    }
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price} ${item.quantity}</div>
                </div>
            </div>
        `;
    });
    
    orderedItemsContainer.innerHTML = html;
}

// 注文合計を表示
function displayOrderSummary(orderData) {
    // console.log('Displaying order summary:', orderData.details?.totals);
    
    // 注文合計がない場合
    if (!orderData.details || !orderData.details.totals) return;
    
    const totals = orderData.details.totals;
    
    // 小計
    const subtotalElement = document.getElementById('summary-subtotal');
    if (subtotalElement && totals['Subtotal']) {
        subtotalElement.textContent = totals['Subtotal'];
    }
    
    // 送料
    const shippingElement = document.getElementById('summary-shipping');
    if (shippingElement && totals['Shipping']) {
        shippingElement.textContent = totals['Shipping'];
    }
    
    // 税金
    const taxElement = document.getElementById('summary-tax');
    if (taxElement && totals['Tax']) {
        taxElement.textContent = totals['Tax'];
    }
    
    // 合計
    const totalElement = document.getElementById('summary-total');
    if (totalElement && totals['Total']) {
        totalElement.textContent = totals['Total'];
    }
}

// このコードを確認するための表示
console.log('order-confirmation.js loaded successfully');
