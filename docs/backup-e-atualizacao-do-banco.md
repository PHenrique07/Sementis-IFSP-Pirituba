# Pendência: preservar os dados das turmas

**Status: planejamento para depois do teste no colégio. Nada deste documento está implementado.**

Não alterar a estrutura, apagar, recriar ou limpar o banco online na véspera do teste. As mudanças propostas abaixo precisam ser revisadas e validadas em um banco separado antes de chegar ao servidor.

## Problema

As atualizações de `models.py` têm levado à recriação do banco, com risco de perder contas, matrículas, progresso, XP e moedas. A sementeira também insere muitos dados de demonstração. O objetivo futuro é atualizar o sistema preservando os dados reais das crianças.

## Trabalho futuro

- Criar backups consistentes do SQLite, datados e relacionados à versão do código, com verificação de integridade.
- Definir backups antes de atualizações e depois das aulas, mantendo também uma cópia privada fora do servidor.
- Implementar e testar a recuperação para um arquivo separado, sem sobrescrever o banco ativo automaticamente.
- Estabelecer migrações para renomear campos, converter tipos e alterar relações sem apagar os registros existentes. O helper atual cobre somente algumas adições de colunas/tabelas.
- Separar a preparação de produção da sementeira de demonstração, sem criar novos usuários, turmas, saldos ou progresso fictícios.
- Identificar os mocks existentes por IDs conferidos e planejar a limpeza de seus vínculos, preservando os alunos reais. Não excluir contas apenas por nome ou aparência do e-mail.
- Documentar atualização, recuperação e retorno à versão anterior, com testes numa cópia representativa do banco.

## Cuidados ao executar futuramente

Backups contêm dados pessoais e hashes de senhas: devem ficar fora do Git e da pasta pública `frontend/`. Restaurar uma cópia antiga não mescla automaticamente os dados registrados depois dela. Recriar usuários manualmente também não recompõe os vínculos e o progresso associados aos IDs antigos.

Antes de qualquer operação real, conferir o banco utilizado pelo servidor e combinar uma janela de manutenção. Não aplicar comandos de alteração ou limpeza a partir deste documento: ele registra apenas a pendência.
