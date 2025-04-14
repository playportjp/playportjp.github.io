document.addEventListener('DOMContentLoaded', function() {
    // 商品データを取得して表示
    loadProducts();
    
    // カートの初期化
    initializeCart();
});

// カート機能の初期化
function initializeCart() {
    if (!window.cartManager) {
        window.cartManager = {
            items: [],
            addItem: function(productId, name, price, image, quantity = 1) {
                console.log(`Adding to cart: ${name}`);
                // カートに追加するロジック
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    let count = parseInt(cartCount.textContent || '0');
                    cartCount.textContent = count + 1;
                }
            }
        };
    }
}

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
    // 最初の商品だけを表示（シンプルにするため）
    const firstProduct = products[0];
    console.log('Displaying product:', firstProduct);
    
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) {
        console.error('Product grid element not found');
        return;
    }
    
    // Grid内のすべての要素を削除
    productGrid.innerHTML = '';
    
    // 1つの商品を表示
    const productHtml = `
        <div class="product-card" data-product-id="${firstProduct.id}">
            <div class="product-image">
                <img src="${firstProduct.image}" alt="${firstProduct.name}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="product-details">
                <h3>${firstProduct.name}</h3>
                <p class="product-condition">${firstProduct.new ? 'New' : 'Good condition'}</p>
                <p class="product-price">${firstProduct.price.toFixed(2)} CAD</p>
                <button class="add-to-cart" data-id="${firstProduct.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    productGrid.innerHTML = productHtml;
    
    // カートボタンにイベントリスナーを追加
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const product = products.find(p => p.id === productId);
            
            if (product) {
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
