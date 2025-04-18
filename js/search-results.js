document.addEventListener('DOMContentLoaded', function() {
    // URLからパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const category = urlParams.get('category');
    
    // 検索クエリまたはカテゴリがある場合、それに基づいて表示
    if (searchQuery) {
        console.log('Search query found:', searchQuery);
        // 検索クエリを表示
        const searchInfoTitle = document.querySelector('.search-info h1');
        if (searchInfoTitle) {
            searchInfoTitle.textContent = `Search results for "${searchQuery}"`;
        }
        
        // 検索フォームに検索クエリを設定
        const searchInput = document.querySelector('.search-container input[type="search"]');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
        
        // 商品を検索して表示
        searchProducts(searchQuery);
    } else if (category) {
        console.log('Category filter found:', category);
        // カテゴリタイトルを表示
        const searchInfoTitle = document.querySelector('.search-info h1');
        if (searchInfoTitle) {
            // カテゴリ名の最初の文字を大文字に
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            searchInfoTitle.textContent = `Browse: ${categoryName}`;
        }
        
        // カテゴリフィルターを更新
        updateCategoryFilter(category);
        
        // カテゴリに基づいて商品を読み込む
        loadProductsByCategory(category);
    } else {
        console.log('No search query or category found, loading all products');
        // 検索クエリもカテゴリもない場合は全商品を表示
        loadAllProducts();
        
        // タイトルを更新
        const searchInfoTitle = document.querySelector('.search-info h1');
        if (searchInfoTitle) {
            searchInfoTitle.textContent = 'All Products';
        }
    }
    
    // フィルターとソートのイベントリスナーを設定
    setupFiltersAndSort();
});

// 商品を検索して表示
function searchProducts(query) {
    console.log('Searching products for query:', query);
    
    // データ取得
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(products => {
            console.log(`Loaded ${products.length} total products`);
            
            // 検索クエリに基づいて商品をフィルタリング
            const filteredProducts = filterProductsByQuery(products, query);
            console.log(`Found ${filteredProducts.length} products matching query "${query}"`);
            
            // デバッグ: フィルタリングされた商品の名前をログに出力
            if (filteredProducts.length > 0) {
                console.log('Filtered products:', filteredProducts.map(p => p.name));
            }
            
            // 検索結果数を更新
            updateResultCount(filteredProducts.length);
            
            // 商品を表示
            displaySearchResults(filteredProducts);
        })
        .catch(error => {
            console.error('Error searching products:', error);
            document.querySelector('.results-grid').innerHTML = `
                <div class="error-message">
                    <h2>検索に失敗しました</h2>
                    <p>${error.message}</p>
                    <a href="index.html" class="btn btn-primary">トップページに戻る</a>
                </div>
            `;
        });
}

// カテゴリフィルターを更新
function updateCategoryFilter(category) {
    // カテゴリフィルターオプションを取得
    const categoryFilters = document.querySelectorAll('.filter-group:nth-child(1) .filter-option');
    
    // すべてのフィルターからアクティブクラスを削除
    categoryFilters.forEach(filter => {
        filter.classList.remove('active');
    });
    
    // 選択されたカテゴリに応じてフィルターをアクティブに
    categoryFilters.forEach(filter => {
        const filterText = filter.textContent.toLowerCase();
        
        if (filterText === category.toLowerCase() || 
            (filterText === 'all' && category === 'all')) {
            filter.classList.add('active');
        }
    });
}

// カテゴリに基づいて商品を読み込む
function loadProductsByCategory(category) {
    console.log('Loading products for category:', category);
    
    // データ取得
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(products => {
            console.log(`Loaded ${products.length} total products`);
            
            // カテゴリに基づいて商品をフィルタリング
            const filteredProducts = filterProductsByCategory(products, category);
            console.log(`Found ${filteredProducts.length} products in category "${category}"`);
            
            // デバッグ: フィルタリングされた商品の名前をログに出力
            if (filteredProducts.length > 0) {
                console.log('Filtered products:', filteredProducts.map(p => p.name));
            }
            
            // 検索結果数を更新
            updateResultCount(filteredProducts.length);
            
            // 商品を表示
            displaySearchResults(filteredProducts);
        })
        .catch(error => {
            console.error('Error loading products by category:', error);
            document.querySelector('.results-grid').innerHTML = `
                <div class="error-message">
                    <h2>カテゴリの読み込みに失敗しました</h2>
                    <p>${error.message}</p>
                    <a href="index.html" class="btn btn-primary">トップページに戻る</a>
                </div>
            `;
        });
}

// カテゴリに基づいて商品をフィルタリング
function filterProductsByCategory(products, category) {
    if (category === 'all') return products;
    
    return products.filter(product => {
        // カテゴリが一致する商品をフィルタリング
        // 注意: JSON内のカテゴリ名と一致する必要があります
        return product.category && product.category.toLowerCase() === category.toLowerCase();
    });
}

// 全商品を読み込み
function loadAllProducts() {
    console.log('Loading all products for search results');
    
    // データ取得
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(products => {
            console.log(`Loaded ${products.length} products`);
            
            // 検索結果数を更新
            updateResultCount(products.length);
            
            // 商品を表示
            displaySearchResults(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// 検索クエリに基づいて商品をフィルタリング
function filterProductsByQuery(products, query) {
    if (!query) return products;
    
    const searchTerms = query.toLowerCase().split(' ');
    console.log('Search terms:', searchTerms);
    
    return products.filter(product => {
        // 商品名、説明、カテゴリ、サブカテゴリを検索対象文字列として結合
        const searchableText = `
            ${product.name || ''} 
            ${product.description || ''} 
            ${product.category || ''} 
            ${product.subcategory || ''}
        `.toLowerCase();
        
        // いずれかの検索語が商品のテキストに含まれているかチェック
        return searchTerms.some(term => searchableText.includes(term));
    });
}

// 検索結果数を更新
function updateResultCount(count) {
    const searchInfoText = document.querySelector('.search-info p');
    if (searchInfoText) {
        searchInfoText.textContent = `Showing 1-${Math.min(count, 12)} of ${count} results`;
    }
}

// 商品を表示
function displaySearchResults(products) {
    const resultsGrid = document.querySelector('.results-grid');
    if (!resultsGrid) {
        console.error('Results grid element not found');
        return;
    }
    
    // Grid内のすべての要素を削除
    resultsGrid.innerHTML = '';
    
    // 商品がない場合
    if (products.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try a different search term or browse our categories.</p>
            </div>
        `;
        return;
    }
    
    // 表示する商品数を制限（ページネーションを実装する場合は変更）
    const displayCount = Math.min(12, products.length);
    
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
        
        if (product.stock !== undefined) {
            if (product.stock <= 0) {
                stockStatusClass = 'out-of-stock';
                stockStatusText = 'Out of Stock';
            } else if (product.stock <= 5) {
                stockStatusClass = 'low-stock';
                stockStatusText = 'Low Stock';
            }
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
            <div class="product-card">
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
                    <div class="shipping-time">Ships within 1-2 business days</div>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">${product.price.toFixed(2)} CAD</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">Details</a>
                    </div>
                </div>
            </div>
        `;
        
        resultsGrid.innerHTML += productHtml;
    }
    
    // カートボタンにイベントリスナーを追加
    setupAddToCartButtons(products);
}

// カートに追加ボタンの設定
function setupAddToCartButtons(products) {
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
                    product.image,
                    1
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

// フィルターとソートのイベントリスナーを設定
function setupFiltersAndSort() {
    // フィルターオプションにイベントリスナーを追加
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 同じグループ内の他のオプションからアクティブクラスを削除
            const parentGroup = this.closest('.filter-group');
            parentGroup.querySelectorAll('.filter-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // クリックされたオプションをアクティブに
            this.classList.add('active');
            
            // フィルタリングを適用（実際の実装は必要に応じて）
            // applyFilters();
        });
    });
    
    // ソートセレクトにイベントリスナーを追加
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // ソートを適用（実際の実装は必要に応じて）
            // applySort(this.value);
        });
    }
    
    // ページネーションボタンにイベントリスナーを追加
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 現在のアクティブボタンからクラスを削除
            document.querySelector('.pagination-btn.active')?.classList.remove('active');
            
            // クリックされたボタンをアクティブに
            this.classList.add('active');
            
            // ページを変更（実際の実装は必要に応じて）
            // changePage(this.textContent);
        });
    });
}
