// ===== Login Page JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initPasswordToggle();
    initPasswordStrength();
    //initFormValidation(); Pedro: ta comentado pois ja temos a api funcionando, e a validação é feita no backend, mas pode ser descomentado para testes locais
    checkHashForRegister();
});

// ===== Auth Tabs =====
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update forms
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
}

// ===== Check URL Hash for Register =====
function checkHashForRegister() {
    if (window.location.hash === '#register') {
        const registerTab = document.querySelector('[data-tab="register"]');
        if (registerTab) {
            registerTab.click();
        }
    }
}

// ===== Password Toggle =====
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const eyeOpen = button.querySelector('.eye-open');
            const eyeClosed = button.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });
}

// ===== Password Strength =====
function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);

            // Remove all classes
            strengthBar.classList.remove('weak', 'medium', 'strong');

            if (password.length === 0) {
                strengthText.textContent = '';
                return;
            }

            if (strength < 3) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Fraca';
                strengthText.style.color = '#ef4444';
            } else if (strength < 5) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Média';
                strengthText.style.color = '#f59e0b';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Forte';
                strengthText.style.color = '#10b981';
            }
        });
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
}

// ===== Form Validation =====
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!validateEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    // Simulate login (replace with actual API call)
    showNotification('Login realizado com sucesso! Redirecionando...', 'success');

    // Simulate redirect
    setTimeout(() => {
        window.location.href = 'home.html';
        console.log('Login data:', { email, password });
    }, 1500);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__message">${message}</span>
        <button class="notification__close">&times;</button>
    `;

    // Add styles
    const styles = `
        .notification {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .notification--success {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        .notification--error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        .notification--info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
        }
        .notification__close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .notification__close:hover {
            opacity: 1;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    // Add styles if not exists
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Close button functionality
    notification.querySelector('.notification__close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}
