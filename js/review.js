// review.js - PlayPortJP 注文確認ページ用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const shippingInfoElement = document.getElementById('shipping-info');
    const paymentInfoElement = document.getElementById('payment-info');
    const orderItemsElement = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingFeeElement = document.getElementById('shipping-fee');
    const totalElement = document.getElementById('total');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const placeOrderButton = document.getElementById('place-order-button');
    const backButton = document.getElementById('back-button');
    const editShippingButton = document.getElementById('edit-shipping-btn');
    const editPaymentButton = document.getElementById('edit-payment-btn');
    const progressBar = document.querySelector('.progress-bar-filled');

    // 進捗バーの更新（チェックアウトフローの3ステップ目なので75%）
    progressBar.style.width = '75%';

    // セッションストレージからデータを取得
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const shippingData = JSON.parse(sessionStorage.getItem('shippingData')) || {};
    const paymentData = JSON.parse(sessionStorage.getItem('paymentData')) || {};

    // データが存在しない場合は前のページにリダイレクト
    if (cartItems.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    if (Object.keys(shippingData).length === 0) {
        window.location.href = 'checkout.html';
        return;
    }

    if (Object.keys(paymentData).length === 0) {
        window.location.href = 'checkout-payment.html';
        return;
    }

    // 配送情報を表示
    function displayShippingInfo() {
        shippingInfoElement.innerHTML = `
            <p><strong>${shippingData.firstName} ${shippingData.lastName}</strong></p>
            <p>${shippingData.address1}</p>
            ${shippingData.address2 ? `<p>${shippingData.address2}</p>` : ''}
            <p>${shippingData.city}, ${shippingData.prefecture} ${shippingData.postalCode}</p>
            <p>電話番号: ${shippingData.phone}</p>
            <p>Eメール: ${shippingData.email}</p>
        `;
    }

    // 支払い情報を表示
    function displayPaymentInfo() {
        let paymentMethodText = '';
        let paymentDetails = '';

        switch (paymentData.method) {
            case 'credit-card':
                paymentMethodText = 'クレジットカード';
                // カード番号の下4桁のみ表示
                const lastFourDigits = paymentData.cardNumber.replace(/\s/g, '').slice(-4);
                paymentDetails = `
                    <p>${paymentData.cardName}</p>
                    <p>カード番号: **** **** **** ${lastFourDigits}</p>
                    <p>有効期限: ${paymentData.cardExpiry}</p>
                `;
                break;
            case 'convenience':
                paymentMethodText = 'コンビニ決済';
                paymentDetails = `
                    <p>${paymentData.name}</p>
                    <p>Eメール: ${paymentData.email}</p>
                    <p>電話番号: ${paymentData.phone}</p>
                `;
                break;
            case 'bank-transfer':
                paymentMethodText = '銀行振込';
                paymentDetails = `
                    <p>${paymentData.name}</p>
                    <p>Eメール: ${paymentData.email}</p>
                    <p>お支払い期限: 7日以内</p>
                `;
                break;
            default:
                paymentMethodText = '不明な支払い方法';
        }

        paymentInfoElement.innerHTML = `
            <p><strong>${paymentMethodText}</strong></p>
            ${paymentDetails}
        `;
    }

    // 注文内容を表示
    function displayOrderItems() {
        if (cartItems.length === 0) {
            orderItemsElement.innerHTML = '<p>カートに商品がありません。</p>';
            return;
        }

        let orderItemsHTML = '';
        cartItems.forEach(item => {
            orderItemsHTML += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-title">${item.name}</div>
                        <div class="order-item-price">¥${item.price.toLocaleString()}</div>
                        <div class="order-item-quantity">数量: ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">¥${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            `;
        });

        orderItemsElement.innerHTML = orderItemsHTML;
    }

    // 注文合計を計算して表示
    function calculateAndDisplayTotals() {
        // 小計を計算
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // 消費税（10%）
        const tax = Math.floor(subtotal * 0.1);
        
        // 配送料（一律¥800、合計が¥10,000以上で無料）
        const shippingFee = subtotal >= 10000 ? 0 : 800;
        
        // 合計
        const total = subtotal + tax + shippingFee;
        
        // 表示を更新
        subtotalElement.textContent = `¥${subtotal.toLocaleString()}`;
        taxElement.textContent = `¥${tax.toLocaleString()}`;
        shippingFeeElement.textContent = subtotal >= 10000 ? '無料' : `¥${shippingFee.toLocaleString()}`;
        totalElement.textContent = `¥${total.toLocaleString()}`;
        
        // 合計金額をセッションストレージに保存（注文完了ページで使用）
        sessionStorage.setItem('orderTotal', total);
    }

    // 表示関数を呼び出し
    displayShippingInfo();
    displayPaymentInfo();
    displayOrderItems();
    calculateAndDisplayTotals();

    // 利用規約のチェックボックスのイベントリスナー
    termsCheckbox.addEventListener('change', function() {
        placeOrderButton.disabled = !this.checked;
    });

    // 「戻る」ボタンのイベントリスナー
    backButton.addEventListener('click', function() {
        window.location.href = 'checkout-payment.html';
    });

    // 編集ボタンのイベントリスナー
    editShippingButton.addEventListener('click', function() {
        window.location.href = 'checkout.html';
    });

    editPaymentButton.addEventListener('click', function() {
        window.location.href = 'checkout-payment.html';
    });

    // 注文確定ボタンのイベントリスナー
    placeOrderButton.addEventListener('click', function() {
        if (!termsCheckbox.checked) {
            return;
        }

        // 注文情報をセッションストレージに保存
        const orderData = {
            items: cartItems,
            shipping: shippingData,
            payment: paymentData,
            orderDate: new Date().toISOString(),
            orderNumber: generateOrderNumber()
        };

        sessionStorage.setItem('orderData', JSON.stringify(orderData));
        
        // カートをクリア
        sessionStorage.removeItem('cartItems');
        
        // 注文完了ページへリダイレクト
        window.location.href = 'checkout-complete.html';
    });

    // 注文番号を生成する関数
    function generateOrderNumber() {
        const prefix = 'PP';
        const timestamp = new Date().getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }
});
