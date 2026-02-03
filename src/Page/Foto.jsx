import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import "../css/Foto.css";
import { AuthContext } from "./Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';


function Foto() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <MenuPage />
            <div>
                <BTNVolta />
            </div>
            <div className="CXPrincipalFoto">
                <div className="CXConteudoFoto">
                    <h2>Galeria de Fotos</h2>
                    <p>Aqui você pode visualizar todas as fotos relacionadas aos seus projetos e clientes.</p>
                    <div className="FotoCaixamaior">
                        <div className={`card ${isHovered ? 'hovered' : 'FotoCaixaCadeira CXFT'}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)} >
                            <a href="" target="_blank" rel="noopener noreferrer"><img className="IMGFT" src={require('../Imagens/IMG_Foto_Mesa.jpg')} alt="Cadeira" /></a>
                            {isHovered && (
                                <div className="card-info">
                                    <h3>Fotos de Mesa e Cadeiras</h3>
                                    <p>Visualize as fotos das mesas e cadeiras de nossos projetos.</p>
                                </div>
                            )}
                        </div>

                        <div className={`card ${isHovered ? 'hovered' : 'FotoCaixaSofa CXFT'}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)} >
                            <a href="" target="_blank" rel="noopener noreferrer"><img className="IMGFT" src={require('../Imagens/IMG_Foto_Sofa.jpg')} alt="Sofa" /></a>
                            {isHovered && (
                                <div className="card-info">
                                    <h3>Fotos de Mesa e Cadeiras</h3>
                                    <p>Visualize as fotos das mesas e cadeiras de nossos projetos.</p>
                                </div>
                            )}
                        </div>

                        <div className={`card ${isHovered ? 'hovered' : 'FotoCaixaSofa CXFT'}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)} >
                            <a href="" target="_blank" rel="noopener noreferrer"></a>
                            {isHovered && (
                                <div className="card-info">
                                    <h3>Fotos de Mesa e Cadeiras</h3>
                                    <p>Visualize as fotos das mesas e cadeiras de nossos projetos.</p>
                                </div>
                            )}
                        </div>


                        <div className="FotoCaixaSofa CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer"></a>
                        </div>
                        <div className="FotoCaixaChaise CXFT">
                            <a href="https://photos.google.com/albums" target="_blank" rel="noopener noreferrer" ><img className="IMGFT" src={require('../Imagens/IMG_Foto_Chaise.jpg')} alt="Chaise" /></a>
                        </div>
                        <div className="FotoCaixaEspreguicadeira CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaBanqueta CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaBistro CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaBalanco CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaOmbrelone CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaAssesoriosFino CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaTapete CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaCamPet CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaProjetoCorp CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaProjetoEsp CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaViedeos CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaTipoTampo CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                        <div className="FotoCaixaCores CXFT">
                            <a href="" target="_blank" rel="noopener noreferrer">  </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Foto;