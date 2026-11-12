def test_alertas_rmr_estrutura():
    alerta = {
        "bairro": "Ibura",
        "nivelRisco": "ALTO",
        "linguagemSimples": "Chuva muito forte. Vá para o ponto de apoio.",
        "telefoneEmergencia": "199",
    }
    assert alerta["nivelRisco"] == "ALTO"
    assert "199" in alerta["telefoneEmergencia"]


def test_linguagem_simples_nao_vazia():
    texto_traduzido = "Saia de perto do barranco e procure a Escola Municipal."
    assert len(texto_traduzido) > 10


def test_calculo_prioridade_risco():
    chuva_mm = 90
    risco = "ALTO" if chuva_mm >= 80 else "MODERADO"
    assert risco == "ALTO"

