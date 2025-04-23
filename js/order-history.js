// order-history.js - 注文履歴画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    console.log('Order history page loaded');
    
    // カート情報をロード（共通）
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
    }

    // 注文詳細の表示/非表示切り替え機能を設定
    setupOrderDetailsToggle();
    
    // フィルター機能を設定
    setupOrderFilters();
    
    // モックデータをロード
    // サンプルデータをより確実に表示するために変更
    setupOrderHistory();
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

// 注文履歴の設定と表示
function setupOrderHistory() {
    // サンプルデータがすでにHTMLに存在するので、一旦何もしない
    console.log('Setting up order history with HTML sample data');
    
    // 空データチェックと表示
    const emptyOrdersElement = document.getElementById('empty-orders');
    const orderListElement = document.getElementById('order-list');
    const orderItems = document.querySelectorAll('.order-item');
    
    if (orderItems.length === 0 && emptyOrdersElement && orderListElement) {
        // 注文データが実際に空の場合
        orderListElement.style.display = 'none';
        emptyOrdersElement.style.display = 'block';
    } else {
        // サンプルデータがある場合
        if (emptyOrdersElement) {
            emptyOrdersElement.style.display = 'none';
        }
        orderListElement.style.display = 'block';
    }
    
    // フィルター初期化
    filterOrders();
    
    // 実際のアプリでは、ここでAPIからデータを取得し、HTMLを動的に生成する
    // サンプルデータをローカルストレージに保存（開発用）
    // 本番環境では削除する必要があります
    saveOrderHistoryToLocalStorage();
}

// サンプルデータをローカルストレージに保存（開発用）
function saveOrderHistoryToLocalStorage() {
    // すでにデータがある場合は何もしない
    if (localStorage.getItem('order-history')) {
        console.log('Order history already exists in localStorage');
        return;
    }
    
    // 現在のHTMLからサンプルデータを取得
    const orderItems = document.querySelectorAll('.order-item');
    const orders = [];
    
    orderItems.forEach(item => {
        const orderId = item.getAttribute('data-order-id');
        const orderNumber = item.querySelector('.order-number')?.textContent || '';
        const orderDate = item.querySelector('.order-date')?.textContent || '';
        const orderStatus = item.querySelector('.order-status')?.textContent || '';
        const orderTotal = item.querySelector('.order-total')?.textContent || '';
        const itemCount = item.querySelector('.item-count')?.textContent || '';
        
        // 詳細情報
        const detailsElement = document.getElementById(`details-${orderId}`);
        const orderDetails = {};
        
        if (detailsElement) {
            // 商品情報を取得
            const detailItems = Array.from(detailsElement.querySelectorAll('.details-item')).map(detailItem => {
                return {
                    name: detailItem.querySelector('.details-item-name')?.textContent || '',
                    price: detailItem.querySelector('.details-item-price')?.textContent || '',
                    quantity: detailItem.querySelector('.details-item-quantity')?.textContent || ''
                };
            });
            
            // 合計金額情報
            const totals = {};
            const totalRows = detailsElement.querySelectorAll('.total-row');
            totalRows.forEach(row => {
                const label = row.children[0]?.textContent.replace(':', '') || '';
                const value = row.children[1]?.textContent || '';
                if (label && value) {
                    totals[label] = value;
                }
            });
            
            orderDetails.items = detailItems;
            orderDetails.totals = totals;
        }
        
        orders.push({
            id: orderId,
            number: orderNumber,
            date: orderDate,
            status: orderStatus,
            total: orderTotal,
            itemCount: itemCount,
            details: orderDetails
        });
    });
    
    // ローカルストレージに保存
    localStorage.setItem('order-history', JSON.stringify(orders));
    console.log('Sample order history saved to localStorage:', orders);
}
