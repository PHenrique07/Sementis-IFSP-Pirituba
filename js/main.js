// ===== Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();

    // Chama a função para buscar os dados de perfil e injetar na página
    atualizarBarraDeXP();
});

// ===== Navigation =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// ===== Scroll Effects =====
function initScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .game-card, .about__card, .stat'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animated class styles
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// ===== Controle de Autenticação (Login/Logout) =====
document.addEventListener('DOMContentLoaded', () => {
    // 1. Olha a gaveta do navegador
    const usuarioSalvo = localStorage.getItem("user");

    // 2. Se achar alguém salvo lá...
    if (usuarioSalvo) {
        const user = JSON.parse(usuarioSalvo);

        // 3. Procura a div dos botões (Lembra do id="auth-actions" no HTML!)
        const authContainer = document.getElementById("auth-actions");

        if (authContainer) {
            const destinoPrincipal = user.tipo === 'professor' ? 'painel-professor.html' : 'home.html';
            const rotuloPrincipal = user.tipo === 'professor' ? 'Ir para Painel' : 'Ir para Home';
            // 4. Troca os botões pelo nome do usuário
            // encapsula a opcao de ir para home, e sair dentro do icon de perfil mencionado
            authContainer.innerHTML = `
                <div class="user-profile-menu">
                    <span class="user-greeting">Olá, ${user.nome}!</span>
                    <div class="profile-dropdown-container">
                        <img src="assets/icons/menu_rodape_usuario.png" alt="Perfil" class="profile-icon-btn" onclick="toggleProfileDropdown(event)" title="Opções de Perfil">
                        <div class="profile-dropdown" id="profileDropdown">
                            <a href="${destinoPrincipal}" class="dropdown-item" style="display:flex; align-items:center; gap:8px;">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                ${rotuloPrincipal}
                            </a>
                            <button onclick="fazerLogout()" class="dropdown-item" style="display:flex; align-items:center; gap:8px;">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
});

// ===== Funções do Perfil e Logout =====
window.toggleProfileDropdown = function (event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
};

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('active')) {
        const menu = document.querySelector('.user-profile-menu');
        if (!menu || !menu.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    }
});

function fazerLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cached_perfil");
    window.location.reload();
}

// ========================================================
// --- NOVA FUNÇÃO: ATUALIZAR HEADER SUPERIOR ---
// ========================================================
function atualizarHeaderSuperior(ofensiva, moedas, vidas) {
    const headerOfensiva = document.getElementById('header-ofensiva');
    const headerMoedas = document.getElementById('header-moedas');
    const headerVidas = document.getElementById('header-vidas');

    if (headerOfensiva && ofensiva !== undefined) headerOfensiva.textContent = ofensiva;
    if (headerMoedas && moedas !== undefined) headerMoedas.textContent = moedas;
    if (headerVidas && vidas !== undefined) headerVidas.textContent = vidas;
}

// Função centralizada para injetar os dados no DOM sem nenhum delay artificial
function aplicarDadosPerfil(dados) {
    if (!dados) return;

    const nomeUsuario = dados.nome || 'Estudante';
    const xpAtual = dados.progresso_nivel?.xp_no_nivel ?? 0;
    const xpProximo = dados.progresso_nivel?.xp_proximo_nivel ?? 100;
    const nivelAtual = dados.progresso_nivel?.nivel_atual ?? 1;
    const xpTotal = dados.xp_total ?? 0;

    const ofensiva = dados.ofensiva ?? 0;
    const moedas = dados.moedas ?? 0;
    const vidas = dados.vidas ?? 5;

    const ligaId = dados.liga_id || 1;
    let nomeLiga = "BRONZE";
    let iconeLiga = "assets/ligas/liga_medalha_bronze.png";

    if (ligaId === 2) {
        nomeLiga = "PRATA";
        iconeLiga = "assets/ligas/liga_trofeu_prata.png";
    } else if (ligaId === 3) {
        nomeLiga = "OURO";
        iconeLiga = "assets/ligas/liga_trofeu_ouro.png";
    } else if (ligaId === 4) {
        nomeLiga = "DIAMANTE";
        iconeLiga = "assets/ligas/liga_trofeu_diamante.png";
    }

    const porcentagem = xpProximo > 0 ? (xpAtual / xpProximo) * 100 : 0;
    const porcentagemFaltante = Math.max(0, (100 - porcentagem).toFixed(0));

    // 1. Atualizar Header Superior
    atualizarHeaderSuperior(ofensiva, moedas, vidas);

    // 2. Disparar evento para outros componentes (ex: Loja)
    window.dispatchEvent(new CustomEvent('perfil:atualizado', {
        detail: { ofensiva, moedas, vidas }
    }));

    // 3. Seletores da Tela Home
    const homeBarra = document.getElementById('ui-progress-fill');
    const homeTextoBarra = document.getElementById('ui-progress-text');
    const homeNivel = document.getElementById('ui-user-level');
    const homeNome = document.getElementById('ui-user-name');

    if (homeBarra) homeBarra.style.setProperty('width', `${porcentagem}%`, 'important');
    if (homeTextoBarra) homeTextoBarra.textContent = `Faltam ${porcentagemFaltante}% para o próximo nível`;
    if (homeNivel) homeNivel.textContent = `Nível ${nivelAtual}`;
    if (homeNome) homeNome.textContent = nomeUsuario;

    // 4. Seletores da Tela de Perfil
    const perfilNome = document.getElementById('perfil-user-name');
    const perfilNivel = document.getElementById('perfil-user-level');
    const perfilBarra = document.getElementById('perfil-progress-fill');
    const perfilTextoBarra = document.getElementById('perfil-progress-text');
    const perfilSequencia = document.getElementById('perfil-user-streak');
    const perfilXpTotal = document.getElementById('perfil-user-xp-total');
    const perfilLigaTexto = document.getElementById('perfil-user-liga-text');
    const perfilLigaIcone = document.getElementById('perfil-user-liga-icon');

    if (perfilBarra) perfilBarra.style.setProperty('width', `${porcentagem}%`, 'important');
    if (perfilTextoBarra) perfilTextoBarra.textContent = `${xpAtual}/${xpProximo}`;
    if (perfilNivel) perfilNivel.textContent = `LEVEL ${nivelAtual}`;
    if (perfilNome) perfilNome.textContent = nomeUsuario;
    if (perfilSequencia) perfilSequencia.textContent = ofensiva;
    if (perfilXpTotal) perfilXpTotal.textContent = xpTotal;
    if (perfilLigaTexto) perfilLigaTexto.textContent = nomeLiga;
    if (perfilLigaIcone) perfilLigaIcone.src = iconeLiga;
}

// Carrega imediatamente do localStorage para renderização instantânea (0ms)
function carregarStatsCacheados() {
    try {
        const cachedRaw = localStorage.getItem('cached_perfil') || localStorage.getItem('user');
        if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            aplicarDadosPerfil(cached);
        }
    } catch (e) {
        console.warn("Erro ao ler cache do perfil:", e);
    }
}

// Execução imediata no carregamento do script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarStatsCacheados);
} else {
    carregarStatsCacheados();
}

const atualizarBarraDeXP = async () => {
    const rota = `${API_BASE_URL}/api/perfil`;
    const token = localStorage.getItem('token');

    if (!token) {
        return;
    }

    try {
        const response = await fetch(rota, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('cached_perfil');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Erro na API ao buscar perfil');
        }

        const dados = await response.json();
        
        // Salva no cache local para que a próxima visita/recarregamento seja a 0ms
        localStorage.setItem('cached_perfil', JSON.stringify(dados));

        // Aplica imediatamente sem nenhum setTimeout artificial
        aplicarDadosPerfil(dados);

    } catch (erro) {
        console.error('Erro ao atualizar perfil com API:', erro);
    }
};

// ===== Integração com API (Finalizar Trilha) =====
document.addEventListener('DOMContentLoaded', () => {
    async function finalizarTrilha() {
        const trilhaId = localStorage.getItem('ultima_fase_id');
        const errosCount = localStorage.getItem('erros_cometidos') || 0;

        // CORREÇÃO 2b: Limpa o histórico de erros para a próxima lição
        localStorage.setItem('erros_cometidos', 0);

        const progressoData = {
            atividade_id: trilhaId,
            erros: parseInt(errosCount),
            concluida_com_sucesso: true
        };

        try {
            const response = await fetch(`${API_BASE_URL}/completar_atividade`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(progressoData)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error("Erro no servidor");
            }

            // === A MÁGICA ENTRA AQUI ===
            // 1. Transforma a resposta do back-end em JSON
            const resultado = await response.json();

            // 2. Pega os dados exatos que o banco do Pedro calculou
            const novaOfensiva = resultado.ofensiva_atual;
            const moedasAtuais = resultado.moedas_atuais;
            const vidasAtuais = resultado.vidas_atuais;

            // 3. Atualiza o número do foguinho no perfil (se a pessoa estiver na tela de perfil)
            const contadorOfensiva = document.getElementById('perfil-user-streak');
            if (contadorOfensiva) {
                contadorOfensiva.textContent = novaOfensiva;
            }

            // 4. Atualiza o Header Superior na hora, sem precisar recarregar a página!
            atualizarHeaderSuperior(novaOfensiva, moedasAtuais, vidasAtuais);

            alert(`Progresso salvo online com sucesso! 🔥 Sua ofensiva agora é de ${novaOfensiva} dia(s).`);

        } catch (error) {
            console.warn("Sem conexão. Salvando progresso localmente...");
            let pendentes = JSON.parse(localStorage.getItem('sincronizacao_pendente')) || [];
            pendentes.push(progressoData);
            localStorage.setItem('sincronizacao_pendente', JSON.stringify(pendentes));
            alert("Você está offline, mas seu progresso foi salvo no dispositivo!");
        }

        window.location.href = 'mapa.html';
    }
    window.finalizarTrilha = finalizarTrilha;
});


