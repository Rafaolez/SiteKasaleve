import React from 'react';
import '../css/IA.css';

export default function Toast({ mensagem, tipo = 'success', onClose }) {
  return (
    <div className={`toast toast-${tipo}`}>
      <span className="toast-message">{mensagem}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}