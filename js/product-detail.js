document.addEventListener('DOMContentLoaded', function() {
    // URLからproduct IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // 商品データを取得して表示
        loadProductDetails(productId);
    } else {
        console.error('Product ID not found in URL');
        // エラーメッセージを表示または別のページにリダイレクト
        document.querySelector('.product-detail-container').innerHTML = `
            <div class="error-message">
                <h2>商品が見つかりませんでした</h2>
                <p>URLが正しいかご確認ください。</p>
                <a href="index.html" class="btn btn-primary">トップページに戻る</a>
            </div>
        `;
    }
    
    // 数量ボタンの機能
    setupQuantityButtons();
    
    // タブの切り替え機能
    setupTabs();
});

// 商品詳細データを取得して表示
function loadProductDetails(productId) {
    console.log('Loading product details for ID:', productId);
    
    // データ取得
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            return response.json();
        })
        .then(products => {
            // 指定されたIDの商品を検索
            const product = products.find(p => p.id === productId);
            
            if (product) {
                displayProductDetails(product);
                setupAddToCartButton(product);
            } else {
                throw new Error('Product not found');
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            document.querySelector('.product-detail-container').innerHTML = `
                <div class="error-message">
                    <h2>商品データの読み込みに失敗しました</h2>
                    <p>${error.message}</p>
                    <a href="index.html" class="btn btn-primary">トップページに戻る</a>
                </div>
            `;
        });
}

// 商品詳細を表示
function displayProductDetails(product) {
    // タイトルを更新
    document.title = `${product.name} - PlayPortJP`;
    
    // 商品名を更新
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // 商品画像を更新
    const productImageMain = document.querySelector('.product-image-main');
    if (productImageMain && product.image) {
        // 画像を事前にロードして、読み込み完了後に表示する
        const img = new Image();
        img.onload = function() {
            // 画像の読み込みが完了したら背景画像として設定
            productImageMain.style.backgroundImage = `url('${product.image}')`;
            productImageMain.style.backgroundSize = 'contain';
            productImageMain.style.backgroundRepeat = 'no-repeat';
            productImageMain.style.backgroundPosition = 'center';
            
            // SVGアイコンと説明テキストを非表示
            const svgElements = productImageMain.querySelectorAll('svg, div');
            svgElements.forEach(el => el.style.display = 'none');
        };
        img.onerror = function() {
            // 画像のロードに失敗した場合はエラーメッセージを表示
            const svgElements = productImageMain.querySelectorAll('svg');
            const textElement = productImageMain.querySelector('div');
            if (textElement) {
                textElement.textContent = '画像を読み込めませんでした';
                textElement.style.opacity = '1';
            }
            svgElements.forEach(el => el.style.opacity = '1');
        };
        // 画像のロード開始
        img.src = product.image;
    }
    
    // 商品価格を更新
    const productPrice = document.querySelector('.product-price');
    if (productPrice) {
        productPrice.textContent = `${product.price.toFixed(2)} CAD`;
    }
    
    // カテゴリメタタグを更新
    const productMeta = document.querySelector('.product-meta');
    if (productMeta && product.category) {
        productMeta.innerHTML = '';
        
        // カテゴリータグを追加
        const categoryTag = document.createElement('span');
        categoryTag.className = `meta-tag ${product.category.toLowerCase()}`;
        categoryTag.textContent = product.category;
        productMeta.appendChild(categoryTag);
        
        // サブカテゴリータグを追加
        if (product.subcategory) {
            const subcategoryTag = document.createElement('span');
            subcategoryTag.className = 'meta-tag other';
            subcategoryTag.textContent = product.subcategory;
            productMeta.appendChild(subcategoryTag);
        }
    }
    
    // コンディションバッジを更新
    const conditionValue = document.querySelector('.condition-row .condition-value');
    if (conditionValue) {
        const conditionBadge = conditionValue.querySelector('.condition-badge');
        if (conditionBadge) {
            if (product.new) {
                conditionBadge.textContent = 'NEW';
                conditionBadge.className = 'condition-badge new';
            } else {
                conditionBadge.textContent = 'USED';
                conditionBadge.className = 'condition-badge used';
            }
        }
    }
    
    // 在庫状況を更新
    const stockStatus = document.querySelector('.stock-status');
    if (stockStatus && product.stock !== undefined) {
        if (product.stock > 10) {
            stockStatus.textContent = 'In Stock';
            stockStatus.className = 'stock-status in-stock';
        } else if (product.stock > 0) {
            stockStatus.textContent = `Low Stock (${product.stock} left)`;
            stockStatus.className = 'stock-status low-stock';
        } else {
            stockStatus.textContent = 'Out of Stock';
            stockStatus.className = 'stock-status out-of-stock';
        }
    }
    
    // 商品説明を更新
    const descriptionContent = document.querySelector('.description-content');
    if (descriptionContent && product.description) {
        descriptionContent.innerHTML = `<p>${product.description}</p>`;
        
        // 機能リストがある場合は追加
        if (product.features && product.features.length > 0) {
            const featuresList = document.createElement('ul');
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
            descriptionContent.appendChild(featuresList);
        }
    }
    
    // タブの内容を更新（実装によって異なる）
    updateTabsContent(product);
}

// タブコンテンツを更新
function updateTabsContent(product) {
    // 詳細タブ
    const detailsTab = document.getElementById('details');
    if (detailsTab && product.features) {
        const featuresList = detailsTab.querySelector('ul');
        if (featuresList) {
            featuresList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        }
    }
    
    // 仕様タブの更新（必要に応じて）
    const specsTable = document.querySelector('#specifications .specs-table');
    if (specsTable) {
        // ここに製品仕様の更新コードを追加（必要に応じて）
    }
}

// カートに追加ボタンの機能を設定
function setupAddToCartButton(product) {
    const addToCartBtn = document.querySelector('.product-actions .btn-primary');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantityInput = document.querySelector('.quantity-input input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            if (window.cartManager) {
                window.cartManager.addItem(
                    product.id,
                    product.name,
                    product.price,
                    product.image,
                    quantity
                );
                
                // クリック時のフィードバック
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added to Cart!
                `;
                setTimeout(() => {
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                    `;
                }, 2000);
            }
        });
    }
}

// 数量ボタンの機能を設定
function setupQuantityButtons() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input input');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        // 入力値が変更された場合にバリデーション
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

// タブの切り替え機能を設定
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // アクティブなタブをリセット
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブをアクティブに
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}
