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
                // 最初に商品詳細を表示
                displayProductDetails(product);
                
                // その後、他の機能を設定
                setupAddToCartButton(product);
                setupGoogleSearchLink(product.name);
                
                // 最後に画像チェックを実行（価格の更新も含む）
                checkProductImage(product);
            } else {
                throw new Error('Product not found');
            }
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            const container = document.querySelector('.product-detail-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Failed to load product data</h2>
                        <p>${error.message}</p>
                        <a href="index.html" class="btn btn-primary">Back to Homepage</a>
                    </div>
                `;
            }
        });
}

// Google検索リンクを設定
function setupGoogleSearchLink(productName) {
    const googleSearchLink = document.getElementById('google-search-link');
    if (googleSearchLink && productName) {
        const encodedName = encodeURIComponent(productName);
        googleSearchLink.href = `https://www.google.com/search?q=${encodedName}&tbm=isch`;
        googleSearchLink.onclick = null;
        
        // 隠しクラスを削除して表示
        setTimeout(() => {
            googleSearchLink.classList.remove('hidden');
        }, 50);
    }
}

// 写真の有無を確認し、必要に応じてOpen Photo Bonusを適用
function checkProductImage(product) {
    console.log('Checking product image for:', product.id);
    
    // 初期状態では画像パスの有無でチェック
    let hasImage = product.image && product.image !== '';

    // 要素を取得
    const productImageMain = document.querySelector('.product-image-main');
    const noPhotoContainer = productImageMain?.querySelector('.no-photo-container');
    const discountExplanation = document.getElementById('discount-explanation');
    const discountBadge = document.getElementById('discount-badge');
    const premiumIcon = document.querySelector('.premium-icon');
    const bonusArrow = document.querySelector('.bonus-indicator-arrow');
    
    // デバッグ用
    console.log('Product image check:', {
        hasImage,
        productId: product.id,
        productImage: product.image,
        noPhotoContainer: noPhotoContainer ? true : false
    });

    // 画像パスがある場合、実際に画像が読み込めるかテスト
    if (hasImage) {
        const img = new Image();

        img.onload = function () {
            // 画像のロードに成功した場合
            hasImage = true;
            console.log('Product image loaded successfully');

            // 背景画像として設定
            if (productImageMain) {
                productImageMain.style.backgroundImage = `url('${product.image}')`;
                productImageMain.style.backgroundSize = 'contain';
                productImageMain.style.backgroundRepeat = 'no-repeat';
                productImageMain.style.backgroundPosition = 'center';
            }

            // プレースホルダー要素を非表示
            if (noPhotoContainer) {
                noPhotoContainer.style.display = 'none';
            }

            // Open Photo Bonus関連の要素を非表示
            if (discountBadge) discountBadge.style.display = 'none';
            if (discountExplanation) discountExplanation.style.display = 'none';
            if (premiumIcon) premiumIcon.style.display = 'none';
            if (bonusArrow) bonusArrow.style.display = 'none';

            // 通常の価格表示
            applyNormalPrice(product);

            // 画像セレクターを有効化
            enableImageSelector();
        };

        img.onerror = function () {
            // 画像のロードに失敗した場合
            hasImage = false;
            console.log('Product image failed to load - applying Open Photo Bonus');
            applyOpenPhotoBonus(product);
        };

        // 画像のロード開始
        console.log('Starting to load image:', product.image);
        img.src = product.image;
    } else {
        // 画像パスがない場合は直接ボーナスを適用
        console.log('No image path provided, applying Open Photo Bonus directly');
        hasImage = false;
        applyOpenPhotoBonus(product);
    }

    // 商品オブジェクトに画像の有無情報を保存
    product.hasImage = hasImage;
}

// Open Photo Bonusを適用する関数
function applyOpenPhotoBonus(product) {
    console.log('Applying Open Photo Bonus');
    
    const productImageMain = document.querySelector('.product-image-main');
    console.log('Product image main found:', !!productImageMain);
    
    // 要素を個別に取得（改善版）
    const noPhotoContainer = document.querySelector('.no-photo-container');
    const discountExplanation = document.getElementById('discount-explanation');
    const discountBadge = document.getElementById('discount-badge');
    const premiumIcon = document.querySelector('.premium-icon');
    const bonusArrow = document.querySelector('.bonus-indicator-arrow');
    const googleButton = document.getElementById('google-search-link');

    console.log('Elements found:', {
        noPhotoContainer: !!noPhotoContainer,
        premiumIcon: !!premiumIcon,
        bonusArrow: !!bonusArrow,
        discountBadge: !!discountBadge,
        discountExplanation: !!discountExplanation
    });

    // プレースホルダー要素を表示
    if (noPhotoContainer) {
        noPhotoContainer.style.display = 'flex';
        noPhotoContainer.style.opacity = '1';
        noPhotoContainer.style.visibility = 'visible';
        console.log('No photo container displayed');
    }

    // Google検索ボタンを表示
    if (googleButton) {
        googleButton.style.display = 'flex';
        googleButton.style.opacity = '1';
        googleButton.style.visibility = 'visible';
        googleButton.style.zIndex = '5';
        googleButton.style.position = 'absolute';
        googleButton.style.top = '8px';
        googleButton.style.right = '8px';
        console.log('Google button displayed');
    }
    
    // プレミアムアイコンを表示
    if (premiumIcon) {
        premiumIcon.style.display = 'block';
        premiumIcon.style.opacity = '1';
        premiumIcon.style.animation = 'none';
        premiumIcon.style.filter = 'drop-shadow(0 4px 8px rgba(187, 0, 0, 0.4))';
        premiumIcon.style.width = '120px';
        premiumIcon.style.height = '120px';
        premiumIcon.style.visibility = 'visible';
        console.log('Premium icon displayed');
    }
    
    // ボーナスインジケーター矢印を表示
    if (bonusArrow) {
        bonusArrow.style.display = 'block';
        bonusArrow.style.width = '28px';
        bonusArrow.style.height = '28px';
        bonusArrow.style.opacity = '1';
        bonusArrow.style.visibility = 'visible';
        console.log('Bonus arrow displayed');
    }

    // Open Photo Bonusバッジを表示
    if (discountBadge) {
        discountBadge.style.display = 'flex';
        discountBadge.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                <path d="M12 15V3"></path>
                <path d="M8 7l4-4 4 4"></path>
            </svg>
            <span>8% discount applied - Open Photo Bonus</span>
        `;
        console.log('Discount badge displayed');
    }

    // 説明文を表示
    if (discountExplanation) {
        discountExplanation.style.display = 'block';
        discountExplanation.innerHTML = '<p>This item currently has no product photos. An 8% early purchase bonus has been applied to the price. Photos will be added when the item ships.</p>';
        console.log('Discount explanation displayed');
    }

    // ボーナス価格を適用
    applyDiscountPrice(product);

    // 画像セレクターを無効化
    disableImageSelector();
}

// 商品詳細を表示
function displayProductDetails(product) {
    console.log('Displaying product details:', product);
    
    // タイトルを更新
    document.title = `${product.name} - PlayPortJP`;
    
    // 商品名を更新
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // パンくずリストの商品名を更新
    const breadcrumbProductName = document.getElementById('breadcrumb-product-name');
    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = product.name;
    }
    
    // 評価部分を表示
    const productRating = document.querySelector('.product-rating');
    if (productRating) {
        productRating.style.visibility = 'visible';
    }
    
    // 評価カウントの更新
    const ratingCount = document.querySelector('.rating-count');
    if (ratingCount) {
        const reviewCount = product.reviews || 0;
        ratingCount.textContent = `${reviewCount} reviews`;
    }
    
    // 商品価格を更新（修正版）
    // まず価格コンテナ全体を取得
    const priceContainer = document.querySelector('.product-price');
    console.log('Price container found:', !!priceContainer);
    
    if (priceContainer) {
        // 価格コンテナ内のspan要素を探す
        const priceSpans = priceContainer.getElementsByTagName('span');
        console.log('Price spans found:', priceSpans.length);
        
        // IDで取得を試みる（別の方法）
        let currentPriceElement = null;
        for (let span of priceSpans) {
            if (span.id === 'current-price') {
                currentPriceElement = span;
                break;
            }
        }
        
        if (currentPriceElement) {
            console.log('Setting initial price:', product.price);
            currentPriceElement.textContent = `${product.price.toFixed(2)} CAD`;
        } else {
            console.error('Current price element still not found');
            // 価格コンテナの内容を確認
            console.log('Price container HTML:', priceContainer.innerHTML);
        }
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

    // タブの内容を更新
    updateTabsContent(product);
}

// 通常価格を表示
function applyNormalPrice(product) {
    const originalPriceElement = document.getElementById('original-price');
    const currentPriceElement = document.getElementById('current-price');
    
    if (originalPriceElement) {
        originalPriceElement.style.display = 'none';
    }
    
    if (currentPriceElement) {
        currentPriceElement.textContent = `${product.price.toFixed(2)} CAD`;
        currentPriceElement.style.color = 'var(--text-primary)';
        currentPriceElement.classList.remove('discounted');
    }
    
    console.log('Applied normal price:', product.price.toFixed(2));
}

// Open Photo Bonus価格を適用（割引価格）
function applyDiscountPrice(product) {
    console.log('Applying discount price...');
    
    // 複数の方法で価格要素を取得
    let originalPriceElement = document.getElementById('original-price');
    let currentPriceElement = document.getElementById('current-price');
    
    // 代替方法1: querySelector
    if (!currentPriceElement) {
        currentPriceElement = document.querySelector('#current-price');
    }
    
    // 代替方法2: クラス名から探す
    if (!currentPriceElement) {
        const priceContainer = document.querySelector('.product-price');
        if (priceContainer) {
            currentPriceElement = priceContainer.querySelector('span[id="current-price"]');
        }
    }
    
    // 代替方法3: 後続の兄弟要素を探す
    if (!currentPriceElement && originalPriceElement) {
        currentPriceElement = originalPriceElement.nextElementSibling;
    }
    
    console.log('Final price elements:', {
        originalFound: !!originalPriceElement,
        currentFound: !!currentPriceElement
    });
    
    if (!currentPriceElement) {
        console.error('Current price element not found after all attempts');
        // HTMLの構造を確認
        const priceContainer = document.querySelector('.product-price');
        console.log('Price container content:', priceContainer?.innerHTML);
        return;
    }
    
    // 元の価格と割引後の価格を計算
    const originalPrice = product.price;
    const discountRate = 0.08; // 8%割引
    const discountedPrice = originalPrice * (1 - discountRate);
    
    console.log('Price calculations:', {
        originalPrice,
        discountRate,
        discountedPrice
    });
    
    // 元の価格要素がある場合のみ表示
    if (originalPriceElement) {
        originalPriceElement.textContent = `${originalPrice.toFixed(2)} CAD`;
        originalPriceElement.style.display = 'inline';
        originalPriceElement.className = 'original-price';
    }
    
    // 割引価格を表示
    currentPriceElement.textContent = `${discountedPrice.toFixed(2)} CAD`;
    currentPriceElement.classList.add('discounted');
    currentPriceElement.style.color = '#ffeb3b'; // 黄色に変更
    
    // カートに追加するときの価格を保存
    product.discountedPrice = discountedPrice;
    console.log('Discount price applied successfully');
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

    // 仕様タブの更新
    const specsTable = document.querySelector('#specifications .specs-table');
    if (specsTable && product) {
        // 商品タイトル行を更新
        const titleRow = specsTable.querySelector('tr:first-child td');
        if (titleRow) {
            titleRow.textContent = product.name;
        }

        // その他の仕様行を更新（データがある場合）
        const platformRow = specsTable.querySelector('tr:nth-child(2) td');
        if (platformRow && product.platform) {
            platformRow.textContent = product.platform;
        }
    }
}

// カートに追加ボタンの機能を設定
function setupAddToCartButton(product) {
    const addToCartBtn = document.querySelector('.product-actions .btn-primary');
    if (addToCartBtn) {
        // 既存のイベントリスナーを削除
        const newAddToCartBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
        
        newAddToCartBtn.addEventListener('click', function () {
            const quantityInput = document.querySelector('.quantity-input input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            if (window.cartManager) {
                // 写真がない場合はOpen Photo Bonus価格を使用
                const hasImage = product.hasImage;
                const price = hasImage ? product.price : (product.discountedPrice || (product.price * 0.92));

                window.cartManager.addItem(
                    product.id,
                    product.name,
                    price,
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
        minusBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        plusBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });

        // 入力値が変更された場合にバリデーション
        quantityInput.addEventListener('change', function () {
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
        button.addEventListener('click', function () {
            // アクティブなタブをリセット
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // クリックされたタブをアクティブに
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// 画像セレクターの機能を設定
function setupImageSelector() {
    const imageOptions = document.querySelectorAll('.image-option');
    const productImageMain = document.querySelector('.product-image-main');

    imageOptions.forEach(option => {
        option.addEventListener('click', function () {
            // すでに無効化されている場合は何もしない
            if (this.disabled) return;

            // アクティブなオプションをリセット
            imageOptions.forEach(opt => opt.classList.remove('active'));

            // クリックされたオプションをアクティブに
            this.classList.add('active');

            // データ属性から表示するビューを取得
            const view = this.getAttribute('data-view');

            // 実際の画像が読み込まれている場合、異なるビューを表示
            if (productImageMain && productImageMain.style.backgroundImage) {
                console.log(`Changing view to: ${view}`);

                // 表示アニメーションを追加
                productImageMain.style.opacity = '0';
                setTimeout(() => {
                    productImageMain.style.opacity = '1';
                }, 200);
            }
        });
    });
}

// 画像セレクターを有効化
function enableImageSelector() {
    const imageSelector = document.querySelector('.product-image-selector');
    const imageOptions = document.querySelectorAll('.image-option');

    if (imageSelector) {
        imageSelector.classList.remove('disabled');
    }

    if (imageOptions) {
        imageOptions.forEach(option => {
            option.disabled = false;
        });
    }
}

// 画像セレクターを無効化
function disableImageSelector() {
    const imageSelector = document.querySelector('.product-image-selector');
    const imageOptions = document.querySelectorAll('.image-option');

    if (imageSelector) {
        imageSelector.classList.add('disabled');
    }

    if (imageOptions) {
        imageOptions.forEach(option => {
            option.disabled = true;
        });
    }
}

// DOMContentLoadedイベントリスナー
document.addEventListener('DOMContentLoaded', function () {
    // URLからproduct IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // 商品データを取得して表示
        loadProductDetails(productId);
    } else {
        console.error('Product ID not found in URL');
        // エラーメッセージを表示
        const container = document.querySelector('.product-detail-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Product not found</h2>
                    <p>Please check the URL and try again.</p>
                    <a href="index.html" class="btn btn-primary">Back to Homepage</a>
                </div>
            `;
        }
    }

    // 数量ボタンの機能
    setupQuantityButtons();

    // タブの切り替え機能
    setupTabs();

    // 画像セレクターの機能
    setupImageSelector();
});
