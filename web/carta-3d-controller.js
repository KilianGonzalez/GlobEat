// Script para controlar los modelos 3D en la página carta
document.addEventListener('DOMContentLoaded', () => {
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
            if (autoRotateTimeout) {
                clearTimeout(autoRotateTimeout);
            }
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
            
            if (autoRotateTimeout) {
                clearTimeout(autoRotateTimeout);
            }
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
});
