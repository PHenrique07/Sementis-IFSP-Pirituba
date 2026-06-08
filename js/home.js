// ===== Home Page JavaScript =====

// View management state
let currentView = 'modules'; // 'home', 'modules'
let currentModule = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado. Iniciando scripts da Home...');
    
    // 1. CARREGA OS DADOS DO USUÁRIO PRIMEIRO DE TUDO!
    carregarDadosUsuario();

    // 2. Inicia as interações dos botões e menus
    initBottomNav();
    initTrailInteractions();
    initGameCards();
    initAchievements();
    animateProgressBars();
    initModulesView();
    initStatItems();   
    initDailyGoal();   
    
    // 3. Roda a animação de entrada
    playWelcomeAnimation(); 

    // ==========================================
    // A CORREÇÃO ENTRA AQUI: 
    // Se a página for o mapa de trilhas, puxa os botões do banco!
    if (window.location.pathname.includes('trilhas.html') || window.location.search.includes('module=')) {
        carregarTrilha(1); // O 1 é o ID do Módulo Água e Vida
    }
    // ==========================================

    window.showHomeView = showHomeView;
    window.showModulesView = showModulesView;

    console.log('Home page carregada com sucesso!');
});

// ===== Atualiza Dados do Usuário no Dashboard =====
function carregarDadosUsuario() {
    // 1. Puxa a gaveta
    const usuarioSalvo = localStorage.getItem('user');

    if (usuarioSalvo) {
        const dadosUsuario = JSON.parse(usuarioSalvo);

        // 2. Extrai as informações que vieram do Python
        const nome = dadosUsuario.nome;
        const moedas = dadosUsuario.moedas;
        const sequencia = dadosUsuario.ofensiva; 
        const vida = dadosUsuario.vidas;         

        // 3. Seleciona os lugares na tela (Ajustado para o HTML real do Tom)
        const campoNome = document.querySelector('.user-name');
        
        // No HTML, ofensiva, moedas e vidas usam a mesma classe (.stat-value)
        // Então usamos querySelectorAll para pegar todos eles em forma de lista [0, 1, 2]
        const estatisticas = document.querySelectorAll('.stat-value');

        // 4. Altera os valores se os campos existirem na página
        if (campoNome && nome) campoNome.textContent = nome;
        
        // Verifica se a lista de estatísticas achou os 3 itens lá no topo
        if (estatisticas.length >= 3) {
            // estatisticas[0] é o primeiro ícone (Fogo/Sequência)
            if (sequencia !== undefined) estatisticas[0].textContent = sequencia;
            
            // estatisticas[1] é o segundo ícone (Moedas)
            if (moedas !== undefined) estatisticas[1].textContent = moedas;
            
            // estatisticas[2] é o terceiro ícone (Coração/Vidas)
            if (vida !== undefined) estatisticas[2].textContent = vida;
        }

        console.log("Dashboard Sementis sincronizado com sucesso!");
    } else {
        console.warn("Nenhum usuário encontrado no Local Storage.");
    }
}

// ===== Bottom Navigation =====
function initBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const span = item.querySelector('span');
            const section = span ? span.textContent : '';
            handleNavigation(section);
        });
    });
}

function handleNavigation(section) {
    console.log('Navigating to:', section);
    switch(section) {
        case 'Trilhas':
            showModulesView();
            break;
        case 'Ligas':
            window.location.href = 'ligas.html';
            break;
        case 'Missões':
            console.log('Navigate to missions page');
            break;
        case 'Perfil':
            console.log('Navigate to profile page');
            break;
    }
}

// ===== Trail Interactions =====
function initTrailInteractions() {
    const trailCards = document.querySelectorAll('.trail-card, .trail-step, .trilha-step');

    trailCards.forEach(card => {
        const titleElement = card.querySelector('.trail-title, .trail-step-title, .trilha-step-title');
        const trailTitle = titleElement ? titleElement.textContent : 'Trilha';
        const moduleName = card.getAttribute('data-module');
        const trilhaId = card.getAttribute('data-trilha');

        card.addEventListener('click', () => {
            if (card.classList.contains('locked')) {
                showNotification('Complete as trilhas anteriores para desbloquear!', 'info');
                return;
            }

            if (moduleName) {
                const target = `trilhas.html?module=${encodeURIComponent(trailTitle)}`;
                window.location.href = target;
                return;
            }

            if (trilhaId) {
                showTrailDetailView(trilhaId, trailTitle);
                return;
            }

            showNotification(`Explorando ${trailTitle}...`, 'info');
        });
    });
}

function handleContinueTrail(trailTitle) {
    console.log('Continue trail:', trailTitle);
    showNotification(`Continuando ${trailTitle}...`, 'info');
    setTimeout(() => {
        console.log('Load lesson for trail:', trailTitle);
    }, 500);
}

function handleStartTrail(trailTitle) {
    console.log('Start trail:', trailTitle);
    showNotification(`Iniciando ${trailTitle}...`, 'success');
    setTimeout(() => {
        console.log('Load first lesson for trail:', trailTitle);
    }, 500);
}

function showTrailDetails(trailTitle) {
    console.log('Show details for:', trailTitle);
}

// ===== Game Cards =====
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-quick-card');

    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameTitle = card.querySelector('h3').textContent;
            handlePlayGame(gameTitle);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function handlePlayGame(gameTitle) {
    console.log('Play game:', gameTitle);
    showNotification(`Carregando ${gameTitle}...`, 'info');
    setTimeout(() => {
        console.log('Load game:', gameTitle);
    }, 500);
}

// ===== Achievements =====
function initAchievements() {
    const achievementCards = document.querySelectorAll('.achievement-card:not(.locked-achievement)');

    achievementCards.forEach(card => {
        card.addEventListener('click', () => {
            const achievementName = card.querySelector('p').textContent;
            showAchievementDetails(achievementName);
        });
    });

    const lockedAchievements = document.querySelectorAll('.achievement-card.locked-achievement');
    lockedAchievements.forEach(card => {
        card.addEventListener('click', () => {
            showNotification('Complete mais lições para desbloquear esta conquista!', 'info');
        });
    });
}

function showAchievementDetails(achievementName) {
    console.log('Show achievement:', achievementName);
    showNotification(`Conquista: ${achievementName}`, 'success');
}

// ===== Progress Bar Animations =====
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .goal-progress-fill, .progress-fill-small, .trail-mini-progress-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';

                setTimeout(() => {
                    bar.style.width = width;
                }, 100);

                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => observer.observe(bar));
}

// ===== Daily Goal Interaction =====
function initDailyGoal() {
    const goalCard = document.querySelector('.goal-card');

    if (goalCard) {
        goalCard.addEventListener('click', () => {
            showDailyGoalDetails();
        });
    }
}

function showDailyGoalDetails() {
    console.log('Show daily goal details');
    showNotification('Complete 2 lições para alcançar sua meta diária!', 'info');
}

// ===== Profile Button =====
const profileBtn = document.querySelector('.profile-btn');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        console.log('Open profile');
    });
}

// ===== Stat Items Interaction =====
function initStatItems() {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach(item => {
        item.addEventListener('click', () => {
            const statValue = item.querySelector('.stat-value').textContent;
            const statImg = item.querySelector('.stat-icon').alt;

            showStatDetails(statImg, statValue);
        });
    });
}

function showStatDetails(statName, value) {
    console.log('Stat:', statName, value);

    let message = '';
    switch(statName) {
        case 'Sequência':
            message = `Você está há ${value} dias seguidos estudando! Continue assim!`;
            break;
        case 'Moedas':
            message = `Você tem ${value} moedas. Use-as na loja!`;
            break;
        case 'Vidas':
            message = `Você tem ${value} vidas restantes. Use-as com sabedoria!`;
            break;
        default:
            message = `${statName}: ${value}`;
    }

    showNotification(message, 'info');
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__message">${message}</span>
        <button class="notification__close">&times;</button>
    `;

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
            max-width: 90%;
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
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;

    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    notification.querySelector('.notification__close').addEventListener('click', () => {
        notification.remove();
    });

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
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

// ===== Welcome Animation =====
function playWelcomeAnimation() {
    const header = document.querySelector('.home-header');
    const trailItems = document.querySelectorAll('.trail-step, .trilha-step');

    if(header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 100);
    }

    trailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';

        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// ===== View Management =====
function showHomeView() {
    currentView = 'home';
    document.querySelector('.modules-view').style.display = 'none';
    
    const trilhasView = document.querySelector('.trilhas-view');
    const trailDetailView = document.querySelector('.trail-detail-view');
    
    if(trilhasView) trilhasView.style.display = 'none';
    if(trailDetailView) trailDetailView.style.display = 'none';

    document.querySelector('.content-wrapper').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Showing home view');
}

function showModulesView() {
    currentView = 'modules';
    document.querySelector('.content-wrapper').style.display = 'none';
    
    const trilhasView = document.querySelector('.trilhas-view');
    const trailDetailView = document.querySelector('.trail-detail-view');
    
    if(trilhasView) trilhasView.style.display = 'none';
    if(trailDetailView) trailDetailView.style.display = 'none';

    document.querySelector('.modules-view').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Showing modules view');
}

// ===== Modules View Initialization =====
function initModulesView() {
    const moduleCards = document.querySelectorAll('.module-card');

    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('locked')) {
                showNotification('Complete as lições anteriores para desbloquear este módulo!', 'info');
                return;
            }

            const moduleTitleEl = card.querySelector('.module-title');
            const moduleTitle = moduleTitleEl ? moduleTitleEl.textContent.trim() : 'Trilha de Aprendizado';
            const target = `trilhas.html?module=${encodeURIComponent(moduleTitle)}`;
            window.location.href = target;
        });

        if (!card.classList.contains('locked')) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
}

// ===== Integração com API (Carregar Trilha) =====
async function carregarTrilha(moduloId = 1) { 
    try {
        const response = await fetch(`/api/modulos/${moduloId}/trilhas`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
            throw new Error("Erro ao carregar a trilha");
        }

        const mapData = await response.json();
        const botoes = document.querySelectorAll('.botao-fase');

        const concluidasLocal = JSON.parse(localStorage.getItem('fases_concluidas')) || [];

        let todasAtividades = [];
        if (Array.isArray(mapData)) {
            mapData.forEach(trilha => {
                if (trilha.atividades) {
                    todasAtividades = todasAtividades.concat(trilha.atividades);
                }
            });
        }

        todasAtividades.forEach((atividade, index) => {
            const botao = botoes[index];
            if (!botao) return;
            const imgFase = botao.querySelector('.imagem-da-fase');

            const isLocalConcluida = concluidasLocal.includes(atividade.id);
            const status = isLocalConcluida ? 'concluida' : atividade.status;

            if (status === 'liberada' || status === 'concluida') {
                    imgFase.src = `assets/liberado${atividade.id}.png`; 
                    imgFase.style.filter = "none";
                    
                    // Verifica o tipo antes de abrir o quiz
                    botao.onclick = () => {
                        localStorage.setItem('ultima_fase_id', atividade.id);
                        localStorage.setItem('ultima_fase_tipo', atividade.tipo); // Salva o tipo também

                        if (atividade.tipo === 'leitura') {
                            // Para leitura, abre o quiz mesmo assim (tem questões embutidas)
                            // Se quiser uma tela de leitura separada no futuro, mude aqui!
                            if (typeof openQuizModal === 'function') openQuizModal();
                        } else if (atividade.tipo === 'quiz') {
                            if (typeof openQuizModal === 'function') openQuizModal();
                        } else if (atividade.tipo === 'minigame') {
                            // Minigame ainda não implementado
                            alert(`Minigame "${atividade.nome}" em breve!`);
                        } else {
                            if (typeof openQuizModal === 'function') openQuizModal();
                        }
                    };
                    
                    botao.style.cursor = "pointer";
                } else  {
                imgFase.src = "assets/cadeado.png"; 
                botao.onclick = null;
                botao.style.cursor = "not-allowed";
            }
        });
    } catch (error) {
        console.error("Erro ao carregar a trilha:", error);
    }
}
window.carregarTrilha = carregarTrilha;