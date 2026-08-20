const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('user') || '{}');
const turmaId = new URLSearchParams(window.location.search).get('turma');

if (!token || usuario.tipo !== 'professor') {
    window.location.replace('login.html');
}
if (!turmaId || !/^\d+$/.test(turmaId)) {
    window.location.replace('painel-professor.html');
}

const professorNome = document.getElementById('professor-nome');
if (professorNome) professorNome.textContent = usuario.nome || 'Professor(a)';

async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('login.html');
        return null;
    }
    return response;
}

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

function renderAvisos(avisos) {
    const lista = document.getElementById('avisos-lista');
    if (!lista) return;
    if (!avisos.length) {
        lista.innerHTML = '<p class="empty-message">Ainda não há avisos. Use “Novo aviso” para publicar o primeiro recado.</p>';
        return;
    }
    lista.innerHTML = avisos.map(aviso => `
        <article class="aviso">
            <h3>${escapeHtml(aviso.titulo)}</h3>
            <p>${escapeHtml(aviso.mensagem)}</p>
            <time>Publicado em ${escapeHtml(aviso.data_publicacao)}</time>
        </article>`).join('');
}

function renderAlunos(alunos) {
    const tbody = document.getElementById('alunos-tbody');
    if (!tbody) return;
    if (!alunos.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">Nenhum aluno entrou nesta turma ainda.</td></tr>';
        return;
    }
    tbody.innerHTML = alunos.map(aluno => `
        <tr>
            <td><span class="aluno-name">${escapeHtml(aluno.nome)}</span><span class="aluno-level">Nível ${aluno.nivel}</span></td>
            <td><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0, Math.min(100, aluno.progresso))}%"></div></div><small>${aluno.progresso}%</small></td>
            <td class="xp-value">${aluno.xp_semanal.toLocaleString('pt-BR')} XP</td>
            <td class="streak">🔥 ${aluno.ofensiva}</td>
        </tr>`).join('');
}

function renderGraficos(dados) {
    const { distribuicao_progresso: distribuicao, alunos } = dados;
    const total = dados.kpis.total_alunos || 0;
    const emDia = distribuicao.em_dia || 0;
    const percentualEmDia = total ? Math.round((emDia / total) * 100) : 0;
    const donut = document.getElementById('donut-chart');
    if (donut) donut.style.setProperty('--angle', `${percentualEmDia * 3.6}deg`);
    document.getElementById('donut-value').textContent = `${percentualEmDia}%`;

    const legend = document.getElementById('chart-legend');
    if (legend) {
        legend.innerHTML = [
            ['#a9ff71', 'Em dia (70%+)', distribuicao.em_dia],
            ['#ffbd70', 'Em atenção (30–69%)', distribuicao.atencao],
            ['#ee8b9b', 'No início (<30%)', distribuicao.inicio]
        ].map(([cor, label, valor]) => `<li><span><i class="legend-dot" style="background:${cor}"></i>${label}</span><strong>${valor}</strong></li>`).join('');
    }

    const chart = document.getElementById('bar-chart');
    if (chart) {
        const exibidos = alunos.slice(0, 8);
        const maiorXp = Math.max(...exibidos.map(aluno => aluno.xp_semanal), 1);
        chart.innerHTML = exibidos.length ? exibidos.map(aluno => `
            <div class="bar-column" title="${escapeHtml(aluno.nome)}: ${aluno.xp_semanal} XP">
                <div class="bar" style="height:${Math.max(5, Math.round((aluno.xp_semanal / maiorXp) * 145))}px"></div>
                <span>${escapeHtml(aluno.nome.split(' ')[0])}</span>
            </div>`).join('') : '<p class="empty-message">Os dados aparecerão quando houver alunos na turma.</p>';
    }
}

function renderDados(dados) {
    document.title = `${dados.turma.nome} — Sementis`;
    document.getElementById('turma-nome').textContent = dados.turma.nome;
    document.getElementById('turma-descricao').textContent = `Criada em ${dados.turma.data_criacao}. Um espaço para orientar e acompanhar a turma.`;
    document.getElementById('codigo-convite').textContent = dados.turma.codigo_convite;
    document.getElementById('kpi-alunos').textContent = dados.kpis.total_alunos;
    document.getElementById('kpi-ativos').textContent = dados.kpis.alunos_ativos;
    document.getElementById('kpi-xp').textContent = dados.kpis.media_xp_semanal.toLocaleString('pt-BR');
    document.getElementById('kpi-progresso').textContent = `${dados.kpis.media_progresso}%`;
    renderAvisos(dados.avisos);
    renderAlunos(dados.alunos);
    renderGraficos(dados);
}

async function carregarTurma() {
    try {
        const response = await apiFetch(`/api/professor/turmas/${turmaId}/visao-geral`);
        if (!response) return;
        const dados = await response.json();
        if (!response.ok) throw new Error(dados.erro || 'Não foi possível carregar esta turma.');
        renderDados(dados);
    } catch (erro) {
        document.getElementById('turma-nome').textContent = 'Não foi possível abrir a turma';
        document.getElementById('turma-descricao').textContent = erro.message;
    }
}

const modal = document.getElementById('aviso-modal');
const abrirModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.getElementById('aviso-titulo').focus(); };
const fecharModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.getElementById('aviso-form').reset(); document.getElementById('aviso-erro').textContent = ''; };
document.getElementById('abrir-aviso').addEventListener('click', abrirModal);
document.getElementById('fechar-aviso').addEventListener('click', fecharModal);
modal.addEventListener('click', event => { if (event.target === modal) fecharModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') fecharModal(); });

document.getElementById('copiar-convite').addEventListener('click', async () => {
    const codigo = document.getElementById('codigo-convite').textContent;
    await navigator.clipboard?.writeText(codigo);
    const botao = document.getElementById('copiar-convite');
    botao.textContent = 'Código copiado!';
    setTimeout(() => { botao.textContent = 'Copiar código'; }, 1800);
});

document.getElementById('aviso-form').addEventListener('submit', async event => {
    event.preventDefault();
    const erro = document.getElementById('aviso-erro');
    const botao = event.currentTarget.querySelector('button[type="submit"]');
    erro.textContent = '';
    botao.disabled = true;
    botao.textContent = 'Publicando...';
    try {
        const response = await apiFetch(`/api/professor/turmas/${turmaId}/avisos`, {
            method: 'POST',
            body: JSON.stringify({ titulo: document.getElementById('aviso-titulo').value, mensagem: document.getElementById('aviso-mensagem').value })
        });
        const dados = await response.json();
        if (!response.ok) throw new Error(dados.erro || 'Não foi possível publicar o aviso.');
        fecharModal();
        carregarTurma();
    } catch (exception) {
        erro.textContent = exception.message;
    } finally {
        botao.disabled = false;
        botao.textContent = 'Publicar aviso';
    }
});

carregarTurma();
