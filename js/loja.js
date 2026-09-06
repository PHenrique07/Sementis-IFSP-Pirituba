// Sementis - Lógica da Loja Oficial e Gacha Machine
// Compatível com CSS Vanilla (css/loja.css) e design system do Sementis

// Configurações e Dados da Loja
const START_COINS = 1000;
const GACHA_COST = 100;

const RARITY = {
  comum: { label: "Comum", color: "#B8B8E6", chance: "55%" },
  raro: { label: "Raro", color: "#4FC3F7", chance: "30%" },
  epico: { label: "Épico", color: "#C084FC", chance: "12%" },
  lendario: { label: "Lendário", color: "#FFC107", chance: "3%" },
};

const SHOP_SECTIONS = [
  {
    id: "avatares",
    num: "01",
    title: "Avatares",
    tagline: "Dê uma cara nova ao seu perfil na floresta do saber.",
    items: [
      { id: "av-broto", name: "Broto Guerreiro", desc: "Pequeno, mas corajoso. O avatar de quem está começando a jornada.", price: 250, icon: "sprout", tint: "#a9ff71" },
      { id: "av-guardiao", name: "Guardião da Mata", desc: "Protetor das árvores antigas. Impõe respeito em qualquer ranking.", price: 400, icon: "tree-pine", tint: "#4FC3F7" },
      { id: "av-espirito", name: "Espírito da Floresta", desc: "O avatar mais raro da loja. Dizem que ele sussurra respostas.", price: 600, icon: "ghost", tint: "#C084FC" },
    ],
  },
  {
    id: "temas",
    num: "02",
    title: "Temas",
    tagline: "Mude o visual do app inteiro com um toque.",
    items: [
      { id: "tm-oceano", name: "Tema Oceano", desc: "Mergulhe em tons azulados enquanto aprende sobre vida aquática.", price: 300, icon: "waves", tint: "#4FC3F7" },
      { id: "tm-noturno", name: "Tema Noturno", desc: "Para quem estuda de madrugada sob a luz das estrelas.", price: 350, icon: "moon", tint: "#B8B8E6" },
      { id: "tm-aurora", name: "Tema Aurora", desc: "Cores quentes de um amanhecer na floresta. Edição especial.", price: 500, icon: "sunrise", tint: "#FF8A00" },
    ],
  },
  {
    id: "vidas",
    num: "03",
    title: "Vidas",
    tagline: "Errou? Sem drama. Continue a missão.",
    items: [
      { id: "vd-coracao", name: "Coração Extra", desc: "Uma vida a mais para não perder a sequência de estudos.", price: 150, icon: "heart", tint: "#FF4B6E" },
      { id: "vd-escudo", name: "Escudo de Vida", desc: "Protege seus corações por 24 horas de erros sem punição.", price: 250, icon: "shield", tint: "#4FC3F7" },
      { id: "vd-recarga", name: "Recarga Total", desc: "Enche todos os corações na hora. Volta pro jogo imediato.", price: 400, icon: "zap", tint: "#FFC107" },
    ],
  },
  {
    id: "powerups",
    num: "04",
    title: "Power-ups",
    tagline: "Vantagens secretas para dominar as missões.",
    items: [
      { id: "pw-xp", name: "XP em Dobro", desc: "Dobra todo o XP ganho nas próximas 5 lições.", price: 200, icon: "star", tint: "#a9ff71" },
      { id: "pw-dica", name: "Dica Mágica", desc: "Revela a resposta certa quando o desafio apertar.", price: 120, icon: "lightbulb", tint: "#FFC107" },
      { id: "pw-tempo", name: "Congelar Tempo", desc: "Pausa o cronômetro nos quizzes contra o relógio.", price: 180, icon: "timer", tint: "#4FC3F7" },
      { id: "pw-raio", name: "Raio de Sabedoria", desc: "Elimina duas alternativas erradas de qualquer questão.", price: 300, icon: "rocket", tint: "#C084FC" },
    ],
  },
];

const ALL_ITEMS = SHOP_SECTIONS.flatMap((s) => s.items);

const GACHA_POOL = [
  { id: "g-c50", rarity: "comum", type: "coins", amount: 50, name: "+50 Moedas", desc: "Um trocado dourado para o cofrinho.", icon: "coins" },
  { id: "g-c80", rarity: "comum", type: "coins", amount: 80, name: "+80 Moedas", desc: "Quase paga outra rodada na máquina.", icon: "coins" },
  { id: "g-coracao", rarity: "comum", type: "item", itemId: "vd-coracao", name: "Coração Extra", desc: "Uma vida a mais para continuar aprendendo.", icon: "heart" },
  { id: "g-c150", rarity: "raro", type: "coins", amount: 150, name: "+150 Moedas", desc: "Lucro na certa. A máquina foi generosa.", icon: "coins" },
  { id: "g-dica", rarity: "raro", type: "item", itemId: "pw-dica", name: "Dica Mágica", desc: "Um lampejo de genialidade engarrafado.", icon: "lightbulb" },
  { id: "g-tempo", rarity: "raro", type: "item", itemId: "pw-tempo", name: "Congelar Tempo", desc: "O relógio obedece a você agora.", icon: "timer" },
  { id: "g-oceano", rarity: "raro", type: "item", itemId: "tm-oceano", name: "Tema Oceano", desc: "Direto das profundezas para o seu app.", icon: "waves" },
  { id: "g-xp", rarity: "epico", type: "item", itemId: "pw-xp", name: "XP em Dobro", desc: "Progresso turbo nas próximas lições.", icon: "star" },
  { id: "g-raio", rarity: "epico", type: "item", itemId: "pw-raio", name: "Raio de Sabedoria", desc: "Um trovão de conhecimento puro.", icon: "rocket" },
  { id: "g-aurora", rarity: "epico", type: "item", itemId: "tm-aurora", name: "Tema Aurora", desc: "O amanhecer mais bonito da floresta.", icon: "sunrise" },
  { id: "g-c300", rarity: "epico", type: "coins", amount: 300, name: "+300 Moedas", desc: "Chuva de moedas! Segure o cofrinho.", icon: "coins" },
  { id: "g-espirito", rarity: "lendario", type: "item", itemId: "av-espirito", name: "Espírito da Floresta", desc: "O prêmio supremo da máquina. Lenda viva.", icon: "ghost" },
  { id: "g-c777", rarity: "lendario", type: "coins", amount: 777, name: "Jackpot +777", desc: "A máquina explodiu em moedas de ouro!", icon: "crown" },
];

const RARITY_WEIGHTS = [
  ["comum", 55],
  ["raro", 30],
  ["epico", 12],
  ["lendario", 3],
];

// Gerenciamento de Estado
const STORAGE_KEY = "sementis-loja-v1";
let state = {
  coins: START_COINS,
  owned: {},
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.coins === "number" && parsed.owned) {
        state = parsed;
        return;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar localStorage:", e);
  }
  state = { coins: START_COINS, owned: {} };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Erro ao salvar localStorage:", e);
  }
}

// Sistema de Notificações Toast (CSS Vanilla)
function showToast(title, description = "", type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toastItem = document.createElement("div");
  toastItem.className = `toast-item ${type === "success" ? "toast-item--success" : type === "error" ? "toast-item--error" : ""}`;

  const titleEl = document.createElement("div");
  titleEl.className = "toast-title";
  titleEl.innerText = title;
  toastItem.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement("div");
    descEl.className = "toast-desc";
    descEl.innerText = description;
    toastItem.appendChild(descEl);
  }

  container.appendChild(toastItem);

  // Animação de entrada
  setTimeout(() => {
    toastItem.classList.add("show");
  }, 10);

  // Remoção automática
  setTimeout(() => {
    toastItem.classList.remove("show");
    setTimeout(() => {
      toastItem.remove();
    }, 300);
  }, 3500);
}

const toast = {
  success: (title, options) => showToast(title, options?.description, "success"),
  error: (title, options) => showToast(title, options?.description, "error"),
  info: (title, options) => showToast(title, options?.description, "info"),
};

// Sorteio de Prêmio Gacha
function rollPrize() {
  const roll = Math.random() * 100;
  let acc = 0;
  let rarity = "comum";
  for (const [r, w] of RARITY_WEIGHTS) {
    acc += w;
    if (roll < acc) {
      rarity = r;
      break;
    }
  }
  const pool = GACHA_POOL.filter((p) => p.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// Variáveis de Estado de UI e Elementos DOM
let spinning = false;
let currentPrize = null;
let revealingPrize = null;
let shakeBtnTimeout = null;

const coinBalances = document.querySelectorAll("[data-testid='coin-balance-val']");
const gachaStatus = document.querySelector("[data-testid='gacha-status']");
const gachaMachineEl = document.querySelector("[data-testid='gacha-machine-container']");
const gachaKnob = document.querySelector("[data-testid='gacha-knob']");
const gachaChute = document.getElementById("gacha-chute-container");
const gachaSpinBtn = document.querySelector("[data-testid='gacha-spin-btn']");
const soundToggleBtn = document.querySelector("[data-testid='sound-toggle-btn']");
const resetBalanceBtn = document.querySelector("[data-testid='reset-balance-btn']");
const shopItensContainer = document.getElementById("itens");
const inventoryCountEl = document.querySelector("[data-testid='inventory-count']");
const inventoryContainer = document.getElementById("inventory-container-wrapper");

// Sons
let soundMuted = window.sounds?.isMuted ? window.sounds.isMuted() : false;

function updateSoundButton() {
  if (soundToggleBtn) {
    soundToggleBtn.innerHTML = soundMuted
      ? '<i data-lucide="volume-x" style="width: 18px; height: 18px;"></i>'
      : '<i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>';
    soundToggleBtn.title = soundMuted ? "Ativar sons" : "Silenciar sons";
    if (window.lucide) lucide.createIcons();
  }
}

// Scroll Suave
window.scrollToTarget = function (id) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
};

// Atualização de Saldo na Interface
function updateBalanceUI() {
  const formatted = state.coins.toLocaleString("pt-BR");
  coinBalances.forEach((el) => {
    el.innerText = formatted;
  });
  const headerMoedas = document.getElementById("header-moedas");
  if (headerMoedas) {
    headerMoedas.innerText = formatted;
  }
}

// Renderização dos Itens da Loja
function renderShop() {
  if (!shopItensContainer) return;
  shopItensContainer.innerHTML = "";

  SHOP_SECTIONS.forEach((section) => {
    const secDiv = document.createElement("div");
    secDiv.setAttribute("data-testid", `shop-section-${section.id}`);
    secDiv.style.marginBottom = "56px";

    // Cabeçalho da seção
    const headerHTML = `
      <div class="loja-shop-section-header">
        <span class="loja-shop-section-num">${section.num}</span>
        <div>
          <h2 class="loja-shop-section-title">${section.title}</h2>
          <p class="loja-shop-section-tagline">${section.tagline}</p>
        </div>
      </div>
    `;
    secDiv.innerHTML = headerHTML;

    // Grid de itens
    const gridDiv = document.createElement("div");
    gridDiv.className = "loja-shop-grid";

    section.items.forEach((item) => {
      const isOwned = Boolean(state.owned[item.id]);
      const missing = item.price - state.coins;
      const poor = !isOwned && missing > 0;

      const card = document.createElement("article");
      card.setAttribute("data-testid", `shop-card-${item.id}`);
      card.className = "loja-shop-card";

      // Badge de ícone
      const iconBadge = document.createElement("div");
      iconBadge.className = "loja-shop-card-icon";
      iconBadge.style.backgroundColor = `${item.tint}26`;
      iconBadge.style.borderColor = `${item.tint}55`;
      iconBadge.innerHTML = `<i data-lucide="${item.icon}" style="width: 28px; height: 28px; color: ${item.tint};"></i>`;
      card.appendChild(iconBadge);

      // Nome do item
      const title = document.createElement("h3");
      title.className = "loja-shop-card-name";
      title.innerText = item.name;
      card.appendChild(title);

      // Descrição
      const desc = document.createElement("p");
      desc.className = "loja-shop-card-desc";
      desc.innerText = item.desc;
      card.appendChild(desc);

      // Botão de compra
      const btn = document.createElement("button");
      btn.setAttribute("data-testid", `buy-btn-${item.id}`);
      btn.disabled = isOwned;

      if (isOwned) {
        btn.className = "loja-buy-btn loja-buy-btn--owned";
        btn.innerHTML = `<i data-lucide="check" style="width: 16px; height: 16px; stroke-width: 3;"></i> Adquirido`;
      } else if (poor) {
        btn.className = "loja-buy-btn loja-buy-btn--locked";
        btn.innerHTML = `<i data-lucide="lock" style="width: 16px; height: 16px; stroke-width: 2.5;"></i> Faltam ${missing.toLocaleString("pt-BR")} moedas`;
      } else {
        btn.className = "loja-buy-btn";
        btn.innerHTML = `
          Comprar
          <span class="loja-buy-btn-price">
            <img src="assets/icons/icone_moeda.png" alt="Moedas" style="width: 15px; height: 15px;" />
            ${item.price.toLocaleString("pt-BR")}
          </span>
        `;
      }

      // Evento de compra
      btn.addEventListener("click", () => {
        if (isOwned) return;
        const result = buyItem(item);
        if (result === "ok") {
          toast.success(`${item.name} adquirido!`, { description: "Já está na sua coleção." });
        } else if (result === "poor") {
          toast.error("Moedas insuficientes!", { description: `Faltam ${missing.toLocaleString("pt-BR")} moedas para este item.` });
        }
      });

      card.appendChild(btn);
      gridDiv.appendChild(card);
    });

    secDiv.appendChild(gridDiv);
    shopItensContainer.appendChild(secDiv);
  });

  if (window.lucide) lucide.createIcons();
}

function buyItem(item) {
  if (state.owned[item.id]) return "owned";
  if (state.coins < item.price) return "poor";

  state.coins -= item.price;
  state.owned[item.id] = true;
  saveState();

  updateBalanceUI();
  renderShop();
  renderInventory();
  if (window.sounds?.playBuy) window.sounds.playBuy();
  return "ok";
}

// Renderização do Inventário
function renderInventory() {
  if (!inventoryContainer || !inventoryCountEl) return;
  inventoryContainer.innerHTML = "";

  const ownedItems = ALL_ITEMS.filter((i) => state.owned[i.id]);
  inventoryCountEl.innerHTML = `${ownedItems.length} <span class="muted">de ${ALL_ITEMS.length}</span>`;

  if (ownedItems.length === 0) {
    inventoryContainer.innerHTML = `
      <div data-testid="inventory-empty" class="loja-inventory-empty">
        <i data-lucide="package-open" class="loja-inventory-empty-icon" style="stroke-width: 1.8;"></i>
        <h3>Sua coleção está vazia</h3>
        <p>
          Compre itens na loja ou gire a máquina de cápsulas para começar a colecionar tesouros da floresta.
        </p>
      </div>
    `;
  } else {
    const gridDiv = document.createElement("div");
    gridDiv.className = "loja-inventory-grid";

    ownedItems.forEach((item) => {
      const card = document.createElement("div");
      card.setAttribute("data-testid", `inventory-item-${item.id}`);
      card.className = "loja-inventory-card";

      card.innerHTML = `
        <span class="loja-inventory-card-icon" style="background-color: ${item.tint}26; border-color: ${item.tint}55;">
          <i data-lucide="${item.icon}" style="color: ${item.tint}; width: 22px; height: 22px; stroke-width: 2.3;"></i>
        </span>
        <span class="loja-inventory-card-name">${item.name}</span>
      `;
      gridDiv.appendChild(card);
    });

    inventoryContainer.appendChild(gridDiv);
  }

  if (window.lucide) lucide.createIcons();
}

// Atualizar Status da Tela LED
function updateGachaStatus(text) {
  if (gachaStatus) {
    gachaStatus.innerText = text;
  }
}

// Ação de Girar a Máquina (Spin)
function handleSpin() {
  if (spinning) return;

  if (state.coins < GACHA_COST) {
    if (window.sounds?.playError) window.sounds.playError();
    updateGachaStatus("SEM MOEDAS");

    if (gachaSpinBtn) {
      gachaSpinBtn.classList.add("shake-x");
      clearTimeout(shakeBtnTimeout);
      shakeBtnTimeout = setTimeout(() => {
        gachaSpinBtn.classList.remove("shake-x");
      }, 500);
    }

    toast.error("Moedas insuficientes!", {
      description: `Você precisa de ${GACHA_COST} moedas para girar a máquina. Complete missões e trilhas para ganhar mais!`,
    });

    setTimeout(() => {
      updateGachaStatus("PRONTO");
    }, 2000);
    return;
  }

  // Deduz moedas
  state.coins -= GACHA_COST;
  saveState();
  updateBalanceUI();
  renderShop();

  // Inicia animação
  spinning = true;
  gachaSpinBtn.disabled = true;
  gachaSpinBtn.innerHTML = `GIRANDO... <span class="gacha-spin-btn-price"><img src="assets/icons/icone_moeda.png" alt="Moeda" /> ${GACHA_COST}</span>`;
  updateGachaStatus("GIRANDO...");

  if (window.sounds?.playSpin) window.sounds.playSpin();

  if (gachaMachineEl) gachaMachineEl.classList.add("spinning-machine");

  // Limpa chute de prêmio
  if (gachaChute) gachaChute.innerHTML = "";

  // Sorteio
  const rolled = rollPrize();

  // Finaliza giro após 1.9s
  setTimeout(() => {
    spinning = false;
    if (gachaMachineEl) gachaMachineEl.classList.remove("spinning-machine");
    updateGachaStatus("PRÊMIO!");
    gachaSpinBtn.innerHTML = `GIRAR <span class="gacha-spin-btn-price"><img src="assets/icons/icone_moeda.png" alt="Moeda" /> ${GACHA_COST}</span>`;
    gachaSpinBtn.disabled = false;

    if (window.sounds?.playPop) window.sounds.playPop();

    // Mostra cápsula no chute
    const rarityColor = RARITY[rolled.rarity].color;
    if (gachaChute) {
      gachaChute.innerHTML = `
        <div class="animate-capsule-drop" style="position: relative; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; background: linear-gradient(180deg, ${rarityColor} 0%, ${rarityColor} 47%, #f5f5ff 53%, #d5d5ee 100%); box-shadow: inset -3px -4px 6px rgba(10,10,35,0.3), inset 3px 4px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(10,10,35,0.5);">
          <div style="position: absolute; left: 16%; top: 10%; width: 38%; height: 30%; border-radius: 50%; background: rgba(255,255,255,0.7); filter: blur(3px);"></div>
          <div style="position: absolute; left: 0; right: 0; top: 50%; height: 2px; transform: translateY(-50%); background: rgba(29,29,66,0.2);"></div>
        </div>
      `;
    }

    revealingPrize = rolled;
    showCapsuleReveal(rolled);
  }, 1900);
}

// Tela de Revelação da Cápsula (Split Capsule Animation)
function showCapsuleReveal(prize) {
  const r = RARITY[prize.rarity];
  const overlay = document.createElement("div");
  overlay.id = "capsule-reveal-overlay";
  overlay.className = "capsule-reveal-overlay";

  overlay.innerHTML = `
    <!-- Cápsula Gigante que vai rachar -->
    <div id="reveal-capsule" class="reveal-capsule">
      <!-- Metade Superior -->
      <div id="reveal-capsule-top" class="reveal-capsule-top" style="background: linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 50%), ${r.color}; box-shadow: inset 8px 12px 16px rgba(255,255,255,0.35), inset -6px -4px 10px rgba(10,10,35,0.25);">
        <div class="reveal-capsule-top-glare"></div>
      </div>
      <!-- Metade Inferior -->
      <div id="reveal-capsule-bottom" class="reveal-capsule-bottom"></div>
      <!-- Emenda do meio -->
      <div id="reveal-capsule-seam" class="reveal-capsule-seam"></div>
    </div>
    
    <p id="reveal-text" class="reveal-text">
      Abrindo cápsula...
    </p>
  `;

  document.body.appendChild(overlay);

  // Animação de entrada da cápsula
  setTimeout(() => {
    const capsule = document.getElementById("reveal-capsule");
    if (capsule) {
      capsule.classList.add("show");
      capsule.classList.add("animate-capsule-wiggle");
    }
  }, 50);

  // Racha a cápsula em 1.4s
  setTimeout(() => {
    const topHalf = document.getElementById("reveal-capsule-top");
    const bottomHalf = document.getElementById("reveal-capsule-bottom");
    const seam = document.getElementById("reveal-capsule-seam");
    const revealText = document.getElementById("reveal-text");
    const capsule = document.getElementById("reveal-capsule");

    if (capsule) capsule.classList.remove("animate-capsule-wiggle");
    if (topHalf) {
      topHalf.style.transform = "translateY(-130px) translateX(-36px) rotate(-30deg)";
      topHalf.style.opacity = "0";
    }
    if (bottomHalf) {
      bottomHalf.style.transform = "translateY(130px) translateX(36px) rotate(26deg)";
      bottomHalf.style.opacity = "0";
    }
    if (seam) seam.style.opacity = "0";
    if (revealText) revealText.style.opacity = "0";

    if (window.sounds?.playCrack) window.sounds.playCrack();

    // Flash visual
    const flash = document.createElement("div");
    flash.className = "reveal-flash animate-radial-flash";
    flash.style.background = `radial-gradient(circle, ${r.color}cc, transparent 65%)`;
    overlay.appendChild(flash);

    // Partículas saindo da cápsula
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 110 + (i % 3) * 30;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;
      const shardColor = ["#FFFFFF", "#FFC107", "#a9ff71"][i % 3];

      const shard = document.createElement("span");
      shard.className = "reveal-shard";
      shard.style.backgroundColor = shardColor;
      overlay.appendChild(shard);

      setTimeout(() => {
        shard.style.transform = `translate(${destX}px, ${destY}px) scale(1) rotate(200deg)`;
        shard.style.opacity = "0";
      }, 20);
    }
  }, 1400);

  // Finaliza a revelação e abre modal do prêmio em 2.3s
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      if (window.sounds?.playReveal) window.sounds.playReveal(prize.rarity);
      showPrizeModal(prize);
    }, 300);
  }, 2300);
}

// Modal do Prêmio Recebido
function showPrizeModal(prize) {
  currentPrize = prize;
  const r = RARITY[prize.rarity];
  const big = prize.rarity === "epico" || prize.rarity === "lendario";

  const overlay = document.createElement("div");
  overlay.id = "prize-modal-overlay";
  overlay.className = "prize-overlay";

  // Fundo com blur
  const bg = document.createElement("div");
  bg.className = "prize-overlay-bg";
  overlay.appendChild(bg);

  // Confetes para épico ou lendário
  if (big) {
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const dist = 120 + (i % 4) * 35;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;
      const confColor = ["#a9ff71", "#FFC107", "#4FC3F7", "#FF4B6E", "#C084FC"][i % 5];

      const confetti = document.createElement("span");
      confetti.className = "prize-confetti";
      confetti.style.backgroundColor = confColor;
      overlay.appendChild(confetti);

      setTimeout(() => {
        confetti.style.transform = `translate(${destX - 5}px, ${destY - 5}px) scale(1) rotate(180deg)`;
        confetti.style.opacity = "0";
      }, 50);
    }
  }

  // Card do prêmio
  const card = document.createElement("div");
  card.className = "prize-card";

  card.innerHTML = `
    <div class="prize-glow" style="background-color: ${r.color}55;"></div>

    <span data-testid="prize-rarity-badge" class="prize-rarity-badge" style="background-color: ${r.color}22; color: ${r.color};">
      ${r.label}
    </span>

    <div class="prize-icon-box" style="background-color: ${r.color}2e; border-color: ${r.color}66;">
      <i data-lucide="${prize.icon}" style="color: ${r.color}; stroke-width: 2.2;"></i>
    </div>

    <h3 data-testid="prize-name" class="prize-name">
      ${prize.name}
    </h3>
    <p class="prize-desc">${prize.desc}</p>

    <button data-testid="gacha-collect-btn" class="prize-collect-btn">
      <i data-lucide="gift" style="width: 18px; height: 18px; stroke-width: 2.5;"></i>
      Coletar prêmio
    </button>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);
  if (window.lucide) lucide.createIcons();

  // Transição de entrada
  setTimeout(() => {
    overlay.classList.add("show");
  }, 30);

  // Clique para coletar
  const collectBtn = card.querySelector("[data-testid='gacha-collect-btn']");
  collectBtn.addEventListener("click", () => {
    collectPrize();
  });
}

function collectPrize() {
  if (!currentPrize) return;

  const prize = currentPrize;
  if (prize.type === "coins") {
    state.coins += prize.amount;
    toast.success(`+${prize.amount} moedas no cofrinho!`);
  } else {
    state.owned[prize.itemId] = true;
    toast.success(`${prize.name} foi para a sua coleção!`);
  }

  saveState();
  updateBalanceUI();
  renderShop();
  renderInventory();

  // Limpa chute
  if (gachaChute) gachaChute.innerHTML = `<span class="gacha-chute-label">Saída do prêmio</span>`;
  updateGachaStatus("PRONTO");

  // Fecha modal com transição
  const overlay = document.getElementById("prize-modal-overlay");
  if (overlay) {
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      currentPrize = null;
      revealingPrize = null;
    }, 300);
  }
}

// Reiniciar Saldo
function handleReset() {
  state.coins = START_COINS;
  state.owned = {};
  saveState();

  updateBalanceUI();
  renderShop();
  renderInventory();

  toast.info("Saldo reiniciado", {
    description: "Você voltou a ter 1.000 moedas de demonstração.",
  });
}

// Alternar Sons
function toggleSound() {
  soundMuted = !soundMuted;
  if (window.sounds?.setMuted) {
    window.sounds.setMuted(soundMuted);
  }
  updateSoundButton();

  toast.info(soundMuted ? "Sons desativados" : "Sons ativados", {
    description: soundMuted ? "A máquina ficará em silêncio." : "Manivela, chocalho e fanfarras ligados.",
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadState();

  updateBalanceUI();
  renderShop();
  renderInventory();
  updateSoundButton();

  // Listeners estáticos
  if (gachaSpinBtn) {
    gachaSpinBtn.addEventListener("click", handleSpin);
  }
  if (gachaKnob) {
    gachaKnob.addEventListener("click", handleSpin);
  }
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", toggleSound);
  }
  if (resetBalanceBtn) {
    resetBalanceBtn.addEventListener("click", handleReset);
  }

  if (window.lucide) lucide.createIcons();
});
