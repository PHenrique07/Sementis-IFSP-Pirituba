// Movimento compartilhado: mídia decorativa e foco dos diálogos existentes.
document.addEventListener('DOMContentLoaded', () => {
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const videos = Array.from(document.querySelectorAll('video[data-video-decorativo]'));
    const videosVisiveis = new Set();

    function atualizarVideo(video) {
        const visivel = videosVisiveis.has(video) && (
            typeof video.checkVisibility === 'function'
                ? video.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })
                : video.getClientRects().length > 0 && getComputedStyle(video).visibility !== 'hidden' &&
                    !video.closest('[hidden], [aria-hidden="true"]')
        );
        if (document.hidden || movimentoReduzido.matches || !visivel) {
            video.pause();
        } else if (video.paused) {
            video.play().catch(() => {});
        }
    }

    function atualizarVideos() {
        videos.forEach(atualizarVideo);
    }

    const observadorVideos = new IntersectionObserver((entradas) => {
        entradas.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) videosVisiveis.add(target);
            else videosVisiveis.delete(target);
            atualizarVideo(target);
        });
    });
    const observadorVisibilidade = new MutationObserver(atualizarVideos);
    const ancestrais = new Set();
    videos.forEach(video => {
        video.pause();
        observadorVideos.observe(video);
        video.addEventListener('play', () => atualizarVideo(video));
        for (let elemento = video; elemento && elemento !== document.body; elemento = elemento.parentElement) {
            ancestrais.add(elemento);
        }
    });
    ancestrais.forEach(elemento => observadorVisibilidade.observe(elemento, {
        attributes: true, attributeFilter: ['class', 'style', 'hidden']
    }));
    document.addEventListener('visibilitychange', atualizarVideos);
    document.addEventListener('transitionend', (evento) => {
        if (ancestrais.has(evento.target)) atualizarVideos();
    });
    movimentoReduzido.addEventListener('change', atualizarVideos);

    const seletorModal = '.modal-overlay, .xp-modal-overlay, .pass-modal-overlay, .drone-modal-overlay, .aviso-modal, .raiox-modal';
    const modais = Array.from(document.querySelectorAll(seletorModal));
    const abertos = [];
    const focoAnterior = new WeakMap();
    let ultimoFocoExterno = document.activeElement;
    const seletorFoco = 'button:not(:disabled), a[href], input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

    document.addEventListener('focusin', (evento) => {
        if (!evento.target.closest(seletorModal)) ultimoFocoExterno = evento.target;
    });

    function sincronizarModal(modal) {
        const estilo = getComputedStyle(modal);
        const aberto = estilo.display !== 'none' && !modal.hidden &&
            (modal.matches('.open, .active') || modal.style.display === 'flex' || modal.style.display === 'grid');
        const indice = abertos.indexOf(modal);
        if (aberto && indice === -1) {
            focoAnterior.set(modal, ultimoFocoExterno);
            modal.inert = false;
            modal.setAttribute('aria-hidden', 'false');
            abertos.push(modal);
            if (!modal.contains(document.activeElement)) {
                (modal.querySelector('input:not([type="hidden"]):not(:disabled), textarea:not(:disabled)') || modal.querySelector(seletorFoco) || modal).focus({ preventScroll: true });
            }
        } else if (!aberto && indice !== -1) {
            abertos.splice(indice, 1);
            const anterior = focoAnterior.get(modal);
            if (modal.contains(document.activeElement) && anterior?.isConnected) anterior.focus({ preventScroll: true });
            modal.inert = true;
            modal.setAttribute('aria-hidden', 'true');
        } else if (!aberto) {
            modal.inert = true;
            modal.setAttribute('aria-hidden', 'true');
        }
        atualizarVideos();
    }

    modais.forEach((modal, indice) => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.tabIndex = -1;
        if (!modal.hasAttribute('aria-labelledby') && !modal.hasAttribute('aria-label')) {
            const titulo = modal.querySelector('h2, h3');
            if (titulo) {
                if (!titulo.id) titulo.id = `titulo-dialogo-${indice}`;
                modal.setAttribute('aria-labelledby', titulo.id);
            }
        }
        sincronizarModal(modal);
        new MutationObserver(() => sincronizarModal(modal)).observe(modal, {
            attributes: true, attributeFilter: ['class', 'style']
        });
    });

    document.addEventListener('keydown', (evento) => {
        const modal = abertos[abertos.length - 1];
        if (!modal) return;
        if (evento.key === 'Escape') {
            const fechar = modal.querySelector('.modal-close, .close-modal-btn, .modal-close-btn, .drone-modal-close-btn, #btn-fechar-modal-sementis, #btn-fechar-modal-entrar, #pass-modal-close-btn');
            if (fechar) {
                evento.preventDefault();
                evento.stopImmediatePropagation();
                fechar.click();
            }
        } else if (evento.key === 'Tab') {
            const controles = Array.from(modal.querySelectorAll(seletorFoco)).filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
            const primeiro = controles[0] || modal;
            const ultimo = controles[controles.length - 1] || modal;
            if (!modal.contains(document.activeElement) || document.activeElement === modal ||
                (evento.shiftKey && document.activeElement === primeiro) || (!evento.shiftKey && document.activeElement === ultimo)) {
                evento.preventDefault();
                (evento.shiftKey ? ultimo : primeiro).focus();
            }
        }
    }, true);
});
