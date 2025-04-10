// order-confirmation.js - 注文確認ページのJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // localStorage から注文データを取得
    const orderDataJson = localStorage.getItem('currentOrder');
    
    if (!orderDataJson) {
        // 注文データがない場合はホームページにリダイレクト
        window.location.href = 'index.html';
        return;
    }
    
    // 注文データをJSONからパース
    const orderData = JSON.parse(orderDataJson);
    
    // 注文詳細を表示
    displayOrderDetails(orderData);
    
    // 印刷ボタンのイベントリスナーを設定
    const printButton = document.getElementById('print-order');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
});

/**
 * 注文詳細を表示する関数
 */
function displayOrderDetails(orderData) {
    // 注文番号と日付を表示
    document.getElementById('confirmation-order-number').textContent = orderData.orderNumber || 'Unknown';
    
    // 日付をフォーマット
    const orderDate = new Date(orderData.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('confirmation-order-date').textContent = formattedDate;
    
    // 注文アイテムを表示
    displayOrderItems(orderData.items);
    
    // 注文サマリーを表示
    displayOrderSummary(orderData.summary);
    
    // 顧客情報を表示
    displayCustomerInfo(orderData.customerInfo);
    
    // 支払い方法を表示
    document.getElementById('confirmation-payment').textContent = orderData.paymentMethod || 'Email Order';
    
    // 注文ノートを表示
    const notesSection = document.getElementById('confirmation-notes-section');
    const notesContent = document.getElementById('confirmation-notes');
    
    if (orderData.customerInfo && orderData.customerInfo.notes) {
        notesContent.textContent = orderData.customerInfo.notes;
    } else {
        // 注文ノートがない場合はセクションを非表示
        if (notesSection) {
            notesSection.style.display = 'none';
        }
    }
}

/**
 * 注文アイテムを表示する関数
 */
function displayOrderItems(items) {
    const itemsContainer = document.getElementById('confirmation-items');
    if (!itemsContainer) return;
    
    let html = '';
    
    if (!items || items.length === 0) {
        itemsContainer.innerHTML = '<p>No items in this order.</p>';
        return;
    }
    
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        html += `
            <div class="confirmation-item">
                <div class="confirmation-item-details">
                    <h3>${item.name}</h3>
                    <div class="confirmation-item-meta">
                        <span class="confirmation-item-price">${item.price.toFixed(2)} CAD</span>
                        <span class="confirmation-item-quantity">x ${item.quantity}</span>
                    </div>
                </div>
                <div class="confirmation-item-total">
                    ${itemTotal.toFixed(2)} CAD
                </div>
            </div>
        `;
    });
    
    itemsContainer.innerHTML = html;
}

/**
 * 注文サマリーを表示する関数
 */
function displayOrderSummary(summary) {
    if (!summary) return;
    
    // 小計を表示
    if (summary.subtotal !== undefined) {
        document.getElementById('confirmation-subtotal').textContent = `${summary.subtotal.toFixed(2)} CAD`;
    }
    
    // 税金を表示
    if (summary.tax !== undefined) {
        document.getElementById('confirmation-tax').textContent = `${summary.tax.toFixed(2)} CAD`;
    }
    
    // 送料を表示
    if (summary.shipping !== undefined) {
        document.getElementById('confirmation-shipping').textContent = `${summary.shipping.toFixed(2)} CAD`;
    }
    
    // 合計を表示
    if (summary.total !== undefined) {
        document.getElementById('confirmation-total').textContent = `${summary.total.toFixed(2)} CAD`;
    }
}

/**
 * 顧客情報を表示する関数
 */
function displayCustomerInfo(customerInfo) {
    if (!customerInfo) return;
    
    // 名前を表示
    if (customerInfo.name) {
        document.getElementById('confirmation-name').textContent = customerInfo.name;
    }
    
    // 住所を表示
    if (customerInfo.address) {
        document.getElementById('confirmation-address').textContent = customerInfo.address;
    }
    
    // 都市を表示
    if (customerInfo.city) {
        document.getElementById('confirmation-city').textContent = customerInfo.city;
    }
    
    // 郵便番号を表示
    if (customerInfo.postalCode) {
        document.getElementById('confirmation-postal').textContent = customerInfo.postalCode;
    }
    
    // 国を表示
    if (customerInfo.country) {
        document.getElementById('confirmation-country').textContent = customerInfo.country;
    }
    
    // 電話番号を表示
    if (customerInfo.phone) {
        document.getElementById('confirmation-phone').textContent = customerInfo.phone;
    }
    
    // メールアドレスを表示
    if (customerInfo.email) {
        document.getElementById('confirmation-email').textContent = customerInfo.email;
    }
}
