// Data Configuration
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
      { id: "av-broto", name: "Broto Guerreiro", desc: "Pequeno, mas corajoso. O avatar de quem está começando a jornada.", price: 250, icon: "sprout", tint: "#7BE85B" },
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
      { id: "vd-coracao", name: "Coração Extra", desc: "Uma vida a mais para não perder a sequência de estudos.", price: 150, icon: "heart", tint: "#FF4B4B" },
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
      { id: "pw-xp", name: "XP em Dobro", desc: "Dobra todo o XP ganho nas próximas 5 lições.", price: 200, icon: "star", tint: "#7BE85B" },
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

// App State Management
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

// Custom Toast Toaster Implementation
function showToast(title, description = "", type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toastItem = document.createElement("div");
  toastItem.className = `toast-item border-l-4 p-4 rounded-xl flex flex-col gap-1 shadow-lg bg-[#3d3d7a] border-white/10 text-white font-semibold min-w-[280px] max-w-[380px] transition-all duration-300 transform translate-y-4 opacity-0`;
  
  if (type === "success") {
    toastItem.style.borderLeftColor = "#7BE85B";
  } else if (type === "error") {
    toastItem.style.borderLeftColor = "#FF4B4B";
  } else {
    toastItem.style.borderLeftColor = "#4FC3F7";
  }

  const titleEl = document.createElement("div");
  titleEl.className = "text-sm font-bold font-display";
  titleEl.innerText = title;
  toastItem.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement("div");
    descEl.className = "text-xs text-[#B8B8E6] font-normal";
    descEl.innerText = description;
    toastItem.appendChild(descEl);
  }

  container.appendChild(toastItem);

  // Trigger entering animation
  setTimeout(() => {
    toastItem.classList.remove("translate-y-4", "opacity-0");
  }, 10);

  // Automatically remove toast after 3.5 seconds
  setTimeout(() => {
    toastItem.classList.add("translate-y-2", "opacity-0");
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

// Roll Gacha Function
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

// UI State / DOM Elements variables
let spinning = false;
let currentPrize = null;
let revealingPrize = null;
let shakeBtnTimeout = null;

// DOM Selectors
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

// Sound Toggle state helper
let soundMuted = window.sounds.isMuted();

function updateSoundButton() {
  if (soundToggleBtn) {
    soundToggleBtn.innerHTML = soundMuted
      ? '<i data-lucide="volume-x" class="h-4 w-4"></i>'
      : '<i data-lucide="volume-2" class="h-4 w-4"></i>';
    soundToggleBtn.title = soundMuted ? "Ativar sons" : "Silenciar sons";
    lucide.createIcons();
  }
}

// Smooth scroll implementation helper
window.scrollToTarget = function (id) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
};

// UI Rendering Functions
function updateBalanceUI() {
  coinBalances.forEach((el) => {
    // Basic counter increment or instant replacement
    el.innerText = state.coins.toLocaleString("pt-BR");
  });
}

function renderShop() {
  if (!shopItensContainer) return;
  shopItensContainer.innerHTML = "";

  SHOP_SECTIONS.forEach((section) => {
    const secDiv = document.createElement("div");
    secDiv.setAttribute("data-testid", `shop-section-${section.id}`);
    secDiv.className = "space-y-10";

    // Section header
    const headerHTML = `
      <div class="flex items-end gap-6 mb-10">
        <span class="font-display text-outline text-6xl font-bold leading-none sm:text-7xl">${section.num}</span>
        <div class="pb-1">
          <h2 class="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">${section.title}</h2>
          <p class="mt-1 text-sm font-semibold text-[#B8B8E6]">${section.tagline}</p>
        </div>
      </div>
    `;
    secDiv.innerHTML = headerHTML;

    // Grid Container
    const gridDiv = document.createElement("div");
    gridDiv.className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    section.items.forEach((item) => {
      const isOwned = Boolean(state.owned[item.id]);
      const missing = item.price - state.coins;
      const poor = !isOwned && missing > 0;

      const card = document.createElement("article");
      card.setAttribute("data-testid", `shop-card-${item.id}`);
      card.className = "group flex flex-col rounded-[1.6rem] border border-white/10 border-b-[6px] border-b-black/40 bg-[#3D3D7A] p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1.5 hover:border-white/20";

      // Icon badge
      const iconBadge = document.createElement("div");
      iconBadge.className = "flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6";
      iconBadge.style.backgroundColor = `${item.tint}26`;
      iconBadge.style.borderColor = `${item.tint}55`;
      iconBadge.innerHTML = `<i data-lucide="${item.icon}" class="h-8 w-8" style="color: ${item.tint}"></i>`;
      card.appendChild(iconBadge);

      // Title & description
      const title = document.createElement("h3");
      title.className = "font-display mt-5 text-lg font-semibold text-white";
      title.innerText = item.name;
      card.appendChild(title);

      const desc = document.createElement("p");
      desc.className = "mt-2 flex-1 text-sm font-semibold leading-relaxed text-[#B8B8E6]";
      desc.innerText = item.desc;
      card.appendChild(desc);

      // Buy button
      const btn = document.createElement("button");
      btn.setAttribute("data-testid", `buy-btn-${item.id}`);
      btn.disabled = isOwned;

      if (isOwned) {
        btn.className = "font-display mt-6 flex items-center justify-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-sm font-bold cursor-default border-black/30 bg-white/10 text-[#B8B8E6]";
        btn.innerHTML = `<i data-lucide="check" class="h-4 w-4" style="stroke-width: 3"></i> Adquirido`;
      } else if (poor) {
        btn.className = "font-display mt-6 flex items-center justify-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-sm font-bold border-[#7a2b2b] bg-[#FF4B4B]/15 text-[#ff9d9d] hover:bg-[#FF4B4B]/25 active:translate-y-1 active:border-b-0";
        btn.innerHTML = `<i data-lucide="lock" class="h-4 w-4" style="stroke-width: 2.6"></i> Faltam ${missing.toLocaleString("pt-BR")} moedas`;
      } else {
        btn.className = "font-display mt-6 flex items-center justify-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-sm font-bold border-[#4ea331] bg-[#7BE85B] text-[#1d1d42] hover:bg-[#8cf06d] active:translate-y-1 active:border-b-0";
        btn.innerHTML = `
          Comprar
          <span class="flex items-center gap-1 rounded-full bg-[#1d1d42]/15 px-2.5 py-0.5 text-xs">
            <i data-lucide="coins" class="h-3.5 w-3.5" style="stroke-width: 2.6"></i>
            ${item.price.toLocaleString("pt-BR")}
          </span>
        `;
      }

      // Buy action
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
  
  lucide.createIcons();
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
  return "ok";
}

function renderInventory() {
  if (!inventoryContainer || !inventoryCountEl) return;
  inventoryContainer.innerHTML = "";

  const ownedItems = ALL_ITEMS.filter((i) => state.owned[i.id]);
  inventoryCountEl.innerHTML = `${ownedItems.length} <span class="text-[#B8B8E6]">de ${ALL_ITEMS.length}</span>`;

  if (ownedItems.length === 0) {
    inventoryContainer.innerHTML = `
      <div data-testid="inventory-empty" class="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-dashed border-white/15 bg-[#3D3D7A]/40 px-8 py-20 text-center w-full">
        <i data-lucide="package-open" class="h-12 w-12 text-[#B8B8E6]/60" style="stroke-width: 1.8"></i>
        <p class="font-display text-xl font-semibold text-white">Sua coleção está vazia</p>
        <p class="max-w-sm text-sm font-semibold text-[#B8B8E6]">
          Compre itens na loja ou gire a máquina de cápsulas para começar a colecionar tesouros da floresta.
        </p>
      </div>
    `;
  } else {
    const gridDiv = document.createElement("div");
    gridDiv.className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full";

    ownedItems.forEach((item) => {
      const card = document.createElement("div");
      card.setAttribute("data-testid", `inventory-item-${item.id}`);
      card.className = "flex items-center gap-4 rounded-3xl border border-white/10 border-b-4 border-b-black/40 bg-[#3D3D7A] p-5";

      card.innerHTML = `
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2" style="background-color: ${item.tint}26; border-color: ${item.tint}55">
          <i data-lucide="${item.icon}" class="h-6 w-6" style="color: ${item.tint}; stroke-width: 2.3"></i>
        </span>
        <span class="font-display text-sm font-semibold leading-tight text-white">${item.name}</span>
      `;
      gridDiv.appendChild(card);
    });

    inventoryContainer.appendChild(gridDiv);
  }

  lucide.createIcons();
}

// Gacha Machine Functions
function updateGachaStatus(statusText) {
  if (gachaStatus) {
    gachaStatus.innerText = statusText;
  }
}

function handleSpin() {
  if (spinning || currentPrize || revealingPrize) return;

  if (state.coins < GACHA_COST) {
    if (gachaSpinBtn) {
      gachaSpinBtn.classList.add("shake-x");
      setTimeout(() => gachaSpinBtn.classList.remove("shake-x"), 500);
    }
    toast.error("Moedas insuficientes!", {
      description: `Um giro custa ${GACHA_COST} moedas. Complete missões no app para ganhar mais.`,
    });
    return;
  }

  // Deduct coins & play sounds
  state.coins -= GACHA_COST;
  saveState();
  updateBalanceUI();
  renderShop(); // Refresh lock triggers

  window.sounds.playCrank();
  window.sounds.playRattle();

  spinning = true;
  updateGachaStatus("GIRANDO...");
  gachaSpinBtn.innerText = "GIRANDO...";
  gachaSpinBtn.disabled = true;
  
  // Trigger animations via parent class
  gachaMachineEl.classList.add("spinning-machine");

  // Choose prize
  const rolled = rollPrize();

  // Clear chute prize capsule representation if any exists
  gachaChute.innerHTML = "";

  setTimeout(() => {
    // Spin animation finishes
    spinning = false;
    gachaMachineEl.classList.remove("spinning-machine");
    updateGachaStatus("PRÊMIO!");
    gachaSpinBtn.innerHTML = `GIRAR <span class="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm bg-[#1d1d42]/15">
      <i data-lucide="coins" class="h-4 w-4" style="stroke-width: 2.6"></i> ${GACHA_COST}
    </span>`;
    gachaSpinBtn.disabled = false;
    
    // Play drop sound
    window.sounds.playPop();

    // Show capsule in chute
    const rarityColor = RARITY[rolled.rarity].color;
    gachaChute.innerHTML = `
      <div class="relative h-12 w-12 rounded-full cursor-pointer animate-capsule-drop" style="background: linear-gradient(180deg, ${rarityColor} 0%, ${rarityColor} 47%, #f5f5ff 53%, #d5d5ee 100%); box-shadow: inset -3px -4px 6px rgba(10,10,35,0.3), inset 3px 4px 6px rgba(255,255,255,0.4), 0 6px 12px rgba(10,10,35,0.5);">
        <div class="absolute left-[16%] top-[10%] h-[30%] w-[38%] rounded-full bg-white/70 blur-[3px]"></div>
        <div class="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#1d1d42]/15"></div>
      </div>
    `;

    revealingPrize = rolled;
    showCapsuleReveal(rolled);
  }, 1900);
}

// Capsule Reveal Overlay Screen
function showCapsuleReveal(prize) {
  const r = RARITY[prize.rarity];
  const overlay = document.createElement("div");
  overlay.id = "capsule-reveal-overlay";
  overlay.className = "fixed inset-0 z-[85] flex flex-col items-center justify-center bg-[#14142f]/70 backdrop-blur-sm transition-all duration-300";

  overlay.innerHTML = `
    <!-- Split Capsule Visual -->
    <div id="reveal-capsule" class="relative h-44 w-44 sm:h-52 sm:w-52 transition-all duration-500 transform scale-75 opacity-0">
      <!-- Top Half -->
      <div id="reveal-capsule-top" class="absolute inset-x-0 top-0 h-1/2 rounded-t-full border-[5px] border-b-0 border-[#1c1c40] transition-all duration-700 ease-out" style="background: linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 50%), ${r.color}; box-shadow: inset 8px 12px 16px rgba(255,255,255,0.35), inset -6px -4px 10px rgba(10,10,35,0.25);">
        <div class="absolute left-[18%] top-[24%] h-[34%] w-[36%] rounded-full bg-white/70 blur-[6px]"></div>
      </div>
      <!-- Bottom Half -->
      <div id="reveal-capsule-bottom" class="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full border-[5px] border-t-0 border-[#1c1c40] transition-all duration-700 ease-out" style="background: linear-gradient(180deg, #f7f7ff, #c9c9e6); box-shadow: inset -8px -12px 16px rgba(10,10,35,0.28), inset 6px 4px 10px rgba(255,255,255,0.5);"></div>
      <!-- Middle seam -->
      <div id="reveal-capsule-seam" class="absolute inset-x-1 top-1/2 z-10 h-[3px] -translate-y-1/2 rounded-full bg-[#1d1d42]/25"></div>
    </div>
    
    <p id="reveal-text" class="font-display mt-12 text-sm font-semibold uppercase tracking-[0.3em] text-[#B8B8E6] transition-opacity duration-300">
      Abrindo cápsula...
    </p>
  `;

  document.body.appendChild(overlay);

  // Transition Scale
  setTimeout(() => {
    const capsule = document.getElementById("reveal-capsule");
    if (capsule) capsule.className = "relative h-44 w-44 sm:h-52 sm:w-52 transition-all duration-500 transform scale-100 opacity-100 animate-capsule-wiggle";
  }, 50);

  // Split Capsule open at 1.4s
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

    // Play crack sounds & flash glow
    window.sounds.playCrack();

    // Trigger visual flash
    const flash = document.createElement("div");
    flash.className = "absolute h-56 w-56 rounded-full animate-radial-flash";
    flash.style.background = `radial-gradient(circle, ${r.color}cc, transparent 65%)`;
    overlay.appendChild(flash);

    // Particles/shards
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 110 + (i % 3) * 30;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;
      const shardColor = ["#FFFFFF", "#FFC107", "#7BE85B"][i % 3];

      const shard = document.createElement("span");
      shard.className = "absolute h-2.5 w-2.5 rounded-sm pointer-events-none transition-all duration-700 ease-out transform scale-0";
      shard.style.backgroundColor = shardColor;
      overlay.appendChild(shard);

      setTimeout(() => {
        shard.style.transform = `translate(${destX}px, ${destY}px) scale(1) rotate(200deg)`;
        shard.style.opacity = "0";
      }, 20);
    }
  }, 1400);

  // Complete reveal at 2.3s
  setTimeout(() => {
    // Remove reveal screen
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      
      // Play Fanfare
      window.sounds.playReveal(prize.rarity);
      
      // Show Prize Modal
      showPrizeModal(prize);
    }, 300);
  }, 2300);
}

// Prize Modal Presentation Overlay
function showPrizeModal(prize) {
  currentPrize = prize;
  const r = RARITY[prize.rarity];
  const big = prize.rarity === "epico" || prize.rarity === "lendario";

  const overlay = document.createElement("div");
  overlay.id = "prize-modal-overlay";
  overlay.className = "fixed inset-0 z-[90] flex items-center justify-center p-4 transition-all duration-300 opacity-0";

  // Overlay background
  const bg = document.createElement("div");
  bg.className = "absolute inset-0 bg-[#14142f]/80 backdrop-blur-md";
  overlay.appendChild(bg);

  // Confetti particles for Epic/Legendary
  if (big) {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = 110 + (i % 4) * 30;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist;
      const confColor = ["#7BE85B", "#FFC107", "#4FC3F7", "#FF4B6E", "#C084FC"][i % 5];

      const confetti = document.createElement("span");
      confetti.className = "absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-sm pointer-events-none transition-all duration-1000 ease-out transform -translate-x-1/2 -translate-y-1/2 scale-0";
      confetti.style.backgroundColor = confColor;
      overlay.appendChild(confetti);

      setTimeout(() => {
        confetti.style.transform = `translate(${destX - 5}px, ${destY - 5}px) scale(1) rotate(180deg)`;
        confetti.style.opacity = "0";
      }, 50);
    }
  }

  // Modal Card Content
  const card = document.createElement("div");
  card.className = "relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-[#3D3D7A] p-8 text-center shadow-[0_40px_90px_rgba(8,8,28,0.7)] transform scale-50 transition-all duration-500";

  card.innerHTML = `
    <div class="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-[70px]" style="background-color: ${r.color}55;"></div>

    <span data-testid="prize-rarity-badge" class="relative inline-block rounded-full px-4 py-1 text-xs font-extrabold uppercase tracking-[0.2em]" style="background-color: ${r.color}22; color: ${r.color};">
      ${r.label}
    </span>

    <div class="relative mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-[1.6rem] border-b-[6px]" style="background-color: ${r.color}2e; border-color: ${r.color}66;">
      <i data-lucide="${prize.icon}" class="h-12 w-12" style="color: ${r.color}; stroke-width: 2.2"></i>
    </div>

    <h3 data-testid="prize-name" class="font-display relative mt-6 text-2xl font-bold tracking-tight text-white">
      ${prize.name}
    </h3>
    <p class="relative mt-2 text-sm font-semibold text-[#B8B8E6]">${prize.desc}</p>

    <button data-testid="gacha-collect-btn" class="font-display relative mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border-b-[5px] border-[#4ea331] bg-[#7BE85B] px-6 py-3.5 text-base font-bold text-[#1d1d42] transition-[transform,background-color,border-width] duration-150 hover:bg-[#8cf06d] active:translate-y-1 active:border-b-0">
      <i data-lucide="gift" class="h-5 w-5" style="stroke-width: 2.5"></i>
      Coletar prêmio
    </button>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);
  lucide.createIcons();

  // Entrance Transition
  setTimeout(() => {
    overlay.style.opacity = "1";
    card.style.transform = "scale(1)";
  }, 50);

  // Collect handler
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

  // Clear chute image
  if (gachaChute) gachaChute.innerHTML = `<span class="text-[10px] font-extrabold uppercase tracking-widest text-[#B8B8E6]/50">Saída do prêmio</span>`;
  updateGachaStatus("PRONTO");

  // Close modal with transition
  const overlay = document.getElementById("prize-modal-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      currentPrize = null;
      revealingPrize = null;
    }, 300);
  }
}

// Reset Balance
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

// Sound Button Toggle Action
function toggleSound() {
  soundMuted = !soundMuted;
  window.sounds.setMuted(soundMuted);
  updateSoundButton();

  toast.info(soundMuted ? "Sons desativados" : "Sons ativados", {
    description: soundMuted ? "A máquina ficará em silêncio." : "Manivela, chocalho e fanfarras ligados.",
  });
}

// Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadState();

  // Draw initial values
  updateBalanceUI();
  renderShop();
  renderInventory();
  updateSoundButton();

  // Bind static page buttons
  if (gachaSpinBtn) {
    gachaSpinBtn.addEventListener("click", handleSpin);
  }
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", toggleSound);
  }
  if (resetBalanceBtn) {
    resetBalanceBtn.addEventListener("click", handleReset);
  }

  // Draw Lucide icons
  lucide.createIcons();
});
