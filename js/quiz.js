// Variáveis Globais
let health = 5; 
let questoesAtuais = [];
let indiceQuestaoAtual = 0;
let selectedGridItems = new Set();
let normalSelection = null;
let normalCorrect = false;

// 1. A FUNÇÃO QUE INICIA TUDO BASCANDO DO BANCO
// 1. A FUNÇÃO QUE INICIA TUDO BASCANDO DO BANCO
async function openQuizModal() {
  const idClicado = localStorage.getItem('ultima_fase_id');
  const token = localStorage.getItem('token');

  let dadosUsuario = JSON.parse(localStorage.getItem('user')) || { vidas: 5 };
  health = parseInt(dadosUsuario.vidas);

  try {
      console.log("=== DEBUG QUIZ ===");
      console.log("1. Buscando questões para a Atividade ID:", idClicado);
      
      const response = await fetch(`/api/atividades/${idClicado}/questoes`, {
          headers: { 'Authorization': 'Bearer ' + token }
      });

      console.log("2. Status da resposta do servidor:", response.status);

      if (response.status === 404) {
          alert("Esta atividade ainda não possui questões cadastradas no banco.");
          return;
      }

      if (!response.ok) {
          throw new Error(`Erro do servidor! Status: ${response.status}`);
      }
      
      let dadosBrutos = await response.json();
      console.log("3. Dados que vieram do banco:", dadosBrutos);
      
      // --- A CORREÇÃO DE OURO (O Escudo anti-SQLite) ---
      questoesAtuais = dadosBrutos.map(questao => {
          // Se o banco enviou o JSON como um texto puro, nós o forçamos a virar Objeto JS
          if (typeof questao.conteudo === 'string') {
              questao.conteudo = JSON.parse(questao.conteudo);
          }
          return questao;
      });

      console.log("4. Questões processadas com sucesso prontas para tela:", questoesAtuais);

      indiceQuestaoAtual = 0; 

      let quizOverlay = document.getElementById('quizOverlay');
      if (!quizOverlay) {
        quizOverlay = createQuizHTML();
        document.body.appendChild(quizOverlay);
      }
      
      updateHealthDisplay();
      renderizarQuestaoAtual();
      
      setTimeout(() => { quizOverlay.classList.add('open'); }, 10);

  } catch (error) {
      console.error("ERRO FATAL NO QUIZ:", error);
      alert("Não foi possível carregar as questões. Aperte F12 e olhe a aba Console para ver o culpado!");
  }
}

// 2. GERENCIADOR DE TELAS (Avança as perguntas)
// 2. GERENCIADOR DE TELAS (Avança as perguntas)
function renderizarQuestaoAtual() {
    if (indiceQuestaoAtual >= questoesAtuais.length) {
        closeQuizModal();
        dispararVitoria(); // <-- CHAMA A FUNÇÃO NOVA AQUI!
        return;
    }

    const questao = questoesAtuais[indiceQuestaoAtual];
    
    const progresso = (indiceQuestaoAtual / questoesAtuais.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progresso}%`;

    if (questao.tipo_layout === 'grid_multiplo') {
        renderQuizGrid(questao.conteudo);
    } else {
        renderQuizNormal(questao.conteudo);
    }
}

// ==== A FUNÇÃO QUE SALVA A VITÓRIA E ABRE O CADEADO ====
function dispararVitoria() {
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
            concluida_com_sucesso: true // TRUE AVISA O PYTHON QUE VOCÊ VENCEU!
        })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('erros_cometidos', 0); 
        alert("🎉 Lição Concluída! " + (data.mensagem || ""));
        window.location.reload(); // Atualiza a página para o cadeado sumir!
    })
    .catch(error => {
        console.error(error);
        alert("Erro ao salvar progresso.");
        window.location.reload();
    });
}
function avancaParaProxima() {
    indiceQuestaoAtual++;
    renderizarQuestaoAtual();
}

// ==========================================
// RENDERIZAÇÃO: LAYOUT GRID
// ==========================================
function renderQuizGrid(conteudo) {
  const quizBody = document.getElementById('quizBody');
  const quizFooter = document.getElementById('quizFooter');
  selectedGridItems.clear();
  
  let gridHTML = `
    <div class="quiz-badge">NOVO CONCEITO</div>
    <div class="quiz-question">${conteudo.pergunta}</div>
    <div class="quiz-grid-container">
      <div class="quiz-grid">
  `;

  conteudo.opcoes.forEach((opcao, index) => {
    gridHTML += `
      <div class="quiz-grid-item" data-id="${index}" data-correct="${opcao.correta}" onclick="toggleGridItem(${index}, this)">
        <img src="assets/tarefas/${opcao.icone || 'tarefa_quiz_opcao1.png'}" alt="Opção">
        <img src="assets/tarefas/tarefa_quiz_selo_item_selecionado.png" class="check" alt="Check">
      </div>
    `;
  });

  gridHTML += `</div></div>`;
  quizBody.innerHTML = gridHTML;

  quizFooter.className = 'quiz-footer';
  quizFooter.innerHTML = `
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div class="quiz-footer-buttons">
      <button class="quiz-btn list-check" id="quizCheckBtn" onclick="checkGridQuiz()">VERIFICAR</button>
    </div>
  `;
}

function toggleGridItem(id, el) {
  if (selectedGridItems.has(id)) {
    selectedGridItems.delete(id);
    el.classList.remove('selected');
  } else {
    selectedGridItems.add(id);
    el.classList.add('selected');
  }
}

function checkGridQuiz() {
  const todasOpcoes = document.querySelectorAll('.quiz-grid-item');
  let allCorrect = true;

  todasOpcoes.forEach(item => {
      const isCorrectOption = item.getAttribute('data-correct') === 'true';
      const isSelected = selectedGridItems.has(parseInt(item.getAttribute('data-id')));
      
      if ((isCorrectOption && !isSelected) || (!isCorrectOption && isSelected)) {
          allCorrect = false;
      }
  });

  const footer = document.getElementById('quizFooter');
  const feedback = document.getElementById('quizFeedback');
  const checkBtn = document.getElementById('quizCheckBtn');

  if (allCorrect) {
    footer.className = 'quiz-footer correct-mode';
    feedback.innerHTML = `<div class="feedback-title">Perfeito!</div><div class="feedback-subtitle">+ 🪙 Bônus</div>`;
    checkBtn.innerText = 'CONTINUAR';
    checkBtn.onclick = avancaParaProxima;
  } else {
    if (descontarVida()) return;
    footer.className = 'quiz-footer wrong-mode';
    feedback.innerHTML = `<div class="feedback-title">Incorreto.</div><div class="feedback-subtitle">Preste muita atenção! ❤️ -1</div>`;
    checkBtn.innerText = 'TENTAR NOVAMENTE';
    checkBtn.onclick = () => { renderizarQuestaoAtual(); }; // Reseta a tela
  }
}

// ==========================================
// RENDERIZAÇÃO: LAYOUT NORMAL
// ==========================================
function renderQuizNormal(conteudo) {
  const quizBody = document.getElementById('quizBody');
  const quizFooter = document.getElementById('quizFooter');
  normalSelection = null;

  let imagemHtml = "";
  if (conteudo.imagem_url) {
      imagemHtml = `<div class="quiz-image-container"><img src="${conteudo.imagem_url}" class="quiz-image"></div>`;
  }

  let opcoesHtml = "";
  conteudo.opcoes.forEach((opcao) => {
      opcoesHtml += `
        <div class="quiz-option" onclick="selectOption(this, ${opcao.correta})">
          <div class="opt-text">${opcao.texto}</div>
        </div>
      `;
  });

  quizBody.innerHTML = `
    <div class="quiz-question" style="font-size: 18px; margin-bottom: 24px;">${conteudo.pergunta}</div>
    <div class="quiz-normal-wrapper">
      ${imagemHtml}
      <div class="quiz-options">${opcoesHtml}</div>
    </div>
  `;

  quizFooter.className = 'quiz-footer';
  quizFooter.innerHTML = `
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div class="quiz-footer-buttons">
      <button class="quiz-btn list-check" id="quizCheckBtn" onclick="checkNormalQuiz()">VERIFICAR</button>
    </div>
  `;
}

function selectOption(el, isCorrect) {
  document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');
  normalSelection = el;
  normalCorrect = isCorrect;
}

function checkNormalQuiz() {
  if (!normalSelection) return;

  const footer = document.getElementById('quizFooter');
  const feedback = document.getElementById('quizFeedback');
  const checkBtn = document.getElementById('quizCheckBtn');
  document.querySelectorAll('.quiz-option').forEach(opt => opt.style.pointerEvents = 'none');

  if (normalCorrect) {
    normalSelection.classList.add('correct-answer');
    footer.className = 'quiz-footer correct-mode';
    feedback.innerHTML = `<div class="feedback-title">Muito bem!!</div><div class="feedback-subtitle">+ 🪙 Bônus</div>`;
    checkBtn.innerText = 'CONTINUAR';
    checkBtn.onclick = avancaParaProxima;
  } else {
    if (descontarVida()) return;
    normalSelection.classList.add('wrong-answer');
    footer.className = 'quiz-footer wrong-mode';
    feedback.innerHTML = `<div class="feedback-title">Incorreto.</div><div class="feedback-subtitle">Tente novamente. ❤️ -1</div>`;
    checkBtn.innerText = 'ENTENDI';
    checkBtn.onclick = () => { renderizarQuestaoAtual(); };
  }
}

// ==========================================
// FUNÇÕES DE VIDA E UTILIDADES
// ==========================================
function descontarVida() {
    health--;
    if (health < 0) health = 0;
    let dadosUsuario = JSON.parse(localStorage.getItem('user')) || { vidas: 5 };
    dadosUsuario.vidas = health;
    localStorage.setItem('user', JSON.stringify(dadosUsuario));

    let erros = parseInt(localStorage.getItem('erros_cometidos') || 0);
    localStorage.setItem('erros_cometidos', erros + 1);

    updateHealthDisplay();

    if (health <= 0) {
        dispararGameOver();
        return true; 
    }
    return false; 
}

function dispararGameOver() {
    const trilhaId = localStorage.getItem('ultima_fase_id');
    const errosCount = localStorage.getItem('erros_cometidos') || 0;
    fetch('/completar_atividade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ atividade_id: trilhaId, erros: parseInt(errosCount), concluida_com_sucesso: false })
    }).finally(() => {
        localStorage.setItem('erros_cometidos', 0); 
        alert("Game Over! Você ficou sem corações.");
        window.location.reload(); 
    });
}

function createQuizHTML() {
  const overlay = document.createElement('div');
  overlay.className = 'quiz-overlay';
  overlay.id = 'quizOverlay';
  overlay.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <button class="quiz-close-btn" onclick="closeQuizModal()">&#x2715;</button>
        <div class="quiz-progress"><div class="quiz-progress-bar" id="quizProgressBar"></div></div>
        <div class="quiz-stats"><div class="quiz-stat"><img src="assets/icons/icone_vida.png" alt="❤️" style="width: 24px;"> <span id="healthDisplay">${health}</span></div></div>
      </div>
      <div class="quiz-body" id="quizBody"></div>
      <div class="quiz-footer" id="quizFooter"></div>
    </div>`;
  return overlay;
}

function closeQuizModal() {
  const quizOverlay = document.getElementById('quizOverlay');
  if (quizOverlay) {
    quizOverlay.classList.remove('open');
    setTimeout(() => { quizOverlay.remove(); }, 300);
  }
}

function updateHealthDisplay() {
  const healthEl = document.getElementById('healthDisplay');
  if (healthEl) healthEl.innerText = health;
}