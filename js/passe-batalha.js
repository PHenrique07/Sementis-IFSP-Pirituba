/**
 * Passe Sementis - Logica do Passe de Batalha Estilo Fortnite
 * 90 niveis, trilha FREE e PREMIUM
 */

(function () {
    "use strict";

    var XP_POR_NIVEL = 500;
    var TOTAL_NIVEIS = 90;
    var NIVEIS_POR_PAGINA = 10;

    var ICONES = {
        moeda: "/assets/icons/icone_moeda.png",
        vida: "/assets/icons/icone_vida.png",
        xp: "/assets/icons/icone_experiencia_prata.png",
        fogo: "/assets/icons/icone_sequencia_fogo.png",
        fogo_prata: "/assets/icons/icone_sequencia_fogo_prata.png",
        trofeubronze: "/assets/ligas/liga_trofeu_bronze.png",
        trofeuprata: "/assets/ligas/liga_trofeu_prata.png",
        medalhabronze: "/assets/ligas/liga_medalha_bronze.png",
        medalhaprata: "/assets/ligas/liga_medalha_prata.png",
        medalha_ouro: "/assets/ligas/liga_medalha_ouro.png",
        tarefa: "/assets/tarefas/tarefa_completa_selo.png",
        horta: "/assets/tarefas/tarefa_horta.png",
        agua: "/assets/tarefas/tarefa_agua.png",
        clima: "/assets/tarefas/tarefa_clima.png",
        ecobag: "/assets/tarefas/ecobag.png",
        bike: "/assets/tarefas/ir_de_bike.png",
        reciclagem: "/assets/tarefas/garrfa_pet.png",
        energia: "/assets/tarefas/energia_solar.png",
        vento: "/assets/tarefas/energia_vento.png",
        consumo: "/assets/tarefas/tarefa_consumo_consciente.png",
        caderno: "/assets/tarefas/caderno_reutilizado.png",
        garrafa: "/assets/tarefas/garrafa_reutilizada.png"
    };

    var RARIDADES = {
        comum:    { label: "COMUM",    cor: "#a9ff71", fundo: "rgba(169,255,113,0.18)" },
        raro:     { label: "RARO",     cor: "#4d9fff", fundo: "rgba(77,159,255,0.18)" },
        epico:    { label: "EPICO",    cor: "#c084fc", fundo: "rgba(192,132,252,0.18)" },
        lendario: { label: "LENDARIO", cor: "#ffd700", fundo: "rgba(255,215,0,0.18)" },
        mitico:   { label: "MISTICO",  cor: "#ff3b7a", fundo: "rgba(255,59,122,0.18)" }
    };

    function gerarRecompensas() {
        var lista = [];
        var iconesFree = [ICONES.moeda, ICONES.xp, ICONES.vida, ICONES.fogo, ICONES.tarefa, ICONES.agua, ICONES.reciclagem, ICONES.horta, ICONES.caderno, ICONES.garrafa, ICONES.consumo, ICONES.clima, ICONES.energia, ICONES.moeda];
        var iconesPremium = [ICONES.ecobag, ICONES.bike, ICONES.energia, ICONES.vento, ICONES.fogo_prata, ICONES.trofeubronze, ICONES.trofeuprata, ICONES.medalhabronze, ICONES.medalhaprata, ICONES.medalha_ouro, ICONES.tarefa, ICONES.moeda, ICONES.xp, ICONES.vida];
        var nomesFree = ["100 Moedas","Bonus XP","2 Vidas","Ofensiva Dupla","Selo Missao","Avatar Agua","Placa Recicla","Planta Horta","Caderno Verde","Garrafa Eco","Consumo Consciente","Clima Acao","Material Reutilizado","250 Moedas","XP Turbo x2","5 Vidas","Chama Lendaria","Emblema Bronze","Titulo Eco","Armadura Sementis"];
        var nomesPremium = ["EcoBag Dourada","Avatar Bike","Placa Solar","Turbina Vento","Chama Prata","Trofeu Bronze","Trofeu Prata","Medalha Bronze","Medalha Prata","Medalha Ouro","Megaselo Sementis","500 Moedas","XP Turbo Premium","3 Vidas","Titulo Guardiao","Aura Eco","Efeito Tempestade","Avatar Floresta","Placa Diamante","Conjunto Epico"];

        function definirRaridade(n) {
            if (n % 25 === 0) return "mitico";
            if (n % 10 === 0) return "lendario";
            if (n % 5 === 0) return "epico";
            if (n % 3 === 0) return "raro";
            return "comum";
        }
        function baseQt(rar) { return { comum: 100, raro: 200, epico: 350, lendario: 600, mitico: 1000 }[rar]; }

        for (var n = 1; n <= TOTAL_NIVEIS; n++) {
            var rar = definirRaridade(n);
            var qt = baseQt(rar) + Math.floor(n / 10) * 50;
            lista.push({
                nivel: n, raridade: rar,
                free: { nome: nomesFree[(n-1) % nomesFree.length], descricao: "+" + qt + " Moedas", icone: iconesFree[(n-1) % iconesFree.length], quantidade: qt },
                premium: { nome: nomesPremium[(n-1) % nomesPremium.length], descricao: "Recompensa exclusiva premium", icone: iconesPremium[(n-1) % iconesPremium.length], quantidade: qt * 2 }
            });
        }
        return lista;
    }

    var estado = { nivelAtual: 1, xpAtual: 0, xpTotal: 0, paginaAtual: 0, recompensas: [], coletadas: {}, totalColetadas: 0 };

    function calcularNivel(xpTotal) {
        return { nivel: Math.min(Math.floor(xpTotal / XP_POR_NIVEL) + 1, TOTAL_NIVEIS), xpNoNivel: xpTotal % XP_POR_NIVEL };
    }

    function renderPagina() {
        var ini = estado.paginaAtual * NIVEIS_POR_PAGINA;
        var fim = Math.min(ini + NIVEIS_POR_PAGINA, TOTAL_NIVEIS);
        var track = document.getElementById("pass-columns-track");
        var lR = document.getElementById("pass-level-range");
        if (!track) return;
        if (lR) lR.textContent = "Nv. " + (ini + 1) + " \u2013 " + fim;
        track.innerHTML = "";

        for (var i = ini; i < fim; i++) {
            var r = estado.recompensas[i];
            var n = r.nivel;
            var desbloq = n <= estado.nivelAtual;

            var col = document.createElement("div");
            col.className = "pb-stage-column" + (desbloq ? " pb-stage-unlocked" : " pb-stage-locked") + (n === estado.nivelAtual ? " pb-stage-current" : "");
            col.dataset.level = n;

            // Slot FREE (Topo)
            var slotFree = document.createElement("div");
            slotFree.className = "pb-slot pb-slot-free";
            slotFree.appendChild(criarCard(r.free, n, r.raridade, desbloq, !!estado.coletadas[n+"_free"], "free", false));

            // Conector Central (Meio)
            var conector = criarConector(n, desbloq, i === ini, i === fim - 1);

            // Slot PREMIUM (Base)
            var slotPremium = document.createElement("div");
            slotPremium.className = "pb-slot pb-slot-premium";
            slotPremium.appendChild(criarCard(r.premium, n, r.raridade, desbloq, !!estado.coletadas[n+"_premium"], "premium", true));

            col.appendChild(slotFree);
            col.appendChild(conector);
            col.appendChild(slotPremium);

            track.appendChild(col);
        }
        renderDots();
    }

    function criarCard(recomp, nivel, rarKey, desbloq, coletada, trilha, isPremium) {
        var card = document.createElement("div");
        var rar = RARIDADES[rarKey];
        var cls = "pb-card pb-card-" + rarKey;
        if (!desbloq) cls += " pb-locked";
        if (coletada) cls += " pb-claimed";
        if (desbloq && !coletada && !isPremium) cls += " pb-ready";
        if (isPremium) cls += " pb-card-premium";
        card.className = cls;

        var topHtml = isPremium
            ? "<span class=\"pb-premium-crown\">\u2605 PREMIUM</span>"
            : "<span class=\"pb-rarity-chip\" style=\"background:" + rar.cor + ";color:#0d0e29\">" + rar.label + "</span>";

        var btnHtml;
        if (coletada) {
            btnHtml = "<button class=\"pb-btn pb-btn-claimed\" disabled><svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg> Coletado</button>";
        } else if (desbloq && !isPremium) {
            btnHtml = "<button class=\"pb-btn pb-btn-collect\">COLETAR</button>";
        } else if (isPremium) {
            btnHtml = "<button class=\"pb-btn pb-btn-premium-lock\" disabled>\u2605 EXCLUSIVO</button>";
        } else {
            btnHtml = "<button class=\"pb-btn pb-btn-lock\" disabled><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg> Nv." + nivel + "</button>";
        }

        var readyRing = (desbloq && !coletada && !isPremium) ? "<div class=\"pb-card-ready-ring\"></div>" : "";
        var imgCls = "pb-card-img" + (!desbloq ? " pb-img-locked" : "");

        card.innerHTML =
            "<div class=\"pb-card-top\">" + topHtml + "</div>" +
            "<div class=\"pb-card-visual\">" +
                "<div class=\"pb-card-radial\" style=\"background:radial-gradient(circle," + rar.fundo + " 0%,transparent 70%)\"></div>" +
                "<img class=\"" + imgCls + "\" src=\"" + recomp.icone + "\" alt=\"" + recomp.nome + "\" loading=\"lazy\">" +
                readyRing +
            "</div>" +
            "<div class=\"pb-card-info\"><p class=\"pb-card-name\" title=\"" + recomp.nome + "\">" + recomp.nome + "</p></div>" +
            "<div class=\"pb-card-footer\">" + btnHtml + "</div>";

        var btnCollect = card.querySelector(".pb-btn-collect");
        if (btnCollect) {
            (function(n, t, r, rk) {
                btnCollect.addEventListener("click", function(e) { e.stopPropagation(); coletarRecompensa(n, t, r, rk); });
            })(nivel, trilha, recomp, rarKey);
        }
        return card;
    }

    function criarConector(nivel, desbloq, isPrimeiro, isUltimo) {
        var wrap = document.createElement("div");
        var cls = "pb-stage-connector" + (desbloq ? " pb-node-unlocked" : " pb-node-locked") + (nivel === estado.nivelAtual ? " pb-node-current" : "");
        wrap.className = cls;
        var lL = "pb-node-line pb-node-line-left" + (desbloq && !isPrimeiro ? " pb-line-filled" : "") + (isPrimeiro ? " pb-line-edge-left" : "");
        var lR2 = "pb-node-line pb-node-line-right" + (desbloq && !isUltimo ? " pb-line-filled" : "") + (isUltimo ? " pb-line-edge-right" : "");
        var pulse = (nivel === estado.nivelAtual) ? "<div class=\"pb-node-pulse\"></div>" : "";
        wrap.innerHTML = "<div class=\"" + lL + "\"></div><div class=\"pb-node-circle\"><span class=\"pb-node-num\">" + nivel + "</span>" + pulse + "</div><div class=\"" + lR2 + "\"></div>";
        return wrap;
    }

    function renderDots() {
        var container = document.getElementById("pass-page-dots");
        if (!container) return;
        var total = Math.ceil(TOTAL_NIVEIS / NIVEIS_POR_PAGINA);
        container.innerHTML = "";
        for (var i = 0; i < total; i++) {
            (function(idx) {
                var dot = document.createElement("button");
                dot.className = "pb-dot" + (idx === estado.paginaAtual ? " pb-dot-active" : "");
                dot.addEventListener("click", function() { estado.paginaAtual = idx; renderPagina(); });
                container.appendChild(dot);
            })(i);
        }
    }

    function atualizarHeader() {
        var calc = calcularNivel(estado.xpTotal);
        estado.nivelAtual = calc.nivel;
        estado.xpAtual = calc.xpNoNivel;
        var pct = Math.min((calc.xpNoNivel / XP_POR_NIVEL) * 100, 100).toFixed(1);
        var el = function(id) { return document.getElementById(id); };
        if (el("pass-player-level")) el("pass-player-level").textContent = calc.nivel;
        if (el("pass-xp-counter")) el("pass-xp-counter").textContent = calc.xpNoNivel.toLocaleString("pt-BR") + " / " + XP_POR_NIVEL.toLocaleString("pt-BR") + " XP";
        if (el("pass-xp-fill")) el("pass-xp-fill").style.width = pct + "%";
        if (el("pass-claimed-count")) el("pass-claimed-count").textContent = estado.totalColetadas;
        if (el("pass-next-reward")) {
            if (calc.nivel < TOTAL_NIVEIS) el("pass-next-reward").textContent = "Faltam " + (XP_POR_NIVEL - calc.xpNoNivel) + " XP p/ Nv." + (calc.nivel + 1);
            else el("pass-next-reward").textContent = "Passe Completo!";
        }
    }

    function coletarRecompensa(nivel, trilha, recomp, rarKey) {
        var chave = nivel + "_" + trilha;
        if (estado.coletadas[chave]) return;
        estado.coletadas[chave] = true;
        estado.totalColetadas++;
        salvarEstado();
        atualizarHeader();
        renderPagina();
        abrirModal(recomp, rarKey, nivel);
        if (typeof confetti !== "undefined") {
            var rar = RARIDADES[rarKey];
            var cnt = rarKey === "mitico" ? 200 : rarKey === "lendario" ? 130 : 80;
            confetti({ particleCount: cnt, spread: 80, colors: [rar.cor, "#ffffff", "#a9ff71"], origin: { y: 0.6 } });
        }
    }

    function abrirModal(recomp, rarKey, nivel) {
        var modal = document.getElementById("pass-reward-modal");
        if (!modal) return;
        var rar = RARIDADES[rarKey];
        var el = function(id) { return document.getElementById(id); };
        if (el("pass-modal-img")) el("pass-modal-img").src = recomp.icone;
        if (el("pass-modal-rarity")) { el("pass-modal-rarity").textContent = rar.label; el("pass-modal-rarity").style.color = rar.cor; }
        if (el("pass-modal-name")) el("pass-modal-name").textContent = recomp.nome;
        if (el("pass-modal-desc")) el("pass-modal-desc").textContent = "Nivel " + nivel + " desbloqueado! " + recomp.descricao;
        var card = modal.querySelector(".pass-modal-card");
        if (card) card.style.borderColor = rar.cor;
        modal.style.display = "flex";
    }

    window.fecharModalRecompensaPasse = function() {
        var modal = document.getElementById("pass-reward-modal");
        if (modal) modal.style.display = "none";
    };

    function salvarEstado() {
        try { localStorage.setItem("pb_coletadas", JSON.stringify(estado.coletadas)); localStorage.setItem("pb_total", estado.totalColetadas); } catch(e) {}
    }

    function carregarEstado() {
        try {
            var raw = localStorage.getItem("pb_coletadas");
            if (raw) estado.coletadas = JSON.parse(raw);
            var tot = localStorage.getItem("pb_total");
            if (tot) estado.totalColetadas = parseInt(tot) || 0;
        } catch(e) {}
    }

    function buscarXp() {
        try {
            var userRaw = localStorage.getItem("user");
            if (userRaw) { var u = JSON.parse(userRaw); if (u && typeof u.xp === "number") { estado.xpTotal = u.xp; atualizarHeader(); renderPagina(); } }
        } catch(e) {}
        var token = localStorage.getItem("token");
        if (!token) return;
        var base = (typeof API_BASE_URL !== "undefined") ? API_BASE_URL : "";
        fetch(base + "/usuario/perfil", { credentials: "include", headers: { "Authorization": "Bearer " + token }, cache: "no-store" })
            .then(function(r) { if (r.ok) return r.json(); })
            .then(function(d) { if (!d) return; var xp = d.xp || d.pontuacao || 0; if (xp !== estado.xpTotal) { estado.xpTotal = xp; atualizarHeader(); renderPagina(); } })
            .catch(function() {});
    }

    function configurarNav() {
        var total = Math.ceil(TOTAL_NIVEIS / NIVEIS_POR_PAGINA);
        var prev = document.getElementById("pass-btn-prev");
        var next = document.getElementById("pass-btn-next");
        if (prev) prev.addEventListener("click", function() { if (estado.paginaAtual > 0) { estado.paginaAtual--; renderPagina(); } });
        if (next) next.addEventListener("click", function() { if (estado.paginaAtual < total - 1) { estado.paginaAtual++; renderPagina(); } });
    }

    function inicializar() {
        estado.recompensas = gerarRecompensas();
        carregarEstado();
        try { var u = JSON.parse(localStorage.getItem("user")); if (u && u.xp) estado.xpTotal = u.xp; } catch(e) {}
        atualizarHeader();
        estado.paginaAtual = Math.max(0, Math.floor((estado.nivelAtual - 1) / NIVEIS_POR_PAGINA));
        renderPagina();
        configurarNav();
        buscarXp();
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", inicializar); }
    else { inicializar(); }

})();
