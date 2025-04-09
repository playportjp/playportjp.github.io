// checkout.js - チェックアウトページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // カートからアイテムを取得して表示
    displayCheckoutItems();
    
    // 注文フォームの送信処理
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }
});

// チェックアウトアイテムの表示
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const cartItems = CartManager.getItems();
    
    // カートが空の場合
    if (cartItems.length === 0) {
        checkoutItems.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
        updateOrderTotals(0);
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
                <div class="checkout-item-image"></div>
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
    const total = subtotal + shipping;
    
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} CAD`;
    document.getElementById('checkout-shipping').textContent = `${shipping.toFixed(2)} CAD`;
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} CAD`;
}

// 注文フォーム送信処理
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // フォームデータの取得
    const formData = new FormData(e.target);
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
        items: CartManager.getItems(),
        paymentMethod: formData.get('payment-method'),
        orderDate: new Date().toISOString()
    };
    
    // 注文処理（デモ用）
    console.log('Order submitted:', orderData);
    
    // 注文確認表示
    alert('Thank you for your order! This is a demonstration site, so no actual order has been placed.');
    
    // カートをクリア
    CartManager.clearCart();
    
    // 注文完了ページまたはホームページにリダイレクト
    window.location.href = 'index.html';
}
