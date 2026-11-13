// Níveis, recompensas e coletas são decididos e persistidos pelo servidor.
(function () {
    "use strict";
    const TIPOS = {
        moedas: { nome: "Moedas", icone: "/assets/icons/icone_moeda.png" },
        xp: { nome: "XP", icone: "/assets/icons/icone_experiencia_prata.png" },
        vidas: { nome: "Vida extra", icone: "/assets/icons/icone_vida.png" }
    };
    let passe = null;
    let niveisVisiveis = 12;
    let resgatando = false;
    let carregamento = null;
    let nivelModal = null;
    const numero = valor => Number(valor).toLocaleString("pt-BR");
    const movimentoReduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function mensagem(texto, erro = false) {
        const elemento = document.getElementById("passe-mensagem");
        elemento.textContent = texto;
        elemento.classList.toggle("erro", erro);
    }

    async function requisitar(caminho, metodo = "GET") {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faça login para acompanhar seu passe.");
        const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
            method: metodo, credentials: "include", cache: "no-store",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (resposta.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
            throw new Error("Sua sessão expirou.");
        }
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || "Não foi possível atualizar o passe.");
        return dados;
    }

    function sincronizarPerfil(perfil) {
        if (!perfil) return;
        for (const chave of ["user", "cached_perfil"]) {
            try {
                const anterior = JSON.parse(localStorage.getItem(chave) || "{}");
                localStorage.setItem(chave, JSON.stringify({ ...anterior, ...perfil }));
            } catch (erro) { /* A persistência do prêmio independe do cache local. */ }
        }
        document.getElementById("passe-saldos").textContent =
            `${numero(perfil.vidas)} vidas · ${numero(perfil.moedas)} moedas · ${numero(perfil.xp)} XP na sua conta`;
        window.dispatchEvent(new CustomEvent("perfil:atualizado", { detail: perfil }));
    }

    function atualizarResumo() {
        document.querySelectorAll("[data-passe-nivel]").forEach(el => el.textContent = `Nível ${passe.nivel_atual}`);
        const completo = passe.nivel_atual === passe.total_niveis;
        document.querySelectorAll("[data-passe-xp]").forEach(el => {
            el.textContent = completo ? "Todos os níveis liberados!" : `${numero(passe.xp_no_nivel)} / ${numero(passe.xp_por_nivel)} XP para o próximo nível`;
        });
        document.querySelectorAll("[data-passe-barra]").forEach(el => {
            el.max = passe.xp_por_nivel;
            el.value = completo ? passe.xp_por_nivel : passe.xp_no_nivel;
        });
        const prontas = passe.recompensas.filter(r => r.estado === "disponivel").length;
        document.querySelector("[data-passe-disponiveis]").textContent = prontas
            ? `${prontas} ${prontas === 1 ? "recompensa para coletar" : "recompensas para coletar"}`
            : "Tudo coletado por aqui. Continue aprendendo!";
        sincronizarPerfil(passe.perfil);
    }

    function elemento(tag, classe, texto) {
        const el = document.createElement(tag);
        if (classe) el.className = classe;
        if (texto) el.textContent = texto;
        return el;
    }

    function renderizar() {
        if (!passe) return;
        const fragmento = document.createDocumentFragment();
        passe.recompensas.slice(0, niveisVisiveis).forEach(item => {
            const tipo = TIPOS[item.tipo];
            const card = elemento("article", `passe-recompensa ${item.estado}`);
            card.id = `passe-nivel-${item.nivel}`;
            if (item.nivel === passe.nivel_atual) card.classList.add("nivel-atual");
            const cabecalho = elemento("div", "passe-recompensa-topo");
            cabecalho.append(elemento("span", "", `NÍVEL ${String(item.nivel).padStart(2, "0")}`),
                elemento("span", "", item.estado === "coletada" ? "✓ Recebida" : item.estado === "disponivel" ? "Liberada" : "Bloqueada"));
            const arte = elemento("div", `passe-premio-arte ${item.tipo}`);
            const imagem = elemento("img");
            imagem.src = tipo.icone;
            imagem.alt = "";
            imagem.width = 72;
            imagem.height = 72;
            imagem.loading = "lazy";
            arte.appendChild(imagem);
            const titulo = elemento("h3", "", `+${numero(item.quantidade)} ${tipo.nome}`);
            const descricao = elemento("p", "", item.estado === "coletada" ? "Já faz parte da sua conquista." : item.estado === "disponivel"
                ? "Um fruto do seu aprendizado." : `Libera com ${numero(item.xp_necessario)} XP de progresso.`);
            const botao = elemento("button", "passe-coletar", item.estado === "coletada" ? "Coletado ✓" : item.estado === "disponivel" ? "Coletar recompensa" : "Continue estudando");
            botao.type = "button";
            botao.dataset.nivel = item.nivel;
            botao.disabled = item.estado !== "disponivel" || resgatando;
            botao.setAttribute("aria-label", `${botao.textContent}: ${titulo.textContent}, nível ${item.nivel}`);
            const texto = elemento("div", "passe-premio-texto");
            texto.append(cabecalho, titulo, descricao);
            card.append(arte, texto, botao);
            const etapa = elemento("li", `passe-etapa ${item.estado}`);
            const marco = elemento("span", "passe-marco", String(item.nivel));
            marco.setAttribute("aria-hidden", "true");
            if (item.nivel === passe.nivel_atual) etapa.classList.add("nivel-atual");
            etapa.append(marco, card);
            fragmento.appendChild(etapa);
        });
        document.getElementById("pass-v-track").replaceChildren(fragmento);
        document.getElementById("passe-mais").hidden = niveisVisiveis >= passe.total_niveis;
        atualizarResumo();
    }

    async function carregarPasse() {
        if (carregamento || resgatando) return carregamento;
        document.getElementById("passe-tentar").hidden = true;
        document.getElementById("pass-v-track").setAttribute("aria-busy", "true");
        document.querySelectorAll(".passe-coletar").forEach(el => el.disabled = true);
        carregamento = (async () => {
            try {
                passe = await requisitar("/api/passe");
                mensagem("");
                renderizar();
            } catch (erro) {
                mensagem(erro.message || "Verifique sua conexão e tente novamente.", true);
                document.getElementById("passe-tentar").hidden = false;
                document.querySelectorAll("[data-passe-xp]").forEach(el => el.textContent = "Progresso indisponível no momento");
            } finally {
                document.getElementById("pass-v-track").setAttribute("aria-busy", "false");
                carregamento = null;
            }
        })();
        return carregamento;
    }

    async function coletar(nivel) {
        if (resgatando || carregamento || !passe || passe.recompensas[nivel - 1]?.estado !== "disponivel") return;
        resgatando = true;
        document.querySelector(`[data-nivel="${nivel}"]`).textContent = "Salvando recompensa…";
        document.querySelectorAll(".passe-coletar").forEach(el => el.disabled = true);
        try {
            const resposta = await requisitar(`/api/passe/${nivel}/resgatar`, "POST");
            passe = resposta.passe;
            const item = passe.recompensas[nivel - 1];
            resgatando = false;
            renderizar();
            mensagem("Recompensa recebida e salva na sua conta!");
            document.getElementById("pass-modal-img").src = TIPOS[item.tipo].icone;
            document.getElementById("pass-modal-name").textContent = `+${numero(item.quantidade)} ${TIPOS[item.tipo].nome}`;
            nivelModal = nivel;
            document.getElementById("pass-reward-modal").showModal();
            if (!movimentoReduzido()) window.sounds?.playPop?.();
        } catch (erro) {
            resgatando = false;
            await carregarPasse();
            mensagem(erro.message || "Sua recompensa não foi confirmada. Tente novamente.", true);
        } finally {
            resgatando = false;
        }
    }

    function alternarPasse(abrir) {
        document.getElementById("missions-home-view").style.display = abrir ? "none" : "block";
        document.getElementById("missions-pass-view").style.display = abrir ? "block" : "none";
        document.getElementById("missions-main-content").classList.toggle("pass-mode-active", abrir);
        window.scrollTo({ top: 0, behavior: "instant" });
        if (abrir) {
            document.getElementById("passe-titulo").focus({ preventScroll: true });
            carregarPasse();
        } else document.getElementById("passe-abrir").focus({ preventScroll: true });
    }

    function inicializar() {
        document.getElementById("passe-abrir").addEventListener("click", () => alternarPasse(true));
        document.getElementById("passe-voltar").addEventListener("click", () => alternarPasse(false));
        document.getElementById("passe-tentar").addEventListener("click", carregarPasse);
        document.getElementById("passe-mais").addEventListener("click", () => {
            const primeiroNovo = niveisVisiveis + 1;
            niveisVisiveis += 12;
            renderizar();
            const card = document.getElementById(`passe-nivel-${primeiroNovo}`);
            if (card) { card.tabIndex = -1; card.focus({ preventScroll: true }); }
        });
        document.getElementById("passe-ir-nivel").addEventListener("click", () => {
            if (!passe) return;
            niveisVisiveis = Math.max(niveisVisiveis, passe.nivel_atual);
            renderizar();
            document.getElementById(`passe-nivel-${passe.nivel_atual}`).scrollIntoView({ behavior: movimentoReduzido() ? "instant" : "smooth", block: "center" });
        });
        document.getElementById("pass-v-track").addEventListener("click", evento => {
            const botao = evento.target.closest("button[data-nivel]");
            if (botao && !botao.disabled) coletar(Number(botao.dataset.nivel));
        });
        document.getElementById("pass-reward-modal").addEventListener("close", () => {
            const card = document.getElementById(`passe-nivel-${nivelModal}`);
            if (card) { card.tabIndex = -1; card.focus({ preventScroll: true }); }
        });
        carregarPasse();
    }
    document.addEventListener("DOMContentLoaded", inicializar);
})();
