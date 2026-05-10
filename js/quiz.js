// Quiz Logic
function openQuizModal() {
  let quizOverlay = document.getElementById('quizOverlay');
  if (!quizOverlay) {
    quizOverlay = createQuizHTML();
    document.body.appendChild(quizOverlay);
  }
  
  renderQuizGrid();
  
  setTimeout(() => {
    quizOverlay.classList.add('open');
  }, 10);
}

function closeQuizModal() {
  const quizOverlay = document.getElementById('quizOverlay');
  if (quizOverlay) {
    quizOverlay.classList.remove('open');
    setTimeout(() => {
      quizOverlay.remove();
    }, 300);
  }
}

function createQuizHTML() {
  const overlay = document.createElement('div');
  overlay.className = 'quiz-overlay';
  overlay.id = 'quizOverlay';

  overlay.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <button class="quiz-close-btn" onclick="closeQuizModal()">&#x2715;</button>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" id="quizProgressBar"></div>
        </div>
          <div class="quiz-stats" style="gap: 16px;">
            <div class="quiz-stat"><img src="assets/icons/icone_moeda.png" alt="Moedas" style="width: 38px;"> <span>150</span></div>
            <div class="quiz-stat"><img src="assets/icons/icone_vida.png" alt="❤️" style="width: 32px;"> <span id="healthDisplay">4</span></div>

  return overlay;
}

const quizGridItems = [
  { id: 1, img: "assets/tarefas/tarefa_quiz_opcao1.png", correct: true },
  { id: 2, img: "assets/tarefas/tarefa_quiz_opcao2.png", correct: true },
  { id: 3, img: "assets/tarefas/tarefa_quiz_opcao3.png", correct: true },
  { id: 4, img: "assets/tarefas/tarefa_quiz_opcao4.png", correct: true },
  { id: 5, img: "assets/tarefas/tarefa_quiz_opcao5.png", correct: true },
  { id: 6, img: "assets/tarefas/tarefa_quiz_opcao6.png", correct: true },
  { id: 7, img: "assets/tarefas/tarefa_quiz_opcao7.png", correct: false }
];

let selectedGridItems = new Set();
let health = 4;
let currentPhase = 'grid'; // 'grid' | 'normal'
let normalSelection = null;
let normalCorrect = false;

function renderQuizGrid() {
  currentPhase = 'grid';
  const quizBody = document.getElementById('quizBody');
  const quizFooter = document.getElementById('quizFooter');
  
  selectedGridItems.clear();
  document.getElementById('quizProgressBar').style.width = '33%';
  
      <img src="assets/tarefas/tarefa_agua.png" alt="Módulo Água" style="width: 80px; margin-bottom: 16px;">
        <img src="${item.img}" alt="Opção ${item.id}">
        <img src="assets/tarefas/tarefa_quiz_selo_item_selecionado.png" class="check" alt="Check">
      </div>
    `;
  });

  gridHTML += `
      </div>
    </div>
  `;

  quizBody.innerHTML = gridHTML;

  quizFooter.innerHTML = `
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div class="quiz-footer-buttons">
      <button class="quiz-btn list-skip" onclick="closeQuizModal()">PULAR</button>
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
  const correctIds = quizGridItems.filter(i => i.correct).map(i => i.id);
  
  let allCorrect = true;

  correctIds.forEach(id => { if (!selectedGridItems.has(id)) allCorrect = false; });
  selectedGridItems.forEach(id => { if (!correctIds.includes(id)) allCorrect = false; });

  const footer = document.getElementById('quizFooter');
  const feedback = document.getElementById('quizFeedback');
  const checkBtn = document.getElementById('quizCheckBtn');

  if (allCorrect) {
    footer.className = 'quiz-footer correct-mode';
    feedback.innerHTML = `
      <div class="feedback-title"><img src="assets/tarefas/tarefa_quiz_selo_correto.png" style="width:28px; vertical-align:middle;"> Perfeito!</div>
      <div class="feedback-subtitle">+ 🪙 100</div>
    `;
    checkBtn.innerText = 'CONTINUAR';
    checkBtn.onclick = renderQuizNormal;
  } else {
    health--;
    updateHealthDisplay();
    footer.className = 'quiz-footer wrong-mode';
    feedback.innerHTML = `
      <div class="feedback-title">Incorreto.</div>
      <div class="feedback-subtitle">Preste muita atenção e selecione TODAS as consequências corretas! ❤️ -1</div>
    `;
    checkBtn.innerText = 'TENTAR NOVAMENTE';
    checkBtn.onclick = () => {
      footer.className = 'quiz-footer';
      feedback.innerHTML = '';
      checkBtn.innerText = 'VERIFICAR';
      checkBtn.onclick = checkGridQuiz;
    };
  }
}

function renderQuizNormal() {
  currentPhase = 'normal';
  const quizBody = document.getElementById('quizBody');
  const quizFooter = document.getElementById('quizFooter');
  
  document.getElementById('quizProgressBar').style.width = '66%';
  normalSelection = null;

  quizFooter.className = 'quiz-footer';
  quizFooter.innerHTML = `
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div class="quiz-footer-buttons">
      <button class="quiz-btn list-skip" onclick="closeQuizModal()">PULAR</button>
      <button class="quiz-btn list-check" id="quizCheckBtn" onclick="checkNormalQuiz()">VERIFICAR</button>
    </div>
  `;
  
    <div class="quiz-question" style="font-size: 18px; margin-bottom: 24px;">Como é chamado o fenômeno da imagem?</div>
    <div class="quiz-normal-wrapper">
      <div class="quiz-image-container">
        <img src="assets/tarefas/imagem_quiz_eutrofização.png" alt="Eutrofização" class="quiz-image">
      </div>
      <div class="quiz-options">
        <div class="quiz-option" onclick="selectOption(this, true)">
          <div class="opt-text">Eutrofização</div>
        </div>
        <div class="quiz-option" onclick="selectOption(this, false)">
          <div class="opt-text">Bioacumulação</div>
        </div>
        <div class="quiz-option" onclick="selectOption(this, false)">
          <div class="opt-text">Proliferação de Algas</div>
        </div>
        <div class="quiz-option" onclick="selectOption(this, false)">
          <div class="opt-text">Acidificação Oceânica</div>
        </div>
      </div>
    </div>
  `;

  quizBody.innerHTML = html;
}

function selectOption(el, isCorrect) {
  const allOpts = document.querySelectorAll('.quiz-option');
  allOpts.forEach(opt => opt.classList.remove('selected'));

  el.classList.add('selected');
  normalSelection = el;
  normalCorrect = isCorrect;
}

function checkNormalQuiz() {
  if (!normalSelection) return;

  const footer = document.getElementById('quizFooter');
  const feedback = document.getElementById('quizFeedback');
  const checkBtn = document.getElementById('quizCheckBtn');
  
  const allOpts = document.querySelectorAll('.quiz-option');
  allOpts.forEach(opt => {
    opt.style.pointerEvents = 'none';
  });

  if (normalCorrect) {
    normalSelection.classList.add('correct-answer');
    document.getElementById('quizProgressBar').style.width = '100%';
    
    footer.className = 'quiz-footer correct-mode';
    feedback.innerHTML = `
      <div class="feedback-title"><img src="assets/tarefas/tarefa_quiz_selo_correto.png" style="width:28px; vertical-align:middle;"> Muito bem!!</div>
      <div class="feedback-subtitle">+ 🪙 100</div>
    `;
    checkBtn.innerText = 'FINALIZAR';
    checkBtn.onclick = () => {
      closeQuizModal();
      document.getElementById('scene').innerHTML = ''; // Forces a redraw
      build(); 
      setTimeout(() => alert("Lição 1 concluída com sucesso!"), 300);
    };
  } else {
    health--;
    updateHealthDisplay();
    normalSelection.classList.add('wrong-answer');
    
    footer.className = 'quiz-footer wrong-mode';
    feedback.innerHTML = `
      <div class="feedback-title">Incorreto.</div>
      <div class="feedback-subtitle">A resposta correta era 'Eutrofização'. ❤️ -1</div>
    `;
    checkBtn.innerText = 'ENTENDI';
    checkBtn.onclick = () => {
      allOpts.forEach(opt => {
        opt.style.pointerEvents = 'auto';
        opt.classList.remove('selected', 'wrong-answer');
      });
      normalSelection = null;
      footer.className = 'quiz-footer';
      feedback.innerHTML = '';
      checkBtn.innerText = 'VERIFICAR';
      checkBtn.onclick = checkNormalQuiz;
    };
  }
}

function updateHealthDisplay() {
  const healthEl = document.getElementById('healthDisplay');
  if (healthEl) healthEl.innerText = health;
}

