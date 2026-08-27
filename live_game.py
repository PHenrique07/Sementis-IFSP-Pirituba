import json
import os
import random
import string
import time
from datetime import datetime
from typing import Dict, List, Optional, Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTOES_PATH = os.path.join(BASE_DIR, "questoes.json")

# Avatares divertidos com tema sustentável e emojis
AVATARES_DEFAULT = [
    {"id": "broto", "emoji": "🌱", "nome": "Brotinho"},
    {"id": "gota", "emoji": "💧", "nome": "Gotinha"},
    {"id": "sol", "emoji": "☀️", "nome": "Solzinho"},
    {"id": "folha", "emoji": "🍃", "nome": "Folha"},
    {"id": "flor", "emoji": "🌻", "nome": "Girassol"},
    {"id": "arvore", "emoji": "🌳", "nome": "Carvalho"},
    {"id": "tartaruga", "emoji": "🐢", "nome": "Tartaruga"},
    {"id": "abelha", "emoji": "🐝", "nome": "Abelhinha"},
    {"id": "passaro", "emoji": "🦜", "nome": "Arara"},
    {"id": "raio", "emoji": "⚡", "nome": "Energia"},
    {"id": "planeta", "emoji": "🌍", "nome": "Planeta Terra"},
    {"id": "reciclagem", "emoji": "♻️", "nome": "Eco Hero"}
]

# Formas e cores no estilo Sementis (inspirado em Kahoot)
OPCOES_ESTILO = [
    {"simbolo": "▲", "forma": "triangulo", "cor": "#ef4444", "nome_cor": "Vermelho", "icone": "terra"},
    {"simbolo": "◆", "forma": "losango", "cor": "#3b82f6", "nome_cor": "Azul", "icone": "agua"},
    {"simbolo": "●", "forma": "circulo", "cor": "#f59e0b", "nome_cor": "Amarelo", "icone": "sol"},
    {"simbolo": "■", "forma": "quadrado", "cor": "#10b981", "nome_cor": "Verde", "icone": "planta"}
]


class LiveGameManager:
    """Gerencia as salas multiplayer em tempo real do Sementis Live."""

    def __init__(self):
        self.salas: Dict[str, Dict[str, Any]] = {}
        self._carregar_banco_questoes()

    def _carregar_banco_questoes(self):
        self.questoes_por_modulo: Dict[str, List[Dict[str, Any]]] = {
            "todos": [],
            "fundamentos": [],
            "agua": [],
            "clima": [],
            "energia": [],
            "residuos": []
        }

        try:
            with open(QUESTOES_PATH, "r", encoding="utf-8") as f:
                dados = json.load(f)

            for bloco in dados:
                nome_trilha = (bloco.get("trilha") or "").lower()
                modulo_nome = (bloco.get("modulo", {}).get("nome") or "").lower()

                for atividade in bloco.get("atividades", []):
                    nome_ativ = (atividade.get("nome") or "").lower()
                    for q in atividade.get("questoes", []):
                        opcoes_puras = q.get("opcoes", [])
                        if len(opcoes_puras) != 4:
                            continue

                        # Localiza o índice correto
                        idx_correto = -1
                        opcoes_formatadas = []
                        for i, op in enumerate(opcoes_puras):
                            is_correta = bool(op.get("correta", False))
                            if is_correta and idx_correto == -1:
                                idx_correto = i
                            opcoes_formatadas.append({
                                "index": i,
                                "texto": op.get("texto", ""),
                                "correta": is_correta,
                                "estilo": OPCOES_ESTILO[i]
                            })

                        if idx_correto == -1:
                            idx_correto = 0
                            opcoes_formatadas[0]["correta"] = True

                        questao_obj = {
                            "pergunta": q.get("pergunta", ""),
                            "curiosidade": q.get("curiosidade", "A sustentabilidade transforma o nosso futuro a cada escolha consciente."),
                            "fonte": q.get("fonte", "Sementis — Educação Socioambiental"),
                            "fonte_url": q.get("fonte_url", ""),
                            "opcoes": opcoes_formatadas,
                            "resposta_correta": idx_correto,
                            "tema": bloco.get("trilha", "Sustentabilidade")
                        }

                        # Adiciona em "todos"
                        self.questoes_por_modulo["todos"].append(questao_obj)

                        # Classifica em tópicos
                        if "fundamento" in nome_trilha or "fundamento" in modulo_nome:
                            self.questoes_por_modulo["fundamentos"].append(questao_obj)
                        if "água" in nome_trilha or "agua" in nome_trilha or "água" in nome_ativ or "agua" in nome_ativ:
                            self.questoes_por_modulo["agua"].append(questao_obj)
                        if "clima" in nome_trilha or "climátic" in nome_trilha or "climatic" in nome_trilha:
                            self.questoes_por_modulo["clima"].append(questao_obj)
                        if "energia" in nome_ativ or "energia" in q.get("pergunta", "").lower():
                            self.questoes_por_modulo["energia"].append(questao_obj)
                        if "resíduo" in nome_ativ or "lixo" in nome_ativ or "recicl" in q.get("pergunta", "").lower():
                            self.questoes_por_modulo["residuos"].append(questao_obj)

            # Fallbacks caso algum filtro fique vazio
            for chave in ["fundamentos", "agua", "clima", "energia", "residuos"]:
                if len(self.questoes_por_modulo[chave]) < 5:
                    self.questoes_por_modulo[chave] = self.questoes_por_modulo["todos"]

        except Exception as e:
            print(f"[LiveGameManager] Erro ao carregar questoes.json: {e}")

    def listar_topicos(self) -> List[Dict[str, Any]]:
        """Retorna os tópicos disponíveis com quantidade de questões."""
        return [
            {
                "id": "todos",
                "titulo": "Mix Geral de Sustentabilidade",
                "descricao": "Perguntas variadas de todos os módulos e trilhas",
                "icone": "🎲",
                "total_questoes": len(self.questoes_por_modulo["todos"])
            },
            {
                "id": "fundamentos",
                "titulo": "Fundamentos da Sustentabilidade",
                "descricao": "Princípios, pegada ecológica e tripé da sustentabilidade",
                "icone": "🌱",
                "total_questoes": len(self.questoes_por_modulo["fundamentos"])
            },
            {
                "id": "agua",
                "titulo": "Água e Recursos Hídricos",
                "descricao": "Conservação, pegada hídrica e saneamento",
                "icone": "💧",
                "total_questoes": len(self.questoes_por_modulo["agua"])
            },
            {
                "id": "clima",
                "titulo": "Mudanças Climáticas e Clima",
                "descricao": "Efeito estufa, descarbonização e impacto global",
                "icone": "🌡️",
                "total_questoes": len(self.questoes_por_modulo["clima"])
            },
            {
                "id": "energia",
                "titulo": "Energia Limpa e Renovável",
                "descricao": "Solar, eólica, biomassa e transição energética",
                "icone": "⚡",
                "total_questoes": len(self.questoes_por_modulo["energia"])
            },
            {
                "id": "residuos",
                "titulo": "Reciclagem e Economia Circular",
                "descricao": "Separação de resíduos, compostagem e 5 Rs",
                "icone": "♻️",
                "total_questoes": len(self.questoes_por_modulo["residuos"])
            }
        ]

    def _gerar_pin_unico(self) -> str:
        for _ in range(100):
            pin = "".join(random.choices(string.digits, k=6))
            if pin not in self.salas:
                return pin
        # Fallback
        return str(random.randint(100000, 999999))

    def criar_sala(
        self,
        professor_id: int,
        professor_nome: str,
        nome_sala: str,
        topico: str = "todos",
        qtd_perguntas: int = 5,
        tempo_por_pergunta: int = 20
    ) -> Dict[str, Any]:
        """Cria uma nova sala temporária no modo Sementis Live."""
        pin = self._gerar_pin_unico()

        # Seleciona as questões
        pool = self.questoes_por_modulo.get(topico) or self.questoes_por_modulo["todos"]
        qtd = min(max(qtd_perguntas, 3), len(pool))
        questoes_selecionadas = random.sample(pool, qtd)

        sala = {
            "pin": pin,
            "professor_id": professor_id,
            "professor_nome": professor_nome,
            "nome": nome_sala or f"Desafio Sustentável #{pin[:3]}",
            "topico": topico,
            "status": "lobby",  # 'lobby' | 'pergunta' | 'resultado' | 'ranking' | 'finalizado'
            "indice_pergunta": 0,
            "total_perguntas": len(questoes_selecionadas),
            "tempo_por_pergunta": tempo_por_pergunta,
            "tempo_inicio_pergunta": None,
            "questoes": questoes_selecionadas,
            "participantes": {},  # { id: {...} }
            "respostas_rodada": {},  # { jogador_id: { opcao, tempo_ms, correta, pontos } }
            "historico_rodadas": [],
            "criado_em": datetime.utcnow().isoformat(),
            "atualizado_em": datetime.utcnow().isoformat()
        }

        self.salas[pin] = sala
        return {
            "pin": pin,
            "nome": sala["nome"],
            "topico": topico,
            "total_perguntas": sala["total_perguntas"],
            "tempo_por_pergunta": tempo_por_pergunta,
            "status": sala["status"]
        }

    def entrar_sala(
        self,
        pin: str,
        nome: str,
        usuario_id: Optional[int] = None,
        avatar_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Permite que um aluno entre na sala ao vivo."""
        sala = self.salas.get(pin)
        if not sala:
            return None

        # Gera ID do participante
        jogador_id = f"p_{int(time.time()*1000)}_{random.randint(100, 999)}"

        # Avatar
        if avatar_id:
            avatar = next((a for a in AVATARES_DEFAULT if a["id"] == avatar_id), None)
        else:
            avatar = None

        if not avatar:
            avatar = random.choice(AVATARES_DEFAULT)

        nome_limpo = (nome or "").strip()[:24] or f"EcoPlayer {random.randint(1, 99)}"

        # Evita nomes duplicados na mesma sala
        nomes_existentes = [p["nome"].lower() for p in sala["participantes"].values()]
        if nome_limpo.lower() in nomes_existentes:
            nome_limpo = f"{nome_limpo} ({random.randint(2, 9)})"

        participante = {
            "id": jogador_id,
            "usuario_id": usuario_id,
            "nome": nome_limpo,
            "avatar": avatar,
            "pontos": 0,
            "pontos_ultima_rodada": 0,
            "streak": 0,
            "posicao_anterior": 1,
            "posicao_atual": 1,
            "conectado_em": datetime.utcnow().isoformat(),
            "ultima_atividade": time.time()
        }

        sala["participantes"][jogador_id] = participante
        sala["atualizado_em"] = datetime.utcnow().isoformat()

        # Atualiza posições iniciais
        self._recalcular_posicoes(sala)

        return {
            "jogador_id": jogador_id,
            "pin": pin,
            "nome": participante["nome"],
            "avatar": participante["avatar"],
            "nome_sala": sala["nome"]
        }

    def _recalcular_posicoes(self, sala: Dict[str, Any], salvar_anterior: bool = False):
        """Ordena os participantes por pontuação e atribui posições."""
        lista = list(sala["participantes"].values())
        lista.sort(key=lambda p: p["pontos"], reverse=True)

        for i, p in enumerate(lista, start=1):
            if salvar_anterior:
                p["posicao_anterior"] = p.get("posicao_atual", i)
            p["posicao_atual"] = i

    def obter_estado(self, pin: str, is_host: bool = False, jogador_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retorna o estado sincronizado da sala para o Host ou Aluno."""
        sala = self.salas.get(pin)
        if not sala:
            return None

        status = sala["status"]
        idx = sala["indice_pergunta"]
        total = sala["total_perguntas"]
        questao_atual = sala["questoes"][idx] if idx < total else None

        # Calcula ranking atual
        ranking = []
        lista_part = list(sala["participantes"].values())
        lista_part.sort(key=lambda p: p["pontos"], reverse=True)

        for p in lista_part:
            delta = p.get("posicao_anterior", p["posicao_atual"]) - p["posicao_atual"]
            ranking.append({
                "id": p["id"],
                "nome": p["nome"],
                "avatar": p["avatar"],
                "pontos": p["pontos"],
                "pontos_ultima_rodada": p.get("pontos_ultima_rodada", 0),
                "streak": p.get("streak", 0),
                "posicao": p["posicao_atual"],
                "posicao_anterior": p.get("posicao_anterior", p["posicao_atual"]),
                "delta": delta,  # > 0 subiu, < 0 desceu, == 0 manteve
                "respondeu_rodada": p["id"] in sala["respostas_rodada"]
            })

        # Tempo restante estimado
        tempo_restante = 0
        if status == "pergunta" and sala["tempo_inicio_pergunta"]:
            decorrido = time.time() - sala["tempo_inicio_pergunta"]
            tempo_restante = max(0, sala["tempo_por_pergunta"] - int(decorrido))

        # Estatísticas de respostas da rodada
        distribuicao_respostas = [0, 0, 0, 0]
        total_respostas = len(sala["respostas_rodada"])
        for resp in sala["respostas_rodada"].values():
            op = resp.get("opcao", -1)
            if 0 <= op < 4:
                distribuicao_respostas[op] += 1

        base_info = {
            "pin": pin,
            "nome": sala["nome"],
            "status": status,
            "indice_pergunta": idx,
            "numero_pergunta": idx + 1,
            "total_perguntas": total,
            "tempo_por_pergunta": sala["tempo_por_pergunta"],
            "tempo_restante": tempo_restante,
            "total_participantes": len(sala["participantes"]),
            "total_respostas": total_respostas,
            "topico": sala["topico"]
        }

        if is_host:
            # Host tem acesso a todas as opções, gabarito e ranking completo
            if questao_atual:
                base_info["questao"] = {
                    "pergunta": questao_atual["pergunta"],
                    "tema": questao_atual.get("tema", ""),
                    "curiosidade": questao_atual.get("curiosidade", ""),
                    "fonte": questao_atual.get("fonte", ""),
                    "fonte_url": questao_atual.get("fonte_url", ""),
                    "opcoes": [
                        {
                            "index": op["index"],
                            "texto": op["texto"],
                            "estilo": op["estilo"],
                            "correta": op["correta"] if status in ["resultado", "ranking", "finalizado"] else False
                        }
                        for op in questao_atual["opcoes"]
                    ],
                    "resposta_correta": questao_atual["resposta_correta"] if status in ["resultado", "ranking", "finalizado"] else -1
                }
            base_info["ranking"] = ranking
            base_info["distribuicao_respostas"] = distribuicao_respostas
            base_info["participantes_lista"] = [
                {"id": p["id"], "nome": p["nome"], "avatar": p["avatar"]}
                for p in sala["participantes"].values()
            ]
            return base_info

        # Visão do Aluno
        info_aluno = dict(base_info)
        jogador = sala["participantes"].get(jogador_id) if jogador_id else None

        if jogador:
            info_aluno["meu_status"] = {
                "id": jogador["id"],
                "nome": jogador["nome"],
                "avatar": jogador["avatar"],
                "pontos": jogador["pontos"],
                "pontos_ultima_rodada": jogador.get("pontos_ultima_rodada", 0),
                "streak": jogador.get("streak", 0),
                "posicao": jogador["posicao_atual"],
                "posicao_anterior": jogador.get("posicao_anterior", jogador["posicao_atual"]),
                "delta": jogador.get("posicao_anterior", jogador["posicao_atual"]) - jogador["posicao_atual"],
                "ja_respondeu": jogador["id"] in sala["respostas_rodada"]
            }

            if jogador["id"] in sala["respostas_rodada"]:
                resp = sala["respostas_rodada"][jogador["id"]]
                info_aluno["minha_resposta"] = {
                    "opcao": resp["opcao"],
                    "correta": resp["correta"] if status in ["resultado", "ranking", "finalizado"] else None,
                    "pontos_ganhos": resp.get("pontos", 0) if status in ["resultado", "ranking", "finalizado"] else None
                }

        if questao_atual:
            # Durante 'pergunta', omite o campo 'correta'
            info_aluno["questao"] = {
                "pergunta": questao_atual["pergunta"],
                "tema": questao_atual.get("tema", ""),
                "curiosidade": questao_atual.get("curiosidade", "") if status in ["resultado", "ranking", "finalizado"] else "",
                "opcoes": [
                    {
                        "index": op["index"],
                        "texto": op["texto"],
                        "estilo": op["estilo"]
                    }
                    for op in questao_atual["opcoes"]
                ],
                "resposta_correta": questao_atual["resposta_correta"] if status in ["resultado", "ranking", "finalizado"] else -1
            }

        # No ranking/resultado, envia o top 5
        info_aluno["top_ranking"] = ranking[:5]

        return info_aluno

    def iniciar_jogo(self, pin: str, professor_id: int) -> bool:
        """Inicia a partida, passando do lobby para a Pergunta 1."""
        sala = self.salas.get(pin)
        if not sala or sala["professor_id"] != professor_id:
            return False

        sala["status"] = "pergunta"
        sala["indice_pergunta"] = 0
        sala["tempo_inicio_pergunta"] = time.time()
        sala["respostas_rodada"] = {}
        sala["atualizado_em"] = datetime.utcnow().isoformat()
        return True

    def responder(self, pin: str, jogador_id: str, opcao: int, tempo_ms: int) -> Optional[Dict[str, Any]]:
        """Registra a resposta do aluno e calcula os pontos no estilo Kahoot."""
        sala = self.salas.get(pin)
        if not sala:
            return None

        if sala["status"] != "pergunta":
            return {"erro": "A rodada atual não está aceitando respostas."}

        jogador = sala["participantes"].get(jogador_id)
        if not jogador:
            return {"erro": "Participante não encontrado na sala."}

        if jogador_id in sala["respostas_rodada"]:
            return {"erro": "Você já respondeu a esta pergunta."}

        idx = sala["indice_pergunta"]
        questao = sala["questoes"][idx]
        is_correta = (opcao == questao["resposta_correta"])

        pontos_ganhos = 0
        if is_correta:
            # Fórmula Kahoot: Pontuação máxima 1000 pts
            # Fator de decaimento: 50% por tempo
            tempo_limite_ms = sala["tempo_por_pergunta"] * 1000
            tempo_ajustado = min(max(tempo_ms, 0), tempo_limite_ms)
            fator_velocidade = 1.0 - (tempo_ajustado / tempo_limite_ms) * 0.5
            pontos_base = round(1000 * fator_velocidade)

            # Bônus de Streak: +50 por acerto consecutivo anterior (máx +250)
            bonus_streak = min(jogador.get("streak", 0) * 50, 250)
            pontos_ganhos = pontos_base + bonus_streak

            jogador["streak"] = jogador.get("streak", 0) + 1
        else:
            jogador["streak"] = 0

        jogador["pontos"] += pontos_ganhos
        jogador["pontos_ultima_rodada"] = pontos_ganhos

        resposta_registro = {
            "jogador_id": jogador_id,
            "opcao": opcao,
            "tempo_ms": tempo_ms,
            "correta": is_correta,
            "pontos": pontos_ganhos
        }

        sala["respostas_rodada"][jogador_id] = resposta_registro
        sala["atualizado_em"] = datetime.utcnow().isoformat()

        return {
            "sucesso": True,
            "opcao_escolhida": opcao,
            "mensagem": "Resposta computada!"
        }

    def revelar_resultado(self, pin: str, professor_id: int) -> bool:
        """Encerra a contagem da pergunta e exibe o gabarito."""
        sala = self.salas.get(pin)
        if not sala or sala["professor_id"] != professor_id:
            return False

        sala["status"] = "resultado"
        sala["atualizado_em"] = datetime.utcnow().isoformat()
        return True

    def mostrar_ranking(self, pin: str, professor_id: int) -> bool:
        """Avança para a tela de ranking/leaderboard da rodada."""
        sala = self.salas.get(pin)
        if not sala or sala["professor_id"] != professor_id:
            return False

        self._recalcular_posicoes(sala, salvar_anterior=True)
        sala["status"] = "ranking"
        sala["atualizado_em"] = datetime.utcnow().isoformat()
        return True

    def proxima_pergunta(self, pin: str, professor_id: int) -> Dict[str, Any]:
        """Avança para a próxima questão ou encerra no Pódio Final."""
        sala = self.salas.get(pin)
        if not sala or sala["professor_id"] != professor_id:
            return {"erro": "Sem permissão ou sala inexistente."}

        # Salva histórico da rodada
        sala["historico_rodadas"].append({
            "indice": sala["indice_pergunta"],
            "respostas": dict(sala["respostas_rodada"])
        })

        proximo_indice = sala["indice_pergunta"] + 1
        if proximo_indice < sala["total_perguntas"]:
            sala["indice_pergunta"] = proximo_indice
            sala["status"] = "pergunta"
            sala["tempo_inicio_pergunta"] = time.time()
            sala["respostas_rodada"] = {}
            for p in sala["participantes"].values():
                p["pontos_ultima_rodada"] = 0
            sala["atualizado_em"] = datetime.utcnow().isoformat()
            return {"status": "pergunta", "indice": proximo_indice}
        else:
            self._recalcular_posicoes(sala, salvar_anterior=False)
            sala["status"] = "finalizado"
            sala["atualizado_em"] = datetime.utcnow().isoformat()
            return {"status": "finalizado"}

    def adicionar_bot_simulado(self, pin: str) -> Optional[Dict[str, Any]]:
        """Adiciona um aluno bot para facilitar demonstrações e testes."""
        sala = self.salas.get(pin)
        if not sala:
            return None

        nomes_bots = [
            ("Lucas", "broto"),
            ("Beatriz", "gota"),
            ("Gabriel", "sol"),
            ("Mariana", "folha"),
            ("Rafael", "tartaruga"),
            ("Camila", "flor"),
            ("Felipe", "abelha"),
            ("Sofia", "passaro")
        ]

        # Escolhe um nome não usado
        existentes = [p["nome"].lower() for p in sala["participantes"].values()]
        disponiveis = [b for b in nomes_bots if b[0].lower() not in existentes]
        if not disponiveis:
            nome_bot, av_id = f"Aluno Eco {random.randint(10, 99)}", "broto"
        else:
            nome_bot, av_id = random.choice(disponiveis)

        res = self.entrar_sala(pin, nome_bot, avatar_id=av_id)

        # Se já estiver na fase de pergunta, o bot pode responder aleatoriamente
        if res and sala["status"] == "pergunta":
            jogador_id = res["jogador_id"]
            questao = sala["questoes"][sala["indice_pergunta"]]
            # 70% de chance de acerto
            if random.random() < 0.70:
                opcao = questao["resposta_correta"]
            else:
                opcao = random.randint(0, 3)
            tempo_ms = random.randint(2500, 10000)
            self.responder(pin, jogador_id, opcao, tempo_ms)

        return res

    def simular_respostas_bots(self, pin: str):
        """Faz os bots responderem automaticamente a pergunta atual se estiver em fase de pergunta."""
        sala = self.salas.get(pin)
        if not sala or sala["status"] != "pergunta":
            return

        questao = sala["questoes"][sala["indice_pergunta"]]
        for p_id, p in sala["participantes"].items():
            if p_id not in sala["respostas_rodada"]:
                # 75% chance de acerto para bots
                opcao = questao["resposta_correta"] if random.random() < 0.75 else random.randint(0, 3)
                tempo_ms = random.randint(1500, max(2000, (sala["tempo_por_pergunta"] - 2) * 1000))
                self.responder(pin, p_id, opcao, tempo_ms)

    def listar_salas_professor(self, professor_id: int) -> List[Dict[str, Any]]:
        """Retorna as salas ativas criadas por um determinado professor."""
        resultado = []
        for pin, s in self.salas.items():
            if s["professor_id"] == professor_id:
                resultado.append({
                    "pin": pin,
                    "nome": s["nome"],
                    "topico": s["topico"],
                    "status": s["status"],
                    "total_participantes": len(s["participantes"]),
                    "total_perguntas": s["total_perguntas"],
                    "criado_em": s["criado_em"]
                })
        return resultado


# Instância global singleton
live_manager = LiveGameManager()
