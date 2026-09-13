const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('user') || '{}');
const turmaId = new URLSearchParams(window.location.search).get('turma');
let dadosCarregados = false;

if (!token || usuario.tipo !== 'professor') {
    window.location.replace('login.html');
}
if (!turmaId || !/^\d+$/.test(turmaId)) {
    window.location.replace('painel-professor.html');
}

const professorNome = document.getElementById('professor-nome');
if (professorNome) professorNome.textContent = usuario.nome || 'Professor(a)';

async function apiFetch(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
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

// Estado local da tela
let todosAlunos = [];
let filtroAtivo = 'todos';
let termoBusca = '';

// ===== RENDERIZAÇÃO DE AVISOS =====
function renderAvisos(avisos) {
    const lista = document.getElementById('avisos-lista');
    if (!lista) return;
    if (!avisos || !avisos.length) {
        lista.innerHTML = '<p class="empty-message">Ainda não há avisos. Use “+ Novo aviso” para publicar o primeiro recado.</p>';
        return;
    }
    lista.innerHTML = avisos.map(aviso => `
        <article class="aviso">
            <h3>${escapeHtml(aviso.titulo)}</h3>
            <p>${escapeHtml(aviso.mensagem)}</p>
            <time>Publicado em ${escapeHtml(aviso.data_publicacao)}</time>
        </article>`).join('');
}

// ===== RENDERIZAÇÃO DE MÓDULOS CURRICULARES =====
function renderModulos(modulos) {
    const container = document.getElementById('modulos-lista');
    if (!container) return;
    if (!modulos || !modulos.length) {
        container.innerHTML = '<p class="empty-message">Nenhum módulo cadastrado no sistema educacional.</p>';
        return;
    }

    container.innerHTML = modulos.map(modulo => {
        const pct = Math.max(0, Math.min(100, modulo.porcentagem || 0));
        return `
        <article class="modulo-card">
            <div class="modulo-card-header">
                <h3 class="modulo-nome">${escapeHtml(modulo.nome)}</h3>
                <span class="modulo-tag">Módulo ${modulo.ordem}</span>
            </div>
            <div class="modulo-progress-wrap">
                <div class="modulo-progress-bar">
                    <div class="modulo-progress-fill" style="width: ${pct}%"></div>
                </div>
                <div class="modulo-progress-labels">
                    <span>Progresso da turma</span>
                    <strong class="modulo-porcentagem">${pct}%</strong>
                </div>
            </div>
            <div class="modulo-stats-row">
                <span>🎯 ${modulo.alunos_completaram} ${modulo.alunos_completaram === 1 ? 'aluno completou' : 'alunos completaram'}</span>
                <span>📚 ${modulo.total_atividades} lições</span>
            </div>
        </article>`;
    }).join('');
}

// ===== RENDERIZAÇÃO E FILTRAGEM DE ALUNOS =====
function obterAlunosFiltrados() {
    return todosAlunos.filter(aluno => {
        // Filtro de status
        let passaFiltro = true;
        if (filtroAtivo !== 'todos') {
            passaFiltro = (aluno.status === filtroAtivo);
        }

        // Busca por texto
        let passaBusca = true;
        if (termoBusca.trim() !== '') {
            const termo = termoBusca.toLowerCase().trim();
            const nome = (aluno.nome || '').toLowerCase();
            const email = (aluno.email || '').toLowerCase();
            passaBusca = nome.includes(termo) || email.includes(termo);
        }

        return passaFiltro && passaBusca;
    });
}

function atualizarContadoresFiltros() {
    const contTodos = todosAlunos.length;
    const contEmDia = todosAlunos.filter(a => a.status === 'em_dia').length;
    const contAtencao = todosAlunos.filter(a => a.status === 'atencao').length;
    const contInicio = todosAlunos.filter(a => a.status === 'inicio').length;

    const elTodos = document.getElementById('cont-todos');
    const elEmDia = document.getElementById('cont-em-dia');
    const elAtencao = document.getElementById('cont-atencao');
    const elInicio = document.getElementById('cont-inicio');

    if (elTodos) elTodos.textContent = contTodos;
    if (elEmDia) elEmDia.textContent = contEmDia;
    if (elAtencao) elAtencao.textContent = contAtencao;
    if (elInicio) elInicio.textContent = contInicio;
}

function renderTabelaAlunos() {
    const tbody = document.getElementById('alunos-tbody');
    const contador = document.getElementById('alunos-contador');
    if (!tbody) return;

    const filtrados = obterAlunosFiltrados();

    if (contador) {
        contador.textContent = `Exibindo ${filtrados.length} de ${todosAlunos.length} alunos`;
    }

    if (!filtrados.length) {
        if (!todosAlunos.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum aluno entrou nesta turma ainda. Compartilhe o código de convite!</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-message">Nenhum aluno encontrado para os filtros selecionados.</td></tr>';
        }
        return;
    }

    tbody.innerHTML = filtrados.map((aluno, index) => {
        const pct = Math.max(0, Math.min(100, aluno.progresso));
        let badgeClass = 'status-badge--inicio';
        if (aluno.status === 'em_dia') badgeClass = 'status-badge--em_dia';
        else if (aluno.status === 'atencao') badgeClass = 'status-badge--atencao';

        const posicao = aluno.posicao || (index + 1);
        const topClass = posicao <= 3 ? 'aluno-pos--top' : '';

        return `
        <tr>
            <td class="aluno-pos ${topClass}">#${posicao}</td>
            <td>
                <span class="aluno-name">${escapeHtml(aluno.nome)}</span>
                <span class="aluno-email" title="${escapeHtml(aluno.email)}">${escapeHtml(aluno.email || '—')}</span>
            </td>
            <td>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${pct}%"></div>
                </div>
                <div class="progress-meta">
                    <span>${pct}%</span>
                    <span>${aluno.atividades_concluidas || 0}/${aluno.total_atividades || 0} lições</span>
                </div>
            </td>
            <td class="xp-value">${(aluno.xp_semanal || 0).toLocaleString('pt-BR')} XP</td>
            <td class="streak">🔥 ${aluno.ofensiva || 0}</td>
            <td>
                <span class="status-badge ${badgeClass}">
                    ${escapeHtml(aluno.status_texto || 'Iniciando')}
                </span>
            </td>
            <td>
                <button type="button" class="btn-raiox" onclick="abrirRaioX(${aluno.id})">
                    Ver Ficha
                </button>
            </td>
        </tr>`;
    }).join('');
}

// ===== RENDERIZAÇÃO DE GRÁFICOS =====
function renderGraficos(dados) {
    const { distribuicao_progresso: distribuicao, alunos } = dados;
    const total = dados.kpis.total_alunos || 0;
    const emDia = distribuicao.em_dia || 0;
    const percentualEmDia = total ? Math.round((emDia / total) * 100) : 0;
    const donut = document.getElementById('donut-chart');
    if (donut) donut.style.setProperty('--angle', `${percentualEmDia * 3.6}deg`);
    const donutVal = document.getElementById('donut-value');
    if (donutVal) donutVal.textContent = `${percentualEmDia}%`;

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
        const exibidos = (alunos || []).slice(0, 8);
        const maiorXp = Math.max(...exibidos.map(aluno => aluno.xp_semanal), 1);
        chart.innerHTML = exibidos.length ? exibidos.map(aluno => `
            <div class="bar-column" title="${escapeHtml(aluno.nome)}: ${aluno.xp_semanal} XP semanal">
                <div class="bar" style="height:${Math.max(6, Math.round((aluno.xp_semanal / maiorXp) * 145))}px"></div>
                <span>${escapeHtml(aluno.nome.split(' ')[0])}</span>
            </div>`).join('') : '<p class="empty-message">Os dados aparecerão quando houver alunos na turma.</p>';
    }
}

// ===== RENDERIZAÇÃO GERAL =====
function renderDados(dados) {
    document.title = `${dados.turma.nome} — Sementis`;
    document.getElementById('turma-nome').textContent = dados.turma.nome;
    document.getElementById('turma-descricao').textContent = `Criada em ${dados.turma.data_criacao}. Acompanhe o avanço pedagógico e engajamento da turma.`;
    document.getElementById('codigo-convite').textContent = dados.turma.codigo_convite;

    // KPIs
    document.getElementById('kpi-alunos').textContent = dados.kpis.total_alunos;
    document.getElementById('kpi-ativos').textContent = dados.kpis.alunos_ativos;
    document.getElementById('kpi-xp').textContent = dados.kpis.media_xp_semanal.toLocaleString('pt-BR');
    document.getElementById('kpi-progresso').textContent = `${dados.kpis.media_progresso}%`;
    const kpiRisco = document.getElementById('kpi-risco');
    if (kpiRisco) kpiRisco.textContent = dados.kpis.precisam_apoio ?? 0;

    const kpiDestaques = document.getElementById('kpi-destaques');
    if (kpiDestaques) kpiDestaques.textContent = dados.kpis.destaques ?? 0;

    // Salvar alunos e renderizar
    todosAlunos = dados.alunos || [];
    atualizarContadoresFiltros();
    renderTabelaAlunos();
    renderAvisos(dados.avisos);
    renderModulos(dados.modulos);
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

// ===== EXPORTAÇÃO DE RELATÓRIO (CSV & XLS) =====
const btnExportarToggle = document.getElementById('btn-exportar-toggle');
const exportMenu = document.getElementById('export-menu');

if (btnExportarToggle && exportMenu) {
    btnExportarToggle.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = exportMenu.classList.toggle('open');
        btnExportarToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', event => {
        if (!btnExportarToggle.contains(event.target) && !exportMenu.contains(event.target)) {
            exportMenu.classList.remove('open');
            btnExportarToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

async function exportarRelatorio(formato = 'csv') {
    if (exportMenu) {
        exportMenu.classList.remove('open');
        btnExportarToggle?.setAttribute('aria-expanded', 'false');
    }

    const textoOriginal = btnExportarToggle ? btnExportarToggle.innerHTML : '';
    if (btnExportarToggle) {
        btnExportarToggle.disabled = true;
        btnExportarToggle.innerHTML = '<span>Baixando...</span>';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/professor/turmas/${turmaId}/exportar?formato=${encodeURIComponent(formato)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const erroJson = await response.json().catch(() => ({}));
            throw new Error(erroJson.erro || 'Falha ao gerar relatório.');
        }

        const blob = await response.blob();
        let filename = `relatorio_turma_${turmaId}.${formato}`;

        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.includes('filename=')) {
            const match = disposition.match(/filename="?([^";]+)"?/);
            if (match && match[1]) filename = match[1];
        }

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
        alert(`Erro ao exportar relatório: ${err.message}`);
    } finally {
        if (btnExportarToggle) {
            btnExportarToggle.disabled = false;
            btnExportarToggle.innerHTML = textoOriginal;
        }
    }
}

// ===== EXPORTAÇÃO PDF (gerado no browser com html2pdf.js) =====
function exportarRelatorioPDF() {
    // Fecha o menu dropdown
    const exportMenu = document.getElementById('export-menu');
    const btnToggle  = document.getElementById('btn-exportar-toggle');
    if (exportMenu) exportMenu.classList.remove('open');
    if (btnToggle)  btnToggle.setAttribute('aria-expanded', 'false');

    const nomeTurma      = document.getElementById('turma-nome')?.textContent  || 'Turma';
    const totalAlunos    = document.getElementById('kpi-alunos')?.textContent   || '—';
    const mediaXp        = document.getElementById('kpi-xp')?.textContent       || '—';
    const mediaProgresso = document.getElementById('kpi-progresso')?.textContent || '—';
    const ativos         = document.getElementById('kpi-ativos')?.textContent    || '—';

    if (!todosAlunos.length) {
        alert('Nenhum dado disponível. Aguarde o carregamento da turma.');
        return;
    }

    if (btnToggle) {
        btnToggle.disabled = true;
        btnToggle.innerHTML = '<span>Gerando PDF…</span>';
    }

    const dataHoje = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });

    // ── KPI cards usando <table> (html2canvas não suporta CSS grid) ────
    const kpis = [
        { icon: '👥', label: 'Alunos na turma', val: totalAlunos,    cor: '#a9ff71' },
        { icon: '✦',  label: 'Ativos na semana', val: ativos,         cor: '#69ccff' },
        { icon: '⚡', label: 'XP médio semanal', val: mediaXp,        cor: '#ffb05f' },
        { icon: '◎',  label: 'Progresso médio',  val: mediaProgresso, cor: '#c084fc' },
    ];

    const kpiCells = kpis.map(k => `
        <td style="width:25%; padding:0 8px;">
            <div style="background:#1e2060; border:1px solid rgba(169,255,113,.25); border-radius:14px; padding:16px 12px; text-align:center;">
                <div style="font-size:22px; margin-bottom:6px;">${k.icon}</div>
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:#b9b9db; margin-bottom:4px;">${k.label}</div>
                <div style="font-size:22px; font-weight:800; color:${k.cor};">${k.val}</div>
            </div>
        </td>`).join('');

    // ── Linhas de alunos ─────────────────────────────────────────────
    const linhas = todosAlunos.map((aluno, i) => {
        const pct = Math.max(0, Math.min(100, aluno.progresso || 0));
        const cor = aluno.status === 'em_dia' ? '#a9ff71' : aluno.status === 'atencao' ? '#ffb05f' : '#ff7676';
        const bg  = i % 2 === 0 ? '#181848' : '#1a1a52';
        return `
        <tr style="background:${bg};">
            <td style="padding:9px 12px; font-weight:700; color:#b9b9db; font-size:12px;">#${aluno.posicao || i+1}</td>
            <td style="padding:9px 12px;">
                <div style="font-weight:700; color:#fff; font-size:13px;">${escapeHtml(aluno.nome || '—')}</div>
                <div style="font-size:10px; color:#8888b2;">${escapeHtml(aluno.email || '')}</div>
            </td>
            <td style="padding:9px 12px; text-align:center;">
                <div style="background:rgba(255,255,255,.08); border-radius:4px; height:6px; width:80px; margin:0 auto 3px;">
                    <div style="background:#a9ff71; height:6px; border-radius:4px; width:${pct}%;"></div>
                </div>
                <div style="font-size:11px; color:#a9ff71; font-weight:700;">${pct}%</div>
            </td>
            <td style="padding:9px 12px; text-align:center; font-weight:700; color:#a9ff71; font-size:13px;">${(aluno.xp_semanal||0).toLocaleString('pt-BR')}</td>
            <td style="padding:9px 12px; text-align:center; color:#ffb05f; font-size:13px;">🔥 ${aluno.ofensiva || 0}</td>
            <td style="padding:9px 12px; text-align:center;">
                <span style="background:${cor}22; color:${cor}; border:1px solid ${cor}66; border-radius:6px; padding:3px 10px; font-size:10px; font-weight:700;">
                    ${escapeHtml(aluno.status_texto || 'Iniciando')}
                </span>
            </td>
        </tr>`;
    }).join('');

    const htmlRelatorio = `
    <div style="width:960px; font-family:Arial,sans-serif; background:#11113b; color:#fff; padding:0;">

        <!-- HEADER -->
        <div style="background:linear-gradient(135deg,#1a1a5e,#12124a); padding:32px 36px; border-bottom:3px solid #a9ff71;">
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="vertical-align:middle;">
                        <div style="font-size:10px; font-weight:800; letter-spacing:2px; color:#a9ff71; text-transform:uppercase; margin-bottom:6px;">🌱 SEMENTIS — RELATÓRIO PEDAGÓGICO</div>
                        <div style="font-size:28px; font-weight:800; color:#fff;">${escapeHtml(nomeTurma)}</div>
                        <div style="font-size:12px; color:#b9b9db; margin-top:4px;">Gerado em ${dataHoje}</div>
                    </td>
                    <td style="text-align:right; vertical-align:middle;">
                        <div style="font-size:11px; color:#8888b2;">IFSP Pirituba</div>
                        <div style="font-size:36px; margin-top:4px;">🌍</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- KPIs -->
        <div style="padding:24px 36px 16px;">
            <table style="width:100%; border-collapse:collapse;">
                <tr>${kpiCells}</tr>
            </table>
        </div>

        <!-- TABELA DE ALUNOS -->
        <div style="padding:8px 36px 36px;">
            <div style="font-size:13px; font-weight:800; color:#a9ff71; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; padding-left:4px; border-left:4px solid #a9ff71; padding-left:10px;">
                Desempenho Individual dos Alunos
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
                <thead>
                    <tr style="background:#0d0d30;">
                        <th style="padding:10px 12px; text-align:left; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">#</th>
                        <th style="padding:10px 12px; text-align:left; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">Aluno</th>
                        <th style="padding:10px 12px; text-align:center; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">Progresso</th>
                        <th style="padding:10px 12px; text-align:center; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">XP Semanal</th>
                        <th style="padding:10px 12px; text-align:center; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">Ofensiva</th>
                        <th style="padding:10px 12px; text-align:center; color:#8888b2; font-size:10px; letter-spacing:1px; text-transform:uppercase; font-weight:700;">Situação</th>
                    </tr>
                </thead>
                <tbody>${linhas}</tbody>
            </table>
        </div>

        <!-- RODAPÉ -->
        <div style="background:#0d0d30; padding:14px 36px; text-align:center; font-size:10px; color:#5555a0;">
            Sementis · Plataforma de Educação Ambiental Gamificada · IFSP Pirituba
        </div>

    </div>`;

    // ── Monta container visível mas fora da tela (necessário para html2canvas) ──
    let container = document.getElementById('pdf-container-oculto');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pdf-container-oculto';
        document.body.appendChild(container);
    }
    // IMPORTANTE: position:fixed + top fora da área visível — html2canvas consegue renderizar
    Object.assign(container.style, {
        position:   'fixed',
        top:        '-9999px',
        left:       '0',
        width:      '960px',
        background: '#11113b',
        zIndex:     '-1',
        display:    'block',
        visibility: 'hidden',
    });
    container.innerHTML = htmlRelatorio;

    const nomeArquivo = `relatorio_${nomeTurma.replace(/\s+/g,'_').toLowerCase()}_${new Date().toISOString().slice(0,10)}.pdf`;

    const restaurarBtn = () => {
        if (btnToggle) {
            btnToggle.disabled = false;
            btnToggle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg><span>Exportar</span><span class="chevron-down">▾</span>`;
        }
        container.style.display = 'none';
        container.innerHTML = '';
    };

    // Pequeno delay para garantir que o DOM foi pintado antes do canvas
    requestAnimationFrame(() => {
        setTimeout(() => {
            html2pdf()
                .set({
                    margin:     [0, 0, 0, 0],
                    filename:   nomeArquivo,
                    image:      { type: 'jpeg', quality: 0.97 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#11113b', logging: false },
                    jsPDF:      { unit: 'mm', format: 'a4', orientation: 'landscape' }
                })
                .from(container.firstElementChild)
                .save()
                .then(restaurarBtn)
                .catch(err => { console.error('Erro PDF:', err); restaurarBtn(); });
        }, 100);
    });
}




/*


        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px;">
            ${[
                ['👥', 'Alunos', totalAlunos, '#5dba2f'],
                ['✦', 'Ativos', ativos, '#3db8f5'],
                ['⚡', 'XP Médio Semanal', mediaXp, '#f5a623'],
                ['◎', 'Progresso Médio', mediaProgresso, '#9b59b6']
            ].map(([icon, label, val, cor]) => `
                <div style="padding:14px; border-radius:12px; border:1px solid #e8eaf0; text-align:center; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.06);">
                    <div style="font-size:20px;">${icon}</div>
                    <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#888; margin:4px 0 2px;">${label}</div>
                    <strong style="font-size:20px; color:${cor};">${val}</strong>
                </div>`).join('')}
        </div>

        <h2 style="font-size:15px; color:#1a1a2e; margin:0 0 12px; border-left:4px solid #a9ff71; padding-left:10px;">Desempenho Individual dos Alunos</h2>
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
                <tr style="background:#1a1a2e; color:#fff;">
                    <th style="padding:10px; text-align:left; font-size:10px; letter-spacing:1px; text-transform:uppercase;">#</th>
                    <th style="padding:10px; text-align:left; font-size:10px; letter-spacing:1px; text-transform:uppercase;">Aluno</th>
                    <th style="padding:10px; text-align:center; font-size:10px; letter-spacing:1px; text-transform:uppercase;">Progresso</th>
                    <th style="padding:10px; text-align:center; font-size:10px; letter-spacing:1px; text-transform:uppercase;">XP Semanal</th>
                    <th style="padding:10px; text-align:center; font-size:10px; letter-spacing:1px; text-transform:uppercase;">Ofensiva</th>
                    <th style="padding:10px; text-align:center; font-size:10px; letter-spacing:1px; text-transform:uppercase;">Situação</th>
                </tr>
            </thead>
            <tbody>${linhasAlunos}</tbody>
        </table>

        <div style="margin-top:28px; padding-top:16px; border-top:1px solid #e8eaf0; font-size:11px; color:#aaa; text-align:center;">
            Sementis — Plataforma de Educação Ambiental Gamificada · IFSP Pirituba
        </div>
    </div>`;

    const container = document.getElementById('pdf-container-oculto');
    if (!container) {
        if (btnPdf) { btnPdf.disabled = false; btnPdf.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>Exportar PDF</span>'; }
        return;
    }
    container.style.display = 'block';
    container.innerHTML = htmlRelatorio;

    const nomeArquivo = `relatorio_${nomeTurma.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0,10)}.pdf`;

    html2pdf()
        .set({
            margin: 0,
            filename: nomeArquivo,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        })
        .from(container)
        .save()
        .then(() => {
            container.style.display = 'none';
            container.innerHTML = '';
        })
        .finally(() => {
            if (btnPdf) {
                btnPdf.disabled = false;
                btnPdf.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><span>Exportar PDF</span>`;
            }
        });
}
*/

const raioxModal = document.getElementById('raiox-modal');
const fecharRaioxBtn = document.getElementById('fechar-raiox');
const fecharRaioxBtn2 = document.getElementById('fechar-raiox-btn');

function fecharRaioX() {
    if (!raioxModal) return;
    raioxModal.classList.remove('open');
    raioxModal.setAttribute('aria-hidden', 'true');
}

if (fecharRaioxBtn) fecharRaioxBtn.addEventListener('click', fecharRaioX);
if (fecharRaioxBtn2) fecharRaioxBtn2.addEventListener('click', fecharRaioX);

if (raioxModal) {
    raioxModal.addEventListener('click', event => {
        if (event.target === raioxModal) fecharRaioX();
    });
}

async function abrirRaioX(alunoId) {
    if (!raioxModal) return;
    raioxModal.classList.add('open');
    raioxModal.setAttribute('aria-hidden', 'false');

    document.getElementById('raiox-nome').textContent = 'Carregando ficha...';
    document.getElementById('raiox-email').textContent = 'Aguarde um momento...';
    document.getElementById('raiox-modulos-lista').innerHTML = '<p class="empty-message">Carregando dados pedagógicos...</p>';

    try {
        const response = await apiFetch(`/api/professor/turmas/${turmaId}/alunos/${alunoId}`);
        if (!response) return;
        const dados = await response.json();
        if (!response.ok) throw new Error(dados.erro || 'Erro ao carregar detalhes do aluno.');

        document.getElementById('raiox-nome').textContent = dados.nome;
        document.getElementById('raiox-email').textContent = dados.email || 'E-mail não informado';
        document.getElementById('raiox-nivel').textContent = `Nível ${dados.nivel}`;
        document.getElementById('raiox-progresso').textContent = `${dados.progresso}%`;
        document.getElementById('raiox-licoes').textContent = `${dados.atividades_concluidas}/${dados.total_atividades}`;
        document.getElementById('raiox-xp-semanal').textContent = `${(dados.xp_semanal || 0).toLocaleString('pt-BR')} XP`;
        document.getElementById('raiox-xp-total').textContent = `${(dados.xp_total || 0).toLocaleString('pt-BR')} XP`;
        document.getElementById('raiox-ofensiva').textContent = `🔥 ${dados.ofensiva || 0} dias`;
        document.getElementById('raiox-entrada').textContent = `Aluno ingressou na turma em: ${dados.data_entrada}`;

        const modulosList = document.getElementById('raiox-modulos-lista');
        if (dados.modulos && dados.modulos.length) {
            modulosList.innerHTML = dados.modulos.map(m => {
                const pct = Math.max(0, Math.min(100, Math.round(m.porcentagem || 0)));
                return `
                <div class="raiox-modulo-item">
                    <div class="raiox-modulo-header">
                        <span>${escapeHtml(m.nome)}</span>
                        <strong>${pct}%</strong>
                    </div>
                    <div class="raiox-modulo-bar">
                        <div class="raiox-modulo-fill" style="width:${pct}%"></div>
                    </div>
                    <div class="raiox-modulo-meta">
                        <span>${m.atividades_concluidas} de ${m.total_atividades} lições concluídas</span>
                    </div>
                </div>`;
            }).join('');
        } else {
            modulosList.innerHTML = '<p class="empty-message">Nenhum módulo com progresso registrado para este aluno.</p>';
        }
    } catch (err) {
        document.getElementById('raiox-nome').textContent = 'Erro';
        document.getElementById('raiox-email').textContent = err.message;
    }
}

// ===== BUSCA E FILTROS DE ALUNOS =====
const inputBusca = document.getElementById('busca-aluno');
const btnLimparBusca = document.getElementById('limpar-busca');
const botoesFiltro = document.querySelectorAll('.filter-btn');

if (inputBusca) {
    inputBusca.addEventListener('input', () => {
        termoBusca = inputBusca.value;
        if (btnLimparBusca) {
            btnLimparBusca.style.display = termoBusca ? 'block' : 'none';
        }
        renderTabelaAlunos();
    });
}

if (btnLimparBusca) {
    btnLimparBusca.addEventListener('click', () => {
        inputBusca.value = '';
        termoBusca = '';
        btnLimparBusca.style.display = 'none';
        renderTabelaAlunos();
        inputBusca.focus();
    });
}

botoesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroAtivo = btn.getAttribute('data-filtro') || 'todos';
        renderTabelaAlunos();
    });
});

// ===== MODAL DE NOVO AVISO =====
const modalAviso = document.getElementById('aviso-modal');
const abrirModalAviso = () => {
    if (!modalAviso) return;
    modalAviso.classList.add('open');
    modalAviso.setAttribute('aria-hidden', 'false');
    document.getElementById('aviso-titulo').focus();
};
const fecharModalAviso = () => {
    if (!modalAviso) return;
    modalAviso.classList.remove('open');
    modalAviso.setAttribute('aria-hidden', 'true');
    document.getElementById('aviso-form').reset();
    document.getElementById('aviso-erro').textContent = '';
};

document.getElementById('abrir-aviso')?.addEventListener('click', abrirModalAviso);
document.getElementById('fechar-aviso')?.addEventListener('click', fecharModalAviso);
if (modalAviso) {
    modalAviso.addEventListener('click', event => {
        if (event.target === modalAviso) fecharModalAviso();
    });
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        fecharModalAviso();
        fecharRaioX();
        if (exportMenu) {
            exportMenu.classList.remove('open');
            btnExportarToggle?.setAttribute('aria-expanded', 'false');
        }
    }
});

// Copiar código de convite
document.getElementById('copiar-convite')?.addEventListener('click', async () => {
    const codigo = document.getElementById('codigo-convite').textContent;
    await navigator.clipboard?.writeText(codigo);
    const botao = document.getElementById('copiar-convite');
    botao.textContent = 'Código copiado!';
    setTimeout(() => { botao.textContent = 'Copiar código'; }, 1800);
});

// Envio do formulário de aviso
document.getElementById('aviso-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const erro = document.getElementById('aviso-erro');
    const botao = event.currentTarget.querySelector('button[type="submit"]');
    erro.textContent = '';
    botao.disabled = true;
    botao.textContent = 'Publicando...';
    try {
        const response = await apiFetch(`/api/professor/turmas/${turmaId}/avisos`, {
            method: 'POST',
            body: JSON.stringify({
                titulo: document.getElementById('aviso-titulo').value,
                mensagem: document.getElementById('aviso-mensagem').value
            })
        });
        const dados = await response.json();
        if (!response.ok) throw new Error(dados.erro || 'Não foi possível publicar o aviso.');
        fecharModalAviso();
        carregarTurma();
    } catch (exception) {
        erro.textContent = exception.message;
    } finally {
        botao.disabled = false;
        botao.textContent = 'Publicar aviso';
    }
});

// Carregamento inicial
carregarTurma();
