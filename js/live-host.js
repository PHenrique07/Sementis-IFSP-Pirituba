// ===================================================================
// SEMENTIS LIVE — APRESENTADOR (HOST JAVASCRIPT)
// ===================================================================

const urlParams = new URLSearchParams(window.location.search);
const pin = (urlParams.get('pin') || '').trim();
const token = localStorage.getItem('token') || urlParams.get('token') || '';

if (!pin) {
    alert('Código PIN da sala não encontrado na URL!');
    window.location.href = 'painel-professor.html';
}

// Estado Local
let salaAtual = null;
let pollTimer = null;
let countdownTimer = null;
let segundosRestantes = 0;
let somAtivado = true;
let audioCtx = null;
let jaDisparouConfetes = false;
let botsRespostasDisparadas = false;

// ===================================================================
// SINTETIZADOR DE ÁUDIO (WEB AUDIO API)
// ===================================================================
function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
    if (!somAtivado) return;
    try {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Erro ao tocar som:', e);
    }
}

function playTick()        { playTone(800, 'triangle', 0.08, 0.1); }
function playDangerTick()  { playTone(1200, 'square', 0.1, 0.15); }

function playTimesUp() {
    if (!somAtivado) return;
    try {
        initAudio();
        if (!audioCtx) return;
        playTone(400, 'sine', 0.3, 0.2);
        setTimeout(() => playTone(300, 'sine', 0.5, 0.25), 180);
    } catch (e) {}
}

function playCorrectReveal() {
    if (!somAtivado) return;
    try {
        initAudio();
        if (!audioCtx) return;
        playTone(523.25, 'triangle', 0.15, 0.2);
        setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.2), 120);
        setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.25), 240);
    } catch (e) {}
}

function playRankSwoosh() {
    if (!somAtivado) return;
    try {
        initAudio();
        if (!audioCtx) return;
        playTone(440, 'sine', 0.1, 0.15);
        setTimeout(() => playTone(880, 'triangle', 0.2, 0.2), 80);
    } catch (e) {}
}

function playPodiumFanfare() {
    if (!somAtivado) return;
    try {
        initAudio();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, idx) => {
            setTimeout(() => playTone(n, 'triangle', 0.3, 0.25), idx * 160);
        });
    } catch (e) {}
}

function toggleSound() {
    somAtivado = !somAtivado;
    const svgOn  = document.getElementById('sound-svg-on');
    const svgOff = document.getElementById('sound-svg-off');
    if (svgOn)  svgOn.style.display  = somAtivado ? 'block' : 'none';
    if (svgOff) svgOff.style.display = somAtivado ? 'none'  : 'block';
    mostrarToast(somAtivado ? 'Som ativado' : 'Som silenciado');
}
window.toggleSound = toggleSound;

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn('Tela cheia indisponível:', err);
        });
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}
window.toggleFullscreen = toggleFullscreen;

// ===================================================================
// API FETCH HELPER
// ===================================================================
async function apiPost(endpoint, body = {}) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (err) {
        console.error('Erro na requisição POST:', err);
        return { erro: 'Erro de conexão com o servidor.' };
    }
}

// ===================================================================
// SINCRONIZAÇÃO EM TEMPO REAL (POLLING)
// ===================================================================
async function syncEstadoSala() {
    try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/api/live/sala/${pin}/estado?is_host=1&token=${token}`, { headers });
        if (!res.ok) {
            console.warn('Erro ao sincronizar estado da sala:', res.status);
            return;
        }
        const dados = await res.json();
        atualizarInterface(dados);
    } catch (err) {
        console.error('Erro no polling do telão:', err);
    }
}

function atualizarInterface(dados) {
    const estadoAnterior = salaAtual ? salaAtual.status : null;
    salaAtual = dados;

    // Atualiza Topbar
    const pinBadge = document.getElementById('topbar-pin-val');
    if (pinBadge) pinBadge.textContent = dados.pin;

    const titleEl = document.getElementById('topbar-room-title');
    if (titleEl && dados.nome) titleEl.textContent = dados.nome;

    const joinUrlEl = document.getElementById('join-url-display');
    if (joinUrlEl) joinUrlEl.textContent = `${window.location.host}/arena`;

    // Se mudou de tela
    if (estadoAnterior !== dados.status) {
        mostrarTela(dados.status);
    }

    // Atualização específica de cada tela
    if (dados.status === 'lobby') {
        renderizarLobby(dados);
    } else if (dados.status === 'pergunta') {
        renderizarPergunta(dados);
    } else if (dados.status === 'resultado') {
        renderizarResultado(dados);
    } else if (dados.status === 'ranking') {
        renderizarRanking(dados);
    } else if (dados.status === 'finalizado') {
        renderizarPodio(dados);
    }
}

function mostrarTela(status) {
    const telas = ['lobby', 'question', 'result', 'ranking', 'podium'];
    const mapaStatusParaTela = {
        'lobby':      'screen-lobby',
        'pergunta':   'screen-question',
        'resultado':  'screen-result',
        'ranking':    'screen-ranking',
        'finalizado': 'screen-podium'
    };

    telas.forEach(t => {
        const el = document.getElementById(`screen-${t}`);
        if (el) el.style.display = 'none';
    });

    const telaAtiva = document.getElementById(mapaStatusParaTela[status]);
    if (telaAtiva) telaAtiva.style.display = 'flex';

    if (status === 'pergunta') {
        botsRespostasDisparadas = false;
        iniciarCronometro(salaAtual ? salaAtual.tempo_por_pergunta : 20);
    } else if (status === 'resultado') {
        playCorrectReveal();
    } else if (status === 'ranking') {
        playRankSwoosh();
    } else if (status === 'finalizado' && !jaDisparouConfetes) {
        jaDisparouConfetes = true;
        dispararConfetesPodio();
        playPodiumFanfare();
    }
}

// ===================================================================
// 1. RENDERIZAR LOBBY
// ===================================================================
function renderizarLobby(dados) {
    const boxesContainer = document.getElementById('lobby-pin-boxes');
    if (boxesContainer && boxesContainer.children.length === 0) {
        boxesContainer.innerHTML = '';
        dados.pin.split('').forEach(d => {
            const box = document.createElement('div');
            box.className = 'pin-digit-box';
            box.textContent = d;
            boxesContainer.appendChild(box);
        });
    }

    const countText = document.getElementById('lobby-count-text');
    if (countText) {
        const total = dados.total_participantes || 0;
        countText.textContent = `${total} ${total === 1 ? 'Aluno conectado' : 'Alunos conectados'}`;
    }

    const grid = document.getElementById('lobby-players-grid');
    const emptyHint = document.getElementById('lobby-empty-hint');
    if (!grid) return;

    if (!dados.participantes_lista || dados.participantes_lista.length === 0) {
        if (emptyHint) emptyHint.style.display = 'block';
        return;
    }

    if (emptyHint) emptyHint.style.display = 'none';

    const idsExistentes = Array.from(grid.querySelectorAll('.player-chip')).map(el => el.dataset.id);
    dados.participantes_lista.forEach(p => {
        if (!idsExistentes.includes(p.id)) {
            const chip = document.createElement('div');
            chip.className = 'player-chip';
            chip.dataset.id = p.id;
            chip.innerHTML = `
                <span class="player-chip-emoji">${p.avatar ? p.avatar.emoji : '🌱'}</span>
                <span>${p.nome}</span>
            `;
            grid.appendChild(chip);
            playTone(600, 'sine', 0.08, 0.1);
        }
    });
}

// ===================================================================
// 2. RENDERIZAR PERGUNTA ATIVA
// ===================================================================
function renderizarPergunta(dados) {
    if (!dados.questao) return;

    const qCounter = document.getElementById('q-counter');
    if (qCounter) qCounter.textContent = `Pergunta ${dados.numero_pergunta} de ${dados.total_perguntas}`;

    const qTopic = document.getElementById('q-topic-badge');
    if (qTopic) qTopic.textContent = dados.questao.tema || 'Sustentabilidade';

    const qText = document.getElementById('question-text');
    if (qText) qText.textContent = dados.questao.pergunta;

    const ansCount = document.getElementById('answers-received-count');
    if (ansCount) ansCount.textContent = dados.total_respostas || 0;

    dados.questao.opcoes.forEach((op, idx) => {
        const textEl = document.getElementById(`opt-text-${idx}`);
        if (textEl) textEl.textContent = op.texto;

        const card = document.querySelector(`.option-card[data-index="${idx}"]`);
        if (card) card.classList.remove('correct-answer', 'dimmed');

        const barCnt = document.getElementById(`bar-cnt-${idx}`);
        if (barCnt) barCnt.style.display = 'none';
    });
}

function iniciarCronometro(segundosTotais) {
    clearInterval(countdownTimer);
    segundosRestantes = segundosTotais;
    atualizarCirculoTimer(segundosRestantes, segundosTotais);

    countdownTimer = setInterval(() => {
        segundosRestantes--;
        atualizarCirculoTimer(segundosRestantes, segundosTotais);

        if (segundosRestantes <= 5 && segundosRestantes > 0) {
            playDangerTick();
        } else if (segundosRestantes > 5) {
            playTick();
        }

        if (segundosRestantes <= 0) {
            clearInterval(countdownTimer);
            playTimesUp();
            revelarRespostaAgora();
        }
    }, 1000);
}

function atualizarCirculoTimer(segundos, total) {
    const elSec    = document.getElementById('timer-seconds');
    const elCircle = document.getElementById('timer-circle');
    if (elSec) elSec.textContent = Math.max(0, segundos);
    if (elCircle) {
        elCircle.classList.remove('warning', 'danger');
        if (segundos <= 5)       elCircle.classList.add('danger');
        else if (segundos <= 10) elCircle.classList.add('warning');
    }
}

// ===================================================================
// 3. RENDERIZAR RESULTADO / GABARITO
// ===================================================================
function renderizarResultado(dados) {
    clearInterval(countdownTimer);
    if (!dados.questao) return;

    const idxCorreto   = dados.questao.resposta_correta;
    const distribuicao = dados.distribuicao_respostas || [0, 0, 0, 0];
    const totalVotos   = distribuicao.reduce((a, b) => a + b, 0) || 1;

    for (let i = 0; i < 4; i++) {
        const card     = document.querySelector(`.option-card[data-index="${i}"]`);
        const barCnt   = document.getElementById(`bar-cnt-${i}`);
        const barFill  = document.getElementById(`bar-fill-${i}`);
        const barVotes = document.getElementById(`bar-votes-${i}`);

        if (card) {
            if (i === idxCorreto) {
                card.classList.add('correct-answer');
                card.classList.remove('dimmed');
            } else {
                card.classList.add('dimmed');
                card.classList.remove('correct-answer');
            }
        }

        if (barCnt && barFill && barVotes) {
            barCnt.style.display = 'block';
            const votos = distribuicao[i] || 0;
            const pct   = Math.round((votos / totalVotos) * 100);
            barFill.style.width  = `${pct}%`;
            barVotes.textContent = `${votos} votos (${pct}%)`;
        }
    }

    const factText = document.getElementById('eco-fact-text');
    if (factText) factText.textContent = dados.questao.curiosidade || 'Pequenas ações geram grandes impactos socioambientais!';

    const sourceName = document.getElementById('eco-source-name');
    if (sourceName) sourceName.textContent = dados.questao.fonte || 'Sementis';
}

// ===================================================================
// 4. RENDERIZAR RANKING
// ===================================================================

// SVG inline de chama (streak) — temático Sementis
const FLAME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#ff6b1a" stroke="none"><path d="M12 2c0 0-1 3-3 5C7 9 5 10 5 13c0 4 3 7 7 7s7-3 7-7c0-4-4-7-4-9 0 0-1 2-1 4 0 0-1-4-2-6z"/></svg>`;

function renderizarRanking(dados) {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    list.innerHTML = '';
    const ranking = (dados.ranking || []).slice(0, 5);

    ranking.forEach((jogador, idx) => {
        const card = document.createElement('div');
        card.className = `leaderboard-card ${idx === 0 ? 'leaderboard-card--top1' : ''}`;
        card.style.animationDelay = `${idx * 90}ms`;

        // Delta badge com setas SVG
        let deltaHtml = '<span class="delta-badge delta-same"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg></span>';
        if (jogador.delta > 0) {
            deltaHtml = `<span class="delta-badge delta-up"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +${jogador.delta}</span>`;
        } else if (jogador.delta < 0) {
            deltaHtml = `<span class="delta-badge delta-down"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg> ${jogador.delta}</span>`;
        }

        // Streak com ícone de chama SVG
        const streakHtml = jogador.streak >= 2
            ? `<span class="rank-streak-badge"><span class="streak-flame-icon">${FLAME_SVG}</span>${jogador.streak} seguidas</span>`
            : '';

        const gainHtml = jogador.pontos_ultima_rodada > 0
            ? `<div class="rank-round-gain">+${jogador.pontos_ultima_rodada} pts</div>`
            : '';

        card.innerHTML = `
            <div class="leaderboard-left">
                <div class="rank-pos rank-pos-${jogador.posicao}">${jogador.posicao}</div>
                <div class="rank-avatar">${jogador.avatar ? jogador.avatar.emoji : '🌱'}</div>
                <div class="rank-player-info">
                    <span class="rank-player-name">${jogador.nome}</span>
                    ${streakHtml}
                </div>
            </div>
            <div class="leaderboard-right">
                ${deltaHtml}
                <div class="rank-points-box">
                    <div class="rank-points-val">${jogador.pontos.toLocaleString()} pts</div>
                    ${gainHtml}
                </div>
            </div>
        `;
        list.appendChild(card);
    });

    const btnNext = document.getElementById('btn-next-text');
    if (btnNext) {
        const ehUltima = (dados.numero_pergunta >= dados.total_perguntas);
        btnNext.textContent = ehUltima ? 'Ver Pódio Final' : 'Próxima Pergunta';
    }
}

// ===================================================================
// 5. RENDERIZAR PÓDIO FINAL
// ===================================================================
function renderizarPodio(dados) {
    const ranking = dados.ranking || [];
    const p1 = ranking[0];
    const p2 = ranking[1];
    const p3 = ranking[2];

    const avatarSVG = (cor) => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;

    if (p1) {
        const av1 = document.getElementById('podium-avatar-1');
        if (av1) av1.innerHTML = p1.avatar ? `<span style="font-size:36px">${p1.avatar.emoji}</span>` : avatarSVG('#ffd700');
        document.getElementById('podium-name-1').textContent   = p1.nome;
        document.getElementById('podium-points-1').textContent = `${p1.pontos.toLocaleString()} pts`;
    }
    if (p2) {
        const av2 = document.getElementById('podium-avatar-2');
        if (av2) av2.innerHTML = p2.avatar ? `<span style="font-size:36px">${p2.avatar.emoji}</span>` : avatarSVG('#c0c0c0');
        document.getElementById('podium-name-2').textContent   = p2.nome;
        document.getElementById('podium-points-2').textContent = `${p2.pontos.toLocaleString()} pts`;
    } else {
        const col = document.getElementById('podium-second');
        if (col) col.style.visibility = 'hidden';
    }
    if (p3) {
        const av3 = document.getElementById('podium-avatar-3');
        if (av3) av3.innerHTML = p3.avatar ? `<span style="font-size:36px">${p3.avatar.emoji}</span>` : avatarSVG('#cd7f32');
        document.getElementById('podium-name-3').textContent   = p3.nome;
        document.getElementById('podium-points-3').textContent = `${p3.pontos.toLocaleString()} pts`;
    } else {
        const col = document.getElementById('podium-third');
        if (col) col.style.visibility = 'hidden';
    }
}

function dispararConfetesPodio() {
    if (typeof confetti === 'function') {
        const duracao = 4000;
        const fim = Date.now() + duracao;
        const interval = setInterval(() => {
            if (Date.now() > fim) return clearInterval(interval);
            confetti({
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                colors: ['#a9ff71', '#4ade80', '#ffd700', '#38bdf8'],
                origin: { x: Math.random(), y: Math.random() * 0.4 }
            });
        }, 300);
    }
}

// ===================================================================
// AÇÕES DO PROFESSOR
// ===================================================================
async function iniciarPartida() {
    initAudio();
    const res = await apiPost(`/api/live/sala/${pin}/iniciar`);
    if (res.sucesso) {
        syncEstadoSala();
    } else {
        mostrarToast(res.erro || 'Erro ao iniciar partida.');
    }
}
window.iniciarPartida = iniciarPartida;

async function revelarRespostaAgora() {
    clearInterval(countdownTimer);
    const res = await apiPost(`/api/live/sala/${pin}/revelar`);
    if (res.sucesso) syncEstadoSala();
}
window.revelarRespostaAgora = revelarRespostaAgora;

async function mostrarLeaderboard() {
    const res = await apiPost(`/api/live/sala/${pin}/ranking`);
    if (res.sucesso) syncEstadoSala();
}
window.mostrarLeaderboard = mostrarLeaderboard;

async function avancarProximaPergunta() {
    const res = await apiPost(`/api/live/sala/${pin}/proxima`);
    if (res.status) syncEstadoSala();
}
window.avancarProximaPergunta = avancarProximaPergunta;

async function adicionarBotTeste() {
    initAudio();
    const res = await apiPost(`/api/live/sala/${pin}/adicionar-bot`);
    if (res.jogador_id) {
        mostrarToast(`Aluno simulado "${res.nome}" entrou na sala!`);
        syncEstadoSala();
    }
}
window.adicionarBotTeste = adicionarBotTeste;

function copiarLinkEntrada() {
    const url = `${window.location.origin}/arena.html?pin=${pin}`;
    navigator.clipboard.writeText(url).then(() => {
        mostrarToast('Link da Arena copiado!');
    }).catch(() => {
        mostrarToast(`PIN: ${pin}`);
    });
}
window.copiarLinkEntrada = copiarLinkEntrada;

function mostrarToast(msg) {
    const toast = document.getElementById('host-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
}

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        if (!salaAtual) return;
        if (salaAtual.status === 'lobby')     iniciarPartida();
        else if (salaAtual.status === 'pergunta')  revelarRespostaAgora();
        else if (salaAtual.status === 'resultado') mostrarLeaderboard();
        else if (salaAtual.status === 'ranking')   avancarProximaPergunta();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    syncEstadoSala();
    pollTimer = setInterval(syncEstadoSala, 1000);
});
