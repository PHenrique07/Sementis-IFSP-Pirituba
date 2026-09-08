const configuracoesRanking = {
        'XP Semanal': { rota: '/api/ranking/xp_semanal', chave: 'xp_semanal' },
        'Ofensiva': { rota: '/api/ranking/ofensiva', chave: 'ofensiva' },
        'Progresso': { rota: '/api/ranking/progresso', chave: 'progresso' }
    };

function obterValorRanking(item, chavePadrao) {
    if (!item || typeof item !== 'object') return 0;

    const valor = item[chavePadrao] ?? item.valor ?? item.pontos ?? item.xp ?? item.total ?? 0;
    return Number(valor) || 0;
}

function renderizarRanking(dados, tipo) {
    const lista = document.querySelector('#rankingList, .ranking-list');
    const configuracao = configuracoesRanking[tipo];

    if (!lista || !configuracao) return;

    const ranking = ordenarRanking(dados, configuracao.chave);

    lista.textContent = '';

    ranking.forEach((item, indice) => {
        const linha = document.createElement('li');
        linha.textContent =
            `${indice + 1}º - ${item.nome || 'Aluno'}: ` +
            `${obterValorRanking(item, configuracao.chave)}`;

        lista.appendChild(linha);
    });
}

async function carregarRanking(tipoRanking) {
    const configuracao = opcoesRanking[tipoRanking];
    const lista = document.querySelector('.ranking-list, #rankingList, .ranking');

    if (!configuracao) {
        console.error('Tipo de ranking inválido:', tipoRanking);
        return;
    }

    if (!lista) {
        console.warn('Lista de ranking não encontrada no DOM.');
        return;
    }

    const token = localStorage.getItem('token');

    lista.innerHTML = '<li class="ranking-carregando">Carregando...</li>';

    try {
        const resposta = await fetch(configuracao.rota, {
    credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao buscar ${configuracao.label}: ${resposta.status}`);
        }

        const dados = await resposta.json();
        renderizarRanking(lista, dados, configuracao.chaveValor);
    } catch (erro) {
        console.error('Falha ao carregar ranking:', erro);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const botoesRanking = document.querySelectorAll('[data-ranking]');
    const seletorRanking = document.getElementById('opcao');

    botoesRanking.forEach((botao) => {
        botao.addEventListener('click', () => {
            selecionarRanking(botao.dataset.ranking);
        });
    });

    if (seletorRanking) {
        seletorRanking.addEventListener('change', (evento) => {
            selecionarRanking(evento.target.value);
        });
    }

    selecionarRanking(seletorRanking?.value || 'XP Semanal');
});