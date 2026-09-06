const opcoesRanking = {
    'XP Semanal': {
        rota: '/api/ranking/xp_semanal',
        chaveValor: 'xp_semanal',
        label: 'XP Semanal'
    },
    'Ofensiva': {
        rota: '/api/ranking/ofensiva',
        chaveValor: 'ofensiva',
        label: 'Ofensiva'
    },
    'Progresso': {
        rota: '/api/ranking/progresso',
        chaveValor: 'progresso',
        label: 'Progresso'
    }
};

function obterValorRanking(item, chavePadrao) {
    if (!item || typeof item !== 'object') return 0;

    const valor = item[chavePadrao] ?? item.valor ?? item.pontos ?? item.xp ?? item.total ?? 0;
    return Number(valor) || 0;
}

function renderizarRanking(lista, dados, chaveValor) {
    if (!lista) return;

    lista.innerHTML = '';

    if (!Array.isArray(dados) || dados.length === 0) {
        lista.innerHTML = '<li class="ranking-vazio">Nenhum dado encontrado.</li>';
        return;
    }

    const rankingOrdenado = [...dados].sort((a, b) => {
        return obterValorRanking(b, chaveValor) - obterValorRanking(a, chaveValor);
    });

    rankingOrdenado.forEach((item, index) => {
        const linha = document.createElement('li');
        linha.className = 'ranking-item';

        const posicao = document.createElement('span');
        posicao.className = 'ranking-posicao';
        posicao.textContent = `${index + 1}º`;

        const nome = document.createElement('span');
        nome.className = 'ranking-nome';
        nome.textContent = item.nome || 'Aluno';

        const valor = document.createElement('strong');
        valor.className = 'ranking-valor';
        valor.textContent = `${obterValorRanking(item, chaveValor)}${
            chaveValor === 'ofensiva' ? 'd' : ''
        }`;

        linha.appendChild(posicao);
        linha.appendChild(nome);
        linha.appendChild(valor);
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
        lista.innerHTML = '<li class="ranking-erro">Não foi possível carregar o ranking.</li>';
    }
}

function configurarSelecaoRanking() {
    const select = document.getElementById('opcao');
    const botoes = document.querySelectorAll('[data-ranking]');

    const ativarTipo = (tipo) => {
        if (select) {
            select.value = tipo;
        }

        botoes.forEach((botao) => {
            const ativo = botao.dataset.ranking === tipo;
            botao.classList.toggle('ativo', ativo);
            botao.setAttribute('aria-pressed', String(ativo));
        });

        carregarRanking(tipo);
    };

    if (select) {
        select.addEventListener('change', (evento) => {
            ativarTipo(evento.target.value);
        });
    }

    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            ativarTipo(botao.dataset.ranking);
        });
    });

    const tipoInicial = select ? select.value : 'XP Semanal';
    ativarTipo(opcoesRanking[tipoInicial] ? tipoInicial : 'XP Semanal');
}

document.addEventListener('DOMContentLoaded', configurarSelecaoRanking);

//Esperado da parte do html:
/*<section class="ranking-section">
    <h2>Ranking da turma</h2>

    <div class="ranking-controls">
        <select id="opcao">
            <option value="XP Semanal">XP Semanal</option>
            <option value="Ofensiva">Ofensiva</option>
            <option value="Progresso">Progresso</option>
        </select>

        <button type="button" data-ranking="XP Semanal">XP Semanal</button>
        <button type="button" data-ranking="Ofensiva">Ofensiva</button>
        <button type="button" data-ranking="Progresso">Progresso</button>
    </div>

    <ul id="rankingList" class="ranking-list"></ul>
</section>*/
/*Esperado da resposta da api:

[
  { "nome": "Ana", "xp_semanal": 1500 },
  { "nome": "Bruno", "xp_semanal": 1200 }
]
  
ou:

{
  "ranking": [
    { "nome": "Ana", "xp_semanal": 1500 },
    { "nome": "Bruno", "xp_semanal": 1200 }
  ]
}*/