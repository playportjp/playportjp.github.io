/**
 * common.js - サイト共通のJavaScript機能
 */

// カートの状態管理
class CartManager {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    // ローカルストレージからカート情報を読み込む
    loadCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('カートの読み込みエラー:', error);
            return [];
        }
    }

    // カートをローカルストレージに保存
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('カートの保存エラー:', error);
        }
    }

    // 商品をカートに追加
    addItem(product) {
        // すでにカートに同じ商品があるか確認
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // 既存の商品の数量を増やす
            existingItem.quantity += 1;
        } else {
            // 新しい商品をカートに追加
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        
        // カスタムイベントの発火（他のJSファイルでリッスンできるように）
        const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
        document.dispatchEvent(event);
    }

    // カートから商品を削除
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        
        this.saveCart();
        this.updateCartCount();
        
        // カスタムイベントの発火
        const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
        document.dispatchEvent(event);
    }
    
    // 商品の数量を更新
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                // 数量が0以下なら商品を削除
                this.removeItem(productId);
            } else {
                // 数量を更新
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                
                // カスタムイベントの発火
                const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
                document.dispatchEvent(event);
            }
        }
    }
    
    // カートの合計金額を計算
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // カートの商品数を更新
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// 検索機能
class SearchManager {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        // 検索フォームのイベントリスナーを設定
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
    }
    
    handleSearch(event) {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim() === '') {
            event.preventDefault();
            // 空の検索を防止
            alert('検索キーワードを入力してください');
        }
    }
}

// ニュースレター購読
class NewsletterManager {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleSubscribe.bind(this));
        }
    }
    
    handleSubscribe(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && this.validateEmail(emailInput.value)) {
            // 実際のAPI呼び出しをここに実装（現在はモック）
            this.subscribeToNewsletter(emailInput.value)
                .then(() => {
                    alert('ニュースレターに登録しました！');
                    emailInput.value = '';
                })
                .catch(error => {
                    console.error('登録エラー:', error);
                    alert('登録中にエラーが発生しました。後でもう一度お試しください。');
                });
        } else {
            alert('有効なメールアドレスを入力してください');
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ニュースレター登録のモック関数（実際はAPIを使用する）
    subscribeToNewsletter(email) {
        return new Promise((resolve) => {
            // API呼び出しをシミュレート
            setTimeout(() => {
                console.log(`メールアドレス ${email} をニュースレターに登録`);
                resolve();
            }, 500);
        });
    }
}

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', () => {
    // インスタンス化して機能を有効化
    window.cartManager = new CartManager();
    window.searchManager = new SearchManager();
    window.newsletterManager = new NewsletterManager();
    
    // 「カートに追加」ボタンのイベントリスナーを設定
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            // 商品情報を取得（data属性から取得するか、親要素から取得）
            const productCard = this.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('.product-details h3').textContent,
                    price: parseFloat(productCard.dataset.productPrice || '0'),
                    image: productCard.dataset.productImage || ''
                };
                
                // カートに追加
                window.cartManager.addItem(product);
                
                // 視覚的フィードバック
                this.textContent = '追加しました！';
                setTimeout(() => {
                    this.textContent = 'カートに追加';
                }, 1500);
            }
        });
    });
});
