# Sementis — mapa para agentes

O Sementis é uma aplicação acadêmica gamificada de ensino de sustentabilidade. Usa Python/Flask, SQLite via SQLModel/SQLAlchemy, JWT/PyJWT, Argon2 e HTML/CSS/JavaScript Vanilla. Phaser já integra o minigame FlapFish.

Este arquivo é o mapa global. Os contratos de cada área ficam nos `CONTEXT.md`, seguindo a [metodologia de contexto adotada](docs/metodologia-contexto.md).

## Regras globais

1. **Mimetismo de código:** siga estritamente os padrões, formatação e arquitetura existentes. Não introduza bibliotecas, frameworks ou padrões de design que não existam no repositório.
2. **Dados:** declare o esquema nas classes de `backend/models.py` e use essas classes no acesso ao SQLite via SQLModel/SQLAlchemy. Não crie scripts SQL paralelos nem use MySQL.
3. **Responsabilidades:** o back-end calcula regras de negócio, como XP, nível, saldo e ofensiva; a interface exibe o payload e envia ações.
4. **Idioma:** escreva nomes, funções e comentários prioritariamente em português, respeitando contratos existentes.
5. **Entrega:** respostas curtas e objetivas, com o que mudou, validação realizada e limitações relevantes.

## Encontre o contexto da tarefa

Leia o contexto da área antes de editar e desça aos contratos locais indicados. Se a tarefa atravessar áreas, leia os contextos correspondentes; não carregue todas as instruções do repositório por padrão.

| Área ou pedido | Contexto responsável |
| --- | --- |
| Entradas de execução, caminhos e configuração da raiz | [CONTEXT.md](CONTEXT.md) |
| API, dados, regras, IA e Arena | [backend/CONTEXT.md](backend/CONTEXT.md) |
| Currículo e questões | [backend/dados/CONTEXT.md](backend/dados/CONTEXT.md) |
| Páginas HTML e publicação da interface | [frontend/CONTEXT.md](frontend/CONTEXT.md) |
| Scripts, DOM e integração com API | [frontend/js/CONTEXT.md](frontend/js/CONTEXT.md) |
| Estilos e responsividade | [frontend/css/CONTEXT.md](frontend/css/CONTEXT.md) |
| Manifest, registro e `sw.js` | [frontend/pwa/CONTEXT.md](frontend/pwa/CONTEXT.md) |
| Minigame Phaser | [frontend/FlapFish/CONTEXT.md](frontend/FlapFish/CONTEXT.md) |
| Testes automatizados e scripts manuais | [tests/CONTEXT.md](tests/CONTEXT.md) |
| Documentação e Wiki | [docs/CONTEXT.md](docs/CONTEXT.md) |
| Agentes, skills, editores e CI | [.github/CONTEXT.md](.github/CONTEXT.md) |

Referências compartilhadas: [fluxos do back-end](docs/referencias/fluxos-backend.md) e [validação por escopo](docs/referencias/validacao.md). Consulte-as conforme o pedido.

## Forma de trabalhar

Localize os arquivos reais e seus consumidores, planeje contratos/impacto quando necessário, implemente o escopo e confira as invariantes locais com a validação pertinente. Antes de alterar `models.py`, explicite o impacto nos dados e a estratégia de compatibilidade.

Um mesmo agente pode pesquisar, planejar, implementar e revisar. Os perfis [SemeIA, BrinIA, CaIA, GratIA e XimbeIA](.github/agents/CONTEXT.md) são opções para diferentes perspectivas; não há pipeline obrigatório por quantidade de arquivos. Delegue apenas quando solicitado ou autorizado por instrução aplicável, com uma subtarefa que justifique a divisão.

`CONTEXT.md` não depende de descoberta automática: siga os links deste mapa e dos contextos pais. Mudanças de responsabilidade, contrato ou comando devem atualizar a fonte de contexto correspondente, sem copiar as regras em todos os perfis.
