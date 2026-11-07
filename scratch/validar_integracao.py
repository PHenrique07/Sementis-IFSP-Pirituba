import json
from pathlib import Path
from backend.caminhos import CAMINHO_QUESTOES
from backend import seeds
from backend.live_game import live_manager

def testar():
    print("1. Testando leitura do questoes.json...")
    conteudo = seeds.carregar_conteudo_educacional()
    assert conteudo, "Conteúdo educacional vazio"
    print(f"   Módulos carregados: {len(conteudo)}")
    
    modulo3 = conteudo[2]
    nomes_atividades = [a["nome"] for a in modulo3["atividades"]]
    print(f"   Atividades do Módulo 3: {nomes_atividades}")
    assert "Energia Sustentável e Transição Limpa" in nomes_atividades, "Atividade não encontrada no Módulo 3"
    
    print("\n2. Testando sincronização com banco de dados...")
    seeds.sincronizar_conteudo_educacional()
    
    print("\n3. Testando Live Game Manager (Arena)...")
    live_manager._carregar_banco_questoes()
    total_energia = len(live_manager.questoes_por_modulo["energia"])
    print(f"   Total de questões no pool 'energia': {total_energia}")
    assert total_energia >= 13, f"Esperado >= 13 questões em energia, obteve {total_energia}"
    
    topicos = live_manager.listar_topicos()
    topico_energia = next((t for t in topicos if t["id"] == "energia"), None)
    print(f"   Tópico de energia da Arena: {topico_energia}")
    assert topico_energia and topico_energia["total_questoes"] >= 13
    
    print("\n✨ TODAS AS VALIDAÇÕES PASSARAM COM SUCESSO!")

if __name__ == "__main__":
    testar()

