# Validação por escopo

Execute os comandos a partir da raiz, com o Python do ambiente do projeto. No PowerShell, após ativar o ambiente, use `python`; sem ativação, o executável local é `.\venv\Scripts\python.exe`. As dependências do produto estão em [requirements.txt](../../requirements.txt); `pytest` é instalado separadamente pelo [workflow](../../.github/workflows/testes-backend.yml). O [contexto de testes](../../tests/CONTEXT.md) descreve fixtures e fronteiras.

## Testes Python existentes

| Arquivo | Cobertura principal | Persistência/efeitos |
| --- | --- | --- |
| `tests/unit/test_models.py` | Defaults, persistência e vínculos de modelos | Fixtures SQLite em memória |
| `tests/unit/test_turmas_e_trilhas.py` | Turmas do aluno, ranking, sincronização e mapa | Fixtures SQLite em memória |
| `tests/unit/test_baus_trilha.py` | Posições, bloqueios, raridade, coleta e recompensa | Fixtures SQLite em memória |
| `tests/unit/test_caminhos.py` | Localização dos dados e comandos de sementes | Lê currículo e substitui execução da sementeira |
| `tests/integration/test_inventory.py` | Loja, gacha e equipamento | Fixture `banco_isolado`, em memória |
| `tests/integration/test_estrutura_publica.py` | Arquivos públicos, aliases, WSGI e limites de publicação | Cliente Flask com banco isolado |
| `tests/integration/test_fluxos_api.py` | Login/perfil, trilha/quiz/baú, turma e Live | Cliente Flask com banco isolado |
| `tests/manuais/teste_backend.py` | Script manual de progresso e missões | Usa o banco local e contém chamadas antigas; leia antes de executar |
| `tests/manuais/teste_live.py` | Script manual de uma partida com cliente Flask | Importa a API e pode criar/migrar o banco local |

### Seleção em memória

Para mudanças de dados e regras cobertas por essas fixtures:

```powershell
python -m pytest tests/unit --tb=short -v
```

Reduza a seleção ao arquivo/caso da mudança quando suficiente. Os módulos usam imports de `backend`; os cenários de regras/modelos usam suas sessões em memória.

### Suíte completa e scripts manuais

O CI e a execução local usam a mesma suíte, selecionada por `pytest.ini`:

```powershell
python -m pytest --tb=short -v
```

`tests/conftest.py` substitui o engine antes de importar a API nos testes HTTP; inventário também usa esse banco em memória. A suíte automatizada não requer sementes nem um `sementis.db` populado.

O fluxo manual Live é executado por `python -m tests.manuais.teste_live`, com `SEMEIA_ADAPTADOR=mock` quando não for necessária IA externa. Use ambiente de desenvolvimento apropriado: importar a API fora das fixtures inicializa o banco real. `tests/manuais` fica fora da descoberta configurada, mas passar um script explicitamente ao pytest pode coletar funções com prefixo `test`, inclusive `testar_...`.

Não rode sementes nem apague `sementis.db` como preparação genérica de teste. Ao precisar exercitar banco existente/migração, prepare um banco de teste representativo separado e confira preservação dos dados.

## HTTP, permissões e IA

Para mudanças de contrato, confira o consumidor e a rota real, com referência em [Fluxos do back-end](fluxos-backend.md). Valide o cenário alterado e seus erros relevantes: corpo inválido, recurso inexistente, token ausente/expirado, papel incorreto e propriedade/vínculo de outro usuário.

Para gerar trilha localmente sem gastar chamada externa, defina antes de iniciar o Flask:

```powershell
$env:SEMEIA_ADAPTADOR = 'mock'
python app.py
```

No fluxo de IA, confira o `202`/polling, estados do job, persistência e cota em sucesso e falha. Os testes existentes listados acima não cobrem integralmente essas rotas.

O CORS de `backend/app.py` contém uma lista explícita de origens. Em teste com front-end separado, use uma origem local permitida, como `http://localhost:3000`; não presuma que a porta padrão do Live Server esteja na lista. Para servir estaticamente em outro terminal, a partir da raiz:

```powershell
python -m http.server 3000 --directory frontend
```

## Interface, jogos e PWA

Não há runner de testes de navegador configurado. Os testes de estrutura pública conferem respostas e conteúdo dos arquivos pelo Flask, sem renderizar a interface. Para uma página alterada:

- Abra por HTTP, confira console/rede e carregamento de scripts/estilos/assets.
- Verifique o caminho principal, carregamento, vazio e falha de API quando fizerem parte do fluxo.
- Se houver autenticação, confira login/retorno ao login e a visão correspondente de aluno/professor.
- Se houver alteração visual, confira celular e desktop, foco e navegação fixa; CSS compartilhado exige conferir outra página consumidora.
- No quiz/mapa, confira estado bloqueado/liberado/concluído e atualização com o retorno do servidor; em baús, coleta e tentativa de repetição.
- Na Arena, use host e jogador em contextos de navegador distintos: lobby → pergunta → resultado → ranking → finalizado, incluindo uma tentativa de resposta repetida.
- No FlapFish, confira menu → partida → colisão/GameOver → reinício e o iframe quando afetado.
- Em PWA, confira primeiro se o registro está ativo, depois manifest, escopo e recursos do cache. Instalação/offline só podem ser afirmados se forem exercitados com service worker registrado.

## Documentação e instruções de agentes

Confira links locais em relação à pasta de cada documento, anchors e destinos da Wiki; links `file:///d:/...` não são portáveis. Se alterar frontmatter de perfil/skill ou workflow, confira o YAML e preserve os campos suportados.

Revise `git diff --check`, os contextos apontados por `AGENTS.md` e a coerência entre perfis, Copilot, Antigravity e `sementis-squad`. Uma tarefa de documentação requer essas verificações, sem precisar iniciar a API ou executar testes que gravam dados.

## Evidência de entrega

Informe o que mudou, verificações efetivamente executadas e resultado. Separe falha observada, limitação já existente e verificação não realizada; não apresente testes em memória como garantia de todos os fluxos HTTP ou visuais.
