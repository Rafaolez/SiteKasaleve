import React from 'react';
import "../css/FTList.css";

function FTList({categoria, hovered, setHovered, link, img, titulo }) {
  return (
     <div className={`card ${hovered === categoria ? 'hovered' : 'CXFT'}`}
              onMouseEnter={() => setHovered(categoria)}
              onMouseLeave={() => setHovered(null)} >
              <a href={link} target="_blank" rel="noopener noreferrer"><img src={img} alt={titulo} className="IMGFT" /></a>
              {hovered === categoria && (
                <div className="card-info">
                  <h3> {titulo} </h3>
                </div>
              )}
            </div>
  );
}
export default FTList;