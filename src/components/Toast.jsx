import React from 'react';
import '../css/IA.css';

export default function Toast({ mensagem, tipo = 'success', onClose }) {
  return (
    <div className={`ia-toast ia-toast-${tipo}`}>
      <span className="ia-toast-message">{mensagem}</span>
      <button className="ia-toast-close" onClick={onClose}>✕</button>
    </div>
  );
}