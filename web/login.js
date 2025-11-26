document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const messageEl = document.getElementById('login-message');
    const googleBtn = document.getElementById('login-google-btn');

    function showMessage(text, type) {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.classList.remove('login-message--error', 'login-message--success');
        if (type) {
            messageEl.classList.add(
                type === 'error' ? 'login-message--error' : 'login-message--success'
            );
        }
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            // Login con Google simulado → redirige a Inicio
            window.location.href = 'index.html';
        });
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Campos vacíos (uno o los dos)
            if (!email || !password) {
                showMessage('Por favor, completa usuario/correo y contraseña.', 'error');
                return;
            }

            // Formato básico de correo
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showMessage('El correo electrónico no es válido.', 'error');
                return;
            }

            // Simulación de login correcto
            showMessage('Inicio de sesión correcto.', 'success');

            // Redirigir a la página de inicio tras un pequeño retraso opcional
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
});