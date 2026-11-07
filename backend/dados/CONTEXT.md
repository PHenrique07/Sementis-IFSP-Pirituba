# Contrato do conteúdo educacional

**Escopo:** [questoes.json](questoes.json), fonte do currículo e das perguntas da Arena. O carregamento pertence a [../seeds.py](../seeds.py) e [../live_game.py](../live_game.py).

## Entradas

Trecho do currículo solicitado, exemplos da mesma atividade e formato consumido em `seeds.criar_questoes_db`, `crud.buscar_questoes_por_atividade` e [quiz.js](../../frontend/js/quiz.js).

## Processo

Preserve a hierarquia módulo → trilha → atividade → questão, a ordem e a correspondência entre `tipo_layout` e `conteudo`. `Questao.conteudo` é JSON, não uma string serializada manualmente. Leia o trecho afetado, sem carregar todo o currículo sem necessidade.

O caminho do JSON é definido em `backend/caminhos.py`. Os comandos continuam na raiz: `python seeds.py` povoa inicialmente e interrompe se já houver usuário; `python seeds.py --atualizar-conteudo` sincroniza o currículo e pode substituir questões. Execute somente quando esse povoamento fizer parte do pedido e em banco apropriado.

## Saídas e invariantes

- JSON válido e compatível com layouts e referências pedagógicas existentes.
- Atualização do currículo preserva usuários e progresso; IDs e ordem de atividades afetam progresso e desbloqueio.
- O arquivo alimenta tanto sementes quanto Arena. Não crie outra cópia na raiz nem apague o banco para atualizar perguntas.

Valide o JSON e os carregadores com os testes descritos em [Validação](../../docs/referencias/validacao.md).
