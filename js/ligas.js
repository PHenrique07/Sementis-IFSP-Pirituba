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
            document.getElementById('rankingList').innerHTML = '<li style="color:white; text-align:center; padding: 20px;">Erro ao carregar o ranking. A API está rodando?</li>';
        }
    };

    // Dá o gatilho inicial para buscar os dados assim que a tela carregar
    buscarRankingAPI();
});