// order-history.js - 注文履歴画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    console.log('Order history page loaded');
    
    // カート情報をロード（共通）
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
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

// モックデータをロード（実際のアプリではAPIからデータを取得）
function loadOrderHistory() {
    // 実際のアプリでは、ここでAPIリクエストを行い、注文履歴データを取得します
    
    // モックデータ取得のシミュレーション
    const mockApiCall = new Promise((resolve) => {
        // 実際のアプリではここでAPIリクエストを実行
        // ここでは1秒後にモックデータを返すようにシミュレーション
        setTimeout(() => {
            // ローカルストレージから注文履歴を取得（デモ用）
            const savedOrders = localStorage.getItem('order-history');
            let orders = [];
            
            if (savedOrders) {
                try {
                    orders = JSON.parse(savedOrders);
                    console.log('Found saved order history:', orders);
                } catch (e) {
                    console.error('Error parsing order history data:', e);
                }
            } else {
                console.log('No order history found in localStorage');
            }
            
            resolve(orders);
        }, 1000);
    });
    
    // ローディング表示（必要に応じて）
    const orderList = document.getElementById('order-list');
    if (orderList) {
        orderList.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading your order history...</p>
            </div>
        `;
    }
    
    // データ取得後の処理
    mockApiCall.then(orders => {
        displayOrderHistory(orders);
    }).catch(error => {
        console.error('Error loading order history:', error);
        if (orderList) {
            orderList.innerHTML = `
                <div class="error-message">
                    <p>Error loading your order history. Please try again later.</p>
                    <button class="btn" onclick="loadOrderHistory()">Retry</button>
                </div>
            `;
        }
    });
}

// 注文履歴データを表示
function displayOrderHistory(orders) {
    // サンプルの注文データが既にHTMLに存在するため、このデモでは何もしません
    // 実際のアプリでは、ここでDOM要素を生成して注文データを表示します
    
    // 注文データが空の場合は空の状態を表示
    const emptyOrdersElement = document.getElementById('empty-orders');
    const orderListElement = document.getElementById('order-list');
    
    if (Array.isArray(orders) && orders.length === 0) {
        if (emptyOrdersElement && orderListElement) {
            orderListElement.style.display = 'none';
            emptyOrdersElement.style.display = 'block';
        }
    } else {
        // 実際のデータに基づいて注文リストを生成するコード
        // ここではHTML内の静的サンプルデータを使用
    }
    
    // フィルター初期化（すべての注文を表示）
    filterOrders();
}

// その他の機能（必要に応じて追加）
    
    // 注文詳細の表示/非表示切り替え機能を設定
    setupOrderDetailsToggle();
    
    // フィルター機能を設定
    setupOrderFilters();
    
    // モックデータをロード（実際のアプリではAPIからデータを取得）
    loadOrderHistory();
});

// 注文詳細の表示/非表示切り替え機能を設定
function setupOrderDetailsToggle() {
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // クリックされた注文アイテムを取得
            const orderItem = this.closest('.order-item');
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
                this.innerHTML = `View Details
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
                this.innerHTML = `Hide Details
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>`;
            }
        });
    });
}
