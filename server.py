"""
server.py - Backend da Automação de Compras TI
Grupo 1 - UiPath + Copa do Mundo BR

Como rodar localmente:
    pip install flask flask-cors
    python server.py

Como hospedar (ex: Render, Railway, Fly.io):
    - Defina a variável de ambiente PORT (a plataforma faz isso automaticamente)
    - Defina SERVER_ORIGIN com a URL do seu front-end, ex:
        SERVER_ORIGIN=https://meu-dashboard.netlify.app
    - O Procfile (se necessário) deve conter:
        web: python server.py

Rotas:
    GET  /dados        -> Front-end faz polling aqui a cada 5s
    POST /resultado    -> UiPath envia os resultados aqui
    POST /solicitacao  -> Front-end envia os itens para cotar
    GET  /status       -> Healthcheck
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)

# ─────────────────────────────────────────────
# CORS
# Em produção, defina SERVER_ORIGIN com a URL
# exata do seu front-end para restringir acesso.
# Ex: SERVER_ORIGIN=https://meu-dashboard.netlify.app
# Deixar vazio libera todas as origens (ok para demo).
# ─────────────────────────────────────────────
origem_permitida = os.environ.get("SERVER_ORIGIN", "*")
CORS(app, resources={r"/*": {"origins": origem_permitida}})


# ─────────────────────────────────────────────
# ESTADO GLOBAL
# Para a demo, memória é suficiente.
# Em produção, substituir por banco de dados.
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
# ROTA 1: Front-end faz GET aqui a cada 5s
# ─────────────────────────────────────────────
@app.route('/dados', methods=['GET'])
def get_dados():
    return jsonify(estado)


# ─────────────────────────────────────────────
# ROTA 2: UiPath envia os resultados aqui
#
# O robô deve fazer POST para /resultado
# com o seguinte JSON:
#
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
# ROTA 3: Front-end envia a solicitação
# O servidor salva em solicitacao.json para
# o UiPath monitorar e iniciar a pesquisa.
# ─────────────────────────────────────────────
@app.route('/solicitacao', methods=['POST'])
def receber_solicitacao():
    dados = request.get_json()

    if not dados or "itens" not in dados:
        return jsonify({"erro": "Formato inválido. Envie { itens: [...] }"}), 400

    estado["status_robo"]        = "Em execução"
    estado["ultimo_log"]         = f"Nova solicitação recebida às {datetime.now().strftime('%H:%M:%S')}. Iniciando pesquisa..."
    estado["alerta_erro"]        = None
    estado["ultima_atualizacao"] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    estado["cotacoes"]           = []

    solicitacao = {
        "timestamp": estado["ultima_atualizacao"],
        "itens": dados["itens"]
    }
    historico = []
    if os.path.exists("solicitacao.json"):
        with open("solicitacao.json", "r", encoding="utf-8") as f:
            try:
                historico = json.load(f)
            except json.JSONDecodeError:
                historico = []
    historico.append(solicitacao)
    with open("solicitacao.json", "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)

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


# ─────────────────────────────────────────────
# INICIALIZAÇÃO
# HOST 0.0.0.0 é obrigatório para hospedagem.
# PORT lido da variável de ambiente (padrão 5000).
# ─────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"

    print("=" * 50)
    print("  Servidor Automação de Compras TI - Grupo 1")
    print(f"  Rodando em http://0.0.0.0:{port}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=port, debug=debug)