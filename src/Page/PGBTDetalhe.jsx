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
    {
        id: "ORC-2025-0042", titulo: "Redesign do Site Institucional",
        data: "28/04/2025", validade: "28/05/2025", valor: 8500.0, status: "aprovado",
        itens: ["Design responsivo", "Painel administrativo", "SEO otimizado"]
    },
    {
        id: "ORC-2025-0038", titulo: "Sistema de Gestão Interna",
        data: "10/04/2025", validade: "10/05/2025", valor: 22000.0, status: "aprovado",
        itens: ["Módulo financeiro", "Módulo RH", "Dashboard analítico", "Integração API"]
    },
    {
        id: "ORC-2025-0031", titulo: "Manutenção Corretiva - Servidor",
        data: "15/03/2025", validade: "15/04/2025", valor: 1200.0, status: "recusado",
        itens: ["Diagnóstico de segurança", "Atualização de dependências"]
    },
    {
        id: "ORC-2025-0025", titulo: "Desenvolvimento de App Mobile",
        data: "20/02/2025", validade: "20/03/2025", valor: 35000.0, status: "aprovado",
        itens: ["App iOS", "App Android", "Painel web", "Push notifications"]
    },
];

function formatCurrency(val) {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}

function generatePedidoNumber() {
    return `PED-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
}

function PGBTDetalhe() {
    const { clienteSelecionado } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("relatorio");
    const [relatorio, setRelatorio] = useState(initialRelatorio);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({ descricao: "", valor: "", data: "", status: "pendente" });

    // Checklist state
    const [checklist, setChecklist] = useState({
        numeroPedido: "",
        origemOrcamento: null,
        origemTitulo: "",
        dataEmissao: new Date().toISOString().split("T")[0],
        dataEntrega: "",
        vendedor: "",
        itens: [],
        frete: 0,
        desconto: 0,
        formaPagamento: "",
        observacoes: "",
        condicoesEntrega: "",
    });

    const [clSaved, setClSaved] = useState(false);

    // Calculados relatório
    const totalRecebido = relatorio.pagamentos.filter(p => p.status === "pago").reduce((s, p) => s + p.valor, 0);
    const totalPendente = relatorio.pagamentos.filter(p => p.status === "pendente").reduce((s, p) => s + p.valor, 0);
    const totalVencido = relatorio.pagamentos.filter(p => p.status === "vencido").reduce((s, p) => s + p.valor, 0);

    // Calculados checklist
    const checkedItens = checklist.itens.filter(i => i.checked);
    const subtotal = checkedItens.reduce((s, i) => s + (i.quantidade * i.precoUnitario), 0);
    const totalGeral = subtotal + (parseFloat(checklist.frete) || 0) - (parseFloat(checklist.desconto) || 0);

    if (!clienteSelecionado) {
        return (
            <div className="detail-page">
                <div className="detail-empty">
                    <span>◎</span>
                    <p>Nenhum cliente selecionado.</p>
                    <Link to="/clienti"><button className="btn-back">← Voltar</button></Link>
                </div>
            </div>
        );
    }

    const { name, email } = clienteSelecionado;
    const fullName = `${name.firstname} ${name.lastname}`;
    const initials = `${name.firstname[0] ?? ''}${name.lastname[0] ?? ''}`.toUpperCase();

    // ── Modal helpers ──
    function openAddModal() {
        setEditingId(null);
        setForm({ descricao: "", valor: "", data: "", status: "pendente" });
        setFormErrors({});
        setModalOpen(true);
    }

    function openEditModal(pag) {
        setEditingId(pag.id);
        setForm({ descricao: pag.descricao, valor: String(pag.valor), data: pag.data, status: pag.status });
        setFormErrors({});
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingId(null);
        setFormErrors({});
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
    }

    function handleValorChange(e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v) {
            v = (parseInt(v) / 100).toFixed(2);
            v = v.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        setForm(prev => ({ ...prev, valor: v }));
        if (formErrors.valor) setFormErrors(prev => ({ ...prev, valor: "" }));
    }

    function validateForm() {
        const errs = {};
        if (!form.descricao.trim()) errs.descricao = "A descrição é obrigatória.";
        if (!form.valor || form.valor.replace(/\D/g, "") === "00") errs.valor = "Informe um valor válido.";
        if (!form.data) errs.data = "A data é obrigatória.";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        if (!validateForm()) return;
        const valorNum = parseFloat(form.valor.replace(/\./g, "").replace(",", ".")) || 0;
        if (editingId !== null) {
            setRelatorio(prev => ({
                ...prev,
                pagamentos: prev.pagamentos.map(p => p.id === editingId ? { ...p, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status } : p)
            }));
        } else {
            const newId = Math.max(0, ...relatorio.pagamentos.map(p => p.id)) + 1;
            setRelatorio(prev => ({
                ...prev,
                pagamentos: [{ id: newId, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status }, ...prev.pagamentos]
            }));
        }
        closeModal();
    }

    function handleDeletePayment(id) {
        setRelatorio(prev => ({ ...prev, pagamentos: prev.pagamentos.filter(p => p.id !== id) }));
    }

    // ── Checklist helpers ──
    function gerarChecklist(orc) {
        setChecklist(prev => ({
            ...prev,
            numeroPedido: generatePedidoNumber(),
            origemOrcamento: orc.id,
            origemTitulo: orc.titulo,
            dataEmissao: new Date().toISOString().split("T")[0],
            itens: orc.itens.map((item, idx) => ({
                id: idx + 1,
                descricao: item,
                checked: false,
                quantidade: 1,
                precoUnitario: parseFloat((orc.valor / orc.itens.length).toFixed(2)),
            })),
        }));
        setActiveTab("checklist");
        setClSaved(false);
    }

    function handleClChange(field, value) {
        setChecklist(prev => ({ ...prev, [field]: value }));
        setClSaved(false);
    }

    function handleItemChange(itemId, field, value) {
        setChecklist(prev => ({
            ...prev,
            itens: prev.itens.map(item => {
                if (item.id !== itemId) return item;
                const updated = { ...item, [field]: value };
                if (field === "quantidade") updated.quantidade = Math.max(1, parseInt(value) || 1);
                if (field === "precoUnitario") updated.precoUnitario = Math.max(0, parseFloat(value) || 0);
                return updated;
            })
        }));
        setClSaved(false);
    }

    function toggleItemCheck(itemId) {
        setChecklist(prev => ({
            ...prev,
            itens: prev.itens.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
        }));
        setClSaved(false);
    }

    function addClItem() {
        setChecklist(prev => ({
            ...prev,
            itens: [...prev.itens, {
                id: Math.max(0, ...prev.itens.map(i => i.id)) + 1,
                descricao: "", checked: false, quantidade: 1, precoUnitario: 0,
            }]
        }));
        setClSaved(false);
    }

    function removeClItem(itemId) {
        setChecklist(prev => ({
            ...prev,
            itens: prev.itens.filter(i => i.id !== itemId)
        }));
        setClSaved(false);
    }

    function handleSalvarChecklist() {
        console.log("Checklist salvo:", checklist);
        setClSaved(true);
        setTimeout(() => setClSaved(false), 3000);
    }

    return (
        <div className="detail-page">
            <div className="detail-container">

                {/* ── Topo ── */}
                <div className="detail-header">
                    <div>
                        <p className="detail-header__eyebrow">Gestão de Clientes</p>
                        <h1 className="detail-header__title">Detalhes do Cliente</h1>
                    </div>
                </div>

                {/* ── Card de Info ── */}
                <div className="detail-card">
                    <div className="detail-card__hero">
                        <div className="detail-avatar">{initials}</div>
                        <div>
                            <h2 className="detail-card__name">{fullName}</h2>
                            <span className="badge badge--ativo"><span className="badge__dot" /> Ativo</span>
                        </div>
                    </div>
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

                {/* ══════════════════════════════════════
                    SEÇÃO: Relatórios / Orçamentos / Checklist
                ══════════════════════════════════════ */}
                <div className="detail-card report-card">
                    <div className="report-card__header">
                        <div className="report-card__header-left">
                            <h3 className="report-card__title">Histórico Financeiro</h3>
                            <p className="report-card__sub">Acompanhe pagamentos, orçamentos e pedidos</p>
                        </div>
                        <button className="report-card__export">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Exportar
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="report-tabs">
                        <button className={`report-tab ${activeTab === "relatorio" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("relatorio")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                            Relatório
                        </button>
                        <button className={`report-tab ${activeTab === "orcamento" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("orcamento")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            Orçamentos
                        </button>
                        <button className={`report-tab ${activeTab === "checklist" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("checklist")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                            Checklist Pedido
                        </button>
                    </div>

                    {/* ═══ RELATÓRIO ═══ */}
                    {activeTab === "relatorio" && (
                        <div className="report-content">
                            <div className="report-summary">
                                <div className="report-summary__card report-summary__card--received">
                                    <span className="report-summary__label">Total Recebido</span>
                                    <span className="report-summary__value">{formatCurrency(totalRecebido)}</span>
                                    <span className="report-summary__count">{relatorio.pagamentos.filter(p => p.status === "pago").length} pagamentos</span>
                                </div>
                                <div className="report-summary__card report-summary__card--pending">
                                    <span className="report-summary__label">Pendente</span>
                                    <span className="report-summary__value">{formatCurrency(totalPendente)}</span>
                                    <span className="report-summary__count">{relatorio.pagamentos.filter(p => p.status === "pendente").length} pendentes</span>
                                </div>
                                <div className="report-summary__card report-summary__card--overdue">
                                    <span className="report-summary__label">Vencido</span>
                                    <span className="report-summary__value">{formatCurrency(totalVencido)}</span>
                                    <span className="report-summary__count">{relatorio.pagamentos.filter(p => p.status === "vencido").length} vencidos</span>
                                </div>
                            </div>
                            <div className="report-table-actions">
                                <span className="report-table-actions__count">{relatorio.pagamentos.length} registro{relatorio.pagamentos.length !== 1 ? "s" : ""}</span>
                                <button className="report-add-btn" onClick={openAddModal}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Adicionar Pagamento
                                </button>
                            </div>
                            {relatorio.pagamentos.length === 0 ? (
                                <div className="report-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                    <p>Nenhum pagamento registrado.</p>
                                    <button className="report-add-btn" onClick={openAddModal}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        Adicionar primeiro pagamento
                                    </button>
                                </div>
                            ) : (
                                <div className="report-table-wrap">
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Descrição</th><th>Valor</th><th>Data</th><th>Status</th><th className="report-table__th-actions">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {relatorio.pagamentos.map((pag) => (
                                                <tr key={pag.id}>
                                                    <td className="report-table__desc">{pag.descricao}</td>
                                                    <td className="report-table__valor">{formatCurrency(pag.valor)}</td>
                                                    <td className="report-table__data">{formatDateBR(pag.data)}</td>
                                                    <td>
                                                        <span className={`report-status report-status--${pag.status}`}>
                                                            {pag.status === "pago" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                            {pag.status === "pendente" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                                                            {pag.status === "vencido" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
                                                            {pag.status.charAt(0).toUpperCase() + pag.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="report-table__td-actions">
                                                        <button className="row-btn row-btn--edit" title="Editar" onClick={() => openEditModal(pag)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                                        <button className="row-btn row-btn--delete" title="Excluir" onClick={() => handleDeletePayment(pag.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ ORÇAMENTOS ═══ */}
                    {activeTab === "orcamento" && (
                        <div className="report-content">
                            <div className="orcamento-list">
                                {fakeOrcamentos.map((orc) => (
                                    <div key={orc.id} className="orcamento-item">
                                        <div className="orcamento-item__top">
                                            <div className="orcamento-item__identity">
                                                <span className="orcamento-item__id">{orc.id}</span>
                                                <h4 className="orcamento-item__titulo">{orc.titulo}</h4>
                                            </div>
                                            <div className="orcamento-item__meta">
                                                <span className="orcamento-item__valor">{formatCurrency(orc.valor)}</span>
                                                <span className={`report-status report-status--${orc.status}`}>
                                                    {orc.status === "aprovado" ? "Aprovado" : orc.status === "pendente" ? "Pendente" : "Recusado"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="orcamento-item__itens">
                                            {orc.itens.map((item, i) => <span key={i} className="orcamento-item__tag">{item}</span>)}
                                        </div>
                                        <div className="orcamento-item__bottom">
                                            <div className="orcamento-item__dates">
                                                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>Emitido: {orc.data}</span>
                                                <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>Validade: {orc.validade}</span>
                                            </div>
                                            {orc.status === "aprovado" && (
                                                <button className="cl-generate-btn" onClick={() => gerarChecklist(orc)}>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                                                    Gerar Checklist
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ CHECKLIST DO PEDIDO ═══ */}
                    {activeTab === "checklist" && (
                        <div className="report-content cl-content">
                            {checklist.itens.length === 0 ? (
                                <div className="report-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                                    <p>Nenhum checklist criado.</p>
                                    <p className="cl-empty-hint">Vá até a aba "Orçamentos" e clique em "Gerar Checklist" em um orçamento aprovado.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Cabeçalho do pedido */}
                                    <div className="cl-header-grid">
                                        <div className="cl-header-block">
                                            <span className="cl-header-label">Nº Pedido</span>
                                            <span className="cl-header-value cl-header-value--num">{checklist.numeroPedido}</span>
                                        </div>
                                        <div className="cl-header-block">
                                            <span className="cl-header-label">Origem</span>
                                            <span className="cl-header-value">{checklist.origemOrcamento} — {checklist.origemTitulo}</span>
                                        </div>
                                        <div className="cl-header-block">
                                            <span className="cl-header-label">Cliente</span>
                                            <span className="cl-header-value">{fullName}</span>
                                        </div>
                                    </div>

                                    <div className="cl-divider" />

                                    {/* Datas e Vendedor */}
                                    <div className="cl-fields-grid">
                                        <div className="cl-field">
                                            <label className="cl-field-label">Data Emissão</label>
                                            <input type="date" className="cl-input" value={checklist.dataEmissao} onChange={e => handleClChange('dataEmissao', e.target.value)} />
                                        </div>
                                        <div className="cl-field">
                                            <label className="cl-field-label">Data Entrega Prevista</label>
                                            <input type="date" className="cl-input" value={checklist.dataEntrega} onChange={e => handleClChange('dataEntrega', e.target.value)} />
                                        </div>
                                        <div className="cl-field">
                                            <label className="cl-field-label">Vendedor Responsável</label>
                                            <input type="text" className="cl-input" placeholder="Nome do vendedor" value={checklist.vendedor} onChange={e => handleClChange('vendedor', e.target.value)} />
                                        </div>
                                        <div className="cl-field">
                                            <label className="cl-field-label">Forma de Pagamento</label>
                                            <select className="cl-input cl-select" value={checklist.formaPagamento} onChange={e => handleClChange('formaPagamento', e.target.value)}>
                                                <option value="">Selecione</option>
                                                <option value="pix">PIX</option>
                                                <option value="boleto">Boleto</option>
                                                <option value="cartao_credito">Cartão de Crédito</option>
                                                <option value="cartao_debito">Cartão de Débito</option>
                                                <option value="transferencia">Transferência Bancária</option>
                                                <option value="dinheiro">Dinheiro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="cl-divider" />

                                    {/* Tabela de Itens do Checklist */}
                                    <div className="cl-section-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                                        Itens do Pedido
                                        <span className="cl-progress">{checkedItens.length}/{checklist.itens.length} conferidos</span>
                                    </div>

                                    <div className="cl-table-wrap">
                                        <table className="cl-table">
                                            <thead>
                                                <tr>
                                                    <th className="cl-th-check"></th>
                                                    <th>Item / Serviço</th>
                                                    <th className="cl-th-qty">Qtd</th>
                                                    <th className="cl-th-price">Valor Un.</th>
                                                    <th className="cl-th-total">Subtotal</th>
                                                    <th className="cl-th-actions"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {checklist.itens.map((item) => (
                                                    <tr key={item.id} className={item.checked ? "cl-row--checked" : ""}>
                                                        <td className="cl-td-check">
                                                            <button className={`cl-checkbox ${item.checked ? "cl-checkbox--checked" : ""}`} onClick={() => toggleItemCheck(item.id)}>
                                                                {item.checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <input type="text" className="cl-item-input" value={item.descricao} onChange={e => handleItemChange(item.id, 'descricao', e.target.value)} placeholder="Descrição do item" />
                                                        </td>
                                                        <td className="cl-td-qty">
                                                            <input type="number" className="cl-item-input cl-item-input--num" value={item.quantidade} onChange={e => handleItemChange(item.id, 'quantidade', e.target.value)} min="1" />
                                                        </td>
                                                        <td className="cl-td-price">
                                                            <input type="text" className="cl-item-input cl-item-input--num" value={item.precoUnitario.toFixed(2).replace('.', ',')} onChange={e => handleItemChange(item.id, 'precoUnitario', e.target.value.replace(',', '.'))} />
                                                        </td>
                                                        <td className="cl-td-total">
                                                            <span className="cl-subtotal">{formatCurrency(item.quantidade * item.precoUnitario)}</span>
                                                        </td>
                                                        <td className="cl-td-actions">
                                                            <button className="cl-remove-btn" onClick={() => removeClItem(item.id)} title="Remover item">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button className="cl-add-item-btn" onClick={addClItem}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        Adicionar Item
                                    </button>

                                    <div className="cl-divider" />

                                    {/* Resumo de Valores */}
                                    <div className="cl-totals">
                                        <div className="cl-totals-row">
                                            <span>Subtotal ({checkedItens.length} itens conferidos)</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="cl-totals-row">
                                            <label>Frete</label>
                                            <input type="text" className="cl-totals-input" value={checklist.frete.toFixed(2).replace('.', ',')} onChange={e => handleClChange('frete', e.target.value.replace(',', '.'))} placeholder="0,00" />
                                        </div>
                                        <div className="cl-totals-row">
                                            <label>Desconto</label>
                                            <input type="text" className="cl-totals-input" value={checklist.desconto.toFixed(2).replace('.', ',')} onChange={e => handleClChange('desconto', e.target.value.replace(',', '.'))} placeholder="0,00" />
                                        </div>
                                        <div className="cl-totals-row cl-totals-row--final">
                                            <span>Total Geral</span>
                                            <span className="cl-total-final">{formatCurrency(totalGeral)}</span>
                                        </div>
                                    </div>

                                    <div className="cl-divider" />

                                    {/* Condições e Observações */}
                                    <div className="cl-fields-grid cl-fields-grid--full">
                                        <div className="cl-field">
                                            <label className="cl-field-label">Condições de Entrega</label>
                                            <textarea className="cl-textarea" rows="2" placeholder="Ex: Entregar na obra, buscar em loja..." value={checklist.condicoesEntrega} onChange={e => handleClChange('condicoesEntrega', e.target.value)} />
                                        </div>
                                        <div className="cl-field">
                                            <label className="cl-field-label">Observações Gerais</label>
                                            <textarea className="cl-textarea" rows="2" placeholder="Observações adicionais sobre o pedido..." value={checklist.observacoes} onChange={e => handleClChange('observacoes', e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Barra de progresso visual */}
                                    <div className="cl-progress-bar-wrap">
                                        <div className="cl-progress-bar">
                                            <div className="cl-progress-bar__fill" style={{ width: `${checklist.itens.length > 0 ? (checkedItens.length / checklist.itens.length) * 100 : 0}%` }}></div>
                                        </div>
                                        <span className="cl-progress-text">{checklist.itens.length > 0 ? Math.round((checkedItens.length / checklist.itens.length) * 100) : 0}% concluído</span>
                                    </div>

                                    {/* Salvar */}
                                    <div className="cl-save-bar">
                                        <button className={`cl-save-btn ${clSaved ? "cl-save-btn--saved" : ""}`} onClick={handleSalvarChecklist}>
                                            {clSaved ? (
                                                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Salvo com sucesso!</>
                                            ) : (
                                                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg> Salvar Checklist do Pedido</>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* ═══ MODAL: Adicionar / Editar Pagamento ═══ */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <div>
                                <h3 className="modal__title">{editingId !== null ? "Editar Pagamento" : "Novo Pagamento"}</h3>
                                <p className="modal__sub">{editingId !== null ? "Altere as informações do pagamento abaixo." : "Preencha os dados para registrar um novo pagamento."}</p>
                            </div>
                            <button className="modal__close" onClick={closeModal}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
                        </div>
                        <form className="modal__form" onSubmit={handleSubmitForm} noValidate>
                            <div className={`modal-field ${formErrors.descricao ? "modal-field--error" : ""} ${form.descricao ? "modal-field--filled" : ""}`}>
                                <label className="modal-label">Descrição <span className="modal-req">*</span></label>
                                <input type="text" name="descricao" value={form.descricao} onChange={handleFormChange} className="modal-input" placeholder="Ex: Serviço de Consultoria - Junho" maxLength={200} autoFocus />
                                {formErrors.descricao && <span className="modal-err">{formErrors.descricao}</span>}
                            </div>
                            <div className="modal-row">
                                <div className={`modal-field ${formErrors.valor ? "modal-field--error" : ""} ${form.valor ? "modal-field--filled" : ""}`}>
                                    <label className="modal-label">Valor <span className="modal-req">*</span></label>
                                    <div className="modal-input-prefix">
                                        <span className="modal-prefix">R$</span>
                                        <input type="text" name="valor" value={form.valor} onChange={handleValorChange} className="modal-input modal-input--currency" placeholder="0,00" />
                                    </div>
                                    {formErrors.valor && <span className="modal-err">{formErrors.valor}</span>}
                                </div>
                                <div className={`modal-field ${formErrors.data ? "modal-field--error" : ""} ${form.data ? "modal-field--filled" : ""}`}>
                                    <label className="modal-label">Data <span className="modal-req">*</span></label>
                                    <input type="date" name="data" value={form.data} onChange={handleFormChange} className="modal-input" />
                                    {formErrors.data && <span className="modal-err">{formErrors.data}</span>}
                                </div>
                            </div>
                            <div className={`modal-field ${form.status ? "modal-field--filled" : ""}`}>
                                <label className="modal-label">Status</label>
                                <div className="modal-status-group">
                                    <label className={`modal-status-option ${form.status === "pago" ? "modal-status-option--active modal-status-option--pago" : ""}`}><input type="radio" name="status" value="pago" checked={form.status === "pago"} onChange={handleFormChange} /><span className="modal-status-dot modal-status-dot--pago"></span>Pago</label>
                                    <label className={`modal-status-option ${form.status === "pendente" ? "modal-status-option--active modal-status-option--pendente" : ""}`}><input type="radio" name="status" value="pendente" checked={form.status === "pendente"} onChange={handleFormChange} /><span className="modal-status-dot modal-status-dot--pendente"></span>Pendente</label>
                                    <label className={`modal-status-option ${form.status === "vencido" ? "modal-status-option--active modal-status-option--vencido" : ""}`}><input type="radio" name="status" value="vencido" checked={form.status === "vencido"} onChange={handleFormChange} /><span className="modal-status-dot modal-status-dot--vencido"></span>Vencido</label>
                                </div>
                            </div>
                            <div className="modal__actions">
                                <button type="button" className="modal-btn modal-btn--ghost" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="modal-btn modal-btn--primary">
                                    {editingId !== null ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Salvar Alterações</>) : (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Registrar Pagamento</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PGBTDetalhe;