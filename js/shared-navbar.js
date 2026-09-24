function getActiveSection() {
  const page = (window.location.pathname.split('/').pop() || '').toLowerCase();

  if (page === 'ligas.html') return 'Ligas';
  if (page === 'missions.html' || page === 'missoes.html') return 'Missoes';
  if (page === 'loja.html') return 'Loja';
  if (page === 'jogos.html' || page === 'arena.html') return 'Jogos';
  if (page === 'perfil.html') return 'Perfil';
  if (page === 'trilhas.html' || page === 'home.html' || page === '') return 'Trilhas';
  return 'Trilhas';
}

function buildSharedNavbar(activeSection) {
  const isTrilhas = activeSection === 'Trilhas';
  const isLigas = activeSection === 'Ligas';
  const isMissoes = activeSection === 'Missoes';
  const isLoja = activeSection === 'Loja';
  const isJogos = activeSection === 'Jogos';
  const isPerfil = activeSection === 'Perfil';
  const isMais = isPerfil || isJogos;

  return `
<nav class="bottom-nav" aria-label="Navegação principal">
  <div class="sidebar-logo">
    <a href="index.html" aria-label="Ir para a página inicial" class="sidebar-logo-link">
      <img src="assets/brand/logo_sementis_branco.png" alt="Sementis">
    </a>
  </div>
  <div class="nav-items-wrapper">
    <a class="nav-item ${isTrilhas ? 'active' : ''}" href="home.html" ${isTrilhas ? 'aria-current="page"' : ''}>
      <img src="assets/icons/menu_rodape_tarefa.png" alt="Trilhas">
      <span>Trilhas</span>
    </a>
    <a class="nav-item ${isLigas ? 'active' : ''}" href="ligas.html" ${isLigas ? 'aria-current="page"' : ''}>
      <img src="assets/icons/menu_rodape_trofeu_liga.png" alt="Ligas">
      <span>Ligas</span>
    </a>
    <a class="nav-item ${isMissoes ? 'active' : ''}" href="missions.html" ${isMissoes ? 'aria-current="page"' : ''}>
      <img src="assets/icons/menu_rodape_alvo.png" alt="Missões">
      <span>Missões</span>
    </a>
    <a class="nav-item ${isLoja ? 'active' : ''}" href="loja.html" ${isLoja ? 'aria-current="page"' : ''}>
      <img src="assets/icons/loja1.png" alt="Loja">
      <span>Loja</span>
    </a>
    <a class="nav-item desktop-only ${isJogos ? 'active' : ''}" href="jogos.html" ${isJogos ? 'aria-current="page"' : ''}>
      <img src="assets/icons/menu_games.png" alt="Jogos">
      <span>Jogos</span>
    </a>
    <a class="nav-item desktop-only ${isPerfil ? 'active' : ''}" href="perfil.html" ${isPerfil ? 'aria-current="page"' : ''}>
      <img src="assets/icons/menu_rodape_usuario.png" alt="Perfil">
      <span>Perfil</span>
    </a>
    <button class="nav-item mobile-only ${isMais ? 'active' : ''}" id="nav-item-mais" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Mais opções">
      <img src="assets/icons/menu_mais.png" alt="Mais">
      <span>Mais</span>
    </button>
  </div>

  <div class="more-menu-popup mobile-only" id="more-menu-popup" aria-hidden="true">
    <div class="more-menu-content">
      <a class="more-menu-item ${isPerfil ? 'active' : ''}" href="perfil.html">
        <img src="assets/icons/menu_rodape_usuario.png" alt="Perfil">
        <span>Perfil</span>
      </a>
      <a class="more-menu-item ${isJogos ? 'active' : ''}" href="jogos.html">
        <img src="assets/icons/menu_games.png" alt="Jogos">
        <span>Jogos</span>
      </a>
    </div>
  </div>
</nav>
  `;
}

function mountSharedNavbar() {
  const host = document.getElementById('shared-navbar-root');
  if (!host || host.dataset.mounted === 'true') return;

  const activeSection = getActiveSection();
  host.innerHTML = buildSharedNavbar(activeSection);
  host.dataset.mounted = 'true';

  const sidebarLogoLink = host.querySelector('.sidebar-logo-link');
  if (sidebarLogoLink) {
    sidebarLogoLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'index.html';
    });
  }

  const btnMais = host.querySelector('#nav-item-mais');
  const popupMais = host.querySelector('#more-menu-popup');

  if (btnMais && popupMais) {
    function fecharMaisMenu() {
      popupMais.classList.remove('open');
      btnMais.setAttribute('aria-expanded', 'false');
      popupMais.setAttribute('aria-hidden', 'true');
    }

    function abrirMaisMenu() {
      popupMais.classList.add('open');
      btnMais.setAttribute('aria-expanded', 'true');
      popupMais.setAttribute('aria-hidden', 'false');
    }

    btnMais.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popupMais.classList.contains('open');
      if (isOpen) {
        fecharMaisMenu();
      } else {
        abrirMaisMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (!host.contains(e.target)) {
        fecharMaisMenu();
      }
    });

    window.addEventListener('scroll', () => {
      if (popupMais.classList.contains('open')) {
        fecharMaisMenu();
      }
    }, { passive: true });
  }

  // Pré-carregamento suave (instant prefetch) das páginas nos links da navbar
  const links = host.querySelectorAll('a[href$=".html"]');
  const prefetched = new Set();
  links.forEach(link => {
    const url = link.getAttribute('href');
    if (!url || url.startsWith('http') || url === '#' || prefetched.has(url)) return;

    const prefetch = () => {
      if (prefetched.has(url)) return;
      prefetched.add(url);
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = url;
      prefetchLink.as = 'document';
      document.head.appendChild(prefetchLink);
    };

    link.addEventListener('mouseenter', prefetch, { passive: true });
    link.addEventListener('touchstart', prefetch, { passive: true });
  });
}

// Monta imediatamente se o container já existir no DOM, ou aguarda se estiver no head
if (document.getElementById('shared-navbar-root')) {
  mountSharedNavbar();
} else if (document.readyState !== 'loading') {
  mountSharedNavbar();
} else {
  document.addEventListener('DOMContentLoaded', mountSharedNavbar);
}


