/**
 * Sementis - Passe de Batalha Vertical (Estilo Clash Royale / Pass Royale)
 * Trilha dupla simétrica: GRÁTIS (Azul) e PASSE SEMENTIS PREMIUM (Dourado)
 * Marcador central com losangos e conectores de nível.
 */

(function () {
    "use strict";

    var XP_POR_NIVEL = 500;
    var TOTAL_NIVEIS = 60; // 60 níveis imersivos e completos

    var ICONES = {
        moeda: "/assets/icons/icone_moeda.png",
        vida: "/assets/icons/icone_vida.png",
        xp: "/assets/icons/icone_experiencia_prata.png",
        fogo: "/assets/icons/icone_sequencia_fogo.png",
        fogo_prata: "/assets/icons/icone_sequencia_fogo_prata.png",
        trofeubronze: "/assets/ligas/liga_trofeu_bronze.png",
        trofeuprata: "/assets/ligas/liga_trofeu_prata.png",
        trofeudiamante: "/assets/ligas/missao_alvo_diamante.png",
        medalhabronze: "/assets/ligas/liga_medalha_bronze.png",
        medalhaprata: "/assets/ligas/liga_medalha_prata.png",
        medalha_ouro: "/assets/ligas/liga_medalha_ouro.png",
        selo_missao: "/assets/tarefas/tarefa_completa_selo.png",
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
        comum:    { label: "COMUM",    cor: "#a9ff71" },
        raro:     { label: "RARO",     cor: "#60a5fa" },
        epico:    { label: "ÉPICO",    cor: "#c084fc" },
        lendario: { label: "LENDÁRIO", cor: "#fde047" },
        mitico:   { label: "MÍTICO",   cor: "#f43f5e" }
    };

    // Gerador de Recompensas balanceadas para as 2 trilhas
    function gerarRecompensas() {
        var lista = [];

        var nomesFree = [
            { nome: "100 Moedas", qtd: "100", icone: ICONES.moeda, rar: "comum", desc: "Moedas ecológicas para a loja do Sementis!" },
            { nome: "Bônus de XP", qtd: "+150 XP", icone: ICONES.xp, rar: "comum", desc: "Acelere seu avanço na temporada!" },
            { nome: "Vida Extra", qtd: "+2", icone: ICONES.vida, rar: "raro", desc: "Mais chances para acertar lições e quiz!" },
            { nome: "Selo de Missão", qtd: "x1", icone: ICONES.selo_missao, rar: "raro", desc: "Selo especial de mérito sustentável!" },
            { nome: "Muda para Horta", qtd: "x1", icone: ICONES.horta, rar: "raro", desc: "Cultive sua horta sustentável no campus!" },
            { nome: "250 Moedas", qtd: "250", icone: ICONES.moeda, rar: "raro", desc: "Economias para desbloquear itens raros!" },
            { nome: "Gota de Água Limpa", qtd: "+3", icone: ICONES.agua, rar: "raro", desc: "Proteção contra erros de lição!" },
            { nome: "Chama de Ofensiva", qtd: "x1", icone: ICONES.fogo, rar: "epico", desc: "Protege sua sequência diária por 24h!" },
            { nome: "Medalha de Bronze", qtd: "x1", icone: ICONES.medalhabronze, rar: "epico", desc: "Insígnia de mérito da temporada!" },
            { nome: "500 Moedas", qtd: "500", icone: ICONES.moeda, rar: "lendario", desc: "Tesouro ecológico abundante!" },
            { nome: "Caderno Ecológico", qtd: "x1", icone: ICONES.caderno, rar: "comum", desc: "Material sustentável colecionável!" },
            { nome: "Garrafa Reutilizável", qtd: "x1", icone: ICONES.garrafa, rar: "raro", desc: "Reduza o consumo de descartáveis!" },
            { nome: "Selo de Energia Solar", qtd: "x1", icone: ICONES.energia, rar: "epico", desc: "Incentivo à energia limpa e renovável!" },
            { nome: "Medalha de Prata", qtd: "x1", icone: ICONES.medalhaprata, rar: "epico", desc: "Conquista para o seu perfil público!" },
            { nome: "1.000 Moedas", qtd: "1.000", icone: ICONES.moeda, rar: "mitico", desc: "Grande prêmio de moedas da temporada!" }
        ];

        var nomesPremium = [
            { nome: "Mascote Sementinha", qtd: "PET", icone: ICONES.selo_missao, rar: "epico", desc: "Companheiro voador exclusivo que acompanha seu avatar!" },
            { nome: "300 Moedas Douradas", qtd: "300", icone: ICONES.moeda, rar: "raro", desc: "Moedas de alta patente para itens especiais!" },
            { nome: "Skin Jardineiro Eco", qtd: "SKIN", icone: ICONES.horta, rar: "lendario", desc: "Visual de explorador da floresta para o seu avatar!" },
            { nome: "Aura do Vento", qtd: "EFEITO", icone: ICONES.vento, rar: "epico", desc: "Brilho suave de vento nas respostas corretas!" },
            { nome: "Super Chama Prateada", qtd: "x2", icone: ICONES.fogo_prata, rar: "lendario", desc: "Dobra a proteção da sua ofensiva!" },
            { nome: "EcoBag Guardiã", qtd: "x1", icone: ICONES.ecobag, rar: "raro", desc: "Item clássico da jornada sustentável!" },
            { nome: "Troféu de Prata Sementis", qtd: "x1", icone: ICONES.trofeuprata, rar: "epico", desc: "Troféu glorioso para exibir na sua estante!" },
            { nome: "Skin Bike Verde", qtd: "SKIN", icone: ICONES.bike, rar: "lendario", desc: "Mobilidade ativa com animação exclusiva!" },
            { nome: "Medalha de Ouro Nobre", qtd: "x1", icone: ICONES.medalha_ouro, rar: "lendario", desc: "Símbolo dos maiores guardiões do saber!" },
            { nome: "1.500 Moedas", qtd: "1.500", icone: ICONES.moeda, rar: "lendario", desc: "Montante nobre para compras épicas na loja!" },
            { nome: "Título 'Raiz Dourada'", qtd: "TÍTULO", icone: ICONES.energia, rar: "epico", desc: "Título honorário exibido ao lado do seu nome!" },
            { nome: "Mascote Broto Guardião", qtd: "PET", icone: ICONES.reciclagem, rar: "lendario", desc: "Mascote lendário guardião dos recursos!" },
            { nome: "Emblema Diamante Eco", qtd: "x1", icone: ICONES.trofeudiamante, rar: "mitico", desc: "Emblema de prestígio supremo da temporada!" },
            { nome: "Skin Mestre da Terra", qtd: "SKIN", icone: ICONES.clima, rar: "mitico", desc: "A armadura suprema do Sementis Raízes do Saber!" },
            { nome: "3.000 Moedas & Megabaú", qtd: "3.000", icone: ICONES.moeda, rar: "mitico", desc: "A recompensa máxima do Passe Sementis!" }
        ];

        for (var n = 1; n <= TOTAL_NIVEIS; n++) {
            var itemFree = nomesFree[(n - 1) % nomesFree.length];
            var itemPremium = nomesPremium[(n - 1) % nomesPremium.length];

            // A cada 5 níveis, destaque especial
            var rarFree = (n % 10 === 0) ? "lendario" : (n % 5 === 0) ? "epico" : itemFree.rar;
            var rarPrem = (n % 10 === 0) ? "mitico" : (n % 5 === 0) ? "lendario" : itemPremium.rar;

            lista.push({
                nivel: n,
                free: {
                    nome: itemFree.nome,
                    quantidade: itemFree.qtd,
                    icone: itemFree.icone,
                    raridade: rarFree,
                    descricao: itemFree.desc
                },
                premium: {
                    nome: itemPremium.nome,
                    quantidade: itemPremium.qtd,
                    icone: itemPremium.icone,
                    raridade: rarPrem,
                    descricao: itemPremium.desc
                }
            });
        }

        return lista;
    }

    var estado = {
        nivelAtual: 1,
        xpAtual: 0,
        xpTotal: 0,
        recompensas: [],
        coletadas: {},
        premiumAtivo: false
    };

    function calcularNivel(xpTotal) {
        var n = Math.min(Math.floor(xpTotal / XP_POR_NIVEL) + 1, TOTAL_NIVEIS);
        var xpNoNivel = xpTotal % XP_POR_NIVEL;
        return { nivel: n, xpNoNivel: xpNoNivel };
    }

    // Atualiza o Card de Entrada na página de missões
    function atualizarCardEntrada() {
        var calc = calcularNivel(estado.xpTotal);
        estado.nivelAtual = calc.nivel;
        estado.xpAtual = calc.xpNoNivel;

        var elLevel = document.getElementById("pass-card-player-level");
        var elCounter = document.getElementById("pass-card-xp-counter");
        var elFill = document.getElementById("pass-card-xp-fill");
        var elAlert = document.getElementById("pass-entry-alert-badge");
        var elAlertText = document.getElementById("pass-entry-alert-text");

        if (elLevel) elLevel.textContent = calc.nivel;
        if (elCounter) elCounter.textContent = calc.xpNoNivel.toLocaleString("pt-BR") + " / " + XP_POR_NIVEL.toLocaleString("pt-BR") + " XP";
        
        var pct = Math.min((calc.xpNoNivel / XP_POR_NIVEL) * 100, 100);
        if (elFill) elFill.style.width = pct + "%";

        // Conta quantas recompensas estão disponíveis para coletar
        var prontas = 0;
        for (var i = 1; i <= estado.nivelAtual; i++) {
            if (!estado.coletadas[i + "_free"]) prontas++;
            if (estado.premiumAtivo && !estado.coletadas[i + "_premium"]) prontas++;
        }

        if (elAlert && elAlertText) {
            if (prontas > 0) {
                elAlert.style.display = "inline-flex";
                elAlertText.textContent = prontas + (prontas === 1 ? " Recompensa Pronta!" : " Recompensas Prontas!");
            } else {
                elAlert.style.display = "none";
            }
        }
    }

    // Atualiza o topo do modal vertical
    function atualizarHeaderModalVertical() {
        var calc = calcularNivel(estado.xpTotal);
        var elNum = document.getElementById("pass-v-player-level");
        var elFill = document.getElementById("pass-v-xp-fill");
        var elLabel = document.getElementById("pass-v-xp-label");
        var elUpgradeBtn = document.getElementById("pass-v-upgrade-btn");

        if (elNum) elNum.textContent = calc.nivel;
        if (elLabel) elLabel.textContent = calc.xpNoNivel + " / " + XP_POR_NIVEL + " XP";
        var pct = Math.min((calc.xpNoNivel / XP_POR_NIVEL) * 100, 100);
        if (elFill) elFill.style.width = pct + "%";

        if (elUpgradeBtn) {
            if (estado.premiumAtivo) {
                elUpgradeBtn.textContent = "✓ ATIVO";
                elUpgradeBtn.className = "pvr-action-btn pvr-active";
            } else {
                elUpgradeBtn.textContent = "Upgrade!";
                elUpgradeBtn.className = "pvr-action-btn";
            }
        }
    }

    // Renderiza a trilha vertical com as 2 colunas e conectores centrais
    function renderizarTrilhaVertical() {
        var container = document.getElementById("pass-v-track");
        if (!container) return;

        container.innerHTML = "";

        estado.recompensas.forEach(function (item) {
            var n = item.nivel;
            var desbloqueado = n <= estado.nivelAtual;
            var isAtual = n === estado.nivelAtual;

            var row = document.createElement("div");
            row.className = "pass-v-row" + (isAtual ? " pass-v-row-current" : "");
            row.id = "pass-v-tier-" + n;

            // 1. Célula GRÁTIS (Lado Esquerdo - Azul)
            var coletadaFree = !!estado.coletadas[n + "_free"];
            var cellFree = document.createElement("div");
            var freeClasses = "pass-v-cell-free";
            if (!desbloqueado) freeClasses += " pass-v-cell-locked";
            cellFree.className = freeClasses;

            var acaoFreeHtml = "";
            if (coletadaFree) {
                acaoFreeHtml = "<span class=\"pv-claimed-tag\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg> Coletado</span>";
            } else if (desbloqueado) {
                acaoFreeHtml = "<button type=\"button\" class=\"pv-claim-btn\" data-nivel=\"" + n + "\" data-trilha=\"free\">COLETAR</button>";
            } else {
                acaoFreeHtml = "<span class=\"pv-locked-tag\"><svg width=\"9\" height=\"9\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg> Nv. " + n + "</span>";
            }

            var rarFree = RARIDADES[item.free.raridade] || RARIDADES.comum;
            cellFree.innerHTML =
                "<div class=\"pv-cell-content\">" +
                    "<div class=\"pv-item-visual\">" +
                        "<img src=\"" + item.free.icone + "\" alt=\"" + item.free.nome + "\" class=\"pv-item-img\" loading=\"lazy\">" +
                    "</div>" +
                    "<div class=\"pv-item-info-wrap\">" +
                        "<div class=\"pv-item-header-meta\">" +
                            "<span class=\"pv-item-qty\">" + item.free.quantidade + "</span>" +
                            "<span class=\"pv-item-rarity-chip\" style=\"color:" + rarFree.cor + "\">" + rarFree.label + "</span>" +
                        "</div>" +
                        "<span class=\"pv-item-title\" title=\"" + item.free.nome + "\">" + item.free.nome + "</span>" +
                        "<span class=\"pv-item-desc\">" + item.free.descricao + "</span>" +
                    "</div>" +
                "</div>" +
                "<div class=\"pv-item-action-wrap\">" +
                    acaoFreeHtml +
                "</div>";

            // 2. Conector Central (Losango com o Número do Nível)
            var divider = document.createElement("div");
            divider.className = "pass-v-node-divider";

            var lineClass = "pass-v-vert-line" + (desbloqueado ? " line-filled" : "");
            var nodeClass = "pass-v-diamond-node" + (desbloqueado ? " node-unlocked" : "") + (isAtual ? " node-current" : "");

            divider.innerHTML =
                "<div class=\"" + lineClass + "\"></div>" +
                "<div class=\"" + nodeClass + "\">" +
                    "<span class=\"pvn-number\">" + n + "</span>" +
                "</div>";

            // 3. Célula PREMIUM (Lado Direito - Dourado)
            var coletadaPrem = !!estado.coletadas[n + "_premium"];
            var cellPrem = document.createElement("div");
            var premClasses = "pass-v-cell-premium";
            if (!desbloqueado || !estado.premiumAtivo) premClasses += " pass-v-cell-locked";
            cellPrem.className = premClasses;

            var acaoPremHtml = "";
            if (coletadaPrem) {
                acaoPremHtml = "<span class=\"pv-claimed-tag\"><svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg> Coletado</span>";
            } else if (desbloqueado && estado.premiumAtivo) {
                acaoPremHtml = "<button type=\"button\" class=\"pv-claim-btn\" data-nivel=\"" + n + "\" data-trilha=\"premium\">COLETAR</button>";
            } else if (desbloqueado && !estado.premiumAtivo) {
                acaoPremHtml = "<button type=\"button\" class=\"pv-premium-lock-btn\" onclick=\"ativarPassePremium()\">★ UPGRADE</button>";
            } else {
                acaoPremHtml = "<span class=\"pv-locked-tag\"><svg width=\"9\" height=\"9\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg> Nv. " + n + "</span>";
            }

            var rarPrem = RARIDADES[item.premium.raridade] || RARIDADES.lendario;
            cellPrem.innerHTML =
                "<div class=\"pv-sparkles\"></div>" +
                "<div class=\"pv-cell-content\">" +
                    "<div class=\"pv-item-visual\">" +
                        "<img src=\"" + item.premium.icone + "\" alt=\"" + item.premium.nome + "\" class=\"pv-item-img\" loading=\"lazy\">" +
                    "</div>" +
                    "<div class=\"pv-item-info-wrap\">" +
                        "<div class=\"pv-item-header-meta\">" +
                            "<span class=\"pv-item-qty\">" + item.premium.quantidade + "</span>" +
                            "<span class=\"pv-item-rarity-chip\" style=\"color:" + rarPrem.cor + "\">" + rarPrem.label + "</span>" +
                        "</div>" +
                        "<span class=\"pv-item-title\" title=\"" + item.premium.nome + "\">" + item.premium.nome + "</span>" +
                        "<span class=\"pv-item-desc\">" + item.premium.descricao + "</span>" +
                    "</div>" +
                "</div>" +
                "<div class=\"pv-item-action-wrap\">" +
                    acaoPremHtml +
                "</div>";

            row.appendChild(cellFree);
            row.appendChild(divider);
            row.appendChild(cellPrem);

            container.appendChild(row);
        });

        // Delegação de cliques para os botões de coletar
        container.querySelectorAll(".pv-claim-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                var nivel = parseInt(btn.dataset.nivel, 10);
                var trilha = btn.dataset.trilha;
                var recompItem = estado.recompensas[nivel - 1];
                if (!recompItem) return;
                var payload = (trilha === "premium") ? recompItem.premium : recompItem.free;
                coletarRecompensa(nivel, trilha, payload);
            });
        });
    }

    // Coletar Recompensa
    function coletarRecompensa(nivel, trilha, item) {
        var chave = nivel + "_" + trilha;
        if (estado.coletadas[chave]) return;

        estado.coletadas[chave] = true;
        salvarEstado();

        // Efeito sonoro
        if (typeof playReveal === "function") {
            playReveal(item.raridade || "raro");
        } else if (typeof playPop === "function") {
            playPop();
        }

        // Confetes
        if (typeof confetti !== "undefined") {
            var rar = RARIDADES[item.raridade] || RARIDADES.raro;
            var cnt = item.raridade === "mitico" ? 180 : item.raridade === "lendario" ? 120 : 70;
            confetti({
                particleCount: cnt,
                spread: 80,
                colors: [rar.cor, "#ffd700", "#a9ff71", "#ffffff"],
                origin: { y: 0.6 }
            });
        }

        abrirModalRecompensa(item, nivel, trilha);
        renderizarTrilhaVertical();
        atualizarCardEntrada();
    }

    // Modal de Unboxing
    function abrirModalRecompensa(item, nivel, trilha) {
        var modal = document.getElementById("pass-reward-modal");
        if (!modal) return;

        var rar = RARIDADES[item.raridade] || RARIDADES.comum;
        var elImg = document.getElementById("pass-modal-img");
        var elRar = document.getElementById("pass-modal-rarity");
        var elNome = document.getElementById("pass-modal-name");
        var elDesc = document.getElementById("pass-modal-desc");

        if (elImg) elImg.src = item.icone;
        if (elRar) {
            elRar.textContent = (trilha === "premium" ? "★ PREMIUM · " : "") + rar.label;
            elRar.style.color = rar.cor;
        }
        if (elNome) elNome.textContent = item.nome + " (" + item.quantidade + ")";
        if (elDesc) elDesc.textContent = "Nível " + nivel + " alcançado! " + item.descricao;

        var card = modal.querySelector(".pass-modal-card");
        if (card) card.style.borderColor = rar.cor;

        modal.style.display = "flex";
    }

    window.fecharModalRecompensaPasse = function () {
        var modal = document.getElementById("pass-reward-modal");
        if (modal) modal.style.display = "none";
    };

    // Abertura do Passe Vertical (In-Page, integrando toda a área ao lado da navbar)
    window.abrirPasseVertical = function () {
        var homeView = document.getElementById("missions-home-view");
        var passView = document.getElementById("missions-pass-view");
        if (!passView) return;

        if (homeView) homeView.style.display = "none";
        passView.style.display = "block";

        // Expande o container principal para aproveitar todo o espaço ao lado da navbar
        var mainContent = document.getElementById("missions-main-content");
        if (mainContent) mainContent.classList.add("pass-mode-active");

        atualizarHeaderModalVertical();
        renderizarTrilhaVertical();

        // Rola automaticamente até o nível atual do jogador
        setTimeout(function () {
            rolarParaNivelAtual();
        }, 150);

        if (typeof playPop === "function") playPop();
    };

    // Fechamento do Passe Vertical (Retorna para as missões)
    window.fecharPasseVertical = function () {
        var homeView = document.getElementById("missions-home-view");
        var passView = document.getElementById("missions-pass-view");
        if (!passView) return;

        passView.style.display = "none";
        if (homeView) homeView.style.display = "block";

        var mainContent = document.getElementById("missions-main-content");
        if (mainContent) mainContent.classList.remove("pass-mode-active");

        window.scrollTo({ top: 0, behavior: "smooth" });

        atualizarCardEntrada();
        if (typeof playPop === "function") playPop();
    };

    // Rola para a linha do nível do jogador
    window.rolarParaNivelAtual = function () {
        var rowAtual = document.querySelector(".pass-v-row-current");
        if (rowAtual) {
            rowAtual.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            var firstRow = document.getElementById("pass-v-tier-1");
            if (firstRow) firstRow.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Ativação do Passe Premium (Upgrade!)
    window.ativarPassePremium = function () {
        if (estado.premiumAtivo) return;

        var confirmar = confirm("Deseja ativar o PASSE SEMENTIS PREMIUM para desbloquear todas as recompensas exclusivas da temporada?");
        if (!confirmar) return;

        estado.premiumAtivo = true;
        try {
            localStorage.setItem("pb_premium_ativo", "true");
        } catch (e) {}

        if (typeof playReveal === "function") playReveal("lendario");

        if (typeof confetti !== "undefined") {
            confetti({
                particleCount: 150,
                spread: 100,
                colors: ["#ffd700", "#fde047", "#a9ff71", "#ffffff"],
                origin: { y: 0.5 }
            });
        }

        atualizarHeaderModalVertical();
        renderizarTrilhaVertical();
        atualizarCardEntrada();
    };

    function salvarEstado() {
        try {
            localStorage.setItem("pb_coletadas", JSON.stringify(estado.coletadas));
        } catch (e) {}
    }

    function carregarEstado() {
        try {
            var raw = localStorage.getItem("pb_coletadas");
            if (raw) estado.coletadas = JSON.parse(raw);
            estado.premiumAtivo = localStorage.getItem("pb_premium_ativo") === "true";
        } catch (e) {}
    }

    function buscarXp() {
        try {
            var userRaw = localStorage.getItem("user");
            if (userRaw) {
                var u = JSON.parse(userRaw);
                if (u && typeof u.xp === "number") {
                    estado.xpTotal = u.xp;
                    atualizarCardEntrada();
                }
            }
        } catch (e) {}

        var token = localStorage.getItem("token");
        if (!token) return;
        var base = (typeof API_BASE_URL !== "undefined") ? API_BASE_URL : "";
        fetch(base + "/usuario/perfil", { credentials: "include", headers: { "Authorization": "Bearer " + token }, cache: "no-store" })
            .then(function (r) { if (r.ok) return r.json(); })
            .then(function (d) {
                if (!d) return;
                var xp = d.xp || d.pontuacao || 0;
                if (xp !== estado.xpTotal) {
                    estado.xpTotal = xp;
                    atualizarCardEntrada();
                }
            })
            .catch(function () {});
    }

    function inicializar() {
        estado.recompensas = gerarRecompensas();
        carregarEstado();
        try {
            var u = JSON.parse(localStorage.getItem("user"));
            if (u && u.xp) estado.xpTotal = u.xp;
        } catch (e) {}

        atualizarCardEntrada();
        buscarXp();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }

})();
