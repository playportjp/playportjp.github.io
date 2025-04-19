document.addEventListener('DOMContentLoaded', function() {
    // localStorageから注文データを取得
    const orderData = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!orderData) {
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
});

// 注文情報を表示
function displayOrderInformation(orderData) {
    document.getElementById('order-number').textContent = orderData.orderNumber;
    
    // 日付をフォーマット
    const orderDate = new Date(orderData.orderDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('order-date').textContent = orderDate.toLocaleDateString('en-US', options);
    
    // 支払い方法
    const paymentMethodMap = {
        'credit': 'Credit Card',
        'paypal': 'PayPal'
    };
    document.getElementById('payment-method').textContent = paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod;
}

// 配送情報を表示
function displayShippingInformation(orderData) {
    const customerInfo = orderData.customerInfo;
    
    document.getElementById('shipping-name').textContent = customerInfo.name;
    document.getElementById('shipping-address').textContent = customerInfo.address;
    document.getElementById('shipping-city').textContent = `${customerInfo.city}, ${customerInfo.postalCode}`;
    
    // 国のフルネームに変換
    const countryMap = {
        'CA': 'Canada',
        'US': 'United States',
        'JP': 'Japan',
        'GB': 'United Kingdom',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France'
    };
    document.getElementById('shipping-country').textContent = countryMap[customerInfo.country] || customerInfo.country;
}

// 注文アイテムを表示
function displayOrderItems(orderData) {
    const orderedItemsContainer = document.getElementById('ordered-items');
    let html = '';
    
    orderData.items.forEach(item => {
        html += `
            <div class="order-item">
                <div class="item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price.toFixed(2)} CAD x ${item.quantity}</div>
                </div>
            </div>
        `;
    });
    
    orderedItemsContainer.innerHTML = html;
}

// 注文合計を表示
function displayOrderSummary(orderData) {
    const summary = orderData.summary;
    
    document.getElementById('summary-subtotal').textContent = `${summary.subtotal.toFixed(2)} CAD`;
    document.getElementById('summary-shipping').textContent = `${summary.shipping === 0 ? 'Free' : summary.shipping.toFixed(2) + ' CAD'}`;
    document.getElementById('summary-tax').textContent = `${summary.tax.toFixed(2)} CAD`;
    document.getElementById('summary-total').textContent = `${summary.total.toFixed(2)} CAD`;
}
