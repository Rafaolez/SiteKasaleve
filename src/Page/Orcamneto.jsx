import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import "../css/Orcamneto.css";
import React, { useState } from 'react';

function Orcamneto() {
     const [isHovered, setIsHovered] = useState(false);

  return (
    <>
    {card.map(item => (
      <div key={item.id} className={`card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)} >
        <h3>{item.title}</h3>
        {isHovered && (
          <div className="card-info">
            <p>{item.description}</p>
          </div>
        )}
      </div>
    ))}
    
    </>
  );
}
export default Orcamneto;