<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlayPortJP - Japanese Treasures</title>
    <meta name="description" content="Premium Japanese games, books, music, and collectibles delivered worldwide.">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- 追加スタイル - モバイルレイアウトとプロダクトカード -->
    <style>
        /* モバイルヘッダー用のスタイル */
        @media (max-width: 768px) {
            .header-container {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0.25rem 0 !important;
                height: 45px !important; /* 縮小 */
            }
            
            .logo {
                margin-bottom: 0 !important;
                padding-left: 0.75rem !important; /* 縮小 */
            }
            
            .logo h1 {
                font-size: 1.15rem; /* 縮小 */
            }
            
            .nav-actions {
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important; /* 縮小 */
                padding-right: 0.75rem !important; /* 縮小 */
            }
            
            .nav-icon {
                background: none;
                border: none;
                color: var(--text-primary);
                padding: 0.35rem; /* 縮小 */
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            
            .nav-icon svg {
                width: 18px; /* 縮小 */
                height: 18px; /* 縮小 */
            }
            
            .mobile-search-container {
                flex: 1 !important;
                max-width: 40% !important;
                margin: 0 0.35rem !important; /* 縮小 */
                display: flex !important;
                height: 30px !important; /* 高さ固定 */
            }
            
            .mobile-search-container form {
                width: 100% !important;
                display: flex !important;
                position: relative !important;
            }
            
            .mobile-search-container input {
                width: 100% !important;
                padding: 0.25rem 0.4rem !important; /* 縮小 */
                padding-right: 1.75rem !important; /* 縮小 */
                border: 1px solid var(--border) !important;
                border-radius: 4px !important;
                background-color: var(--surface-lighter) !important;
                color: var(--text-primary) !important;
                font-size: 0.75rem !important; /* 縮小 */
                height: 30px !important; /* 高さ固定 */
            }
            
            .mobile-search-container button {
                position: absolute !important;
                right: 2px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: none !important;
                border: none !important;
                color: var(--text-secondary) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0.2rem !important; /* 縮小 */
            }
            
            .mobile-search-container button svg {
                width: 14px !important; /* 縮小 */
                height: 14px !important; /* 縮小 */
            }
            
            .cart-count {
                position: absolute;
                top: -2px;
                right: -2px;
                background-color: var(--primary);
                color: white;
                font-size: 0.6rem; /* 縮小 */
                min-width: 14px; /* 縮小 */
                height: 14px; /* 縮小 */
                padding: 0 3px;
                border-radius: 7px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
            }
            
            /* デスクトップ用要素を非表示 */
            .search-container, .header-desktop-nav {
                display: none !important;
            }
        }
        
        /* デスクトップ向けスタイル */
        @media (min-width: 769px) {
            .nav-actions, .mobile-search-container {
                display: none !important;
            }
        }

        /* 以下はプロダクトカードのスタイル（変更なし） */
        .image-placeholder {
            height: 180px;
            background-color: var(--surface-lighter);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--text-secondary);
            padding: 1rem 0.75rem;
            text-align: center;
            position: relative;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0; /* 画像領域が縮まないようにする */
            overflow: hidden;
            background: linear-gradient(145deg, var(--surface-lighter), var(--surface));
            box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05), inset 0 -2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .image-placeholder svg {
            width: 64px;
            height: 64px;
            margin-bottom: 0.5rem;
            opacity: 0.95;
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
            transition: transform 0.2s ease;
        }
        
        .product-card:hover .image-placeholder svg {
            transform: scale(1.05);
        }
        
        .image-placeholder div {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
            font-weight: 500;
        }
        
        .search-image-link {
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: rgba(187, 0, 0, 0.8);
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            transition: background-color 0.2s;
            z-index: 2;
        }
        
        .search-image-link:hover {
            background-color: var(--primary);
            color: white;
        }
        
        .search-image-link svg {
            width: 12px;
            height: 12px;
        }
        
        /* プロダクトカードの高さ固定 */
        .product-card {
            background-color: var(--card);
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.3s ease;
            border: 1px solid var(--border);
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
            cursor: pointer;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            border-color: rgba(187, 0, 0, 0.3);
        }
        
        /* プロダクト詳細の強化 */
        .product-details {
            padding: 1rem;
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .product-details h3 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            line-height: 1.4;
            font-weight: 600;
            color: white;
            min-height: 2.8rem; /* タイトルの最小高さを固定 */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .product-card:hover .product-details h3 {
            color: var(--primary);
        }
        
        .product-meta {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .meta-tag {
            font-size: 0.75rem;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            color: white;
            font-weight: 500;
        }
        
        .meta-tag.game, .meta-tag.games {
            background-color: #5755d9;
        }
        
        .meta-tag.book, .meta-tag.books {
            background-color: #2e7d32;
        }
        
        .meta-tag.music {
            background-color: #9c27b0;
        }
        
        .meta-tag.collectible, .meta-tag.collectibles {
            background-color: #e65100;
        }
        
        .meta-tag.console {
            background-color: #0277bd;
        }
        
        .meta-tag.other {
            background-color: var(--surface);
            color: var(--text-secondary);
        }
        
        .product-condition {
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .condition-badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .condition-badge.new {
            background-color: #3a9e4e;
            color: white;
        }
        
        .condition-badge.used {
            background-color: #2c7cb0;
            color: white;
        }
        
        .stock-status {
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
            font-weight: 600;
        }
        
        .stock-status.in-stock {
            background-color: rgba(58, 158, 78, 0.2);
            color: #3a9e4e;
        }
        
        .stock-status.out-of-stock {
            background-color: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .product-price {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 1rem;
            color: var(--text-primary);
            margin-top: auto;
        }
        
        .product-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: auto;
        }
        
        .btn {
            padding: 0.6rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            text-decoration: none;
            text-align: center;
            transition: background-color 0.2s;
        }
        
        .btn-primary {
            background-color: var(--primary);
            color: white;
            border: none;
            flex: 1;
        }
        
        .btn-primary:hover {
            background-color: var(--primary-hover);
            color: white;
        }
        
        .btn-secondary {
            background-color: transparent;
            color: var(--text-primary);
            border: 1px solid var(--border);
        }
        
        .btn-secondary:hover {
            background-color: var(--surface);
        }
        
        /* 商品カードのクリック可能化のためのスタイル */
        .product-card {
            cursor: pointer;
            position: relative;
        }

        /* Google検索リンクのスタイル */
        .search-image-link {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            cursor: pointer;
        }

        /* Add to Cartボタンとデテールボタンのスタイル */
        .product-actions .btn {
            position: relative;
            z-index: 5;
            cursor: pointer;
        }

        /* 商品カード内の要素にカーソルポインタを設定 */
        .product-card .image-placeholder,
        .product-card .product-details h3,
        .product-card .product-meta,
        .product-card .product-price {
            cursor: pointer;
        }

        /* ホバー効果を強化 */
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            border-color: var(--primary);
        }

        .product-card:hover .product-details h3 {
            color: var(--primary);
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <div class="logo">
                <a href="index.html">
                    <h1>Play<span>Port</span>JP</h1>
                </a>
            </div>
            
            <!-- モバイル用検索バー -->
            <div class="mobile-search-container">
                <form action="search-results.html" method="get">
                    <input type="search" placeholder="Search..." aria-label="Search" name="query" id="mobile-search-input">
                    <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>
            
            <!-- ヘッダーのアクションアイコン -->
            <div class="nav-actions">
                <!-- 注文履歴アイコン -->
                <a href="order-history.html" class="nav-icon order-history-icon" title="Order History">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </a>
                
                <!-- アカウントアイコン -->
                <a href="account.html" class="nav-icon account-icon" title="Account">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </a>
                
                <!-- カートアイコン -->
                <a href="cart.html" class="nav-icon cart-icon" title="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-count" id="cart-count">0</span>
                </a>
            </div>
            
            <!-- デスクトップ用検索バー -->
            <div class="search-container">
                <form action="search-results.html" method="get" id="search-form">
                    <input type="search" placeholder="Search products..." aria-label="Search" name="query" id="search-input">
                    <button type="submit" id="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>
            
            <!-- デスクトップ用ナビゲーション -->
            <nav class="header-desktop-nav">
                <ul>
                    <li><a href="order-history.html">Order History</a></li>
                    <li><a href="account.html" id="account-link">Account</a></li>
                    <li class="cart-icon">
                        <a href="cart.html" id="cart-link-desktop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span class="cart-count" id="cart-count-desktop">0</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section id="categories" class="categories">
            <div class="container">
                <h2>Browse by Category</h2>
                <div class="category-grid">
                    <a href="search-results.html?category=games" class="category-card" data-category="games">
                        <div class="category-image"></div>
                        <h3>Games</h3>
                    </a>
                    <a href="search-results.html?category=books" class="category-card" data-category="books">
                        <div class="category-image"></div>
                        <h3>Books</h3>
                    </a>
                    <a href="search-results.html?category=music" class="category-card" data-category="music">
                        <div class="category-image"></div>
                        <h3>Music</h3>
                    </a>
                    <a href="search-results.html?category=collectibles" class="category-card" data-category="collectibles">
                        <div class="category-image"></div>
                        <h3>Collectibles</h3>
                    </a>
                </div>
            </div>
        </section>

        <section id="featured" class="featured-products">
            <div class="container">
                <h2>Featured Products</h2>
                <div class="product-grid">
                    <!-- JavaScript で商品が動的に挿入されます -->
                </div>
            </div>
        </section>

        <section id="about" class="about-section">
            <div class="container">
                <div class="about-content">
                    <h2>About PlayPortJP</h2>
                    <p>Japanese treasures, globally delivered. Quality-verified in Japan. All-inclusive pricing.</p>
                    <p>100% authenticity, 0% complexity</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-nav">
                    <h3>Categories</h3>
                    <ul>
                        <li><a href="search-results.html?category=games">Games</a></li>
                        <li><a href="search-results.html?category=books">Books</a></li>
                        <li><a href="search-results.html?category=music">Music</a></li>
                        <li><a href="search-results.html?category=collectibles">Collectibles</a></li>
                    </ul>
                </div>
                <div class="footer-nav">
                    <h3>Information</h3>
                    <ul>
                        <li><a href="shipping.html">Shipping</a></li>
                        <li><a href="returns.html">Returns</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-newsletter">
                    <h3>Stay Updated</h3>
                    <p>Subscribe for updates on new arrivals and special offers.</p>
                    <form id="newsletter-form">
                        <input type="email" placeholder="Your email" aria-label="Email for newsletter" id="newsletter-email" required>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 PlayPortJP. All rights reserved.</p>
            </div>
        </div>
    </footer>
    
    <!-- JavaScript file loading -->
    <script src="js/common.js"></script>
    <script src="js/index.js"></script>
</body>
</html>
