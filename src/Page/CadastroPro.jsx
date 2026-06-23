import '../css/CadastroPro.css';
import React, { useContext, useEffect, useState } from 'react';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import { AuthContext } from "./Context/AuthContext";

function StatusBadge({ label, type = 'default' }) {
    return <span className={`badge badge--${type}`}><span className="badge__dot" />{label}</span>;
}

function SkeletonRow() {
    return (
        <div className="table-row table-row--skeleton">
            <div className="skeleton skeleton--img" />
            <div className="skeleton-lines">
                <div className="skeleton skeleton--line" />
                <div className="skeleton skeleton--line-sm" />
            </div>
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--block" />
            <div className="skeleton skeleton--line" />
        </div>
    );
}

function CradastroPro() {
    const { loggedin } = useContext(AuthContext);
    const [produto, setProduto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    async function getProduto() {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            const json = await res.json();
            setProduto(json);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getProduto(); }, []);

    if (!loggedin) {
        return (
            <div className="detail-page">
                <MenuPage />
                <div className="detail-empty">
                    <span>🔒</span>
                    <p>Você precisa estar logado para acessar esta página.</p>
                    <BTNVolta />
                </div>
            </div>
        );
    }

    const filtered = produto.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (<><MenuPage />
        <div className="detail-page">

            <div className="products-container">

                {/* ── Header ── */}
                <div className="page__header">
                    <div className="page__header-left">
                        <BTNVolta />
                        <div className="page__title-group">
                            <p className="page__eyebrow">Gestão de Produtos</p>
                            <h1 className="page__title">Produtos</h1>
                        </div>
                    </div>
                    <button className="btn-primary">+ Novo Produto</button>
                </div>

                {/* ── Stats ── */}
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-card__icon">📦</span>
                        <div>
                            <p className="stat-card__label">Total</p>
                            <p className="stat-card__value">{produto.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">🏷️</span>
                        <div>
                            <p className="stat-card__label">Categorias</p>
                            <p className="stat-card__value">{[...new Set(produto.map(p => p.category))].length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">✅</span>
                        <div>
                            <p className="stat-card__label">Ativos</p>
                            <p className="stat-card__value">{produto.length}</p>
                        </div>
                    </div>
                </div>

                {/* ── Search ── */}
                <div className="toolbar">
                    <div className="search-box">
                        <span className="search-box__icon">🔍</span>
                        <input
                            className="search-box__input"
                            type="text"
                            placeholder="Buscar por nome ou categoria…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="table-wrap">
                    <div className="table-head products-grid">
                        <span>Produto</span>
                        <span>Preço</span>
                        <span>Descrição</span>
                        <span>Categoria</span>
                        <span>Ações</span>
                    </div>

                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : filtered.length === 0 ? (
                        <div className="table-empty">
                            <span>◎</span>
                            <p>Nenhum produto encontrado</p>
                        </div>
                    ) : (
                        filtered.map((item, i) => (
                            <div
                                className="table-row products-grid"
                                key={item.id}
                                style={{ animationDelay: `${i * 0.03}s` }}
                            >
                                {/* Produto */}
                                <div className="table-row__name">
                                    <div className="product-img-wrap">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="product-img"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div>
                                        <p className="table-row__fullname">{item.title}</p>
                                        <p className="table-row__id">#{item.id}</p>
                                    </div>
                                </div>

                                {/* Preço */}
                                <div className="product-price">
                                    R$ {item.price.toFixed(2)}
                                </div>

                                {/* Descrição */}
                                <div className="product-desc">
                                    {item.description}
                                </div>

                                {/* Categoria */}
                                <div>
                                    <StatusBadge label={item.category} type="blue" />
                                </div>

                                {/* Ações */}
                                <div className="table-row__actions">
                                    <button className="btn-action btn-action--detail">👁 Detalhes</button>
                                    <button className="btn-action btn-action--edit">✏️ Editar</button>
                                    <button className="btn-action btn-action--delete">🗑</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <p className="table-count">{filtered.length} de {produto.length} produtos</p>
            </div>
        </div>
    </>
    );
}

export default CradastroPro;






{/*import '../css/CadastroPro.css';
import React, { useContext, useEffect } from 'react';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Logo from '../Imagens/LogoKasaLeveBranca.png';
import { AuthContext } from "./Context/AuthContext";

function CradastroPro() {
    const { loggedin } = useContext(AuthContext);
    const [produto, setProduto] = React.useState([]);

    async function getProduto() {
        await fetch('https://fakestoreapi.com/products', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                setProduto(json);
            })

            .catch(err => console.log(err))
    }

    useEffect(() => {
        getProduto();
    }, []);

    if (!loggedin) {
        return (
            <div className="body">
                <BTNVolta />
                <h2>Você precisa estar logado para acessar esta página.</h2>
            </div>

        );
    }

    return (
        <>
            <div className="CadastroPro">
                <div><MenuPage /></div>
                <div><BTNVolta /></div>
                <div className='Produto'>
                    <div className='ConteudiProduto'>
                        <div className='PR  FotoProduto FotoProdtText'> <h3>Foto</h3></div>
                        <hr />
                        <div className='PR ProdutoNameText'>
                            <h3>Nome do Cliente:</h3>
                        </div>
                        <hr />
                        <div className='PR PriceText'>
                            <h3>Preço</h3>
                        </div>
                        <hr />
                        <div className='PR DescricaoText'>
                            <h3>Descricao</h3>
                        </div>
                        <hr />
                        <div className='Btn321Produto'>
                            <h2></h2>
                        </div>
                    </div>
                    {produto.map((item) => (
                        <div className='ConteudoProdutoApi' key={item.id}>
                            <div className=' FotoProduto FotoProdtText'>  <img src={Logo} alt="Logo" className="ImgProdct" /> </div>
                            <hr />
                            <div className='PR ProdutoNamePro ProdutoNameText'>{item.title} </div>
                            <hr />
                            <div className='PR Price PriceText'> {item.price} </div>
                            <hr />
                            <div className='PR DescricaoText DescricaoPro'> {item.description} </div>
                            <hr />
                            <div className='Btn321Produto'>
                                <button className='BTNCP DE'>Detalhes</button>
                                <button className='BTNCP ED'>Editar</button>
                                <button className='BTNCP EX'>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CradastroPro;*/}