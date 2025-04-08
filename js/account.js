document.addEventListener('DOMContentLoaded', function() {
    // タブ切り替え機能
    const tabLinks = document.querySelectorAll('.account-sidebar li');
    const tabContents = document.querySelectorAll('.account-tab');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            // アクティブなタブリンクをリセット
            tabLinks.forEach(t => t.classList.remove('active'));
            // クリックされたタブをアクティブに
            this.classList.add('active');
            
            // タブコンテンツを全て非表示に
            tabContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブに対応するコンテンツを表示
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // フォーム送信処理（デモ用）
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 保存完了メッセージを表示
            showNotification('変更が保存されました！');
        });
    });

    // 「Add New Address」ボタンのイベントリスナー
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            // 実際には新しい住所フォームを表示する処理を追加
            showNotification('新しい住所を追加できます（開発中）');
        });
    }

    // 「Add New Payment Method」ボタンのイベントリスナー
    const addPaymentBtn = document.getElementById('add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            // 実際には新しい支払い方法フォームを表示する処理を追加
            showNotification('新しい支払い方法を追加できます（開発中）');
        });
    }

    // 通知表示機能
    function showNotification(message) {
        // 既存の通知があれば削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 新しい通知要素を作成
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // bodyに追加
        document.body.appendChild(notification);
        
        // スタイルを適用
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '400px';
        notification.style.animation = 'slideInRight 0.3s forwards';
        
        // 通知内のコンテンツスタイル
        const content = notification.querySelector('.notification-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        
        // アイコンのスタイル
        const icon = notification.querySelector('.fa-check-circle');
        icon.style.fontSize = '1.5rem';
        icon.style.marginRight = '10px';
        
        // 閉じるボタンのスタイル
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '1rem';
        
        // 閉じるボタンのイベントリスナー
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(function() {
                notification.remove();
            }, 300);
        });
        
        // 5秒後に自動的に閉じる
        setTimeout(function() {
            if (notification && document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s forwards';
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }
        }, 5000);
        
        // アニメーションのスタイルを追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
