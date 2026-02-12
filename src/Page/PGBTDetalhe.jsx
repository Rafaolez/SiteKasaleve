import "../css/PGTDetalhe.css";
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
                    <button className='BTNCDDDD0 ED0'>Editar</button>
                    <button className='BTNCDDDD0 EX0'>Excluir</button>
                </div>
                </div>

            </div>
        </>
    );
}
export default PGBTDetalhe;