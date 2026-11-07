const cartas = [
  { id: 'c1', nome: 'Névoa Curativa', elemento: 'agua', poder: 7, icone: '💧', fato: 'Reuso de água economiza até 50% do consumo doméstico.' },
  { id: 'c2', nome: 'Tsunami Verde', elemento: 'agua', poder: 9, icone: '🌊', fato: 'Rios preservados mantêm o ciclo da chuva ativo.' },
  { id: 'c3', nome: 'Cristal Hídrico', elemento: 'agua', poder: 6, icone: '🪷', fato: 'Plantas aquáticas filtram água naturalmente.' },
  { id: 'c4', nome: 'Torre Solar', elemento: 'energia', poder: 9, icone: '☀', fato: 'A luz solar pode abastecer o planeta por um ano a cada hora.' },
  { id: 'c5', nome: 'Vento Cortante', elemento: 'energia', poder: 8, icone: '🌬', fato: 'Energia eólica não emite gases poluentes.' },
  { id: 'c6', nome: 'Pulso Elétrico', elemento: 'energia', poder: 7, icone: '⚡', fato: 'Lâmpadas LED consomem 80% menos energia.' },
  { id: 'c7', nome: 'Ciclo Vital', elemento: 'residuo', poder: 8, icone: '♻', fato: 'Reciclar uma latinha economiza energia para 3h de TV.' },
  { id: 'c8', nome: 'Terra Fértil', elemento: 'residuo', poder: 6, icone: '🌱', fato: 'Compostagem transforma lixo orgânico em adubo.' },
  { id: 'c9', nome: 'Escudo Reuso', elemento: 'residuo', poder: 5, icone: '👜', fato: 'Sacolas reutilizáveis evitam milhares de plásticos por ano.' },
  { id: 'c10', nome: 'Guardião Florestal', elemento: 'vegetacao', poder: 9, icone: '🌳', fato: 'Uma árvore adulta absorve até 22kg de CO₂ por ano.' },
  { id: 'c11', nome: 'Semente Explosiva', elemento: 'vegetacao', poder: 7, icone: '🌿', fato: 'Reflorestar recupera ecossistemas em décadas.' },
  { id: 'c12', nome: 'Raiz Profunda', elemento: 'vegetacao', poder: 6, icone: '🌴', fato: 'Mata ciliar protege rios contra erosão.' },
];

const ameacas = [
  { id: 'f1', nome: 'Queimada', elemento: 'agua', poder: 7, icone: '🔥', fato: 'Queimadas destroem biomas e liberam CO₂.' },
  { id: 'f2', nome: 'Lixo Tóxico', elemento: 'residuo', poder: 6, icone: '🗑', fato: 'Plástico nos rios mata fauna aquática.' },
  { id: 'f3', nome: 'Desmatamento', elemento: 'vegetacao', poder: 8, icone: '🪓', fato: 'Desmatar reduz chuva e aumenta a seca.' },
  { id: 'f4', nome: 'Carvão Fóssil', elemento: 'energia', poder: 7, icone: '🏭', fato: 'Combustíveis fósseis são a maior fonte de CO₂.' },
  { id: 'f5', nome: 'Vazamento', elemento: 'vegetacao', poder: 6, icone: '🛢', fato: 'Petróleo no mar sufoca plantas e animais.' },
  { id: 'f6', nome: 'Agrotóxico', elemento: 'residuo', poder: 5, icone: '☣', fato: 'Venenos agrícolas contaminam solo e água.' },
  { id: 'f7', nome: 'Seca Extrema', elemento: 'agua', poder: 8, icone: '🏜', fato: 'O deserto avança onde a vegetação sumiu.' },
  { id: 'f8', nome: 'Fumaça Negra', elemento: 'energia', poder: 6, icone: '☁', fato: 'Poluição do ar causa milhões de mortes por ano.' },
];

const meta = {
  agua: { label: 'ÁGUA', cor: '#3ec5e8', glow: 'rgba(62,197,232,.4)', icone: '◌' },
  energia: { label: 'ENERGIA', cor: '#ffb11b', glow: 'rgba(255,177,27,.4)', icone: '☀' },
  residuo: { label: 'RESÍDUO', cor: '#b47ee0', glow: 'rgba(180,126,224,.4)', icone: '♻' },
  vegetacao: { label: 'VEGETAÇÃO', cor: '#7ec850', glow: 'rgba(126,200,80,.4)', icone: '☘' },
};

const vantagem = { agua: 'energia', energia: 'vegetacao', vegetacao: 'residuo', residuo: 'agua' };
const MAX_HP = 5;
const TOTAL_ROUNDS = 5;

const sons = {
  contexto: null,
  ganho: null,
  musica: null,
  indice: 0,
  mudo: false,
  garantirContexto() {
    if (!this.contexto) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.contexto = new AudioContext();
      this.ganho = this.contexto.createGain();
      this.ganho.gain.value = 0.18;
      this.ganho.connect(this.contexto.destination);
    }
    if (this.contexto.state === 'suspended') this.contexto.resume();
    return true;
  },
  tom(frequencia, inicio, duracao, volume = 0.08, tipo = 'triangle') {
    if (this.mudo || !this.garantirContexto()) return;
    const oscilador = this.contexto.createOscillator();
    const ganho = this.contexto.createGain();
    oscilador.type = tipo;
    oscilador.frequency.setValueAtTime(frequencia, inicio);
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
    oscilador.connect(ganho).connect(this.ganho);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracao + 0.04);
  },
  ruido(volume = 0.08, duracao = 0.08, frequencia = 1800) {
    if (this.mudo || !this.garantirContexto()) return;
    const tamanho = Math.floor(this.contexto.sampleRate * duracao);
    const buffer = this.contexto.createBuffer(1, tamanho, this.contexto.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let indice = 0; indice < tamanho; indice += 1) dados[indice] = (Math.random() * 2 - 1) * (1 - indice / tamanho);
    const fonte = this.contexto.createBufferSource();
    const filtro = this.contexto.createBiquadFilter();
    const ganho = this.contexto.createGain();
    fonte.buffer = buffer;
    filtro.type = 'bandpass';
    filtro.frequency.value = frequencia;
    filtro.Q.value = 1.2;
    ganho.gain.value = volume;
    fonte.connect(filtro).connect(ganho).connect(this.ganho);
    fonte.start();
  },
  iniciarMusica() {
    if (this.musica || !this.garantirContexto()) return;
    const melodia = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const acordes = [[130.81, 164.81, 196], [146.83, 174.61, 220], [164.81, 196, 246.94], [174.61, 220, 261.63]];
    this.musica = window.setInterval(() => {
      const inicio = this.contexto.currentTime;
      const nota = melodia[this.indice % melodia.length];
      const acorde = acordes[this.indice % acordes.length];
      this.tom(nota, inicio, 0.42, 0.025, 'sine');
      acorde.forEach((frequencia, indice) => this.tom(frequencia, inicio, 0.54, indice === 0 ? 0.024 : 0.012, 'triangle'));
      this.indice += 1;
    }, 520);
  },
  carta() {
    if (!this.garantirContexto()) return;
    const inicio = this.contexto.currentTime;
    this.tom(392, inicio, 0.12, 0.08);
    this.tom(587.33, inicio + 0.07, 0.18, 0.06);
  },
  revelar() {
    if (!this.garantirContexto()) return;
    const inicio = this.contexto.currentTime;
    [329.63, 392, 493.88, 659.25].forEach((nota, indice) => this.tom(nota, inicio + indice * 0.08, 0.22, 0.07));
    this.ruido(0.035, 0.12, 2800);
  },
  resultado(tipo) {
    if (!this.garantirContexto()) return;
    const inicio = this.contexto.currentTime;
    if (tipo === 'player') {
      [523.25, 659.25, 783.99, 1046.5].forEach((nota, indice) => this.tom(nota, inicio + indice * 0.1, 0.32, 0.09));
    } else if (tipo === 'foe') {
      this.tom(220, inicio, 0.3, 0.1, 'sawtooth');
      this.tom(146.83, inicio + 0.16, 0.4, 0.09, 'square');
      this.ruido(0.12, 0.16, 500);
    } else {
      this.tom(392, inicio, 0.28, 0.08);
      this.tom(392, inicio + 0.2, 0.28, 0.08);
    }
  },
  proxima() {
    if (!this.garantirContexto()) return;
    const inicio = this.contexto.currentTime;
    this.tom(392, inicio, 0.12, 0.06);
    this.tom(523.25, inicio + 0.1, 0.16, 0.07);
  },
  alternar() {
    this.mudo = !this.mudo;
    if (!this.mudo) { this.garantirContexto(); this.iniciarMusica(); }
    return !this.mudo;
  },
};

const estado = {
  fase: 'intro', rodada: 1, ninjaHp: MAX_HP, inimigoHp: MAX_HP,
  mao: [], maoInimigo: [], selecionada: null, jogadaInimigo: null,
  resultado: null, fatos: [], pontos: 0, vencedor: null,
};

function icone(nome, tamanho = 16) {
  const caminhos = {
    folha: '<path d="M20 4C12 4 5 8 4 20c12-1 16-8 16-16Z"/><path d="M4 20 14 10"/>',
    voltar: '<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
    raio: '<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>',
    espadas: '<path d="m14.5 4.5 5 5-10 10-5-1 .5-4.5L15 5Z"/><path d="m13 6 5 5M4 4h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    fechar: '<path d="m6 6 12 12M18 6 6 18"/>',
    repetir: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
  };
  return `<svg width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${caminhos[nome] || ''}</svg>`;
}

function sortear(lista, quantidade) {
  const copia = [...lista];
  const resultado = [];
  while (resultado.length < quantidade && copia.length) {
    resultado.push(copia.splice(Math.floor(Math.random() * copia.length), 1)[0]);
  }
  return resultado;
}

function cartaHtml(carta, opcoes = {}) {
  if (opcoes.virada) {
    return `<div class="card face-down ${opcoes.animacao || ''}"><div class="fd-back"><div class="fd-sigil">✦</div><div class="fd-runes">◇ ◆ ◇</div></div></div>`;
  }
  const elemento = meta[carta.elemento];
  const classes = ['card', opcoes.estado || '', opcoes.animacao || '', opcoes.inimigo ? 'foe-card' : ''].filter(Boolean).join(' ');
  return `<div class="${classes}" style="--el:${elemento.cor};--el-glow:${elemento.glow}">
    <div class="card-foil"></div><div class="card-cost-gem">${carta.poder}</div>
    <div class="card-el-tag"><span aria-hidden="true">${elemento.icone}</span> ${elemento.label}</div>
    <div class="card-art"><div class="art-radial"></div><div class="art-ring"></div><span class="art-icon">${carta.icone}</span><i class="art-sweep"></i></div>
    <div class="card-name">${carta.nome}</div><div class="card-power"><div class="power-orb">${carta.poder}</div><small>FORÇA</small></div>
  </div>`;
}

function lutadorHtml(tipo, nome, hp) {
  const ninja = tipo === 'ninja';
  const accent = ninja ? '#abff65' : '#ff5a3a';
  const corpo = ninja ? `<div class="ninja"><div class="nj-headband"><span></span></div><div class="nj-mask"><div class="nj-eyes"><i></i><i></i></div></div><div class="nj-scarf"></div><div class="nj-body">🌿</div><div class="nj-belt"></div></div>` : `<div class="polluter"><div class="pl-helm"><div class="pl-eye"></div></div><div class="pl-mask"><div class="pl-grill"></div></div><div class="pl-tank"></div><div class="pl-body">☠</div><div class="pl-pipe"><div class="pl-smoke"></div><div class="pl-smoke s2"></div></div></div>`;
  const vida = Array.from({ length: MAX_HP }, (_, i) => `<i class="${i < hp ? 'on' : ''}" style="--accent:${accent}"></i>`).join('');
  return `<div class="fighter ${tipo}"><div class="fighter-aura" style="--accent:${accent}"></div><div class="fighter-body">${corpo}</div><div class="fighter-plate"><span class="fighter-tag" style="color:${accent}">${ninja ? '☘' : '☠'}</span><b>${nome}</b></div><div class="hp-row">${vida}</div></div>`;
}

function resultadoHtml() {
  if (!estado.resultado) return '';
  const resultado = estado.resultado;
  const vencedor = resultado.vencedor;
  const classeJogador = vencedor === 'player' ? 'win' : vencedor === 'foe' ? 'lose' : '';
  const classeInimigo = vencedor === 'foe' ? 'win' : vencedor === 'player' ? 'lose' : '';
  return `<div class="reveal-stage resolved">
    <div class="reveal-slot ninja-side ${classeJogador}">${cartaHtml(resultado.jogador, { estado: vencedor === 'player' ? 'winner' : vencedor === 'foe' ? 'loser' : 'played', animacao: 'card-reveal' })}<div class="slot-power">${resultado.poderJogador}${resultado.bonusJogador ? '<em>+3</em>' : ''}</div><div class="slot-label">SHO</div></div>
    <div class="reveal-clash ${vencedor}">${vencedor === 'player' ? icone('check', 26) : vencedor === 'foe' ? icone('fechar', 26) : '='}</div>
    <div class="reveal-slot foe-side ${classeInimigo}">${cartaHtml(resultado.inimigo, { inimigo: true, estado: vencedor === 'foe' ? 'winner' : vencedor === 'player' ? 'loser' : 'played', animacao: 'card-reveal' })}<div class="slot-power">${resultado.poderInimigo}${resultado.bonusInimigo ? '<em>+3</em>' : ''}</div><div class="slot-label foe">SMOG</div></div>
  </div>`;
}

function fatoHtml() {
  const resultado = estado.resultado;
  if (!resultado) return '';
  const titulo = resultado.vencedor === 'player' ? 'Vitória!' : resultado.vencedor === 'foe' ? 'Smog Oni venceu!' : 'Empate!';
  return `<div class="fact-panel"><div class="fact-icon">${icone('folha', 16)}</div><div class="fact-body"><b>${titulo}</b>${resultado.bonusJogador ? '<span class="fact-bonus">+3 VANTAGEM ELEMENTAL</span>' : ''}<p>${resultado.jogador.fato}</p><small>Ameaça: ${resultado.inimigo.fato}</small></div><button class="fact-next" data-action="next">${estado.rodada >= TOTAL_ROUNDS || estado.ninjaHp <= 0 || estado.inimigoHp <= 0 ? 'Ver resultado' : `Próximo round ${icone('espadas', 14)}`}</button></div>`;
}

function combateHtml() {
  if (!estado.resultado) return '';
  const tipo = estado.resultado.vencedor === 'player' ? 'victory' : estado.resultado.vencedor === 'foe' ? 'defeat' : 'draw';
  const particulas = Array.from({ length: 20 }, (_, indice) => {
    const angulo = (indice / 20) * Math.PI * 2;
    const distancia = 120 + (indice % 4) * 28;
    return `<i style="--x:${Math.cos(angulo) * 12}px;--y:${Math.sin(angulo) * 12}px;--dx:${Math.cos(angulo) * distancia}px;--dy:${Math.sin(angulo) * distancia}px;--delay:${(indice % 5) * 35}ms"></i>`;
  }).join('');
  return `<div class="combat-burst ${tipo}" aria-hidden="true">${particulas}</div>`;
}

function overlayHtml() {
  if (estado.fase === 'intro') return `<div class="overlay"><div class="modal"><div class="modal-emblem"><span class="em-ninja">☘</span><span class="em-vs">VS</span><span class="em-foe">☠</span></div><span class="modal-eyebrow">ECO SHINOBI</span><h2>Sho Ninja vs Smog Oni</h2><p>Uma batalha épica pelo equilíbrio do planeta. <b>Smog Oni</b> ataca com ameaças reais. <b>Sho Ninja</b> defende com soluções sustentáveis.</p><div class="modal-cycle">${['agua', 'energia', 'vegetacao', 'residuo'].map((elemento, indice) => `<div class="cycle-node" style="--c:${meta[elemento].cor}"><span>${meta[elemento].icone}</span><b>${meta[elemento].label}</b>${indice < 3 ? '<span class="cycle-arrow">→</span>' : ''}</div>`).join('')}<span class="cycle-loop">↺</span></div><p class="modal-tip">${icone('raio', 13)} Cada elemento vence outro. Acerte o ciclo e ganhe <b>+3 bônus</b>. Vença 5 rounds para salvar o planeta.</p><button class="modal-btn" data-action="start">${icone('espadas', 16)} Iniciar batalha</button></div></div>`;
  if (estado.fase !== 'end') return '';
  const ganhou = estado.vencedor === 'ninja';
  return `<div class="overlay"><div class="modal result ${ganhou ? 'win' : 'lose'}"><div class="result-emblem">${ganhou ? '🏆' : '💀'}</div><span class="modal-eyebrow">${ganhou ? 'PLANETA SALVO' : 'SMOG VENCEU'}</span><h2>${ganhou ? 'Sho Ninja triunfou!' : 'O Smog Oni dominou...'}</h2><div class="result-row"><div class="result-stat"><span>Pontos</span><b>${estado.fatos.length * 10 + estado.pontos}</b></div><div class="result-stat"><span>Fatos</span><b>${estado.fatos.length}</b></div><div class="result-stat"><span>HP final</span><b>${estado.ninjaHp}</b></div></div>${estado.fatos.length ? `<div class="result-facts"><b>Você aprendeu:</b>${estado.fatos.slice(0, 4).map((fato) => `<span>${icone('check', 11)} ${fato}</span>`).join('')}</div>` : ''}<button class="modal-btn" data-action="restart">${icone('repetir', 16)} Batalhar novamente</button></div></div>`;
}

function render() {
  const root = document.getElementById('root');
  const mao = estado.mao.map((carta, indice) => `<button class="fan-card pos-${indice} ${estado.selecionada && estado.selecionada.id === carta.id ? 'picked' : ''} ${estado.selecionada && estado.selecionada.id !== carta.id ? 'folded' : ''} ${estado.fase === 'reveal' || estado.fase === 'end' ? 'locked' : ''}" data-card="${carta.id}" ${estado.fase !== 'select' ? 'disabled' : ''}>${cartaHtml(carta)}</button>`).join('');
  let centro = '<div class="arena-prompt"><span>ESCOLHA SUA CARTA</span></div>';
  if (estado.fase === 'reveal') centro = `<div class="reveal-stage"><div class="reveal-slot ninja-side">${cartaHtml(estado.selecionada, { animacao: 'card-play' })}<div class="slot-label">SHO</div></div><div class="reveal-clash">${icone('espadas', 28)}</div><div class="reveal-slot foe-side">${cartaHtml(estado.jogadaInimigo, { virada: true, animacao: 'card-back-enter' })}<div class="slot-label foe">SMOG</div></div></div>`;
  if (estado.resultado) centro = resultadoHtml();
  root.innerHTML = `<main class="game"><div class="hud"><a class="back-to-games" href="../jogos.html" aria-label="Voltar para a central de jogos" title="Voltar para a central de jogos">${icone('voltar', 22)}</a><div class="hud-mid"><span class="hud-round">ROUND ${estado.rodada}/${TOTAL_ROUNDS}</span><span class="hud-score">${icone('raio', 12)} ${estado.fatos.length * 10 + estado.pontos}</span></div><div class="hud-actions"><div class="hud-facts">✦ ${estado.fatos.length} descobertas</div><button class="audio-toggle" data-action="audio" aria-label="${sons.mudo ? 'Ativar sons' : 'Silenciar sons'}" title="${sons.mudo ? 'Ativar sons' : 'Silenciar sons'}">${sons.mudo ? '🔇' : '🔊'}</button></div></div><section class="arena ${estado.resultado ? 'has-result' : ''}"><div class="arena-sky"></div><div class="arena-mountains"></div><div class="arena-particles">${Array.from({ length: 16 }, (_, indice) => `<span style="--n:${indice}"></span>`).join('')}</div><div class="arena-ground"></div><div class="arena-fighters">${lutadorHtml('ninja', 'SHO NINJA', estado.ninjaHp)}<div class="arena-vs"><span>⚔</span></div>${lutadorHtml('polluter', 'SMOG ONI', estado.inimigoHp)}</div><div class="arena-center">${centro}</div>${combateHtml()}${fatoHtml()}</section><section class="hand-section"><div class="hand-title"><span class="ht-eyebrow">SUA MÃO • ROUND ${estado.rodada}</span><h2>Cartas do Sho Ninja</h2><span class="hand-helper">Escolha uma carta para atacar</span></div><div class="hand-fan">${mao}</div></section>${overlayHtml()}</main>`;
  root.querySelectorAll('[data-card]').forEach((botao) => botao.addEventListener('click', () => selecionarCarta(botao.dataset.card)));
  root.querySelectorAll('[data-action="start"]').forEach((botao) => botao.addEventListener('click', iniciarJogo));
  root.querySelectorAll('[data-action="next"]').forEach((botao) => botao.addEventListener('click', proximaRodada));
  root.querySelectorAll('[data-action="restart"]').forEach((botao) => botao.addEventListener('click', reiniciar));
  root.querySelectorAll('[data-action="audio"]').forEach((botao) => botao.addEventListener('click', () => { sons.alternar(); render(); }));
}

function distribuirRodada() {
  estado.mao = sortear(cartas, 3);
  estado.maoInimigo = sortear(ameacas, 3);
  estado.selecionada = null;
  estado.jogadaInimigo = null;
  estado.resultado = null;
  estado.fase = 'select';
}

function iniciarJogo() {
  sons.garantirContexto();
  sons.iniciarMusica();
  sons.proxima();
  estado.rodada = 1; estado.ninjaHp = MAX_HP; estado.inimigoHp = MAX_HP; estado.pontos = 0; estado.fatos = [];
  distribuirRodada(); render();
}

function selecionarCarta(id) {
  if (estado.fase !== 'select') return;
  const jogador = estado.mao.find((carta) => carta.id === id);
  const inimigo = estado.maoInimigo[Math.floor(Math.random() * estado.maoInimigo.length)];
  if (!jogador || !inimigo) return;
  sons.carta();
  estado.selecionada = jogador; estado.jogadaInimigo = inimigo; estado.fase = 'reveal'; render();
  window.setTimeout(() => {
    const bonusJogador = vantagem[jogador.elemento] === inimigo.elemento;
    const bonusInimigo = vantagem[inimigo.elemento] === jogador.elemento;
    const poderJogador = jogador.poder + (bonusJogador ? 3 : 0);
    const poderInimigo = inimigo.poder + (bonusInimigo ? 3 : 0);
    const vencedor = poderJogador === poderInimigo ? 'draw' : poderJogador > poderInimigo ? 'player' : 'foe';
    estado.resultado = { jogador, inimigo, bonusJogador, bonusInimigo, poderJogador, poderInimigo, vencedor };
    estado.fatos.push(jogador.fato, inimigo.fato);
    if (vencedor === 'player') { estado.inimigoHp = Math.max(0, estado.inimigoHp - 1); estado.pontos += poderJogador + (bonusJogador ? 5 : 0); }
    if (vencedor === 'foe') estado.ninjaHp = Math.max(0, estado.ninjaHp - 1);
    sons.revelar();
    window.setTimeout(() => sons.resultado(vencedor), 180);
    render();
  }, 1100);
}

function proximaRodada() {
  if (estado.ninjaHp <= 0 || estado.inimigoHp <= 0 || estado.rodada >= TOTAL_ROUNDS) {
    estado.vencedor = estado.ninjaHp >= estado.inimigoHp ? 'ninja' : 'polluter';
    estado.fase = 'end'; estado.resultado = null; render(); return;
  }
  sons.proxima();
  estado.rodada += 1; distribuirRodada(); render();
}

function reiniciar() {
  estado.fase = 'intro'; estado.rodada = 1; estado.ninjaHp = MAX_HP; estado.inimigoHp = MAX_HP; estado.pontos = 0; estado.fatos = []; estado.vencedor = null; estado.resultado = null; render();
}

render();
