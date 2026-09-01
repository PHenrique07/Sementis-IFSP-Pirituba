// ===================================================================
// SEMENTIS — GERENCIADOR GLOBAL DE TELA DE LOADING
// ===================================================================

const ECO_TIPS = [
    "Plantando ideias sustentáveis 🌱",
    "Preservando nossos recursos hídricos 💧",
    "Conectando energias renováveis ⚡",
    "Cuidando da nossa biodiversidade 🌻",
    "Separando os resíduos com carinho ♻️",
    "Construindo um futuro socioambiental 🌍"
];

let tipInterval = null;
let loadingHideTimeout = null;
let loadingStartedAt = 0;
const LOADING_DURATION = 5000;

function ensureLoadingDOM() {
    let overlay = document.getElementById('sementis-global-loading');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sementis-global-loading';
        overlay.className = 'sementis-loading-overlay';
        overlay.innerHTML = `
            <div class="sementis-loading-card">
                <div class="sementis-loading-gif-wrap">
                    <img src="/assets/gifs/loading.gif" alt="Carregando..." class="sementis-loading-gif">
                </div>
                <div class="sementis-loading-text">
                    <span id="sementis-loading-msg">Carregando</span>
                    <span class="loading-animated-dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
                <p class="sementis-loading-subtext" id="sementis-loading-subtext">Plantando ideias sustentáveis 🌱</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}

function showLoading(msg = "Carregando", subtext = null) {
    const overlay = ensureLoadingDOM();
    const msgEl = document.getElementById('sementis-loading-msg');
    const subEl = document.getElementById('sementis-loading-subtext');

    if (msgEl) msgEl.textContent = msg;

    let tipIndex = 0;
    if (subEl) {
        subEl.textContent = subtext || ECO_TIPS[0];
        clearInterval(tipInterval);
        if (!subtext) {
            tipInterval = setInterval(() => {
                tipIndex = (tipIndex + 1) % ECO_TIPS.length;
                if (subEl) subEl.textContent = ECO_TIPS[tipIndex];
            }, 2600);
        }
    }

    clearTimeout(loadingHideTimeout);
    loadingStartedAt = Date.now();
    overlay.classList.add('active');
    loadingHideTimeout = setTimeout(hideLoading, LOADING_DURATION);
}

function hideLoading() {
    clearInterval(tipInterval);
    const overlay = document.getElementById('sementis-global-loading');
    if (!overlay) return;

    const remainingTime = Math.max(0, LOADING_DURATION - (Date.now() - loadingStartedAt));
    clearTimeout(loadingHideTimeout);
    loadingHideTimeout = setTimeout(() => {
        overlay.classList.remove('active');
        loadingHideTimeout = null;
    }, remainingTime);
}

// Expõe globalmente no window
window.showLoading = showLoading;
window.hideLoading = hideLoading;

// Garante que os estilos do loading estejam carregados
(function injectLoadingCSS() {
    if (!document.querySelector('link[href*="loading.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/loading.css';
        document.head.appendChild(link);
    }
})();
