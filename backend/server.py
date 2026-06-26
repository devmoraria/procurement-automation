"""
server.py - Backend da Automação de Compras TI
Grupo 1 - UiPath + Copa do Mundo BR + MongoDB

Como rodar localmente:
    pip install flask flask-cors pymongo certifi python-dotenv
    python server.py

Variáveis de ambiente (.env):
    MONGO_URI     -> URI de conexão do MongoDB Atlas
    PORT          -> Porta do servidor (padrão 5000)
    SERVER_ORIGIN -> URL do front-end para restringir CORS
    FLASK_DEBUG   -> true/false (padrão false)

Banco: equipamentos_cotacao
Coleções:
    estado_atual        -> estado do painel (1 documento, _id fixo "painel_principal")
    pedidos_entrada     -> histórico de solicitações do front-end
    cotacoes_resultado  -> histórico de resultados do UiPath
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ─────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────
origem_permitida = os.environ.get("SERVER_ORIGIN", "*")
CORS(app, resources={r"/*": {"origins": origem_permitida}})


# ─────────────────────────────────────────────
# CONEXÃO COM O MONGODB
# ─────────────────────────────────────────────
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

db                   = client["equipamentos_cotacao"]
colecao_estado       = db["estado_atual"]
colecao_solicitacoes = db["pedidos_entrada"]
colecao_resultados   = db["cotacoes_resultado"]

ESTADO_ID = "painel_principal"


def inicializar_estado():
    """Garante que existe um registro inicial de estado no banco, com _id fixo."""
    if colecao_estado.count_documents({"_id": ESTADO_ID}) == 0:
        estado_inicial = {
            "_id": ESTADO_ID,
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
        colecao_estado.insert_one(estado_inicial)

inicializar_estado()


# ─────────────────────────────────────────────
# ROTA 1: Front-end faz GET aqui a cada 5s
# ─────────────────────────────────────────────
@app.route('/dados', methods=['GET'])
def get_dados():
    estado = colecao_estado.find_one({"_id": ESTADO_ID}, {"_id": 0})
    return jsonify(estado)


# ─────────────────────────────────────────────
# ROTA 2: UiPath envia os resultados aqui
# ─────────────────────────────────────────────
@app.route('/resultado', methods=['POST'])
def receber_resultado():
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Body JSON inválido ou vazio"}), 400

    ultima_atualizacao = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    ultimo_log = dados.get("ultimo_log", f"Dados recebidos às {datetime.now().strftime('%H:%M:%S')}")

    cotacoes = dados.get("cotacoes", [])
    for cotacao in cotacoes:
        if "status" not in cotacao:
            cotacao["status"] = "completo"

    update_fields = {
        "status_robo":        dados.get("status_robo", "Atualizado pelo robô"),
        "ultimo_log":         ultimo_log,
        "alerta_erro":        dados.get("alerta_erro", None),
        "ultima_atualizacao": ultima_atualizacao,
        "cotacoes":           cotacoes
    }

    if "performance_roi" in dados:
        for k, v in dados["performance_roi"].items():
            update_fields[f"performance_roi.{k}"] = v

    colecao_estado.update_one({"_id": ESTADO_ID}, {"$set": update_fields}, upsert=True)

    colecao_resultados.insert_one({
        "timestamp":     ultima_atualizacao,
        "status_robo":   update_fields["status_robo"],
        "ultimo_log":    ultimo_log,
        "cotacoes":      cotacoes,
        "performance_roi": dados.get("performance_roi", {})
    })

    print(f"[{ultima_atualizacao}] Resultado salvo em cotacoes_resultado: {ultimo_log}")
    return jsonify({"ok": True, "mensagem": "Dados atualizados com sucesso no MongoDB"}), 200


# ─────────────────────────────────────────────
# ROTA 3: Front-end envia a solicitação
# ─────────────────────────────────────────────
@app.route('/solicitacao', methods=['POST'])
def receber_solicitacao():
    dados = request.get_json()

    if not dados or "itens" not in dados:
        return jsonify({"erro": "Formato inválido. Envie { itens: [...] }"}), 400

    ultima_atualizacao = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    cotacoes_pendentes = [
        {
            "item": f"{item.get('marca', '')} {item.get('modelo', '')}".strip(),
            "desc": item.get("observacoes", ""),
            "qtd": item.get("quantidade", 1),
            "fornecedor": "",
            "preco": None,
            "link": "",
            "status": "pendente"
        }
        for item in dados["itens"]
    ]

    # Atualiza painel — inclui fornecedores_prioritarios para o robô consultar via GET /dados
    colecao_estado.update_one({"_id": ESTADO_ID}, {"$set": {
        "status_robo":              "Em execução",
        "ultimo_log":               f"Nova solicitação recebida às {datetime.now().strftime('%H:%M:%S')}. Iniciando pesquisa...",
        "alerta_erro":              None,
        "ultima_atualizacao":       ultima_atualizacao,
        "cotacoes":                 cotacoes_pendentes,
    }}, upsert=True)

    # Salva histórico — inclui fornecedores para rastreabilidade
    colecao_solicitacoes.insert_one({
        "timestamp": ultima_atualizacao,
        "itens":     dados["itens"]
    })

    print(f"[{ultima_atualizacao}] Pedido salvo em pedidos_entrada: {len(dados['itens'])} item(s)")

    return jsonify({"ok": True, "mensagem": f"{len(dados['itens'])} item(s) enviados para o robô"}), 200


# ─────────────────────────────────────────────
# ROTA 4: Healthcheck
# ─────────────────────────────────────────────
@app.route('/status', methods=['GET'])
def status():
    estado = colecao_estado.find_one({"_id": ESTADO_ID}, {"_id": 0})
    return jsonify({
        "servidor":           "online",
        "mongodb":            "equipamentos_cotacao",
        "ultima_atualizacao": estado.get("ultima_atualizacao") if estado else None
    })


# ─────────────────────────────────────────────
# INICIALIZAÇÃO
# ─────────────────────────────────────────────
if __name__ == '__main__':
    port  = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"

    print("=" * 50)
    print("  Servidor Automação de Compras TI (MongoDB Ativo)")
    print(f"  Banco: equipamentos_cotacao")
    print(f"  Rodando em http://0.0.0.0:{port}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=port, debug=debug)