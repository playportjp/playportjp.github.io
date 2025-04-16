<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - PlayPortJP</title>
    <meta name="description" content="Complete your order at PlayPortJP - Premium Japanese games, books, music, and collectibles.">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        /* チェックアウトページ用スタイル */
        .page-title {
            margin: 2rem 0;
            font-size: 1.8rem;
            font-weight: 500;
        }
        
        .checkout-container {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        /* 注文サマリー部分のスタイル */
        .order-summary {
            background-color: var(--surface);
            border-radius: 8px;
            border: 1px solid var(--border);
            padding: 1.5rem;
            align-self: start;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .order-summary h2 {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            font-weight: 500;
            color: white;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }
        
        #checkout-items {
            margin-bottom: 1.5rem;
        }
        
        .checkout-item {
            display: flex;
            margin-bottom: 1.25rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--border);
        }
        
        .checkout-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .checkout-item-image {
            width: 70px;
            height: 70px;
            background-color: var(--surface-lighter);
            border-radius: 4px;
            margin-right: 1rem;
            flex-shrink: 0;
            border: 1px solid var(--border);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
        
        .checkout-item-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .checkout-item-image svg {
            width: 30px;
            height: 30px;
            opacity: 0.8;
        }
        
        .checkout-item-details {
            flex-grow: 1;
            min-width: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .checkout-item-title {
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 0.35rem;
            color: white;
            line-height: 1.3;
            /* 長い商品名の表示改善 */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }
        
        .checkout-item-meta {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.35rem;
            line-height: 1.3;
        }
        
        .checkout-item-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            margin-top: 0.35rem;
        }
        
        .checkout-item-price .price {
            font-weight: 500;
            color: #FFCF33;
        }
        
        /* 注文合計部分のスタイル */
        .order-totals {
            margin-top: 1.5rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--border);
        }
        
        .order-subtotal, .order-shipping, .order-tax {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.85rem;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }
        
        .order-total {
            display: flex;
            justify-content: space-between;
            margin-top: 1.25rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--border);
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
        }
        
        .order-total-value {
            color: #FFCF33;
        }
        
        /* チェックアウトフォームのスタイル */
        .checkout-form {
            background-color: var(--surface);
            border-radius: 8px;
            border: 1px solid var(--border);
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .checkout-form h2 {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            font-weight: 500;
            color: white;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        label {
            display: block;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }
        
        input, select, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: 4px;
            background-color: var(--surface-lighter);
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--focus-ring);
        }
        
        select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px;
            padding-right: 2.5rem;
        }
        
        /* エラーメッセージのスタイル */
        .error-message {
            color: #ff6b6b;
            font-size: 0.85rem;
            margin-top: 0.35rem;
            display: none;
        }
        
        input.invalid, select.invalid, textarea.invalid {
            border-color: #ff6b6b;
        }
        
        .payment-notice {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background-color: rgba(255, 207, 51, 0.1);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: #FFCF33;
            font-size: 0.9rem;
        }
        
        .payment-options {
            margin-bottom: 2rem;
        }
        
        .payment-option {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        
        .payment-option input[type="radio"] {
            width: auto;
            margin-right: 0.75rem;
        }
        
        .payment-option label {
            margin-bottom: 0;
            font-size: 0.95rem;
            color: var(--text-primary);
        }
        
        .btn-checkout {
            display: block;
            width: 100%;
            padding: 0.9rem 0;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.95rem;
            margin-top: 1.5rem;
            cursor: pointer;
            transition: background-color 0.2s;
            text-align: center;
        }
        
        .btn-checkout:hover {
            background-color: var(--primary-hover);
        }
        
        /* モバイル対応 */
        @media (max-width: 992px) {
            .checkout-container {
                grid-template-columns: 1fr;
            }
            
            .order-summary {
                margin-bottom: 2rem;
            }
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
                gap: 0;
            }
            
            .checkout-item-title {
                -webkit-line-clamp: 3; /* モバイルでは3行まで表示 */
            }
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
            <nav>
                <ul>
                    <li><a href="order-history.html">Order History</a></li>
                    <li><a href="account.html" id="account-link">Account</a></li>
                    <li class="cart-icon">
                        <a href="cart.html" id="cart-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span class="cart-count" id="cart-count">0</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="checkout-section">
            <div class="container">
                <h1 class="page-title">Checkout</h1>
                
                <div class="checkout-container">
                    <!-- 注文サマリー -->
                    <div class="order-summary">
                        <h2>Order Summary</h2>
                        <div id="checkout-items">
                            <!-- カートアイテムがここに表示されます -->
                        </div>
                        <div class="order-totals">
                            <div class="order-subtotal">
                                <span>Subtotal:</span>
                                <span id="checkout-subtotal">0.00 CAD</span>
                            </div>
                            <div class="order-shipping">
                                <span>Shipping:</span>
                                <span id="checkout-shipping">15.00 CAD</span>
                            </div>
                            <div class="order-tax">
                                <span>Tax (5%):</span>
                                <span id="checkout-tax">0.00 CAD</span>
                            </div>
                            <div class="order-total">
                                <span>Total:</span>
                                <span id="checkout-total" class="order-total-value">0.00 CAD</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- チェックアウトフォーム -->
                    <div class="checkout-form">
                        <h2>Shipping Information</h2>
                        <form id="order-form">
                            <div class="form-group">
                                <label for="full-name">Full Name</label>
                                <input type="text" id="full-name" name="full-name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" id="address" name="address" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="city">City</label>
                                    <input type="text" id="city" name="city" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="postal-code">Postal Code</label>
                                    <input type="text" id="postal-code" name="postal-code" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="country">Country</label>
                                <select id="country" name="country" required>
                                    <option value="FR">France</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="notes">Order Notes (Optional)</label>
                                <textarea id="notes" name="notes" rows="3"></textarea>
                            </div>
                            
                            <div class="payment-notice">
                                <p>Note: This is a demo store. No actual payment will be processed.</p>
                            </div>
                            
                            <div class="payment-options">
                                <h2>Payment Method</h2>
                                
                                <div class="payment-option">
                                    <input type="radio" id="payment-credit" name="payment-method" value="credit" checked>
                                    <label for="payment-credit">Credit Card</label>
                                </div>
                                
                                <div class="payment-option">
                                    <input type="radio" id="payment-paypal" name="payment-method" value="paypal">
                                    <label for="payment-paypal">PayPal</label>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-checkout">Complete Order</button>
                        </form>
                    </div>
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
                        <li><a href="category.html?cat=games">Games</a></li>
                        <li><a href="category.html?cat=books">Books</a></li>
                        <li><a href="category.html?cat=music">Music</a></li>
                        <li><a href="category.html?cat=collectibles">Collectibles</a></li>
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
    <script src="js/checkout.js"></script>
</body>
</html>="">Select a country</option>
                                    <option value="CA">Canada</option>
                                    <option value="US">United States</option>
                                    <option value="JP">Japan</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value
