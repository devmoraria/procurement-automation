"""
server.py - Backend da Automação de Compras TI
Grupo 1 - UiPath + Copa do Mundo BR + MongoDB

Como rodar localmente:
    pip install flask flask-cors pymongo certifi python-dotenv requests
    python server.py

Variáveis de ambiente (.env):
    MONGO_URI            -> URI de conexão do MongoDB Atlas
    PORT                 -> Porta do servidor (padrão 5000)
    SERVER_ORIGIN        -> URL do front-end para restringir CORS
    FLASK_DEBUG          -> true/false (padrão false)
    UIPATH_CLIENT_ID     -> App ID da External Application no UiPath Cloud
    UIPATH_CLIENT_SECRET -> App Secret gerado no UiPath Cloud
    UIPATH_ORG_ID        -> ID/slug da organização (ex: proajizvujd)
    UIPATH_TENANT        -> Nome do tenant (ex: DefaultTenant)
    UIPATH_RELEASE_KEY   -> Release Key do processo no Orchestrator
    UIPATH_FOLDER_ID     -> ID numérico da pasta no Orchestrator
    USE_MOCK             -> true = não dispara o robô, usa dados já no MongoDB
                           false = dispara o robô via API (padrão)

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
import threading
import requests as http_requests
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


# ─────────────────────────────────────────────
# CONFIGURAÇÃO UIPATH
# ─────────────────────────────────────────────
UIPATH_CLIENT_ID     = os.environ.get("UIPATH_CLIENT_ID", "")
UIPATH_CLIENT_SECRET = os.environ.get("UIPATH_CLIENT_SECRET", "")
UIPATH_ORG_ID        = os.environ.get("UIPATH_ORG_ID", "")
UIPATH_TENANT        = os.environ.get("UIPATH_TENANT", "DefaultTenant")
UIPATH_RELEASE_KEY   = os.environ.get("UIPATH_RELEASE_KEY", "")
UIPATH_FOLDER_ID     = os.environ.get("UIPATH_FOLDER_ID", "")

# ─────────────────────────────────────────────
# MODO MOCK
# true  → não dispara o robô, usa dados já salvos no MongoDB
# false → dispara o robô via API do Orchestrator (padrão)
# ─────────────────────────────────────────────
USE_MOCK = os.environ.get("USE_MOCK", "false").lower() == "true"


def uipath_get_token():
    """Autentica na UiPath Cloud e retorna o access_token."""
    resp = http_requests.post(
        "https://cloud.uipath.com/identity_/connect/token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type":    "client_credentials",
            "client_id":     UIPATH_CLIENT_ID,
            "client_secret": UIPATH_CLIENT_SECRET,
            "scope":         "OR.Jobs OR.Jobs.Read OR.Jobs.Write",
        },
        timeout=15
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def uipath_disparar_job():
    """
    Obtém token e dispara o processo no Orchestrator.
    Roda em thread separada para não bloquear a resposta ao front-end.
    """
    try:
        token = uipath_get_token()
        print(f"[UiPath] Token obtido com sucesso.")

        url = (
            f"https://cloud.uipath.com/{UIPATH_ORG_ID}/{UIPATH_TENANT}"
            f"/orchestrator_/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs"
        )

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/json",
            "X-UIPATH-OrganizationUnitId": str(UIPATH_FOLDER_ID),
        }

        payload = {
            "startInfo": {
                "ReleaseKey": UIPATH_RELEASE_KEY,
                "JobsCount": 1,
                "JobPriority": "Normal",
                "Strategy": "ModernJobsCount",
                "ResumeOnSameContext": False,
                "RuntimeType": "Attended",
                "RunAsMe": True,
                "InputArguments": "{}"
            }
        }

        resp = http_requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()

        job_id = resp.json().get("value", [{}])[0].get("Id", "?")
        print(f"[UiPath] Job disparado com sucesso. Job ID: {job_id}")

        colecao_estado.update_one({"_id": ESTADO_ID}, {"$set": {
            "ultimo_log": f"Robô disparado às {datetime.now().strftime('%H:%M:%S')}. Job ID: {job_id}"
        }})

    except Exception as e:
        print(f"[UiPath] ERRO ao disparar job: {e}")
        colecao_estado.update_one({"_id": ESTADO_ID}, {"$set": {
            "status_robo": "Erro ao disparar",
            "alerta_erro": f"Falha ao comunicar com Orchestrator: {str(e)}",
            "ultimo_log":  f"Erro ao disparar robô às {datetime.now().strftime('%H:%M:%S')}: {str(e)}"
        }})


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
            fornecedores = cotacao.get("fornecedores", {}) or {}
            tem_preco = any(
                isinstance(f, dict) and f.get("preco") is not None
                for f in fornecedores.values()
            )
            cotacao["status"] = "completo" if tem_preco else "sem_resultado"

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

    colecao_estado.update_one({"_id": ESTADO_ID}, {"$set": {
        "status_robo":        "Em execução",
        "ultimo_log":         f"Nova solicitação recebida às {datetime.now().strftime('%H:%M:%S')}. {'Carregando dados do banco...' if USE_MOCK else 'Disparando robô...'}",
        "alerta_erro":        None,
        "ultima_atualizacao": ultima_atualizacao,
        "cotacoes":           cotacoes_pendentes,
    }}, upsert=True)

    colecao_solicitacoes.insert_one({
        "timestamp": ultima_atualizacao,
        "itens":     dados["itens"]
    })

    print(f"[{ultima_atualizacao}] Pedido salvo em pedidos_entrada: {len(dados['itens'])} item(s)")

    # ─── DISPARA O ROBÔ OU USA MOCK ───
    if USE_MOCK:
        print("[MOCK] Modo mock ativo — dados já estão no MongoDB, robô não será disparado.")
    else:
        thread = threading.Thread(target=uipath_disparar_job, daemon=True)
        thread.start()
    # ──────────────────────────────────

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
        "ultima_atualizacao": estado.get("ultima_atualizacao") if estado else None,
        "modo_mock":          USE_MOCK
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
    print(f"  Modo mock: {'ATIVO' if USE_MOCK else 'inativo'}")
    print(f"  Rodando em http://0.0.0.0:{port}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=port, debug=debug)