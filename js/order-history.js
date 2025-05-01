// order-history.js - 注文履歴画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    console.log('Order history page loaded');
    
    // カート情報をロード（共通）
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
    }

    // 画面の初期化前にローディング表示
    showLoading();

    // 注文詳細の表示/非表示切り替え機能を設定
    setupOrderDetailsToggle();
    
    // フィルター機能を設定
    setupOrderFilters();
    
    // 注文履歴データをロード
    loadOrderHistory();
});

// ローディング表示
function showLoading() {
    const orderListElement = document.getElementById('order-list');
    const emptyOrdersElement = document.getElementById('empty-orders');
    
    if (orderListElement) {
        // 既存のサンプルデータを非表示
        orderListElement.innerHTML = `
            <div class="loading-container" style="text-align: center; padding: 2rem;">
                <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 3px solid rgba(0,0,0,.1); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s ease-in-out infinite;"></div>
                <p style="margin-top: 1rem; color: var(--text-secondary);">Loading your order history...</p>
            </div>
        `;
        
        // スピナーアニメーションのスタイルを追加
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    if (emptyOrdersElement) {
        emptyOrdersElement.style.display = 'none';
    }
}

// 注文詳細の表示/非表示切り替え機能を設定
function setupOrderDetailsToggle() {
    // 動的に追加される要素にイベントを設定するため、イベント委譲を使用
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.view-details-btn');
        if (!btn) return;
        
        e.preventDefault();
        
        // クリックされた注文アイテムを取得
        const orderItem = btn.closest('.order-item');
        const orderId = orderItem.getAttribute('data-order-id');
        const orderDetails = document.getElementById(`details-${orderId}`);
        
        if (!orderDetails) {
            console.warn(`Order details element not found for order ID: ${orderId}`);
            return;
        }
        
        // 詳細の表示状態を切り替える
        const isActive = orderDetails.classList.contains('active');
        
        // 詳細を表示/非表示
        if (isActive) {
            orderDetails.classList.remove('active');
            btn.innerHTML = `View Details
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>`;
        } else {
            // 他の開いている詳細を閉じる
            document.querySelectorAll('.order-details.active').forEach(detail => {
                if (detail.id !== `details-${orderId}`) {
                    detail.classList.remove('active');
                    
                    // 対応するボタンのテキストも更新
                    const parentItem = detail.closest('.order-item');
                    if (parentItem) {
                        const btn = parentItem.querySelector('.view-details-btn');
                        if (btn) {
                            btn.innerHTML = `View Details
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>`;
                        }
                    }
                }
            });
            
            // このアイテムの詳細を表示
            orderDetails.classList.add('active');
            btn.innerHTML = `Hide Details
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>`;
        }
    });
}

// フィルター機能を設定
function setupOrderFilters() {
    const statusFilter = document.getElementById('filter-status');
    const dateFilter = document.getElementById('filter-date');
    const searchInput = document.getElementById('search-order');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterOrders);
    }
    
    if (searchInput) {
        // 入力による検索（300ms遅延を設定）
        let timeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(filterOrders, 300);
        });
        
        // Enterキーでの検索
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterOrders();
            }
        });
    }
}

// 注文をフィルタリング
function filterOrders() {
    const statusFilter = document.getElementById('filter-status');
    const dateFilter = document.getElementById('filter-date');
    const searchInput = document.getElementById('search-order');
    
    const statusValue = statusFilter ? statusFilter.value : 'all';
    const dateValue = dateFilter ? dateFilter.value : 'all';
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    console.log('Filtering orders:', { status: statusValue, date: dateValue, search: searchValue });
    
    // すべての注文アイテムを取得
    const orderItems = document.querySelectorAll('.order-item');
    let visibleCount = 0;
    
    orderItems.forEach(item => {
        let statusMatch = true;
        let dateMatch = true;
        let searchMatch = true;
        
        // ステータスフィルタリング
        if (statusValue !== 'all') {
            const statusElement = item.querySelector('.order-status');
            if (statusElement) {
                statusMatch = statusElement.classList.contains(`status-${statusValue}`);
            }
        }
        
        // 日付フィルタリング
        if (dateValue !== 'all') {
            const dateElement = item.querySelector('.order-date');
            if (dateElement) {
                const orderDate = new Date(dateElement.textContent);
                const now = new Date();
                let minDate;
                
                switch (dateValue) {
                    case '30days':
                        minDate = new Date(now);
                        minDate.setDate(now.getDate() - 30);
                        break;
                    case '6months':
                        minDate = new Date(now);
                        minDate.setMonth(now.getMonth() - 6);
                        break;
                    case 'year':
                        minDate = new Date(now);
                        minDate.setFullYear(now.getFullYear() - 1);
                        break;
                }
                
                dateMatch = orderDate >= minDate;
            }
        }
        
        // テキスト検索
        if (searchValue) {
            const orderNumber = item.querySelector('.order-number');
            const itemNames = Array.from(item.querySelectorAll('.details-item-name')).map(el => el.textContent.toLowerCase());
            
            const numberMatch = orderNumber ? orderNumber.textContent.toLowerCase().includes(searchValue) : false;
            const nameMatch = itemNames.some(name => name.includes(searchValue));
            
            searchMatch = numberMatch || nameMatch;
        }
        
        // すべての条件が一致する場合のみ表示
        const shouldShow = statusMatch && dateMatch && searchMatch;
        item.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            visibleCount++;
        }
    });
    
    // 表示する注文がない場合、空の状態を表示
    const emptyOrdersElement = document.getElementById('empty-orders');
    const orderListElement = document.getElementById('order-list');
    
    if (visibleCount === 0 && emptyOrdersElement && orderListElement) {
        orderListElement.style.display = 'none';
        emptyOrdersElement.style.display = 'block';
    } else if (emptyOrdersElement && orderListElement) {
        orderListElement.style.display = 'block';
        emptyOrdersElement.style.display = 'none';
    }
}

// 注文履歴データを取得
function loadOrderHistory() {
    // APIからデータを取得する関数（実際の実装では、ここでAPIリクエストを行う）
    // 現時点ではLocalStorageからのモックデータを使用
    getOrderHistoryData()
        .then(orders => {
            if (orders && orders.length > 0) {
                displayOrderHistory(orders);
            } else {
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading order history:', error);
            showErrorState();
        });
}

// 注文履歴データを取得する関数（APIリクエストの代わり）
function getOrderHistoryData() {
    return new Promise((resolve, reject) => {
        try {
            // LocalStorageからデータを取得
            const savedOrderHistory = localStorage.getItem('order-history');
            
            if (savedOrderHistory) {
                const orders = JSON.parse(savedOrderHistory);
                console.log('Retrieved order history from localStorage:', orders);
                resolve(orders);
            } else {
                // 開発用：過去の注文履歴がない場合、空の配列を返す
                // 実際のアプリではAPIから履歴を取得する
                console.log('No order history found in localStorage');
                resolve([]);
            }
        } catch (error) {
            console.error('Error parsing order history data:', error);
            reject(error);
        }
    });
}

// 注文履歴を表示
function displayOrderHistory(orders) {
    const orderListElement = document.getElementById('order-list');
    
    if (!orderListElement) {
        console.error('Order list element not found');
        return;
    }
    
    // ローディング表示を削除
    orderListElement.innerHTML = '';
    
    if (orders.length === 0) {
        showEmptyState();
        return;
    }
    
    // 注文データを表示
    orders.forEach(order => {
        const orderHTML = createOrderHTML(order);
        orderListElement.innerHTML += orderHTML;
    });
    
    // フィルター初期化
    filterOrders();
}

// 注文データからHTMLを生成
function createOrderHTML(order) {
    // 注文アイテムのプレビュー生成
    let previewItemsHTML = '';
    
    if (order.details && order.details.items) {
        // 最大3つのアイテムを表示
        const previewItems = order.details.items.slice(0, 3);
        
        previewItems.forEach(item => {
            // 商品画像があるかどうかを確認（実際の実装では商品IDから画像を取得する）
            const hasImage = item.image ? true : false;
            
            if (hasImage) {
                previewItemsHTML += `
                    <div class="preview-item">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                `;
            } else {
                previewItemsHTML += `
                    <div class="preview-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                `;
            }
        });
    }
    
    // 注文詳細HTML生成
    let detailsHTML = createOrderDetailsHTML(order);
    
    // 注文ステータスに基づいてステータスクラスを決定
    const statusClass = getStatusClass(order.status);
    
    // 配送中の注文に対してはトラッキングリンクを表示
    const trackingLink = 
        (statusClass === 'status-shipped' || statusClass === 'status-processing') 
            ? `<a href="#" class="track-order-btn">Track Package</a>` 
            : '';
    
    // 配送完了の注文に対してはレビューリンクを表示
    const reviewLink = 
        statusClass === 'status-delivered' 
            ? `<a href="#" class="review-btn">Write a Review</a>` 
            : '';
    
    // キャンセルされた注文または配送完了の注文に対しては再購入リンクを表示
    const buyAgainLink = 
        (statusClass === 'status-canceled' || statusClass === 'status-delivered') 
            ? `<a href="#" class="buy-again-btn">Buy Again</a>` 
            : '';
    
    // 注文アイテムのHTMLを生成
    return `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-number">${order.number}</div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-summary">
                <div class="order-status ${statusClass}">${order.status}</div>
                <div class="order-total">${order.total}</div>
                <div class="item-count">${order.itemCount}</div>
            </div>
            <div class="order-items-preview">
                ${previewItemsHTML}
            </div>
            <div class="order-actions">
                <a href="#" class="view-details-btn">View Details
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </a>
                ${trackingLink}
                ${reviewLink}
                ${buyAgainLink}
            </div>
            ${detailsHTML}
        </div>
    `;
}

// 注文ステータスからCSSクラスを取得
function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered')) {
        return 'status-delivered';
    } else if (statusLower.includes('shipped')) {
        return 'status-shipped';
    } else if (statusLower.includes('processing') || statusLower.includes('pending')) {
        return 'status-processing';
    } else if (statusLower.includes('cancel')) {
        return 'status-canceled';
    }
    
    return 'status-processing'; // デフォルト
}

// 注文詳細HTML生成
function createOrderDetailsHTML(order) {
    if (!order.details) {
        return `<div class="order-details" id="details-${order.id}"></div>`;
    }
    
    // アイテム詳細HTML生成
    let itemsHTML = '';
    
    if (order.details.items && order.details.items.length > 0) {
        order.details.items.forEach(item => {
            // 商品画像があるかどうかを確認
            const hasImage = item.image ? true : false;
            
            itemsHTML += `
                <div class="details-item">
                    <div class="details-item-image">
                        ${hasImage 
                            ? `<img src="${item.image}" alt="${item.name}">`
                            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>`
                        }
                    </div>
                    <div class="details-item-info">
                        <div class="details-item-name">${item.name}</div>
                        <div class="details-item-price">
                            ${item.price}
                            <span class="details-item-quantity">${item.quantity}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // 合計金額HTML生成
    let totalsHTML = '';
    
    if (order.details.totals) {
        const totals = order.details.totals;
        const totalKeys = Object.keys(totals);
        
        totalKeys.forEach((key, index) => {
            const isFinal = index === totalKeys.length - 1;
            const rowClass = isFinal ? 'total-row final' : 'total-row';
            
            totalsHTML += `
                <div class="${rowClass}">
                    <div>${key}:</div>
                    <div>${totals[key]}</div>
                </div>
            `;
        });
    }
    
    // 配送情報HTML（仮実装 - 実際のアプリではorder.shippingInfoなどから取得）
    const shippingHTML = `
        <div class="details-section">
            <h3>Shipping Information</h3>
            <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div class="detail-value">${order.shippingName || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Address:</div>
                <div class="detail-value">${order.shippingAddress || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">City:</div>
                <div class="detail-value">${order.shippingCity || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Country:</div>
                <div class="detail-value">${order.shippingCountry || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Tracking Number:</div>
                <div class="detail-value">${order.trackingNumber || 'N/A'}</div>
            </div>
        </div>
    `;
    
    // 支払い情報HTML（仮実装）
    const paymentHTML = `
        <div class="details-section">
            <h3>Order Information</h3>
            <div class="detail-row">
                <div class="detail-label">Order Number:</div>
                <div class="detail-value">${order.number}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${order.date}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                    <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Payment Method:</div>
                <div class="detail-value">${order.paymentMethod || 'N/A'}</div>
            </div>
        </div>
    `;
    
    // 注文詳細のアクションHTML生成
    const statusClass = getStatusClass(order.status);
    
    let actionsHTML = `
        <div class="details-actions">
    `;
    
    // 配送完了の注文に対してはリターンボタンを表示
    if (statusClass === 'status-delivered') {
        actionsHTML += `<a href="#" class="btn btn-secondary">Request Return</a>`;
    }
    
    // 配送完了の注文に対してはレビューボタンを表示
    if (statusClass === 'status-delivered') {
        actionsHTML += `<a href="#" class="btn">Write a Review</a>`;
    }
    
    // キャンセルされた注文または配送完了の注文に対しては再購入ボタンを表示
    if (statusClass === 'status-canceled' || statusClass === 'status-delivered') {
        actionsHTML += `<a href="#" class="btn btn-secondary">Buy Again</a>`;
    }
    
    actionsHTML += `
        </div>
    `;
    
    return `
        <div class="order-details" id="details-${order.id}">
            ${paymentHTML}
            ${shippingHTML}
            <div class="details-section">
                <h3>Order Details</h3>
                <div class="details-items">
                    ${itemsHTML}
                </div>
                <div class="details-totals">
                    ${totalsHTML}
                </div>
            </div>
            ${actionsHTML}
        </div>
    `;
}

// 空の状態を表示
function showEmptyState() {
    const orderListElement = document.getElementById('order-list');
    const emptyOrdersElement = document.getElementById('empty-orders');
    
    if (orderListElement && emptyOrdersElement) {
        orderListElement.style.display = 'none';
        orderListElement.innerHTML = ''; // サンプルデータを削除
        emptyOrdersElement.style.display = 'block';
    }
}

// エラー状態を表示
function showErrorState() {
    const orderListElement = document.getElementById('order-list');
    
    if (orderListElement) {
        orderListElement.innerHTML = `
            <div class="error-container" style="text-align: center; padding: 3rem 1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: #e53935;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2 style="margin-bottom: 0.5rem;">Unable to Load Orders</h2>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">There was a problem loading your order history. Please try again later.</p>
                <button class="btn" onclick="loadOrderHistory()">Try Again</button>
            </div>
        `;
    }
}

// チェックアウト画面から最新の注文を注文履歴に追加する関数
function addOrderToHistory(orderData) {
    // APIを使用する場合は、ここでAPIリクエストを行う
    // ローカルストレージを使用する場合
    return new Promise((resolve, reject) => {
        try {
            // 既存の注文履歴を取得
            const savedOrderHistory = localStorage.getItem('order-history');
            let orders = [];
            
            if (savedOrderHistory) {
                orders = JSON.parse(savedOrderHistory);
            }
            
            // 新しい注文を追加
            orders.unshift(orderData); // 最新の注文を先頭に追加
            
            // 注文履歴を保存
            localStorage.setItem('order-history', JSON.stringify(orders));
            console.log('Order added to history:', orderData);
            
            resolve(true);
        } catch (error) {
            console.error('Error adding order to history:', error);
            reject(error);
        }
    });
}

// このコードを確認するための表示
console.log('order-history.js loaded successfully');

// 外部からアクセスできるように関数をエクスポート
window.orderHistoryManager = {
    addOrderToHistory: addOrderToHistory,
    loadOrderHistory: loadOrderHistory
};
