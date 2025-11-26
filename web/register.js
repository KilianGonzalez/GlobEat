document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const emailInput = document.getElementById('register-email');
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const passwordConfirmInput = document.getElementById('register-password-confirm');
    const termsInput = document.getElementById('register-terms');
    const messageEl = document.getElementById('register-message');
    const googleBtn = document.getElementById('register-google-btn');

    function showMessage(text, type) {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.classList.remove('login-message--error', 'login-message--success');
        if (type) {
            messageEl.classList.add(type === 'error' ? 'login-message--error' : 'login-message--success');
        }
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            // Simulación: registro con Google correcto → redirige a Inicio
            window.location.href = 'index.html';
        });
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const passwordConfirm = passwordConfirmInput.value.trim();

            if (!email || !username || !password || !passwordConfirm) {
                showMessage('Por favor, completa todos los campos.', 'error');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showMessage('El correo electrónico no es válido.', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }

            if (password !== passwordConfirm) {
                showMessage('Las contraseñas no coinciden.', 'error');
                return;
            }

            if (!termsInput.checked) {
                showMessage('Debes aceptar los Términos y Condiciones.', 'error');
                return;
            }

            showMessage('Registro completado correctamente.', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 600);
        });
    }
});
