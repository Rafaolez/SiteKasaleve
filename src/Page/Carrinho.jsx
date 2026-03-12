import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
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
                                <p>Escolha as Cores do Produto X:</p>
                                <div className="Inputittt">
                                    <label className="EscritsInputCor">
                                        Seleciona a Cor do Aluminio:
                                        <select className="EscritsInputSelectCor" name="SelecioinaCor">
                                            <option value="Cor1">Cor 1</option>
                                            <option value="Cor2">Cor 2</option>
                                            <option value="Cor3">Cor 3</option>
                                        </select>
                                    </label>

                                    <label className="EscritsInputCor">
                                        Seleciona a Cor do Aluminio:
                                        <select className="EscritsInputSelectCor" name="SelecioinaCor">
                                            <option value="Cor1">Cor 1</option>
                                            <option value="Cor2">Cor 2</option>
                                            <option value="Cor3">Cor 3</option>
                                        </select>
                                    </label>

                                    <label className="EscritsInputCor">
                                        Seleciona a Cor do Aluminio:
                                        <select className="EscritsInputSelectCor" name="SelecioinaCor">
                                            <option value="Cor1">Cor 1</option>
                                            <option value="Cor2">Cor 2</option>
                                            <option value="Cor3">Cor 3</option>
                                        </select>
                                    </label>

                                </div>
                            </div>
                        </div>
                        <button className="btnVerCorEsco">Ver Cor Escolhida</button>
                    </div>


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
