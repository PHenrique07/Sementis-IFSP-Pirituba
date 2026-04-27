// ========================================================
// 0. DESTRUIDOR DE CACHE E PWA (A OPÇÃO NUCLEAR)
// ========================================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister(); 
        }
    });
}
if ('caches' in window) {
    caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => caches.delete(key))); 
    });
}

// ========================================================
// 1. ATUALIZAÇÃO DO PERFIL (Header/Sidebar)
// ========================================================
const dadosUsuario = JSON.parse(localStorage.getItem('user'));
let idUsuario = null;
let ligaInicial = 1;

if (dadosUsuario) {
    const nome = dadosUsuario.nome;
    const moedas = dadosUsuario.moedas;
    const sequencia = dadosUsuario.ofensiva;
    const vida = dadosUsuario.vidas;
    const liga = dadosUsuario.liga_id;
    
    idUsuario = Number(dadosUsuario.id);
    ligaInicial = Number(liga) || 1;

    const campoNome = document.querySelector('.user-name');
    const campoSequencia = document.querySelector('.user-sequencia');
    const campoVida = document.querySelector('.user-vida');
    const campoMoedas = document.querySelector('.user-coins');
    const campoLiga = document.querySelector('.user-liga');

    if (campoNome) campoNome.textContent = nome;
    if (campoMoedas) campoMoedas.textContent = moedas;
    if (campoSequencia) campoSequencia.textContent = sequencia;
    if (campoVida) campoVida.textContent = vida;
    if (campoLiga) campoLiga.textContent = `Liga ${ligaInicial}`; 
}

// ========================================================
// 2. Lógica para Trocar Liga e Destaque Visuais (Troféus)
// ========================================================
function updateLeagueHeader(league) {
    const currentBadge = document.querySelector('.league-tier-pill.current-tier');
    const trackItems = document.querySelectorAll('.league-track-item');
    if (!currentBadge || trackItems.length === 0) return;

    trackItems.forEach(item => {
        item.classList.remove('reached', 'current');
        item.classList.add('upcoming');
        const img = item.querySelector('img');
        if (item !== trackItems[0] && item !== trackItems[1] && item !== trackItems[2] && img) {
            img.src = 'assets/ligas/liga_trofeu_bloqueado.png';
        }
    });
    
    let targetIndex = (league === 3 || league === 'ouro') ? 2 : (league === 2 || league === 'prata') ? 1 : 0;
    
    if (league === 1 || league === 'bronze') currentBadge.textContent = 'Liga Bronze';
    if (league === 2 || league === 'prata') currentBadge.textContent = 'Liga Prata';
    if (league === 3 || league === 'ouro') currentBadge.textContent = 'Liga Ouro';

    for (let i = 0; i <= targetIndex; i++) {
        trackItems[i].classList.add('reached');
        if (i === targetIndex) trackItems[i].classList.add('current');
    }
}

// ========================================================
// 3. RANKING E FETCH DA API
// ========================================================
const buscarRankingAPI = async (ligaId) => {
    const tempoReal = new Date().getTime();
    const rota = `http://127.0.0.1:5000/ranking/${ligaId}?v=${tempoReal}`; 
    
    try {
        const response = await fetch(rota, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error('Erro na API');
        
        const usuarios = await response.json();
        const lista = document.getElementById('rankingList');
        if (!lista) return;
        lista.innerHTML = '';

        usuarios.sort((a, b) => b.xp - a.xp).forEach((user, index) => {
            const posicao = index + 1;
            const item = document.createElement('li');
            item.className = 'ranking-row';

            // Destaque por zona baseado na posição (não depende de nth-child)
            if (posicao <= 10) {
                item.classList.add('promotion-highlight');
            } else {
                item.classList.add('demotion-highlight');
            }
            
            // Destaque do usuário logado
            if (Number(user.id) === idUsuario) {
                item.classList.add('rank-highlight');
            }
            
            let rankHtml = '';
            
            if (posicao === 1) { 
                item.classList.add('top-1');
                rankHtml = '<div class="rank-badge"><img src="assets/ligas/liga_medalha_ouro.png" alt="1º lugar"></div>'; 
            } else if (posicao === 2) { 
                item.classList.add('top-2');
                rankHtml = '<div class="rank-badge"><img src="assets/ligas/liga_medalha_prata.png" alt="2º lugar"></div>'; 
            } else if (posicao === 3) { 
                item.classList.add('top-3');
                rankHtml = '<div class="rank-badge"><img src="assets/ligas/liga_medalha_bronze.png" alt="3º lugar"></div>'; 
            } else { 
                rankHtml = `<div class="rank-number">${posicao}</div>`; 
            }

            item.innerHTML = `
                ${rankHtml}
                <div class="player-avatar"><img src="assets/icons/icone_usuario.png" alt="Avatar"></div>
                <div class="player-meta" style="flex-grow: 1; padding: 0 10px;">
                    <h3>${user.nome}</h3>
                </div>
                <div class="player-xp" style="white-space: nowrap;">XP ${user.xp}</div>
            `;
            lista.appendChild(item);

            // Divisória de zona de promoção
            if (posicao === 10 || (posicao === usuarios.length && usuarios.length < 10)) {
                const divisoria = document.createElement('li');
                divisoria.style.width = '100%';
                divisoria.style.textAlign = 'center';
                divisoria.style.color = '#a9ff71'; 
                divisoria.style.fontSize = '12px';
                divisoria.style.fontWeight = 'bold';
                divisoria.style.margin = '15px 0';
                divisoria.style.borderBottom = '2px dashed #a9ff71';
                divisoria.style.paddingBottom = '5px';
                divisoria.style.letterSpacing = '1px';
                divisoria.innerText = '⇧ ZONA DE PROMOÇÃO ⇧';
                lista.appendChild(divisoria);
            }
        });
    } catch (erro) {
        console.error('Falha no ranking:', erro);
    }
};

// ========================================================
// 4. INICIALIZAÇÃO E CLIQUES (Esperando a Navbar)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    const verificadorNavbar = setInterval(() => {
        const trofeus = document.querySelectorAll('.league-track-item');
        
        if (trofeus.length > 0) {
            clearInterval(verificadorNavbar);
            
            updateLeagueHeader(ligaInicial);
            buscarRankingAPI(ligaInicial);

            if (!document.getElementById('css-trofeus-clique')) {
                const style = document.createElement('style');
                style.id = 'css-trofeus-clique';
                style.innerHTML = '.league-track-item { cursor: pointer !important; transition: transform 0.2s !important; } .league-track-item:hover { transform: scale(1.1) !important; }';
                document.head.appendChild(style);
            }
        }
    }, 100);

    document.body.addEventListener('click', (event) => {
        const trofeuClicado = event.target.closest('.league-track-item');
        
        if (trofeuClicado) {
            const todosTrofeus = Array.from(document.querySelectorAll('.league-track-item'));
            const index = todosTrofeus.indexOf(trofeuClicado);
            
            if (index !== -1) {
                const ligaClicada = index + 1; 
                updateLeagueHeader(ligaClicada); 
                buscarRankingAPI(ligaClicada);   
            }
        }
    });
});