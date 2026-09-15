"""
test_models.py — Testes unitários para os modelos do Sementis.

Todos os testes rodam em memória (SQLite :memory:) — sem tocar no
arquivo sementis.db de produção/desenvolvimento.
"""
import pytest
from datetime import date, datetime
from sqlmodel import SQLModel, create_engine, Session

# Importa apenas as classes que serão testadas
from models import (
    Usuario, Modulo, Trilha, Atividade, ProgressoUsuario,
    Missao, ProgressoMissao, Turma, TurmaAluno, AvisoTurma
)


# ──────────────────────────────────────────────
# Fixture: banco de dados isolado em memória
# ──────────────────────────────────────────────
@pytest.fixture(name="sessao")
def fixture_sessao():
    """
    Cria um banco SQLite em memória e garante que as tabelas são
    criadas antes de cada teste e destruídas depois.
    """
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as sessao:
        yield sessao
    SQLModel.metadata.drop_all(engine)


# ──────────────────────────────────────────────
# 1. Testes do modelo Usuario
# ──────────────────────────────────────────────
class TestUsuario:
    def test_valores_padrao_gamificacao(self):
        """Garante que um novo usuário começa com os valores corretos de gamificação."""
        usuario = Usuario(
            nome="Aluno Teste",
            email="aluno@sementis.com",
            senha="hash_seguro",
            tipo_usuario="estudante"
        )
        assert usuario.moedas == 0
        assert usuario.vidas == 5
        assert usuario.ofensiva == 0
        assert usuario.xp == 0
        assert usuario.xp_semanal == 0
        assert usuario.freezes == 0
        assert usuario.liga_id == 1

    def test_persistencia_no_banco(self, sessao):
        """Verifica que o usuário é salvo e recuperado corretamente do banco."""
        usuario = Usuario(
            nome="Pedro Henrique",
            email="pedro@sementis.com",
            senha="hash_argon2",
            tipo_usuario="estudante"
        )
        sessao.add(usuario)
        sessao.commit()
        sessao.refresh(usuario)

        assert usuario.id is not None
        assert usuario.nome == "Pedro Henrique"
        assert usuario.vidas == 5

    def test_usuario_professor(self, sessao):
        """Verifica que o tipo_usuario 'professor' é persistido corretamente."""
        prof = Usuario(
            nome="Prof. Ana",
            email="ana@sementis.com",
            senha="hash_xyz",
            tipo_usuario="professor"
        )
        sessao.add(prof)
        sessao.commit()
        sessao.refresh(prof)

        assert prof.tipo_usuario == "professor"

    def test_calculo_simples_xp(self):
        """Testa lógica aritmética de acúmulo de XP sem banco de dados."""
        usuario = Usuario(
            nome="XP Tester",
            email="xp@test.com",
            senha="x",
            tipo_usuario="estudante",
            xp=100
        )
        # Simula ganho de XP após concluir uma atividade
        xp_recompensa = 50
        usuario.xp += xp_recompensa

        assert usuario.xp == 150


# ──────────────────────────────────────────────
# 2. Testes do modelo Modulo
# ──────────────────────────────────────────────
class TestModulo:
    def test_criacao_modulo(self, sessao):
        """Verifica que um módulo é salvo com os atributos corretos."""
        modulo = Modulo(
            nome="Sustentabilidade Básica",
            descricao="Introdução ao meio ambiente",
            ordem=1
        )
        sessao.add(modulo)
        sessao.commit()
        sessao.refresh(modulo)

        assert modulo.id is not None
        assert modulo.nome == "Sustentabilidade Básica"
        assert modulo.ordem == 1


# ──────────────────────────────────────────────
# 3. Testes do modelo Trilha e Atividade
# ──────────────────────────────────────────────
class TestTrilhaAtividade:
    def test_hierarquia_modulo_trilha_atividade(self, sessao):
        """
        Verifica que a cadeia Módulo → Trilha → Atividade
        é criada e persistida com as chaves estrangeiras corretas.
        """
        modulo = Modulo(nome="Módulo Água", descricao="Ciclo da água", ordem=1)
        sessao.add(modulo)
        sessao.commit()
        sessao.refresh(modulo)

        trilha = Trilha(nome="Trilha da Água", ordem=1, modulo_id=modulo.id)
        sessao.add(trilha)
        sessao.commit()
        sessao.refresh(trilha)

        atividade = Atividade(
            nome="Quiz Inicial",
            tipo="quiz",
            ordem=1,
            xp_recompensa=20,
            moedas_recompensa=10,
            trilha_id=trilha.id
        )
        sessao.add(atividade)
        sessao.commit()
        sessao.refresh(atividade)

        assert atividade.trilha_id == trilha.id
        assert trilha.modulo_id == modulo.id
        assert atividade.xp_recompensa == 20
        assert atividade.moedas_recompensa == 10

    def test_recompensas_padrao_atividade(self):
        """Garante que os valores padrão de recompensa estão corretos."""
        atv = Atividade(nome="Leitura", tipo="leitura", ordem=1, trilha_id=1)
        assert atv.xp_recompensa == 10
        assert atv.moedas_recompensa == 5


# ──────────────────────────────────────────────
# 4. Testes do modelo Missao
# ──────────────────────────────────────────────
class TestMissao:
    def test_criacao_missao(self, sessao):
        """Verifica que uma missão é persistida corretamente."""
        missao = Missao(
            titulo="Complete 2 lições hoje",
            meta=2,
            xp_recompensa=50,
            moedas_recompensa=10,
            tipo_acao="concluir_fase"
        )
        sessao.add(missao)
        sessao.commit()
        sessao.refresh(missao)

        assert missao.id is not None
        assert missao.meta == 2
        assert missao.tipo_acao == "concluir_fase"

    def test_valores_padrao_missao(self):
        """Confere os valores padrão de recompensa de uma missão."""
        missao = Missao(titulo="Login diário", meta=1, tipo_acao="login_diario")
        assert missao.xp_recompensa == 50
        assert missao.moedas_recompensa == 10


# ──────────────────────────────────────────────
# 5. Testes do modelo Turma
# ──────────────────────────────────────────────
class TestTurma:
    def test_criacao_turma(self, sessao):
        """Verifica que uma turma é salva com código de convite único."""
        prof = Usuario(
            nome="Prof. Silva",
            email="silva@sementis.com",
            senha="hash",
            tipo_usuario="professor"
        )
        sessao.add(prof)
        sessao.commit()
        sessao.refresh(prof)

        turma = Turma(
            nome="Turma A - 3º Ano",
            codigo_convite="ABC123",
            professor_id=prof.id
        )
        sessao.add(turma)
        sessao.commit()
        sessao.refresh(turma)

        assert turma.id is not None
        assert turma.codigo_convite == "ABC123"
        assert turma.professor_id == prof.id

    def test_aluno_entra_na_turma(self, sessao):
        """Verifica o vínculo aluno–turma pela tabela associativa TurmaAluno."""
        prof = Usuario(
            nome="Prof. Leite",
            email="leite@sementis.com",
            senha="h",
            tipo_usuario="professor"
        )
        aluno = Usuario(
            nome="Aluno João",
            email="joao@sementis.com",
            senha="h",
            tipo_usuario="estudante"
        )
        sessao.add_all([prof, aluno])
        sessao.commit()
        sessao.refresh(prof)
        sessao.refresh(aluno)

        turma = Turma(
            nome="Turma B",
            codigo_convite="XYZ789",
            professor_id=prof.id
        )
        sessao.add(turma)
        sessao.commit()
        sessao.refresh(turma)

        vinculo = TurmaAluno(turma_id=turma.id, aluno_id=aluno.id)
        sessao.add(vinculo)
        sessao.commit()
        sessao.refresh(vinculo)

        assert vinculo.id is not None
        assert vinculo.turma_id == turma.id
        assert vinculo.aluno_id == aluno.id


# ──────────────────────────────────────────────
# 6. Testes do modelo ProgressoMissao
# ──────────────────────────────────────────────
class TestProgressoMissao:
    def test_valores_padrao_progresso(self):
        """Garante que um progresso novo começa zerado e não concluído."""
        progresso = ProgressoMissao(
            usuario_id=1,
            missao_id=1,
            data_missao=date.today()
        )
        assert progresso.progresso_atual == 0
        assert progresso.concluida is False

    def test_data_padrao_e_hoje(self):
        """Verifica que a data padrão de missão é a data de hoje."""
        progresso = ProgressoMissao(usuario_id=1, missao_id=1)
        assert progresso.data_missao == date.today()
