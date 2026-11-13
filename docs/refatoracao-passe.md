# Passe Sementis e entrega diária

## Escopo

- Drone: 67 moedas por usuário/dia, concedidas pelo servidor e confirmadas na interface apenas após persistência.
- Passe gratuito permanente “Raízes do Saber”: 60 níveis, 500 XP por avanço, nível 1 disponível ao iniciar. Recompensas alternam moedas, XP e vidas; o XP do próprio passe é descontado do progresso que desbloqueia níveis.
- Progresso, catálogo e resgates vêm de API autenticada. O navegador envia somente o nível desejado. Nenhum valor ou plano é aceito do cliente.
- Passe Pro fica como anúncio de recurso futuro. Sem compras ou recompensas premium.
- Nova capa usa a Sementinha existente, paleta roxa/verde, componentes leves, navegação por teclado e movimento reduzido. Renderização inicial de 12 níveis, com opção de mostrar mais.

## Dados e compatibilidade

Tabela adicional `ResgateRecompensa`: usuário, chave única por usuário, valores concedidos e data. Drone usa chave com data; passe usa jornada e nível. Saldo e registro são gravados na mesma transação; conflito de unicidade desfaz a transação. Atualizações de saldo usam expressões SQLAlchemy para evitar sobrescrever ganhos simultâneos. `create_all` cria a tabela sem alterar os registros atuais. Os indicadores locais antigos não comprovam resgates e não são importados como saldo.

## Ordem de entrega e verificação

1. Testes e persistência de recompensas, autenticação, nível bloqueado, repetição e isolamento entre usuários.
2. Conectar drone à API e testar falha/repetição sem falso sucesso.
3. Substituir passe local por catálogo e coleta autoritativos; redesenhar entrada, capa e cartões.
4. Conferir cenários no navegador em desktop/celular e executar `python -m pytest -q` com banco isolado.
