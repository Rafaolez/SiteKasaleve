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

// ── Dados falsos iniciais ──
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
        data: "10/04/2025", validade: "10/05/2025", valor: 22000.0, status: "pendente",
        itens: ["Módulo financeiro", "Módulo RH", "Dashboard analítico", "Integração API"]
    },
    {
        id: "ORC-2025-0031", titulo: "Manutenção Corretiva - Servidor",
        data: "15/03/2025", validade: "15/04/2025", valor: 1200.0, status: "recusado",
        itens: ["Diagnóstico de segurança", "Atualização de dependências"]
    },
];

function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}

function PGBTDetalhe() {
    const { clienteSelecionado } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("relatorio");
    const [relatorio, setRelatorio] = useState(initialRelatorio);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [form, setForm] = useState({
        descricao: "", valor: "", data: "", status: "pendente"
    });

    // ── Calculados ──
    const totalRecebido = relatorio.pagamentos.filter(p => p.status === "pago").reduce((s, p) => s + p.valor, 0);
    const totalPendente = relatorio.pagamentos.filter(p => p.status === "pendente").reduce((s, p) => s + p.valor, 0);
    const totalVencido = relatorio.pagamentos.filter(p => p.status === "vencido").reduce((s, p) => s + p.valor, 0);

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
        setForm({
            descricao: pag.descricao,
            valor: String(pag.valor),
            data: pag.data,
            status: pag.status
        });
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
            // Editar
            setRelatorio(prev => ({
                ...prev,
                pagamentos: prev.pagamentos.map(p =>
                    p.id === editingId
                        ? { ...p, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status }
                        : p
                )
            }));
        } else {
            // Adicionar
            const newId = Math.max(0, ...relatorio.pagamentos.map(p => p.id)) + 1;
            setRelatorio(prev => ({
                ...prev,
                pagamentos: [
                    { id: newId, descricao: form.descricao.trim(), valor: valorNum, data: form.data, status: form.status },
                    ...prev.pagamentos
                ]
            }));
        }

        closeModal();
    }

    function handleDeletePayment(id) {
        setRelatorio(prev => ({
            ...prev,
            pagamentos: prev.pagamentos.filter(p => p.id !== id)
        }));
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
                    SEÇÃO: Relatórios / Orçamentos
                ══════════════════════════════════════ */}
                <div className="detail-card report-card">
                    <div className="report-card__header">
                        <div className="report-card__header-left">
                            <h3 className="report-card__title">Histórico Financeiro</h3>
                            <p className="report-card__sub">Acompanhe pagamentos e orçamentos deste cliente</p>
                        </div>
                        <button className="report-card__export">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Exportar
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="report-tabs">
                        <button className={`report-tab ${activeTab === "relatorio" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("relatorio")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                            Relatório de Pagamentos
                        </button>
                        <button className={`report-tab ${activeTab === "orcamento" ? "report-tab--active" : ""}`} onClick={() => setActiveTab("orcamento")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Orçamentos
                        </button>
                    </div>

                    {/* ═══ Relatório ═══ */}
                    {activeTab === "relatorio" && (
                        <div className="report-content">
                            {/* Resumo */}
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

                            {/* Barra de ações da tabela */}
                            <div className="report-table-actions">
                                <span className="report-table-actions__count">
                                    {relatorio.pagamentos.length} registro{relatorio.pagamentos.length !== 1 ? "s" : ""}
                                </span>
                                <button className="report-add-btn" onClick={openAddModal}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Adicionar Pagamento
                                </button>
                            </div>

                            {/* Tabela */}
                            {relatorio.pagamentos.length === 0 ? (
                                <div className="report-empty">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    <p>Nenhum pagamento registrado.</p>
                                    <button className="report-add-btn" onClick={openAddModal}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        Adicionar primeiro pagamento
                                    </button>
                                </div>
                            ) : (
                                <div className="report-table-wrap">
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Descrição</th>
                                                <th>Valor</th>
                                                <th>Data</th>
                                                <th>Status</th>
                                                <th className="report-table__th-actions">Ações</th>
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
                                                            {pag.status === "pago" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                                            {pag.status === "pendente" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                                                            {pag.status === "vencido" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                                                            {pag.status.charAt(0).toUpperCase() + pag.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="report-table__td-actions">
                                                        <button className="row-btn row-btn--edit" title="Editar" onClick={() => openEditModal(pag)}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        </button>
                                                        <button className="row-btn row-btn--delete" title="Excluir" onClick={() => handleDeletePayment(pag.id)}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ Orçamentos ═══ */}
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
                                                    {orc.status === "aprovado" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                                    {orc.status === "pendente" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                                                    {orc.status === "recusado" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                                                    {orc.status === "aprovado" ? "Aprovado" : orc.status === "pendente" ? "Pendente" : "Recusado"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="orcamento-item__itens">
                                            {orc.itens.map((item, i) => <span key={i} className="orcamento-item__tag">{item}</span>)}
                                        </div>
                                        <div className="orcamento-item__dates">
                                            <span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                Emitido: {orc.data}
                                            </span>
                                            <span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                Validade: {orc.validade}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ══════════════════════════════════════
                MODAL: Adicionar / Editar Pagamento
            ══════════════════════════════════════ */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="modal__header">
                            <div>
                                <h3 className="modal__title">
                                    {editingId !== null ? "Editar Pagamento" : "Novo Pagamento"}
                                </h3>
                                <p className="modal__sub">
                                    {editingId !== null
                                        ? "Altere as informações do pagamento abaixo."
                                        : "Preencha os dados para registrar um novo pagamento."}
                                </p>
                            </div>
                            <button className="modal__close" onClick={closeModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form className="modal__form" onSubmit={handleSubmitForm} noValidate>
                            <div className={`modal-field ${formErrors.descricao ? "modal-field--error" : ""} ${form.descricao ? "modal-field--filled" : ""}`}>
                                <label className="modal-label">Descrição <span className="modal-req">*</span></label>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={form.descricao}
                                    onChange={handleFormChange}
                                    className="modal-input"
                                    placeholder="Ex: Serviço de Consultoria - Junho"
                                    maxLength={200}
                                    autoFocus
                                />
                                {formErrors.descricao && <span className="modal-err">{formErrors.descricao}</span>}
                            </div>

                            <div className="modal-row">
                                <div className={`modal-field ${formErrors.valor ? "modal-field--error" : ""} ${form.valor ? "modal-field--filled" : ""}`}>
                                    <label className="modal-label">Valor <span className="modal-req">*</span></label>
                                    <div className="modal-input-prefix">
                                        <span className="modal-prefix">R$</span>
                                        <input
                                            type="text"
                                            name="valor"
                                            value={form.valor}
                                            onChange={handleValorChange}
                                            className="modal-input modal-input--currency"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    {formErrors.valor && <span className="modal-err">{formErrors.valor}</span>}
                                </div>

                                <div className={`modal-field ${formErrors.data ? "modal-field--error" : ""} ${form.data ? "modal-field--filled" : ""}`}>
                                    <label className="modal-label">Data <span className="modal-req">*</span></label>
                                    <input
                                        type="date"
                                        name="data"
                                        value={form.data}
                                        onChange={handleFormChange}
                                        className="modal-input"
                                    />
                                    {formErrors.data && <span className="modal-err">{formErrors.data}</span>}
                                </div>
                            </div>

                            <div className={`modal-field ${form.status ? "modal-field--filled" : ""}`}>
                                <label className="modal-label">Status</label>
                                <div className="modal-status-group">
                                    <label className={`modal-status-option ${form.status === "pago" ? "modal-status-option--active modal-status-option--pago" : ""}`}>
                                        <input type="radio" name="status" value="pago" checked={form.status === "pago"} onChange={handleFormChange} />
                                        <span className="modal-status-dot modal-status-dot--pago"></span>
                                        Pago
                                    </label>
                                    <label className={`modal-status-option ${form.status === "pendente" ? "modal-status-option--active modal-status-option--pendente" : ""}`}>
                                        <input type="radio" name="status" value="pendente" checked={form.status === "pendente"} onChange={handleFormChange} />
                                        <span className="modal-status-dot modal-status-dot--pendente"></span>
                                        Pendente
                                    </label>
                                    <label className={`modal-status-option ${form.status === "vencido" ? "modal-status-option--active modal-status-option--vencido" : ""}`}>
                                        <input type="radio" name="status" value="vencido" checked={form.status === "vencido"} onChange={handleFormChange} />
                                        <span className="modal-status-dot modal-status-dot--vencido"></span>
                                        Vencido
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="modal__actions">
                                <button type="button" className="modal-btn modal-btn--ghost" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="modal-btn modal-btn--primary">
                                    {editingId !== null ? (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            Salvar Alterações
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            Registrar Pagamento
                                        </>
                                    )}
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