"""
semeia.py — SemeIA: Serviço de geração de trilhas por IA do Sementis
======================================================================
COMO TROCAR A API:
  Altere ADAPTADOR_ATIVO para o nome do adaptador desejado.
  APIs disponíveis: "openrouter" | "openai" | "gemini" | "mock"

COMO AJUSTAR OS LIMITES DO ARQUIVO:
  Veja o bloco "CONFIGURAÇÕES — ALTERE AQUI" logo abaixo.
======================================================================
"""

import os
import json
import yaml
import httpx

# ======================================================================
# CARREGAMENTO AUTOMÁTICO DE .ENV
# ======================================================================
def _carregar_env_se_existir():
    """Carrega variáveis de um arquivo .env na raiz do projeto se existir."""
    caminho_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(caminho_env):
        try:
            with open(caminho_env, "r", encoding="utf-8") as f:
                for linha in f:
                    linha = linha.strip()
                    if linha and not linha.startswith("#") and "=" in linha:
                        chave, valor = linha.split("=", 1)
                        chave = chave.strip()
                        valor = valor.strip().strip('"').strip("'")
                        if chave and chave not in os.environ:
                            os.environ[chave] = valor
        except Exception:
            pass

_carregar_env_se_existir()

# ======================================================================
# CONFIGURAÇÕES — ALTERE AQUI SE PRECISAR
# ======================================================================

# Qual API a SemeIA vai usar. Opções: "openrouter" | "openai" | "gemini" | "mock"
# Pode ser sobrescrito pela variável de ambiente SEMEIA_ADAPTADOR (útil para testes)
ADAPTADOR_ATIVO = os.environ.get("SEMEIA_ADAPTADOR", "openrouter")

# Cota mensal do plano gratuito (número de trilhas que o professor pode gerar)
# Este valor é importado pelo crud.py — é a fonte única da verdade da cota
COTA_MENSAL_GRATUITA = 3  # ← mude aqui para ajustar a cota gratuita (nunca acumula)

# Limite de tamanho do arquivo PDF em bytes
LIMITE_PDF_BYTES = 5 * 1024 * 1024  # ← mude aqui: ex: 10 * 1024 * 1024 = 10 MB

# Limite de páginas do PDF
LIMITE_PDF_PAGINAS = 30  # ← mude aqui para permitir PDFs maiores

# Quantidade máxima de caracteres enviados para a IA (controla custo de tokens)
LIMITE_CHARS_CONTEXTO = 15_000  # ← mude aqui se o modelo suportar mais contexto

# Quantidade de caracteres amostrados para o guardrail de moderação
LIMITE_CHARS_MODERACAO = 3_000  # ← mude aqui para aumentar a amostra de moderação

# ======================================================================
# CHAVES DE API (via .env ou variáveis de ambiente — ou cole aqui se preferir)
# ======================================================================
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENAI_API_KEY     = os.environ.get("OPENAI_API_KEY", "")
GEMINI_API_KEY     = os.environ.get("GEMINI_API_KEY", "")

# ======================================================================
# PROMPTS DA SEMEIA
# ======================================================================

PROMPT_GUARDRAIL = """
Você é um moderador de conteúdo educacional do Sementis, plataforma de sustentabilidade para estudantes do ensino médio.
Analise o texto e responda APENAS com JSON no formato exato: {{"aprovado": true, "motivo": "string"}}

Reprovar (aprovado: false) se:
- Conteúdo violento, sexual, drogas ou incitação ao ódio
- Fora do escopo educacional (apostas, propaganda política, entretenimento puro)
- Não identificável como material didático ou acadêmico

Texto a analisar:
{texto}
"""

PROMPT_GERACAO = """
Você é SemeIA, especialista em criar trilhas de aprendizado gamificadas sobre sustentabilidade para o Sementis.

Com base no material abaixo, gere UMA trilha de aprendizado no formato YAML estrito.

REGRAS OBRIGATÓRIAS:
- 4 a 6 atividades do tipo "quiz"
- 1 atividade final do tipo "minigame" — escolha o subtipo mais adequado ao conteúdo:
    - "memoria": para conteúdo com muitos conceitos e definições
    - "palavras_cruzadas": para conteúdo com termos técnicos e vocabulário específico
    - "quiz_rapido": para conteúdo mais narrativo ou processual
- Cada atividade quiz tem exatamente 5 questões
- Tipos de questão: "simples" (4 opções, 1 correta) ou "grid_multiplo" (4+ opções, múltiplas corretas)
- Idioma: Português brasileiro, tom motivador para jovens do ensino médio
- Inclua uma curiosidade educativa em cada questão

FORMATO YAML OBRIGATÓRIO (respeite exatamente esta estrutura):
```yaml
trilha:
  nome: "Nome da Trilha"
  descricao: "Descrição curta e motivadora"
atividades:
  - nome: "Nome Atividade 1"
    tipo: quiz
    questoes:
      - tipo: simples
        pergunta: "Pergunta clara e direta?"
        curiosidade: "Fato interessante relacionado à pergunta"
        opcoes:
          - texto: "Opção A"
            correta: false
          - texto: "Opção B — A correta"
            correta: true
          - texto: "Opção C"
            correta: false
          - texto: "Opção D"
            correta: false
  - nome: "Minigame Final — [Tema]"
    tipo: minigame
    subtipo: memoria
    pares:
      - frente: "Conceito"
        verso: "Definição do conceito"
```

Para subtipo "palavras_cruzadas", use:
    palavras:
      - palavra: "SUSTENTABILIDADE"
        pista: "Uso consciente dos recursos naturais"

Para subtipo "quiz_rapido", use a mesma estrutura de questoes do tipo quiz.

MATERIAL DO PROFESSOR:
{texto}
"""

# ======================================================================
# ADAPTADORES DE API — adicione novos adaptadores aqui
# ======================================================================

class AdaptadorOpenRouter:
    """
    Conecta na OpenRouter (suporta centenas de modelos, incluindo gratuitos).
    Docs: https://openrouter.ai/docs
    """
    # ← TROQUE o modelo aqui para outro suportado pela OpenRouter
    MODELO = "google/gemini-flash-1.5"
    URL    = "https://openrouter.ai/api/v1/chat/completions"

    def chamar(self, prompt: str, formato_json: bool = False) -> str:
        chave = os.environ.get("OPENROUTER_API_KEY", OPENROUTER_API_KEY).strip()
        if not chave:
            raise ValueError(
                "Chave OPENROUTER_API_KEY não configurada no ambiente. "
                "Defina a variável OPENROUTER_API_KEY ou configure ADAPTADOR_ATIVO = 'mock' em semeia.py para testar sem chave."
            )
        headers = {
            "Authorization": f"Bearer {chave}",
            "HTTP-Referer": "https://sementis.com.br",
            "X-Title": "Sementis SemeIA",  # ASCII only — httpx rejeita non-ASCII
        }
        payload = {
            "model": self.MODELO,
            "messages": [{"role": "user", "content": prompt}],
        }
        if formato_json:
            payload["response_format"] = {"type": "json_object"}

        with httpx.Client(timeout=120) as client:
            res = client.post(self.URL, json=payload, headers=headers)
            res.raise_for_status()
            return res.json()["choices"][0]["message"]["content"]


class AdaptadorOpenAI:
    """
    Conecta na API oficial da OpenAI.
    Docs: https://platform.openai.com/docs
    """
    # ← TROQUE o modelo aqui para outro da OpenAI (gpt-4o, gpt-4o-mini, etc.)
    MODELO = "gpt-4o-mini"
    URL    = "https://api.openai.com/v1/chat/completions"

    def chamar(self, prompt: str, formato_json: bool = False) -> str:
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
        payload = {
            "model": self.MODELO,
            "messages": [{"role": "user", "content": prompt}],
        }
        if formato_json:
            payload["response_format"] = {"type": "json_object"}

        with httpx.Client(timeout=120) as client:
            res = client.post(self.URL, json=payload, headers=headers)
            res.raise_for_status()
            return res.json()["choices"][0]["message"]["content"]


class AdaptadorGemini:
    """
    Conecta diretamente na API REST do Google Gemini (sem SDK).
    Docs: https://ai.google.dev/api/generate-content
    """
    # ← TROQUE o modelo aqui (gemini-1.5-flash, gemini-1.5-pro, etc.)
    MODELO = "gemini-1.5-flash"

    def chamar(self, prompt: str, formato_json: bool = False) -> str:
        import urllib.request
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.MODELO}:generateContent?key={GEMINI_API_KEY}"
        )
        body = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}]
        }).encode()
        req = urllib.request.Request(
            url, data=body,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=120) as r:
            dados = json.loads(r.read())
            return dados["candidates"][0]["content"]["parts"][0]["text"]


class AdaptadorMock:
    """
    Retorna dados fixos para testes locais sem consumir API nem precisar de key.
    Ative com: ADAPTADOR_ATIVO = "mock"
    """
    def chamar(self, prompt: str, formato_json: bool = False) -> str:
        if formato_json:
            return '{"aprovado": true, "motivo": "Conteúdo educacional válido (mock)"}'

        return """
trilha:
  nome: "Trilha de Teste — SemeIA Mock"
  descricao: "Trilha gerada automaticamente para testes locais da SemeIA"
atividades:
  - nome: "Fundamentos de Sustentabilidade"
    tipo: quiz
    questoes:
      - tipo: simples
        pergunta: "Qual a principal vantagem da energia solar?"
        curiosidade: "O Brasil tem um dos maiores potenciais de energia solar do mundo."
        opcoes:
          - texto: "Poluição zero durante a geração"
            correta: true
          - texto: "Funciona sem luz natural"
            correta: false
          - texto: "É mais barata que o petróleo sempre"
            correta: false
          - texto: "Não precisa de manutenção"
            correta: false
      - tipo: simples
        pergunta: "O que é pegada de carbono?"
        curiosidade: "Reduzir a pegada de carbono é essencial para frear as mudanças climáticas."
        opcoes:
          - texto: "Quantidade de CO2 emitida por atividades humanas"
            correta: true
          - texto: "Área de floresta desmatada"
            correta: false
          - texto: "Volume de água consumida"
            correta: false
          - texto: "Número de espécies extintas"
            correta: false
      - tipo: simples
        pergunta: "Qual dos 3Rs da sustentabilidade vem primeiro na hierarquia?"
        curiosidade: "Reduzir o consumo é mais eficiente do que reciclar, pois evita o resíduo antes de gerá-lo."
        opcoes:
          - texto: "Reciclar"
            correta: false
          - texto: "Reutilizar"
            correta: false
          - texto: "Reduzir"
            correta: true
          - texto: "Renovar"
            correta: false
      - tipo: simples
        pergunta: "O que é desenvolvimento sustentável?"
        curiosidade: "O conceito foi popularizado pelo Relatório Brundtland em 1987."
        opcoes:
          - texto: "Crescimento econômico sem limite"
            correta: false
          - texto: "Atender necessidades atuais sem comprometer gerações futuras"
            correta: true
          - texto: "Preservação total sem uso dos recursos"
            correta: false
          - texto: "Uso exclusivo de energia nuclear"
            correta: false
      - tipo: simples
        pergunta: "Qual setor é o maior emissor de gases de efeito estufa no Brasil?"
        curiosidade: "O desmatamento e a agropecuária respondem por mais da metade das emissões brasileiras."
        opcoes:
          - texto: "Indústria"
            correta: false
          - texto: "Transporte"
            correta: false
          - texto: "Agropecuária e mudança de uso da terra"
            correta: true
          - texto: "Energia elétrica"
            correta: false
  - nome: "Minigame Final — Conceitos Verdes"
    tipo: minigame
    subtipo: memoria
    pares:
      - frente: "Sustentabilidade"
        verso: "Uso consciente dos recursos para preservar o futuro"
      - frente: "Reciclagem"
        verso: "Reaproveitamento de materiais descartados"
      - frente: "Biodiversidade"
        verso: "Variedade de seres vivos em um ecossistema"
      - frente: "Pegada Ecológica"
        verso: "Impacto ambiental de uma pessoa ou atividade"
"""


# ======================================================================
# REGISTRO DE ADAPTADORES
# Para adicionar uma nova API:
#   1. Crie uma classe AdaptadorNome com método chamar(prompt, formato_json) -> str
#   2. Adicione "nome": AdaptadorNome no dict abaixo
#   3. Mude ADAPTADOR_ATIVO = "nome"
# ======================================================================
_ADAPTADORES = {
    "openrouter": AdaptadorOpenRouter,
    "openai":     AdaptadorOpenAI,
    "gemini":     AdaptadorGemini,
    "mock":       AdaptadorMock,
}


def _obter_adaptador():
    """Retorna a instância do adaptador ativo configurado em ADAPTADOR_ATIVO."""
    nome_ativo = os.environ.get("SEMEIA_ADAPTADOR", ADAPTADOR_ATIVO)

    # Se openrouter foi selecionado (padrão) mas nenhuma chave foi definida,
    # cai para 'mock' para permitir testes locais imediatos sem quebrar o sistema
    if nome_ativo == "openrouter":
        chave = os.environ.get("OPENROUTER_API_KEY", OPENROUTER_API_KEY).strip()
        if not chave and "SEMEIA_ADAPTADOR" not in os.environ:
            print("[SemeIA] [INFO] OPENROUTER_API_KEY nao detectada. Usando adaptador 'mock' para testes locais.")
            nome_ativo = "mock"

    cls = _ADAPTADORES.get(nome_ativo)
    if not cls:
        disponiveis = list(_ADAPTADORES.keys())
        raise ValueError(
            f"Adaptador '{nome_ativo}' não encontrado. "
            f"Disponíveis: {disponiveis}"
        )
    return cls()


# ======================================================================
# FUNÇÕES PÚBLICAS (usadas pelo app.py)
# ======================================================================

def extrair_texto_pdf(arquivo_bytes: bytes) -> str:
    """
    Extrai o texto de um arquivo PDF em bytes.
    Lança ValueError se o PDF exceder os limites configurados.
    """
    import io
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(arquivo_bytes))
    total_paginas = len(reader.pages)

    if total_paginas > LIMITE_PDF_PAGINAS:
        raise ValueError(
            f"PDF com {total_paginas} páginas excede o limite de "
            f"{LIMITE_PDF_PAGINAS} páginas."
        )

    texto = "\n".join(page.extract_text() or "" for page in reader.pages)

    if len(texto.strip()) < 200:
        raise ValueError(
            "PDF sem texto suficiente para gerar uma trilha. "
            "Verifique se o PDF contém texto selecionável (não escaneado)."
        )

    # Limita o contexto enviado à IA para controlar custo de tokens
    return texto[:LIMITE_CHARS_CONTEXTO]


def moderar_conteudo(texto: str) -> dict:
    """
    Verifica se o conteúdo é adequado para a plataforma antes de gerar a trilha.
    Retorna {"aprovado": bool, "motivo": str}.
    A cota NÃO é consumida se o conteúdo for reprovado.
    """
    adaptador = _obter_adaptador()
    resposta_bruta = adaptador.chamar(
        PROMPT_GUARDRAIL.format(texto=texto[:LIMITE_CHARS_MODERACAO]),
        formato_json=True
    )
    if isinstance(resposta_bruta, str):
        return json.loads(resposta_bruta)
    return resposta_bruta


def gerar_trilha_yaml(texto: str) -> dict:
    """
    Gera a trilha completa via IA e retorna como dict Python pronto para persistir.
    """
    adaptador = _obter_adaptador()
    yaml_texto = adaptador.chamar(PROMPT_GERACAO.format(texto=texto))

    # Limpa blocos de código markdown que alguns modelos adicionam (```yaml ... ```)
    yaml_limpo = yaml_texto.strip()
    if yaml_limpo.startswith("```"):
        yaml_limpo = yaml_limpo.split("\n", 1)[-1]
        yaml_limpo = yaml_limpo.rsplit("```", 1)[0]

    return yaml.safe_load(yaml_limpo.strip())
