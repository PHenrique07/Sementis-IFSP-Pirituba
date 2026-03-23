from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

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