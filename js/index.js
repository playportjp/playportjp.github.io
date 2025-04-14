// カート管理の基本機能
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
    }
};

// 商品データを取得して表示
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('商品データの取得に失敗しました');
        }
        
        const products = await response.json();
        displayFeaturedProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// おすすめ商品を表示
function displayFeaturedProducts(products) {
    // 最初の6商品を表示
    const featuredProducts = products.slice(0, 6);
    const productGrid = document.querySelector('.featured-products .product-grid');
    
    if (!productGrid) return;
    
    // 既存のハードコードされた商品カードをクリア
    productGrid.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-product-id="${product.id}" data-product-price="${product.price}" data-product-image="${product.image}">
                <div class="product-image" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="product-condition">${product.new ? 'New' : 'Good condition'}</p>
                    <p class="product-price">${product.price.toFixed(2)} CAD</p>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.innerHTML += productCard;
    });
    
    // カートボタンにイベントリスナーを追加
    addToCartListeners();
}

// カートボタンにイベントリスナーを追加
function addToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const image = this.dataset.image;
            
            window.cartManager.addItem(productId, name, price, image);
            
            // 追加アニメーション
            this.textContent = 'Added to Cart!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1500);
        });
    });
}

// ページロード時の処理
document.addEventListener('DOMContentLoaded', function() {
    // カートをロード
    window.cartManager.loadCart();
    window.cartManager.updateCartCount();
    
    // 商品を取得して表示
    loadProducts();
});
