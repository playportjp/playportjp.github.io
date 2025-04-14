// common.js - 共通で使用される関数やオブジェクト

// カート管理機能
window.cartManager = {
    items: [],
    
    // カートにアイテムを追加
    addItem: function(productId, name, price, image, quantity = 1) {
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: name,
                price: price,
                image: image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        console.log(`Added to cart: ${name}`);
    },
    
    // カートを保存
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // カートを読み込み
    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    },
    
    // カート数を更新
    updateCartCount: function() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
            cartCountElement.textContent = itemCount;
        }
    },
    
    // カート内のアイテムの数量を更新
    updateQuantity: function(productId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity = quantity;
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
        }
    },
    
    // カートからアイテムを削除
    removeItem: function(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartCount();
            
            // カート更新イベントを発火
            document.dispatchEvent(new CustomEvent('cart:updated'));
        }
    }
};

// DOM読み込み完了時にカート情報を読み込む
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
    
    // カート情報を読み込み、カウントを更新
    window.cartManager.loadCart();
    window.cartManager.updateCartCount();
});
