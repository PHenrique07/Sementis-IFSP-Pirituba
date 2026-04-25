// Lógica para Trocar Liga e Destaque
function updateLeagueHeader(league) {
    const currentBadge = document.querySelector('.league-tier-pill.current-tier');
    const trackItems = document.querySelectorAll('.league-track-item');
    
    // "Limpar" o estado
    trackItems.forEach(item => {
        item.classList.remove('reached', 'current');
        item.classList.add('upcoming');
        const img = item.querySelector('img');
        if (item !== trackItems[0] && item !== trackItems[1] && item !== trackItems[2]) {
            img.src = 'assets/ligas/liga_trofeu_bloqueado.png';
        }
    });
    
    let targetIndex = 0;
    if (league === 'bronze') {
        currentBadge.textContent = 'Liga Bronze';
        targetIndex = 0;
    } else if (league === 'prata') {
        currentBadge.textContent = 'Liga Prata';
        targetIndex = 1;
    } else if (league === 'ouro') {
        currentBadge.textContent = 'Liga Ouro';
        targetIndex = 2;
        // Troca o ícone de bloqueado para troféu se for o caso
        const imgOuro = trackItems[2].querySelector('img');
        imgOuro.src = 'assets/ligas/liga_medalha_ouro.png'; 
    }
    
    for (let i = 0; i <= targetIndex; i++) {
        trackItems[i].classList.remove('upcoming');
        trackItems[i].classList.add('reached');
        if (i === targetIndex) {
            trackItems[i].classList.add('current');
        }
    }
}

// Chamada de Exemplo (para quando Vini for conferir a funcionalidade):
// Podes mudar para 'bronze', 'prata' ou 'ouro'.
updateLeagueHeader('prata');

document.addEventListener('DOMContentLoaded', () => {
    // 1. FUNÇÃO QUE DESENHA NA TELA COM O CSS DO FOLTEST
    const exibirRanking = (dados) => {
        const lista = document.getElementById('rankingList'); 
        
        if (!lista) return;
        lista.innerHTML = ''; // Limpa os dados velhos antes de injetar os novos

        dados.forEach((usuario, index) => {
            const item = document.createElement('li');
            item.className = 'ranking-row'; 
            
            let posicao = index + 1;
            let rankHtml = '';
            
            // Lógica das Medalhas do Pódio com as imagens originais
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

            // Injetando o HTML exato que o CSS espera
            item.innerHTML = `
                ${rankHtml}
                <div class="player-avatar"><img src="assets/icons/icone_usuario.png" alt="Avatar"></div>
                <div class="player-meta">
                    <h3>${usuario.nome}</h3>
                </div>
                <div class="player-xp">XP ${usuario.xp}</div>
            `;
            
            // Lógica para injetar a zona invisível de rebaixamento no CSS (se baseando que temos muitos itens)
            // No mock/API, dependendo da quantidade de itens, você pode ajustar onde o rebaixamento começa.
            // Para manter igual o design CSS feito, a 89ª posição engatilha visualmente.
            if (posicao === 89 && dados.length > 90) {
                const anchor = document.createElement('div');
                anchor.className = 'demotion-zone';
                lista.appendChild(anchor);
            }
            
            lista.appendChild(item);
        });
    };

    // ========================================================
    // 2. BUSCANDO OS DADOS REAIS DO BANCO DE DADOS (API)
    // ========================================================
    const buscarRankingAPI = async () => {
        const rota = 'http://127.0.0.1:5000/ranking'; 
        try {
            const response = await fetch(rota);
            if (!response.ok) throw new Error('Erro ao buscar dados da API');

            // Recebe o JSON que o Lucas configurou no app.py
            const usuarios = await response.json();
            
            // Garantia extra do Front-end: ordena do maior pro menor XP
            usuarios.sort((a, b) => b.xp - a.xp);
            
            // Desenha a galera na tela
            exibirRanking(usuarios); 

        } catch (erro) {
            console.error('Falha na requisição:', erro);
            document.getElementById('rankingList').innerHTML = '<li class="ranking-row" style="justify-content: center; color: var(--neon-secondary);">Erro ao carregar o ranking. A API está rodando?</li>';
        }
    };

    // Dá o gatilho inicial para buscar os dados assim que a tela carregar
    buscarRankingAPI();
});