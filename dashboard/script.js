// ─────────────────────────────────────────────
// script.js — Automação de Compras TI | Grupo 1
// ─────────────────────────────────────────────

const SERVER_URL = "https://procurement-automation-qy7b.onrender.com";

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

function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved !== null ? saved === '1' : prefersDark;
    toggleDarkMode(isDark);
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
    // Pega apenas os fornecedores selecionados na tela
    const fornSelecionados = [...document.querySelectorAll('.forn-chip input:checked')]
                              .map(cb => cb.closest('.forn-chip').dataset.id);

    // Salva no localStorage mantendo valores fixos para o departamento e valor/hora
    // assim o PDF e o histórico continuam funcionando sem quebrar
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
    document.getElementById('view-' + viewId).classList.add('active');
    document.getElementById('menu-' + viewId).classList.add('active');
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
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

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
            appendLog(`✅ ${resultado.mensagem} Robô iniciando pesquisa...`);
        } else {
            alert("Erro: " + resultado.erro);
        }
    } catch (err) {
        alert("Não foi possível conectar ao servidor. Verifique se o server.py está rodando.");
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${t('btn.send')}`;
    }
}

// ─── Histórico ────────────────────────────────
function renderizarHistorico() {
    const tbody = document.getElementById('historico-body');
    const dept  = (JSON.parse(localStorage.getItem('config') || '{}')).dept || 'Suprimentos de TI';

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
    const hora = new Date().toLocaleTimeString('pt-BR');
    el.innerHTML += `\n[${hora}] ${mensagem}`;
    el.scrollTop = el.scrollHeight;
}

// ─── Gráfico ──────────────────────────────────
let meuGrafico = null;

function renderizarGrafico(manual, robo) {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
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
    // Usa valor/hora das configurações para recalcular economia
    const cfg        = JSON.parse(localStorage.getItem('config') || '{}');
    const valorHora  = parseFloat(cfg.valorHora) || 90;
    const economia   = (roi.horas_poupadas || 0) * valorHora;

    document.getElementById('kpi-economia').innerText =
        `R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpi-horas-poupadas').innerText = `${roi.horas_poupadas} hrs`;
    document.getElementById('kpi-manual').innerText = `${roi.tempo_manual} hrs/mês`;
    document.getElementById('kpi-robo').innerText   = `${roi.tempo_robo} hrs/mês`;
}

// ─── Badge status ─────────────────────────────
function badgeStatus(status) {
    if (status === 'completo') {
        return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;
            background:#e6f4ea;color:#137333;font-size:11px;font-weight:600;">
            ✔ ${currentLang === 'en' ? 'Done' : 'Completo'}
        </span>`;
    }
    return `<span style="display:inline-block;padding:2px 8px;border-radius:10px;
        background:#fff3cd;color:#856404;font-size:11px;font-weight:600;">
        ⏳ ${currentLang === 'en' ? 'Pending' : 'Pendente'}
    </span>`;
}

// ─── Polling ─────────────────────────────────
let ultimoLog = "";

async function carregarDadosAutomacao() {
    const statusBadge = document.getElementById('robot-status');
    if (!statusBadge) return;
    
    try {
        const resposta = await fetch(`${SERVER_URL}/dados`);
        const dados = await resposta.json();

        if (dados.ultimo_log !== ultimoLog) {
            ultimoLog = dados.ultimo_log;

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
                tbody.innerHTML = "";

                // Nova leitura adaptada para a estrutura do pedido_entrada que está rodando no backend
                if (dados.pedido_entrada && dados.pedido_entrada.itens && dados.pedido_entrada.itens.length > 0) {
                    dados.pedido_entrada.itens.forEach(item => {
                        const nomeItem = `<strong>${item.marca || ''} ${item.modelo || ''}</strong>`.trim();
                        const especificacao = item.observacoes || "—";
                        const quantidade = item.quantidade || 1;
                        const statusItem = (item.status || "pendente").toLowerCase();

                        const cotacaoCorrespondente = dados.cotacoes && dados.cotacoes.find(c => `${item.marca} ${item.modelo}`.trim().includes(c.item));
                        
                        const link = (cotacaoCorrespondente && cotacaoCorrespondente.link)
                            ? `<a href="${cotacaoCorrespondente.link}" target="_blank" style="color:#002776;font-size:11px;margin-left:4px;">↗</a>`
                            : "";
                        
                        const precoExibido = (statusItem === 'completo' && cotacaoCorrespondente && cotacaoCorrespondente.preco != null)
                            ? `<b>R$ ${cotacaoCorrespondente.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</b>`
                            : `<span style="color:#999;font-size:12px;">—</span>`;

                        const fornecedorExibido = (cotacaoCorrespondente && cotacaoCorrespondente.fornecedor)
                            ? `<span style="color:#007200">●</span> ${cotacaoCorrespondente.fornecedor}${link}`
                            : `<span style="color:#999;font-size:12px;">${currentLang === 'en' ? 'Waiting...' : 'Aguardando...'}</span>`;

                        tbody.innerHTML += `<tr>
                            <td>${nomeItem}</td>
                            <td>${especificacao}</td>
                            <td>${quantidade}</td>
                            <td>${fornecedorExibido}</td>
                            <td>${precoExibido}</td>
                            <td>${badgeStatus(statusItem)}</td>
                        </tr>`;
                    });
                } else if (dados.status_robo === "Em execução") {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#856404;padding:20px;">
                        <i class="fa-solid fa-circle-notch fa-spin"></i> ${currentLang === 'en' ? 'Robot searching prices...' : 'Robô pesquisando preços...'}
                    </td></tr>`;
                }
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

    const kpis = [
        { label: 'Economia Total (ROI)', valor: document.getElementById('kpi-economia').innerText },
        { label: 'Horas Poupadas / Mês', valor: document.getElementById('kpi-horas-poupadas').innerText },
        { label: 'Processo Manual',       valor: document.getElementById('kpi-manual').innerText },
        { label: 'Com UiPath',            valor: document.getElementById('kpi-robo').innerText },
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
        view:   'dashboard',
        titlePt: 'Nova Solicitação',
        titleEn: 'New Request',
        descPt:  'Aqui você preenche os equipamentos necessários. O robô UiPath irá pesquisar os melhores preços em múltiplos fornecedores.',
        descEn:  'Here you fill in the required equipment. The UiPath robot will search for the best prices across multiple suppliers.',
    },
    {
        target: '#menu-historico',
        view:   'dashboard',
        titlePt: 'Histórico',
        titleEn: 'History',
        descPt:  'Consulte todas as solicitações já enviadas, com status e data de execução de cada automação.',
        descEn:  'View all submitted requests, with status and execution date of each automation.',
    },
    {
        target: '#menu-configuracoes',
        view:   'dashboard',
        titlePt: 'Configurações',
        titleEn: 'Settings',
        descPt:  'Personalize o sistema: modo escuro, idioma, nome do departamento, valor/hora para ROI e fornecedores prioritários.',
        descEn:  'Customize the system: dark mode, language, department name, hourly rate for ROI, and priority suppliers.',
    },
];

let tourStep = 0;
let tourActive = false;

function tourStart() {
    tourStep = 0;
    tourActive = true;
    document.getElementById('tour-overlay').style.display = 'block';
    buildTourDots();
    renderTourStep();
}

function buildTourDots() {
    const dotsEl = document.getElementById('tour-dots');
    dotsEl.innerHTML = TOUR_STEPS.map((_, i) =>
        `<div class="tour-dot ${i === 0 ? 'active' : ''}" id="tour-dot-${i}"></div>`
    ).join('');
}

function updateTourDots() {
    TOUR_STEPS.forEach((_, i) => {
        const dot = document.getElementById('tour-dot-' + i);
        if (dot) dot.classList.toggle('active', i === tourStep);
    });
}

function renderTourStep() {
    if (!tourActive) return;
    const step = TOUR_STEPS[tourStep];

    // Mudar view se necessário
    if (step.view) switchView(step.view);

    // Labels
    document.getElementById('tour-step-label').textContent =
        `${currentLang === 'en' ? 'Step' : 'Passo'} ${tourStep + 1} ${currentLang === 'en' ? 'of' : 'de'} ${TOUR_STEPS.length}`;
    document.getElementById('tour-title').textContent =
        currentLang === 'en' ? step.titleEn : step.titlePt;
    document.getElementById('tour-desc').textContent =
        currentLang === 'en' ? step.descEn  : step.descPt;

    // Botão final
    const nextBtn = document.getElementById('tour-next-btn');
    const isLast  = tourStep === TOUR_STEPS.length - 1;
    nextBtn.textContent = isLast
        ? (currentLang === 'en' ? 'Finish ✓' : 'Concluir ✓')
        : (currentLang === 'en' ? 'Next' : 'Próximo');

    // Skip label
    document.getElementById('tour-skip-btn').textContent =
        currentLang === 'en' ? 'Skip tour' : 'Pular tour';

    updateTourDots();
    positionSpotlight(step.target);
}

function positionSpotlight(selector) {
    const el = document.querySelector(selector);
    const spotlight  = document.getElementById('tour-spotlight');
    const tooltip    = document.getElementById('tour-tooltip');

    if (!el) {
        // fallback: centro da tela
        spotlight.style.cssText = 'left:50%;top:50%;width:0;height:0;';
        tooltip.style.cssText   = 'left:50%;top:50%;transform:translate(-50%,-50%)';
        return;
    }

    const pad = 8;
    const rect = el.getBoundingClientRect();

    spotlight.style.left   = (rect.left   - pad) + 'px';
    spotlight.style.top    = (rect.top    - pad) + 'px';
    spotlight.style.width  = (rect.width  + pad * 2) + 'px';
    spotlight.style.height = (rect.height + pad * 2) + 'px';

    const tooltipW   = 300;
    const tooltipH   = 200;
    const gap        = 18;
    const vw         = window.innerWidth;
    const vh         = window.innerHeight;

    let left = rect.right + gap;
    let top  = rect.top;

    // ─── AJUSTE INTELIGENTE DE POSIÇÃO ─────────────────────────────
    // Se o tooltip sumir pela direita ou se o alvo for na sidebar esquerda, 
    // joga o tooltip para a direita, mas garante que ele não saia da tela.
    if (left + tooltipW > vw - 15) {
        // Tenta jogar para a esquerda do elemento
        left = rect.left - tooltipW - gap;
        
        // Se mesmo à esquerda ele sair da tela (telas muito pequenas/mobile)
        // posiciona abaixo ou acima do elemento de forma centralizada
        if (left < 15) {
            left = Math.max(15, rect.left + (rect.width / 2) - (tooltipW / 2));
            top = rect.bottom + gap;
        }
    }

    // Não deixa o limite esquerdo ser menor que a margem de segurança
    if (left < 15) left = 15;
    // Não deixa sair pelo limite da direita da tela
    if (left + tooltipW > vw - 15) left = vw - tooltipW - 15;

    // Ajustes verticais (para não sumir no topo ou no rodapé)
    if (top + tooltipH > vh - 15)  top  = vh - tooltipH - 15;
    if (top < 15) top = 15;
    // ───────────────────────────────────────────────────────────────

    tooltip.style.left      = left + 'px';
    tooltip.style.top       = top  + 'px';
    tooltip.style.transform = 'none';
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
    document.getElementById('tour-overlay').style.display = 'none';
    localStorage.setItem('tourDone', '1');
}

function reiniciarTour() {
    localStorage.removeItem('tourDone');
    tourStart();
}

// ─── Init ─────────────────────────────────────
window.onload = () => {
    initDarkMode();
    currentLang = localStorage.getItem('lang') || 'pt';
    applyTranslations();
    carregarConfiguracoes();
    addNewRow(); // linha inicial na tabela de input
    renderizarHistorico();
    carregarDadosAutomacao();
    setInterval(carregarDadosAutomacao, 5000);

    // Tour na primeira visita
    if (!localStorage.getItem('tourDone')) {
        setTimeout(tourStart, 800);
    }
};