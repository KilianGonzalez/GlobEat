class ProductCarousel {
    constructor() {
        this.currentIndex = 0;
        this.carousel = document.querySelector('.carousel-container');
        this.track = document.querySelector('.carousel-track');
        this.products = document.querySelectorAll('.carousel-track .product-card');
        this.prevBtn = document.querySelector('.carousel-btn--prev');
        this.nextBtn = document.querySelector('.carousel-btn--next');
        
        if (!this.carousel || !this.track || !this.products.length) return;
        
        this.productsPerView = this.getProductsPerView();
        this.totalProducts = this.products.length;
        this.maxIndex = Math.max(0, this.totalProducts - this.productsPerView);
        
        this.init();
    }
    
    getProductsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        if (width < 1400) return 3;
        return 4;
    }
    
    init() {
        this.setupEventListeners();
        this.updateCarousel();
        this.setupResponsive();
    }
    
    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Touch events for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            isDragging = false;
        }, { passive: true });
    }
    
    setupResponsive() {
        window.addEventListener('resize', () => {
            const newProductsPerView = this.getProductsPerView();
            if (newProductsPerView !== this.productsPerView) {
                this.productsPerView = newProductsPerView;
                this.maxIndex = Math.max(0, this.totalProducts - this.productsPerView);
                this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                this.updateCarousel();
            }
        });
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    updateCarousel() {
        const productWidth = this.products[0].offsetWidth;
        const gap = 24; // 1.5rem en pixels
        const offset = this.currentIndex * (productWidth + gap);
        
        // Forzar reflow para asegurar que la transición se aplique
        this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        void this.track.offsetHeight; // Trigger reflow
        
        this.track.style.transform = `translateX(-${offset}px)`;
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProductCarousel();
});
