import re

template_path = "brag-output-2026-10-17-164801/index.template.html"
with open(template_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Definir o CSS nativo de alta fidelidade para as telas Mobile e Professor
css_native = """/* ===== S4 Split-Stage: Telas Nativas Recriadas (Mobile + Professor + Desktop) ===== */
      .s4-narrative {
        position: absolute;
        left: 80px;
        top: 150px;
        width: 660px;
        height: 800px;
        z-index: 30;
      }
      .s4-narr-block {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .narr-desc {
        font-size: 25px;
        color: var(--g300);
        line-height: 1.4;
        margin-top: 18px;
        font-weight: 500;
      }
      .narr-chips {
        margin-top: 28px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .n-chip {
        display: inline-flex;
        align-items: center;
        gap: 16px;
        padding: 13px 22px;
        border-radius: 9999px;
        font-size: 21px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.06);
        border: 1.5px solid rgba(255, 255, 255, 0.14);
        color: #ffffff;
        backdrop-filter: blur(16px);
        width: fit-content;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      }
      .n-chip.solid {
        background: rgba(169, 255, 113, 0.15);
        border-color: rgba(169, 255, 113, 0.7);
        color: var(--lime);
        box-shadow: 0 0 25px rgba(169, 255, 113, 0.25);
      }
      .n-chip.dim {
        border-color: rgba(255, 255, 255, 0.08);
        color: var(--g400);
        font-size: 19px;
      }
      .n-chip img {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }

      /* Vitrine Direita */
      .s4-showcase {
        position: absolute;
        left: 780px;
        top: 110px;
        width: 1060px;
        height: 850px;
        perspective: 1200px;
      }

      /* Desktop Window (Home do Sementis com Sidebar) */
      .browser-mockup {
        position: absolute;
        left: 0;
        top: 20px;
        width: 1040px;
        height: 750px;
        background: #14143a;
        border-radius: 26px;
        border: 2px solid rgba(169, 255, 113, 0.35);
        box-shadow: 0 35px 90px rgba(0, 0, 0, 0.7), 0 0 50px rgba(169, 255, 113, 0.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 10;
        transform-origin: center right;
      }
      .browser-top {
        height: 46px;
        background: #1c1c46;
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        padding: 0 20px;
        gap: 16px;
      }
      .browser-dots { display: flex; gap: 8px; }
      .b-dot { width: 13px; height: 13px; border-radius: 50%; }
      .b-red { background: #ff5f56; } .b-yel { background: #ffbd2e; } .b-grn { background: #27c93f; }
      .browser-addr {
        flex: 1; max-width: 480px; margin: 0 auto; height: 30px; background: rgba(0, 0, 0, 0.3);
        border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.12);
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 14px; color: var(--g300); font-weight: 500;
      }
      .browser-body {
        flex: 1;
        display: flex;
        overflow: hidden;
        background: #121232;
      }
      .b-sidebar {
        width: 180px;
        background: #181842;
        border-right: 1.5px solid rgba(255, 255, 255, 0.08);
        padding: 16px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .b-side-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        color: var(--g300);
      }
      .b-side-item.active {
        background: rgba(169, 255, 113, 0.15);
        color: var(--lime);
        border: 1.5px solid rgba(169, 255, 113, 0.4);
      }
      .b-side-item img { width: 22px; height: 22px; object-fit: contain; }
      .b-main-content {
        flex: 1;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
      }
      .b-head-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
      }
      .b-stats { display: flex; align-items: center; gap: 20px; }
      .b-stat { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; color: #fff; }
      .b-stat img { width: 22px; height: 22px; object-fit: contain; }

      .b-user-card {
        background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px; padding: 14px 18px;
      }
      .b-user-info { display: flex; align-items: center; gap: 12px; }
      .b-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--lime); display: flex; align-items: center; justify-content: center; }
      .b-avatar img { width: 26px; height: 26px; }
      .b-user-name { font-size: 17px; font-weight: 700; color: #fff; }
      .b-user-lvl { font-size: 13px; font-weight: 500; color: var(--g400); margin-top: 2px; }
      .b-xp-bar { height: 10px; border-radius: 5px; background: rgba(255, 255, 255, 0.12); margin-top: 10px; overflow: hidden; }
      .b-xp-fill { height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--lime-d), var(--lime)); width: 35%; box-shadow: 0 0 12px var(--lime); }
      .b-xp-sub { font-size: 12px; color: var(--g400); margin-top: 4px; font-weight: 500; }

      .b-live-banner {
        background: linear-gradient(135deg, rgba(39, 39, 94, 0.8), rgba(26, 26, 74, 0.9));
        border: 1.5px solid rgba(169, 255, 113, 0.4); border-radius: 16px; padding: 12px 18px;
        display: flex; align-items: center; justify-content: space-between; gap: 14px;
        box-shadow: 0 0 25px rgba(169, 255, 113, 0.12);
      }
      .b-live-badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 9999px;
        background: var(--lime); color: #1a1a4a; font-size: 11px; font-weight: 800; letter-spacing: .08em;
      }
      .b-live-badge i { width: 6px; height: 6px; border-radius: 50%; background: #1a1a4a; }
      .b-live-btn {
        background: var(--lime); color: #1a1a4a; font-weight: 700; font-size: 14px;
        padding: 8px 16px; border-radius: 9px; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
      }

      .b-mod-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 4px; }
      .b-mod-card {
        background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px; padding: 14px 12px; text-align: center; display: flex; flex-direction: column; align-items: center;
      }
      .b-mod-icon { width: 56px; height: 56px; object-fit: contain; margin-bottom: 6px; }
      .b-mod-title { font-size: 15px; font-weight: 700; color: #fff; }
      .b-mod-desc { font-size: 12px; font-weight: 500; color: var(--g400); margin-top: 3px; line-height: 1.2; }
      .b-mod-prog { font-size: 11px; font-weight: 600; color: var(--lime); margin-top: 6px; }

      /* ========================================================
         MOBILE HERO FRAME NATIVO (100% CSS, SEM PRINT ESTÁTICO)
         ======================================================== */
      #mobile-hero {
        position: absolute;
        right: 35px;
        top: 15px;
        width: 400px;
        height: 770px;
        background: #11113b;
        border-radius: 48px;
        border: 4px solid #363673;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(169, 255, 113, 0.25);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 25;
      }
      .m-notch {
        width: 120px;
        height: 20px;
        background: #000;
        border-radius: 10px;
        margin: 10px auto 4px;
        position: relative;
        z-index: 40;
      }
      .m-screen-container {
        position: relative;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* Camada 1: App Mobile Nativo do Sementis */
      #m-screen-app {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #12123d;
        z-index: 10;
        overflow: hidden;
      }
      .mob-topbar {
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #11113b;
      }
      .mob-logo { display: flex; flex-direction: column; }
      .mob-logo img { height: 26px; width: auto; }
      .mob-stats { display: flex; align-items: center; gap: 8px; }
      .mob-stat-chip {
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 4px 8px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
      }
      .mob-stat-chip img { width: 14px; height: 14px; object-fit: contain; }
      .mob-avatar-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--lime);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 2px;
      }
      .mob-avatar-btn img { width: 18px; height: 18px; }

      .mob-scroll-body {
        flex: 1;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
      }
      .mob-user-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 14px 16px;
      }
      .mob-live-banner {
        background: linear-gradient(135deg, rgba(39, 39, 94, 0.85), rgba(26, 26, 74, 0.95));
        border: 1.5px solid rgba(169, 255, 113, 0.5);
        border-radius: 20px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 0 25px rgba(169, 255, 113, 0.15);
      }
      .mob-live-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mob-live-title { font-size: 15px; font-weight: 800; color: #fff; }
      .mob-live-badge {
        background: var(--lime);
        color: #1a1a4a;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .08em;
        padding: 4px 8px;
        border-radius: 9999px;
      }
      .mob-live-desc { font-size: 12px; color: var(--g300); line-height: 1.35; }
      .mob-live-btn {
        background: var(--lime);
        color: #1a1a4a;
        font-size: 13px;
        font-weight: 800;
        padding: 9px 16px;
        border-radius: 12px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .mob-mod-preview {
        background: rgba(255, 255, 255, 0.04);
        border: 1.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mob-mod-preview img { width: 44px; height: 44px; object-fit: contain; }

      /* Bottom Nav Nativo do Mobile com Botão FAB */
      .mob-bottom-nav {
        position: relative;
        background: #11113b;
        border-top: 1.5px solid rgba(255, 255, 255, 0.08);
        padding: 8px 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .mob-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        font-size: 11px;
        font-weight: 600;
        color: var(--g400);
      }
      .mob-nav-item.active { color: var(--lime); }
      .mob-nav-item img { width: 20px; height: 20px; object-fit: contain; }
      .mob-fab-amigos {
        position: absolute;
        right: 18px;
        top: -24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--lime);
        color: #1a1a4a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 0 25px rgba(169, 255, 113, 0.7);
        border: 3px solid #11113b;
      }

      /* Camada 2: Minigame Flappy Fish Nativo */
      #m-screen-game {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 12px 16px 16px;
        gap: 12px;
        z-index: 12;
        background: #0d0d26;
      }
      .m-vid-box {
        position: relative;
        width: 100%;
        height: 500px;
        border-radius: 24px;
        overflow: hidden;
        border: 2px solid rgba(169, 255, 113, 0.4);
        background: #09091f;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
      }
      .m-vid-box video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .m-badge-over {
        position: absolute;
        left: 14px;
        bottom: 14px;
        background: rgba(18, 18, 50, 0.85);
        border: 1px solid var(--lime);
        border-radius: 12px;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        backdrop-filter: blur(10px);
      }
      .m-reward-card {
        background: linear-gradient(135deg, rgba(39, 39, 94, 0.9), rgba(26, 26, 74, 0.9));
        border: 1.5px solid var(--lime);
        border-radius: 18px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 8px 24px rgba(169, 255, 113, 0.2);
      }

      /* ========================================================
         PAINEL DO PROFESSOR NATIVO (100% CSS, FIEL A TURMA-PROFESSOR.HTML)
         ======================================================== */
      #prof-overlay {
        position: absolute;
        left: 0;
        top: 20px;
        width: 1040px;
        height: 750px;
        background: #11113b;
        border-radius: 26px;
        border: 2px solid rgba(169, 255, 113, 0.5);
        box-shadow: 0 35px 90px rgba(0, 0, 0, 0.85), 0 0 60px rgba(169, 255, 113, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 28;
      }
      .prof-topbar {
        height: 52px;
        background: rgba(16, 16, 55, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .prof-back {
        color: #b9b9db;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .prof-back span { color: var(--lime); font-size: 16px; }
      .prof-badge-pill {
        background: linear-gradient(135deg, rgba(169,255,113,.25), rgba(169,255,113,.1));
        border: 1px solid rgba(169,255,113,.4);
        color: var(--lime);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 2px 8px;
        border-radius: 20px;
      }
      .prof-content-scroll {
        flex: 1;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: hidden;
      }
      .prof-hero-card {
        padding: 18px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(169, 255, 113, .25);
        border-radius: 20px;
        background: linear-gradient(120deg, rgba(72, 72, 145, .58), rgba(24, 24, 73, .85));
        box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
      }
      .prof-convite-box {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 18px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        background: rgba(16, 16, 55, .6);
      }
      .prof-convite-box strong {
        color: var(--lime);
        font-size: 22px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }
      .btn-prof-export {
        border: 1px solid rgba(169, 255, 113, .35);
        border-radius: 16px;
        padding: 12px 20px;
        color: #171744;
        background: linear-gradient(135deg, #b7ff8e, #8fe858);
        font: 800 14px 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 6px 18px rgba(169, 255, 113, .3);
      }

      /* 6 KPIs Docentes */
      .prof-kpis-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
      }
      .kpi-tile {
        background: rgba(39, 39, 94, .7);
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 14px;
        padding: 12px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .kpi-tile-top {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .kpi-ico {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        font-size: 13px;
      }
      .kpi-tile strong { font-size: 20px; font-weight: 800; line-height: 1; color: #fff; margin-top: 2px; }
      .kpi-tile small { font-size: 10px; color: #b9b9db; }

      /* Módulos e Gráficos do Professor */
      .prof-lower-grid {
        display: grid;
        grid-template-columns: 1.8fr 1fr;
        gap: 14px;
      }
      .prof-panel-box {
        background: rgba(39, 39, 94, .65);
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 18px;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .prof-mod-bar-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .prof-mod-bar-header {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 600;
      }
      .prof-bar-track {
        height: 8px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        overflow: hidden;
      }
      .prof-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--lime-d), var(--lime));
        border-radius: 4px;
      }
"""

# Substituir o CSS antigo de S4
text = re.sub(r'/\* ===== S4 Split-Stage:.*?/\* ===== S5 ===== \*/', css_native + "\n      /* ===== S5 ===== */", text, flags=re.S)

# 2. Criar o HTML com tudo 100% nativo em Section #s4
new_s4_html = """<section id="s4" class="scene">
        <!-- Coluna da Esquerda: Narrativa Limpa & Recursos Completos do Sementis -->
        <div class="s4-narrative">
          <!-- Bloco 1 (60s – 67.2s): Plataforma Gamificada & Recursos Principais -->
          <div id="s4-n1" class="s4-narr-block">
            <div class="eyebrow">MVP 100% FUNCIONAL NO AR · PWA</div>
            <div class="h1" style="font-size: 60px; margin-top: 14px; line-height: 1.15;">
              Plataforma <span class="lime">gamificada</span>
            </div>
            <p class="narr-desc">
              Desenvolvida de estudantes para estudantes, combinando sustentabilidade, tecnologia e alto engajamento diário.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/premiosmachine.png" alt="" /> Gacha de Avatares & Loja</div>
              <div class="n-chip"><img src="assets/img/menu_rodape_trofeu_liga.png" alt="" /> Ranking Escolar & Ligas</div>
              <div class="n-chip"><img src="assets/img/icone_sequencia_fogo.png" alt="" /> Ofensiva Diária (Streaks)</div>
            </div>
          </div>

          <!-- Bloco 2 (67.2s – 75.0s): Mobile, Social, Quizzes e Minigames -->
          <div id="s4-n2" class="s4-narr-block">
            <div class="eyebrow">INTERAÇÃO SOCIAL & FOCO MOBILE</div>
            <div class="h1" style="font-size: 60px; margin-top: 14px; line-height: 1.15;">
              Minigames e <span class="lime">Quizzes</span>
            </div>
            <p class="narr-desc">
              Estímulos lúdicos com dinâmica social e desafios em tempo real para retenção ativa de foco.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/icone_tarefa.png" alt="" /> Quizzes ao Vivo na Arena</div>
              <div class="n-chip"><img src="assets/img/icone_usuario.png" alt="" /> Sistema de Amigos & Desafios</div>
              <div class="n-chip"><img src="assets/img/menu_games.png" alt="" /> Minigames Rápidos (Flappy Fish)</div>
            </div>
          </div>

          <!-- Bloco 3 (75.0s – 83.2s): Gestão do Professor -->
          <div id="s4-n3" class="s4-narr-block">
            <div class="eyebrow">GESTÃO DOCENTE COMPLETA</div>
            <div class="h1" style="font-size: 60px; margin-top: 14px; line-height: 1.15;">
              O professor no <span class="lime">controle</span>
            </div>
            <p class="narr-desc">
              Crie turmas com código de convite, acompanhe métricas de evolução em tempo real e engaje sem burocracia.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/turma_icon.png" alt="" /> Gestão de Turmas (Código ALB123)</div>
              <div class="n-chip"><img src="assets/img/tarefa_basico1.png" alt="" /> Diagnóstico Curricular por Módulo</div>
              <div class="n-chip dim">🌐 100% no navegador · Sem baixar nada na loja</div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Vitrine Visual 100% Nativa com Profundidade 3D -->
        <div class="s4-showcase">
          <!-- Monitor Desktop: Fiel com Sidebar Real (Trilhas, Turmas, Ligas, etc.) -->
          <div id="desktop-window" class="abs browser-mockup">
            <div class="browser-top">
              <div class="browser-dots"><div class="b-dot b-red"></div><div class="b-dot b-yel"></div><div class="b-dot b-grn"></div></div>
              <div class="browser-addr">https://sementis.com.br/home</div>
            </div>
            <div class="browser-body">
              <div class="b-sidebar">
                <div class="b-side-item active"><img src="assets/img/icone_tarefa.png" alt="" />Trilhas</div>
                <div class="b-side-item"><img src="assets/img/turma_icon.png" alt="" />Turmas</div>
                <div class="b-side-item"><img src="assets/img/menu_rodape_trofeu_liga.png" alt="" />Ligas</div>
                <div class="b-side-item"><img src="assets/img/menu_rodape_alvo.png" alt="" />Missões</div>
                <div class="b-side-item"><img src="assets/img/loja1.png" alt="" />Loja</div>
                <div class="b-side-item"><img src="assets/img/menu_games.png" alt="" />Jogos</div>
                <div class="b-side-item"><img src="assets/img/icone_usuario.png" alt="" />Perfil</div>
              </div>
              <div class="b-main-content">
                <div class="b-head-top">
                  <img src="assets/img/logo_sementis_branco.png" alt="Sementis" style="height:30px;width:auto" />
                  <div class="b-stats">
                    <div class="b-stat"><img src="assets/img/icone_sequencia_fogo.png" alt="" />30</div>
                    <div class="b-stat"><img src="assets/img/icone_moeda.png" alt="" />510</div>
                    <div class="b-stat"><img src="assets/img/icone_vida.png" alt="" />5</div>
                  </div>
                </div>
                <div class="b-user-card">
                  <div class="b-user-info">
                    <div class="b-avatar"><img src="assets/img/icone_usuario.png" alt="" /></div>
                    <div><div class="b-user-name">Pedro Henrique Santos da Silva</div><div class="b-user-lvl">Nível 10 · Aluno Destaque</div></div>
                  </div>
                  <div class="b-xp-bar"><div class="b-xp-fill" id="ui-xp-fill"></div></div>
                  <div class="b-xp-sub">Faltam 5% para o próximo nível</div>
                </div>
                <div class="b-live-banner">
                  <div style="display:flex;align-items:center;gap:14px">
                    <div class="b-live-badge"><i></i>AO VIVO</div>
                    <div><div style="font-size:15px;font-weight:700">Sementis Live — Arena ao Vivo</div><div style="font-size:12px;color:var(--g300);margin-top:2px">Desafio em tempo real iniciado pelo professor</div></div>
                  </div>
                  <div class="b-live-btn">Jogar Agora →</div>
                </div>
                <div>
                  <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">Módulos em Andamento</div>
                  <div class="b-mod-grid">
                    <div class="b-mod-card"><img class="b-mod-icon" src="assets/img/tarefa_basico1.png" alt="" /><div class="b-mod-title">Fundamentos</div><div class="b-mod-desc">Conceitos básicos</div><div class="b-mod-prog">5/5 lições ✓</div></div>
                    <div class="b-mod-card" style="border-color:rgba(169,255,113,.4);box-shadow:0 0 18px rgba(169,255,113,.15)"><img class="b-mod-icon" src="assets/img/tarefa_agua.png" alt="" /><div class="b-mod-title">Água e Vida</div><div class="b-mod-desc">Uso consciente</div><div class="b-mod-prog">3/4 lições</div></div>
                    <div class="b-mod-card"><img class="b-mod-icon" src="assets/img/tarefa_clima.png" alt="" /><div class="b-mod-title">Mudanças Climáticas</div><div class="b-mod-desc">Aquecimento global</div><div class="b-mod-prog">Disponível</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Smartphone Hero 100% NATIVO (App Real primeiro, depois Minigame Flappy Fish) -->
          <div id="mobile-hero" class="abs">
            <div class="m-notch"></div>
            <div class="m-screen-container">
              <!-- Camada 1: App Mobile Nativo do Sementis (Recriado em HTML/CSS) -->
              <div id="m-screen-app">
                <div class="mob-topbar">
                  <div class="mob-logo">
                    <img src="assets/img/logo_sementis_branco.png" alt="Sementis" />
                  </div>
                  <div class="mob-stats">
                    <div class="mob-stat-chip"><img src="assets/img/icone_sequencia_fogo.png" alt="" /> 0</div>
                    <div class="mob-stat-chip"><img src="assets/img/icone_moeda.png" alt="" /> 510</div>
                    <div class="mob-stat-chip"><img src="assets/img/icone_vida.png" alt="" /> 2</div>
                    <div class="mob-avatar-btn"><img src="assets/img/icone_usuario.png" alt="" /></div>
                  </div>
                </div>
                <div class="mob-scroll-body">
                  <div class="mob-user-card">
                    <div style="display:flex;align-items:center;gap:12px">
                      <div class="b-avatar"><img src="assets/img/icone_usuario.png" alt="" /></div>
                      <div>
                        <div style="font-size:15px;font-weight:700;color:#fff">Pedro Henrique Santos da Silva</div>
                        <div style="font-size:12px;color:var(--g400)">Nível 10</div>
                      </div>
                    </div>
                    <div class="b-xp-bar" style="margin-top:10px"><div class="b-xp-fill" id="mob-xp-fill" style="width:95%"></div></div>
                    <div style="font-size:11px;color:var(--g400);margin-top:4px">Faltam 5% para o próximo nível</div>
                  </div>

                  <div class="mob-live-banner">
                    <div class="mob-live-header">
                      <div class="mob-live-title">💡 Sementis Live — Arena ao Vivo</div>
                      <div class="mob-live-badge">AO VIVO</div>
                    </div>
                    <div class="mob-live-desc">O professor iniciou um desafio? Digite o PIN da sala e dispute o pódio!</div>
                    <div class="mob-live-btn">Jogar Agora →</div>
                  </div>

                  <div style="font-size:14px;font-weight:800;color:#fff;margin-top:2px">Escolha um Módulo</div>
                  <div class="mob-mod-preview">
                    <img src="assets/img/tarefa_agua.png" alt="" />
                    <div style="flex:1">
                      <div style="font-size:13px;font-weight:700;color:#fff">Água e Vida</div>
                      <div style="font-size:11px;color:var(--lime)">3/4 lições em andamento</div>
                    </div>
                  </div>
                </div>

                <!-- Barra de Navegação Inferior Nativa com Botão FAB de Amigos -->
                <div class="mob-bottom-nav">
                  <div class="mob-nav-item active"><img src="assets/img/icone_tarefa.png" alt="" />Trilhas</div>
                  <div class="mob-nav-item"><img src="assets/img/menu_rodape_trofeu_liga.png" alt="" />Ligas</div>
                  <div class="mob-nav-item"><img src="assets/img/menu_rodape_alvo.png" alt="" />Missões</div>
                  <div class="mob-nav-item"><img src="assets/img/loja1.png" alt="" />Loja</div>
                  <div class="mob-nav-item"><img src="assets/img/icone_usuario.png" alt="" />Mais</div>
                  <div class="mob-fab-amigos">👤⁺</div>
                </div>
              </div>

              <!-- Camada 2: O Minigame Flappy Fish Nativo -->
              <div id="m-screen-game">
                <div class="m-header">
                  <img src="assets/img/logo_sementis_branco.png" alt="Sementis" style="height:22px;width:auto" />
                  <div style="display:flex;gap:12px;font-size:14px;font-weight:700">
                    <span style="color:var(--lime)">🔥 30</span>
                    <span style="color:#ffd700">🪙 510</span>
                  </div>
                </div>
                <div class="m-vid-box">
                  <video id="vid-fish" class="clip" src="assets/video/flappy-fish.webm" muted playsinline data-start="69.8" data-duration="5.0" data-has-audio="false"></video>
                  <div class="m-badge-over">
                    <span>🎮</span> Flappy Fish · Minigame
                  </div>
                </div>
                <div class="m-reward-card">
                  <div>
                    <div style="font-size:15px;font-weight:800;color:var(--lime)">Foco & Recompensa</div>
                    <div style="font-size:12px;color:#d1d1d9">Missão concluída com sucesso</div>
                  </div>
                  <div style="font-size:16px;font-weight:800;color:#fff">+150 XP</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Painel Docente 100% NATIVO (Fiel ao turma-professor.html) -->
          <div id="prof-overlay" class="abs">
            <div class="prof-topbar">
              <div class="prof-back"><span>←</span> Minhas turmas</div>
              <img src="assets/img/logo_sementis_branco.png" alt="Sementis" style="height:26px;width:auto" />
              <div style="display:flex;align-items:center;gap:10px">
                <span class="prof-badge-pill">PROFESSOR</span>
                <span style="font-size:13px;font-weight:600;color:#b9b9db">Prof. Albano</span>
              </div>
            </div>

            <div class="prof-content-scroll">
              <!-- Hero da Turma -->
              <div class="prof-hero-card">
                <div>
                  <div style="font-size:11px;font-weight:800;color:var(--lime);letter-spacing:1px">🌿 ESPAÇO DA TURMA</div>
                  <div style="font-size:26px;font-weight:800;color:#fff;margin-top:4px">Desenvolvimento Web - Albano</div>
                  <div style="font-size:13px;color:#b9b9db;margin-top:3px">Criada em 07/09/2026. Acompanhe o avanço pedagógico e engajamento da turma.</div>
                </div>
                <div style="display:flex;align-items:center;gap:14px">
                  <div class="prof-convite-box">
                    <img src="assets/img/premiosmachine.png" alt="" style="width:36px;height:36px;object-fit:contain" />
                    <div>
                      <div style="font-size:10px;font-weight:700;color:#b9b9db;text-transform:uppercase">Código de convite</div>
                      <strong>ALB123</strong>
                    </div>
                  </div>
                  <div class="btn-prof-export">📥 Exportar ▾</div>
                </div>
              </div>

              <!-- Grade de 6 Indicadores Pedagógicos -->
              <div class="prof-kpis-grid">
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(169,255,113,.18);color:#a9ff71">👥</div><small>Alunos</small></div>
                  <strong>6</strong>
                  <small>matriculados</small>
                </div>
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(169,255,113,.18);color:#a9ff71">📈</div><small>Ativos</small></div>
                  <strong>4</strong>
                  <small>com XP recente</small>
                </div>
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(105,204,255,.18);color:#69ccff">⚡</div><small>XP Médio</small></div>
                  <strong>593</strong>
                  <small>por aluno</small>
                </div>
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(255,176,95,.18);color:#ffb05f">⏱️</div><small>Progresso</small></div>
                  <strong>5%</strong>
                  <small>das atividades</small>
                </div>
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(255,118,118,.18);color:#ff7676">⚠️</div><small>Apoio</small></div>
                  <strong style="color:#ff7676">6</strong>
                  <small>precisam apoio</small>
                </div>
                <div class="kpi-tile">
                  <div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(192,132,252,.18);color:#c084fc">🏆</div><small>Destaque</small></div>
                  <strong>0</strong>
                  <small>alto ritmo</small>
                </div>
              </div>

              <!-- Painéis Inferiores: Diagnóstico Curricular + Progresso da Turma -->
              <div class="prof-lower-grid">
                <div class="prof-panel-box">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div style="font-size:14px;font-weight:800;color:#fff">Diagnóstico Curricular · Progresso por Módulo</div>
                    <span style="font-size:11px;color:var(--lime)">Avanço consolidado</span>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px">
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Fundamentos</span><span style="color:var(--lime)">3%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" style="width:3%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Água e Vida</span><span style="color:var(--lime)">0%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" style="width:0%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Mudança Climática</span><span style="color:var(--lime)">0%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" style="width:0%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Trilhas Personalizadas</span><span style="color:var(--lime)">9%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" style="width:9%"></div></div>
                    </div>
                  </div>
                </div>

                <div class="prof-panel-box" style="align-items:center;justify-content:center;text-align:center">
                  <div style="font-size:13px;font-weight:800;color:#fff;width:100%;text-align:left">Progresso da Turma</div>
                  <div style="position:relative;width:90px;height:90px;margin:4px 0">
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8" />
                      <circle cx="45" cy="45" r="38" fill="none" stroke="#a9ff71" stroke-width="8" stroke-dasharray="238.7" stroke-dashoffset="238.7" />
                    </svg>
                    <div style="position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center">
                      <strong style="font-size:18px;color:#a9ff71">0%</strong>
                      <small style="font-size:9px;color:#b9b9db">em dia</small>
                    </div>
                  </div>
                  <div style="font-size:11px;color:#b9b9db">Ritmo Semanal: 593 XP médio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>"""

text = re.sub(r'<section id="s4".*?</section>', new_s4_html, text, flags=re.S)

# 3. Atualizar a animação GSAP de S4
new_gsap_s4 = """// =====================================================================
      // S4 · Plataforma (60 – 83.2) - Split Stage 100% NATIVO
      // =====================================================================
      SCENE("#s4", 60.0, 83.2);
      ["#s4-n1", "#s4-n2", "#s4-n3", "#desktop-window", "#mobile-hero", "#prof-overlay"].forEach(hide);

      // Bloco 1: 60.0s – 67.0s (Plataforma Gamificada MVP com Sidebar Real)
      IN("#s4-n1", 60.3, { x: -40, d: 0.8 });
      IN("#desktop-window", 60.4, { s: 0.95, y: 30, d: 0.9 });
      tl.fromTo("#ui-xp-fill", { width: "20%" }, { width: "95%", duration: 2.4, ease: "power2.out" }, 61.2);
      tl.to(".b-live-badge", { scale: 1.08, duration: 0.5, repeat: 8, yoyo: true, ease: "sine.inOut" }, 61.5);
      OUT("#s4-n1", 66.8, 0.4);

      // Bloco 2: 67.2s – 74.8s (Mobile Nativo primeiro, depois Minigame Flappy Fish)
      IN("#s4-n2", 67.2, { x: -40, d: 0.8 });
      // PC recua com profundidade 3D e blur
      tl.to("#desktop-window", { scale: 0.86, x: -35, filter: "blur(12px) brightness(0.4)", opacity: 0.35, duration: 0.85, ease: "power2.inOut" }, 67.2);
      
      // Smartphone avança exibindo o App Mobile Nativo
      gsap.set("#m-screen-app", { opacity: 1 });
      gsap.set("#m-screen-game", { opacity: 0 });
      tl.fromTo("#mobile-hero", { opacity: 0, x: 120, scale: 0.9 }, { opacity: 1, x: 0, scale: 1.02, duration: 0.85, ease: "back.out(1.3)" }, 67.3);
      tl.to("#mobile-hero", { y: -8, duration: 2.4, ease: "sine.inOut", repeat: 1, yoyo: true }, 68.2);

      // Aos 69.8s: transição suave dentro do celular do App Nativo para o Minigame Flappy Fish
      tl.to("#m-screen-app", { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 69.8);
      tl.fromTo("#m-screen-game", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1.0, duration: 0.45, ease: "power2.out" }, 70.0);

      OUT("#s4-n2", 74.5, 0.4);

      // Bloco 3: 75.0s – 83.2s (Professor no Controle com Painel Docente Nativo turma-professor)
      IN("#s4-n3", 75.0, { x: -40, d: 0.8 });
      // Celular sai suavemente
      tl.to("#mobile-hero", { opacity: 0, y: 70, scale: 0.92, duration: 0.55, ease: "power2.in" }, 74.7);
      // Painel docente surge na vitrine direita ocupando o espaço com autoridade nativa
      tl.fromTo("#prof-overlay", { opacity: 0, y: 35, scale: 0.96 }, { opacity: 1, y: 0, scale: 1.0, duration: 0.7, ease: "power3.out" }, 75.0);
      tl.to("#desktop-window", { opacity: 0, duration: 0.4 }, 75.0);

"""

text = re.sub(r'// S4 · Plataforma.*?(?=      // =+\n      // S5)', new_gsap_s4, text, flags=re.S)

with open(template_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Telas 100% nativas aplicadas no template!")
