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
        
        // カテゴリータグのHTMLを生成
        let categoryTagHtml = '';
        if (product.category) {
            const categoryClass = product.category.toLowerCase().replace(/\s+/g, '-');
            categoryTagHtml += `<span class="meta-tag ${categoryClass}">${product.category}</span>`;
        }
        if (product.subcategory) {
            categoryTagHtml += `<span class="meta-tag other">${product.subcategory}</span>`;
        }
        
        // 商品の状態バッジを生成
        const conditionBadgeClass = product.new ? 'new' : 'used';
        const conditionBadgeText = product.new ? 'NEW' : 'USED';
        
        // 在庫状況を生成
        let stockStatusClass = 'in-stock';
        let stockStatusText = 'In Stock';
        
        if (product.stock !== undefined && product.stock <= 0) {
            stockStatusClass = 'out-of-stock';
            stockStatusText = 'Out of Stock';
        }
        
        // 商品画像の表示を決定
        const imageStyle = product.image 
            ? `background-image: url('${product.image}'); background-size: cover; background-position: center;` 
            : '';
        
        const imageContent = product.image
            ? ''
            : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bb0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <div>No Image</div>
            `;
        
        const productHtml = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="image-placeholder" style="${imageStyle}">
                    ${!product.image ? imageContent : ''}
                    <a href="https://www.google.com/search?q=${encodeURIComponent(product.name)}&tbm=isch" class="search-image-link" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Google
                    </a>
                </div>
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        ${categoryTagHtml}
                    </div>
                    <div class="product-condition">
                        <span class="condition-badge ${conditionBadgeClass}">${conditionBadgeText}</span>
                        <span class="stock-status ${stockStatusClass}">${stockStatusText}</span>
                    </div>
                    <p class="product-price">${product.price.toFixed(2)} CAD</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">Details</a>
                    </div>
                </div>
            </div>
        `;
        
        productGrid.innerHTML += productHtml;
    }
    
    // 商品カードのイベントリスナーを設定
    setupProductCardEvents();
}

// 商品カードのイベントリスナーを設定
function setupProductCardEvents() {
    // 商品カードのクリックイベントを設定
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // イベントターゲットがボタンやGoogle検索リンクでない場合
            if (!event.target.closest('.add-to-cart') && 
                !event.target.closest('.btn-secondary') && 
                !event.target.closest('.search-image-link')) {
                
                const productId = this.getAttribute('data-product-id');
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
    
    // Googleリンククリックのイベント伝播を防止
    const googleLinks = document.querySelectorAll('.search-image-link');
    googleLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
    
    // カートボタンにイベントリスナーを追加
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // リンクのナビゲーションを防止
            event.preventDefault();
            event.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const product = {
                id: productId,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent),
                image: productCard.querySelector('.image-placeholder').style.backgroundImage.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1')
            };
            
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
                
                // 追加：右下に通知を表示（common.jsのshowAddedToCartFeedback関数を呼び出し）
                if (typeof showAddedToCartFeedback === 'function') {
                    showAddedToCartFeedback(productCard);
                }
            }
        });
    });
}
