import "../css/PGBTEditarC.css";
import React, { useState, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function InputField({ icon, label, value, onChange, type = "text", placeholder }) {
    return (
        <div className="input-field">
            <label className="input-field__label">
                <span className="input-field__icon">{icon}</span>
                {label}
            </label>
            <input
                className="input-field__input"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

function PGBTSalvar() {
    const setSalvar = () => {
        // Lógica para salvar as alterações do cliente
        alert('Cliente salvo com sucesso!');
    }
}

function PGBTEditar() {
    const { clienteSelecionado } = useContext(AuthContext);

    const [form, setForm] = useState({
        firstname: clienteSelecionado?.name?.firstname ?? '',
        lastname:  clienteSelecionado?.name?.lastname  ?? '',
        email:     clienteSelecionado?.email           ?? '',
        status:    clienteSelecionado?.status          ?? 'Ativo',
        endereco:  clienteSelecionado?.endereco        ?? '',
    });

    if (!clienteSelecionado) {
        return (
            <div className="detail-page">
                <div className="detail-empty">
                    <span>◎</span>
                    <p>Nenhum cliente selecionado.</p>
                    <Link to="/clienti">
                        <button className="btn-back">← Voltar</button>
                    </Link>
                </div>
            </div>
        );
    }

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const fullName = `${form.firstname} ${form.lastname}`.trim();

    return (
        <div className="detail-page">
            <div className="detail-container">

                {/* ── Header ── */}
                <div className="detail-header">
                    <p className="detail-header__eyebrow">Gestão de Clientes</p>
                    <h1 className="detail-header__title">Editar Cliente</h1>
                    <p className="detail-header__sub">
                        Alterando informações de <strong>{clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}</strong>
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="detail-card">

                    {/* Hero */}
                    <div className="detail-card__hero">
                        <div className="detail-avatar">
                            {form.firstname[0]}{form.lastname[0]}
                        </div>
                        <div>
                            <h2 className="detail-card__name">{fullName || '—'}</h2>
                            <span className="badge badge--ativo">
                                <span className="badge__dot" /> Ativo
                            </span>
                        </div>
                    </div>

                    <div className="detail-divider" />

                    {/* Form */}
                    <div className="edit-form">

                        <div className="edit-form__row">
                            <InputField
                                icon="👤"
                                label="Primeiro Nome"
                                value={form.firstname}
                                onChange={set('firstname')}
                                placeholder="Ex: João"
                            />
                            <InputField
                                icon="👤"
                                label="Segundo Nome"
                                value={form.lastname}
                                onChange={set('lastname')}
                                placeholder="Ex: Silva"
                            />
                        </div>

                        <div className="edit-form__preview">
                            Nome completo: <strong>{fullName || '—'}</strong>
                        </div>

                        <InputField
                            icon="✉️"
                            label="E-mail"
                            value={form.email}
                            onChange={set('email')}
                            type="email"
                            placeholder="Ex: joao@email.com"
                        />

                        <InputField
                            icon="📋"
                            label="Status"
                            value={form.status}
                            onChange={set('status')}
                            placeholder="Ex: Ativo"
                        />

                        <InputField
                            icon="📍"
                            label="Endereço"
                            value={form.endereco}
                            onChange={set('endereco')}
                            placeholder="Ex: Rua das Flores, 123"
                        />
                    </div>

                    <div className="detail-divider" />

                    {/* Actions */}
                    <div className="detail-actions">
                        <Link to="/clienti" className="link-clean">
                            <button className="btn-action btn-action--back">← Voltar</button>
                        </Link>
                        <button className="btn-action btn-action--save" onClick={PGBTSalvar}>💾 Salvar</button>
                        <button className="btn-action btn-action--delete">🗑 Excluir</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PGBTEditar;



{/*import "../css/PGBTEditarC.css";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function PGBTEditar() {
    const { clienteSelecionado, setAddCliente } = useContext(AuthContext);
    return (
        <>
            <div className="CXTTTD">
                <h1>Detalhes do Cliente</h1>
                <h3>Aqui você pode fazer alterções referente ao cliente:  {clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}</h3>

                <div className="CXTDetalhe">
                    {clienteSelecionado && (
                        <div className='CXDetalhe'>
                            <br />
                            <hr className="HRLinha" />

                            <div className='CXDetalheInfo CXDetalhe254'>
                                <h4>Primeiro Nome:</h4><input type="text" value={clienteSelecionado.name.firstname} />
                                <h4>Segundo Nome:</h4><input type="text" value={clienteSelecionado.name.lastname} />
                                <br/>
                                <span>Nome Completo: {clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}</span>
                                
                            </div>
                            <div className='CXDetalheCPF CXDetalhe254'>
                                <h4>Email:</h4><input type="text" value={clienteSelecionado.email} />
                                {clienteSelecionado.email}
                            </div>
                            <div className='CXDetalheStatus CXDetalhe254'>
                                <h4>Status:</h4><input type="text" value={clienteSelecionado.status} />
                                Ativo
                            </div>
                            <div className='CXDetalheOutro CXDetalhe254'>
                                <h4>Endereço:</h4><input type="text" value={clienteSelecionado.endereco} />
                                efjoejoe efojeofj
                            </div>
                        </div>
                    )}

                    <hr className="HRLinha" />

                    <div className='CXDetalheBTNS'>
                        <Link className='text' to="/clienti"><button className='BTNCDDDD0 Voltar'>Voltar</button></Link>
                        <button className='BTNCDDDD0 ED0'>Salvar</button>
                        <button className='BTNCDDDD0 EX0'>Excluir</button>
                    </div>
                </div>

            </div>
        </>
    );
}
export default PGBTEditar;*/}