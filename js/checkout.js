// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    // Get the order form element
    const orderForm = document.getElementById('order-form');
    
    // Add event listener to the form submission
    if (orderForm) {
        orderForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Initialize form validation on input fields
    initFormValidation();
    
    // Load cart items into the checkout display
    loadCartItems();
});

// Handle checkout form submission
function handleCheckoutSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    console.log('Handling checkout submission...');
    
    // Form validation
    if (!validateForm()) {
        console.log('Form validation failed');
        // Scroll to the first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    try {
        console.log('Form is valid, collecting order data...');
        
        // Show processing state
        showProcessingState();
        
        // Collect order data
        const orderData = collectOrderData();
        console.log('Order data collected:', orderData);
        
        // Save order data to localStorage
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        console.log('Order data saved to localStorage');
        
        // Clear the cart
        if (window.cartManager) {
            window.cartManager.clearCart();
            console.log('Cart cleared');
        }
        
        // Set a small timeout to allow the processing message to be seen
        // This is optional - you can make it redirect immediately by setting this to 0
        setTimeout(function() {
            // Redirect to order confirmation page
            console.log('Redirecting to order-confirmation.html');
            window.location.href = 'order-confirmation.html';
        }, 800); // Short delay to show the processing message
        
    } catch (error) {
        console.error('Error during checkout process:', error);
        
        // Hide processing state
        hideProcessingState();
        
        // Display error message
        showCheckoutError('An error occurred while processing your order. Please try again.');
    }
}

// Show processing state
function showProcessingState() {
    // Get the submit button
    const submitButton = document.querySelector('.checkout-btn');
    if (submitButton) {
        // Store original text
        submitButton.dataset.originalText = submitButton.textContent;
        
        // Show processing text and disable button
        submitButton.textContent = 'Processing order...';
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#999';
        submitButton.style.cursor = 'wait';
    }
    
    // Create or update processing message
    let processingMessage = document.getElementById('processing-message');
    if (!processingMessage) {
        processingMessage = document.createElement('div');
        processingMessage.id = 'processing-message';
        processingMessage.style.marginTop = '1rem';
        processingMessage.style.padding = '0.75rem';
        processingMessage.style.backgroundColor = 'rgba(0,0,0,0.1)';
        processingMessage.style.borderRadius = '4px';
        processingMessage.style.textAlign = 'center';
        processingMessage.style.color = 'var(--text-primary)';
        
        // Add after the submit button
        const submitButton = document.querySelector('.checkout-btn');
        if (submitButton && submitButton.parentNode) {
            submitButton.parentNode.appendChild(processingMessage);
        }
    }
    
    processingMessage.textContent = 'Processing your order. Please wait...';
    processingMessage.style.display = 'block';
}

// Hide processing state
function hideProcessingState() {
    // Restore submit button
    const submitButton = document.querySelector('.checkout-btn');
    if (submitButton && submitButton.dataset.originalText) {
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
        submitButton.style.cursor = '';
    }
    
    // Hide processing message
    const processingMessage = document.getElementById('processing-message');
    if (processingMessage) {
        processingMessage.style.display = 'none';
    }
}

// Show checkout error message
function showCheckoutError(message) {
    let errorElement = document.getElementById('checkout-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'checkout-error';
        errorElement.className = 'error-message';
        
        // Insert at the top of the form
        const form = document.getElementById('order-form');
        if (form) {
            form.insertBefore(errorElement, form.firstChild);
        }
    }
    
    errorElement.style.display = 'block';
    errorElement.textContent = message;
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Validate the form
function validateForm() {
    let isValid = true;
    
    // Clear all previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.textContent = '');
    
    // Required fields validation
    const requiredFields = [
        { id: 'full-name', error: 'name-error', message: 'Please enter your full name' },
        { id: 'email', error: 'email-error', message: 'Please enter a valid email address' },
        { id: 'phone', error: 'phone-error', message: 'Please enter a valid phone number' },
        { id: 'address', error: 'address-error', message: 'Please enter your street address' },
        { id: 'city', error: 'city-error', message: 'Please enter your city' },
        { id: 'postal-code', error: 'postal-error', message: 'Please enter a valid postal code' },
        { id: 'country', error: 'country-error', message: 'Please select your country' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(field.error);
        
        if (!element || !errorElement) return;
        
        if (!element.value.trim()) {
            errorElement.textContent = field.message;
            element.classList.add('invalid');
            isValid = false;
        } else {
            element.classList.remove('invalid');
            element.classList.add('valid');
        }
    });
    
    // Email validation
    const emailElement = document.getElementById('email');
    const emailErrorElement = document.getElementById('email-error');
    if (emailElement && emailErrorElement && emailElement.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailElement.value.trim())) {
            emailErrorElement.textContent = 'Please enter a valid email address';
            emailElement.classList.add('invalid');
            isValid = false;
        }
    }
    
    // Check credit card fields if credit card option is selected
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (paymentMethod && paymentMethod.value === 'credit') {
        const cardFields = [
            { id: 'card-number', error: 'card-number-error', message: 'Please enter a valid card number' },
            { id: 'expiry-date', error: 'expiry-error', message: 'Please enter a valid expiry date (MM/YY)' },
            { id: 'cvv', error: 'cvv-error', message: 'Please enter a valid CVV code' }
        ];
        
        cardFields.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.error);
            
            if (!element || !errorElement) return;
            
            if (!element.value.trim()) {
                errorElement.textContent = field.message;
                element.classList.add('invalid');
                isValid = false;
            } else {
                element.classList.remove('invalid');
                element.classList.add('valid');
            }
        });
    }
    
    // Terms and conditions checkbox
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');
    if (termsCheckbox && termsError && !termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the Terms and Conditions';
        isValid = false;
    }
    
    return isValid;
}

// Initialize form validation on inputs
function initFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateInput(this);
            }
        });
    });
    
    // Toggle payment method fields
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentFields);
    });
    
    // Promo code button
    const promoButton = document.getElementById('apply-promo');
    if (promoButton) {
        promoButton.addEventListener('click', applyPromoCode);
    }
}

// Toggle payment fields based on selected payment method
function togglePaymentFields() {
    const creditFields = document.getElementById('credit-card-fields');
    const paypalFields = document.getElementById('paypal-fields');
    
    if (this.value === 'credit') {
        creditFields.style.display = 'block';
        paypalFields.style.display = 'none';
    } else if (this.value === 'paypal') {
        creditFields.style.display = 'none';
        paypalFields.style.display = 'block';
    }
}

// Validate individual input field
function validateInput(input) {
    if (!input.id) return;
    
    let errorElement;
    let errorMessage = '';
    
    switch (input.id) {
        case 'full-name':
            errorElement = document.getElementById('name-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your full name';
            }
            break;
            
        case 'email':
            errorElement = document.getElementById('email-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your email address';
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    errorMessage = 'Please enter a valid email address';
                }
            }
            break;
            
        case 'phone':
            errorElement = document.getElementById('phone-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your phone number';
            }
            break;
            
        case 'address':
            errorElement = document.getElementById('address-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your street address';
            }
            break;
            
        case 'city':
            errorElement = document.getElementById('city-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your city';
            }
            break;
            
        case 'postal-code':
            errorElement = document.getElementById('postal-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your postal code';
            }
            break;
            
        case 'country':
            errorElement = document.getElementById('country-error');
            if (!input.value) {
                errorMessage = 'Please select your country';
            }
            break;
            
        case 'card-number':
            errorElement = document.getElementById('card-number-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter your card number';
            }
            break;
            
        case 'expiry-date':
            errorElement = document.getElementById('expiry-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter the expiry date';
            } else {
                const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!expiryPattern.test(input.value.trim())) {
                    errorMessage = 'Please use MM/YY format';
                }
            }
            break;
            
        case 'cvv':
            errorElement = document.getElementById('cvv-error');
            if (!input.value.trim()) {
                errorMessage = 'Please enter the CVV code';
            } else if (!/^\d{3,4}$/.test(input.value.trim())) {
                errorMessage = 'CVV must be 3 or 4 digits';
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        
        if (errorMessage) {
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            input.classList.remove('invalid');
            input.classList.add('valid');
        }
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code-input');
    
    if (!promoInput || !promoInput.value.trim()) {
        return;
    }
    
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Simulate promo code validation (in a real app, this would be server-side)
    if (promoCode === 'WELCOME10') {
        // Apply 10% discount
        applyDiscount(0.1);
        // Use a non-blocking notification instead of alert
        showPromoMessage('Promo code applied: 10% discount!', 'success');
    } else {
        showPromoMessage('Invalid promo code. Please try again.', 'error');
    }
}

// Show promo message
function showPromoMessage(message, type) {
    // Find or create message element
    let messageElement = document.getElementById('promo-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'promo-message';
        messageElement.style.marginTop = '0.5rem';
        messageElement.style.padding = '0.5rem';
        messageElement.style.borderRadius = '4px';
        messageElement.style.fontSize = '0.8rem';
        messageElement.style.textAlign = 'center';
        
        // Insert after promo button
        const promoGroup = document.querySelector('.promo-input-group');
        if (promoGroup && promoGroup.parentNode) {
            promoGroup.parentNode.appendChild(messageElement);
        }
    }
    
    // Set message and style based on type
    messageElement.textContent = message;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        messageElement.style.color = '#4caf50';
    } else {
        messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        messageElement.style.color = '#f44336';
    }
    
    // Show the message
    messageElement.style.display = 'block';
    
    // Automatically hide after a few seconds
    setTimeout(function() {
        messageElement.style.display = 'none';
    }, 3000);
}

// Apply discount to order total
function applyDiscount(discountPercentage) {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !totalElement) {
        return;
    }
    
    const subtotal = parseFloat(subtotalElement.textContent.replace(/[^0-9.]/g, ''));
    const discountAmount = subtotal * discountPercentage;
    
    // Update the total
    const currentTotal = parseFloat(totalElement.textContent.replace(/[^0-9.]/g, ''));
    const newTotal = currentTotal - discountAmount;
    
    totalElement.textContent = newTotal.toFixed(2) + ' CAD';
}

// Load cart items into checkout display
function loadCartItems() {
    if (!window.cartManager || !window.cartManager.items || window.cartManager.items.length === 0) {
        return;
    }
    
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) {
        return;
    }
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    // Add each cart item
    let subtotal = 0;
    
    window.cartManager.items.forEach(item => {
        // Create item element
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        // Create item content
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        itemElement.innerHTML = `
            <div class="checkout-item-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            </div>
            <div class="checkout-item-details">
                <div class="checkout-item-title">${item.name}</div>
                <div class="checkout-item-price">${item.price} CAD <span class="checkout-item-quantity">x${item.quantity}</span></div>
            </div>
        `;
        
        // Add to container
        checkoutItemsContainer.appendChild(itemElement);
    });
    
    // Update order summary
    updateOrderSummary(subtotal);
}

// Update order summary with calculated values
function updateOrderSummary(subtotal) {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !taxElement || !totalElement) {
        return;
    }
    
    // Calculate tax (10% for example)
    const taxRate = 0.1;
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + tax;
    
    // Update display
    subtotalElement.textContent = subtotal.toFixed(2) + ' CAD';
    taxElement.textContent = tax.toFixed(2) + ' CAD';
    totalElement.textContent = total.toFixed(2) + ' CAD';
}

// Collect order data for submission
function collectOrderData() {
    // Cart items
    if (!window.cartManager || !window.cartManager.items) {
        throw new Error('Cart is not available');
    }
    
    const cartItems = window.cartManager.items;
    if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
    }
    
    // Get subtotal, tax, total
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (!subtotalElement || !taxElement || !totalElement) {
        throw new Error('Price summary elements not found');
    }
    
    const subtotalText = subtotalElement.textContent;
    const taxText = taxElement.textContent;
    const totalText = totalElement.textContent;
    
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const shipping = 0; // Assume free shipping
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    
    // Get customer information from form
    const fullNameElement = document.getElementById('full-name');
    const emailElement = document.getElementById('email');
    const phoneElement = document.getElementById('phone');
    const addressElement = document.getElementById('address');
    const cityElement = document.getElementById('city');
    const postalCodeElement = document.getElementById('postal-code');
    const countryElement = document.getElementById('country');
    
    if (!fullNameElement || !emailElement || !phoneElement || !addressElement || 
        !cityElement || !postalCodeElement || !countryElement) {
        throw new Error('Customer information form elements not found');
    }
    
    // Customer info
    const customerInfo = {
        name: fullNameElement.value.trim(),
        email: emailElement.value.trim(),
        phone: phoneElement.value.trim(),
        address: addressElement.value.trim(),
        city: cityElement.value.trim(),
        postalCode: postalCodeElement.value.trim(),
        country: countryElement.value
    };
    
    // Payment method
    const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethodElement) {
        throw new Error('Payment method not selected');
    }
    const paymentMethod = paymentMethodElement.value;
    
    // Payment details (for credit card)
    let paymentDetails = {};
    if (paymentMethod === 'credit') {
        const cardNumberElement = document.getElementById('card-number');
        const expiryDateElement = document.getElementById('expiry-date');
        const cvvElement = document.getElementById('cvv');
        
        if (!cardNumberElement || !expiryDateElement || !cvvElement) {
            throw new Error('Credit card form elements not found');
        }
        
        // For security, only save the last 4 digits
        const cardNumber = cardNumberElement.value.replace(/\s/g, '');
        const lastFourDigits = cardNumber.slice(-4);
        
        paymentDetails = {
            cardType: detectCardType(cardNumber),
            lastFourDigits: lastFourDigits,
            expiry: expiryDateElement.value
        };
    }
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Order date
    const orderDate = new Date();
    
    return {
        orderNumber: orderNumber,
        orderDate: orderDate,
        items: cartItems,
        customerInfo: customerInfo,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
        summary: {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        }
    };
}

// Detect credit card type from number
function detectCardType(cardNumber) {
    // Identify card type from first digits
    if (/^4/.test(cardNumber)) {
        return 'Visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
        return 'MasterCard';
    } else if (/^3[47]/.test(cardNumber)) {
        return 'American Express';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
        return 'Discover';
    } else {
        return 'Unknown';
    }
}

// Generate an order number
function generateOrderNumber() {
    // Generate a random order number using timestamp and random number
    const timestamp = new Date().getTime().toString().slice(-10);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${timestamp}-${random}`;
}
