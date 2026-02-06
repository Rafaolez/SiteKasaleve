import React from 'react';
import "../css/FTList.css";

function FTList({ link, img, titulo, Imgedescricao }) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="card"
    >
        <img src={img} alt={Imgedescricao} className="IMGFT" loading="lazy" />

        <div className="card-info">
            <h3>{titulo}</h3>
        </div>
    </a>
  );
}
export default FTList;