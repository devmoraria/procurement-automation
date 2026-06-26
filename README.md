# Automação de Compras TI — Grupo 1
## Como Fazer Funcionar (Passo a Passo)

---

## 🗂️ Estrutura de Arquivos

```
projeto/
├── index.html              ← Interface do usuário (abrir no navegador)
├── style.css               ← Estilos visuais
├── script.js               ← Lógica da página (faz polling no servidor)
├── server.py               ← Backend Python (Flask + MongoDB)
├── resultado_uipath.json   ← Arquivo de teste local (não sobe pro git)
└── .env                    ← Variáveis de ambiente (não sobe pro git)
```

---

## 🚀 Como Rodar Localmente

### 1. Instalar dependências Python
```bash
pip install flask flask-cors pymongo certifi python-dotenv
```

### 2. Configurar o banco de dados

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/
PORT=5000
FLASK_DEBUG=false
```

> Se não tiver um Atlas, use MongoDB local: `MONGO_URI=mongodb://localhost:27017/`

### 3. Iniciar o servidor
```bash
python server.py
```
Servidor sobe em `http://localhost:5000`

### 4. Abrir a interface
Abrir `index.html` no navegador. A página conecta ao servidor automaticamente.

> **Atenção:** atualize a constante `SERVER_URL` no topo do `script.js` se o endereço do servidor mudar.
> ```js
> const SERVER_URL = "http://localhost:5000"; // local
> // ou
> const SERVER_URL = "https://seu-servidor.onrender.com"; // hospedado
> ```

---

## ☁️ Como Hospedar o Servidor (ex: Render, Railway, Fly.io)

1. Suba o repositório no GitHub.
2. Crie um novo serviço Web apontando para o repositório.
3. Configure:
   - **Build command:** `pip install flask flask-cors pymongo certifi python-dotenv`
   - **Start command:** `python server.py`
4. Defina as variáveis de ambiente na plataforma:
   | Variável | Valor |
   |---|---|
   | `MONGO_URI` | URI do MongoDB Atlas |
   | `PORT` | definida automaticamente pela plataforma |
   | `SERVER_ORIGIN` | URL do front-end (restringe CORS) |
5. Copie a URL pública gerada e cole em `SERVER_URL` no `script.js`.

---

## 🤖 Instruções para UiPath Studio

O robô precisa fazer **duas coisas**:

### 1. LER a solicitação

Quando o usuário clica "Enviar Solicitação", o servidor salva o pedido no MongoDB e retorna os dados. O robô deve fazer um **GET** em `{SERVER_URL}/dados` para verificar se `status_robo` é `"Em execução"` e processar os itens em `cotacoes` com `"status": "pendente"`.

Exemplo do que o GET `/dados` retorna após uma solicitação:

```json
{
  "status_robo": "Em execução",
  "ultimo_log": "Nova solicitação recebida às 14:30:00. Iniciando pesquisa...",
  "cotacoes": [
    {
      "item": "Dell Inspiron 15 3530",
      "desc": "SSD 512GB, 16GB RAM",
      "qtd": 1,
      "fornecedor": "",
      "preco": null,
      "link": "",
      "status": "pendente"
    }
  ]
}
```

> O robô deve pesquisar **apenas** os itens com `"status": "pendente"`, ignorando os que já estão `"completo"`.

### 2. ENVIAR os resultados

Após pesquisar, o robô faz um **HTTP POST** para `{SERVER_URL}/resultado` com este JSON:

```json
{
  "status_robo": "Concluído",
  "ultimo_log": "Pesquisa finalizada. 2 itens cotados com sucesso.",
  "alerta_erro": null,
  "performance_roi": {
    "tempo_manual": 32,
    "tempo_robo": 2.5,
    "horas_poupadas": 29.5,
    "economia_financeira_brl": 1850.30
  },
  "cotacoes": [
    {
      "item": "Notebook Dell",
      "desc": "Inspiron 15 3530 - SSD 512GB, 16GB RAM",
      "qtd": 1,
      "fornecedor": "Kabum",
      "preco": 3499.90,
      "link": "https://www.kabum.com.br/produto/exemplo-dell",
      "status": "completo"
    },
    {
      "item": "Notebook Lenovo",
      "desc": "ThinkPad E14 - SSD 256GB, 8GB RAM",
      "qtd": 2,
      "fornecedor": "Pichau",
      "preco": 2899.00,
      "link": "https://www.pichau.com.br/produto/exemplo-lenovo",
      "status": "completo"
    }
  ]
}
```

> **Campo `status` nas cotações** — obrigatório para o dashboard funcionar corretamente:
> | Valor | Significado |
> |---|---|
> | `"pendente"` | Item ainda não foi pesquisado pelo robô |
> | `"completo"` | Item pesquisado, preço e fornecedor preenchidos |

> **Campos obrigatórios em `performance_roi`:**
> | Campo | Tipo | Descrição |
> |---|---|---|
> | `tempo_manual` | número | Horas/mês do processo manual |
> | `tempo_robo` | número | Horas/mês com o robô |
> | `horas_poupadas` | número | Diferença entre os dois |
> | `economia_financeira_brl` | número | Economia em R$ |

No UiPath Studio, usar a activity **HTTP Request**:
- Method: `POST`
- URL: `{SERVER_URL}/resultado`
- Body format: `application/json`
- Body: o JSON acima com os dados reais da pesquisa

---

## 🔄 Fluxo Completo

```
[Usuário preenche form]
    → POST /solicitacao → MongoDB salva pedido, cotações ficam "pendente"

[UiPath faz GET /dados]
    → Lê itens com status "pendente"
    → Pesquisa nos fornecedores
    → POST /resultado com status "completo" em cada cotação

[Front-end faz GET /dados a cada 5s]
    → Detecta mudança → Atualiza Dashboard ao vivo
    → Badge muda de ⏳ Pendente para ✔ Completo por item
```

---

## 🧪 Testar sem o UiPath

### Linux / Mac
```bash
curl -X POST http://localhost:5000/resultado \
  -H "Content-Type: application/json" \
  -d '{
    "status_robo": "Concluído",
    "ultimo_log": "Pesquisa finalizada. Notebook encontrado na Kabum por R$ 3.499,90.",
    "alerta_erro": null,
    "performance_roi": {
      "tempo_manual": 32,
      "tempo_robo": 2.5,
      "horas_poupadas": 29.5,
      "economia_financeira_brl": 1850.30
    },
    "cotacoes": [
      {
        "item": "Notebook Dell",
        "desc": "Inspiron 15 3530 - SSD 512GB, 16GB RAM",
        "qtd": 1,
        "fornecedor": "Kabum",
        "preco": 3499.90,
        "link": "https://www.kabum.com.br/produto/exemplo-dell",
        "status": "completo"
      }
    ]
  }'
```

### Windows (PowerShell)

> ⚠️ O PowerShell salva arquivos com BOM (byte order mark) por padrão, o que quebra o parser JSON do Flask. Use sempre `WriteAllText` para garantir UTF-8 sem BOM:

```powershell
$json = @'
{
  "status_robo": "Concluido",
  "ultimo_log": "Pesquisa finalizada com sucesso. 1 item(s) cotado.",
  "alerta_erro": null,
  "performance_roi": {
    "tempo_manual": 32,
    "tempo_robo": 2.5,
    "horas_poupadas": 29.5,
    "economia_financeira_brl": 1850.30
  },
  "cotacoes": [
    {
      "item": "Notebook Dell",
      "desc": "Inspiron 15 3530 - SSD 512GB, 16GB RAM",
      "qtd": 1,
      "fornecedor": "Kabum",
      "preco": 3499.90,
      "link": "https://www.kabum.com.br/produto/exemplo-dell",
      "status": "completo"
    }
  ]
}
'@

[System.IO.File]::WriteAllText("$PWD\resultado_uipath.json", $json, [System.Text.UTF8Encoding]::new($false))

$body = Get-Content resultado_uipath.json -Raw
Invoke-RestMethod -Uri "http://localhost:5000/resultado" -Method Post -ContentType "application/json" -Body $body
```

> **Por que não usar `curl` no PowerShell?** O `curl` no Windows é um alias do `Invoke-WebRequest` e tem comportamento diferente do curl real. Use sempre `Invoke-RestMethod` como no exemplo acima.

---

## 👥 Time — Grupo 1

<div align="center">

### 🏆 Escalação do Grupo 1 — Copa do Mundo 2026

<table border="0" cellspacing="0" cellpadding="10">

  <!-- Capitão -->
  <tr>
    <td width="130"></td>
    <td width="130" align="center">
      <a href="https://github.com/devmoraria">
        <img src="https://github.com/devmoraria.png" width="80"/><br/>
        <b>Cauan Morária</b><br/>
        <sub>🏳️ Product Owner · Capitão</sub>
      </a>
    </td>
    <td width="130"></td>
  </tr>

  <!-- Meio-campo -->
  <tr>
    <td width="130" align="center">
      <a href="https://github.com/herick-oak">
        <img src="https://github.com/herick-oak.png" width="80"/><br/>
        <b>Herick</b><br/>
        <sub>🎯 Analista de Negócios</sub>
      </a>
    </td>
    <td width="130"></td>
    <td width="130" align="center">
      <a href="https://github.com/viktor-wilker">
        <img src="https://github.com/viktor-wilker.png" width="80"/><br/>
        <b>Victor Wilker</b><br/>
        <sub>⭐ Dev Líder · Camisa 10</sub>
      </a>
    </td>
  </tr>

  <!-- Atacantes -->
  <tr>
    <td width="130" align="center">
      <a href="https://github.com/janderson-campos">
        <img src="https://github.com/janderson-campos.png" width="80"/><br/>
        <b>Janderson</b><br/>
        <sub>⚽ Desenvolvedor · Camisa 9</sub>
      </a>
    </td>
    <td width="130"></td>
    <td width="130" align="center">
      <a href="https://github.com/Diogo0Melo">
        <img src="https://github.com/Diogo0Melo.png" width="80"/><br/>
        <b>Diogo</b><br/>
        <sub>🏃 Desenvolvedor · Camisa 7</sub>
      </a>
    </td>
  </tr>

  <!-- Suporte -->
  <tr>
    <td width="130" align="center">
      <a href="https://github.com/Kayansouza">
        <img src="https://github.com/Kayansouza.png" width="80"/><br/>
        <b>Richard Kayan</b><br/>
        <sub>🛡️ Testes e Validação</sub>
      </a>
    </td>
    <td width="130" align="center">
      <a href="https://github.com/bendominique">
        <img src="https://github.com/bendominique.png" width="80"/><br/>
        <b>Benjamin</b><br/>
        <sub>📋 Documentação</sub>
      </a>
    </td>
    <td width="130" align="center">
      <a href="https://github.com/Juliac-silva">
        <img src="https://github.com/Juliac-silva.png" width="80"/><br/>
        <b>Julia</b><br/>
        <sub>🎬 Criação de Slides</sub>
      </a>
    </td>
  </tr>

</table>

</div>

---

## 📝 .gitignore recomendado

```
resultado_uipath.json
solicitacao.json
__pycache__/
*.pyc
.env
```
