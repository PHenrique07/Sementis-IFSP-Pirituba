import re

template_path = "brag-output-2026-10-17-164801/index.template.html"
with open(template_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Adicionar estilo de pulsação luminosa no botão do relatório
pulse_css = """
      /* Animação pulsante para o botão de exportar relatório */
      @keyframes pulseReport {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 6px 18px rgba(169, 255, 113, .3);
          border-color: rgba(169, 255, 113, .35);
        }
        50% {
          transform: scale(1.06);
          box-shadow: 0 0 35px rgba(169, 255, 113, .9), 0 0 15px #a9ff71;
          border-color: #ffffff;
        }
      }
      .btn-prof-export.pulsing {
        animation: pulseReport 1.1s infinite ease-in-out;
      }
"""
if "@keyframes pulseReport" not in text:
    text = text.replace(".btn-prof-export {", pulse_css + "\n      .btn-prof-export {")

# 2. Atualizar o HTML dos elementos do painel docente com IDs específicos para animação
old_hero_actions = r'<div class="btn-prof-export">📥 Exportar Relatório ▾</div>'
new_hero_actions = '<div class="btn-prof-export pulsing" id="btn-prof-export">📥 Exportar Relatório ▾</div>'
text = text.replace(old_hero_actions, new_hero_actions)

old_kpi_xp = r'<div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba\(105,204,255,\.18\);color:#69ccff">⚡</div><small>XP Médio</small></div>\s*<strong>593</strong>'
new_kpi_xp = '<div class="kpi-tile-top"><div class="kpi-ico" style="background:rgba(105,204,255,.18);color:#69ccff">⚡</div><small>XP Médio</small></div>\n                  <strong id="kpi-prof-xp">593</strong>'
text = re.sub(old_kpi_xp, new_kpi_xp, text)

# Atualizar as 4 barras de módulos
old_mod_bars = """<div class="prof-mod-bar-row">
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
                    </div>"""

new_mod_bars = """<div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Fundamentos</span><span style="color:var(--lime)" id="val-m1">3%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" id="bar-m1" style="width:3%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Água e Vida</span><span style="color:var(--lime)" id="val-m2">0%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" id="bar-m2" style="width:0%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Mudança Climática</span><span style="color:var(--lime)" id="val-m3">0%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" id="bar-m3" style="width:0%"></div></div>
                    </div>
                    <div class="prof-mod-bar-row">
                      <div class="prof-mod-bar-header"><span>Trilhas Personalizadas</span><span style="color:var(--lime)" id="val-m4">9%</span></div>
                      <div class="prof-bar-track"><div class="prof-bar-fill" id="bar-m4" style="width:9%"></div></div>
                    </div>"""
text = text.replace(old_mod_bars, new_mod_bars)

# Atualizar o gráfico circular da turma com ID
old_circle = """<circle cx="45" cy="45" r="38" fill="none" stroke="#a9ff71" stroke-width="8" stroke-dasharray="238.7" stroke-dashoffset="238.7" />
                    </svg>
                    <div style="position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center">
                      <strong style="font-size:18px;color:#a9ff71">0%</strong>"""

new_circle = """<circle id="prof-circle-svg" cx="45" cy="45" r="38" fill="none" stroke="#a9ff71" stroke-width="8" stroke-dasharray="238.7" stroke-dashoffset="238.7" />
                    </svg>
                    <div style="position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center">
                      <strong id="prof-circle-num" style="font-size:18px;color:#a9ff71">0%</strong>"""
text = text.replace(old_circle, new_circle)

# 3. Adicionar as animações GSAP no Bloco 3 do S4
old_block_3_gsap = """      // Transição limpa direta para o Painel do Professor
      tl.to("#arcade-hero", { opacity: 0, x: -30, duration: 0.4, ease: "power2.in" }, 74.5);
      tl.to("#mobile-hero", { opacity: 0, x: 30, duration: 0.4, ease: "power2.in" }, 74.5);
      IN("#prof-overlay", 74.6, { s: 0.96, y: 16, d: 0.7 });
      tl.to("#desktop-window", { opacity: 0, duration: 0.3 }, 74.7);"""

new_block_3_gsap = """      // Transição limpa direta para o Painel do Professor
      tl.to("#arcade-hero", { opacity: 0, x: -30, duration: 0.4, ease: "power2.in" }, 74.5);
      tl.to("#mobile-hero", { opacity: 0, x: 30, duration: 0.4, ease: "power2.in" }, 74.5);
      IN("#prof-overlay", 74.6, { s: 0.96, y: 16, d: 0.7 });
      tl.to("#desktop-window", { opacity: 0, duration: 0.3 }, 74.7);

      // Animação dinâmica das barras de progresso e XP no painel docente
      tl.fromTo("#bar-m1", { width: "3%" }, { width: "85%", duration: 2.2, ease: "power2.out" }, 75.4);
      tl.fromTo("#bar-m2", { width: "0%" }, { width: "70%", duration: 2.4, ease: "power2.out" }, 75.5);
      tl.fromTo("#bar-m3", { width: "0%" }, { width: "55%", duration: 2.3, ease: "power2.out" }, 75.6);
      tl.fromTo("#bar-m4", { width: "9%" }, { width: "94%", duration: 2.1, ease: "power2.out" }, 75.4);

      // Animação de contagem dos valores numéricos dos módulos
      const mCount = { m1: 3, m2: 0, m3: 0, m4: 9, c: 0, xp: 593 };
      tl.to(mCount, {
        m1: 85, m2: 70, m3: 55, m4: 94, c: 94, xp: 840,
        duration: 2.4, ease: "power2.out",
        onUpdate: () => {
          const e1 = document.getElementById("val-m1"); if (e1) e1.textContent = Math.round(mCount.m1) + "%";
          const e2 = document.getElementById("val-m2"); if (e2) e2.textContent = Math.round(mCount.m2) + "%";
          const e3 = document.getElementById("val-m3"); if (e3) e3.textContent = Math.round(mCount.m3) + "%";
          const e4 = document.getElementById("val-m4"); if (e4) e4.textContent = Math.round(mCount.m4) + "%";
          const ec = document.getElementById("prof-circle-num"); if (ec) ec.textContent = Math.round(mCount.c) + "%";
          const exp = document.getElementById("kpi-prof-xp"); if (exp) exp.textContent = Math.round(mCount.xp);
        }
      }, 75.4);

      // Animação do círculo de progresso da turma
      tl.to("#prof-circle-svg", { strokeDashoffset: 238.7 * (1 - 0.94), duration: 2.4, ease: "power2.out" }, 75.4);"""

text = text.replace(old_block_3_gsap, new_block_3_gsap)

with open(template_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Animações do painel do professor aplicadas com sucesso!")
