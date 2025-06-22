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
            // エラー時のフォールバック表示
            displayErrorMessage();
        });
}

// エラーメッセージの表示
function displayErrorMessage() {
    const productGrid = document.querySelector('.featured-products .product-grid');
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>製品の読み込みに失敗しました</h3>
                <p>しばらくしてから再度お試しください。</p>
            </div>
        `;
    }
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
        
        // 商品カードを作成
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        productCard.setAttribute('data-product-name', product.name);
        productCard.setAttribute('data-product-price', product.price);
        productCard.setAttribute('data-product-image', product.image || '');
        
        // 商品カードの内容を設定
        productCard.innerHTML = `
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
        `;
        
        // 商品カードをグリッドに追加
        productGrid.appendChild(productCard);
        
        // カートに追加ボタンのイベントリスナーを設定
        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', function(event) {
            // リンクのナビゲーションを防止
            event.preventDefault();
            event.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            const productData = {
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image || ''
            };
            
            // カートマネージャーが利用可能な場合
            if (window.cartManager) {
                window.cartManager.addItem(
                    productData.id,
                    productData.name,
                    productData.price,
                    productData.image
                );
                
                // ボタンのフィードバック
                const originalText = this.textContent;
                this.textContent = 'Added!';
                this.style.backgroundColor = '#16a34a';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 1500);
                
                // カート追加のフィードバック（common.jsの関数を使用）
                if (typeof showCartFeedback === 'function') {
                    showCartFeedback();
                }
            } else {
                console.warn('Cart manager not available');
                // フォールバック: アラート表示
                alert(`${productData.name} added to cart!`);
            }
        });
        
        // Googleリンククリックのイベント伝播を防止
        const googleLink = productCard.querySelector('.search-image-link');
        googleLink.addEventListener('click', function(event) {
            event.stopPropagation();
        });
        
        // 商品詳細ボタンのイベント伝播を防止
        const detailsButton = productCard.querySelector('.btn-secondary');
        detailsButton.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // 商品カードのクリックイベントを設定
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
                if (productId) {
                    window.location.href = `product-detail.html?id=${productId}`;
                }
            }
        });
    });
}
