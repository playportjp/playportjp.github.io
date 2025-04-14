document.addEventListener('DOMContentLoaded', function() {
    // 商品データを取得して表示
    loadProducts();
});

// 商品データを取得して表示
function loadProducts() {
    console.log('Loading products...');
    
    // データ取得
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(products => {
            console.log('Products loaded:', products.length);
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// 商品を表示
function displayProducts(products) {
    const productGrid = document.querySelector('.featured-products .product-grid');
    if (!productGrid) {
        console.error('Product grid element not found');
        return;
    }
    
    // Grid内のすべての要素を削除
    productGrid.innerHTML = '';
    
    // 表示する商品数を制限（必要に応じて変更）
    const displayCount = Math.min(6, products.length);
    
    // 商品カードを作成
    for (let i = 0; i < displayCount; i++) {
        const product = products[i];
        
        const productHtml = `
            <div class="product-card" data-product-id="${product.id}">
                <a href="product-detail.html?id=${product.id}" class="product-link">
                    <div class="product-image" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p class="product-condition">${product.new ? 'New' : 'Used'}</p>
                        <p class="product-price">${product.price.toFixed(2)} CAD</p>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </a>
            </div>
        `;
        
        productGrid.innerHTML += productHtml;
    }
    
    // カートボタンにイベントリスナーを追加
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // リンクのナビゲーションを防止
            event.preventDefault();
            event.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            
            if (product && window.cartManager) {
                window.cartManager.addItem(
                    product.id, 
                    product.name, 
                    product.price, 
                    product.image
                );
                
                // クリック時のフィードバック
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1000);
            }
        });
    });
}
