import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import "../css/Foto.css";
import React, { useState, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import FTList from "../components/FTList";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function Foto() {
    const [hovered, setHovered] = useState(null);
    const { loggedin } = useContext(AuthContext);
    const [filtro, setFiltro] = useState(null);

   {/* const pontos = [
        { lat: -23.55, lng: -46.63, cor: "red", nome: "Julio" },
        { lat: -23.56, lng: -46.64, cor: "blue", nome: "cleber" },
        { lat: -23.57, lng: -46.65, cor: "green", nome: "Clientes" },
    ];*/}

    const mapLegends = [
        { cor: "rgb(2, 136, 209)", Representanti: "Jean & Jorge" },
        { cor: "rgb(230, 81, 0)", Representanti: "Evandro" },
        { cor: "rgb(1, 87, 155)", Representanti: "Bruno F."},
        { cor: "rgb(136, 14, 79)", Representanti: "Risovaldo" },
        { cor: "rgb(66, 66, 66)", Representanti: "Jacson" },
        { cor: "rgb(9, 113, 56)", Representanti: "Juliano P." },
        { cor: "rgb(156, 39, 176)", Representanti: "Tania Regina" },
        { cor: "rgb(255, 234, 0)", Representanti: "Marília" },
    ];

    const fotos = [
        {
            categoria: "mesas",
            link: "https://photos.app.goo.gl/KMZRi2ByHVrPhSra6",
            img: "/Imagens/IMG_Foto_Mesa.jpg",
            titulo: "Fotos de Mesa e Cadeiras"
        },
        {
            categoria: "sofas",
            link: "https://photos.app.goo.gl/FPz2LaJ85cn3tH1H8",
            img: "/Imagens/IMG_Foto_Sofa.jpg",
            titulo: "Fotos de Sofas"
        },
        {
            categoria: "chaise",
            link: "https://photos.app.goo.gl/iPPVpmTTGoM9gNb56",
            img: "/Imagens/IMG_Foto_Chaise.jpg",
            titulo: "Fotos de Chaise"
        },
        {
            categoria: "espreguisadeira",
            link: "https://photos.app.goo.gl/ywdRuDY7oa4g7u5B6",
            img: "/Imagens/IMG_Foto_Espreguisadeira.jpg",
            titulo: "Fotos de Espreguisadeira"
        },
        {
            categoria: "banqueta",
            link: "https://photos.app.goo.gl/YnpgrCUcGvG69qhJ9",
            img: "/Imagens/IMG_Foto_Banqueta.jpg",
            titulo: "Fotos de Banqueta"
        },
        {
            categoria: "bistro",
            link: "https://photos.app.goo.gl/g3jsWPn1TPq5b12C8",
            img: "/Imagens/IMG_Foto_Banqueta.jpg",
            titulo: "Fotos de Bistro"
        },
        {
            categoria: "balanco",
            link: "https://photos.app.goo.gl/9PbsepbP2kuCEeQN6",
            img: "/Imagens/IMG_Foto_Balanco.jpg",
            titulo: "Fotos de Balanco"
        },
        {
            categoria: "obrelone",
            link: "https://photos.app.goo.gl/KVFnPaBfQ4PJqmpy5",
            img: "/Imagens/IMG_Foto_Ombrelone.jpg",
            titulo: "Fotos de Ombrelone"
        },
        {
            categoria: "assesoriofino",
            link: "https://photos.app.goo.gl/4jX17aRoqtA3nEjK8",
            img: "/Imagens/IMG_Foto_AssesorioFino.jpg",
            titulo: "Fotos de Assesorio Fino"
        },
        {
            categoria: "tapete",
            link: "https://photos.app.goo.gl/yrzQtSNRqp6pdk34A",
            img: "/Imagens/IMG_Foto_Tapete.png",
            titulo: "Fotos de Tapete"
        },
        {
            categoria: "camapet",
            link: "https://photos.app.goo.gl/xkAWstynDKChhRPfA",
            img: "/Imagens/IMG_Foto_CamaPet.jpg",
            titulo: "Fotos de Cama Pet"
        },
        {
            categoria: "projetoCorporativo",
            link: "https://photos.app.goo.gl/TJ7qekib4xXzNp639",
            img: "/Imagens/IMG_Foto_ProjetoFino.png",
            titulo: "Fotos de Projeto Corporativo"
        },
        {
            categoria: "projetoEspecial",
            link: "https://photos.app.goo.gl/xkAWstynDKChhRPfA",
            img: "/Imagens/IMG_Foto_ProjetoEspecial.png",
            titulo: "Fotos de Projeto Especial"
        },
        {
            categoria: "video",
            link: "https://photos.app.goo.gl/oSZ2mfRgmpJRna5c8",
            img: "/Imagens/LogoKasaLeveBranca.png",
            titulo: "Video Kasaleve"
        },
        {
            categoria: "cores",
            link: "https://photos.app.goo.gl/WXJPijzaF2DeDRhr7",
            img: "/Imagens/IMG_Foto_Cores.jpg",
            titulo: "Foto Cores"
        },
        {
            categoria: "tipoTampo",
            link: "https://photos.app.goo.gl/NSPgDKANAfSBQQn18",
            img: "/Imagens/IMG_Foto_TipoDeTampo.jpg",
            titulo: "Fotos de Tipo de Tampo"
        },
    ];

    if (!loggedin) {
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
                        <iframe src="https://www.google.com/maps/d/embed?mid=13Csr1fSAnAYu9WhtCJUBPDYigEItLug&ehbc=2E312F" width="640" height="480"></iframe>
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


    return (
        <>
            <MenuPage />
            <div>
                <BTNVolta />
            </div>
            <div className="CXPrincipalFoto">
                <div className="CXConteudoFoto">
                    {/*<h2>Galeria de Fotos</h2>*/}
                    {/*<p>Aqui você pode visualizar todas as fotos relacionadas aos seus projetos e clientes.</p>*/}
                    <div className="Map">
                        <div className="MapDescricao">
                            {/*<button className="MapLimparFiltro" onClick={() => setFiltro(null)}>Limpar Filtro</button>*/}
                            {mapLegends.map((item, index) => (
                                <div className="MapCaixaDescricao" onClick={() => setFiltro(filtro === item.cor ? null : item.cor)}key={index}>
                                    <div className="MapLegendaCor" style={{ backgroundColor: item.cor }}></div>
                                    <span className="MapLegendaDeco">{item.Representanti}</span>
                                </div>
                            ))}
                        </div>
                        <div className="MapSolido">
                          
                          <iframe src="https://www.google.com/maps/d/u/0/embed?mid=12hSX1JocMHr9eSijxOLa3Dby_7uNPIw&ehbc=2E312F" width="1060" height="670"></iframe>
                          
                           {/* <LoadScript googleMapsApiKey="SUA_API_KEY">
                                <GoogleMap
                                    mapContainerStyle={{ width: '640px', height: '480px' }}
                                    center={{ lat: -23.55, lng: -46.63 }}
                                    zoom={8}
                                >
                                    {pontos
                                        .filter(p => !filtro || p.cor === filtro)
                                        .map((p, i) => (
                                            <Marker
                                                key={i}
                                                position={{ lat: p.lat, lng: p.lng }}
                                                icon={{
                                                    url: `http://maps.google.com/mapfiles/ms/icons/${p.cor}-dot.png`
                                                }}
                                            />
                                        ))}
                                </GoogleMap>
                            </LoadScript>*/}
                        </div>
                    </div>
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