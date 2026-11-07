import json
import sys
from pathlib import Path

def main():
    caminho_questoes = Path("backend/dados/questoes.json")
    if not caminho_questoes.exists():
        print("❌ Erro: questoes.json não encontrado!")
        sys.exit(1)

    with open(caminho_questoes, "r", encoding="utf-8") as f:
        dados = json.load(f)

    nova_atividade = {
        "nome": "Energia Sustentável e Transição Limpa",
        "tipo": "quiz",
        "questoes": [
            {
                "tipo": "simples",
                "pergunta": "O que caracteriza uma fonte de energia como 'renovável'?",
                "curiosidade": "Fontes renováveis aproveitam ciclos naturais da Terra (como a radiação solar, as chuvas e o vento) e não se esgotam em escala de tempo humana, gerando menor impacto de emissões.",
                "fonte": "Empresa de Pesquisa Energética — Matriz Energética e Elétrica",
                "fonte_url": "https://www.epe.gov.br/pt/abcdenergia/matriz-energetica-e-eletrica",
                "opcoes": [
                    {
                        "texto": "Recurso que se regenera naturalmente em curto espaço de tempo",
                        "correta": True
                    },
                    {
                        "texto": "Fonte que requer combustão constante de compostos fósseis",
                        "correta": False
                    },
                    {
                        "texto": "Energia que só pode ser gerada durante o período noturno",
                        "correta": False
                    },
                    {
                        "texto": "Recurso mineral retirado das camadas mais profundas do subsolo",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "grid_multiplo",
                "pergunta": "Selecione as fontes renováveis que impulsionam a matriz elétrica limpa:",
                "curiosidade": "O sol e os ventos são fontes limpas e inesgotáveis. Já o carvão mineral e o petróleo são combustíveis fósseis que emitem grandes volumes de gases do efeito estufa e levam milhões de anos para se formar.",
                "fonte": "Empresa de Pesquisa Energética — ABC da Energia",
                "fonte_url": "https://www.epe.gov.br/pt/abcdenergia/matriz-energetica-e-eletrica",
                "opcoes": [
                    {
                        "texto": "Luz solar",
                        "icone": "energia_solar.png",
                        "correta": True
                    },
                    {
                        "texto": "Vento",
                        "icone": "energia_vento.png",
                        "correta": True
                    },
                    {
                        "texto": "Carvão mineral",
                        "icone": "carvao_mineral.png",
                        "correta": False
                    },
                    {
                        "texto": "Petróleo",
                        "icone": "petroleo.png",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Qual é a principal diferença entre a matriz elétrica brasileira e a média mundial?",
                "curiosidade": "Mais de 80% da eletricidade do Brasil vem de fontes renováveis (hidrelétrica, biomassa, eólica e solar), enquanto no restante do mundo os combustíveis fósseis como carvão e gás ainda respondem por mais de 60% da geração.",
                "fonte": "EPE — Balanço Energético Nacional (BEN)",
                "fonte_url": "https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/balanco-energetico-nacional-2023",
                "opcoes": [
                    {
                        "texto": "A matriz brasileira possui participação de renováveis muito superior à mundial",
                        "correta": True
                    },
                    {
                        "texto": "O Brasil depende quase exclusivamente de termelétricas a carvão mineral",
                        "correta": False
                    },
                    {
                        "texto": "A matriz mundial não utiliza nenhuma fonte fóssil para gerar eletricidade",
                        "correta": False
                    },
                    {
                        "texto": "O Brasil importa 100% da energia elétrica que consome",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "O Objetivo de Desenvolvimento Sustentável 7 (ODS 7) da ONU tem como meta principal:",
                "curiosidade": "O ODS 7 busca assegurar energia limpa, confiável, sustentável e moderna para todos até 2030, incluindo o aumento da eficiência energética e a cooperação internacional.",
                "fonte": "Nações Unidas Brasil — ODS 7: Energia Limpa e Acessível",
                "fonte_url": "https://brasil.un.org/pt-br/sdgs/7",
                "opcoes": [
                    {
                        "texto": "Garantir acesso confiável, sustentável, moderno e a preço acessível à energia",
                        "correta": True
                    },
                    {
                        "texto": "Substituir todas as fontes elétricas por usinas exclusivamente a carvão",
                        "correta": False
                    },
                    {
                        "texto": "Proibir o uso de eletricidade em áreas rurais e comunidades tradicionais",
                        "correta": False
                    },
                    {
                        "texto": "Restringir o acesso a energias renováveis apenas a grandes indústrias",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Ao comprar uma geladeira ou ar-condicionado, qual elemento indica maior eficiência energética no Brasil?",
                "curiosidade": "O Selo Procel premia os equipamentos mais eficientes de cada categoria (geralmente classificação 'A'), indicando que consomem menos quilowatts-hora (kWh) para realizar o mesmo serviço.",
                "fonte": "Programa Nacional de Conservação de Energia Elétrica — Selo Procel",
                "fonte_url": "http://www.procelinfo.com.br/",
                "opcoes": [
                    {
                        "texto": "Selo Procel com classificação 'A' de menor consumo elétrico",
                        "correta": True
                    },
                    {
                        "texto": "Cor externa do eletrodoméstico ser mais escura para absorver calor",
                        "correta": False
                    },
                    {
                        "texto": "Maior potência nominal em watts sem indicação de eficiência",
                        "correta": False
                    },
                    {
                        "texto": "Garantia estendida comercial vendida pela loja",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "O que define o conceito de 'Geração Distribuída' de energia elétrica?",
                "curiosidade": "Na geração distribuída, como em residências com placas solares no telhado, o próprio consumidor gera sua energia e injeta o excedente na rede da distribuidora local em troca de créditos.",
                "fonte": "ANEEL — Informações sobre Geração Distribuída",
                "fonte_url": "https://www.gov.br/aneel/pt-br/assuntos/geracao-distribuida",
                "opcoes": [
                    {
                        "texto": "Energia gerada pelo próprio consumidor junto ou perto do ponto de consumo",
                        "correta": True
                    },
                    {
                        "texto": "Grandes usinas termelétricas situadas a milhares de quilômetros das cidades",
                        "correta": False
                    },
                    {
                        "texto": "Transmissão exclusiva de eletricidade sem conexão com a rede pública",
                        "correta": False
                    },
                    {
                        "texto": "Armazenamento subterrâneo de gás em tanques de alta pressão",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Por que a região Nordeste do Brasil se tornou polo de destaque na geração de energia eólica?",
                "curiosidade": "Os ventos no Nordeste são fortes, unidirecionais e constantes ao longo do ano, além de soprarem com intensidade no período noturno, complementando o ciclo de consumo.",
                "fonte": "Associação Brasileira de Energia Eólica (ABEEólica)",
                "fonte_url": "https://abeeolica.org.br/",
                "opcoes": [
                    {
                        "texto": "Ventos fortes, constantes e sem mudanças bruscas de direção",
                        "correta": True
                    },
                    {
                        "texto": "Existência de montanhas com neve eterna para resfriar os aerogeradores",
                        "correta": False
                    },
                    {
                        "texto": "Ausência total de raios solares durante o ano",
                        "correta": False
                    },
                    {
                        "texto": "Proibição legal de instalar painéis fotovoltaicos na região",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Como a biomassa residual (ex: bagaço de cana-de-açúcar) contribui para a matriz energética?",
                "curiosidade": "As usinas sucroalcooleiras queimam o bagaço da cana em caldeiras de alta pressão para gerar vapor e eletricidade (cogeração), tornando-se autossuficientes e vendendo excedentes para a rede elétrica nacional.",
                "fonte": "Empresa de Pesquisa Energética — Bioenergia e Cogeração",
                "fonte_url": "https://www.epe.gov.br/pt/abcdenergia/fontes-de-energia",
                "opcoes": [
                    {
                        "texto": "Gera vapor e eletricidade por cogeração a partir de resíduos agrícolas",
                        "correta": True
                    },
                    {
                        "texto": "Aumenta a necessidade de queima de óleo diesel nas colheitas",
                        "correta": False
                    },
                    {
                        "texto": "Substitui a água potável usada no resfriamento de cidades",
                        "correta": False
                    },
                    {
                        "texto": "Serve apenas para descarte em aterros sem aproveitamento energético",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Qual é o principal desafio técnico associado a fontes renováveis como a solar e a eólica?",
                "curiosidade": "Como o sol não brilha à noite e o vento varia ao longo do dia, os sistemas elétricos necessitam de previsão meteorológica precisa, linhas de transmissão interligadas e baterias para armazenar energia.",
                "fonte": "Operador Nacional do Sistema Elétrico (ONS)",
                "fonte_url": "https://www.ons.org.br/",
                "opcoes": [
                    {
                        "texto": "Intermitência da geração conforme as condições climáticas e horários",
                        "correta": True
                    },
                    {
                        "texto": "Emissão excessiva de fuligem e cinzas tóxicas nas cidades",
                        "correta": False
                    },
                    {
                        "texto": "Impossibilidade total de conexão com o sistema elétrico nacional",
                        "correta": False
                    },
                    {
                        "texto": "Esgotamento da luz solar após duas décadas de captação",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "O que é 'Hidrogênio Verde' e por que ele é considerado essencial para a descarbonização global?",
                "curiosidade": "O hidrogênio verde é obtido pela quebra da molécula de água (eletrólise) usando unicamente eletricidade de fontes renováveis (solar ou eólica), permitindo descarbonizar indústrias pesadas como siderurgia e fertilizantes.",
                "fonte": "Ministério de Minas e Energia — Programa Nacional do Hidrogênio (PNH2)",
                "fonte_url": "https://www.gov.br/mme/pt-br/assuntos/secretarias/planejamento-e-transicao-energetica/pnh2",
                "opcoes": [
                    {
                        "texto": "Hidrogênio produzido por eletrólise da água usando eletricidade 100% renovável",
                        "correta": True
                    },
                    {
                        "texto": "Gás metano extraído diretamente de poços profundos de petróleo",
                        "correta": False
                    },
                    {
                        "texto": "Combustível fóssil que recebe coloração verde para fins de marketing",
                        "correta": False
                    },
                    {
                        "texto": "Hidrogênio gerado exclusivamente a partir da queima de carvão mineral",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "grid_multiplo",
                "pergunta": "Quais atitudes na escola e em casa promovem uso consciente e eficiência energética?",
                "curiosidade": "Aproveitar a luz do dia e evitar deixar aparelhos em modo stand-by ou luzes acesas sem necessidade diminui o consumo na rede e alivia a demanda nas horas de pico.",
                "fonte": "Ministério de Minas e Energia — Dicas de Eficiência Energética",
                "fonte_url": "https://www.gov.br/mme/pt-br",
                "opcoes": [
                    {
                        "texto": "Aproveitar a iluminação natural e apagar luzes ao sair do ambiente",
                        "icone": "energia_solar.png",
                        "correta": True
                    },
                    {
                        "texto": "Adotar transporte ativo ou coletivo e caronas solidárias",
                        "icone": "ir_de_bike.png",
                        "correta": True
                    },
                    {
                        "texto": "Deixar o ar-condicionado no mínimo com portas e janelas abertas",
                        "icone": "descart.png",
                        "correta": False
                    },
                    {
                        "texto": "Manter lâmpadas acesas e computadores ligados durante o fim de semana",
                        "icone": "pouco02.png",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Qual o papel do Sistema Interligado Nacional (SIN) na transição para energias renováveis no Brasil?",
                "curiosidade": "O SIN conecta usinas e consumidores de quase todo o país por milhares de quilômetros de linhas de transmissão. Se chove menos em uma região ou o vento para em outra, a energia é transferida de onde há excedente para onde há escassez.",
                "fonte": "Operador Nacional do Sistema Elétrico — Sobre o SIN",
                "fonte_url": "https://www.ons.org.br/paginas/sobre-o-sin/o-que-e-o-sin",
                "opcoes": [
                    {
                        "texto": "Conectar diferentes regiões para transferir energia renovável excedente entre elas",
                        "correta": True
                    },
                    {
                        "texto": "Impedir que energia solar seja distribuída para fora do município produtor",
                        "correta": False
                    },
                    {
                        "texto": "Cobrar taxas adicionais de quem consome eletricidade gerada pelo vento",
                        "correta": False
                    },
                    {
                        "texto": "Desconectar totalmente as usinas hidrelétricas para evitar quedas de água",
                        "correta": False
                    }
                ]
            },
            {
                "tipo": "simples",
                "pergunta": "Por que a eletrificação do transporte (carros, ônibus e trens) é particularmente vantajosa no Brasil?",
                "curiosidade": "Em países onde a eletricidade vem do carvão, carregar um carro elétrico ainda queima combustível fóssil indiretamente. No Brasil, como nossa rede é limpa (>80% renovável), o veículo elétrico reduz drasticamente as emissões globais de carbono.",
                "fonte": "Empresa de Pesquisa Energética — Mobilidade Sustentável e Eletromobilidade",
                "fonte_url": "https://www.epe.gov.br/pt/publicacoes-dados-abertos/publicacoes/cadernos-de-transicao-energetica",
                "opcoes": [
                    {
                        "texto": "Porque a eletricidade da nossa rede já é proveniente de fontes majoritariamente limpas",
                        "correta": True
                    },
                    {
                        "texto": "Porque veículos elétricos utilizam petróleo diretamente em seus motores",
                        "correta": False
                    },
                    {
                        "texto": "Porque as baterias não necessitam de recarga elétrica durante sua vida útil",
                        "correta": False
                    },
                    {
                        "texto": "Porque o Brasil não possui nenhuma estrada pavimentada para motores a combustão",
                        "correta": False
                    }
                ]
            }
        ]
    }

    # Adiciona ou atualiza no Módulo 3 ("Mudança Climática")
    modulo_clima = dados[2]
    atividades_clima = modulo_clima["atividades"]
    
    idx_existente = next((i for i, a in enumerate(atividades_clima) if a["nome"] == nova_atividade["nome"]), None)
    if idx_existente is not None:
        atividades_clima[idx_existente] = nova_atividade
        print(f"🔄 Atividade '{nova_atividade['nome']}' atualizada no Módulo 3.")
    else:
        atividades_clima.append(nova_atividade)
        print(f"✅ Atividade '{nova_atividade['nome']}' inserida no Módulo 3 (Fase 4).")

    with open(caminho_questoes, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)
    print("💾 questoes.json salvo com sucesso!")

if __name__ == "__main__":
    main()

