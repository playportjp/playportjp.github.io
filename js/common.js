/**
 * common.js - Common JavaScript functionality for the site
 */

// Cart state management
class CartManager {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    // Load cart information from local storage
    loadCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to local storage
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add product to cart
    addItem(product) {
        // Check if the same product is already in the cart
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity of existing product
            existingItem.quantity += 1;
        } else {
            // Add new product to cart
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        
        // Fire custom event (so other JS files can listen)
        const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
        document.dispatchEvent(event);
    }

    // Remove product from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        
        this.saveCart();
        this.updateCartCount();
        
        // Fire custom event
        const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
        document.dispatchEvent(event);
    }
    
    // Update product quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                // Remove product if quantity is 0 or less
                this.removeItem(productId);
            } else {
                // Update quantity
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                
                // Fire custom event
                const event = new CustomEvent('cart:updated', { detail: { cart: this.items } });
                document.dispatchEvent(event);
            }
        }
    }
    
    // Calculate total cart amount
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Update cart item count
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Set up search form event listener
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
    }
    
    handleSearch(event) {
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value.trim() === '') {
            event.preventDefault();
            // Prevent empty searches
            alert('Please enter a search keyword');
        }
    }
}

// Newsletter subscription
class NewsletterManager {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleSubscribe.bind(this));
        }
    }
    
    handleSubscribe(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && this.validateEmail(emailInput.value)) {
            // Actual API call would be implemented here (currently mocked)
            this.subscribeToNewsletter(emailInput.value)
                .then(() => {
                    alert('Successfully subscribed to the newsletter!');
                    emailInput.value = '';
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    alert('An error occurred during registration. Please try again later.');
                });
        } else {
            alert('Please enter a valid email address');
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Mock function for newsletter subscription (would use API in production)
    subscribeToNewsletter(email) {
        return new Promise((resolve) => {
            // Simulate API call
            setTimeout(() => {
                console.log(`Registered email ${email} to newsletter`);
                resolve();
            }, 500);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Instantiate and enable functionality
    window.cartManager = new CartManager();
    window.searchManager = new SearchManager();
    window.newsletterManager = new NewsletterManager();
    
    // Set up "Add to Cart" button event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            // Get product information (from data attributes or parent element)
            const productCard = this.closest('.product-card');
            if (productCard) {
                const product = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('.product-details h3').textContent,
                    price: parseFloat(productCard.dataset.productPrice || '0'),
                    image: productCard.dataset.productImage || ''
                };
                
                // Add to cart
                window.cartManager.addItem(product);
                
                // Visual feedback
                this.textContent = 'Added!';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 1500);
            }
        });
    });
});
