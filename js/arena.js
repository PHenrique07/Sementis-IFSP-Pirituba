// ===================================================================
// SEMENTIS ARENA — JOGADOR / ALUNO (ARENA JAVASCRIPT)
// ===================================================================

const AVATARES = [
    { id: "broto", emoji: "🌱", nome: "Broto" },
    { id: "gota", emoji: "💧", nome: "Gota" },
    { id: "sol", emoji: "☀️", nome: "Sol" },
    { id: "folha", emoji: "🍃", nome: "Folha" },
    { id: "flor", emoji: "🌻", nome: "Flor" },
    { id: "arvore", emoji: "🌳", nome: "Árvore" },
    { id: "tartaruga", emoji: "🐢", nome: "Tartaruga" },
    { id: "abelha", emoji: "🐝", nome: "Abelha" },
    { id: "passaro", emoji: "🦜", nome: "Arara" },
    { id: "raio", emoji: "⚡", nome: "Raio" },
    { id: "planeta", emoji: "🌍", nome: "Terra" },
    { id: "reciclagem", emoji: "♻️", nome: "Eco" }
];

// SVGs inline temáticos para resultado da rodada
const SVG_CORRETO = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#a9ff71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const SVG_ERRADO  = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

// SVGs para troféus do pódio
const SVG_TROPHY = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2"/><path d="M8 22v-4m8 4v-4M5 22h14"/></svg>`;
const SVG_MEDAL_SILVER = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
const SVG_MEDAL_BRONZE = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cd7f32" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
const SVG_LEAF_FINISH = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#a9ff71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;

// Estado Local
let avatarSelecionado = "broto";
let jogadorAtual = null; // { jogador_id, pin, nome, avatar }
let estadoSala = null;
let pollTimer = null;
let tempoInicioPerguntaMs = 0;
let indicePerguntaAtual = -1;
let respostaEnviadaNestaRodada = false;

// ===================================================================
// INICIALIZAÇÃO & SELEÇÃO DE AVATAR
// ===================================================================
function init() {
    renderizarSeletorAvatares();
    preencherDadosIniciais();

    // Recupera sessão ativa se existir
    const salvo = sessionStorage.getItem('sementis_live_player');
    if (salvo) {
        try {
            jogadorAtual = JSON.parse(salvo);
            iniciarSincronizacao();
        } catch (e) {
            sessionStorage.removeItem('sementis_live_player');
        }
    }
}

function renderizarSeletorAvatares() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;

    grid.innerHTML = '';
    AVATARES.forEach(av => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `avatar-option-btn ${av.id === avatarSelecionado ? 'selected' : ''}`;
        btn.dataset.id = av.id;
        btn.textContent = av.emoji;
        btn.title = av.nome;
        btn.onclick = () => selecionarAvatar(av.id);
        grid.appendChild(btn);
    });
}

function selecionarAvatar(id) {
    avatarSelecionado = id;
    document.querySelectorAll('.avatar-option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.id === id);
    });
}

function preencherDadosIniciais() {
    const urlParams = new URLSearchParams(window.location.search);
    const pinParam = urlParams.get('pin');
    if (pinParam) {
        const pinInput = document.getElementById('input-pin');
        if (pinInput) pinInput.value = pinParam.trim();
    }

    // Se o aluno já estiver logado no Sementis, preenche o apelido
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user.nome) {
                const nickInput = document.getElementById('input-nickname');
                if (nickInput) nickInput.value = user.nome.split(' ')[0];
            }
        } catch (e) {}
    }
}

// ===================================================================
// ENTRAR NA SALA
// ===================================================================
async function entrarNaSala(e) {
    e.preventDefault();
    const pin = (document.getElementById('input-pin').value || '').trim().replace(/\s+/g, '');
    const nome = (document.getElementById('input-nickname').value || '').trim();
    const errorEl = document.getElementById('join-error-msg');
    const submitBtn = document.getElementById('btn-join-submit');

    if (!pin || pin.length < 4) {
        errorEl.textContent = 'Digite o PIN de 6 dígitos da sala!';
        return;
    }
    if (!nome) {
        errorEl.textContent = 'Digite seu nome ou apelido!';
        return;
    }

    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Entrando...</span>';

    // Recupera usuario_id se estiver logado
    let usuario_id = null;
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) usuario_id = user.id;
    } catch (err) {}

    try {
        const res = await fetch(`${API_BASE_URL}/api/live/entrar`, {
    credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pin,
                nome,
                usuario_id,
                avatar_id: avatarSelecionado
            })
        });

        const dados = await res.json();
        if (!res.ok) {
            errorEl.textContent = dados.erro || 'Erro ao entrar na sala.';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Entrar na Arena!</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
            return;
        }

        jogadorAtual = dados;
        sessionStorage.setItem('sementis_live_player', JSON.stringify(dados));
        iniciarSincronizacao();
    } catch (err) {
        console.error('Erro ao entrar na sala:', err);
        errorEl.textContent = 'Erro de conexão com o servidor.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Entrar na Arena!</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    }
}
window.entrarNaSala = entrarNaSala;

// ===================================================================
// SINCRONIZAÇÃO EM TEMPO REAL (POLLING)
// ===================================================================
function iniciarSincronizacao() {
    if (!jogadorAtual) return;

    // Exibe topbar
    const topbar = document.getElementById('arena-topbar');
    if (topbar) topbar.style.display = 'flex';

    const avatarEl = document.getElementById('topbar-avatar');
    if (avatarEl && jogadorAtual.avatar) avatarEl.textContent = jogadorAtual.avatar.emoji;

    const nomeEl = document.getElementById('topbar-nome');
    if (nomeEl) nomeEl.textContent = jogadorAtual.nome;

    syncEstado();
    clearInterval(pollTimer);
    pollTimer = setInterval(syncEstado, 1000);
}

async function syncEstado() {
    if (!jogadorAtual) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/live/sala/${jogadorAtual.pin}/estado?jogador_id=${jogadorAtual.jogador_id}`);
        if (!res.ok) {
            console.warn('Sala não encontrada ou encerrada.');
            return;
        }

        const dados = await res.json();
        atualizarTelaJogador(dados);
    } catch (err, { credentials: 'include' }) {
        console.error('Erro de sincronização da Arena:', err);
    }
}

function atualizarTelaJogador(dados) {
    estadoSala = dados;

    // Atualiza Topbar
    if (dados.meu_status) {
        const pontosEl = document.getElementById('topbar-pontos');
        if (pontosEl) pontosEl.textContent = `${dados.meu_status.pontos.toLocaleString()} pts`;

        const rankEl = document.getElementById('topbar-rank');
        if (rankEl) rankEl.textContent = `#${dados.meu_status.posicao}`;
    }

    // Controle de Telas
    if (dados.status === 'lobby') {
        mostrarTela('waiting-lobby');
        const titleEl = document.getElementById('waiting-player-title');
        if (titleEl) titleEl.textContent = `Você está dentro, ${jogadorAtual.nome}!`;

        const roomSub = document.getElementById('waiting-room-subtitle');
        if (roomSub) roomSub.textContent = `Sala: ${dados.nome}`;

        const emj = document.getElementById('waiting-avatar-emoji');
        if (emj && jogadorAtual.avatar) emj.textContent = jogadorAtual.avatar.emoji;

    } else if (dados.status === 'pergunta') {
        if (indicePerguntaAtual !== dados.indice_pergunta) {
            indicePerguntaAtual = dados.indice_pergunta;
            respostaEnviadaNestaRodada = false;
            tempoInicioPerguntaMs = Date.now();
        }

        if (respostaEnviadaNestaRodada || (dados.meu_status && dados.meu_status.ja_respondeu)) {
            mostrarTela('submitted');
        } else {
            mostrarTela('answering');
            renderizarBotoesResposta(dados);
        }

    } else if (dados.status === 'resultado' || dados.status === 'ranking') {
        mostrarTela('round-result');
        renderizarResultadoRodada(dados);

    } else if (dados.status === 'finalizado') {
        mostrarTela('final-podium');
        renderizarPodioFinal(dados);
    }
}

function mostrarTela(screenId) {
    const telas = ['join', 'waiting-lobby', 'answering', 'submitted', 'round-result', 'final-podium'];
    telas.forEach(id => {
        const el = document.getElementById(`screen-${id}`);
        if (el) el.style.display = (id === screenId) ? 'flex' : 'none';
    });
}

// ===================================================================
// RENDERIZAÇÃO DAS TELAS
// ===================================================================
function renderizarBotoesResposta(dados) {
    const counterEl = document.getElementById('answering-counter');
    if (counterEl) counterEl.textContent = `Pergunta ${dados.numero_pergunta} de ${dados.total_perguntas}`;

    const timerEl = document.getElementById('answering-timer');
    if (timerEl) timerEl.textContent = `${dados.tempo_restante}s`;

    // Exibe o enunciado da pergunta na tela do aluno
    const questionEl = document.getElementById('arena-question-text');
    if (questionEl && dados.questao && dados.questao.pergunta) {
        questionEl.textContent = dados.questao.pergunta;
    }

    if (dados.questao && dados.questao.opcoes) {
        dados.questao.opcoes.forEach((op, idx) => {
            const btn = document.getElementById(`tactile-btn-${idx}`);
            const text = document.getElementById(`tactile-text-${idx}`);
            if (btn) btn.disabled = false;
            if (text) text.textContent = op.texto;
        });
    }
}

async function enviarResposta(opcaoIndex) {
    if (!jogadorAtual || respostaEnviadaNestaRodada) return;

    respostaEnviadaNestaRodada = true;
    const tempoGastoMs = Math.max(500, Date.now() - tempoInicioPerguntaMs);

    // Efeito tátil de vibração se suportado no celular
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    // Desativa botões imediatamente
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`tactile-btn-${i}`);
        if (btn) btn.disabled = true;
    }

    mostrarTela('submitted');

    try {
        await fetch(`${API_BASE_URL}/api/live/sala/${jogadorAtual.pin}/responder`, {
    credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jogador_id: jogadorAtual.jogador_id,
                opcao: opcaoIndex,
                tempo_ms: tempoGastoMs
            })
        });
    } catch (err) {
        console.error('Erro ao enviar resposta:', err);
    }
}
window.enviarResposta = enviarResposta;

function renderizarResultadoRodada(dados) {
    const card = document.getElementById('round-result-card');
    const iconEl = document.getElementById('round-result-icon');
    const titleEl = document.getElementById('round-result-title');
    const pointsEl = document.getElementById('round-points-gain');
    const streakEl = document.getElementById('round-streak-pill');
    const streakTextEl = document.getElementById('streak-text');
    const rankEl = document.getElementById('round-rank-val');

    const minhaResp = dados.minha_resposta;
    const meuStatus = dados.meu_status;

    if (!card) return;

    if (minhaResp && minhaResp.correta) {
        card.className = 'round-result-card correct';
        iconEl.innerHTML = SVG_CORRETO;
        titleEl.textContent = 'RESPOSTA CORRETA!';
        pointsEl.textContent = `+${minhaResp.pontos_ganhos || 0} pts`;
        pointsEl.style.display = 'block';

        if (meuStatus && meuStatus.streak >= 2) {
            if (streakTextEl) streakTextEl.textContent = `${meuStatus.streak} acertos seguidos!`;
            streakEl.style.display = 'inline-flex';
        } else {
            streakEl.style.display = 'none';
        }
    } else {
        card.className = 'round-result-card wrong';
        iconEl.innerHTML = SVG_ERRADO;
        titleEl.textContent = 'NÃO FOI DESSA VEZ';
        pointsEl.style.display = 'none';
        streakEl.style.display = 'none';
    }

    if (rankEl && meuStatus) {
        rankEl.textContent = `#${meuStatus.posicao} Lugar (${meuStatus.pontos.toLocaleString()} pts)`;
    }
}

function renderizarPodioFinal(dados) {
    clearInterval(pollTimer);

    const meuStatus = dados.meu_status;
    const placeEl = document.getElementById('final-place-val');
    const scoreEl = document.getElementById('final-score-val');
    const trophyEl = document.getElementById('final-trophy-icon');

    if (meuStatus) {
        if (placeEl) placeEl.textContent = `${meuStatus.posicao}º Lugar`;
        if (scoreEl) scoreEl.textContent = `${meuStatus.pontos.toLocaleString()} pts`;

        if (trophyEl) {
            if (meuStatus.posicao === 1) {
                trophyEl.innerHTML = SVG_TROPHY;
                dispararConfetesAluno();
            } else if (meuStatus.posicao === 2) {
                trophyEl.innerHTML = SVG_MEDAL_SILVER;
                dispararConfetesAluno();
            } else if (meuStatus.posicao === 3) {
                trophyEl.innerHTML = SVG_MEDAL_BRONZE;
                dispararConfetesAluno();
            } else {
                trophyEl.innerHTML = SVG_LEAF_FINISH;
            }
        }
    }

    sessionStorage.removeItem('sementis_live_player');
}

function dispararConfetesAluno() {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#a9ff71', '#7ce048', '#4a7c4e'] });
    }
}

// Inicia no carregamento do DOM
document.addEventListener('DOMContentLoaded', init);
