// ================================================================
// TURMA ALUNO - SEMENTIS
// Controlador do dashboard da sala de aula do aluno
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Elementos principais do DOM
    const loadingState = document.getElementById('turma-loading-state');
    const semMatriculaState = document.getElementById('turma-sem-matricula');
    const dashboardContent = document.getElementById('turma-dashboard-content');
    const selectWrapper = document.getElementById('turma-select-wrapper');
    const selectTurma = document.getElementById('select-turma-ativa');

    // Elementos do resumo
    const dashboardTurmaNome = document.getElementById('dashboard-turma-nome');
    const dashboardProfessorNome = document.getElementById('dashboard-professor-nome');
    const metricTotalTrilhas = document.getElementById('metric-total-trilhas');
    const metricTotalAlunos = document.getElementById('metric-total-alunos');
    const metricMinhaPosicao = document.getElementById('metric-minha-posicao');

    // Listas
    const containerTrilhas = document.getElementById('lista-trilhas-turma');
    const containerRanking = document.getElementById('lista-ranking-turma');

    // Modais e formulários
    const modalEntrar = document.getElementById('modal-entrar-turma');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-entrar');
    const btnFecharModal = document.getElementById('btn-fechar-modal-entrar');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal-entrar');
    const formModal = document.getElementById('form-entrar-turma-modal');
    const inputCodigoModal = document.getElementById('input-codigo-modal');
    const feedbackModal = document.getElementById('feedback-codigo-modal');

    const formCard = document.getElementById('form-entrar-turma-card');
    const inputCodigoCard = document.getElementById('input-codigo-turma-card');
    const feedbackCard = document.getElementById('feedback-codigo-card');

    let turmasDoAluno = [];
    let turmaSelecionadaId = null;

    // ── GESTÃO DO MODAL ──────────────────────────────────────────
    function abrirModal() {
        if (modalEntrar) {
            modalEntrar.style.display = 'flex';
            inputCodigoModal.value = '';
            feedbackModal.textContent = '';
            feedbackModal.className = 'mensagem-feedback';
            inputCodigoModal.focus();
        }
    }

    function fecharModal() {
        if (modalEntrar) {
            modalEntrar.style.display = 'none';
        }
    }

    if (btnAbrirModal) btnAbrirModal.addEventListener('click', abrirModal);
    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', fecharModal);

    if (modalEntrar) {
        modalEntrar.addEventListener('click', (e) => {
            if (e.target === modalEntrar) fecharModal();
        });
    }

    // ── ENTRAR EM TURMA VIA CÓDIGO ──────────────────────────────
    async function processarEntradaTurma(codigo, elFeedback, onSuccess) {
        if (!codigo || codigo.trim().length === 0) {
            elFeedback.textContent = 'Por favor, digite o código de convite.';
            elFeedback.className = 'mensagem-feedback erro';
            return;
        }

        elFeedback.textContent = 'Verificando código...';
        elFeedback.className = 'mensagem-feedback';

        try {
            const resp = await fetch(`${API_BASE_URL}/api/aluno/entrar-turma`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ codigo_convite: codigo.trim() })
            });

            const data = await resp.json();

            if (!resp.ok) {
                elFeedback.textContent = data.erro || 'Não foi possível entrar na turma.';
                elFeedback.className = 'mensagem-feedback erro';
                return;
            }

            elFeedback.textContent = data.mensagem || 'Você entrou na turma com sucesso!';
            elFeedback.className = 'mensagem-feedback sucesso';

            setTimeout(async () => {
                if (onSuccess) onSuccess();
                await carregarTurmas(true);
            }, 800);

        } catch (err) {
            console.error('Erro ao entrar na turma:', err);
            elFeedback.textContent = 'Erro ao conectar ao servidor. Tente novamente.';
            elFeedback.className = 'mensagem-feedback erro';
        }
    }

    if (formCard) {
        formCard.addEventListener('submit', (e) => {
            e.preventDefault();
            processarEntradaTurma(inputCodigoCard.value, feedbackCard, () => {
                inputCodigoCard.value = '';
            });
        });
    }

    if (formModal) {
        formModal.addEventListener('submit', (e) => {
            e.preventDefault();
            processarEntradaTurma(inputCodigoModal.value, feedbackModal, () => {
                fecharModal();
            });
        });
    }

    // ── BUSCAR LISTA DE TURMAS DO ALUNO ─────────────────────────
    async function carregarTurmas(selecionarMaisRecente = false) {
        loadingState.style.display = 'flex';
        semMatriculaState.style.display = 'none';
        dashboardContent.style.display = 'none';

        try {
            const resp = await fetch(`${API_BASE_URL}/api/aluno/minhas-turmas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resp.ok) {
                throw new Error('Falha ao buscar turmas');
            }

            const data = await resp.json();
            turmasDoAluno = data.turmas || [];

            loadingState.style.display = 'none';

            if (turmasDoAluno.length === 0) {
                semMatriculaState.style.display = 'flex';
                selectWrapper.style.display = 'none';
                return;
            }

            // Popula o seletor de turmas
            selectTurma.innerHTML = '';
            turmasDoAluno.forEach((t) => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = `${t.nome} (Prof. ${t.professor_nome})`;
                selectTurma.appendChild(opt);
            });

            selectWrapper.style.display = 'flex';

            // Determina qual turma exibir
            const urlParams = new URLSearchParams(window.location.search);
            const paramTurmaId = urlParams.get('turma_id');

            if (selecionarMaisRecente) {
                turmaSelecionadaId = turmasDoAluno[turmasDoAluno.length - 1].id;
            } else if (paramTurmaId && turmasDoAluno.some(t => t.id === Number(paramTurmaId))) {
                turmaSelecionadaId = Number(paramTurmaId);
            } else {
                turmaSelecionadaId = turmasDoAluno[0].id;
            }

            selectTurma.value = turmaSelecionadaId;
            await carregarDashboardTurma(turmaSelecionadaId);

        } catch (err) {
            console.error('Erro ao carregar turmas:', err);
            loadingState.innerHTML = `
                <p style="color: #ff6b6b; font-weight: 700;">Erro ao carregar suas turmas.</p>
                <button onclick="window.location.reload()" class="btn-confirmar-codigo" style="margin-top: 10px;">Tentar Novamente</button>
            `;
        }
    }

    selectTurma.addEventListener('change', (e) => {
        turmaSelecionadaId = Number(e.target.value);
        // Atualiza a URL sem recarregar a página
        const newUrl = `${window.location.pathname}?turma_id=${turmaSelecionadaId}`;
        window.history.replaceState({}, '', newUrl);
        carregarDashboardTurma(turmaSelecionadaId);
    });

    // ── CARREGAR DASHBOARD DA TURMA ESPECÍFICA ───────────────────
    async function carregarDashboardTurma(turmaId) {
        dashboardContent.style.display = 'none';
        loadingState.style.display = 'flex';

        try {
            const resp = await fetch(`${API_BASE_URL}/api/aluno/turmas/${turmaId}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resp.ok) {
                throw new Error('Falha ao obter dashboard da turma');
            }

            const data = await resp.json();
            const { turma, trilhas, ranking, meu_id } = data;

            loadingState.style.display = 'none';
            dashboardContent.style.display = 'block';

            // Atualiza resumo
            dashboardTurmaNome.textContent = turma.nome;
            dashboardProfessorNome.textContent = turma.professor_nome;
            metricTotalTrilhas.textContent = trilhas.length;
            metricTotalAlunos.textContent = ranking.length;

            // Posição do aluno no ranking
            const posicaoAluno = ranking.findIndex(r => r.id === meu_id);
            if (posicaoAluno !== -1) {
                metricMinhaPosicao.textContent = `${posicaoAluno + 1}º`;
            } else {
                metricMinhaPosicao.textContent = '—';
            }

            // Renderiza Trilhas da Turma
            renderizarTrilhas(trilhas, turma.id);

            // Renderiza Ranking da Sala
            renderizarRanking(ranking, meu_id);

        } catch (err) {
            console.error('Erro ao carregar dashboard da turma:', err);
            loadingState.innerHTML = `<p style="color: #ff6b6b;">Não foi possível carregar os detalhes desta turma.</p>`;
        }
    }

    // ── RENDERIZAÇÃO DAS TRILHAS ────────────────────────────────
    function renderizarTrilhas(trilhas, turmaId) {
        containerTrilhas.innerHTML = '';

        if (!trilhas || trilhas.length === 0) {
            containerTrilhas.innerHTML = `
                <div class="trilhas-vazio">
                    <div class="vazio-icon">🌱</div>
                    <p><strong>Nenhuma trilha foi liberada para esta turma ainda.</strong></p>
                    <p style="font-size: 13px; margin-top: 4px;">Assim que seu professor atribuir novas trilhas criadas com a SemeIA, elas aparecerão aqui!</p>
                </div>
            `;
            return;
        }

        trilhas.forEach((trilha) => {
            const card = document.createElement('div');
            card.className = 'trilha-card';

            const totalAtividades = trilha.total_atividades || 0;
            const tiposTexto = trilha.tipos_atividades && trilha.tipos_atividades.includes('minigame')
                ? 'Quiz + Minigame FlapFish'
                : 'Quiz Interativo';

            card.innerHTML = `
                <div class="trilha-card-header">
                    <div>
                        <h3 class="trilha-card-title">${escapeHtml(trilha.nome)}</h3>
                        <div class="trilha-card-info">
                            <span>🎯 ${totalAtividades} ${totalAtividades === 1 ? 'fase' : 'fases'}</span>
                            <span>•</span>
                            <span>🕹️ ${tiposTexto}</span>
                        </div>
                    </div>
                    <span class="trilha-card-badge">✨ SemeIA</span>
                </div>
                <div style="margin-top: 6px;">
                    <a href="trilhas.html?trilha_id=${encodeURIComponent(trilha.id)}&turma_id=${encodeURIComponent(turmaId)}&origem=turma" class="btn-jogar-trilha">
                        <span>Jogar Trilha</span>
                        <span>→</span>
                    </a>
                </div>
            `;

            containerTrilhas.appendChild(card);
        });
    }

    // ── RENDERIZAÇÃO DO RANKING ─────────────────────────────────
    function renderizarRanking(ranking, meuId) {
        containerRanking.innerHTML = '';

        if (!ranking || ranking.length === 0) {
            containerRanking.innerHTML = `
                <li style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">
                    Ainda não há alunos com pontuação nesta sala.
                </li>
            `;
            return;
        }

        ranking.forEach((aluno, index) => {
            const isMe = aluno.id === meuId;
            const pos = index + 1;

            let badgeClasse = '';
            let badgeIcon = `${pos}º`;
            if (pos === 1) { badgeClasse = 'ouro'; badgeIcon = '🥇'; }
            else if (pos === 2) { badgeClasse = 'prata'; badgeIcon = '🥈'; }
            else if (pos === 3) { badgeClasse = 'bronze'; badgeIcon = '🥉'; }

            const li = document.createElement('li');
            li.className = `ranking-item-turma ${isMe ? 'is-me' : ''}`;

            li.innerHTML = `
                <div class="ranking-left">
                    <div class="posicao-badge ${badgeClasse}">${badgeIcon}</div>
                    <div class="aluno-info">
                        <span class="aluno-nome">${escapeHtml(aluno.nome)}</span>
                        ${isMe ? '<span class="voce-tag">Você</span>' : ''}
                    </div>
                </div>
                <div class="ranking-right">
                    <span class="aluno-ofensiva" title="Dias de ofensiva">🔥 ${aluno.ofensiva || 0}</span>
                    <span class="aluno-xp">+${aluno.xp_semanal || 0} XP</span>
                </div>
            `;

            containerRanking.appendChild(li);
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Inicia o carregamento
    carregarTurmas();
});
