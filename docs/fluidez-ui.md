# Polida de fluidez da interface

Validação realizada em 31/10/2026, preservando a navegação multipágina, a identidade visual e os contratos do backend.

## Decisões

- `css/shared-motion.css` concentra os tempos: pressão 120 ms, hover 150 ms, menus/entrada 180 ms e modais 220 ms. Entradas usam `cubic-bezier(0.23, 1, 0.32, 1)`.
- A Home apresenta os dados cacheados imediatamente, sem zerar barras nem repetir entradas em cascata. Progresso continua vindo da API.
- `js/ui-motion.js` controla vídeos decorativos marcados com `data-video-decorativo` e o foco dos diálogos existentes. Vídeos pausam fora da viewport, com diálogo fechado, aba oculta ou movimento reduzido.
- Atualizações das missões preservam o cabeçalho para não recriar o vídeo e perder seu controle de reprodução.
- `css/shared-modal.css` contém o modal compartilhado de turma. A Home deixa de carregar todo o CSS do painel do professor.
- Visibilidade e interação de um modal são liberadas imediatamente; apenas a saída aguarda o fade. Movimento reduzido mantém feedback de cor/opacidade, sem deslocamentos decorativos.
- O loader reutiliza a logo de 38.460 bytes e deixa de requisitar o GIF de 20.606.935 bytes. Os contratos `showLoading` e `hideLoading` são preservados.
- O passe consulta o endpoint existente `/api/perfil`, corrigindo a chamada antiga para `/usuario/perfil`, que retornava 404.
- `/pitch-assets/` é ignorado pelo Git; os arquivos locais são preservados.

## Medição

Edge/Chromium 156, em perfil temporário, com Flask e SQLModel usando SQLite em memória e usuários sintéticos. O banco local não foi utilizado. Um snapshot anterior de HTML/CSS/JS foi servido separadamente para a comparação.

Foram realizadas **240 navegações**: dez telas × duas larguras (390 e 1440 px) × cache frio/aquecido × três repetições × antes/depois. Foram coletados navegação, paint, requisições de API, tarefas longas e contadores de JavaScript/layout, além de traces da Home.

| Entrada da Home — três repetições | Antes | Depois |
| --- | --- | --- |
| Última animação finita em execução após DOM pronto | 911–922 ms | 169–177 ms |
| Animações finitas ativas na primeira amostra | 7 | 2 |

Essa medida descreve a coreografia visual, não o tempo de rede nem o carregamento completo. Os tempos de carregamento variaram entre telas, sem melhora geral consistente. O ganho confirmado foi retirar a espera visual e a cascata de entrada. Na amostra de navegação após o núcleo da polida não surgiram tarefas longas acima de 50 ms.

Capturas e medidas dos blocos principais da Home, Perfil e painel do professor, em 390 e 1440 px, mantiveram posições, dimensões, fontes e cores. Os ajustes posteriores de foco e largura foram revalidados funcionalmente.

## Verificações finais

- Dez telas em **320, 768, 1024 e 1440 px**: sem overflow horizontal ou erros de console; com movimento reduzido, vídeos decorativos pausados e nenhuma animação infinita em execução.
- Telas verificadas: Home, Trilhas, Ligas, Missões, Loja, Perfil, Turmas do aluno, painel do professor, turma do professor e Jogos.
- Menu Mais por clique/teclado, Escape, cliques repetidos e retorno de foco.
- Diálogos da Home e professor com foco imediato, inclusive com movimento reduzido; Tab contido e abertura/fechamento interrompidos.
- Vídeo do modal de Missões pausado quando fechado e todos os vídeos pausados ao ativar movimento reduzido.
- Histórico voltar/avançar e abertura de link com Ctrl preservados.
- API com atraso de 450 ms: barra cacheada permaneceu em 55%, sem voltar a zero. Falha simulada no progresso preservou o cache; sessão inválida levou ao login.
- Loader com chamadas sucessivas de mostrar/ocultar mantém o último estado, não solicita o GIF e deixa de bloquear cliques ao fechar.
- `node --check` nos JavaScript alterados e `git diff --check` aprovados.
- **16 testes Python aprovados**, com engine substituída por SQLite em memória: modelos, turmas/trilhas e inventário. Há 12 avisos existentes sobre `datetime.utcnow()`.

Para repetir os testes Python sem escrever no banco local, usar o Python do ambiente virtual:

```powershell
& venv/Scripts/python.exe -c "import crud, pytest; from sqlmodel import create_engine; from sqlalchemy.pool import StaticPool; crud.engine=create_engine('sqlite://',connect_args={'check_same_thread':False},poolclass=StaticPool); raise SystemExit(pytest.main(['test_models.py','test_turmas_e_trilhas.py','test_inventory.py','-q','--tb=short']))"
```

## Limites da validação

O teste móvel foi emulado no navegador; não houve aparelho físico disponível. As medições locais não representam latência de produção nem garantem FPS em todos os dispositivos. Backend, modelos, autenticação, dependências e engines dos minigames não foram alterados. Celebrações do Duolingo e quebra-cabeça permanecem para a próxima etapa.
