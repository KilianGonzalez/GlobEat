// Script para controlar los modelos 3D en la página carta
document.addEventListener('DOMContentLoaded', () => {
    /* =========================
       CONTROL 3D (tu código)
    ========================== */
    const modelViewers = document.querySelectorAll('model-viewer');

    modelViewers.forEach(modelViewer => {
        // Configurar el modelo viewer
        modelViewer.interactionPrompt = 'none';
        modelViewer.autoRotate = true;
        modelViewer.cameraControls = true;
        modelViewer.disableZoom = false;

        // Variables para controlar la posición inicial
        let isInteracting = false;
        let autoRotateTimeout;
        let initialCameraOrbit;
        let initialFieldOfView;

        // Guardar la posición inicial cuando el modelo se carga
        modelViewer.addEventListener('load', () => {
            setTimeout(() => {
                initialCameraOrbit = {
                    theta: modelViewer.cameraOrbit.theta,
                    phi: modelViewer.cameraOrbit.phi,
                    radius: modelViewer.cameraOrbit.radius
                };
                initialFieldOfView = modelViewer.fieldOfView;
            }, 100);
        });

        // Función para restaurar la posición inicial y auto-rotación
        const restoreInitialState = () => {
            if (!isInteracting && initialCameraOrbit) {
                // Restaurar la posición exacta de la cámara
                modelViewer.cameraOrbit = initialCameraOrbit;
                modelViewer.fieldOfView = initialFieldOfView;

                // Restaurar auto-rotación
                modelViewer.autoRotate = true;
            }
        };

        // Eventos de interacción del usuario
        modelViewer.addEventListener('pointerdown', () => {
            isInteracting = true;
            modelViewer.autoRotate = false;

            // Limpiar timeout existente
            if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
        });

        modelViewer.addEventListener('pointerup', () => {
            isInteracting = false;

            // Restaurar posición inicial y auto-rotación después de 3 segundos
            autoRotateTimeout = setTimeout(() => {
                restoreInitialState();
            }, 3000);
        });

        modelViewer.addEventListener('pointerleave', () => {
            isInteracting = false;

            // Restaurar posición inicial y auto-rotación después de 2 segundos si el mouse sale
            autoRotateTimeout = setTimeout(() => {
                restoreInitialState();
            }, 2000);
        });

        // Eventos táctiles para móviles
        modelViewer.addEventListener('touchstart', () => {
            isInteracting = true;
            modelViewer.autoRotate = false;

            if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
        });

        modelViewer.addEventListener('touchend', () => {
            isInteracting = false;

            autoRotateTimeout = setTimeout(() => {
                restoreInitialState();
            }, 3000);
        });

        // Eventos de cámara para detectar cuando el usuario mueve la cámara
        modelViewer.addEventListener('camera-change', () => {
            if (isInteracting) {
                // El usuario está moviendo la cámara, detener auto-rotación
                modelViewer.autoRotate = false;
            }
        });

        // Restaurar estado inicial cuando el usuario deja de interactuar
        modelViewer.addEventListener('interaction-prompt-dismissed', () => {
            isInteracting = false;
            setTimeout(() => {
                restoreInitialState();
            }, 2000);
        });
    });

    /* =========================
       CARRUSEL (bucle + mover product-grid)
    ========================== */
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

            // Touch events para móvil (swipe)
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            this.viewport.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            this.viewport.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            }, { passive: true });

            this.viewport.addEventListener('touchend', () => {
                if (!isDragging) return;

                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.next();
                    else this.prev();
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
            if (this.maxIndex === 0) return;

            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.maxIndex; // bucle al final
            }

            this.updateCarousel();
        }

        next() {
            if (this.maxIndex === 0) return;

            if (this.currentIndex < this.maxIndex) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0; // bucle al inicio
            }

            this.updateCarousel();
        }

        updateCarousel() {
            const productWidth = this.products[0].offsetWidth;
            const gap = 24; // 1.5rem aprox
            const offset = this.currentIndex * (productWidth + gap);

            this.track.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.track.style.transform = `translateX(-${offset}px)`;

            // En bucle, botones siempre activos
            if (this.prevBtn) this.prevBtn.disabled = false;
            if (this.nextBtn) this.nextBtn.disabled = false;
        }
    }

    new ProductCarousel();
});
