// complete.js - PlayPortJP 注文完了ページ用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const orderNumberElement = document.getElementById('order-number');
    const orderDateElement = document.getElementById('order-date');
    const paymentMethodElement = document.getElementById('payment-method');
    const orderTotalElement = document.getElementById('order-total');
    const shippingAddressElement = document.getElementById('shipping-address');
    const continueShoppingButton = document.getElementById('continue-shopping-btn');
    const progressBar = document.querySelector('.progress-bar-filled');
    
    // 進捗バーの更新（チェックアウトフローの最終ステップなので100%）
    const progressBars = document.querySelectorAll('.progress-bar-filled');
    progressBars.forEach(bar => {
        bar.style.width = '100%';
    });
    
    // セッションストレージから注文データを取得
    const orderData = JSON.parse(sessionStorage.getItem('orderData'));
    
    // データがない場合はトップページにリダイレクト
    if (!orderData) {
        window.location.href = 'index.html';
        return;
    }
    
    // 注文番号を表示
    if (orderData.orderNumber) {
        orderNumberElement.textContent = orderData.orderNumber;
    }
    
    // 注文日を表示
    if (orderData.orderDate) {
        const orderDate = new Date(orderData.orderDate);
        const formattedDate = formatDate(orderDate);
        orderDateElement.textContent = formattedDate;
    }
    
    // 支払い方法を表示
    if (orderData.payment && orderData.payment.method) {
        let paymentMethodText;
        
        switch (orderData.payment.method) {
            case 'credit-card':
                paymentMethodText = 'クレジットカード';
                break;
            case 'convenience':
                paymentMethodText = 'コンビニ決済';
                break;
            case 'bank-transfer':
                paymentMethodText = '銀行振込';
                break;
            default:
                paymentMethodText = '不明な支払い方法';
        }
        
        paymentMethodElement.textContent = paymentMethodText;
    }
    
    // 注文合計金額を表示
    const orderTotal = sessionStorage.getItem('orderTotal');
    if (orderTotal) {
        orderTotalElement.textContent = `¥${parseInt(orderTotal).toLocaleString()}`;
    }
    
    // 配送先住所を表示
    if (orderData.shipping) {
        const shipping = orderData.shipping;
        
        let addressHTML = `
            <p><strong>${shipping.firstName} ${shipping.lastName}</strong></p>
            <p>${shipping.address1}</p>
        `;
        
        if (shipping.address2) {
            addressHTML += `<p>${shipping.address2}</p>`;
        }
        
        addressHTML += `
            <p>${shipping.city}, ${shipping.prefecture} ${shipping.postalCode}</p>
            <p>電話番号: ${shipping.phone}</p>
        `;
        
        shippingAddressElement.innerHTML = addressHTML;
    }
    
    // ショッピングを続けるボタンのイベントリスナー
    continueShoppingButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // 日付をフォーマットする関数
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    }
});
