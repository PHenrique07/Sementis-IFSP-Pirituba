// ===== Painel do Professor — JavaScript =====

// ---- Autenticação: garante que só professores acessam ----
const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || user.tipo !== 'professor') {
    window.location.href = 'login.html';
}

// Preenche nome do professor no header
const profNomeEl = document.getElementById('prof-nome');
if (profNomeEl && user.nome) {
    profNomeEl.textContent = `Olá, ${user.nome}!`;
}

// ---- Helpers de API ----
async function apiFetch(url, options = {}) {
    const defaults = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    const config = { ...defaults, ...options, headers: { ...defaults.headers, ...(options.headers || {}) } };
    const res = await fetch(url, config);
    if (res.status === 401) {
        fazerLogout();
        return null;
    }
    return res;
}

// ---- Logout ----
function fazerLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
window.fazerLogout = fazerLogout;

// =====================================================================
// ESTADO LOCAL
// =====================================================================
let turmasCache = [];

// =====================================================================
// CARREGAR TURMAS
// =====================================================================
async function carregarTurmas() {
    if (typeof showLoading === 'function') showLoading('Carregando Turmas', 'Buscando turmas e dados dos alunos 🌱');
    try {
        const res = await apiFetch('/api/professor/turmas');
        if (!res) return;

        const dados = await res.json();

        if (!res.ok) {
            console.error('Erro ao carregar turmas:', dados);
            return;
        }

        turmasCache = Array.isArray(dados) ? dados : [];
        renderizarTurmas(turmasCache);
    } catch (err) {
        console.error('Erro de conexão ao carregar turmas:', err);
    } finally {
        if (typeof hideLoading === 'function') hideLoading();
    }
}

function renderizarTurmas(turmas) {
    const grid  = document.getElementById('turmas-grid');
    const empty = document.getElementById('prof-empty');
    if (!grid) return;

    grid.innerHTML = '';

    if (turmas.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';

    turmas.forEach((turma, idx) => {
        const card = criarCardTurma(turma, idx);
        grid.appendChild(card);
    });
}

function criarCardTurma(turma, idx) {
    const card = document.createElement('div');
    card.className = 'turma-card';
    card.style.animationDelay = `${idx * 60}ms`;
    card.dataset.turmaId = turma.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `Abrir a turma ${turma.nome}`);

    const nomeLiga = (id) => ({ 1: 'Bronze', 2: 'Prata', 3: 'Ouro', 4: 'Diamante' }[id] || 'Bronze');

    card.innerHTML = `
        <div class="turma-card-nome">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            ${escHtml(turma.nome)}
        </div>

        <div class="turma-codigo-wrapper">
            <div>
                <span class="turma-codigo-label">Código de Convite</span>
                <span class="turma-codigo-valor" id="codigo-${turma.id}">${escHtml(turma.codigo_convite)}</span>
            </div>
            <button class="btn-copiar" id="btn-copiar-${turma.id}" type="button" onclick="event.stopPropagation(); copiarCodigo(${turma.id}, '${escHtml(turma.codigo_convite)}')" title="Copiar código">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar
            </button>
        </div>

        <div class="turma-card-footer">
            <span class="turma-alunos-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                </svg>
                ${turma.total_alunos} aluno${turma.total_alunos !== 1 ? 's' : ''}
            </span>
            <span class="turma-data">Criada em ${turma.data_criacao}</span>
        </div>

        <div style="margin-top:14px;">
            <button class="btn-ver-ranking" type="button" onclick="event.stopPropagation(); abrirTurma(${turma.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Abrir turma
            </button>
        </div>
    `;

    card.addEventListener('click', (event) => {
        if (!event.target.closest('button')) abrirTurma(turma.id);
    });
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            abrirTurma(turma.id);
        }
    });

    return card;
}

function abrirTurma(turmaId) {
    window.location.href = `turma-professor.html?turma=${encodeURIComponent(turmaId)}`;
}
window.abrirTurma = abrirTurma;

// =====================================================================
// COPIAR CÓDIGO
// =====================================================================
window.copiarCodigo = function(turmaId, codigo) {
    if (!navigator.clipboard) {
        // fallback para browsers mais antigos
        const el = document.createElement('input');
        el.value = codigo;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    } else {
        navigator.clipboard.writeText(codigo).catch(() => {});
    }

    const btn = document.getElementById(`btn-copiar-${turmaId}`);
    if (btn) {
        btn.classList.add('copiado');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copiado!
        `;
        setTimeout(() => {
            btn.classList.remove('copiado');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar
            `;
        }, 2500);
    }
};

// =====================================================================
// MODAL: NOVA TURMA
// =====================================================================
const modalNovaTurma     = document.getElementById('modal-nova-turma');
const btnNovaTurma       = document.getElementById('btn-nova-turma');
const btnNovaTurmaClose  = document.getElementById('modal-nova-turma-close');
const inputNomeTurma     = document.getElementById('input-nome-turma');
const btnCriarTurma      = document.getElementById('btn-criar-turma');
const btnCriarText       = document.getElementById('btn-criar-text');
const btnCriarSpinner    = document.getElementById('btn-criar-spinner');
const msgNovaTurma       = document.getElementById('modal-nova-turma-msg');

if (btnNovaTurma) btnNovaTurma.addEventListener('click', () => abrirModalNovaTurma());
if (btnNovaTurmaClose) btnNovaTurmaClose.addEventListener('click', () => fecharModalNovaTurma());
if (modalNovaTurma) {
    modalNovaTurma.addEventListener('click', (e) => { if (e.target === modalNovaTurma) fecharModalNovaTurma(); });
}
if (inputNomeTurma) {
    inputNomeTurma.addEventListener('keydown', (e) => { if (e.key === 'Enter') criarTurma(); });
    inputNomeTurma.addEventListener('input', () => limparMsg(msgNovaTurma));
}
if (btnCriarTurma) btnCriarTurma.addEventListener('click', () => criarTurma());

function abrirModalNovaTurma() {
    if (!modalNovaTurma) return;
    if (inputNomeTurma) inputNomeTurma.value = '';
    limparMsg(msgNovaTurma);
    modalNovaTurma.classList.add('open');
    setTimeout(() => inputNomeTurma && inputNomeTurma.focus(), 150);
}

function fecharModalNovaTurma() {
    if (modalNovaTurma) modalNovaTurma.classList.remove('open');
    setLoadingBtn(btnCriarText, btnCriarSpinner, btnCriarTurma, false, 'Criar Turma');
}

async function criarTurma() {
    const nome = inputNomeTurma ? inputNomeTurma.value.trim() : '';
    if (!nome || nome.length < 2) {
        setMsg(msgNovaTurma, 'O nome da turma precisa ter pelo menos 2 caracteres.', 'erro');
        return;
    }

    setLoadingBtn(btnCriarText, btnCriarSpinner, btnCriarTurma, true);
    limparMsg(msgNovaTurma);

    try {
        const res = await apiFetch('/api/professor/turmas', {
            method: 'POST',
            body: JSON.stringify({ nome })
        });
        if (!res) return;

        const dados = await res.json();

        if (res.ok) {
            turmasCache.unshift(dados);
            renderizarTurmas(turmasCache);
            fecharModalNovaTurma();
        } else {
            setMsg(msgNovaTurma, dados.mensagem || dados.erro || 'Erro ao criar turma.', 'erro');
        }
    } catch (err) {
        console.error(err);
        setMsg(msgNovaTurma, 'Erro de conexão. Tente novamente.', 'erro');
    } finally {
        setLoadingBtn(btnCriarText, btnCriarSpinner, btnCriarTurma, false, 'Criar Turma');
    }
}

// =====================================================================
// MODAL: RANKING DA TURMA
// =====================================================================
const modalRanking      = document.getElementById('modal-ranking');
const modalRankingClose = document.getElementById('modal-ranking-close');
const rankingTitle      = document.getElementById('modal-ranking-title');
const rankingSubtitle   = document.getElementById('modal-ranking-subtitle');
const rankingTbody      = document.getElementById('ranking-tbody');
const rankingEmpty      = document.getElementById('ranking-empty');

if (modalRankingClose) modalRankingClose.addEventListener('click', () => fecharRanking());
if (modalRanking) {
    modalRanking.addEventListener('click', (e) => { if (e.target === modalRanking) fecharRanking(); });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalNovaTurma();
        fecharRanking();
    }
});

window.abrirRanking = async function(turmaId, turmaNome) {
    if (!modalRanking) return;

    // Abre o modal com skeleton
    if (rankingTitle) rankingTitle.textContent = turmaNome;
    if (rankingSubtitle) rankingSubtitle.textContent = 'Carregando ranking...';
    if (rankingEmpty) rankingEmpty.style.display = 'none';
    if (rankingTbody) {
        rankingTbody.innerHTML = Array(4).fill(`
            <tr class="skeleton-row">
                <td><div class="skeleton-bar" style="width:24px"></div></td>
                <td><div class="skeleton-bar" style="width:140px"></div></td>
                <td><div class="skeleton-bar" style="width:70px"></div></td>
                <td><div class="skeleton-bar" style="width:50px"></div></td>
                <td><div class="skeleton-bar" style="width:60px"></div></td>
            </tr>
        `).join('');
    }

    modalRanking.classList.add('open');

    try {
        const res = await apiFetch(`/api/professor/turmas/${turmaId}/alunos`);
        if (!res) return;

        const dados = await res.json();

        if (!res.ok) {
            if (rankingSubtitle) rankingSubtitle.textContent = 'Erro ao carregar ranking.';
            if (rankingTbody) rankingTbody.innerHTML = '';
            return;
        }

        const alunos = dados.alunos || [];
        if (rankingSubtitle) rankingSubtitle.textContent = `${alunos.length} aluno${alunos.length !== 1 ? 's' : ''} • XP desta semana`;

        if (rankingTbody) {
            if (alunos.length === 0) {
                rankingTbody.innerHTML = '';
                if (rankingEmpty) rankingEmpty.style.display = 'block';
            } else {
                if (rankingEmpty) rankingEmpty.style.display = 'none';
                rankingTbody.innerHTML = alunos.map(a => renderLinhaRanking(a)).join('');
            }
        }
    } catch (err) {
        console.error('Erro ao carregar ranking:', err);
        if (rankingSubtitle) rankingSubtitle.textContent = 'Erro de conexão.';
        if (rankingTbody) rankingTbody.innerHTML = '';
    }
};

function fecharRanking() {
    if (modalRanking) modalRanking.classList.remove('open');
}

function renderLinhaRanking(aluno) {
    const posClass  = aluno.posicao <= 3 ? `pos-${aluno.posicao}` : '';
    const medalha   = { 1: '🥇', 2: '🥈', 3: '🥉' }[aluno.posicao] || aluno.posicao;
    const iniciais  = aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const ligaNomes = { 1: 'Bronze', 2: 'Prata', 3: 'Ouro', 4: 'Diamante' };
    const ligaNome  = ligaNomes[aluno.liga_id] || 'Bronze';
    const ligaClass = `liga-${aluno.liga_id || 1}`;

    return `
        <tr>
            <td><span class="rank-pos ${posClass}">${medalha}</span></td>
            <td>
                <div class="rank-aluno">
                    <div class="rank-avatar">${iniciais}</div>
                    <div>
                        <div class="rank-nome">${escHtml(aluno.nome)}</div>
                        <div class="rank-nivel">Nível ${aluno.nivel}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="rank-xp">
                    ⚡ ${aluno.xp_semanal.toLocaleString('pt-BR')} XP
                </span>
            </td>
            <td>
                <span class="rank-ofensiva">
                    🔥 ${aluno.ofensiva}d
                </span>
            </td>
            <td><span class="liga-badge ${ligaClass}">${ligaNome}</span></td>
        </tr>
    `;
}

// =====================================================================
// UTILITÁRIOS
// =====================================================================
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setMsg(el, texto, tipo = 'erro') {
    if (!el) return;
    el.textContent = texto;
    el.className = `modal-msg modal-msg--${tipo}`;
}

function limparMsg(el) {
    if (!el) return;
    el.textContent = '';
    el.className = 'modal-msg';
}

function setLoadingBtn(textEl, spinnerEl, btn, on, labelOff = '') {
    if (!textEl || !spinnerEl || !btn) return;
    textEl.style.display    = on ? 'none' : 'inline';
    spinnerEl.style.display = on ? 'block' : 'none';
    btn.disabled            = on;
    if (!on && labelOff) textEl.textContent = labelOff;
}

// =====================================================================
// SEMENTIS LIVE (ARENA MULTIPLAYER AO VIVO — ESTILO KAHOOT)
// =====================================================================
let topicosLiveCache = [];
let topicoSelecionadoLive = 'todos';

function trocarAbaPainel(aba) {
    const viewTurmas = document.getElementById('view-turmas');
    const viewLive   = document.getElementById('view-live');
    const btnTurmas  = document.getElementById('nav-btn-turmas');
    const btnLive    = document.getElementById('nav-btn-live');

    if (aba === 'live') {
        if (viewTurmas) viewTurmas.style.display = 'none';
        if (viewLive)   viewLive.style.display   = 'block';
        if (btnTurmas)  btnTurmas.classList.remove('active');
        if (btnLive)    btnLive.classList.add('active');
        carregarTopicosLive();
        carregarSalasRecentesLive();
    } else {
        if (viewTurmas) viewTurmas.style.display = 'block';
        if (viewLive)   viewLive.style.display   = 'none';
        if (btnTurmas)  btnTurmas.classList.add('active');
        if (btnLive)    btnLive.classList.remove('active');
    }
}
window.trocarAbaPainel = trocarAbaPainel;

async function carregarTopicosLive() {
    try {
        const res = await apiFetch('/api/live/topicos');
        if (!res) return;
        topicosLiveCache = await res.json();
        renderizarTopicosLive(topicosLiveCache);
        renderizarTopicosModal(topicosLiveCache);
    } catch (err) {
        console.error('Erro ao carregar tópicos live:', err);
    }
}

function renderizarTopicosLive(topicos) {
    const grid = document.getElementById('live-topics-grid');
    if (!grid) return;

    grid.innerHTML = '';
    topicos.forEach(topico => {
        const card = document.createElement('div');
        card.className = 'topic-quick-card';
        card.onclick = () => abrirModalLive(topico.id);
        card.innerHTML = `
            <div class="topic-quick-icon">${topico.icone}</div>
            <div class="topic-quick-info">
                <h4>${topico.titulo}</h4>
                <p>${topico.descricao}</p>
                <span class="topic-count-tag">${topico.total_questoes} questões disponíveis</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderizarTopicosModal(topicos) {
    const grid = document.getElementById('modal-topics-grid');
    if (!grid) return;

    grid.innerHTML = '';
    topicos.forEach(topico => {
        const chip = document.createElement('div');
        chip.className = `modal-topic-chip ${topico.id === topicoSelecionadoLive ? 'selected' : ''}`;
        chip.dataset.id = topico.id;
        chip.onclick = () => selecionarTopicoModal(topico.id);
        chip.innerHTML = `
            <span class="modal-topic-chip-icon">${topico.icone}</span>
            <div>
                <div class="modal-topic-chip-name">${topico.titulo}</div>
                <small style="color:#9999c0; font-size:11px;">${topico.total_questoes} q.</small>
            </div>
        `;
        grid.appendChild(chip);
    });
}

function selecionarTopicoModal(id) {
    topicoSelecionadoLive = id;
    document.querySelectorAll('.modal-topic-chip').forEach(chip => {
        chip.classList.toggle('selected', chip.dataset.id === id);
    });
}
window.selecionarTopicoModal = selecionarTopicoModal;

function abrirModalLive(topicoId = null) {
    if (topicoId) {
        topicoSelecionadoLive = topicoId;
    }
    if (topicosLiveCache.length === 0) {
        carregarTopicosLive();
    } else {
        renderizarTopicosModal(topicosLiveCache);
    }

    const modal = document.getElementById('modal-criar-live');
    const msgEl = document.getElementById('modal-criar-live-msg');
    const inputNome = document.getElementById('input-nome-live');

    if (msgEl) limparMsg(msgEl);
    if (inputNome) inputNome.value = '';

    if (modal) {
        modal.classList.add('open', 'active');
        if (inputNome) setTimeout(() => inputNome.focus(), 150);
    }
}
window.abrirModalLive = abrirModalLive;

function fecharModalLive() {
    const modal = document.getElementById('modal-criar-live');
    if (modal) modal.classList.remove('open', 'active');
    const spinner = document.getElementById('btn-live-spinner');
    const btn = document.getElementById('btn-confirmar-criar-live');
    if (spinner) spinner.style.display = 'none';
    if (btn) btn.disabled = false;
}
window.fecharModalLive = fecharModalLive;

// Evento para fechar modal ao clicar no fundo
const modalCriarLiveEl = document.getElementById('modal-criar-live');
if (modalCriarLiveEl) {
    modalCriarLiveEl.addEventListener('click', (e) => {
        if (e.target === modalCriarLiveEl) fecharModalLive();
    });
}

async function executarCriacaoSalaLive() {
    const inputNome = document.getElementById('input-nome-live');
    const selectQtd = document.getElementById('select-qtd-questoes');
    const selectTempo = document.getElementById('select-tempo-questao');
    const msgEl = document.getElementById('modal-criar-live-msg');
    const btn = document.getElementById('btn-confirmar-criar-live');
    const spinner = document.getElementById('btn-live-spinner');

    const nome = (inputNome ? inputNome.value : '').trim();
    const qtd_perguntas = parseInt(selectQtd ? selectQtd.value : 5);
    const tempo_por_pergunta = parseInt(selectTempo ? selectTempo.value : 20);

    limparMsg(msgEl);
    if (spinner) spinner.style.display = 'block';
    if (btn) btn.disabled = true;
    if (typeof showLoading === 'function') showLoading('Criando Sala ao Vivo', 'Preparando o telão e sorteando perguntas sustentáveis ⚡');

    try {
        const res = await apiFetch('/api/live/criar-sala', {
            method: 'POST',
            body: JSON.stringify({
                nome: nome || undefined,
                topico: topicoSelecionadoLive,
                qtd_perguntas,
                tempo_por_pergunta
            })
        });

        if (!res) {
            if (typeof hideLoading === 'function') hideLoading();
            setMsg(msgEl, 'Erro de autenticação. Faça login novamente.');
            if (spinner) spinner.style.display = 'none';
            if (btn) btn.disabled = false;
            return;
        }

        const dados = await res.json();
        if (!res.ok) {
            if (typeof hideLoading === 'function') hideLoading();
            setMsg(msgEl, dados.erro || 'Erro ao criar sala temporária.');
            if (spinner) spinner.style.display = 'none';
            if (btn) btn.disabled = false;
            return;
        }

        // Redireciona imediatamente para o Telão do Apresentador!
        fecharModalLive();
        window.location.href = `live-host.html?pin=${dados.pin}`;
    } catch (err) {
        if (typeof hideLoading === 'function') hideLoading();
        console.error('Erro ao criar sala live:', err);
        setMsg(msgEl, 'Erro de conexão com o servidor.');
        if (spinner) spinner.style.display = 'none';
        if (btn) btn.disabled = false;
    }
}
window.executarCriacaoSalaLive = executarCriacaoSalaLive;

async function carregarSalasRecentesLive() {
    const list = document.getElementById('live-recent-list');
    if (!list) return;

    try {
        const res = await apiFetch('/api/live/minhas-salas');
        if (!res) return;
        const salas = await res.json();

        if (!Array.isArray(salas) || salas.length === 0) {
            list.innerHTML = `
                <div class="live-recent-empty">
                    <p>Nenhuma sala ao vivo ativa no momento. Crie uma nova sala para começar!</p>
                </div>
            `;
            return;
        }

        list.innerHTML = '';
        salas.forEach(sala => {
            const item = document.createElement('div');
            item.className = 'live-recent-item';
            item.innerHTML = `
                <div class="live-recent-info">
                    <h4>${escHtml(sala.nome)}</h4>
                    <span>PIN: <strong style="color:var(--color-accent); font-family:monospace; font-size:16px;">${sala.pin}</strong> • ${sala.total_participantes} alunos • Status: ${sala.status}</span>
                </div>
                <a href="live-host.html?pin=${sala.pin}" class="btn-ver-ranking" style="padding:10px 18px;">
                    Abrir Telão 📺
                </a>
            `;
            list.appendChild(item);
        });
    } catch (e) {
        console.error('Erro ao carregar salas recentes:', e);
    }
}

// Fechar modal ao clicar fora ou com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalLive();
    }
});

// =====================================================================
// INICIALIZAÇÃO
// =====================================================================
carregarTurmas();
carregarTopicosLive();

