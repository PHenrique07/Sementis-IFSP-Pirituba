function getActiveSection() {
  const page = (window.location.pathname.split('/').pop() || '').toLowerCase();

  if (page === 'ligas.html') return 'Ligas';
  if (page === 'trilhas.html' || page === 'home.html' || page === '') return 'Trilhas';
  return 'Trilhas';
}

function buildSharedNavbar(activeSection) {
  const isTrilhas = activeSection === 'Trilhas';
  const isLigas = activeSection === 'Ligas';

  return `
<nav class="bottom-nav" aria-label="Navegacao principal">
  <div class="sidebar-logo">
    <img src="assets/brand/logo_sementis_branco.png" alt="Sementis">
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
    <a class="nav-item" href="home.html">
      <img src="assets/icons/menu_rodape_alvo.png" alt="Missoes">
      <span>Missões</span>
    </a>
    <a class="nav-item" href="home.html">
      <img src="assets/icons/menu_rodape_usuario.png" alt="Perfil">
      <span>Perfil</span>
    </a>
  </div>
</nav>
  `;
}

function mountSharedNavbar() {
  const host = document.getElementById('shared-navbar-root');
  if (!host) return;

  const activeSection = getActiveSection();
  host.innerHTML = buildSharedNavbar(activeSection);
}

document.addEventListener('DOMContentLoaded', mountSharedNavbar);
