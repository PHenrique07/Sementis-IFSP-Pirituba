from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from datetime import date

# 1. Tabela de Usuário (Mantida)
class Usuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(unique=True, index=True)
    senha: str
    idade: int
    tipo_usuario: str
    
    # Gamificação
    moedas: int = Field(default=0)  
    vidas: int = Field(default=5)   
    ofensiva: int = Field(default=0) 
    xp: int = Field(default=0)

# 2. Tabela de Módulos (ex: Módulo 1 - Sustentabilidade Básica)
class Modulo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    descricao: str
    ordem: int # Para ordenar: Módulo 1, Módulo 2...
    imagem_capa: str | None = None

# 3. Tabela de Trilhas (O caminho dentro do módulo, ex: Trilha da Água)
class Trilha(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    ordem: int
    
    # Chave estrangeira ligando a Trilha ao Módulo
    modulo_id: int = Field(foreign_key="modulo.id")

# 4. Tabela de Atividades (As "bolinhas" e jogos dentro da trilha)
class Atividade(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str # Ex: "Introdução", "Quiz da Água", "Jogo do Lixo"
    tipo: str # Ex: "leitura", "quiz", "minigame" -> Ajuda o Front-end a saber o que carregar
    ordem: int # Bolinha 1, Bolinha 2, Bolinha 3...
    
    xp_recompensa: int = Field(default=10)
    moedas_recompensa: int = Field(default=5)
    
    # Chave estrangeira ligando a Atividade à Trilha
    trilha_id: int = Field(foreign_key="trilha.id")

# 5. Tabela de Progresso (Para o Front-end saber quais bolinhas pintar de verde)
class ProgressoUsuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    atividade_id: int = Field(foreign_key="atividade.id") # Agora o progresso é por bolinha!
    data_conclusao: datetime = Field(default_factory=datetime.utcnow)


# 6. Tabela da Loja (Itens que podem ser comprados)
class ItemLoja(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    descricao: str
    preco: int
    imagem: str | None = None # Caminho para o ícone do item
    tipo: str = Field(default="cosmetico") # Pode ser "cosmetico", "poder", "avatar"

# 7. Tabela de Inventário (O que cada usuário comprou)
class InventarioUsuario(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    item_id: int = Field(foreign_key="itemloja.id")
    data_compra: datetime = Field(default_factory=datetime.utcnow)
    equipado: bool = Field(default=False) # Se o usuário está usando o item no momento


# 8. Catálogo de Missões (A vitrine de todas as missões que existem no sementis)
class Missao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str # Ex: "Complete sua próxima lição"
    meta: int # Ex: 2 (quantidade de vezes que tem que fazer a ação)
    xp_recompensa: int = Field(default=50)
    moedas_recompensa: int = Field(default=10)
    
    # Uma tag interna para o seu CRUD saber quando essa missão deve andar
    # Ex: "passar_fase", "login_diario", "acerto_perfeito"
    tipo_acao: str 

# 9. Progresso Diário (O save do aluno: quais missões ele tirou hoje e como ele tá indo)
class ProgressoMissao(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    missao_id: int = Field(foreign_key="missao.id")
    
    # Salva o dia exato. Assim, meia-noite o sistema sabe que essas missões caducaram.
    data_missao: date = Field(default_factory=date.today)
    
    # É aqui que o "1/2" ou "2/2" acontece:
    progresso_atual: int = Field(default=0) 
    
    # True = Ele já bateu a meta e o XP já caiu na conta.
    concluida: bool = Field(default=False)