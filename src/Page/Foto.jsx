import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import "../css/Foto.css";
import React, { useState } from 'react';
import FTList from "../components/FTList";
import IMG1 from "../Imagens/IMG_Foto_Mesa.jpg";
import IMG2 from "../Imagens/IMG_Foto_Sofa.jpg";
import IMG3 from "../Imagens/IMG_Foto_Chaise.jpg";
import IMG4 from "../Imagens/IMG_Foto_Espreguisadeira.jpg";
import IMG5 from "../Imagens/IMG_Foto_Banqueta.jpg";
import IMG6 from "../Imagens/IMG_Foto_Balanco.jpg";
import IMG7 from "../Imagens/IMG_Foto_Ombrelone.jpg";
import IMG8 from "../Imagens/IMG_Foto_AssesorioFino.jpg";
import IMG9 from "../Imagens/IMG_Foto_Tapete.png";
import IMG10 from "../Imagens/IMG_Foto_CamaPet.jpg";
import IMG11 from "../Imagens/IMG_Foto_ProjetoFino.png";
import IMG12 from "../Imagens/IMG_Foto_ProjetoEspecial.png";
import IMG13 from "../Imagens/LogoKasaLeveBranca.png";
import IMG14 from "../Imagens/IMG_Foto_Cores.jpg";
import IMG15 from "../Imagens/IMG_Foto_TipoDeTampo.jpg";

function Foto() {
    const [hovered, setHovered] = useState(null);

    const fotos = [
        {
            categoria: "mesas",
            link: "https://photos.app.goo.gl/KMZRi2ByHVrPhSra6",
            img: IMG1,
            titulo: "Fotos de Mesa e Cadeiras"
        },
        {
            categoria: "sofas",
            link: "https://photos.app.goo.gl/FPz2LaJ85cn3tH1H8",
            img: IMG2,
            titulo: "Fotos de Sofas"
        },
        {
            categoria: "chaise",
            link: "https://photos.app.goo.gl/iPPVpmTTGoM9gNb56",
            img: IMG3,
            titulo: "Fotos de Chaise"
        },
        {
            categoria: "espreguisadeira",
            link: "https://photos.app.goo.gl/ywdRuDY7oa4g7u5B6",
            img: IMG4,
            titulo: "Fotos de Espreguisadeira"
        },
        {
            categoria: "banqueta",
            link: "https://photos.app.goo.gl/YnpgrCUcGvG69qhJ9",
            img: IMG5,
            titulo: "Fotos de Banqueta"
        },
        {
            categoria: "bistro",
            link: "https://photos.app.goo.gl/g3jsWPn1TPq5b12C8",
            img: IMG5,
            titulo: "Fotos de Bistro"
        },
        {
            categoria: "balanco",
            link: "https://photos.app.goo.gl/9PbsepbP2kuCEeQN6",
            img: IMG6,
            titulo: "Fotos de Balanco"
        },
        {
            categoria: "obrelone",
            link: "https://photos.app.goo.gl/KVFnPaBfQ4PJqmpy5",
            img: IMG7,
            titulo: "Fotos de Ombrelone"
        },
        {
            categoria: "assesoriofino",
            link: "https://photos.app.goo.gl/4jX17aRoqtA3nEjK8",
            img: IMG8,
            titulo: "Fotos de Assesorio Fino"
        },
        {
            categoria: "tapete",
            link: "https://photos.app.goo.gl/yrzQtSNRqp6pdk34A",
            img: IMG9,
            titulo: "Fotos de Tapete"
        },
        {
            categoria: "camapet",
            link: "https://photos.app.goo.gl/xkAWstynDKChhRPfA",
            img: IMG10,
            titulo: "Fotos de Cama Pet"
        },
        {
            categoria: "projetoCorporativo",
            link: "https://photos.app.goo.gl/TJ7qekib4xXzNp639",
            img: IMG11,
            titulo: "Fotos de Projeto Corporativo"
        },
        {
            categoria: "projetoEspecial",
            link: "https://photos.app.goo.gl/xkAWstynDKChhRPfA",
            img: IMG12,
            titulo: "Fotos de Projeto Especial"
        },
        {
            categoria: "video",
            link: "https://photos.app.goo.gl/oSZ2mfRgmpJRna5c8",
            img: IMG13,
            titulo: "Video Kasaleve"
        },
        {
            categoria: "cores",
            link: "https://photos.app.goo.gl/WXJPijzaF2DeDRhr7",
            img: IMG14,
            titulo: "Foto Cores"
        },
        {
            categoria: "tipoTampo",
            link: "https://photos.app.goo.gl/NSPgDKANAfSBQQn18",
            img: IMG15,
            titulo: "Fotos de Tipo de Tampo"
        },
    ];

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
                    <div className="CXFotos">
                        {fotos.map(foto => (
                            <FTList
                                key={foto.categoria}
                                {...foto}
                                hovered={hovered}
                                setHovered={setHovered}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Foto;