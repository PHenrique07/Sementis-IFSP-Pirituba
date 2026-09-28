# 🧠 Guia de Skills de Inteligência Artificial — Sementis

Este documento serve como página da Wiki para orientar desenvolvedores e colaboradores sobre como funcionam as **Agent Skills** integradas ao ecossistema de desenvolvimento do Sementis (compatíveis com **Google Antigravity** e **GitHub Copilot**).

---

## 📌 O que são Agent Skills?

As **Skills** são pacotes de instruções modulares, fluxos de trabalho e scripts que ensinam a IA a executar tarefas especializadas dentro do repositório, garantindo conformidade com a arquitetura do Sementis, boas práticas de engenharia e automações criativas.

* **Onde residem no projeto:**
  * [`.agents/skills/`](file:///d:/Programacao/Sementis-2/.agents/skills/): Descoberta nativa do Google Antigravity.
  * [`.github/skills/`](file:///d:/Programacao/Sementis-2/.github/skills/): Compatibilidade com o GitHub Copilot e CI/CD.
  * Indexadas centralmente no arquivo [`.agents/skills.json`](file:///d:/Programacao/Sementis-2/.agents/skills.json).

---

## 🌟 Skills em Destaque

### 1. `sementis-squad` (O Esquadrão Sementis)
> **Objetivo:** Orquestrar o fluxo de desenvolvimento respeitando a arquitetura única do Sementis.

O esquadrão define o papel de cada agente especializado:
* 🤖 **SemeIA (Orquestradora):** Avalia se a tarefa é simples (*Fast Path*) ou estrutural (*Full Pipeline*).
* 🔍 **BrinIA (Pesquisa & Análise):** Investiga o problema e propõe abordagens técnicas sem modificar código.
* 📐 **CaIA (Planejamento Estratégico):** Define contratos de dados (JSON), arquitetura e testes antes da implementação.
* 💻 **GratIA (Implementação & UI):** Codifica no padrão do projeto (Flask + SQLModel + Vanilla JS/HTML/CSS).
* 🛡️ **XimbeIA (Revisão & Qualidade):** Valida a legibilidade, remove overengineering e assegura as regras do projeto.

**Regras Inegociáveis que a skill protege:**
1. **Mimetismo de código:** Seguir estritamente os padrões existentes; não inventar novas dependências ou frameworks.
2. **Separação de responsabilidades:** O front-end **nunca** calcula XP, ofensivas ou regras de negócio; o back-end calcula e o front apenas renderiza.
3. **Nomenclatura em PT-BR:** Nomes de variáveis, funções e rotas em português funcional.

---

### 2. `/plan` (Planejamento e Quebra de Tarefas)
> **Comando de chat:** `/plan` ou *"Planeje a implementação de..."*

Utilizada antes de iniciar qualquer funcionalidade média ou grande. A IA entra no modo analítico da CaIA e:
* Cria um checklist de passos pequenos, sequenciais e testáveis.
* Define os contratos de entrada e saída das rotas da API (`app.py` / `crud.py`).
* Mapeia os arquivos exatos que serão modificados antes de aplicar qualquer alteração.
* Evita retrabalho e quebras em módulos adjacentes (como o painel do professor ou o jogo multiplayer).

---

### 3. `/learn` (Aprendizado e Registro de Padrões)
> **Comando de chat:** `/learn` ou *"Grave esse aprendizado..."*

Acionada quando uma armadilha é descoberta, uma solução não-óbvia é implementada ou uma nova diretriz de projeto é definida:
* Registra o aprendizado para que os agentes de IA não repitam o mesmo erro em sessões futuras.
* Documenta peculiaridades de deploy (ex.: particularidades do PythonAnywhere, service worker do PWA ou banco SQLite).
* Atualiza a base de conhecimento viva do projeto.

---

### 4. `/brag` (Geração Automatizada de Vídeos de Lançamento)
> **Comando de chat:** `/brag` ou `/brag --format vertical --tone polished`

A skill `/brag` utiliza o motor **Hyperframes** para transformar o código-fonte, estilos e identidade visual do repositório em um **vídeo promocional curto (15 a 25 segundos)** com animações em HTML/CSS/GSAP, trilha sonora e efeitos sonoros sincronizados.

#### 📁 A Pasta `brag-output/` (Arquivos Gerados)
Ao executar o `/brag`, é criada a pasta `brag-output/` contendo:
* 🎬 **`brag.mp4`**: O vídeo final em alta resolução pronto para publicação. O frame 0 já vem embutido com a imagem de capa (poster), garantindo uma miniatura estática ideal no Instagram, TikTok, LinkedIn ou X.
* 🖼️ **`brag.jpg`**: O poster em resolução original para usar como miniatura manual de capa.
* 📝 **`share-copy.txt`**: O texto de legenda e divulgação pronto para redes sociais.
* 📋 **`brag-plan.md` & `composition-brief.md`**: O storyboard e especificações criativas daquele corte.
* ⚙️ **`composition/`**: Todo o código-fonte do vídeo (HTML5, GSAP, CSS e áudios locais).

> [!IMPORTANT]
> **Por que o `brag-output/` fica no `.gitignore`?**  
> Vídeos renderizados em `.mp4` e assets intermediários somam entre 10 MB e 20 MB por execução. Para **evitar inchar o histórico do Git** e manter o repositório leve para clonagem, a pasta `brag-output*/` é ignorada automaticamente pelo [`.gitignore`](file:///d:/Programacao/Sementis-2/.gitignore).  
> Se desejar disponibilizar o vídeo publicamente, faça upload nas **Releases do GitHub** ou publique nas redes sociais oficiais do Sementis.

---

## 🧭 Resumo das Demais Skills Disponíveis

| Skill | Finalidade |
|---|---|
| `test-driven-development` | Conduz o desenvolvimento guiado por testes unitários e de integração (Pytest). |
| `browser-testing-with-devtools` | Inspeciona DOM, rede e erros de console em navegadores headless. |
| `code-review-and-quality` | Revisa segurança, legibilidade e conformidade com o `AGENTS.md`. |
| `security-and-hardening` | Audita rotas, autenticação JWT, hashes Argon2 e sanitização de inputs. |
| `frontend-ui-engineering` | Assegura que novas telas sigam o design system e acessibilidade (WCAG AA). |
| `api-and-interface-design` | Padroniza status HTTP, payloads JSON e contratos entre front e back. |

---

## 🚀 Como Invocar as Skills

* **Diretamente por slash command:** Digite `/plan`, `/brag`, `/learn` na conversa.
* **Por linguagem natural:** Peça normalmente para a IA (ex.: *"Use o esquadrão para planejar a nova missão diária"* ou *"Gere um vídeo em formato horizontal mostrando a arena multiplayer"*).
