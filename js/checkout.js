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
