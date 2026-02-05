import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import "../css/Orcamneto.css";
import React, { useState } from 'react';
import IMG1 from "../Imagens/IMG_Foto_Mesa.jpg";
import IMG2 from "../Imagens/IMG_Foto_Sofa.jpg";
import FTList from "../components/FTList";

function Orcamneto() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <div className="FotoCaixamaior">
        <FTList
          categoria="mesas"
          hovered={hovered}
          setHovered={setHovered}
          link="https://www.mercadolivre.com.br/"
          img={IMG1} 
          titulo="Fotos de Mesa e Cadeiras" 
        />

        <FTList categoria="sofa" hovered={hovered} setHovered={setHovered} link="https://www.mercadolivre.com.br/" img={IMG2} titulo="Fotos de Sofá" />
      </div>
    </>
  );
}
export default Orcamneto;