import React, { memo, useRef, useCallback } from 'react';
import { fmtBRL } from '../../utils/orcamentoHelpers';

const ItemRow = memo(function ItemRow({ item, unitario, onAbrirModal, onUpdateItem, onRemoveItem, isLast }) {
  const fileInputRef = useRef(null);
  const temDesconto = item.descontoItem > 0 && item.descontoItem <= 100;
  const precoOriginal = item.unitarioPadrao || 0;

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateItem(item.id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [item.id, onUpdateItem]);

  const handleNomeChange = useCallback((e) => {
    onUpdateItem(item.id, 'nomeProduto', e.target.value);
  }, [item.id, onUpdateItem]);

  const handleExtraChange = useCallback((e) => {
    onUpdateItem(item.id, 'nomeExtra', e.target.value);
  }, [item.id, onUpdateItem]);

  const handleQtdChange = useCallback((e) => {
    onUpdateItem(item.id, 'qtd', Number(e.target.value));
  }, [item.id, onUpdateItem]);

  const handleDescontoChange = useCallback((e) => {
    onUpdateItem(item.id, 'descontoItem', Math.min(100, Math.max(0, Number(e.target.value))));
  }, [item.id, onUpdateItem]);

  const handleUnitarioChange = useCallback((e) => {
    onUpdateItem(item.id, 'unitarioPadrao', Number(e.target.value));
  }, [item.id, onUpdateItem]);

  return (
    <tr>
      <td className="center">
        <div
          className="orc-table-img-container"
          onClick={() => fileInputRef.current.click()}
          title="Clique para carregar imagem"
        >
          {item.image
            ? <img src={item.image} className="orc-table-img" alt="" loading="lazy" />
            : <span className="orc-table-img-placeholder">+</span>
          }
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </td>
      <td>
        {item.nomeProduto ? (
          <div className="orc-item-cell">
            <input
              type="text"
              value={item.nomeProduto}
              onChange={handleNomeChange}
              placeholder="Nome do produto..."
              className="orc-input-item-nome"
            />
            <button
              onClick={() => onAbrirModal(item.id)}
              title="Selecionar/alterar do catálogo"
              className="orc-btn-catalogo"
            >
              🗂️
            </button>
          </div>
        ) : (
          <div className="orc-item-vazio">
            <button
              onClick={() => onAbrirModal(item.id)}
              className="orc-btn-selecionar"
            >
              🗂️ Selecionar do catálogo
            </button>
            <input
              type="text"
              value={item.nomeProduto}
              onChange={handleNomeChange}
              placeholder="ou digite o nome manualmente..."
              className="orc-input-item-nome orc-input-item-nome--vazio"
            />
          </div>
        )}
      </td>
      <td>
        <div className="orc-desc-cell">
          {item.nomeExtra && <span className="orc-desc-nome">{item.nomeExtra}</span>}
          <input
            type="text"
            value={item.nomeExtra}
            onChange={handleExtraChange}
            placeholder="Cores, medidas, obs..."
            className="orc-desc-extra"
          />
        </div>
      </td>
      <td className="center">
        <input
          type="number"
          min="1"
          value={item.qtd}
          onChange={handleQtdChange}
        />
      </td>
      <td className="center col-desc-item">
        <div className="orc-desconto-cell">
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={item.descontoItem || ''}
            onChange={handleDescontoChange}
            placeholder="0"
            className="orc-desconto-input"
            title="Desconto individual (%)"
          />
          <span className="orc-desconto-pct">%</span>
        </div>
      </td>
      <td className={`right orc-unit-cell${temDesconto ? ' orc-unit-cell--com-desc' : ''}`}>
        {temDesconto ? (
          <>
            <span className="orc-unit-original">{fmtBRL(precoOriginal)}</span>
            <span className="orc-unit-valor">{fmtBRL(unitario)}</span>
          </>
        ) : (
          <input
            type="number"
            step="0.01"
            min="0"
            value={unitario || 0}
            onChange={handleUnitarioChange}
            style={{ textAlign: 'right', width: '100%', border: '1px solid #eee', borderRadius: '4px', padding: '4px' }}
          />
        )}
      </td>
      <td className="right">{unitario > 0 ? fmtBRL(item.qtd * unitario) : '—'}</td>
      <td className="center">
        {!isLast && (
          <button className="orc-btn-del" onClick={() => onRemoveItem(item.id)}>✕</button>
        )}
      </td>
    </tr>
  );
});

export default ItemRow;