import "../css/PGBTEditarC.css";
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
export default PGBTEditar;