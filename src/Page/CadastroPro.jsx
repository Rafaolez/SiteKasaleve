import '../css/CadastroPro.css';
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

export default CradastroPro;