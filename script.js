// ─────────────────────────────────────────────
// script.js — Automação de Compras TI | Grupo 1
// ─────────────────────────────────────────────

const SERVER_URL = "http://localhost:5000";

// Histórico local de solicitações (persiste enquanto a aba está aberta)
const historicoLocal = [];

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
            // Registra no histórico local
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
        btnEnviar.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Solicitação';
    }
}

// ─── Histórico ────────────────────────────────
function renderizarHistorico() {
    const tbody = document.getElementById('historico-body');
    if (historicoLocal.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">Nenhuma solicitação enviada ainda.</td></tr>`;
        return;
    }
    tbody.innerHTML = historicoLocal.map(h => `
        <tr>
            <td>${h.data}</td>
            <td>${h.itens} item(s)</td>
            <td><span class="status-badge" style="${h.status === 'Concluído' ? '' : 'background:#fff3cd;color:#856404;'}">${h.status}</span></td>
            <td>Dept. Suprimentos</td>
        </tr>
    `).join('');
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
            labels: ['Processo Manual', 'Com UiPath'],
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
    document.getElementById('kpi-economia').innerText =
        `R$ ${roi.economia_financeira_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('kpi-horas-poupadas').innerText = `${roi.horas_poupadas} hrs`;
    document.getElementById('kpi-manual').innerText = `${roi.tempo_manual} hrs/mês`;
    document.getElementById('kpi-robo').innerText   = `${roi.tempo_robo} hrs/mês`;
}

// ─── Polling ─────────────────────────────────
let ultimoLog = "";

async function carregarDadosAutomacao() {
    const statusBadge = document.getElementById('robot-status');
    try {
        const resposta = await fetch(`${SERVER_URL}/dados`);
        const dados = await resposta.json();

        if (dados.ultimo_log !== ultimoLog) {
            ultimoLog = dados.ultimo_log;

            // Badge
            if (dados.alerta_erro) {
                statusBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Erro detectado`;
                statusBadge.style.cssText = "background:#fce8e6;color:#c5221f;";
            } else {
                const emExecucao = dados.status_robo === "Em execução";
                statusBadge.innerHTML = emExecucao
                    ? `<i class="fa-solid fa-circle-notch fa-spin"></i> ${dados.status_robo}`
                    : `<i class="fa-solid fa-circle-check"></i> ${dados.status_robo}`;
                statusBadge.style.cssText = emExecucao
                    ? "background:#fff3cd;color:#856404;"
                    : "background:#e6f4ea;color:#137333;";
            }

            appendLog(dados.ultimo_log);
            atualizarKPIs(dados.performance_roi);
            renderizarGrafico(dados.performance_roi.tempo_manual, dados.performance_roi.tempo_robo);

            // Tabela de cotações
            const tbody = document.getElementById('dashboard-table-body');
            tbody.innerHTML = "";
            if (dados.cotacoes && dados.cotacoes.length > 0) {
                dados.cotacoes.forEach(c => {
                    const link = c.link ? `<a href="${c.link}" target="_blank" style="color:#002776;font-size:11px;margin-left:4px;">↗</a>` : "";
                    tbody.innerHTML += `
                        <tr>
                            <td><strong>${c.item}</strong></td>
                            <td>${c.desc}</td>
                            <td>${c.qtd}</td>
                            <td><span style="color:#007200">●</span> ${c.fornecedor}${link}</td>
                            <td><b>R$ ${c.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</b></td>
                        </tr>`;
                });
                // Atualiza status no histórico
                if (historicoLocal.length > 0) {
                    historicoLocal[0].status = 'Concluído';
                    renderizarHistorico();
                }
            } else if (dados.status_robo === "Em execução") {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#856404;padding:20px;"><i class="fa-solid fa-circle-notch fa-spin"></i> Robô pesquisando preços...</td></tr>`;
            }
        }
    } catch (err) {
        statusBadge.innerHTML = `<i class="fa-solid fa-plug-circle-xmark"></i> Servidor offline`;
        statusBadge.style.cssText = "background:#fce8e6;color:#c5221f;";
    }
}

// ─── Exportar PDF com jsPDF ───────────────────
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const verde  = [0, 75, 35];
    const azul   = [0, 39, 118];
    const amarel = [255, 223, 0];
    const branco = [255, 255, 255];

    // ── Cabeçalho ──
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
    doc.text('Automação de Compras TI — UiPath | Grupo 1', 15, 22);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 15, 29);

    // ── KPIs ──
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

    // ── Tabela de Cotações ──
    doc.setTextColor(...azul);
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Cotações Encontradas pelo Robô', 15, 92);

    const rows = [];
    document.querySelectorAll('#dashboard-table-body tr').forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 5) {
            rows.push([
                cells[0].innerText,
                cells[1].innerText,
                cells[2].innerText,
                cells[3].innerText.replace('●', '').trim(),
                cells[4].innerText
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
            head: [['Item', 'Especificação', 'Qtd', 'Fornecedor', 'Menor Preço']],
            body: rows,
            headStyles: { fillColor: azul, textColor: branco, fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            columnStyles: { 4: { fontStyle: 'bold', textColor: verde } },
            margin: { left: 15, right: 15 },
            tableLineColor: [220, 220, 220],
            tableLineWidth: 0.1,
        });
    }

    // ── Rodapé ──
    const pageH = doc.internal.pageSize.height;
    doc.setFillColor(...verde);
    doc.rect(0, pageH - 12, 210, 12, 'F');
    doc.setTextColor(...amarel);
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text('🏆 Copa do Mundo 2026 — Automação de Compras TI | Grupo 1', 15, pageH - 4);

    doc.save(`relatorio_cotacao_${new Date().toISOString().slice(0,10)}.pdf`);
}

// ─── Init ─────────────────────────────────────
window.onload = () => {
    renderizarHistorico();
    carregarDadosAutomacao();
    setInterval(carregarDadosAutomacao, 5000);
};