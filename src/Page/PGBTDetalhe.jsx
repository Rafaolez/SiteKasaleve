
import "../css/PGTDetalhe.css";
import React, { useContext } from 'react';
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

function PGBTDetalhe() {
    const { clienteSelecionado } = useContext(AuthContext);

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

    const { name, email } = clienteSelecionado;
    const fullName = `${name.firstname} ${name.lastname}`;
    const initials = `${name.firstname[0] ?? ''}${name.lastname[0] ?? ''}`.toUpperCase();

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

                {/* ── Card ── */}
                <div className="detail-card">

                    {/* Hero */}
                    <div className="detail-card__hero">
                        <div className="detail-avatar">{initials}</div>
                        <div>
                            <h2 className="detail-card__name">{fullName}</h2>
                            <span className="badge badge--ativo">
                                <span className="badge__dot" /> Ativo
                            </span>
                        </div>
                    </div>

                    <div className="detail-divider" />

                    {/* Info rows */}
                    <div className="detail-info">
                        <InfoRow icon="👤" label="Nome completo" value={fullName} />
                        <InfoRow icon="✉️" label="E-mail"        value={email} />
                        <InfoRow icon="📋" label="Status"        value="Ativo" />
                        <InfoRow icon="📍" label="Endereço"      value="efjoejoe efojeofj" />
                    </div>

                    <div className="detail-divider" />

                    {/* Actions */}
                    <div className="detail-actions">
                        <Link to="/clienti" className="link-clean">
                            <button className="btn-action btn-action--back">← Voltar</button>
                        </Link>
                        <Link to="/editarCliente" className="link-clean">
                            <button className="btn-action btn-action--edit">✏️ Editar</button>
                        </Link>
                        <button className="btn-action btn-action--delete">🗑 Excluir</button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default PGBTDetalhe;




{/*import "../css/PGTDetalhe.css";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function PGBTDetalhe() {
    const { clienteSelecionado, setAddCliente } = useContext(AuthContext);
    return (
        <>
            <div className="CXTTTD">
                <h1>Detalhes do Cliente</h1>
                <p>Aqui você pode encontrar informações detalhadas sobre o cliente selecionado.</p>

                <div className="CXTDetalhe">
                    {clienteSelecionado && (
                        <div className='CXDetalhe'>
                            <div className='CXDetalheInfo0 CXDetalhe254 Text' >
                                {clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}
                            </div>
                            <hr className="HRLinha" />
                            <div className='CXDetalheInfo CXDetalhe254'>
                                <h4>Nome:</h4>{clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}
                            </div>
                            <div className='CXDetalheCPF CXDetalhe254'>
                                <h4>Email:</h4>{clienteSelecionado.email}
                            </div>
                            <div className='CXDetalheStatus CXDetalhe254'>
                                <h4>Status:</h4>Ativo
                            </div>
                            <div className='CXDetalheOutro CXDetalhe254'>
                                <h4>Endereço:</h4> efjoejoe efojeofj
                            </div>
                        </div>
                    )}

                     <hr className="HRLinha"/>   

                    <div className='CXDetalheBTNS'>
                    <Link className='text' to="/clienti"><button className='BTNCDDDD0 Voltar'>Voltar</button></Link>
                    <Link className='text' to="/editarCliente"><button className='BTNCDDDD0 ED0'>Editar</button></Link>
                    <button className='BTNCDDDD0 EX0'>Excluir</button>
                </div>
                </div>

            </div>
        </>
    );
}
export default PGBTDetalhe;*/}