// ================================================================
// QUIZ ENGINE — Sementis IFSP
// Redesigned: layout fixes, game-over screen, micro-animations
// ================================================================

let health = 5;
let maxHealth = 5;
let questoesAtuais = [];
let indiceQuestaoAtual = 0;
let selectedGridItems = new Set();
let normalSelection = null;
let normalCorrect = false;

// ── TEMAS POR CONTEÚDO ──────────────────────────────────────────
const quizThemes = [
  {
    key: "agua",
    words: ["agua", "hidrica", "rio", "rios", "gota", "banho", "eutrofizacao"],
    title: "Guardiões da Água",
    label: "Missão hídrica",
    accent: "#38c8ff",
    soft: "#d8f6ff",
    icon: "assets/tarefas/tarefa_agua.png",
    scene: "rio",
    intro: "Proteja rios, nascentes e cada gota que passa pela cidade."
  },
  {
    key: "lixo",
    words: ["lixo", "recicla", "sacola", "plastico", "metal", "zero"],
    title: "Operação Lixo Zero",
    label: "Missão reciclagem",
    accent: "#ffd54a",
    soft: "#fff4bf",
    icon: "assets/tarefas/tarefa_consumo_consciente.png",
    scene: "reciclagem",
    intro: "Separe escolhas boas das armadilhas que viram resíduo."
  },
  {
    key: "consumo",
    words: ["consumo", "comprar", "celular", "upcycling", "brecho", "pegada"],
    title: "Consumo Consciente",
    label: "Missão escolha",
    accent: "#ffb36b",
    soft: "#ffe3c4",
    icon: "assets/tarefas/tarefa_consumo_consciente.png",
    scene: "cidade",
    intro: "Decida com calma: cada compra também deixa um rastro."
  },
  {
    key: "fundamentos",
    words: ["sustentabilidade", "renovaveis", "ambiental", "social", "economico"],
    title: "Raízes do Saber",
    label: "Missão conceito",
    accent: "#a9ff71",
    soft: "#e8ffd9",
    icon: "assets/tarefas/tarefa_basico1.png",
    scene: "floresta",
    intro: "Fortaleça as bases para entender as próximas trilhas."
  }
];

const fallbackTheme = {
  key: "geral",
  title: "Desafio Sementis",
  label: "Missão sustentável",
  accent: "#a9ff71",
  soft: "#e8ffd9",
  icon: "assets/tarefas/tarefa_clima.png",
  scene: "floresta",
  intro: "Observe a situação e escolha a atitude mais sustentável."
};

// ── ABRIR QUIZ ──────────────────────────────────────────────────
async function openQuizModal() {
  const idClicado = localStorage.getItem("ultima_fase_id");
  const token = localStorage.getItem("token");
  const dadosUsuario = JSON.parse(localStorage.getItem("user")) || { vidas: 5 };
  health = parseInt(dadosUsuario.vidas, 10) || 5;
  maxHealth = health;

  try {
    const response = await fetch(`/api/atividades/${idClicado}/questoes`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (response.status === 404) {
      alert("Esta atividade ainda não possui questões cadastradas.");
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro do servidor! Status: ${response.status}`);
    }

    const dadosBrutos = await response.json();
    questoesAtuais = dadosBrutos.map((questao) => {
      if (typeof questao.conteudo === "string") {
        questao.conteudo = JSON.parse(questao.conteudo);
      }
      return questao;
    });

    indiceQuestaoAtual = 0;
    localStorage.setItem("erros_cometidos", 0);

    let quizOverlay = document.getElementById("quizOverlay");
    if (!quizOverlay) {
      quizOverlay = createQuizHTML();
      document.body.appendChild(quizOverlay);
    }

    document.body.classList.add("quiz-lock-scroll");
    updateHealthDisplay();
    renderizarQuestaoAtual();
    setTimeout(() => quizOverlay.classList.add("open"), 10);
  } catch (error) {
    console.error("ERRO FATAL NO QUIZ:", error);
    alert("Não foi possível carregar as questões agora.");
  }
}

// ── RENDERIZAR QUESTÃO ATUAL ────────────────────────────────────
function renderizarQuestaoAtual() {
  if (indiceQuestaoAtual >= questoesAtuais.length) {
    renderRewardScreen();
    return;
  }

  const questao = questoesAtuais[indiceQuestaoAtual];
  const theme = getQuestionTheme(questao);
  const progresso = ((indiceQuestaoAtual + 1) / questoesAtuais.length) * 100;

  const overlay = document.getElementById("quizOverlay");
  overlay.style.setProperty("--quiz-accent", theme.accent);
  overlay.style.setProperty("--quiz-soft", theme.soft);
  overlay.dataset.theme = theme.key;

  document.getElementById("quizProgressBar").style.width = `${progresso}%`;
  document.getElementById("quizStepCounter").innerText = `${indiceQuestaoAtual + 1}/${questoesAtuais.length}`;
  document.getElementById("quizMissionName").innerText = theme.title;
  document.getElementById("quizMissionLabel").innerText = theme.label;

  if (questao.tipo_layout === "grid_multiplo") {
    renderQuizGrid(questao.conteudo, theme);
  } else {
    renderQuizNormal(questao.conteudo, theme);
  }

  // Animação de entrada
  const quizBody = document.getElementById("quizBody");
  quizBody.classList.add("quiz-entering");
  setTimeout(() => quizBody.classList.remove("quiz-entering"), 450);
}

// ── QUIZ GRID (múltipla escolha) ────────────────────────────────
function renderQuizGrid(conteudo, theme) {
  const quizBody = document.getElementById("quizBody");
  const quizFooter = document.getElementById("quizFooter");
  selectedGridItems.clear();

  const opcoesHtml = conteudo.opcoes.map((opcao, index) => `
    <button class="quiz-grid-item" type="button" data-id="${index}" data-correct="${opcao.correta}" onclick="toggleGridItem(${index}, this)">
      <span class="grid-art">
        <img class="grid-main-img" src="assets/tarefas/${opcao.icone || inferOptionIcon(opcao.texto)}" alt="">
        <img class="grid-state grid-selected" src="assets/tarefas/tarefa_quiz_selo_item_selecionado.png" alt="">
        <img class="grid-state grid-correct" src="assets/tarefas/tarefa_quiz_selo_correto.png" alt="">
      </span>
      <span class="grid-label">${opcao.texto}</span>
    </button>
  `).join("");

  quizBody.innerHTML = `
    <section class="quiz-layout quiz-grid-layout">
      ${renderScene(theme, "Selecione todas as opções corretas")}
      <div class="quiz-card-panel">
        <div class="quiz-eyebrow">${theme.label}</div>
        <h2 class="quiz-question">${conteudo.pergunta}</h2>
        <div class="quiz-grid" aria-label="Opções do quiz">${opcoesHtml}</div>
      </div>
    </section>
  `;

  renderFooter({
    buttonText: "Verificar",
    onClick: "checkGridQuiz()",
    helper: "Pode haver mais de uma resposta certa."
  });
  quizFooter.className = "quiz-footer";
}

function toggleGridItem(id, el) {
  if (selectedGridItems.has(id)) {
    selectedGridItems.delete(id);
    el.classList.remove("selected");
  } else {
    selectedGridItems.add(id);
    el.classList.add("selected");
  }
}

function checkGridQuiz() {
  if (!selectedGridItems.size) return;

  const todasOpcoes = document.querySelectorAll(".quiz-grid-item");
  let allCorrect = true;

  todasOpcoes.forEach((item) => {
    const isCorrectOption = item.getAttribute("data-correct") === "true";
    const isSelected = selectedGridItems.has(parseInt(item.getAttribute("data-id"), 10));

    if ((isCorrectOption && !isSelected) || (!isCorrectOption && isSelected)) {
      allCorrect = false;
    }

    item.disabled = true;
    if (isCorrectOption) item.classList.add("correct-answer");
    if (!isCorrectOption && isSelected) item.classList.add("wrong-answer");
  });

  showFeedback(allCorrect);
}

// ── QUIZ NORMAL (escolha única) ─────────────────────────────────
function renderQuizNormal(conteudo, theme) {
  const quizBody = document.getElementById("quizBody");
  const quizFooter = document.getElementById("quizFooter");

  // Reset total do estado — FIX do bug "Tentar de novo"
  normalSelection = null;
  normalCorrect = false;

  const imagemHtml = conteudo.imagem_url
    ? `<div class="quiz-image-container"><img src="${conteudo.imagem_url}" class="quiz-image" alt=""></div>`
    : renderScene(theme, "Escolha a melhor atitude");

  const opcoesHtml = conteudo.opcoes.map((opcao, index) => `
    <button class="quiz-option" type="button" onclick="selectOption(this, ${opcao.correta})">
      <span class="opt-marker">${String.fromCharCode(65 + index)}</span>
      <span class="opt-text">${opcao.texto}</span>
    </button>
  `).join("");

  // FIX: Usando quiz-choice-layout (agora o CSS define essa classe corretamente)
  quizBody.innerHTML = `
    <section class="quiz-layout quiz-choice-layout">
      ${imagemHtml}
      <div class="quiz-card-panel">
        <div class="quiz-eyebrow">${theme.label}</div>
        <h2 class="quiz-question">${conteudo.pergunta}</h2>
        <div class="quiz-options">${opcoesHtml}</div>
      </div>
    </section>
  `;

  renderFooter({
    buttonText: "Verificar",
    onClick: "checkNormalQuiz()",
    helper: theme.intro
  });
  quizFooter.className = "quiz-footer";
}

function selectOption(el, isCorrect) {
  document.querySelectorAll(".quiz-option").forEach((opt) => opt.classList.remove("selected"));
  el.classList.add("selected");
  normalSelection = el;
  normalCorrect = isCorrect;
}

function checkNormalQuiz() {
  if (!normalSelection) return;

  document.querySelectorAll(".quiz-option").forEach((opt) => {
    opt.disabled = true;
    const text = opt.querySelector(".opt-text")?.innerText || "";
    const current = questoesAtuais[indiceQuestaoAtual].conteudo.opcoes.find((opcao) => opcao.texto === text);
    if (current?.correta) opt.classList.add("correct-answer");
  });

  if (!normalCorrect) {
    normalSelection.classList.add("wrong-answer");
    // Shake no card
    const card = document.querySelector(".quiz-card-panel");
    if (card) {
      card.classList.add("quiz-shake");
      setTimeout(() => card.classList.remove("quiz-shake"), 500);
    }
  }

  showFeedback(normalCorrect);
}

// ── FEEDBACK ────────────────────────────────────────────────────
function showFeedback(isCorrect) {
  if (!isCorrect && descontarVida()) return;

  const footer = document.getElementById("quizFooter");
  const feedback = document.getElementById("quizFeedback");
  const checkBtn = document.getElementById("quizCheckBtn");
  const questaoAtual = questoesAtuais[indiceQuestaoAtual];
  const curiosity = questaoAtual.conteudo.curiosidade || "Toda escolha sustentável fica mais forte quando você entende o motivo por trás dela.";

  footer.className = isCorrect ? "quiz-footer correct-mode" : "quiz-footer wrong-mode";
  feedback.innerHTML = `
    <div class="feedback-icon">
      <img src="${isCorrect ? "assets/tarefas/tarefa_quiz_selo_correto.png" : "assets/icons/icone_vida_perdida.png"}" alt="">
    </div>
    <div>
      <div class="feedback-title">${isCorrect ? "Boa decisão!" : "Ajuste de rota"}</div>
      <div class="feedback-subtitle">${isCorrect ? "Você protegeu a missão e ganhou impulso." : "Leia a dica e tente de novo com outro olhar."}</div>
      <div class="feedback-curiosity">${curiosity}</div>
    </div>
  `;

  checkBtn.innerText = isCorrect ? "Continuar" : "Tentar de novo";
  checkBtn.onclick = isCorrect ? avancaParaProxima : retryCurrentQuestion;
}

// FIX: Função separada para "Tentar de novo" que limpa o estado corretamente
function retryCurrentQuestion() {
  normalSelection = null;
  normalCorrect = false;
  selectedGridItems.clear();
  renderizarQuestaoAtual();
}

function renderFooter({ buttonText, onClick, helper }) {
  document.getElementById("quizFooter").innerHTML = `
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div class="quiz-footer-bar">
      <p class="quiz-helper">${helper}</p>
      <button class="quiz-btn" id="quizCheckBtn" onclick="${onClick}">${buttonText}</button>
    </div>
  `;
}

function avancaParaProxima() {
  indiceQuestaoAtual++;
  renderizarQuestaoAtual();
}

// ── TELA DE RECOMPENSA ──────────────────────────────────────────
function renderRewardScreen() {
  const errosCount = parseInt(localStorage.getItem("erros_cometidos") || 0, 10);
  const total = questoesAtuais.length;
  const acertosEstimados = Math.max(total - errosCount, 0);

  // Gerar estrelas de performance
  let estrelas = 3;
  if (errosCount > 0) estrelas = 2;
  if (errosCount >= 2) estrelas = 1;

  const estrelasHtml = Array.from({ length: 3 }, (_, i) =>
    `<span class="reward-star ${i < estrelas ? "active" : ""}">${i < estrelas ? "⭐" : "☆"}</span>`
  ).join("");

  document.getElementById("quizProgressBar").style.width = "100%";
  document.getElementById("quizBody").innerHTML = `
    <section class="quiz-reward">
      <div class="reward-glow"></div>
      <div class="reward-confetti">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span>
      </div>
      <div class="reward-medal">
        <img src="assets/tarefas/tarefa_completa_selo.png" alt="Missão completa">
      </div>
      <div class="reward-stars">${estrelasHtml}</div>
      <p class="quiz-eyebrow">Missão concluída</p>
      <h2>Você fortaleceu esta trilha!</h2>
      <div class="reward-stats">
        <div><strong>${total}</strong><span>desafios</span></div>
        <div><strong>${acertosEstimados}</strong><span>sem erro</span></div>
        <div><strong>${health}</strong><span>vidas</span></div>
      </div>
    </section>
  `;

  document.getElementById("quizFooter").className = "quiz-footer reward-mode";
  document.getElementById("quizFooter").innerHTML = `
    <div class="quiz-footer-bar">
      <p class="quiz-helper">Seu progresso será salvo agora.</p>
      <button class="quiz-btn" onclick="dispararVitoria()">Coletar recompensa</button>
    </div>
  `;
}

function dispararVitoria() {
  const trilhaId = localStorage.getItem("ultima_fase_id");
  const errosCount = localStorage.getItem("erros_cometidos") || 0;

  fetch("/completar_atividade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      atividade_id: trilhaId,
      erros: parseInt(errosCount, 10),
      concluida_com_sucesso: true
    })
  })
    .then((response) => response.json())
    .then(() => {
      localStorage.setItem("erros_cometidos", 0);
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("Erro ao salvar progresso.");
      window.location.reload();
    });
}

// ── VIDAS / GAME OVER ───────────────────────────────────────────
function descontarVida() {
  health--;
  if (health < 0) health = 0;

  const dadosUsuario = JSON.parse(localStorage.getItem("user")) || { vidas: 5 };
  dadosUsuario.vidas = health;
  localStorage.setItem("user", JSON.stringify(dadosUsuario));

  const erros = parseInt(localStorage.getItem("erros_cometidos") || 0, 10);
  localStorage.setItem("erros_cometidos", erros + 1);

  updateHealthDisplay();

  // Animação de perda de vida no coração
  const hearts = document.querySelectorAll(".quiz-heart");
  if (hearts.length > 0) {
    const lostHeart = hearts[health];
    if (lostHeart) {
      lostHeart.classList.add("heart-pop");
      setTimeout(() => {
        lostHeart.src = "assets/icons/icone_vida_vazia.png";
        lostHeart.classList.remove("heart-pop");
        lostHeart.classList.add("heart-empty");
      }, 400);
    }
  }

  if (health <= 0) {
    // FIX: Tela de Game Over estilizada em vez de alert()
    setTimeout(() => renderGameOverScreen(), 600);
    return true;
  }
  return false;
}

function renderGameOverScreen() {
  const trilhaId = localStorage.getItem("ultima_fase_id");
  const errosCount = localStorage.getItem("erros_cometidos") || 0;

  // Salvar no backend
  fetch("/completar_atividade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      atividade_id: trilhaId,
      erros: parseInt(errosCount, 10),
      concluida_com_sucesso: false
    })
  }).catch(console.error);

  localStorage.setItem("erros_cometidos", 0);

  document.getElementById("quizBody").innerHTML = `
    <section class="quiz-gameover">
      <div class="gameover-icon">
        <img src="assets/icons/icone_vida_perdida.png" alt="Sem vidas">
      </div>
      <h2>Missão interrompida</h2>
      <p class="gameover-subtitle">Você ficou sem corações, mas tudo bem!<br>Cada erro é uma chance de aprender.</p>
      <div class="gameover-tip">
        <span>💡</span>
        <span>Releia as curiosidades — elas guardam as respostas!</span>
      </div>
    </section>
  `;

  const footer = document.getElementById("quizFooter");
  footer.className = "quiz-footer gameover-mode";
  footer.innerHTML = `
    <div class="quiz-footer-bar">
      <p class="quiz-helper">Aguarde suas vidas se recuperarem e tente novamente.</p>
      <button class="quiz-btn" onclick="closeQuizAndReload()">Voltar à trilha</button>
    </div>
  `;
}

function closeQuizAndReload() {
  closeQuizModal();
  setTimeout(() => window.location.reload(), 350);
}

// ── CRIAR HTML DO QUIZ ──────────────────────────────────────────
function createQuizHTML() {
  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";
  overlay.id = "quizOverlay";

  // Gerar corações para exibição de vidas
  const heartsHtml = generateHeartsHtml();

  overlay.innerHTML = `
    <div class="quiz-container">
      <header class="quiz-header">
        <button class="quiz-close-btn" onclick="closeQuizModal()" aria-label="Fechar quiz">&times;</button>
        <div class="quiz-header-info">
          <span class="quiz-mission-label" id="quizMissionLabel">Missão</span>
          <strong class="quiz-mission-name" id="quizMissionName">Desafio Sementis</strong>
        </div>
        <div class="quiz-progress-wrap">
          <div class="quiz-progress"><div class="quiz-progress-bar" id="quizProgressBar"></div></div>
          <span class="quiz-step" id="quizStepCounter">1/1</span>
        </div>
        <div class="quiz-lives" id="quizLivesDisplay">
          ${heartsHtml}
        </div>
      </header>
      <main class="quiz-body" id="quizBody"></main>
      <footer class="quiz-footer" id="quizFooter"></footer>
    </div>`;
  return overlay;
}

function generateHeartsHtml() {
  let html = "";
  for (let i = 0; i < maxHealth; i++) {
    if (i < health) {
      html += `<img class="quiz-heart" src="assets/icons/icone_vida.png" alt="♥">`;
    } else {
      html += `<img class="quiz-heart heart-empty" src="assets/icons/icone_vida_vazia.png" alt="♡">`;
    }
  }
  return html;
}

function closeQuizModal() {
  const quizOverlay = document.getElementById("quizOverlay");
  if (quizOverlay) {
    quizOverlay.classList.remove("open");
    document.body.classList.remove("quiz-lock-scroll");
    setTimeout(() => quizOverlay.remove(), 300);
  }
}

function updateHealthDisplay() {
  const livesContainer = document.getElementById("quizLivesDisplay");
  if (livesContainer) {
    livesContainer.innerHTML = generateHeartsHtml();
  }
}

// ── UTILIDADES ──────────────────────────────────────────────────
function getQuestionTheme(questao) {
  const content = `${questao.conteudo.pergunta || ""} ${questao.conteudo.curiosidade || ""} ${questao.conteudo.opcoes?.map((opcao) => opcao.texto).join(" ") || ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return quizThemes.find((theme) => theme.words.some((word) => content.includes(word))) || fallbackTheme;
}

function renderScene(theme, caption) {
  return `
    <aside class="quiz-scene quiz-scene-${theme.scene}">
      <img src="assets/brand/logo_sementis_background_5__opacidade.png" alt="" class="scene-watermark">
      <div class="scene-focus">
        <img src="${theme.icon}" alt="" class="scene-badge">
      </div>
      <span>${caption}</span>
    </aside>
  `;
}

function inferOptionIcon(texto) {
  const clean = (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (clean.includes("agua") || clean.includes("rio")) return "tarefa_agua.png";
  if (clean.includes("carne") || clean.includes("horta") || clean.includes("compost")) return "tarefa_horta.png";
  if (clean.includes("plast") || clean.includes("lixo") || clean.includes("recicl")) return "tarefa_consumo_consciente.png";
  if (clean.includes("sol") || clean.includes("vento")) return "tarefa_clima.png";
  return "tarefa_quiz_opcao1.png";
}
