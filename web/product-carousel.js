class ProductCarousel {
  constructor() {
    this.currentIndex = 0;
    this.carousel = document.querySelector('.carousel-container');
    this.viewport = document.querySelector('.carousel-track'); // ventana
    this.track = document.querySelector('.carousel-track .product-grid'); // cinta que se mueve
    this.products = document.querySelectorAll('.carousel-track .product-card');
    this.prevBtn = document.querySelector('.carousel-btn--prev');
    this.nextBtn = document.querySelector('.carousel-btn--next');

    if (!this.carousel || !this.viewport || !this.track || !this.products.length) return;

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
    if (this.maxIndex === 0) return; // no hay desplazamiento posible

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex; // bucle al final
    }

    this.updateCarousel();
  }

  next() {
    if (this.maxIndex === 0) return; // no hay desplazamiento posible

    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // bucle al inicio
    }

    this.updateCarousel();
  }

  updateCarousel() {
    const productWidth = this.products[0].offsetWidth;
    const gap = 24; // coincide con 1.5rem aprox.
    const offset = this.currentIndex * (productWidth + gap);

    this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.track.style.transform = `translateX(-${offset}px)`;

    // En modo bucle, botones siempre habilitados
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => new ProductCarousel());
