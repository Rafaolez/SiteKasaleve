import "../css/carrinho.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import SlectCorCorda from "../components/SlectCorCorda";
import React, { useState } from 'react';
import Hero from "../components/Hero";
import Catalogue from "../components/Catalogo";

const produtos = [
    {
        id: 1,
        nome: "Cadeira Náutica Premium",
        descricao: "Design moderno com acabamento em alumínio e corda náutica.",
        preco: 890.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png",
    },
    {
        id: 2,
        nome: "Poltrona Outdoor",
        descricao: "Conforto e durabilidade para ambientes externos.",
        preco: 1200.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/0894f1dc61428b63aedb64174a7abf93.png",
    },
    {
        id: 3,
        nome: "Chaise Lounge",
        descricao: "Ideal para áreas de lazer e piscinas.",
        preco: 1550.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png",
    },
    {
        id: 4,
        nome: "Cadeira Bistro",
        descricao: "Leve e elegante, perfeita para varandas.",
        preco: 650.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png",
    },
    {
        id: 5,
        nome: "Mesa de Centro",
        descricao: "Acabamento fino em alumínio escovado.",
        preco: 980.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png",
    },
    {
        id: 6,
        nome: "Espreguiçadeira",
        descricao: "Reclinável com tecido resistente à UV.",
        preco: 1390.00,
        img: "https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png",
    },
];

const formatPrice = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ── Tela de produto único ── */
function TelaDetalhe({ produto, onVoltar }) {
    return (
        <div className="detalhe-page">

            {/* Header */}
            <div className="detalhe-header">
                <button className="btn-back-det" onClick={onVoltar}>← Voltar</button>
                <div className="detalhe-header__title-group">
                    <p className="eyebrow">Personalização</p>
                    <h1 className="detalhe-title">{produto.nome}</h1>
                </div>
            </div>

            {/* Body */}
            <div className="detalhe-body">

                {/* Imagem */}
                <div className="detalhe-img-wrap">
                    <img
                        src={produto.img}
                        alt={produto.nome}
                        className="detalhe-img"
                        loading="lazy"
                    />
                    <div className="detalhe-price-tag">{formatPrice(produto.preco)}</div>
                </div>

                {/* Configurador */}
                <div className="detalhe-config">
                    <p className="detalhe-config__label">Escolha as cores</p>
                    <p className="detalhe-config__sub">Personalize cada componente do produto</p>

                    <div className="detalhe-config__fields">
                        <div>
                            <Hero />
                            <Catalogue />
                        </div>
                    </div>

                    <button className="btn-confirmar">
                        🛒 Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Tela principal ── */
function Carrinho() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    if (produtoSelecionado) {
        return (
            <TelaDetalhe
                produto={produtoSelecionado}
                onVoltar={() => setProdutoSelecionado(null)}
            />
        );
    }

    return (
        <div className="loja-page">
            <MenuPage />

            <div className="loja-container">

                {/* Header */}
                <div className="loja-header">
                    <BTNVolta />
                    <div className="loja-header__title-group">
                        <p className="eyebrow">Catálogo</p>
                        <h1 className="loja-title">Nossos Produtos</h1>
                    </div>
                    <p className="loja-count">{produtos.length} produtos</p>
                </div>

                {/* Grid */}
                <div className="loja-grid">
                    {produtos.map((p, i) => (
                        <div
                            className="produto-card"
                            key={p.id}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <div className="produto-card__img-wrap">
                                <img
                                    src={p.img}
                                    alt={p.nome}
                                    className="produto-card__img"
                                    loading="lazy"
                                />
                            </div>
                            <div className="produto-card__body">
                                <p className="produto-card__nome">{p.nome}</p>
                                <p className="produto-card__desc">{p.descricao}</p>
                                <div className="produto-card__footer">
                                    <span className="produto-card__preco">{formatPrice(p.preco)}</span>
                                    <button
                                        className="btn-comprar"
                                        onClick={() => setProdutoSelecionado(p)}
                                    >
                                        Personalizar →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carrinho;



{/*import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import SlectCorCorda from "../components/SlectCorCorda";
import "../css/carrinho.css";
import React, { useState } from 'react';

function Carrinho() {

    const [produtotela, setProdutoTela] = useState(true);


    return (
        <>
            {produtotela ?
                <>
                    <MenuPage />
                    <div>
                        <BTNVolta />
                    </div>
                    <div className="titulo">
                        <div className="caixamaiorprod">
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>

                        </div>
                    </div>

                </>
                :
                <>
                    <div className="caixaMaeCarrinhoV">
                        <div className="caixaPaiMenucarringo">
                            <div className="caixaBTNcarrinho">
                                <button onClick={() => { setProdutoTela(true) }} className="btncomprarvolta">Voltar</button>
                            </div>
                            <div className="caixaH1carrinho">
                                <h1>Produto 1</h1>
                            </div>
                        </div>
                        <div className="caixaPaiImgDetalhesCarrinho">

                            <div className="imgCarrocelCarrinho">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgprodutoDetalhesCarrinho" />
                            </div>


                            <div className="CoresCarrinho">
                                <string className="EscritsInputCor">Escolha as Cores do Produto X:</string>
                                <div className="Inputittt">
                                    <p className="escritaSledt">Cor da Corda Nautica</p>
                                    <SlectCorCorda />
                                    <p className="escritaSledt">Cor do Tecido</p>
                                    <SlectCorCorda />
                                    <p className="escritaSledt">Cor do Aluminio</p>
                                    <SlectCorCorda />
                                </div>
                            </div>
                        </div>
                        {/*<button className="btnVerCorEsco">Ver Cor Escolhida</button>*/
                   /* </div>


                </>
            }
        </>
    );
}
export default Carrinho;









{/* <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/0894f1dc61428b63aedb64174a7abf93.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                       
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                    
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                        
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                        
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                        
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                        
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                            
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>


                            
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/0894f1dc61428b63aedb64174a7abf93.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>
                       
                            <div className="caixaproduto">
                                <img src="https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png" alt="Produto 1" className="imgproduto" />
                                <p>Descrição do Produto 1</p>
                                <p>Preço: R$ 100,00</p>
                                <button onClick={() => { setProdutoTela(false) }} className="btncarrinho btncomprar">Comprar</button>
                            </div>*/}