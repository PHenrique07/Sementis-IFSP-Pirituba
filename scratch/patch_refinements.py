import re

template_path = "brag-output-2026-10-17-164801/index.template.html"
with open(template_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Atualizar Section #s4 no HTML
new_s4_html = """<section id="s4" class="scene">
        <!-- Coluna da Esquerda: Narrativa Limpa & Funcionalidades Reais -->
        <div class="s4-narrative">
          <!-- Bloco 1 (60s – 67.0s): Gamificação & Recompensas -->
          <div id="s4-n1" class="s4-narr-block">
            <div class="eyebrow">PLATAFORMA GAMIFICADA · PWA</div>
            <div class="h1" style="font-size: 58px; margin-top: 14px; line-height: 1.15;">
              Gamificação que <span class="lime">engaja os alunos</span>
            </div>
            <p class="narr-desc">
              Estímulos diários com mecânicas de jogos que transformam o aprendizado em hábito contínuo.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/icone_sequencia_fogo.png" alt="" /> Ofensiva diária (Streaks) para retenção</div>
              <div class="n-chip"><img src="assets/img/menu_rodape_trofeu_liga.png" alt="" /> Ranking escolar e ligas competitivas</div>
              <div class="n-chip"><img src="assets/img/icone_moeda.png" alt="" /> Moedas, vidas e recompensas virtuais</div>
            </div>
          </div>

          <!-- Bloco 2 (67.2s – 74.8s): Minigames, Arcade e Social -->
          <div id="s4-n2" class="s4-narr-block">
            <div class="eyebrow">MINIGAMES & FOCO MOBILE</div>
            <div class="h1" style="font-size: 58px; margin-top: 14px; line-height: 1.15;">
              Minigames, <span class="lime">Arcade e Quizzes</span>
            </div>
            <p class="narr-desc">
              Os estímulos dos jogos favoritos com desafios em tempo real para fixação ativa do conteúdo.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/menu_games.png" alt="" /> Minigames rápidos e arcade interativo</div>
              <div class="n-chip"><img src="assets/img/menu_rodape_alvo.png" alt="" /> Arena Sementis Live com quizzes ao vivo</div>
              <div class="n-chip"><img src="assets/img/icone_usuario.png" alt="" /> Sistema de amigos e desafios pedagógicos</div>
            </div>
          </div>

          <!-- Bloco 3 (75.0s – 83.2s): Gestão Docente & Painel do Professor -->
          <div id="s4-n3" class="s4-narr-block">
            <div class="eyebrow">PAINEL DOCENTE SEM ATRITO</div>
            <div class="h1" style="font-size: 58px; margin-top: 14px; line-height: 1.15;">
              O professor no <span class="lime">controle</span>
            </div>
            <p class="narr-desc">
              Tudo direto no navegador, sem baixar nada na loja e pronto para aplicar na rotina da sala de aula.
            </p>
            <div class="narr-chips">
              <div class="n-chip solid"><img src="assets/img/turma_icon.png" alt="" /> Gestão de turmas com código de convite rápido</div>
              <div class="n-chip"><img src="assets/img/icone_tarefa.png" alt="" /> Acompanhar progresso e desempenho dos alunos</div>
              <div class="n-chip">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a9ff71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                Gerar e exportar relatórios da turma em PDF
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Vitrine Visual 100% Nativa -->
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

          <!-- Máquina Arcade 3D Flutuante ao Lado do Celular -->
          <div id="arcade-hero" class="abs" style="left: 40px; top: 150px; width: 420px; height: 420px; z-index: 26;">
            <video id="vid-arcade" class="clip" src="assets/video/arcade.webm" muted playsinline data-start="67.2" data-duration="7.6" data-has-audio="false" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 20px 45px rgba(0,0,0,0.65));"></video>
            <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(18,18,50,0.92); border: 1.5px solid var(--lime); border-radius: 12px; padding: 6px 14px; font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; box-shadow: 0 0 20px rgba(169,255,113,0.3); backdrop-filter: blur(8px);">
              🕹️ Arcade & Minigames
            </div>
          </div>

          <!-- Smartphone Hero 100% NATIVO -->
          <div id="mobile-hero" class="abs" style="left: 490px; top: 15px; width: 390px; height: 760px; z-index: 25;">
            <div class="m-notch"></div>
            <div class="m-screen-container">
              <!-- Camada 1: App Mobile Nativo do Sementis -->
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

                <!-- Barra de Navegação Inferior com Botão FAB de Amigos -->
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
                    <img src="assets/img/turma_icon.png" alt="" style="width:36px;height:36px;object-fit:contain" />
                    <div>
                      <div style="font-size:10px;font-weight:700;color:#b9b9db;text-transform:uppercase">Código de convite</div>
                      <strong>ALB123</strong>
                    </div>
                  </div>
                  <div class="btn-prof-export">📥 Exportar Relatório ▾</div>
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

# 2. Atualizar a animação GSAP de S4 com transições suaves e SEM TELA PRETA
new_gsap_s4 = """// =====================================================================
      // S4 · Plataforma (60 – 83.2) - Split Stage Fluido (Sem tela preta)
      // =====================================================================
      SCENE("#s4", 60.0, 83.2);
      ["#s4-n1", "#s4-n2", "#s4-n3", "#desktop-window", "#mobile-hero", "#arcade-hero", "#prof-overlay"].forEach(hide);

      // Bloco 1: 60.0s – 67.0s (Plataforma Gamificada MVP com Sidebar Real)
      IN("#s4-n1", 60.3, { x: -35, d: 0.7 });
      IN("#desktop-window", 60.4, { s: 0.95, y: 30, d: 0.9 });
      tl.fromTo("#ui-xp-fill", { width: "20%" }, { width: "95%", duration: 2.4, ease: "power2.out" }, 61.2);
      tl.to(".b-live-badge", { scale: 1.08, duration: 0.5, repeat: 8, yoyo: true, ease: "sine.inOut" }, 61.5);
      OUT("#s4-n1", 66.8, 0.35);

      // Bloco 2: 67.0s – 74.6s (Transição Contínua: Desktop fica ao fundo, Arcade e Mobile entram em destaque)
      IN("#s4-n2", 67.1, { x: -35, d: 0.7 });
      
      // O Desktop recua suavemente mantendo luminosidade ao fundo (sem ficar preto!)
      tl.to("#desktop-window", { scale: 0.92, x: -30, filter: "blur(6px) brightness(0.75)", opacity: 0.55, duration: 0.8, ease: "power2.inOut" }, 67.0);

      // Máquina Arcade 3D e Smartphone entram juntos com dinamismo
      gsap.set("#m-screen-app", { opacity: 1 });
      gsap.set("#m-screen-game", { opacity: 0 });
      tl.fromTo("#arcade-hero", { opacity: 0, x: -50, scale: 0.86 }, { opacity: 1, x: 0, scale: 1.0, duration: 0.85, ease: "back.out(1.3)" }, 67.1);
      tl.to("#arcade-hero", { y: -10, duration: 2.5, ease: "sine.inOut", repeat: 1, yoyo: true }, 68.0);

      tl.fromTo("#mobile-hero", { opacity: 0, x: 70, scale: 0.94 }, { opacity: 1, x: 0, scale: 1.0, duration: 0.8, ease: "back.out(1.2)" }, 67.2);
      tl.to("#mobile-hero", { y: -8, duration: 2.4, ease: "sine.inOut", repeat: 1, yoyo: true }, 68.2);

      // Aos 69.8s: transição suave dentro do celular do App Nativo para o Minigame Flappy Fish
      tl.to("#m-screen-app", { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 69.8);
      tl.fromTo("#m-screen-game", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1.0, duration: 0.45, ease: "power2.out" }, 70.0);

      OUT("#s4-n2", 74.6, 0.35);

      // Bloco 3: 74.7s – 83.2s (Crossfade Imediato: Arcade e Mobile dão lugar ao Painel Docente, SEM TELA PRETA)
      IN("#s4-n3", 74.8, { x: -35, d: 0.7 });
      tl.to("#mobile-hero", { opacity: 0, x: 40, scale: 0.94, duration: 0.45, ease: "power2.in" }, 74.6);
      tl.to("#arcade-hero", { opacity: 0, x: -40, scale: 0.9, duration: 0.45, ease: "power2.in" }, 74.6);
      
      // Painel docente surge com transição suave preenchendo o palco
      tl.fromTo("#prof-overlay", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1.0, duration: 0.55, ease: "power3.out" }, 74.7);
      tl.to("#desktop-window", { opacity: 0, duration: 0.3 }, 74.9);

"""

text = re.sub(r'// S4 · Plataforma.*?(?=      // =+\n      // S5)', new_gsap_s4, text, flags=re.S)

with open(template_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Template refinado com sucesso!")
