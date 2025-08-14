document.addEventListener('DOMContentLoaded', function() {
    // URLからパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const category = urlParams.get('category');
    const page = parseInt(urlParams.get('page')) || 1; // ページパラメータを取得、デフォルトは1
    
    console.log('URL params:', { searchQuery, category, page });
    
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
        searchProducts(searchQuery, page);
    } else if (category) {
        console.log('Category filter found:', category);
        // カテゴリタイトルを表示
        const searchInfoTitle = document.querySelector('.search-info h1');
        if (searchInfoTitle) {
            // カテゴリ名の最初の文字を大文字に
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            searchInfoTitle.textContent = `Browse: ${categoryName}`;
        }
        
        // カテゴリフィルターを更新（setTimeout でDOMが完全に読み込まれた後に実行）
        setTimeout(() => {
            updateCategoryFilter(category);
        }, 100);
        
        // カテゴリに基づいて商品を読み込む
        loadProductsByCategory(category, page);
    } else {
        console.log('No search query or category found, loading all products');
        // 検索クエリもカテゴリもない場合は全商品を表示
        loadAllProducts(page);
        
        // タイトルを更新
        const searchInfoTitle = document.querySelector('.search-info h1');
        if (searchInfoTitle) {
            searchInfoTitle.textContent = 'All Products';
        }
    }
    
    // フィルターとソートのイベントリスナーを設定
    setupFiltersAndSort();
});

// ページごとに表示する商品数
const ITEMS_PER_PAGE = 12;

// 現在のフィルター状態を保存するオブジェクト
let currentFilters = {
    category: 'All',
    condition: 'All',
    priceRange: 'All'
};

// すべての商品データを保存する変数
let allProducts = [];
// 現在表示中の商品（フィルター適用後）
let currentFilteredProducts = [];

// カテゴリタグのHTMLを生成（カテゴリ色対応）
function generateCategoryTagHtml(product) {
    let categoryTagHtml = '';
    
    if (product.category) {
        const categoryClass = product.category.toLowerCase();
        const conditionClass = product.new ? 'new' : 'used';
        
        // カテゴリ×状態のクラスを適用
        categoryTagHtml += `<span class="meta-tag ${categoryClass} ${conditionClass}">${product.category}</span>`;
        
        console.log(`Generated category tag: ${categoryClass} ${conditionClass} for ${product.name}`);
    }
    
    if (product.subcategory) {
        categoryTagHtml += `<span class="meta-tag other">${product.subcategory}</span>`;
    }
    
    return categoryTagHtml;
}

// 商品を検索して表示
function searchProducts(query, page = 1) {
    console.log('Searching products for query:', query, 'page:', page);
    
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
            allProducts = products; // すべての商品を保存
            
            // 検索クエリに基づいて商品をフィルタリング
            const filteredProducts = filterProductsByQuery(products, query);
            // Out of Stockの商品を除外
            const inStockProducts = filteredProducts.filter(product => product.stock > 0);
            currentFilteredProducts = inStockProducts; // 現在のフィルター結果を保存
            
            console.log(`Found ${inStockProducts.length} in-stock products matching query "${query}" (from ${filteredProducts.length} total matches)`);
            
            // デバッグ: フィルタリングされた商品の名前をログに出力
            if (inStockProducts.length > 0) {
                console.log('Filtered products sample:', inStockProducts.slice(0, 3).map(p => p.name));
            }
            
            // ページネーション設定
            setupPagination(inStockProducts.length, page);
            
            // 検索結果数を更新
            updateResultCount(inStockProducts.length, page);
            
            // 商品を表示（ページネーション付き）
            displaySearchResults(inStockProducts, page);
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
    console.log('Updating category filter for:', category);
    
    // カテゴリ名を正規化（最初の文字を大文字に、残りを小文字に）
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    console.log('Normalized category name:', normalizedCategory);
    
    // カテゴリフィルターオプションを取得
    const filterGroups = document.querySelectorAll('.filter-group');
    let categoryFilters;
    
    // カテゴリフィルターグループを探す
    filterGroups.forEach(group => {
        const heading = group.querySelector('.filter-heading');
        if (heading && heading.textContent.trim() === 'Category') {
            categoryFilters = group.querySelectorAll('.filter-option');
            console.log('Found category filters:', categoryFilters.length);
        }
    });
    
    if (!categoryFilters || categoryFilters.length === 0) {
        console.error('Category filters not found');
        return;
    }
    
    // すべてのフィルターからアクティブクラスを削除
    categoryFilters.forEach(filter => {
        filter.classList.remove('active');
    });
    
    // 選択されたカテゴリに応じてフィルターをアクティブに
    let foundMatch = false;
    
    categoryFilters.forEach(filter => {
        const filterText = filter.textContent.trim();
        console.log('Checking filter:', filterText, 'against category:', normalizedCategory);
        
        if (filterText === normalizedCategory) {
            filter.classList.add('active');
            foundMatch = true;
            console.log('Match found! Setting', filterText, 'as active');
            // フィルター状態を更新
            currentFilters.category = filterText;
        } else if (normalizedCategory.toLowerCase() === 'all' && filterText === 'All') {
            filter.classList.add('active');
            foundMatch = true;
            console.log('Setting All filter as active');
            // フィルター状態を更新
            currentFilters.category = 'All';
        }
    });
    
    // マッチするフィルターが見つからなかった場合、Allをアクティブに
    if (!foundMatch) {
        console.log('No matching filter found, defaulting to All');
        categoryFilters.forEach(filter => {
            if (filter.textContent.trim() === 'All') {
                filter.classList.add('active');
                // フィルター状態を更新
                currentFilters.category = 'All';
            }
        });
    }
}

// カテゴリに基づいて商品を読み込む
function loadProductsByCategory(category, page = 1) {
    console.log('Loading products for category:', category, 'page:', page);
    
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
            allProducts = products; // すべての商品を保存
            
            // カテゴリに基づいて商品をフィルタリング
            const filteredProducts = filterProductsByCategory(products, category);
            // Out of Stockの商品を除外
            const inStockProducts = filteredProducts.filter(product => product.stock > 0);
            currentFilteredProducts = inStockProducts; // 現在のフィルター結果を保存
            
            console.log(`Found ${inStockProducts.length} in-stock products in category "${category}" (from ${filteredProducts.length} total matches)`);
            
            // デバッグ: フィルタリングされた商品の名前をログに出力
            if (inStockProducts.length > 0) {
                console.log('Filtered products sample:', inStockProducts.slice(0, 3).map(p => p.name));
            }
            
            // ページネーション設定
            setupPagination(inStockProducts.length, page);
            
            // 検索結果数を更新
            updateResultCount(inStockProducts.length, page);
            
            // 商品を表示（ページネーション付き）
            displaySearchResults(inStockProducts, page);
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
    if (category.toLowerCase() === 'all') return products;
    
    // カテゴリ名を正規化（最初の文字を大文字に、残りを小文字に）
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    
    return products.filter(product => {
        // カテゴリが一致する商品をフィルタリング
        return product.category === normalizedCategory;
    });
}

// 商品の状態（New/Used）に基づいて商品をフィルタリング
function filterProductsByCondition(products, condition) {
    if (condition === 'All') return products;
    
    return products.filter(product => {
        if (condition === 'NEW') {
            return product.new === true;
        } else if (condition === 'USED') {
            return product.new === false;
        }
        return true;
    });
}

// 価格範囲に基づいて商品をフィルタリング
function filterProductsByPrice(products, priceRange) {
    if (priceRange === 'All') return products;
    
    return products.filter(product => {
        const price = product.price;
        
        if (priceRange === 'Under 70 CAD') {
            return price < 70;
        } else if (priceRange === '70-100 CAD') {
            return price >= 70 && price <= 100;
        } else if (priceRange === '100+ CAD') {
            return price > 100;
        }
        return true;
    });
}

// 全商品を読み込み
function loadAllProducts(page = 1) {
    console.log('Loading all products for search results, page:', page);
    
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
            allProducts = products; // すべての商品を保存
            
            // Out of Stockの商品を除外
            const inStockProducts = products.filter(product => product.stock > 0);
            currentFilteredProducts = inStockProducts; // 現在のフィルター結果を保存
            
            console.log(`Found ${inStockProducts.length} in-stock products (from ${products.length} total products)`);
            
            // ページネーション設定
            setupPagination(inStockProducts.length, page);
            
            // 検索結果数を更新
            updateResultCount(inStockProducts.length, page);
            
            // 商品を表示（ページネーション付き）
            displaySearchResults(inStockProducts, page);
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

// 現在のフィルターに基づいて商品をフィルタリング
function applyAllFilters(page = 1) {
    console.log('Applying all filters:', currentFilters, 'page:', page);
    
    if (allProducts.length === 0) {
        console.log('No products to filter');
        return;
    }
    
    let filteredProducts = [...allProducts];
    
    // Out of Stockの商品を除外
    filteredProducts = filteredProducts.filter(product => product.stock > 0);
    
    // カテゴリフィルターを適用
    if (currentFilters.category !== 'All') {
        filteredProducts = filterProductsByCategory(filteredProducts, currentFilters.category);
    }
    
    // 商品状態フィルターを適用
    if (currentFilters.condition !== 'All') {
        filteredProducts = filterProductsByCondition(filteredProducts, currentFilters.condition);
    }
    
    // 価格範囲フィルターを適用
    if (currentFilters.priceRange !== 'All') {
        filteredProducts = filterProductsByPrice(filteredProducts, currentFilters.priceRange);
    }
    
    currentFilteredProducts = filteredProducts; // 現在のフィルター結果を保存
    console.log(`After filtering: ${filteredProducts.length} products remain`);
    
    // ページネーション設定
    setupPagination(filteredProducts.length, page);
    
    // 検索結果数を更新
    updateResultCount(filteredProducts.length, page);
    
    // 商品を表示（ページネーション付き）
    displaySearchResults(filteredProducts, page);
}

// ページネーションを設定
function setupPagination(totalItems, currentPage) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    
    // ページネーションをクリア
    paginationContainer.innerHTML = '';
    
    // ページ数を計算
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    console.log(`Setting up pagination: ${totalItems} items, ${totalPages} pages, current page: ${currentPage}`);
    
    // 商品がない場合
    if (totalItems === 0) {
        return;
    }
    
    // 最大5ページまで表示
    const maxPageButtons = 5;
    let startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPageButtons / 2), totalPages - maxPageButtons + 1));
    if (startPage < 1) startPage = 1;
    
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
    
    // 「前へ」ボタン
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.textContent = '← Prev';
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
        paginationContainer.appendChild(prevButton);
    }
    
    // ページ番号ボタン
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-btn';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.textContent = i.toString();
        pageButton.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }
    
    // 「次へ」ボタン
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.textContent = 'Next →';
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }
}

// ページを変更
function changePage(pageNumber) {
    console.log('Changing to page:', pageNumber);
    
    // URLを更新
    const url = new URL(window.location);
    url.searchParams.set('page', pageNumber);
    window.history.pushState({}, '', url);
    
    // 商品表示を更新
    displaySearchResults(currentFilteredProducts, pageNumber);
    
    // ページネーションを更新
    setupPagination(currentFilteredProducts.length, pageNumber);
    
    // 検索結果数を更新
    updateResultCount(currentFilteredProducts.length, pageNumber);
    
    // ページトップにスクロール
    window.scrollTo(0, 0);
}

// 検索結果数を更新
function updateResultCount(totalCount, currentPage) {
    const searchInfoText = document.querySelector('.search-info p');
    if (searchInfoText) {
        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
        searchInfoText.textContent = `Showing ${totalCount > 0 ? startItem : 0}-${endItem} of ${totalCount} results`;
    }
}

// 商品を表示
function displaySearchResults(products, page = 1) {
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
    
    // ページに表示する商品を計算
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length);
    const displayProducts = products.slice(startIndex, endIndex);
    
    console.log(`Displaying products ${startIndex + 1}-${endIndex} of ${products.length}`);
    
    // 商品カードを作成
    for (let i = 0; i < displayProducts.length; i++) {
        const product = displayProducts[i];
        
        // カテゴリータグのHTMLを生成（カテゴリ色対応）
        const categoryTagHtml = generateCategoryTagHtml(product);
        
        // 商品の状態バッジを生成
        const conditionBadgeClass = product.new ? 'new' : 'used';
        const conditionBadgeText = product.new ? 'NEW' : 'USED';
        
        // 在庫状況を生成 - 単純化してIn Stock/Out of Stockのみに
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
        
        // 商品カードの内容を設定 - カテゴリ色対応のメタタグ使用
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
        
        // 商品カードのクリックイベントを設定
        productCard.addEventListener('click', function(event) {
            // イベントターゲットがボタンやGoogle検索リンクでない場合
            if (!event.target.closest('.add-to-cart') && 
                !event.target.closest('.btn-secondary') && 
                !event.target.closest('.search-image-link')) {
                
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
        
        // Googleリンククリックのイベント伝播を防止
        const googleLink = productCard.querySelector('.search-image-link');
        if (googleLink) {
            googleLink.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
        
        // カートボタンクリックのイベント設定
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id === productId) || 
                                allProducts.find(p => p.id === productId);
                
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
                    
                    // 追加：右下に通知を表示（common.jsのshowAddedToCartFeedback関数を呼び出し）
                    if (typeof showAddedToCartFeedback === 'function') {
                        showAddedToCartFeedback(productCard);
                    }
                }
            });
        }
        
        // 結果グリッドに商品カードを追加
        resultsGrid.appendChild(productCard);
    }
    
    // 商品カードのイベントリスナーを設定
    setupProductCardEvents();
}

// フィルターとソートのイベントリスナーを設定
function setupFiltersAndSort() {
    console.log('Setting up filters and sort event listeners');
    
    // カテゴリフィルター
    const categoryFilters = document.querySelectorAll('.filter-group:nth-child(1) .filter-option');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 現在のアクティブカテゴリを削除
            categoryFilters.forEach(f => f.classList.remove('active'));
            // クリックされたフィルターをアクティブに
            this.classList.add('active');
            // フィルター状態を更新
            currentFilters.category = this.textContent.trim();
            // 全フィルターを適用
            applyAllFilters(1); // ページを1に戻す
        });
    });
    
    // コンディションフィルター
    const conditionFilters = document.querySelectorAll('.filter-group:nth-child(2) .filter-option');
    conditionFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 現在のアクティブコンディションを削除
            conditionFilters.forEach(f => f.classList.remove('active'));
            // クリックされたフィルターをアクティブに
            this.classList.add('active');
            // フィルター状態を更新
            currentFilters.condition = this.textContent.trim();
            // 全フィルターを適用
            applyAllFilters(1); // ページを1に戻す
        });
    });
    
    // 価格範囲フィルター
    const priceFilters = document.querySelectorAll('.filter-group:nth-child(3) .filter-option');
    priceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 現在のアクティブ価格範囲を削除
            priceFilters.forEach(f => f.classList.remove('active'));
            // クリックされたフィルターをアクティブに
            this.classList.add('active');
            // フィルター状態を更新
            currentFilters.priceRange = this.textContent.trim();
            // 全フィルターを適用
            applyAllFilters(1); // ページを1に戻す
        });
    });
    
    // ソートオプション
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort option changed to:', this.value);
            sortProducts(this.value);
        });
    }
}

// 商品をソート
function sortProducts(sortOption) {
    console.log('Sorting products by:', sortOption);
    
    // 現在のフィルター済み商品をソート
    let sortedProducts = [...currentFilteredProducts];
    
    switch (sortOption) {
        case 'price-asc':
            // 価格の昇順（安い順）
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            // 価格の降順（高い順）
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            // 名前のアルファベット順
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            // 名前の逆アルファベット順
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // デフォルトは名前のアルファベット順
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    currentFilteredProducts = sortedProducts; // ソート結果を保存
    
    // 商品を表示（現在のページを維持）
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    
    // 現在のページを1に戻さずに表示
    displaySearchResults(sortedProducts, currentPage);
}

// 商品カードのイベントリスナーを設定（common.jsのsetupProductCardEventsとは別に実装）
function setupProductCardEvents() {
    // 「Add to Cart」ボタンに対してイベントリスナーを設定
    const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart');
    
    console.log(`Setting up event listeners for ${addToCartButtons.length} add to cart buttons`);
    
    addToCartButtons.forEach(button => {
        // 既存のイベントリスナーを上書きしないようにする
        // イベントリスナーは既にdisplaySearchResults内で設定しているため、ここでは何もしない
    });
}
