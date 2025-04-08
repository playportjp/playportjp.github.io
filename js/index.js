/**
 * index.js - ホームページ固有のJavaScript機能
 */

document.addEventListener('DOMContentLoaded', () => {
    // カテゴリカードのイメージをロード（実際のプロジェクトでは画像リソースが必要）
    loadCategoryImages();
    
    // 商品カードのイメージをロード（実際のプロジェクトでは画像リソースが必要）
    loadProductImages();
});

/**
 * カテゴリカードの画像を設定
 */
function loadCategoryImages() {
    // カテゴリとその背景画像のマッピング
    const categoryImages = {
        'games': 'images/categories/games-bg.jpg',
        'books': 'images/categories/books-bg.jpg',
        'music': 'images/categories/music-bg.jpg',
        'collectibles': 'images/categories/collectibles-bg.jpg'
    };
    
    // カテゴリカードを取得して画像を設定
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const category = card.dataset.category;
        const imageElement = card.querySelector('.category-image');
        
        if (category && imageElement) {
            // 背景画像を設定
            imageElement.style.backgroundImage = `url('${categoryImages[category] || 'images/categories/placeholder.jpg'}')`;
            imageElement.style.backgroundSize = 'cover';
            imageElement.style.backgroundPosition = 'center';
        }
    });
}

/**
 * 商品カードの画像を設定
 */
function loadProductImages() {
    // 商品カードを取得して画像を設定
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const imageUrl = card.dataset.productImage;
        const imageElement = card.querySelector('.product-image');
        
        if (imageUrl && imageElement) {
            // 背景画像を設定
            imageElement.style.backgroundImage = `url('${imageUrl}')`;
            imageElement.style.backgroundSize = 'cover';
            imageElement.style.backgroundPosition = 'center';
        }
    });
}

/**
 * おすすめ商品のフェッチ（実際のプロジェクトではAPIからデータを取得）
 * 注: 現在はHTMLに直接記述されているため使用されていない
 */
function fetchFeaturedProducts() {
    // APIからデータを取得する例
    // この関数は現在は使われていないが、将来的にAPIから商品データを取得する場合に使用できる
    
    /* 
    // 実際のプロジェクトでは以下のようなコードを使用する
    fetch('/api/featured-products')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.querySelector('.product-grid');
            productGrid.innerHTML = ''; // 既存のコンテンツをクリア
            
            products.forEach(product => {
                // 商品カードのHTMLを生成
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('おすすめ商品の取得に失敗しました:', error);
        });
    */
}

/**
 * 商品カードHTML要素を作成する関数
 * 注: 現在はHTMLに直接記述されているため使用されていない
 */
function createProductCard(product) {
    // 商品カードの要素を生成する例
    // この関数は現在は使われていないが、将来的にAPIから商品データを取得する場合に使用できる
    
    /*
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.dataset.productPrice = product.price;
    card.dataset.productImage = product.image;
    
    card.innerHTML = `
        <div class="product-image" style="background-image: url('${product.image}')"></div>
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="product-condition">${product.condition}</p>
            <p class="product-price">${product.price} ${product.currency}</p>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;
    
    // 「カートに追加」ボタンにイベントリスナーを設定
    const addButton = card.querySelector('.add-to-cart');
    addButton.addEventListener('click', () => {
        window.cartManager.addItem(product);
        
        // 視覚的フィードバック
        addButton.textContent = '追加しました！';
        setTimeout(() => {
            addButton.textContent = 'カートに追加';
        }, 1500);
    });
    
    return card;
    */
}
