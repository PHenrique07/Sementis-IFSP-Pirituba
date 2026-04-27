document.addEventListener('DOMContentLoaded', async () => {
    let missoesGlobais = []; 

    const buscarMissoes = async () => {
        const tempoReal = new Date().getTime();
        const rota = `http://127.0.0.1:5000/missoes?v=${tempoReal}`;
        const token = localStorage.getItem('token'); 

        try {
            const response = await fetch(rota, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });

            if (!response.ok) throw new Error('Erro ao buscar dados da API');

            let missoes = await response.json();
            
            // === A MÁGICA DA ORGANIZAÇÃO ===
            // Ordena do menor XP (Bronze) para o maior XP (Diamante)
            missoes.sort((a, b) => a.xp - b.xp);
            
            missoesGlobais = missoes;
            exibirMissoes(missoesGlobais);
            
        } catch (erro) {
            console.error('Falha na requisição das missões:', erro);
        }
    };

    // Função para definir a cor e o ícone baseado no XP da missão
    const definirTierVisual = (xp) => {
        if (xp <= 50) return { classe: 'tier-bronze', icone: 'missao_alvo_bronze.png' };
        if (xp <= 100) return { classe: 'tier-prata', icone: 'missao_alvo_prata.png' };
        if (xp <= 250) return { classe: 'tier-ouro', icone: 'missao_alvo_ouro.png' };
        return { classe: 'tier-diamante', icone: 'missao_alvo_diamante.png' };
    };

    const exibirMissoes = (dados) => {
        // Busca a primeira caixa de missões da sua tela
        const containerMissoes = document.querySelectorAll('.missions-list')[0]; 
        if (!containerMissoes) return;

        // Limpa as missões "chumbadas" no HTML, mas mantém o título e o botão de interrogação
        containerMissoes.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">MISSÕES DIÁRIAS</h2>
                <button class="info-btn" aria-label="Informações sobre Recompensas" onclick="toggleXpModal()">?</button>
            </div>
        `; 

        dados.forEach((missao) => {
            const tier = definirTierVisual(missao.xp);
            const porcentagemProgresso = Math.min((missao.progresso / missao.meta) * 100, 100);
            
            // ==========================================
            // A MÁGICA: Desenhando as bolinhas dinamicamente
            // ==========================================
            let nodesHtml = '';
            for (let i = 1; i <= missao.meta; i++) {
                let leftPos = (i / missao.meta) * 100; // Calcula o espaçamento exato
                let isFinal = i === missao.meta;
                let isConcluido = missao.progresso >= i;
                
                let classesNode = 'rpg-node';
                if (isFinal) classesNode += ' final';
                if (!isConcluido) classesNode += ' locked';

                let imgNode = '';
                if (isFinal) {
                    imgNode = 'assets/tarefas/tarefa_completa_selo.png';
                } else if (isConcluido) {
                    imgNode = 'assets/tarefas/tarefa_concluida.png';
                } else {
                    imgNode = 'assets/tarefas/tarefa_bloqueada.png';
                }

                nodesHtml += `<div class="${classesNode}" style="left: ${leftPos}%;"><img src="${imgNode}" alt="Node"></div>`;
            }

            // Cria o card maravilhoso com o design original
            const item = document.createElement('div');
            item.className = `mission-item ${tier.classe}`;
            
            item.innerHTML = `
                <div class="mission-info">
                    <p class="mission-title">${missao.nome}</p>
                    <div class="rpg-progress-container">
                        <div class="rpg-track">
                            <div class="rpg-fill" style="width: ${porcentagemProgresso}%;"></div>
                            <div class="rpg-nodes">
                                ${nodesHtml}
                            </div>
                        </div>
                        <span class="rpg-text" id="progresso-${missao.id}">${missao.progresso}/${missao.meta}</span>
                    </div>
                </div>
                <div class="mission-icon">
                    <img src="assets/ligas/${tier.icone}" alt="Ícone da Missão">
                </div>
            `;
            
            containerMissoes.appendChild(item);
        });
    };

    buscarMissoes();
});