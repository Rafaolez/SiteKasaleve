import "../css/PGTDetalhe.css";
import React, { useContext, useState } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function InfoRow({ label, value, icon }) {
    return (
        <div className="info-row">
            <span className="info-row__icon">{icon}</span>
            <div className="info-row__content">
                <p className="info-row__label">{label}</p>
                <p className="info-row__value">{value}</p>
            </div>
        </div>
    );
}

const initialRelatorio = {
    pagamentos: [
        { id: 1, descricao: "Serviço de Consultoria - Março", valor: 3200.0, data: "2025-03-15", status: "pago" },
        { id: 2, descricao: "Manutenção Mensal - Abril", valor: 1500.0, data: "2025-04-10", status: "pago" },
        { id: 3, descricao: "Projeto Estrutural - Parcela 2/3", valor: 4500.0, data: "2025-04-22", status: "pago" },
        { id: 4, descricao: "Serviço de Consultoria - Maio", valor: 3200.0, data: "2025-05-15", status: "pendente" },
        { id: 5, descricao: "Manutenção Mensal - Maio", valor: 1500.0, data: "2025-05-10", status: "pendente" },
        { id: 6, descricao: "Hospedagem + Domínio - Anual", valor: 890.0, data: "2025-02-01", status: "vencido" },
    ]
};

const fakeOrcamentos = [
    { id: "ORC-2025-0042", titulo: "Redesign do Site Institucional", data: "28/04/2025", validade: "28/05/2025", valor: 8500.0, status: "aprovado", itens: ["Design responsivo", "Painel administrativo", "SEO otimizado"] },
    { id: "ORC-2025-0038", titulo: "Sistema de Gestão Interna", data: "10/04/2025", validade: "10/05/2025", valor: 22000.0, status: "aprovado", itens: ["Módulo financeiro", "Módulo RH", "Dashboard analítico", "Integração API"] },
    { id: "ORC-2025-0031", titulo: "Manutenção Corretiva - Servidor", data: "15/03/2025", validade: "15/04/2025", valor: 1200.0, status: "recusado", itens: ["Diagnóstico de segurança", "Atualização de dependências"] },
    { id: "ORC-2025-0025", titulo: "Desenvolvimento de App Mobile", data: "20/02/2025", validade: "20/03/2025", valor: 35000.0, status: "aprovado", itens: ["App iOS", "App Android", "Painel web", "Push notifications"] },
];

function formatCurrency(val) { return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function formatDateBR(dateStr) { if (!dateStr) return ""; const [y, m, d] = dateStr.split("-"); return `${d}/${m}/${y}`; }
function generatePedidoNumber() { return `PED-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`; }

function PGBTDetalhe() {
    const { clienteSelecionado } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("relatorio");
    const [relatorio, setRelatorio] = useState(initialRelatorio);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({ descricao: "", valor: "", data: "", status: "pendente" });

    // Estado do Checklist agora inclui dados do cliente e opções específicas do papel
    const [checklist, setChecklist] = useState({
        numeroPedido: "",
        origemOrcamento: null,
        origemTitulo: "",
        clienteNome: "",
        clienteEndereco: "",
        clienteTel: "",
        clienteCpf: "",
        clienteEmail: "",
        clienteCidade: "",
        dataEmissao: new Date().toISOString().split("T")[0],
        dataEntrega: "",
        vendedor: "",
        itens: [],
        frete: 0,
        desconto: 0,
        formaPagamento: "",
        condicoesEntrega: "",
        observacoes: "",
    });
    const [clSaved, setClSaved] = useState(false);

    const totalRecebido = relatorio.pagamentos.filter(p => p.status === "pago").reduce((s, p) => s + p.valor, 0);
    const totalPendente = relatorio.pagamentos.filter(p => p.status === "pendente").reduce((s, p) => s + p.valor, 0);
    const totalVencido = relatorio.pagamentos.filter(p => p.status === "vencido").reduce((s, p) => s + p.valor, 0);
    const subtotal = checklist.itens.reduce((s, i) => s + (i.quantidade * i.precoUnitario), 0);
    const totalGeral = subtotal + (parseFloat(checklist.frete) || 0) - (parseFloat(checklist.desconto) || 0);

    if (!clienteSelecionado) {
        return (<div className="detail-page"><div className="detail-empty"><span>◎</span><p>Nenhum cliente selecionado.</p><Link to="/clienti"><button className="btn-back">← Voltar</button></Link></div></div>);
    }

    const { name, email } = clienteSelecionado;
    const fullName = `${name.firstname} ${name.lastname}`;
    const initials = `${name.firstname[0] ?? ''}${name.lastname[0] ?? ''}`.toUpperCase();

    // ... (Funções do Modal de Pagamento mantidas iguais: openAddModal, openEditModal, closeModal, handleFormChange, handleValorChange, validateForm, handleSubmitForm, handleDeletePayment)

    function openAddModal() { setEditingId(null); setForm({ descricao: "", valor: "", data: "", status: "pendente" }); setFormErrors({}); setModalOpen(true); }
    function openEditModal(pag) { setEditingId(pag.id); setForm({ descricao: pag.descricao, valor: String(pag.valor), data: pag.data, status: pag.status }); setFormErrors({}); setModalOpen(true); }
    function closeModal() { setModalOpen(false); setEditingId(null); setFormErrors({}); }
    function handleFormChange(e) { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" })); }
    function handleValorChange(e) { let v = e.target.value.replace(/\D/g, ""); if (v) { v = (parseInt(v) / 100).toFixed(2); v = v.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."); } setForm(prev => ({ ...prev, valor: v })); if (formErrors.valor) setFormErrors(prev => ({ ...prev, valor: "" })); }
    function validateForm() { const errs = {}; if (!form.descricao.trim()) errs.descricao = "Obrigatório."; if (!form.valor || form.valor.replace(/\D/g, "") === "00") errs.valor = "Obrigatório."; if (!form.data) errs.data = "Obrigatório."; setFormErrors(errs); return Object.keys(errs).length === 0; }
    function handleSubmitForm(e) {
        e.preventDefault(); if (!validateForm()) return;
        const valorNum = parseFloat(form.valor.replace(/\./g, "").replace(",", ".")) || 0;
        if (editingId !== null) {
            setRelatorio(prev => ({ ...prev, pagamentos: prev.pagamentos.map(p => p.id === editingId ? { ...p, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status } : p) }));
        } else {
            const newId = Math.max(0, ...relatorio.pagamentos.map(p => p.id)) + 1;
            setRelatorio(prev => ({ ...prev, pagamentos: [{ id: newId, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status }, ...prev.pagamentos] }));
        }
        closeModal();
    }
    function handleDeletePayment(id) { setRelatorio(prev => ({ ...prev, pagamentos: prev.pagamentos.filter(p => p.id !== id) })); }

    // ── Checklist Helpers (Atualizado para novo formato de papel) ──
    function gerarChecklist(orc) {
        setChecklist(prev => ({
            ...prev,
            numeroPedido: generatePedidoNumber(),
            origemOrcamento: orc.id,
            origemTitulo: orc.titulo,
            clienteNome: fullName,
            clienteEmail: email,
            dataEmissao: new Date().toISOString().split("T")[0],
            itens: orc.itens.map((item, idx) => ({
                id: idx + 1, descricao: item, checked: false, quantidade: 1,
                precoUnitario: parseFloat((orc.valor / orc.itens.length).toFixed(2)),
                optFuro: false, optAlteracoes: false, optCores: false
            })),
        }));
        setActiveTab("checklist"); setClSaved(false);
    }

    function handleClChange(field, value) { setChecklist(prev => ({ ...prev, [field]: value })); setClSaved(false); }

    function handleItemChange(itemId, field, value) {
        setChecklist(prev => ({
            ...prev,
            itens: prev.itens.map(item => {
                if (item.id !== itemId) return item;
                let updated = { ...item, [field]: value };
                if (field === "quantidade") updated.quantidade = Math.max(1, parseInt(value) || 1);
                if (field === "precoUnitario") updated.precoUnitario = Math.max(0, parseFloat(value) || 0);
                return updated;
            })
        })); setClSaved(false);
    }

    function toggleItemCheck(itemId) { setChecklist(prev => ({ ...prev, itens: prev.itens.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) })); setClSaved(false); }
    function toggleItemOption(itemId, option) { setChecklist(prev => ({ ...prev, itens: prev.itens.map(item => item.id === itemId ? { ...item, [option]: !item[option] } : item) })); setClSaved(false); }
    
    function addClItem() {
        setChecklist(prev => ({
            ...prev, itens: [...prev.itens, {
                id: Math.max(0, ...prev.itens.map(i => i.id)) + 1, descricao: "", checked: false,
                quantidade: 1, precoUnitario: 0, optFuro: false, optAlteracoes: false, optCores: false
            }]
        })); setClSaved(false);
    }
    function removeClItem(itemId) { setChecklist(prev => ({ ...prev, itens: prev.itens.filter(i => i.id !== itemId) })); setClSaved(false); }
    function handleSalvarChecklist() { console.log("Checklist salvo:", checklist); setClSaved(true); setTimeout(() => setClSaved(false), 3000); }

    return (
        <div className="detail-page">
            <div className="detail-container">
                {/* ... (HEADER E CARD DO CLIENTE MANTIDOS IGUAIS) ... */}
                <div className="detail-header">
                    <div>
                        <p className="detail-header__eyebrow">Gestão de Clientes</p>
                        <h1 className="detail-header__title">Detalhes do Cliente</h1>
                    </div>
                </div>
                <div className="detail-card">
                    <div className="detail-card__hero"><div className="detail-avatar">{initials}</div><div><h2 className="detail-card__name">{fullName}</h2><span className="badge badge--ativo"><span className="badge__dot" /> Ativo</span></div></div>
                    <div className="detail-divider" />
                    <div className="detail-info">
                        <InfoRow icon="👤" label="Nome completo" value={fullName} />
                        <InfoRow icon="✉️" label="E-mail" value={email} />
                        <InfoRow icon="📋" label="Status" value="Ativo" />
                        <InfoRow icon="📍" label="Endereço" value="Rua Exemplo, 123 - Centro" />
                    </div>
                    <div className="detail-divider" />
                    <div className="detail-actions">
                        <Link to="/clienti" className="link-clean"><button className="btn-action btn-action--back">← Voltar</button></Link>
                        <Link to="/editarCliente" className="link-clean"><button className="btn-action btn-action--edit">✏️ Editar</button></Link>
                        <button className="btn-action btn-action--delete">🗑 Excluir</button>
                    </div>
                </div>

                {/* ═══ HISTÓRICO FINANCEIRO ═══ */}
                <div className="detail-card report-card">
                    <div className="report-card__header">
                        <div className="report-card__header-left">
                            <h3 className="report-card__title">Histórico Financeiro</h3>
                            <p className="report-card__sub">Acompanhe pagamentos, orçamentos e pedidos</p>
                        </div>
                        <button className="report-card__export"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Exportar</button>
                    </div>
                    <div className="report-tabs">
                        <button className={`report-tab ${activeTab === "relatorio" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("relatorio")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Relatório</button>
                        <button className={`report-tab ${activeTab === "orcamento" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("orcamento")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Orçamentos</button>
                        <button className={`report-tab ${activeTab === "checklist" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("checklist")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Checklist</button>
                    </div>

                    {/* ... (ABA RELATÓRIO E ORÇAMENTO MANTIDAS IGUAIS, apenas adicionando o botão Gerar Checklist no orçamento) ... */}
                    {activeTab === "relatorio" && (
                        <div className="report-content">
                            <div className="report-summary">
                                <div className="report-summary__card report-summary__card--received"><span className="report-summary__label">Total Recebido</span><span className="report-summary__value">{formatCurrency(totalRecebido)}</span></div>
                                <div className="report-summary__card report-summary__card--pending"><span className="report-summary__label">Pendente</span><span className="report-summary__value">{formatCurrency(totalPendente)}</span></div>
                                <div className="report-summary__card report-summary__card--overdue"><span className="report-summary__label">Vencido</span><span className="report-summary__value">{formatCurrency(totalVencido)}</span></div>
                            </div>
                            <div className="report-table-actions">
                                <span className="report-table-actions__count">{relatorio.pagamentos.length} registros</span>
                                <button className="report-add-btn" onClick={openAddModal}>+ Adicionar Pagamento</button>
                            </div>
                             <div className="report-table-wrap">
                                <table className="report-table">
                                    <thead><tr><th>Descrição</th><th>Valor</th><th>Data</th><th>Status</th><th className="report-table__th-actions">Ações</th></tr></thead>
                                    <tbody>
                                        {relatorio.pagamentos.map((pag) => (
                                            <tr key={pag.id}>
                                                <td className="report-table__desc">{pag.descricao}</td>
                                                <td className="report-table__valor">{formatCurrency(pag.valor)}</td>
                                                <td className="report-table__data">{formatDateBR(pag.data)}</td>
                                                <td><span className={`report-status report-status--${pag.status}`}>{pag.status.charAt(0).toUpperCase() + pag.status.slice(1)}</span></td>
                                                <td className="report-table__td-actions">
                                                    <button className="row-btn row-btn--edit" onClick={() => openEditModal(pag)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                                                    <button className="row-btn row-btn--delete" onClick={() => handleDeletePayment(pag.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "orcamento" && (
                        <div className="report-content">
                            <div className="orcamento-list">
                                {fakeOrcamentos.map((orc) => (
                                    <div key={orc.id} className="orcamento-item">
                                        <div className="orcamento-item__top">
                                            <div className="orcamento-item__identity"><span className="orcamento-item__id">{orc.id}</span><h4 className="orcamento-item__titulo">{orc.titulo}</h4></div>
                                            <div className="orcamento-item__meta"><span className="orcamento-item__valor">{formatCurrency(orc.valor)}</span><span className={`report-status report-status--${orc.status}`}>{orc.status === "aprovado" ? "Aprovado" : "Recusado"}</span></div>
                                        </div>
                                        <div className="orcamento-item__bottom">
                                            <span style={{fontSize: 12, color: 'var(--text-muted)'}}>Emitido: {orc.data}</span>
                                            {orc.status === "aprovado" && (
                                                <button className="cl-generate-btn" onClick={() => gerarChecklist(orc)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Gerar Checklist</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════
                        CHECKLIST DO PEDIDO — ESTILO PAPEL / FORMULÁRIO
                    ═══════════════════════════════════════════ */}
                    {activeTab === "checklist" && (
                        <div className="cl-root-paper">
                            {checklist.itens.length === 0 ? (
                                <div className="report-empty" style={{ padding: "60px 24px", border: '2px dashed #ccc' }}>
                                    <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text)", margin: 0 }}>Nenhum checklist criado</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '8px 0 0' }}>Vá em "Orçamentos" e clique em "Gerar Checklist".</p>
                                </div>
                            ) : (
                                <div className="paper-sheet">
                                    
                                    {/* Cabeçalho Empresa */}
                                    <div className="paper-company-header">
                                        <h1 className="paper-company-name">kasaleve</h1>
                                        <p className="paper-company-info">Endereço da Empresa | Tel: (00) 00000-0000 | E-mail: contato@kasaleve.com</p>
                                    </div>

                                    {/* Título do Documento */}
                                    <div className="paper-doc-title-box">
                                        <h2>CHECKLIST VENDAS - PEDIDOS</h2>
                                        <div className="paper-doc-ids">
                                            <span>Nº Pedido: <strong>{checklist.numeroPedido}</strong></span>
                                            <span>Origem: <strong>{checklist.origemOrcamento}</strong></span>
                                            <span>Título: <strong>{checklist.origemTitulo}</strong></span>
                                        </div>
                                    </div>

                                    {/* Dados do Cliente */}
                                    <div className="paper-section">
                                        <div className="paper-section-title">DADOS DO CLIENTE</div>
                                        <div className="paper-grid-2col">
                                            <div className="paper-field">
                                                <label>Nome:</label>
                                                <input type="text" value={checklist.clienteNome} onChange={e => handleClChange('clienteNome', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>Telefone:</label>
                                                <input type="text" value={checklist.clienteTel} onChange={e => handleClChange('clienteTel', e.target.value)} placeholder="(00) 00000-0000" />
                                            </div>
                                            <div className="paper-field">
                                                <label>Endereço:</label>
                                                <input type="text" value={checklist.clienteEndereco} onChange={e => handleClChange('clienteEndereco', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>CPF/CNPJ:</label>
                                                <input type="text" value={checklist.clienteCpf} onChange={e => handleClChange('clienteCpf', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>E-mail:</label>
                                                <input type="email" value={checklist.clienteEmail} onChange={e => handleClChange('clienteEmail', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>Cidade/Estado:</label>
                                                <input type="text" value={checklist.clienteCidade} onChange={e => handleClChange('clienteCidade', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabela de Itens */}
                                    <div className="paper-section" style={{paddingBottom: 0}}>
                                        <div className="paper-section-title">ITENS DO PEDIDO / SERVIÇOS</div>
                                        <table className="paper-table">
                                            <thead>
                                                <tr>
                                                    <th style={{width: 30}}></th>
                                                    <th>Descrição dos Produtos/Serviços</th>
                                                    <th style={{width: 40}}>Qtd</th>
                                                    <th style={{width: 100}}>Valor Un.</th>
                                                    <th style={{width: 110}}>Subtotal</th>
                                                    <th style={{width: 180}}>Opções Adicionais</th>
                                                    <th style={{width: 30}}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {checklist.itens.map((item, idx) => (
                                                    <tr key={item.id} className={item.checked ? "paper-row-checked" : ""}>
                                                        <td className="paper-center">
                                                            <input type="checkbox" className="paper-checkbox" checked={item.checked} onChange={() => toggleItemCheck(item.id)} />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="paper-input-full" value={item.descricao} onChange={e => handleItemChange(item.id, 'descricao', e.target.value)} placeholder="Descrição do item..." />
                                                        </td>
                                                        <td className="paper-center">
                                                            <input type="number" className="paper-input-sm" value={item.quantidade} onChange={e => handleItemChange(item.id, 'quantidade', e.target.value)} min="1" />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="paper-input-sm paper-input-right" value={item.precoUnitario.toFixed(2).replace('.', ',')} onChange={e => handleItemChange(item.id, 'precoUnitario', e.target.value.replace(',', '.'))} />
                                                        </td>
                                                        <td className="paper-input-right paper-bold">
                                                            {formatCurrency(item.quantidade * item.precoUnitario)}
                                                        </td>
                                                        <td className="paper-options-cell">
                                                            <label className="paper-option-label"><input type="checkbox" checked={item.optFuro} onChange={() => toggleItemOption(item.id, 'optFuro')} /> Furo Central</label>
                                                            <label className="paper-option-label"><input type="checkbox" checked={item.optAlteracoes} onChange={() => toggleItemOption(item.id, 'optAlteracoes')} /> Alterações</label>
                                                            <label className="paper-option-label"><input type="checkbox" checked={item.optCores} onChange={() => toggleItemOption(item.id, 'optCores')} /> Cores</label>
                                                        </td>
                                                        <td>
                                                            <button className="paper-btn-del" onClick={() => removeClItem(item.id)}>X</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button className="paper-add-line" onClick={addClItem}>+ Adicionar Linha</button>
                                    </div>

                                    {/* Condições e Observações */}
                                    <div className="paper-grid-2col" style={{marginTop: 20}}>
                                        <div className="paper-textarea-group">
                                            <label>Condições de Entrega:</label>
                                            <textarea rows="3" value={checklist.condicoesEntrega} onChange={e => handleClChange('condicoesEntrega', e.target.value)}></textarea>
                                        </div>
                                        <div className="paper-textarea-group">
                                            <label>Observações Gerais:</label>
                                            <textarea rows="3" value={checklist.observacoes} onChange={e => handleClChange('observacoes', e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    {/* Totais e Rodapé */}
                                    <div className="paper-bottom-grid">
                                        <div className="paper-totals-box">
                                            <div className="paper-total-row">
                                                <span>Subtotal:</span>
                                                <span>{formatCurrency(subtotal)}</span>
                                            </div>
                                            <div className="paper-total-row">
                                                <label>Frete (+):</label>
                                                <input type="text" value={checklist.frete.toFixed(2).replace('.', ',')} onChange={e => handleClChange('frete', e.target.value.replace(',', '.'))} />
                                            </div>
                                            <div className="paper-total-row">
                                                <label>Desconto (-):</label>
                                                <input type="text" value={checklist.desconto.toFixed(2).replace('.', ',')} onChange={e => handleClChange('desconto', e.target.value.replace(',', '.'))} />
                                            </div>
                                            <div className="paper-total-row paper-total-final">
                                                <span>TOTAL GERAL:</span>
                                                <span>{formatCurrency(totalGeral)}</span>
                                            </div>
                                        </div>

                                        <div className="paper-footer-info">
                                            <div className="paper-field">
                                                <label>Emissão:</label>
                                                <input type="date" value={checklist.dataEmissao} onChange={e => handleClChange('dataEmissao', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>Entrega Prevista:</label>
                                                <input type="date" value={checklist.dataEntrega} onChange={e => handleClChange('dataEntrega', e.target.value)} />
                                            </div>
                                            <div className="paper-field">
                                                <label>Pagamento:</label>
                                                <select value={checklist.formaPagamento} onChange={e => handleClChange('formaPagamento', e.target.value)}>
                                                    <option value="">Selecione</option>
                                                    <option value="pix">PIX</option><option value="boleto">Boleto</option><option value="dinheiro">Dinheiro</option><option value="cartao">Cartão</option>
                                                </select>
                                            </div>
                                            <div className="paper-field">
                                                <label>Vendedor:</label>
                                                <input type="text" value={checklist.vendedor} onChange={e => handleClChange('vendedor', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão Salvar Estilo Formulário */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
                                        <button className={`paper-save-btn ${clSaved ? 'paper-save-btn--ok' : ''}`} onClick={handleSalvarChecklist}>
                                            {clSaved ? "✓ SALVO COM SUCESSO" : "SALVAR DOCUMENTO"}
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ MODAL PAGAMENTO (MANTIDO IGUAL) ═══ */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <div><h3 className="modal__title">{editingId !== null ? "Editar Pagamento" : "Novo Pagamento"}</h3><p className="modal__sub">Preencha os dados.</p></div>
                            <button className="modal__close" onClick={closeModal}>X</button>
                        </div>
                        <form className="modal__form" onSubmit={handleSubmitForm} noValidate>
                            <div className={`modal-field ${formErrors.descricao ? "modal-field--error" : ""}`}>
                                <label className="modal-label">Descrição *</label>
                                <input type="text" name="descricao" value={form.descricao} onChange={handleFormChange} className="modal-input" placeholder="Descrição" />
                                {formErrors.descricao && <span className="modal-err">{formErrors.descricao}</span>}
                            </div>
                            <div className="modal-row">
                                <div className={`modal-field ${formErrors.valor ? "modal-field--error" : ""}`}>
                                    <label className="modal-label">Valor *</label>
                                    <input type="text" name="valor" value={form.valor} onChange={handleValorChange} className="modal-input" placeholder="0,00" />
                                </div>
                                <div className={`modal-field ${formErrors.data ? "modal-field--error" : ""}`}>
                                    <label className="modal-label">Data *</label>
                                    <input type="date" name="data" value={form.data} onChange={handleFormChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="modal__actions">
                                <button type="button" className="modal-btn modal-btn--ghost" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="modal-btn modal-btn--primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PGBTDetalhe;