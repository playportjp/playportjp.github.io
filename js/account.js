// account.js - アカウント画面の機能を管理

document.addEventListener('DOMContentLoaded', function() {
    // タブの切り替え機能を設定
    setupAccountTabs();
    
    // フォームの送信イベントを設定
    setupFormSubmitHandlers();
    
    // ボタンのイベントハンドラーを設定
    setupButtonHandlers();
    
    // プロフィール情報をロード（模擬データ）
    loadAccountData();
    
    // カートマネージャーとの連携
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.updateCartCount();
    }
});

// タブの切り替え機能を設定
function setupAccountTabs() {
    const tabItems = document.querySelectorAll('.account-sidebar li');
    const tabContents = document.querySelectorAll('.account-tab');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // アクティブクラスをすべてのタブから削除
            tabItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // クリックされたタブをアクティブに
            this.classList.add('active');
            
            // データ属性からタブIDを取得
            const tabId = this.getAttribute('data-tab');
            
            // すべてのコンテンツを非表示
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // 対応するコンテンツを表示
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// フォームの送信イベントを設定
function setupFormSubmitHandlers() {
    // プロフィールフォーム
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // フォームデータの取得と保存（実際にはAPI送信など）
            const formData = {
                fullname: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthday: document.getElementById('birthday').value
            };
            
            // ローカルストレージに保存（デモ用）
            localStorage.setItem('account-profile', JSON.stringify(formData));
            
            // フィードバック表示
            showFeedback('profile-form', 'Profile information updated successfully!');
        });
    }
    
    // セキュリティフォーム
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // パスワード一致チェック
            if (newPassword !== confirmPassword) {
                showFeedback('security-form', 'New passwords do not match!', true);
                return;
            }
            
            // パスワード変更処理（実際にはAPI送信など）
            
            // フィードバック表示
            showFeedback('security-form', 'Security settings updated successfully!');
            
            // フォームリセット
            securityForm.reset();
        });
    }
    
    // 通知設定フォーム
    const notificationsForm = document.getElementById('notifications-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // 通知設定の保存処理
            const notificationSettings = {
                emailOrder: document.getElementById('email-order').checked,
                emailPromo: document.getElementById('email-promo').checked,
                emailNews: document.getElementById('email-news').checked,
                smsOrder: document.getElementById('sms-order').checked,
                smsPromo: document.getElementById('sms-promo').checked
            };
            
            // ローカルストレージに保存（デモ用）
            localStorage.setItem('account-notifications', JSON.stringify(notificationSettings));
            
            // フィードバック表示
            showFeedback('notifications-form', 'Notification preferences updated!');
        });
    }
}

// ボタンのイベントハンドラーを設定
function setupButtonHandlers() {
    // 住所追加ボタン
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            // 住所追加モーダルやフォームを表示（実装例）
            alert('Address form will be shown here.');
            // 実際にはモーダルやフォームを表示する処理
        });
    }
    
    // 支払い方法追加ボタン
    const addPaymentBtn = document.getElementById('add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            // 支払い方法追加モーダルやフォームを表示（実装例）
            alert('Payment method form will be shown here.');
            // 実際にはモーダルやフォームを表示する処理
        });
    }
    
    // 住所編集・削除ボタン
    const addressActions = document.querySelectorAll('.address-actions button');
    addressActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const addressItem = this.closest('.address-item');
            const addressTitle = addressItem.querySelector('h3').textContent.split(' ')[0];
            
            if (action === 'Edit') {
                // 住所編集モーダルやフォームを表示
                alert(`Edit ${addressTitle} address`);
            } else if (action === 'Delete') {
                // 住所削除確認
                if (confirm(`Are you sure you want to delete ${addressTitle} address?`)) {
                    // 削除処理
                    addressItem.style.opacity = '0';
                    setTimeout(() => {
                        addressItem.remove();
                    }, 300);
                }
            } else if (action === 'Set as Default') {
                // デフォルト設定処理
                document.querySelectorAll('.address-item h3 .default-badge').forEach(badge => {
                    badge.remove();
                });
                const title = addressItem.querySelector('h3');
                title.innerHTML = `${addressTitle} <span class="default-badge">Default</span>`;
                
                // ボタンの表示を調整
                document.querySelectorAll('.address-item').forEach(item => {
                    const setDefaultBtn = item.querySelector('.address-actions button:nth-child(2)');
                    if (setDefaultBtn && setDefaultBtn.textContent.trim() === 'Set as Default') {
                        setDefaultBtn.style.display = 'inline-block';
                    }
                });
                this.style.display = 'none';
            }
        });
    });
    
    // 支払い方法編集・削除ボタン
    const paymentActions = document.querySelectorAll('.payment-actions button');
    paymentActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            const paymentItem = this.closest('.payment-item');
            const paymentTitle = paymentItem.querySelector('h3').textContent.split(' ')[0];
            
            if (action === 'Edit') {
                // 支払い方法編集モーダルやフォームを表示
                alert(`Edit ${paymentTitle} payment method`);
            } else if (action === 'Delete') {
                // 支払い方法削除確認
                if (confirm(`Are you sure you want to delete ${paymentTitle} payment method?`)) {
                    // 削除処理
                    paymentItem.style.opacity = '0';
                    setTimeout(() => {
                        paymentItem.remove();
                    }, 300);
                }
            } else if (action === 'Set as Default') {
                // デフォルト設定処理
                document.querySelectorAll('.payment-item h3 .default-badge').forEach(badge => {
                    badge.remove();
                });
                const title = paymentItem.querySelector('h3');
                title.innerHTML = `${paymentTitle} <span class="default-badge">Default</span>`;
                
                // ボタンの表示を調整
                document.querySelectorAll('.payment-item').forEach(item => {
                    const setDefaultBtn = item.querySelector('.payment-actions button:nth-child(2)');
                    if (setDefaultBtn && setDefaultBtn.textContent.trim() === 'Set as Default') {
                        setDefaultBtn.style.display = 'inline-block';
                    }
                });
                this.style.display = 'none';
            }
        });
    });
}

// フィードバックメッセージを表示
function showFeedback(formId, message, isError = false) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // 既存のフィードバックを削除
    const existingFeedback = form.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // フィードバック要素を作成
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${isError ? 'error' : 'success'}`;
    feedback.textContent = message;
    
    // フォームの最後に追加
    form.appendChild(feedback);
    
    // 一定時間後に削除
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 3000);
}

// アカウントデータをロード（デモ用）
function loadAccountData() {
    // プロフィールデータをロード
    const profileData = localStorage.getItem('account-profile');
    if (profileData) {
        const profile = JSON.parse(profileData);
        
        // フォームフィールドに値を設定
        const fullnameField = document.getElementById('fullname');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const birthdayField = document.getElementById('birthday');
        
        if (fullnameField) fullnameField.value = profile.fullname || '';
        if (emailField) emailField.value = profile.email || '';
        if (phoneField) phoneField.value = profile.phone || '';
        if (birthdayField) birthdayField.value = profile.birthday || '';
    }
    
    // 通知設定をロード
    const notificationData = localStorage.getItem('account-notifications');
    if (notificationData) {
        const notifications = JSON.parse(notificationData);
        
        // チェックボックスの状態を設定
        const emailOrderCheck = document.getElementById('email-order');
        const emailPromoCheck = document.getElementById('email-promo');
        const emailNewsCheck = document.getElementById('email-news');
        const smsOrderCheck = document.getElementById('sms-order');
        const smsPromoCheck = document.getElementById('sms-promo');
        
        if (emailOrderCheck) emailOrderCheck.checked = notifications.emailOrder;
        if (emailPromoCheck) emailPromoCheck.checked = notifications.emailPromo;
        if (emailNewsCheck) emailNewsCheck.checked = notifications.emailNews;
        if (smsOrderCheck) smsOrderCheck.checked = notifications.smsOrder;
        if (smsPromoCheck) smsPromoCheck.checked = notifications.smsPromo;
    }
}
