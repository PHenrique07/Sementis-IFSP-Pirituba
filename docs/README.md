# Documentação do Sementis

Para editar documentação, leia [CONTEXT.md](CONTEXT.md). O mapa global de agentes está em [../AGENTS.md](../AGENTS.md).

## Contexto e referências mantidos no repositório

- [Metodologia de contexto](metodologia-contexto.md): organização ICM e caminhos de leitura por tarefa.
- [Reorganização do repositório](reestruturacao.md): pastas, entradas compatíveis, caminhos de dados e hospedagem.
- [Fluxos do back-end](referencias/fluxos-backend.md): rotas atuais, payloads e limites de persistência.
- [Validação por escopo](referencias/validacao.md): testes existentes, efeitos no banco e verificação de interface.

## Páginas destinadas à Wiki

| Arquivo | Título na Wiki | Assunto |
| --- | --- | --- |
| [wiki/Home.md](wiki/Home.md) | `Home` | Onboarding e proposta do produto |
| [wiki/02-arquitetura-geral.md](wiki/02-arquitetura-geral.md) | `02-arquitetura-geral` | Arquitetura, diretórios e autenticação |
| [wiki/03-backend.md](wiki/03-backend.md) | `03-backend` | Flask, modelos, regras e geração pedagógica |
| [wiki/04-frontend.md](wiki/04-frontend.md) | `04-frontend` | Interface, scripts e estilos |
| [wiki/05-games-js.md](wiki/05-games-js.md) | `05-games-js` | Quiz, Arena e FlapFish |
| [wiki/06-guia-de-contribuicao.md](wiki/06-guia-de-contribuicao.md) | `06-guia-de-contribuicao` | Execução local e contribuição |
| [wiki/07-guia-de-skills](wiki/07-guia-de-skills) | `07-guia-de-skills` | Procedimentos recorrentes e perfis de agentes |
| [wiki/_Sidebar.md](wiki/_Sidebar.md) | `_Sidebar` | Navegação da Wiki |

Alguns exemplos técnicos históricos da Wiki precisam ser confirmados no código antes de orientar uma implementação; consulte o [contrato da Wiki](wiki/CONTEXT.md).

## Publicação na Wiki do GitHub

Na [Wiki do repositório](https://github.com/PHenrique07/Sementis-IFSP-Pirituba/wiki), crie/edite as páginas com os títulos da tabela e copie o conteúdo correspondente. A página `_Sidebar` define a navegação.

Para trabalhar no repositório Git separado da Wiki:

```bash
git clone https://github.com/PHenrique07/Sementis-IFSP-Pirituba.wiki.git
```

Copie somente as páginas listadas, mantendo os nomes. O arquivo de origem `07-guia-de-skills` não tem extensão; na cópia para o repositório da Wiki, use `07-guia-de-skills.md`. Não copie `CONTEXT.md`, `referencias/` ou os adaptadores de agentes como páginas da Wiki.

Revise o conteúdo e os links no destino antes de fazer commit/push. A edição local da documentação não publica automaticamente a Wiki.
