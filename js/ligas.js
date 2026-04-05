document.addEventListener('DOMContentLoaded', () => {
    // 1. DADOS FALSOS (MOCK) - Simulando o que o banco vai devolver no futuro
    const rankingFalso = [
        { nome: "UltraDoZap00", xp: 2150 },
        { nome: "MegaDoCafe13", xp: 2131 },
        { nome: "SigmaDaLive26", xp: 2112 },
        { nome: "ChadDoPix39", xp: 2093 },
        { nome: "NpcDoChaos52", xp: 2074 },
        { nome: "BrainrotDoLobby65", xp: 2085 },
        { nome: "NoobDaResenha78", xp: 2066 },
        { nome: "TurboDoMeme91", xp: 2047 },
        { nome: "EpicDaRanked04", xp: 2028 },
        { nome: "CringeDoCaps17", xp: 2009 }
    ];

    // 2. FUNÇÃO QUE DESENHA NA TELA COM O CSS DO FOLTEST
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
    // 3. EXECUÇÃO HOJE (COM DADOS FALSOS)
    // ========================================================
    exibirRanking(rankingFalso); 

    // ========================================================
    // 4. O FUTURO (QUANDO O LUCAS TERMINAR A API)
    // 1. Apague a linha de cima: exibirRanking(rankingFalso);
    // 2. Tire os comentários (/* e */) do bloco abaixo:
    // ========================================================
    
    /*
    const buscarRankingAPI = async () => {
        const rota = 'http://127.0.0.1:5000/ranking'; 
        try {
            const response = await fetch(rota);
            if (!response.ok) throw new Error('Erro ao buscar dados da API');

            const usuarios = await response.json();
            exibirRanking(usuarios); // Chama a mesma função, mas com dados reais!

        } catch (erro) {
            console.error('Falha na requisição:', erro);
            document.getElementById('rankingList').innerHTML = '<li style="color:white; text-align:center; padding: 20px;">Erro ao carregar o ranking.</li>';
        }
    };

    buscarRankingAPI();
    */
});