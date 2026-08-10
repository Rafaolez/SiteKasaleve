import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import '../css/Estoque.css';
import MenuDeLado from '../components/MenuDeLado';
import MenuPage from '../components/MenuPage';
import { AuthContext } from "./Context/AuthContext";

const mockProdutos = [
    { id: 1, nome: 'Cadeira Gold', codigo: 'CD-001', categoria: 'Cadeiras', estoque: 24, status: 'Disponível', valor: 'R$ 450,00', ultimaMod: '12/05, 14:30' },
    { id: 2, nome: 'Cadeira Comfort', codigo: 'CD-002', categoria: 'Cadeiras', estoque: 4, status: 'Estoque baixo', valor: 'R$ 320,00', ultimaMod: '10/05, 09:15' },
    { id: 3, nome: 'Mesa de Jantar 6 Lugares', codigo: 'MS-005', categoria: 'Mesas', estoque: 0, status: 'Sem estoque', valor: 'R$ 1.200,00', ultimaMod: '08/05, 16:45' },
    { id: 4, nome: 'Sofá 3 Lugares', codigo: 'SF-010', categoria: 'Sofás', estoque: 12, status: 'Disponível', valor: 'R$ 1.850,00', ultimaMod: '11/05, 11:00' },
];

const mockCategorias = ['Cadeiras', 'Mesas', 'Sofás', 'Armários', 'Escrivaninhas'];

function Estoque() {
    /*const { loggedin } = useContext(AuthContext);
    const [role] = useState(() => localStorage.getItem('role') || '');
    const cargosPermitidos = ['Programador', 'Chefa', 'GerenteVendas'];
    const [modalEstoqueBaixo, setModalEstoqueBaixo] = useState(false);
    const [modalCategorias, setModalCategorias] = useState(false);

    if (!loggedin) {
        return (
            <div className="cpro-detail-page">
                <MenuPage />
                <div className="detail-empty">
                    <span>🔒</span>
                    <p>Você precisa estar logado para acessar esta página.</p>
                </div>
            </div>
        );
    }

    // PADRONIZAÇÃO: Converte tudo para minúsculo e remove espaços antes de comparar
    const roleFormatado = role.toLowerCase().trim();
    const cargosFormatados = cargosPermitidos.map(cargo => cargo.toLowerCase().trim());

    if (!cargosFormatados.includes(roleFormatado)) {
        return (
            <div className="cpro-detail-page">
                <MenuPage />
                <div className="detail-empty">
                    <p>Acesso Restrito. Você não tem permissão para visualizar esta página.</p>
                </div>
            </div>
        );
    }*/

    // 1. Puxe AMBOS do Contexto (não use localStorage aqui)
    const { loggedin, role } = useContext(AuthContext);
    
    // 2. REMOVA esta linha de baixo:
    // const [role] = useState(() => localStorage.getItem('role') || '');
    
    const cargosPermitidos = ['Programador', 'Chefa', 'GerenteVendas'];
    const [modalEstoqueBaixo, setModalEstoqueBaixo] = useState(false);
    const [modalCategorias, setModalCategorias] = useState(false);

    if (!loggedin) {
        return (
            <div className="cpro-detail-page">
                <MenuPage />
                <div className="detail-empty">
                    <span>🔒</span>
                    <p>Você precisa estar logado para acessar esta página.</p>
                </div>
            </div>
        );
    }

    // PADRONIZAÇÃO: Converte tudo para minúsculo e remove espaços antes de comparar
    // Adicionei um fallback (role || '') só para garantir que não dá erro se vier vazio
    const roleFormatado = (role || '').toLowerCase().trim();
    const cargosFormatados = cargosPermitidos.map(cargo => cargo.toLowerCase().trim());

    if (!cargosFormatados.includes(roleFormatado)) {
        return (
            <div className="cpro-detail-page">
                <MenuPage />
                <div className="detail-empty">
                    <p>Acesso Restrito. Você não tem permissão para visualizar esta página.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="estoque-container">
            <MenuDeLado />

            <h1 className="page-title">Estoque</h1>

            {/* Seção de Visores Topo */}
            <div className="cards-dashboard">
                <div className='TotalProduto card-visores'>
                    <span className="card-titulo">Total de Produtos</span>
                    <span className="card-valor">128</span>
                </div>

                <div className='EstoqueBaixo card-visores alerta' onClick={() => setModalEstoqueBaixo(true)}>
                    <span className="card-titulo">Estoque Baixo / Sem Estoque</span>
                    <span className="card-valor">16</span>
                    <span className="card-acao-texto">Clique para ver detalhes</span>
                </div>

                <div className='ValorTotalDeEstoque card-visores'>
                    <span className="card-titulo">Valor Total em Estoque</span>
                    <span className="card-valor">320</span>
                </div>

                <div className='Categoria card-visores clicavel' onClick={() => setModalCategorias(true)}>
                    <span className="card-titulo">Categorias</span>
                    <span className="card-valor">5</span>
                    <span className="card-acao-texto">Clique para listar</span>
                </div>
            </div>

            {/* Seção Principal: Tabela + Ações Rápidas */}
            <div className="estoque-conteudo">
                {/* Coluna da Esquerda - Tabela */}
                <div className="tabela-container">
                    <div className="tabela-cabecalho">
                        <h2>Lista de Produtos</h2>
                        <input type="text" placeholder="Buscar produto..." className="input-busca" />
                    </div>

                    <div className="tabela-scroll">
                        <table className="table-responsive estoque-tabela">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Código</th>
                                    <th>Categoria</th>
                                    <th>Qtd.</th>
                                    <th>Status</th>
                                    <th>Última Modificação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockProdutos.map((item) => (
                                    <tr key={item.id}>
                                        <td data-label="Produto" className="produto-nome">{item.nome}</td>
                                        <td data-label="Código">{item.codigo}</td>
                                        <td data-label="Categoria">{item.categoria}</td>
                                        <td data-label="Qtd.">{item.estoque}</td>
                                        <td data-label="Status">
                                            <span className={`status-etiqueta ${item.status.replace(' ', '-').toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td data-label="Última Modificação" className="texto-suave">{item.ultimaMod}</td>
                                        <td data-label="Ações">
                                            <div className="acoes-botoes-tabela">
                                                <button className="btn-acao-tabela editar" title="Editar">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button className="btn-acao-tabela excluir" title="Excluir">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coluna da Direita - Ações Rápidas */}
                <div className="acoes-rapidas">
                    <h3>Ações Rápidas</h3>
                    <button className="btn-acao primario">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <Link to={"/cadastroPro"}>Cadastrar Novo Produtosss</Link>
                    </button>
                    <button className="btn-acao">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                        Entrada de Produto
                    </button>
                    <button className="btn-acao">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                        Saída de Produto
                    </button>
                    <button className="btn-acao">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Gerar Relatório
                    </button>
                </div>
            </div>

            {/* Modal Estoque Baixo */}
            {modalEstoqueBaixo && (
                <div className="modal-fundo" onClick={() => setModalEstoqueBaixo(false)}>
                    <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                        <h2>Produtos com Estoque Baixo ou Zerado</h2>
                        <p>Estes itens precisam de reposição urgente:</p>
                        <ul className="lista-modal">
                            <li><strong>Cadeira Comfort</strong> - Restam: 4</li>
                            <li><strong>Mesa de Jantar 6 Lugares</strong> - Restam: 0 (Sem estoque)</li>
                        </ul>
                        <button className="btn-fechar" onClick={() => setModalEstoqueBaixo(false)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* Modal Categorias */}
            {modalCategorias && (
                <div className="modal-fundo" onClick={() => setModalCategorias(false)}>
                    <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
                        <h2>Categorias Cadastradas</h2>
                        <ul className="lista-modal">
                            {mockCategorias.map((cat, index) => (
                                <li key={index}>{cat}</li>
                            ))}
                        </ul>
                        <button className="btn-fechar" onClick={() => setModalCategorias(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Estoque;