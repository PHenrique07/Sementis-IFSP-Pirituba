// ===== Entrar em Turma — Lógica do Modal (Aluno) =====

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const btnJoin = document.getElementById('btn-entrar-turma');

    // Só exibe o botão se o usuário for aluno e estiver logado
    if (user && user.tipo === 'aluno' && btnJoin) {
        btnJoin.style.display = 'flex';
    }

    const modal        = document.getElementById('modal-turma');
    const btnClose     = document.getElementById('modal-turma-close');
    const inputCodigo  = document.getElementById('input-codigo-convite');
    const btnConfirmar = document.getElementById('btn-confirmar-turma');
    const btnText      = document.getElementById('btn-confirmar-text');
    const btnSpinner   = document.getElementById('btn-confirmar-spinner');
    const msgEl        = document.getElementById('modal-turma-msg');

    if (btnJoin) {
        btnJoin.addEventListener('click', () => abrirModal());
    }
    if (btnClose) {
        btnClose.addEventListener('click', () => fecharModal());
    }
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) fecharModal();
    });
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => confirmarEntrada());
    }
    if (inputCodigo) {
        inputCodigo.addEventListener('input', () => { inputCodigo.value = inputCodigo.value.replace(/\s/g, ''); limparMensagem(); });
        inputCodigo.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmarEntrada(); });
    }

    function abrirModal() {
        if (!modal) return;
        limparModal();
        modal.classList.add('open');
        setTimeout(() => inputCodigo && inputCodigo.focus(), 150);
    }
    function fecharModal() {
        if (!modal) return;
        modal.classList.remove('open');
        limparModal();
    }
    function limparModal() {
        if (inputCodigo) inputCodigo.value = '';
        limparMensagem();
        setLoading(false);
    }
    function limparMensagem() {
        if (msgEl) { msgEl.textContent = ''; msgEl.className = 'modal-msg'; }
    }
    function setMensagem(texto, tipo = 'erro') {
        if (!msgEl) return;
        msgEl.textContent = texto;
        msgEl.className = `modal-msg modal-msg--${tipo}`;
    }
    function setLoading(on) {
        if (!btnText || !btnSpinner || !btnConfirmar) return;
        btnText.style.display    = on ? 'none' : 'inline';
        btnSpinner.style.display = on ? 'block' : 'none';
        btnConfirmar.disabled    = on;
    }

    async function confirmarEntrada() {
        const codigo = inputCodigo ? inputCodigo.value.trim() : '';
        if (!codigo || codigo.length < 4) {
            setMensagem('Digite um código válido (mínimo 4 caracteres).');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setMensagem('Você precisa estar logado para entrar em uma turma.');
            return;
        }
        setLoading(true);
        limparMensagem();
        try {
            const resposta = await fetch(`${API_BASE_URL}/api/aluno/entrar-turma`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ codigo })
            });
            const dados = await resposta.json();
            if (resposta.ok) {
                setMensagem(dados.mensagem, 'sucesso');
                setTimeout(() => fecharModal(), 2200);
            } else {
                setMensagem(dados.mensagem || dados.erro || 'Código inválido ou turma não encontrada.');
            }
        } catch (err) {
            console.error('Erro ao entrar na turma:', err);
            setMensagem('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            setLoading(false);
        }
    }
});
