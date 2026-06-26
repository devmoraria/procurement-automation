"""
server.py - Backend da Automação de Compras TI
Grupo 1 - UiPath + Copa do Mundo BR

Como rodar:
    pip install flask flask-cors
    python server.py

Rotas:
    GET  /dados          -> Page faz polling aqui a cada 5s
    POST /resultado      -> UiPath envia os resultados aqui
    POST /solicitacao    -> Page envia os itens para cotar
    GET  /status         -> Healthcheck
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Permite que a page (outro origem) acesse o servidor

# ─────────────────────────────────────────────
# ESTADO GLOBAL (memória do servidor)
# Em produção, usar um banco de dados.
# Para a demo, memória é suficiente.
# ─────────────────────────────────────────────

estado = {
    "status_robo": "Aguardando solicitação",
    "ultimo_log": "Servidor iniciado. Aguardando dados do robô UiPath...",
    "alerta_erro": None,
    "ultima_atualizacao": None,
    "performance_roi": {
        "tempo_manual": 32,
        "tempo_robo": 2.5,
        "horas_poupadas": 29.5,
        "economia_financeira_brl": 15420.00
    },
    "cotacoes": []
}

# ─────────────────────────────────────────────
# ROTA 1: Page faz GET aqui a cada 5 segundos
# ─────────────────────────────────────────────
@app.route('/dados', methods=['GET'])
def get_dados():
    return jsonify(estado)


# ─────────────────────────────────────────────
# ROTA 2: UiPath envia os resultados aqui
#
# O robô deve fazer um POST para:
#   http://localhost:5000/resultado
#
# Com o seguinte JSON no body:
# {
#   "status_robo": "Concluído",
#   "ultimo_log": "Pesquisa finalizada. 3 itens cotados.",
#   "alerta_erro": null,
#   "performance_roi": {
#       "tempo_manual": 32,
#       "tempo_robo": 2.5,
#       "horas_poupadas": 29.5,
#       "economia_financeira_brl": 15420.00
#   },
#   "cotacoes": [
#       {
#           "item": "Notebook Corporativo",
#           "desc": "i7, 16GB RAM, 512GB SSD",
#           "qtd": 10,
#           "fornecedor": "Kabum",
#           "preco": 4500.00,
#           "link": "https://kabum.com.br"
#       }
#   ]
# }
# ─────────────────────────────────────────────
@app.route('/resultado', methods=['POST'])
def receber_resultado():
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Body JSON inválido ou vazio"}), 400

    # Atualiza o estado global com o que o UiPath enviou
    estado["status_robo"]        = dados.get("status_robo", "Atualizado pelo robô")
    estado["ultimo_log"]         = dados.get("ultimo_log", f"Dados recebidos às {datetime.now().strftime('%H:%M:%S')}")
    estado["alerta_erro"]        = dados.get("alerta_erro", None)
    estado["ultima_atualizacao"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    estado["cotacoes"]           = dados.get("cotacoes", [])

    if "performance_roi" in dados:
        estado["performance_roi"].update(dados["performance_roi"])

    print(f"[{estado['ultima_atualizacao']}] Resultado recebido do UiPath: {estado['ultimo_log']}")
    return jsonify({"ok": True, "mensagem": "Dados recebidos com sucesso"}), 200


# ─────────────────────────────────────────────
# ROTA 3: Page envia a solicitação de cotação
# O servidor salva em solicitacao.json para
# o UiPath ler e iniciar a pesquisa.
# ─────────────────────────────────────────────
@app.route('/solicitacao', methods=['POST'])
def receber_solicitacao():
    dados = request.get_json()

    if not dados or "itens" not in dados:
        return jsonify({"erro": "Formato inválido. Envie { itens: [...] }"}), 400

    # Marca o robô como "Em execução"
    estado["status_robo"]        = "Em execução"
    estado["ultimo_log"]         = f"Nova solicitação recebida às {datetime.now().strftime('%H:%M:%S')}. Iniciando pesquisa..."
    estado["alerta_erro"]        = None
    estado["ultima_atualizacao"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    estado["cotacoes"]           = []  # Limpa resultados anteriores

    # Salva a solicitação em arquivo para o UiPath ler
    solicitacao = {
        "timestamp": estado["ultima_atualizacao"],
        "itens": dados["itens"]
    }
    with open("solicitacao.json", "w", encoding="utf-8") as f:
        json.dump(solicitacao, f, ensure_ascii=False, indent=2)

    print(f"[{estado['ultima_atualizacao']}] Solicitação salva: {len(dados['itens'])} item(s)")
    return jsonify({"ok": True, "mensagem": f"{len(dados['itens'])} item(s) enviados para o robô"}), 200


# ─────────────────────────────────────────────
# ROTA 4: Healthcheck
# ─────────────────────────────────────────────
@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "servidor": "online",
        "ultima_atualizacao": estado["ultima_atualizacao"]
    })


if __name__ == '__main__':
    print("=" * 50)
    print("  Servidor Automação de Compras TI - Grupo 1")
    print("  Rodando em http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)