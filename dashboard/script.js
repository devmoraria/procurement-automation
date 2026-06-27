// ─────────────────────────────────────────────
// script.js — Automação de Compras TI | Grupo 1
// ─────────────────────────────────────────────

const SERVER_URL = "https://procurement-automation-7seb.onrender.com";

// Histórico local
const historicoLocal = [];

// ─── i18n ─────────────────────────────────────
const TRANSLATIONS = {
    pt: {
        "brand":                "Automação de Compras",
        "menu.dashboard":       "Dashboard",
        "menu.nova":            "Nova Solicitação",
        "menu.historico":       "Histórico",
        "menu.config":          "Configurações",
        "topbar.title":         "Painel de Controle",
        "topbar.badge":         "Sistema Ativo",
        "dash.h2":              "Métricas de ROI e Economia",
        "dash.p":               "Resultados financeiros consolidados em tempo real pelo robô UiPath.",
        "dash.export":          "Exportar Relatório PDF",
        "dash.robot.title":     "Monitoramento do Robô UiPath",
        "kpi.economia":         "Economia Total (ROI)",
        "kpi.horas":            "Horas Poupadas / Mês",
        "kpi.manual":           "Processo Manual",
        "kpi.robo":             "Com UiPath",
        "chart.title":          "Eficiência de Tempo",
        "table.title":          "Melhores Ofertas Encontradas",
        "table.sub":            "Preços ordenados do mais barato ao mais caro por item.",
        "col.item":             "Item",
        "col.spec":             "Especificação",
        "col.qty":              "Qtd",
        "col.supplier":         "Fornecedor",
        "col.price":            "Menor Preço",
        "col.status":           "Status",
        "nova.h2":              "Solicitação de Equipamentos",
        "nova.p":               "Preencha a tabela com os itens. O robô pesquisará os melhores preços automaticamente.",
        "col.num":              "#",
        "col.brand":            "Marca",
        "col.model":            "Modelo",
        "col.qty2":             "Qtd",
        "col.specs":            "Especificações",
        "btn.addrow":           "Adicionar linha",
        "btn.clear":            "Limpar",
        "btn.send":             "Enviar Solicitação",
        "widget.title":         "O que acontece depois?",
        "step1":                "Os itens são enviados ao servidor.",
        "step2":                "O robô UiPath lê e inicia a pesquisa.",
        "step3":                "Cada fornecedor é consultado automaticamente.",
        "step4":                "Os resultados são enviados de volta.",
        "step5":                "O Dashboard atualiza em tempo real.",
        "fluxo.title":          "Fluxo do Processo",
        "fluxo1.title":         "1. Entrada de Dados",
        "fluxo1.p":             "Funcionário preenche os itens na interface.",
        "fluxo2.title":         "2. Servidor Python",
        "fluxo2.p":             "server.py recebe e salva a solicitação.",
        "fluxo3.title":         "3. Robô UiPath",
        "fluxo3.p":             "Lê a solicitação e pesquisa nos fornecedores.",
        "fluxo4.title":         "4. Envio do Resultado",
        "fluxo4.p":             "UiPath faz POST dos dados ao servidor.",
        "fluxo5.title":         "5. Dashboard ao Vivo",
        "fluxo5.p":             "Tela atualiza automaticamente com os preços.",
        "hist.h2":              "Histórico de Solicitações",
        "hist.p":               "Consulte o status das automações executadas.",
        "col.datetime":         "Data/Hora",
        "col.items":            "Itens",
        "col.hstatus":          "Status",
        "col.by":               "Enviado por",
        "config.h2":            "Configurações",
        "config.p":             "Personalize o sistema conforme suas preferências.",
        "config.appearance":    "Aparência",
        "config.darkmode":      "Modo Escuro",
        "config.lang":          "Idioma / Language",
        "config.org":           "Organização",
        "config.dept":          "Nome do Departamento",
        "config.valorhora":     "Valor/Hora (R$) para ROI",
        "config.suppliers":     "Fornecedores Prioritários",
        "config.suppliers.hint":"O robô priorizará esses fornecedores na pesquisa de preços.",
        "btn.save":             "Salvar Configurações",
        "config.tour":          "Tour Guiado",
        "config.tour.label":    "Reiniciar o tour de boas-vindas",
        "btn.tour":             "Iniciar Tour",
        "json.title":           "Formato JSON — POST /resultado (UiPath → Servidor)",
        "json.badge":           "Referência para o Robô",
        "json.desc":            "O robô UiPath deve enviar um POST para /resultado com o corpo abaixo. Os campos status de cada cotação são preenchidos automaticamente pelo servidor se omitidos.",
        "json.f.status_robo":   "Ex: \"Concluído\" — aparece no badge de monitoramento.",
        "json.f.ultimo_log":    "Mensagem exibida no console do robô em tempo real.",
        "json.f.alerta_erro":   "Null se sem erros. Texto do erro se houver falha.",
        "json.f.roi":           "tempo_manual, tempo_robo, horas_poupadas (em hrs).",
        "json.cot.title":       "Estrutura de cada cotação em cotacoes[]:",
        "json.copy":            "Copiar",
        "json.note1":           "O campo status por cotação é opcional — o servidor detecta automaticamente.",
        "json.note2":           "Chaves de fornecedor: kabum, pichau, terabyte, amazon, mercadolivre, magazineluiza, dell, lenovo.",
    },
    en: {
        "brand":                "Procurement Automation",
        "menu.dashboard":       "Dashboard",
        "menu.nova":            "New Request",
        "menu.historico":       "History",
        "menu.config":          "Settings",
        "topbar.title":         "Control Panel",
        "topbar.badge":         "System Active",
        "dash.h2":              "ROI & Savings Metrics",
        "dash.p":               "Consolidated financial results in real time by the UiPath robot.",
        "dash.export":          "Export PDF Report",
        "dash.robot.title":     "UiPath Robot Monitoring",
        "kpi.economia":         "Total Savings (ROI)",
        "kpi.horas":            "Hours Saved / Month",
        "kpi.manual":           "Manual Process",
        "kpi.robo":             "With UiPath",
        "chart.title":          "Time Efficiency",
        "table.title":          "Best Offers Found",
        "table.sub":            "Prices ordered from cheapest to most expensive per item.",
        "col.item":             "Item",
        "col.spec":             "Specification",
        "col.qty":              "Qty",
        "col.supplier":         "Supplier",
        "col.price":            "Best Price",
        "col.status":           "Status",
        "nova.h2":              "Equipment Request",
        "nova.p":               "Fill in the table with items. The robot will search for the best prices automatically.",
        "col.num":              "#",
        "col.brand":            "Brand",
        "col.model":            "Model",
        "col.qty2":             "Qty",
        "col.specs":            "Specifications",
        "btn.addrow":           "Add row",
        "btn.clear":            "Clear",
        "btn.send":             "Submit Request",
        "widget.title":         "What happens next?",
        "step1":                "Items are sent to the server.",
        "step2":                "The UiPath robot reads and starts searching.",
        "step3":                "Each supplier is consulted automatically.",
        "step4":                "Results are sent back.",
        "step5":                "The Dashboard updates in real time.",
        "fluxo.title":          "Process Flow",
        "fluxo1.title":         "1. Data Entry",
        "fluxo1.p":             "Employee fills in items in the interface.",
        "fluxo2.title":         "2. Python Server",
        "fluxo2.p":             "server.py receives and saves the request.",
        "fluxo3.title":         "3. UiPath Robot",
        "fluxo3.p":             "Reads the request and searches suppliers.",
        "fluxo4.title":         "4. Result Submission",
        "fluxo4.p":             "UiPath POSTs data back to the server.",
        "fluxo5.title":         "5. Live Dashboard",
        "fluxo5.p":             "Screen updates automatically with prices.",
        "hist.h2":              "Request History",
        "hist.p":               "Check the status of executed automations.",
        "col.datetime":         "Date/Time",
        "col.items":            "Items",
        "col.hstatus":          "Status",
        "col.by":               "Submitted by",
        "config.h2":            "Settings",
        "config.p":             "Customize the system to your preferences.",
        "config.appearance":    "Appearance",
        "config.darkmode":      "Dark Mode",
        "config.lang":          "Language / Idioma",
        "config.org":           "Organization",
        "config.dept":          "Department Name",
        "config.valorhora":     "Hourly Rate (R$) for ROI",
        "config.suppliers":     "Priority Suppliers",
        "config.suppliers.hint":"The robot will prioritize these suppliers when searching for prices.",
        "btn.save":             "Save Settings",
        "config.tour":          "Guided Tour",
        "config.tour.label":    "Restart the welcome tour",
        "btn.tour":             "Start Tour",
        "json.title":           "JSON Format — POST /resultado (UiPath → Server)",
        "json.badge":           "Robot Reference",
        "json.desc":            "The UiPath robot must send a POST to /resultado with the body below. The status field per quotation is filled automatically by the server if omitted.",
        "json.f.status_robo":   "e.g. \"Concluído\" — shown on the monitoring badge.",
        "json.f.ultimo_log":    "Message shown in the robot console in real time.",
        "json.f.alerta_erro":   "Null if no errors. Error text if a failure occurred.",
        "json.f.roi":           "tempo_manual, tempo_robo, horas_poupadas (in hrs).",
        "json.cot.title":       "Structure of each entry in cotacoes[]:",
        "json.copy":            "Copy",
        "json.note1":           "The status field per quotation is optional — the server auto-detects it.",
        "json.note2":           "Supplier keys: kabum, pichau, terabyte, amazon, mercadolivre, magazineluiza, dell, lenovo.",
    }
};

let currentLang = localStorage.getItem('lang') || 'pt';

function t(key) {
    return (TRANSLATIONS[currentLang] || TRANSLATIONS.pt)[key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (val) el.textContent = val;
    });

    // Sync lang pill UI
    ['pt','en'].forEach(lang => {
        const pill = document.getElementById('pill-' + lang);
        const settingsPill = document.getElementById('settings-pill-' + lang);
        if (pill)         pill.classList.toggle('active', lang === currentLang);
        if (settingsPill) settingsPill.classList.toggle('active', lang === currentLang);
    });
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    // Re-render histórico para aplicar textos traduzidos
    renderizarHistorico();
}

// ─── Dark Mode ────────────────────────────────
function toggleDarkMode(enabled) {
    document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    localStorage.setItem('darkMode', enabled ? '1' : '0');
    // Sincroniza o toggle no checkbox
    const tog = document.getElementById('toggle-dark');
    if (tog) tog.checked = enabled;
}

// ─── Configurações ────────────────────────────
const FORNECEDORES_PADRAO = [
    { id: 'kabum',       nome: 'KaBuM!' },
    { id: 'pichau',      nome: 'Pichau' },
    { id: 'terabyte',    nome: 'Terabyte Shop' },
    { id: 'amazon',      nome: 'Amazon BR' },
    { id: 'mercadolivre',nome: 'Mercado Livre' },
    { id: 'magazineluiza',nome: 'Magazine Luiza' },
    { id: 'dell',        nome: 'Dell Direct' },
    { id: 'lenovo',      nome: 'Lenovo Store' },
];

function carregarConfiguracoes() {
    const cfg = JSON.parse(localStorage.getItem('config') || '{}');

    // Fornecedores
    const selecionados = cfg.fornecedores || ['kabum','pichau','terabyte','amazon'];
    const grid = document.getElementById('fornecedores-grid');
    if (grid) {
        grid.innerHTML = FORNECEDORES_PADRAO.map(f => `
            <label class="forn-chip ${selecionados.includes(f.id) ? 'selected' : ''}" data-id="${f.id}">
                <input type="checkbox" ${selecionados.includes(f.id) ? 'checked' : ''} onchange="toggleFornecedor(this); salvarConfiguracoes()">
                ${f.nome}
            </label>
        `).join('');
    }
}

function toggleFornecedor(checkbox) {
    checkbox.closest('.forn-chip').classList.toggle('selected', checkbox.checked);
}

function salvarConfiguracoes() {
    const fornSelecionados = [...document.querySelectorAll('.forn-chip input:checked')]
                              .map(cb => cb.closest('.forn-chip').dataset.id);

    const cfg = { 
        dept: 'Suprimentos de TI', 
        valorHora: 90, 
        fornecedores: fornSelecionados 
    };
    localStorage.setItem('config', JSON.stringify(cfg));
}

// ─── Navegação Sidebar ────────────────────────
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    
    const targetView = document.getElementById('view-' + viewId);
    const targetMenu = document.getElementById('menu-' + viewId);
    
    if (targetView) targetView.classList.add('active');
    if (targetMenu) targetMenu.classList.add('active');
}

// ─── Tabela de Input ──────────────────────────
function addNewRow() {
    const tbody = document.getElementById('dynamic-input-table').getElementsByTagName('tbody')[0];
    const rowCount = tbody.rows.length + 1;
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control">
                <option>Dell</option><option>Lenovo</option>
                <option>HP</option><option>Apple</option><option>Asus</option>
            </select>
        </td>
        <td><input type="text" class="form-control" placeholder="Ex: ThinkPad E14..."></td>
        <td><input type="number" class="form-control" value="1" min="1"></td>
        <td><input type="text" class="form-control" placeholder="Ex: 16GB RAM, SSD 512GB..."></td>
        <td><button class="btn-delete" onclick="deleteRow(this)"><i class="fa-solid fa-trash"></i></button></td>
    `;
}

function deleteRow(btn) {
    btn.closest('tr').remove();
    reorderRows();
}

function reorderRows() {
    const rows = document.getElementById('dynamic-input-table').getElementsByTagName('tbody')[0].rows;
    for (let i = 0; i < rows.length; i++) rows[i].cells[0].innerText = i + 1;
}

function clearForm() {
    document.querySelectorAll('#dynamic-input-table input').forEach(i => i.value = '');
    document.querySelectorAll('#dynamic-input-table select').forEach(s => s.selectedIndex = 0);
}

// ─── Enviar Solicitação ───────────────────────
async function enviarSolicitacao() {
    const rows = document.getElementById('dynamic-input-table').getElementsByTagName('tbody')[0].rows;
    if (rows.length === 0) { alert("Adicione pelo menos um item antes de enviar."); return; }

    const itens = [];
    for (let row of rows) {
        const marca  = row.cells[1].querySelector('select').value;
        const modelo = row.cells[2].querySelector('input').value.trim();
        const qtd    = parseInt(row.cells[3].querySelector('input').value) || 1;
        const obs    = row.cells[4].querySelector('input').value.trim();
        if (!modelo) { alert(`Preencha o modelo na linha ${row.cells[0].innerText}.`); return; }
        itens.push({ marca, modelo, quantidade: qtd, observacoes: obs });
    }

    const btnEnviar = document.getElementById('btn-enviar');
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    }

    try {
        const response = await fetch(`${SERVER_URL}/solicitacao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itens })
        });
        const resultado = await response.json();
        if (response.ok) {
            historicoLocal.unshift({
                data: new Date().toLocaleString('pt-BR'),
                itens: itens.length,
                status: 'Em execução'
            });
            renderizarHistorico();
            switchView('dashboard');
            ultimoLog = "";
            appendLog(`✅ ${resultado.mensagem} Robô iniciando pesquisa...`);
            carregarDadosAutomacao();
        } else {
            alert("Erro: " + resultado.erro);
        }
    } catch (err) {
        alert("Não foi possível conectar ao servidor. Verifique se o server.py está rodando.");
    } finally {
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('btn.send')}`;
        }
    }
}

// ─── Histórico ────────────────────────────────
function renderizarHistorico() {
    const tbody = document.getElementById('historico-body');
    if (!tbody) return;
    const dept = (JSON.parse(localStorage.getItem('config') || '{}')).dept || 'Suprimentos de TI';

    if (historicoLocal.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">
            ${currentLang === 'en' ? 'No requests submitted yet.' : 'Nenhuma solicitação enviada ainda.'}
        </td></tr>`;
        return;
    }
    tbody.innerHTML = historicoLocal.map(h => {
        const isDone = h.status === 'Concluído' || h.status === 'Done';
        const statusLabel = currentLang === 'en'
            ? (isDone ? 'Done' : 'Running')
            : (isDone ? 'Concluído' : 'Em execução');
        return `<tr>
            <td>${h.data}</td>
            <td>${h.itens} item(s)</td>
            <td><span class="status-badge" style="${isDone ? '' : 'background:#fff3cd;color:#856404;'}">${statusLabel}</span></td>
            <td>${dept}</td>
        </tr>`;
    }).join('');
}

// ─── Console do Robô ──────────────────────────
function appendLog(mensagem) {
    const el = document.getElementById('robot-console');
    if (!el) return;
    const hora = new Date().toLocaleTimeString('pt-BR');
    el.innerHTML += `\n[${hora}] ${mensagem}`;
    el.scrollTop = el.scrollHeight;
}

// ─── Gráfico ──────────────────────────────────
let meuGrafico = null;

function renderizarGrafico(manual, robo) {
    const chartEl = document.getElementById('dashboardChart');
    if (!chartEl) return;
    const ctx = chartEl.getContext('2d');
    if (meuGrafico) meuGrafico.destroy();
    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [t('kpi.manual'), t('kpi.robo')],
            datasets: [{ data: [manual, robo], backgroundColor: ['#002776', '#ffdf00'], borderRadius: 6 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw} hrs/mês` } } },
            scales: { y: { beginAtZero: true, ticks: { callback: v => v + 'h' } } }
        }
    });
}

// ─── KPI Cards ───────────────────────────────
function atualizarKPIs(roi) {
    const cfg        = JSON.parse(localStorage.getItem('config') || '{}');
    const valorHora  = parseFloat(cfg.valorHora) || 90;
    const economia   = (roi.horas_poupadas || 0) * valorHora;

    const elEcon = document.getElementById('kpi-economia');
    const elHoras = document.getElementById('kpi-horas-poupadas');
    const elManual = document.getElementById('kpi-manual');
    const elRobo = document.getElementById('kpi-robo');

    if (elEcon) elEcon.innerText = `R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (elHoras) elHoras.innerText = `${roi.horas_poupadas} hrs`;
    if (elManual) elManual.innerText = `${roi.tempo_manual} hrs/mês`;
    if (elRobo) elRobo.innerText = `${roi.tempo_robo} hrs/mês`;
}

// ─── Badge status ─────────────────────────────
function badgeStatus(status) {
    if (status === 'completo') {
        return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;
            background:#e6f4ea;color:#137333;font-size:11px;font-weight:600;">
            ✔ ${currentLang === 'en' ? 'Done' : 'Completo'}
        </span>`;
    }
    if (status === 'sem_resultado') {
        return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;
            background:#fce8e6;color:#c5221f;font-size:11px;font-weight:600;">
            ✖ ${currentLang === 'en' ? 'Not found' : 'Não encontrado'}
        </span>`;
    }
    return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;
        background:#fff3cd;color:#856404;font-size:11px;font-weight:600;">
        ${currentLang === 'en' ? 'Pending' : 'Pendente'}
    </span>`;
}

// Nomes de exibição para cada chave de fornecedor retornada pelo robô
const NOMES_FORNECEDORES = {
    kabum:        'KaBuM!',
    pichau:       'Pichau',
    terabyte:     'Terabyte Shop',
    amazon:       'Amazon BR',
    mercadolivre: 'Mercado Livre',
    magazineluiza:'Magazine Luiza',
    dell:         'Dell Direct',
    lenovo:       'Lenovo Store',
};

function nomeFornecedor(chave) {
    return NOMES_FORNECEDORES[chave] || chave;
}

// ─── Popover de comparação de ofertas (tabela do dashboard) ──
function toggleOfertaPopover(event, popoverId) {
    event.stopPropagation();
    const popover = document.getElementById(popoverId);
    if (!popover) return;
    const jaAberto = popover.classList.contains('open');
    // Fecha qualquer outro popover aberto antes de abrir o novo
    document.querySelectorAll('.cot-popover.open').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.cot-mais-ofertas.open').forEach(b => b.classList.remove('open'));
    if (!jaAberto) {
        popover.classList.add('open');
        event.currentTarget.classList.add('open');
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.cot-fornecedor-cell')) {
        document.querySelectorAll('.cot-popover.open').forEach(p => p.classList.remove('open'));
        document.querySelectorAll('.cot-mais-ofertas.open').forEach(b => b.classList.remove('open'));
    }
});

// ─── Polling ─────────────────────────────────
let ultimoLog = "";
let ultimasCotacoes = "";

async function carregarDadosAutomacao() {
    const statusBadge = document.getElementById('robot-status');
    if (!statusBadge) return;
    
    try {
        appendLog("🔄 Consultando servidor...");
        const resposta = await fetch(`${SERVER_URL}/dados`);
        appendLog(`📡 Servidor respondeu: ${resposta.status}`);
        const dados = await resposta.json();
        appendLog(`📦 status_robo: ${dados.status_robo} | cotacoes: ${dados.cotacoes?.length ?? 0} | log: ${dados.ultimo_log}`);

        if (dados.ultimo_log !== ultimoLog) {
            appendLog("🔁 Log mudou — atualizando dashboard...");


            if (dados.alerta_erro) {
                statusBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${currentLang === 'en' ? 'Error detected' : 'Erro detectado'}`;
                statusBadge.style.cssText = "background:#fce8e6;color:#c5221f;";
            } else {
                const emExecucao = dados.status_robo === "Em execução";
                statusBadge.innerHTML = emExecucao
                    ? `<i class="fa-solid fa-circle-notch fa-spin"></i> ${currentLang === 'en' ? 'Running' : dados.status_robo}`
                    : `<i class="fa-solid fa-circle-check"></i> ${currentLang === 'en' ? 'Idle' : dados.status_robo}`;
                statusBadge.style.cssText = emExecucao
                    ? "background:#fff3cd;color:#856404;"
                    : "background:#e6f4ea;color:#137333;";
            }

            appendLog(dados.ultimo_log);
            atualizarKPIs(dados.performance_roi);
            renderizarGrafico(dados.performance_roi.tempo_manual, dados.performance_roi.tempo_robo);

            const tbody = document.getElementById('dashboard-table-body');
            if (tbody) {
                const cotacoesMudaram = JSON.stringify(dados.cotacoes) !== ultimasCotacoes;
                if (!cotacoesMudaram && dados.ultimo_log === ultimoLog) return;
                ultimasCotacoes = JSON.stringify(dados.cotacoes);

                const comparacoesAbertas = [];
                document.querySelectorAll('.btn-comparar.ativo').forEach(btn => {
                    comparacoesAbertas.push(btn.id.replace('btn-comp-', ''));
                });

                tbody.innerHTML = "";

                if (dados.cotacoes && dados.cotacoes.length > 0) {
                    dados.cotacoes.forEach((cotacao, idx) => {
                        const nomeItem     = cotacao.item || '';
                        const especificacao = cotacao.desc || '';
                        const quantidade   = cotacao.qtd || 1;
                        const statusItem   = (cotacao.status || "pendente").toLowerCase();

                        // Monta lista de ofertas ordenada por preço
                        const fornecedores = cotacao.fornecedores || {};
                        const ofertas = Object.keys(fornecedores)
                            .map(chave => ({
                                chave,
                                nome:  nomeFornecedor(chave),
                                preco: fornecedores[chave]?.preco ?? null,
                                link:  fornecedores[chave]?.link  ?? ""
                            }))
                            .filter(o => o.preco != null)
                            .sort((a, b) => a.preco - b.preco);

                        const melhor      = ofertas[0] || null;
                        const maiorPreco  = ofertas.length ? ofertas[ofertas.length - 1].preco : 0;
                        const temCompar   = ofertas.length >= 2;

                        // ── Coluna Fornecedor (só melhor + link) ──
                        let fornecedorExibido;
                        if (melhor) {
                            const linkIcon = melhor.link
                                ? `<a class="cot-fornecedor-link" href="${melhor.link}" target="_blank">↗</a>`
                                : "";
                            fornecedorExibido = `
                                <div class="cot-fornecedor-principal">
                                    <span class="dot"></span> ${melhor.nome}${linkIcon}
                                </div>`;
                        } else {
                            fornecedorExibido = `<span class="cot-vazio">${
                                statusItem === 'sem_resultado'
                                    ? (currentLang === 'en' ? 'No offers found' : 'Nenhuma oferta encontrada')
                                    : (currentLang === 'en' ? 'Waiting…' : 'Aguardando…')
                            }</span>`;
                        }

                        // ── Menor preço exibido ──
                        const precoExibido = melhor
                            ? `<span class="cot-preco">R$ ${melhor.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>`
                            : `<span class="cot-preco-vazio">—</span>`;

                        // ── Botão comparar ──
                        const btnCompar = temCompar
                            ? `<button class="btn-comparar" id="btn-comp-${idx}" onclick="toggleComparacao(${idx})">
                                   <i class="fa-solid fa-chart-bar"></i>
                                   <span>${currentLang === 'en' ? 'Compare' : 'Comparar'}</span>
                                   <i class="fa-solid fa-chevron-down comp-chev"></i>
                               </button>`
                            : '';

                        // ── Linha principal ──
                        const linhaClasse = statusItem === 'sem_resultado' ? 'cot-row-sem-resultado' : '';
                        tbody.innerHTML += `<tr class="cot-main-row ${linhaClasse}" id="cot-row-${idx}">
                            <td><div class="cot-item-nome">${nomeItem}</div></td>
                            <td>${especificacao ? `<span class="cot-item-desc">${especificacao}</span>` : '<span class="cot-preco-vazio">—</span>'}</td>
                            <td>${quantidade}</td>
                            <td>${fornecedorExibido}</td>
                            <td>${precoExibido}</td>
                            <td>${badgeStatus(statusItem)}</td>
                            <td>${btnCompar}</td>
                        </tr>`;

                        // ── Linha de comparação (oculta por padrão) ──
                        if (temCompar) {
                            const melhorPreco = melhor.preco;

                            const barras = ofertas.map((o, i) => {
                                const isMelhor   = i === 0;
                                const pctBar     = maiorPreco > melhorPreco
                                    ? Math.round(30 + ((o.preco - melhorPreco) / (maiorPreco - melhorPreco)) * 70)
                                    : 100;
                                const pctAcima   = isMelhor ? 0 : Math.round(((o.preco - melhorPreco) / melhorPreco) * 100);
                                const economia   = maiorPreco - o.preco;
                                const barColor   = isMelhor ? 'var(--green)'
                                    : pctAcima <= 5  ? '#e6a817'
                                    : pctAcima <= 15 ? '#d47200'
                                    :                  '#c5221f';
                                const linkBtn    = o.link
                                    ? `<a class="comp-link-btn" href="${o.link}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                                    : '';
                                const badge      = isMelhor
                                    ? `<span class="comp-badge melhor">${currentLang === 'en' ? '✔ Best price' : '✔ Melhor preço'}</span>`
                                    : `<span class="comp-badge acima">+${pctAcima}%</span>`;

                                return `
                                <div class="comp-row">
                                    <div class="comp-forn-nome">${o.nome}${badge}</div>
                                    <div class="comp-bar-wrap">
                                        <div class="comp-bar" style="width:${pctBar}%;background:${barColor};"></div>
                                    </div>
                                    <div class="comp-preco-col">
                                        <span class="comp-preco ${isMelhor ? 'melhor' : ''}">
                                            R$ ${o.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                        ${linkBtn}
                                    </div>
                                </div>`;
                            }).join('');

                            const econTotal = maiorPreco - melhorPreco;
                            const pctEcon   = Math.round((econTotal / maiorPreco) * 100);
                            const resumo    = `
                                <div class="comp-resumo">
                                    <i class="fa-solid fa-piggy-bank"></i>
                                    ${currentLang === 'en'
                                        ? `Choosing <strong>${melhor.nome}</strong> saves <strong>R$ ${econTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (${pctEcon}%) vs. most expensive`
                                        : `Escolher <strong>${melhor.nome}</strong> economiza <strong>R$ ${econTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (${pctEcon}%) vs. o mais caro`}
                                </div>`;

                            tbody.innerHTML += `<tr class="comp-expand-row" id="comp-expand-${idx}" style="display:none;">
                                <td colspan="7">
                                    <div class="comp-panel">
                                        <div class="comp-panel-title">
                                            <i class="fa-solid fa-scale-balanced"></i>
                                            ${currentLang === 'en' ? 'Price comparison' : 'Comparação de preços'} — <em>${nomeItem}</em>
                                        </div>
                                        <div class="comp-grid">${barras}</div>
                                        ${resumo}
                                    </div>
                                </td>
                            </tr>`;
                        }
                    });

                    comparacoesAbertas.forEach(idx => {
                        const expandRow = document.getElementById(`comp-expand-${idx}`);
                        const btn       = document.getElementById(`btn-comp-${idx}`);
                        if (expandRow) expandRow.style.display = 'table-row';
                        if (btn) {
                            btn.classList.add('ativo');
                            const chev = btn.querySelector('.comp-chev');
                            if (chev) chev.style.transform = 'rotate(180deg)';
                        }
                    });

                } else if (dados.status_robo === "Em execução") {
                    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#856404;padding:20px;">
                        <i class="fa-solid fa-circle-notch fa-spin"></i> ${currentLang === 'en' ? 'Robot searching prices...' : 'Robô pesquisando preços...'}
                    </td></tr>`;
                }

                ultimoLog = dados.ultimo_log;
            }
            
        }
    } catch (err) {
        statusBadge.innerHTML = `<i class="fa-solid fa-plug-circle-xmark"></i> ${currentLang === 'en' ? 'Server offline' : 'Servidor offline'}`;
        statusBadge.style.cssText = "background:#fce8e6;color:#c5221f;";
    }
}

// ─── Exportar PDF ─────────────────────────────
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const verde  = [0, 75, 35];
    const azul   = [0, 39, 118];
    const amarel = [255, 223, 0];
    const branco = [255, 255, 255];
    const cfg    = JSON.parse(localStorage.getItem('config') || '{}');
    const dept   = cfg.dept || 'Suprimentos de TI';

    doc.setFillColor(...azul);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setFillColor(...verde);
    doc.rect(0, 32, 210, 4, 'F');
    doc.setFillColor(...amarel);
    doc.rect(0, 36, 210, 2, 'F');

    doc.setTextColor(...branco);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Cotação Inteligente', 15, 14);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`${dept} — Automação de Compras TI | Grupo 1`, 15, 22);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 15, 29);

    doc.setTextColor(...azul);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 15, 52);

    const elEcon = document.getElementById('kpi-economia');
    const elHoras = document.getElementById('kpi-horas-poupadas');
    const elManual = document.getElementById('kpi-manual');
    const elRobo = document.getElementById('kpi-robo');

    const kpis = [
        { label: 'Economia Total (ROI)', valor: elEcon ? elEcon.innerText : 'R$ 0,00' },
        { label: 'Horas Poupadas / Mês', valor: elHoras ? elHoras.innerText : '0 hrs' },
        { label: 'Processo Manual',       valor: elManual ? elManual.innerText : '0 hrs/mês' },
        { label: 'Com UiPath',            valor: elRobo ? elRobo.innerText : '0 hrs/mês' },
    ];

    const cardW = 42, cardH = 22, gap = 4, startX = 15, startY = 57;
    kpis.forEach((k, i) => {
        const x = startX + i * (cardW + gap);
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(...azul);
        doc.roundedRect(x, startY, cardW, cardH, 2, 2, 'FD');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(7); doc.setFont('helvetica', 'normal');
        doc.text(k.label, x + 3, startY + 7);
        doc.setTextColor(...verde);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text(k.valor, x + 3, startY + 17);
    });

    doc.setTextColor(...azul);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Cotações Encontradas pelo Robô', 15, 92);

    const rows = [];
    document.querySelectorAll('#dashboard-table-body tr').forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 6) {
            rows.push([
                cells[0].innerText,
                cells[1].innerText,
                cells[2].innerText,
                cells[3].innerText.replace('●', '').trim(),
                cells[4].innerText,
                cells[5].innerText.trim()
            ]);
        }
    });

    if (rows.length === 0) {
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(10); doc.setFont('helvetica', 'italic');
        doc.text('Nenhuma cotação disponível no momento.', 15, 100);
    } else {
        doc.autoTable({
            startY: 96,
            head: [['Item', 'Especificação', 'Qtd', 'Fornecedor', 'Menor Preço', 'Status']],
            body: rows,
            headStyles: { fillColor: azul, textColor: branco, fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            columnStyles: { 4: { fontStyle: 'bold', textColor: verde }, 5: { textColor: [80, 80, 80] } },
            margin: { left: 15, right: 15 },
            tableLineColor: [220, 220, 220],
            tableLineWidth: 0.1,
        });
    }

    const pageH = doc.internal.pageSize.height;
    doc.setFillColor(...verde);
    doc.rect(0, pageH - 12, 210, 12, 'F');
    doc.setTextColor(...amarel);
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(`🏆 Copa do Mundo 2026 — ${dept} | Grupo 1`, 15, pageH - 4);

    doc.save(`relatorio_cotacao_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ─── TOUR GUIADO ─────────────────────────────
const TOUR_STEPS = [
    {
        target: '.sidebar-brand',
        view:   null,
        titlePt: 'Bem-vindo ao sistema! 👋',
        titleEn: 'Welcome to the system! 👋',
        descPt:  'Esta é a plataforma de Automação de Compras do Grupo 1, integrada ao UiPath. Vamos te guiar pelas principais funcionalidades.',
        descEn:  'This is Group 1\'s Procurement Automation platform, integrated with UiPath. Let us guide you through the main features.',
    },
    {
        target: '#menu-dashboard',
        view:   'dashboard',
        titlePt: 'Dashboard',
        titleEn: 'Dashboard',
        descPt:  'Acompanhe em tempo real as métricas de ROI, economia gerada e os resultados das cotações pesquisadas pelo robô.',
        descEn:  'Track in real time the ROI metrics, savings generated, and the quotation results found by the robot.',
    },
    {
        target: '.cards-kpi',
        view:   'dashboard',
        titlePt: 'Indicadores de Desempenho',
        titleEn: 'Performance Indicators',
        descPt:  'Os KPIs mostram a economia financeira total, horas poupadas por mês e a comparação entre processo manual e automatizado.',
        descEn:  'KPIs show total financial savings, hours saved per month, and the comparison between manual and automated processes.',
    },
    {
        target: '#menu-nova-solicitacao',
        view:   'nova-solicitacao',
        titlePt: 'Nova Solicitação',
        titleEn: 'New Request',
        descPt:  'Aqui você preenche os equipamentos necessários. O robô UiPath irá pesquisar os melhores preços em múltiplos fornecedores.',
        descEn:  'Here you fill in the required equipment. The UiPath robot will search for the best prices across multiple suppliers.',
    },
    {
        target: '#menu-historico',
        view:   'historico',
        titlePt: 'Histórico',
        titleEn: 'History',
        descPt:  'Consulte todas as solicitações já enviadas, com status e data de execução de cada automação.',
        descEn:  'View all submitted requests, with status and execution date of each automation.',
    },
    {
        target: '#menu-configuracoes',
        view:   'configuracoes',
        titlePt: 'Configurações',
        titleEn: 'Settings',
        descPt:  'Personalize o sistema: modo escuro, idioma, nome do departamento, valor/hora para ROI e fornecedores prioritários.',
        descEn:  'Customize the system: dark mode, language, department name, hourly rate for ROI, and priority suppliers.',
    },
    {
        target: '#json-format-panel',
        view:   'dashboard',
        titlePt: 'Formato JSON — UiPath',
        titleEn: 'JSON Format — UiPath',
        descPt:  'Referência rápida do payload que o robô deve enviar ao servidor via POST /resultado: cotações, fornecedores e métricas de ROI.',
        descEn:  'Quick reference for the payload the robot must send to the server via POST /resultado: quotations, suppliers, and ROI metrics.',
    },
];

let tourStep = 0;
let tourActive = false;

function tourStart() {
    tourStep = 0;
    tourActive = true;
    const overlay = document.getElementById('tour-overlay');
    if (overlay) overlay.style.display = 'block';
    buildTourDots();
    renderTourStep();
}

function buildTourDots() {
    const dotsEl = document.getElementById('tour-dots');
    if (dotsEl) {
        dotsEl.innerHTML = TOUR_STEPS.map((_, i) =>
            `<div class="tour-dot ${i === 0 ? 'active' : ''}" id="tour-dot-${i}"></div>`
        ).join('');
    }
}

function updateTourDots() {
    TOUR_STEPS.forEach((_, i) => {
        const dot = document.getElementById('tour-dot-' + i);
        if (dot) dot.classList.toggle('active', i === tourStep);
    });
}

function posicionarTourElementos(step) {
    if (!tourActive) return;
    const targetEl  = document.querySelector(step.target);
    const spotlight = document.getElementById('tour-spotlight');
    const tooltip   = document.getElementById('tour-tooltip');
    if (!targetEl || !spotlight || !tooltip) return;

    // Elementos são position:fixed → coordenadas do viewport, sem scroll
    const rect = targetEl.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
    const TW   = 310;   // largura do tooltip
    const TH   = 230;   // altura estimada do tooltip

    // Spotlight ao redor do elemento
    spotlight.style.width  = (rect.width  + 12) + 'px';
    spotlight.style.height = (rect.height + 12) + 'px';
    spotlight.style.left   = (rect.left   -  6) + 'px';
    spotlight.style.top    = (rect.top    -  6) + 'px';

    // Tooltip: tenta à direita, depois à esquerda, senão centraliza
    let left = rect.right + 16;
    let top  = rect.top;

    if (left + TW > vw - 12) left = rect.left - TW - 16;
    if (left < 12)            left = Math.round((vw - TW) / 2);
    if (top + TH > vh - 12)  top  = vh - TH - 12;
    if (top < 12)             top  = 12;

    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';

    // Aparece com fade após posição estar aplicada
    requestAnimationFrame(() => {
        spotlight.style.opacity = '1';
        tooltip.style.opacity   = '1';
    });
}

function renderTourStep() {
    if (!tourActive) return;
    const step      = TOUR_STEPS[tourStep];
    const spotlight = document.getElementById('tour-spotlight');
    const tooltip   = document.getElementById('tour-tooltip');

    // 1. Oculta instantaneamente (sem transição de posição)
    if (spotlight) spotlight.style.opacity = '0';
    if (tooltip)   tooltip.style.opacity   = '0';

    // 2. Troca de view se necessário
    if (step.view) switchView(step.view);

    // 3. Atualiza textos
    const labelEl = document.getElementById('tour-step-label');
    const titleEl = document.getElementById('tour-title');
    const descEl  = document.getElementById('tour-desc');
    const nextBtn = document.getElementById('tour-next-btn');

    if (labelEl) labelEl.textContent = `${currentLang === 'en' ? 'Step' : 'Passo'} ${tourStep + 1} ${currentLang === 'en' ? 'of' : 'de'} ${TOUR_STEPS.length}`;
    if (titleEl) titleEl.textContent  = currentLang === 'en' ? step.titleEn : step.titlePt;
    if (descEl)  descEl.textContent   = currentLang === 'en' ? step.descEn  : step.descPt;

    const isLast = tourStep === TOUR_STEPS.length - 1;
    if (nextBtn) nextBtn.textContent = isLast
        ? (currentLang === 'en' ? 'Finish ✓' : 'Concluir ✓')
        : (currentLang === 'en' ? 'Next ➔'   : 'Avançar ➔');

    updateTourDots();

    // 4. Aguarda DOM renderizar (necessário quando há troca de view) e reposiciona
    setTimeout(() => posicionarTourElementos(step), step.view ? 80 : 20);
}

function tourNext() {
    if (tourStep < TOUR_STEPS.length - 1) {
        tourStep++;
        renderTourStep();
    } else {
        tourEnd();
    }
}

function tourSkip() {
    tourEnd();
}

function tourEnd() {
    tourActive = false;
    const overlay = document.getElementById('tour-overlay');
    if (overlay) overlay.style.display = 'none';
    localStorage.setItem('tourDone', '1');
}

function reiniciarTour() {
    localStorage.removeItem('tourDone');
    tourStart();
}

// ─── Comparação de preços ────────────────────
function toggleComparacao(idx) {
    const expandRow = document.getElementById(`comp-expand-${idx}`);
    const btn       = document.getElementById(`btn-comp-${idx}`);
    if (!expandRow) return;

    const aberto = expandRow.style.display !== 'none';
    expandRow.style.display = aberto ? 'none' : 'table-row';

    if (btn) {
        btn.classList.toggle('ativo', !aberto);
        const chev = btn.querySelector('.comp-chev');
        if (chev) chev.style.transform = aberto ? '' : 'rotate(180deg)';
    }
}

// ─── JSON Panel ──────────────────────────────
function toggleJsonPanel() {
    const body    = document.getElementById('json-format-body');
    const chevron = document.getElementById('json-chevron');
    if (!body) return;
    const open = body.classList.toggle('open');
    if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
}

function copiarJson() {
    const block = document.getElementById('json-example-block');
    const btn   = document.getElementById('json-copy-btn');
    if (!block || !btn) return;
    navigator.clipboard.writeText(block.textContent.trim()).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        btn.style.background = 'var(--success-bg)';
        btn.style.color      = 'var(--success-text)';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-copy"></i> <span data-i18n="json.copy">Copiar</span>';
            btn.style.background = '';
            btn.style.color      = '';
        }, 2000);
    });
}

// ─── Init ─────────────────────────────────────
window.onload = () => {
    // Carrega preferências de tema
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleDarkMode(saved !== null ? saved === '1' : prefersDark);
    
    // Inicializa traduções e configurações
    applyTranslations();
    carregarConfiguracoes();
    renderizarHistorico();

    // Roda polling imediato e define o intervalo (5 segundos)
    carregarDadosAutomacao();
    setInterval(carregarDadosAutomacao, 5000);

    // Dispara o tour se nunca tiver sido concluído
    if (!localStorage.getItem('tourDone')) {
        setTimeout(tourStart, 1000);
    }
};