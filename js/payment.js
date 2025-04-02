// payment.js - PlayPortJP 支払い情報ページ用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const paymentForm = document.getElementById('payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentSections = document.querySelectorAll('.payment-details');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.querySelector('.progress-bar-filled');
    
    // 進捗バーの更新（チェックアウトフローの2ステップ目なので50%）
    progressBar.style.width = '50%';
    
    // 支払い方法の切り替え機能
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // すべての支払い詳細セクションを非表示
            paymentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // 選択された支払い方法に対応するセクションを表示
            const selectedMethod = this.value;
            const targetSection = document.querySelector(`.payment-details[data-method="${selectedMethod}"]`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // フォームリセット処理
            resetValidationErrors();
        });
    });
    
    // デフォルトで選択されている支払い方法のセクションを表示
    const defaultMethod = document.querySelector('input[name="payment-method"]:checked');
    if (defaultMethod) {
        const methodValue = defaultMethod.value;
        const defaultSection = document.querySelector(`.payment-details[data-method="${methodValue}"]`);
        if (defaultSection) {
            defaultSection.classList.add('active');
        }
    }
    
    // バリデーションエラーメッセージの表示
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        
        if (existingError) {
            parent.removeChild(existingError);
        }
        
        parent.appendChild(errorDiv);
        element.classList.add('error');
    }
    
    // バリデーションエラーのリセット
    function resetValidationErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }
    
    // クレジットカード情報の基本バリデーション
    function validateCreditCard() {
        let isValid = true;
        const cardNumber = document.getElementById('card-number');
        const cardName = document.getElementById('card-name');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        
        // カード番号のバリデーション (数字のみ、13-19桁)
        if (!/^\d{13,19}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            showError(cardNumber, '有効なカード番号を入力してください (13-19桁の数字)');
            isValid = false;
        }
        
        // 名義のバリデーション (空でないこと)
        if (!cardName.value.trim()) {
            showError(cardName, 'カード名義を入力してください');
            isValid = false;
        }
        
        // 有効期限のバリデーション (MM/YY形式)
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry.value)) {
            showError(cardExpiry, '有効期限は MM/YY 形式で入力してください');
            isValid = false;
        } else {
            // 現在の日付と比較
            const [month, year] = cardExpiry.value.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
            const currentDate = new Date();
            if (expiryDate < currentDate) {
                showError(cardExpiry, '有効期限が切れています');
                isValid = false;
            }
        }
        
        // CVVのバリデーション (3-4桁の数字)
        if (!/^\d{3,4}$/.test(cardCvv.value)) {
            showError(cardCvv, 'セキュリティコードは3-4桁の数字で入力してください');
            isValid = false;
        }
        
        return isValid;
    }
    
    // コンビニ決済のバリデーション
    function validateConvenience() {
        let isValid = true;
        const convName = document.getElementById('conv-name');
        const convEmail = document.getElementById('conv-email');
        const convPhone = document.getElementById('conv-phone');
        
        // 名前のバリデーション
        if (!convName.value.trim()) {
            showError(convName, 'お名前を入力してください');
            isValid = false;
        }
        
        // メールアドレスのバリデーション
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(convEmail.value)) {
            showError(convEmail, '有効なメールアドレスを入力してください');
            isValid = false;
        }
        
        // 電話番号のバリデーション (ハイフンあり・なし両対応)
        if (!/^(\d{10,11}|\d{2,4}-\d{2,4}-\d{3,4})$/.test(convPhone.value)) {
            showError(convPhone, '有効な電話番号を入力してください');
            isValid = false;
        }
        
        return isValid;
    }
    
    // 銀行振込のバリデーション
    function validateBankTransfer() {
        let isValid = true;
        const bankName = document.getElementById('bank-name');
        const bankEmail = document.getElementById('bank-email');
        
        // 名前のバリデーション
        if (!bankName.value.trim()) {
            showError(bankName, 'お名前を入力してください');
            isValid = false;
        }
        
        // メールアドレスのバリデーション
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bankEmail.value)) {
            showError(bankEmail, '有効なメールアドレスを入力してください');
            isValid = false;
        }
        
        return isValid;
    }
    
    // フォーム送信処理
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        resetValidationErrors();
        
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let isValid = false;
        
        // 選択された支払い方法に応じたバリデーション
        switch (selectedMethod) {
            case 'credit-card':
                isValid = validateCreditCard();
                break;
            case 'convenience':
                isValid = validateConvenience();
                break;
            case 'bank-transfer':
                isValid = validateBankTransfer();
                break;
            default:
                // デフォルトケース
                isValid = false;
        }
        
        if (isValid) {
            // セッションストレージに支払い情報を保存
            savePaymentData(selectedMethod);
            
            // 次のページへ遷移
            window.location.href = 'checkout-review.html';
        } else {
            // エラーメッセージのある位置までスクロール
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // 支払い情報をセッションストレージに保存
    function savePaymentData(method) {
        const paymentData = {
            method: method
        };
        
        switch (method) {
            case 'credit-card':
                paymentData.cardNumber = document.getElementById('card-number').value;
                paymentData.cardName = document.getElementById('card-name').value;
                paymentData.cardExpiry = document.getElementById('card-expiry').value;
                // セキュリティのためCVVは保存しない
                break;
            case 'convenience':
                paymentData.name = document.getElementById('conv-name').value;
                paymentData.email = document.getElementById('conv-email').value;
                paymentData.phone = document.getElementById('conv-phone').value;
                break;
            case 'bank-transfer':
                paymentData.name = document.getElementById('bank-name').value;
                paymentData.email = document.getElementById('bank-email').value;
                break;
        }
        
        // セッションストレージに保存
        sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
    }
    
    // 入力フィールドのフォーマット関連の機能
    
    // クレジットカード番号の自動フォーマット (4桁ごとにスペース)
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    // 有効期限の自動フォーマット (MM/YY)
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});
