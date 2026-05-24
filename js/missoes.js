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

// ===== Integração com API (Corrigir Questão) =====
document.addEventListener('DOMContentLoaded', () => {
    let contadorCoracoes = document.getElementById('coracoes');
    let numeroSelecionado = 0;
    let jogoBloqueado = false;

    // Inicializa o contador de erros caso não exista
    if (!localStorage.getItem('erros_cometidos')) {
        localStorage.setItem('erros_cometidos', 0);
    }

    function corrigirQuestao(idQuestao, respostaUsuario, respostaCorreta, botaoAlvo, numeroDeQuestoes) {
        if (jogoBloqueado) return;
        jogoBloqueado = true; // Bloqueia imediatamente após o clique

        // 1. BUSCA AS VIDAS DIRETO DA FONTE DA VERDADE (localStorage)
        let dadosUsuario = JSON.parse(localStorage.getItem('user')) || { vidas: 4 };
        let vidasAtuais = parseInt(dadosUsuario.vidas);

        let contadorCoracoes = document.getElementById('coracoes');

        if (respostaUsuario === respostaCorreta) {
            numeroSelecionado += 1;
            botaoAlvo.style.backgroundColor = 'green';
            jogoBloqueado = false; // Desbloqueia se acertou e o jogo continua
        }  else {
            numeroSelecionado += 1;
            botaoAlvo.style.backgroundColor = 'red';
            
            // Subtrai a vida com segurança visual
            vidasAtuais -= 1; 
            if (vidasAtuais < 0) vidasAtuais = 0; 

            // Atualiza o localStorage
            dadosUsuario.vidas = vidasAtuais;
            localStorage.setItem('user', JSON.stringify(dadosUsuario));

            // Atualiza o HTML
            if (contadorCoracoes) {
                contadorCoracoes.textContent = vidasAtuais; 
            }

            // Guarda o erro
            let erros = parseInt(localStorage.getItem('erros_cometidos') || 0);
            localStorage.setItem('erros_cometidos', erros + 1);

            // CORREÇÃO 1: Destrava o jogo após 800ms para ele poder tentar outra alternativa!
            setTimeout(() => {
                jogoBloqueado = false;
            }, 800);
        }

        // 4. VERIFICAÇÃO DE GAME OVER
        if (vidasAtuais <= 0) {
            const trilhaId = localStorage.getItem('ultima_fase_id');
            const errosCount = localStorage.getItem('erros_cometidos') || 0;
            
            fetch('/completar_atividade', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    atividade_id: trilhaId,
                    erros: parseInt(errosCount),
                    concluida_com_sucesso: false
                })
           }).finally(() => {
                // CORREÇÃO 2a: Zera os erros após morrer
                localStorage.setItem('erros_cometidos', 0); 
                alert("Game Over! Você ficou sem corações.");
                window.location.href = 'mapa.html';
            });
            return; 
        }

        // Quando responder à última pergunta
        if (numeroDeQuestoes <= numeroSelecionado) {
            if (typeof window.finalizarTrilha === 'function') {
                window.finalizarTrilha();
            } else {
                console.warn('Função finalizarTrilha não encontrada no escopo global!');
            }
            return; 
        }
    }

    window.corrigirQuestao = corrigirQuestao;
});
