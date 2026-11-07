import re

template_path = "brag-output-2026-10-17-164801/index.template.html"
with open(template_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Ajustar áudio de fundo (bed.mp3) para 0.045
text = re.sub(
    r'<audio id="bed"[^>]*>',
    '<audio id="bed" data-start="0" data-duration="163.9" data-track-index="2" data-volume="0.045" data-fade-in="3" data-fade-out="6" src="assets/music/bed.mp3">',
    text
)

# 2. Substituir o CSS antigo de S4 Desktop & Mobile por um CSS de Split-Stage de Alta Precisão
old_css_regex = r'/\* ===== S4 Desktop & Mobile ===== \*/.*?(?=/\* ===== S5 ===== \*/)'
new_css = """/* ===== S4 Split-Stage: Narrativa à Esquerda + Vitrine com Profundidade à Direita ===== */
      .s4-narrative {
        position: absolute;
        left: 90px;
        top: 170px;
        width: 680px;
        height: 760px;
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
        font-size: 26px;
        color: var(--g300);
        line-height: 1.42;
        margin-top: 20px;
        font-weight: 500;
      }
      .narr-chips {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .n-chip {
        display: inline-flex;
        align-items: center;
        gap: 16px;
        padding: 14px 24px;
        border-radius: 9999px;
        font-size: 22px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.06);
        border: 1.5px solid rgba(255, 255, 255, 0.14);
        color: #ffffff;
        backdrop-filter: blur(16px);
        width: fit-content;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
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
        font-size: 20px;
      }
      .n-chip img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      /* Vitrine Direita */
      .s4-showcase {
        position: absolute;
        left: 810px;
        top: 130px;
        width: 1020px;
        height: 820px;
        perspective: 1200px;
      }

      /* Desktop Window (Fiel à Home do Sementis) */
      .browser-mockup {
        position: absolute;
        left: 0;
        top: 20px;
        width: 1000px;
        height: 740px;
        background: #14143a;
        border-radius: 26px;
        border: 2px solid rgba(169, 255, 113, 0.35);
        box-shadow: 0 35px 90px rgba(0, 0, 0, 0.7), 0 0 50px rgba(169, 255, 113, 0.12);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 10;
        transform-origin: center right;
        transition: filter 0.3s ease;
      }
      .browser-top {
        height: 48px;
        background: #1c1c46;
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        padding: 0 20px;
        gap: 16px;
      }
      .browser-dots { display: flex; gap: 8px; }
      .b-dot { width: 14px; height: 14px; border-radius: 50%; }
      .b-red { background: #ff5f56; } .b-yel { background: #ffbd2e; } .b-grn { background: #27c93f; }
      .browser-addr {
        flex: 1; max-width: 480px; margin: 0 auto; height: 30px; background: rgba(0, 0, 0, 0.3);
        border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.12);
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 14px; color: var(--g300); font-weight: 500;
      }
      .browser-body { flex: 1; display: flex; flex-direction: column; padding: 24px 28px; gap: 18px; background: #121232; overflow: hidden; }
      .b-head-top {
        display: flex; align-items: center; justify-content: space-between;
        padding-bottom: 14px; border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
      }
      .b-stats { display: flex; align-items: center; gap: 24px; }
      .b-stat { display: flex; align-items: center; gap: 8px; font-size: 19px; font-weight: 700; color: #fff; }
      .b-stat img { width: 26px; height: 26px; object-fit: contain; }

      .b-user-card {
        background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px; padding: 16px 20px;
      }
      .b-user-info { display: flex; align-items: center; gap: 14px; }
      .b-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--lime); display: flex; align-items: center; justify-content: center; }
      .b-avatar img { width: 28px; height: 28px; }
      .b-user-name { font-size: 19px; font-weight: 700; color: #fff; }
      .b-user-lvl { font-size: 14px; font-weight: 500; color: var(--g400); margin-top: 2px; }
      .b-xp-bar { height: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.12); margin-top: 12px; overflow: hidden; }
      .b-xp-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--lime-d), var(--lime)); width: 35%; box-shadow: 0 0 14px var(--lime); }
      .b-xp-sub { font-size: 13px; color: var(--g400); margin-top: 6px; font-weight: 500; }

      .b-live-banner {
        background: linear-gradient(135deg, rgba(39, 39, 94, 0.8), rgba(26, 26, 74, 0.9));
        border: 1.5px solid rgba(169, 255, 113, 0.4); border-radius: 18px; padding: 14px 20px;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        box-shadow: 0 0 30px rgba(169, 255, 113, 0.12);
      }
      .b-live-badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px;
        background: var(--lime); color: #1a1a4a; font-size: 12px; font-weight: 800; letter-spacing: .08em;
      }
      .b-live-badge i { width: 7px; height: 7px; border-radius: 50%; background: #1a1a4a; }
      .b-live-btn {
        background: var(--lime); color: #1a1a4a; font-weight: 700; font-size: 15px;
        padding: 9px 18px; border-radius: 10px; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
      }

      .b-mod-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 4px; }
      .b-mod-card {
        background: rgba(255, 255, 255, 0.05); border: 1.5px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px; padding: 18px 16px; text-align: center; display: flex; flex-direction: column; align-items: center;
      }
      .b-mod-icon { width: 68px; height: 68px; object-fit: contain; margin-bottom: 8px; }
      .b-mod-title { font-size: 17px; font-weight: 700; color: #fff; }
      .b-mod-desc { font-size: 13px; font-weight: 500; color: var(--g400); margin-top: 4px; line-height: 1.25; }
      .b-mod-prog { font-size: 12px; font-weight: 600; color: var(--lime); margin-top: 8px; }

      /* Mobile Hero Frame */
      #mobile-hero {
        position: absolute;
        right: 40px;
        top: 20px;
        width: 420px;
        height: 760px;
        background: #0d0d26;
        border-radius: 44px;
        border: 4px solid #32326b;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(169, 255, 113, 0.25);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 25;
      }
      .m-notch {
        width: 120px;
        height: 24px;
        background: #000;
        border-radius: 12px;
        margin: 10px auto 8px;
      }
      .m-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 16px 16px;
        gap: 12px;
      }
      .m-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .m-vid-box {
        position: relative;
        width: 100%;
        height: 480px;
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

      /* Painel do Professor (Overlay em 75s) */
      #prof-overlay {
        position: absolute;
        left: 20px;
        top: 40px;
        width: 960px;
        height: 700px;
        background: rgba(20, 20, 52, 0.95);
        border-radius: 28px;
        border: 2px solid rgba(169, 255, 113, 0.45);
        box-shadow: 0 35px 90px rgba(0, 0, 0, 0.8), 0 0 50px rgba(169, 255, 113, 0.2);
        backdrop-filter: blur(25px);
        padding: 36px 42px;
        display: flex;
        flex-direction: column;
        gap: 28px;
        z-index: 28;
      }
      .prof-row {
        display: flex;
        align-items: center;
        gap: 36px;
      }
      .prof-vid-frame {
        width: 380px;
        height: 380px;
        border-radius: 24px;
        overflow: hidden;
        border: 2px solid rgba(169, 255, 113, 0.4);
        background: #0d0d2a;
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.5);
      }
      .prof-vid-frame video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .prof-info-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .prof-stat-box {
        background: rgba(255, 255, 255, 0.05);
        border: 1.5px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 22px 26px;
      }
"""

text = re.sub(old_css_regex, new_css, text, flags=re.S)

# 3. Substituir o HTML da Section #s4
new_s4_html = """<section id="s4" class="scene">
        <!-- Coluna da Esquerda: Narrativa Limpa & Destaque (Sem poluição sobre telas) -->
        <div class="s4-narrative">
          <!-- Bloco 1 (60s – 67.2s): Plataforma Gamificada MVP -->
          <div id="s4-n1" class="s4-narr-block">
            <div class="eyebrow">MVP 100% FUNCIONAL NO AR · PWA</div>
            <div class="h1" style="font-size: 64px; margin-top: 14px; line-height: 1.15;">
              Plataforma <span class="lime">gamificada</span>
            </div>
            <p class="narr-desc">
              Desenvolvida de estudantes para estudantes, combinando sustentabilidade, tecnologia e alto engajamento diário.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/icone_sequencia_fogo.png" alt="" /> 30 Dias de Ofensiva Ativa</div>
              <div class="n-chip"><img src="assets/img/icone_moeda.png" alt="" /> Moedas, Vidas e Loja Virtual</div>
              <div class="n-chip"><img src="assets/img/menu_rodape_trofeu_liga.png" alt="" /> Ligas Escolares & Níveis de XP</div>
            </div>
          </div>

          <!-- Bloco 2 (67.2s – 75.0s): Foco Mobile e Estímulos dos Jogos -->
          <div id="s4-n2" class="s4-narr-block">
            <div class="eyebrow">ESTÍMULOS DOS GAMES & REDES</div>
            <div class="h1" style="font-size: 64px; margin-top: 14px; line-height: 1.15;">
              Minigames e <span class="lime">desafios</span>
            </div>
            <p class="narr-desc">
              Os mesmos estímulos das redes sociais aplicados ao aprendizado, com quizzes interativos e dinâmicas lúdicas.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/menu_games.png" alt="" /> Minigame Flappy Fish & Arcade</div>
              <div class="n-chip"><img src="assets/img/menu_rodape_alvo.png" alt="" /> Missões e Quizzes ao Vivo</div>
              <div class="n-chip dim">📱 Experiência completa e fluida no celular (PWA)</div>
            </div>
          </div>

          <!-- Bloco 3 (75.0s – 83.2s): Gestão do Professor -->
          <div id="s4-n3" class="s4-narr-block">
            <div class="eyebrow">GESTÃO DOCENTE COMPLETA</div>
            <div class="h1" style="font-size: 64px; margin-top: 14px; line-height: 1.15;">
              O professor no <span class="lime">controle</span>
            </div>
            <p class="narr-desc">
              Crie turmas, acompanhe métricas de evolução em tempo real e engaje a sala sem fricção ou burocracia.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/turma_icon.png" alt="" /> Gestão de Turmas & Lições</div>
              <div class="n-chip"><img src="assets/img/icone_tarefa.png" alt="" /> Métricas de Desempenho e Retenção</div>
              <div class="n-chip dim">🌐 Direto no navegador · Zero instalação na loja</div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: A Vitrine Visual com Profundidade 3D -->
        <div class="s4-showcase">
          <!-- Monitor Desktop: Fiel ao home.html do Sementis -->
          <div id="desktop-window" class="abs browser-mockup">
            <div class="browser-top">
              <div class="browser-dots"><div class="b-dot b-red"></div><div class="b-dot b-yel"></div><div class="b-dot b-grn"></div></div>
              <div class="browser-addr">https://sementis.com.br/home</div>
            </div>
            <div class="browser-body">
              <div class="b-head-top">
                <img src="assets/img/logo_sementis_branco.png" alt="Sementis" style="height:34px;width:auto" />
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
                  <div><div style="font-size:16px;font-weight:700">Sementis Live — Arena ao Vivo</div><div style="font-size:13px;color:var(--g300);margin-top:2px">Desafio em tempo real iniciado pelo professor</div></div>
                </div>
                <div class="b-live-btn">Jogar Agora →</div>
              </div>
              <div>
                <div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">Módulos em Andamento</div>
                <div class="b-mod-grid">
                  <div class="b-mod-card"><img class="b-mod-icon" src="assets/img/tarefa_basico1.png" alt="" /><div class="b-mod-title">Fundamentos</div><div class="b-mod-desc">Conceitos básicos de sustentabilidade</div><div class="b-mod-prog">5/5 lições completas ✓</div></div>
                  <div class="b-mod-card" style="border-color:rgba(169,255,113,.4);box-shadow:0 0 20px rgba(169,255,113,.15)"><img class="b-mod-icon" src="assets/img/tarefa_agua.png" alt="" /><div class="b-mod-title">Água e Vida</div><div class="b-mod-desc">Conservação e uso consciente da água</div><div class="b-mod-prog">3/4 lições em andamento</div></div>
                  <div class="b-mod-card"><img class="b-mod-icon" src="assets/img/tarefa_clima.png" alt="" /><div class="b-mod-title">Mudanças Climáticas</div><div class="b-mod-desc">Entenda o aquecimento global</div><div class="b-mod-prog">Disponível</div></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Smartphone Hero: Entra em Primeiro Plano aos 67.2s com Minigame -->
          <div id="mobile-hero" class="abs">
            <div class="m-notch"></div>
            <div class="m-content">
              <div class="m-header">
                <img src="assets/img/logo_sementis_branco.png" alt="Sementis" style="height:22px;width:auto" />
                <div style="display:flex;gap:12px;font-size:14px;font-weight:700">
                  <span style="color:var(--lime)">🔥 30</span>
                  <span style="color:#ffd700">🪙 510</span>
                </div>
              </div>
              <div class="m-vid-box">
                <video id="vid-fish" class="clip" src="assets/video/flappy-fish.webm" muted playsinline data-start="67.2" data-duration="7.6" data-has-audio="false"></video>
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

          <!-- Painel Docente: Entra aos 75.0s -->
          <div id="prof-overlay" class="abs">
            <div class="eyebrow" style="font-size:18px">PAINEL DOCENTE · GESTÃO SEM ATRITO</div>
            <div class="prof-row">
              <div class="prof-vid-frame">
                <video id="vid-analytics" class="clip" src="assets/video/analytics.webm" muted playsinline data-start="75.2" data-duration="8.0" data-has-audio="false"></video>
              </div>
              <div class="prof-info-col">
                <div class="prof-stat-box">
                  <div style="font-size:15px;color:var(--g400)">Turma Ativa</div>
                  <div style="font-size:28px;font-weight:800;color:var(--lime);margin-top:4px">3º Ano B · 38 Alunos</div>
                </div>
                <div class="prof-stat-box">
                  <div style="font-size:15px;color:var(--g400)">Engajamento Médio</div>
                  <div style="font-size:28px;font-weight:800;color:#ffffff;margin-top:4px">94% nas Lições e Quizzes</div>
                </div>
                <div class="prof-stat-box" style="border-color:rgba(169,255,113,0.4)">
                  <div style="font-size:15px;color:var(--lime)">Acesso Imediato</div>
                  <div style="font-size:20px;font-weight:700;color:#fff;margin-top:4px">Direto no navegador via Web PWA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>"""

text = re.sub(r'<section id="s4".*?</section>', new_s4_html, text, flags=re.S)

# 4. Substituir a animação GSAP de S4
new_gsap_s4 = """// =====================================================================
      // S4 · Plataforma (60 – 83.2) - Split Stage Dinâmico
      // =====================================================================
      SCENE("#s4", 60.0, 83.2);
      ["#s4-n1", "#s4-n2", "#s4-n3", "#desktop-window", "#mobile-hero", "#prof-overlay"].forEach(hide);

      // Bloco 1: 60.0s – 67.0s (Plataforma Gamificada MVP no PC)
      IN("#s4-n1", 60.3, { x: -40, d: 0.8 });
      IN("#desktop-window", 60.4, { s: 0.95, y: 30, d: 0.9 });
      tl.fromTo("#ui-xp-fill", { width: "20%" }, { width: "95%", duration: 2.4, ease: "power2.out" }, 61.2);
      tl.to(".b-live-badge", { scale: 1.08, duration: 0.5, repeat: 8, yoyo: true, ease: "sine.inOut" }, 61.5);
      OUT("#s4-n1", 66.8, 0.4);

      // Bloco 2: 67.2s – 74.8s (Minigames & Celular em Primeiro Plano com Blur no PC)
      IN("#s4-n2", 67.2, { x: -40, d: 0.8 });
      // PC recua com profundidade 3D e blur
      tl.to("#desktop-window", { scale: 0.88, x: -30, filter: "blur(12px) brightness(0.45)", opacity: 0.4, duration: 0.85, ease: "power2.inOut" }, 67.2);
      // Smartphone avança glorioso em primeiro plano
      tl.fromTo("#mobile-hero", { opacity: 0, x: 120, scale: 0.9 }, { opacity: 1, x: 0, scale: 1.02, duration: 0.85, ease: "back.out(1.3)" }, 67.3);
      tl.to("#mobile-hero", { y: -10, duration: 2.8, ease: "sine.inOut", repeat: 2, yoyo: true }, 68.2);
      OUT("#s4-n2", 74.5, 0.4);

      // Bloco 3: 75.0s – 83.2s (Professor no Controle com Analytics)
      IN("#s4-n3", 75.0, { x: -40, d: 0.8 });
      // Celular sai suavemente
      tl.to("#mobile-hero", { opacity: 0, y: 60, scale: 0.92, duration: 0.6, ease: "power2.in" }, 74.7);
      // Painel docente surge na vitrine direita
      tl.fromTo("#prof-overlay", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1.0, duration: 0.7, ease: "power3.out" }, 75.0);
      tl.to("#desktop-window", { opacity: 0.2, duration: 0.5 }, 75.0);

"""

text = re.sub(r'// S4 · Plataforma.*?(?=      // =+\n      // S5)', new_gsap_s4, text, flags=re.S)

with open(template_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Template atualizado com sucesso!")
