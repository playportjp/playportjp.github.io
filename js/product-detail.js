// デバッグ用：DOM要素の存在確認
function checkDOMElements() {
    console.log('=== DOM Elements Check ===');
    console.log('Product title:', document.querySelector('.product-title'));
    console.log('Current price by ID:', document.getElementById('current-price'));
    console.log('Current price by query:', document.querySelector('#current-price'));
    console.log('Product price container:', document.querySelector('.product-price'));
    console.log('No photo container:', document.querySelector('.no-photo-container'));
    console.log('Premium icon:', document.querySelector('.premium-icon'));
    console.log('Bonus arrow:', document.querySelector('.bonus-indicator-arrow'));
    console.log('Google link:', document.getElementById('google-search-link'));
    console.log('Discount badge:', document.getElementById('discount-badge'));
    console.log('Discount explanation:', document.getElementById('discount-explanation'));
    
    // 構造を詳しく確認
    const priceDiv = document.querySelector('.product-price');
    if (priceDiv) {
        console.log('Price div innerHTML:', priceDiv.innerHTML);
        console.log('Price div textContent:', priceDiv.textContent);
    }
    
    console.log('=== End DOM Check ===');
}

// 商品詳細データを取得して表示
function loadProductDetails(productId) {
    console.log('Loading product details for ID:', productId);
    
    // DOM要素の存在確認
    checkDOMElements();

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
                setTimeout(() => {
                    checkProductImage(product);
                }, 100);
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
    console.log('Setting up Google link for:', productName);
    console.log('Google link element:', googleSearchLink);
    
    if (googleSearchLink && productName) {
        const encodedName = encodeURIComponent(productName);
        googleSearchLink.href = `https://www.google.com/search?q=${encodedName}&tbm=isch`;
        googleSearchLink.onclick = null;
        
        // 隠しクラスを削除して表示
        setTimeout(() => {
            googleSearchLink.classList.remove('hidden');
            googleSearchLink.style.display = 'inline-flex';
            googleSearchLink.style.visibility = 'visible';
            console.log('Google link should be visible now');
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

            // Open Photo Bonus関連の要素を非表示（存在する場合）
            hideOpenPhotoBonusElements();

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
    console.log('Product image main element:', productImageMain);
    
    // ボーナス価格を適用
    applyDiscountPrice(product);
    
    // 画像エリアに「No Photo」表示を追加
    if (productImageMain) {
        // 高さを確実に設定
        productImageMain.style.height = '400px';
        productImageMain.style.minHeight = '400px';
        productImageMain.style.position = 'relative';
        productImageMain.style.display = 'flex';
        productImageMain.style.alignItems = 'center';
        productImageMain.style.justifyContent = 'center';
        
        // まず要素をクリア
        productImageMain.innerHTML = '';
        
        // メインコンテナを作成
        const noPhotoContainer = document.createElement('div');
        noPhotoContainer.className = 'no-photo-container';
        noPhotoContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            position: relative;
            padding: 2rem;
        `;
        
        // ボーナスインジケーター矢印を作成
        const bonusArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        bonusArrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        bonusArrow.setAttribute('width', '32');
        bonusArrow.setAttribute('height', '32');
        bonusArrow.setAttribute('viewBox', '0 0 24 24');
        bonusArrow.setAttribute('fill', 'none');
        bonusArrow.setAttribute('stroke', '#ffeb3b');
        bonusArrow.setAttribute('stroke-width', '2.5');
        bonusArrow.setAttribute('stroke-linecap', 'round');
        bonusArrow.setAttribute('stroke-linejoin', 'round');
        bonusArrow.className = 'bonus-indicator-arrow';
        bonusArrow.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            filter: drop-shadow(0 0 8px rgba(255, 235, 59, 0.8)) drop-shadow(0 0 15px rgba(255, 235, 59, 0.5));
            z-index: 3;
            animation: glowPulse 2s ease-in-out infinite;
        `;
        
        const arrowPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath1.setAttribute('d', 'M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6');
        const arrowPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath2.setAttribute('d', 'M12 15V3');
        const arrowPath3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath3.setAttribute('d', 'M8 7l4-4 4 4');
        
        bonusArrow.appendChild(arrowPath1);
        bonusArrow.appendChild(arrowPath2);
        bonusArrow.appendChild(arrowPath3);
        
        // プレミアムアイコンラッパーを作成
        const premiumIconWrapper = document.createElement('div');
        premiumIconWrapper.className = 'premium-icon-wrapper';
        premiumIconWrapper.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 40px;
            position: relative;
        `;
        
        // プレミアムアイコンを作成
        const premiumIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        premiumIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        premiumIcon.setAttribute('viewBox', '0 0 24 24');
        premiumIcon.setAttribute('fill', 'none');
        premiumIcon.setAttribute('stroke', '#bb0000');
        premiumIcon.setAttribute('stroke-width', '1.5');
        premiumIcon.setAttribute('stroke-linecap', 'round');
        premiumIcon.setAttribute('stroke-linejoin', 'round');
        premiumIcon.className = 'premium-icon';
        premiumIcon.style.cssText = `
            width: 120px;
            height: 120px;
            filter: drop-shadow(0 4px 8px rgba(187, 0, 0, 0.4));
            z-index: 2;
            display: block;
        `;
        
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('d', 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');
        premiumIcon.appendChild(iconPath);
        
        // 中心の光線を作成
        const lightBeam = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        lightBeam.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        lightBeam.setAttribute('viewBox', '0 0 24 24');
        lightBeam.className = 'center-light-beam';
        lightBeam.style.cssText = `
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 140px;
            pointer-events: none;
            z-index: 1;
        `;
        
        const beamLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        beamLine.setAttribute('x1', '12');
        beamLine.setAttribute('y1', '0');
        beamLine.setAttribute('x2', '12');
        beamLine.setAttribute('y2', '14');
        beamLine.setAttribute('stroke', '#ffeb3b');
        beamLine.setAttribute('stroke-width', '1');
        beamLine.style.filter = 'drop-shadow(0 0 6px rgba(255, 235, 59, 0.8))';
        beamLine.style.opacity = '0.7';
        lightBeam.appendChild(beamLine);
        
        // テキストを作成
        const noPhotoText = document.createElement('div');
        noPhotoText.style.cssText = `
            font-size: 1.1rem;
            color: #aaa;
            margin-top: 1.2rem;
            font-weight: 500;
            text-align: center;
        `;
        noPhotoText.textContent = 'No Photo Available';
        
        // 要素を組み立て
        premiumIconWrapper.appendChild(lightBeam);
        premiumIconWrapper.appendChild(premiumIcon);
        noPhotoContainer.appendChild(bonusArrow);
        noPhotoContainer.appendChild(premiumIconWrapper);
        noPhotoContainer.appendChild(noPhotoText);
        
        // メインコンテナに追加
        productImageMain.appendChild(noPhotoContainer);
        
        // Google検索リンクを作成
        const googleLink = document.createElement('a');
        googleLink.href = '#';
        googleLink.className = 'search-image-link';
        googleLink.id = 'google-search-link';
        googleLink.target = '_blank';
        googleLink.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: rgba(187, 0, 0, 0.9);
            color: white;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            transition: background-color 0.2s;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        
        // 検索アイコンを作成
        const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        searchIcon.setAttribute('viewBox', '0 0 24 24');
        searchIcon.setAttribute('fill', 'none');
        searchIcon.setAttribute('stroke', 'currentColor');
        searchIcon.setAttribute('stroke-width', '2');
        searchIcon.setAttribute('stroke-linecap', 'round');
        searchIcon.setAttribute('stroke-linejoin', 'round');
        searchIcon.style.cssText = 'width: 12px; height: 12px; display: block;';
        
        const searchCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        searchCircle.setAttribute('cx', '11');
        searchCircle.setAttribute('cy', '11');
        searchCircle.setAttribute('r', '8');
        const searchLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        searchLine.setAttribute('x1', '21');
        searchLine.setAttribute('y1', '21');
        searchLine.setAttribute('x2', '16.65');
        searchLine.setAttribute('y2', '16.65');
        
        searchIcon.appendChild(searchCircle);
        searchIcon.appendChild(searchLine);
        
        const googleText = document.createElement('span');
        googleText.textContent = 'Google';
        googleText.style.fontSize = '0.75rem';
        
        googleLink.appendChild(searchIcon);
        googleLink.appendChild(googleText);
        
        productImageMain.appendChild(googleLink);
        
        // 背景スタイルを適用
        productImageMain.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
        productImageMain.style.boxShadow = 'inset 0 2px 4px rgba(255, 255, 255, 0.05), inset 0 -2px 4px rgba(0, 0, 0, 0.2)';
        productImageMain.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        productImageMain.style.borderRadius = '8px 8px 0 0';
        
        // アニメーションスタイルを追加
        if (!document.getElementById('openPhotoBonusStyles')) {
            const style = document.createElement('style');
            style.id = 'openPhotoBonusStyles';
            style.textContent = `
                @keyframes glowPulse {
                    0%, 100% {
                        opacity: 0.9;
                        transform: translateX(-50%) translateY(0);
                    }
                    50% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(-3px);
                    }
                }
                
                .search-image-link:hover {
                    background-color: #990000 !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Google検索リンクを設定
        setTimeout(() => {
            setupGoogleSearchLink(product.name);
        }, 10);
        
        console.log('Open Photo Bonus elements created successfully');
        console.log('Container height:', productImageMain.offsetHeight);
        console.log('Icon visibility:', window.getComputedStyle(premiumIcon).visibility);
    }
    
    // 割引バッジと説明を価格エリアに追加
    addDiscountBadgeAndExplanation();

    // 画像セレクターを無効化
    disableImageSelector();
}

// 割引バッジと説明を追加
function addDiscountBadgeAndExplanation() {
    const priceContainer = document.querySelector('.product-price-container');
    
    if (priceContainer) {
        // 割引バッジがまだ存在しない場合のみ追加
        if (!document.getElementById('discount-badge')) {
            const discountBadge = document.createElement('div');
            discountBadge.id = 'discount-badge';
            discountBadge.className = 'discount-badge';
            discountBadge.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: linear-gradient(135deg, rgba(255, 235, 59, 0.2) 0%, rgba(255, 235, 59, 0.1) 100%);
                border-radius: 6px;
                margin-bottom: 16px;
                margin-top: 12px;
                border: 1px solid rgba(255, 235, 59, 0.3);
            `;
            discountBadge.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 1px 3px rgba(255, 235, 59, 0.4));">
                    <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                    <path d="M12 15V3"></path>
                    <path d="M8 7l4-4 4 4"></path>
                </svg>
                <span style="color: #ffeb3b; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">8% discount applied - Open Photo Bonus</span>
            `;
            
            // 価格の後に挿入
            const priceDiv = priceContainer.querySelector('.product-price');
            if (priceDiv) {
                priceDiv.insertAdjacentElement('afterend', discountBadge);
            }
        }
        
        // 説明文がまだ存在しない場合のみ追加
        if (!document.getElementById('discount-explanation')) {
            const discountExplanation = document.createElement('div');
            discountExplanation.id = 'discount-explanation';
            discountExplanation.className = 'discount-explanation';
            discountExplanation.style.cssText = `
                position: relative;
                padding-left: 20px;
                margin-top: 12px;
                margin-bottom: 20px;
            `;
            discountExplanation.innerHTML = `
                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background-color: #ffeb3b; border-radius: 2px; opacity: 0.8;"></div>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: var(--text-secondary);">This item currently has no product photos. An 8% early purchase bonus has been applied to the price. Photos will be added when the item ships.</p>
            `;
            
            // 価格ノートの後に追加
            const priceNote = priceContainer.querySelector('.price-note');
            if (priceNote) {
                priceNote.insertAdjacentElement('afterend', discountExplanation);
            } else {
                priceContainer.appendChild(discountExplanation);
            }
        }
    }
}

// Open Photo Bonus要素を非表示
function hideOpenPhotoBonusElements() {
    const discountBadge = document.getElementById('discount-badge');
    const discountExplanation = document.getElementById('discount-explanation');
    
    if (discountBadge) discountBadge.style.display = 'none';
    if (discountExplanation) discountExplanation.style.display = 'none';
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
    
    // 商品価格を更新（HTML構造に合わせて修正）
    const priceDiv = document.querySelector('.product-price');
    if (priceDiv) {
        console.log('Updating price in div:', product.price);
        priceDiv.textContent = `${product.price.toFixed(2)} CAD`;
    } else {
        console.error('Price div not found');
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
    const priceDiv = document.querySelector('.product-price');
    
    if (priceDiv) {
        priceDiv.textContent = `${product.price.toFixed(2)} CAD`;
        priceDiv.style.color = 'var(--text-primary)';
        
        // 価格構造を修正（元の価格と現在の価格を分ける）
        priceDiv.innerHTML = `<span id="current-price">${product.price.toFixed(2)} CAD</span>`;
    }
    
    console.log('Applied normal price:', product.price.toFixed(2));
}

// Open Photo Bonus価格を適用（割引価格）
function applyDiscountPrice(product) {
    console.log('Applying discount price...');
    
    const priceDiv = document.querySelector('.product-price');
    
    if (!priceDiv) {
        console.error('Price div not found');
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
    
    // 価格の表示を更新（元の価格と割引価格の両方を表示）
    priceDiv.innerHTML = `
        <span id="original-price" class="original-price" style="text-decoration: line-through; color: #999; font-size: 1.4rem; margin-right: 0.5rem;">
            ${originalPrice.toFixed(2)} CAD
        </span>
        <span id="current-price" class="discounted" style="color: #ffeb3b; font-size: 1.8rem;">
            ${discountedPrice.toFixed(2)} CAD
        </span>
    `;
    
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
        // ボタンの無効化スタイルを適用
        imageSelector.style.opacity = '0.5';
        imageSelector.style.pointerEvents = 'none';
    }

    if (imageOptions) {
        imageOptions.forEach(option => {
            option.disabled = true;
            option.style.cursor = 'not-allowed';
            option.style.opacity = '0.5';
        });
    }
}

// DOMContentLoadedイベントリスナー
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    
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
