import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  ehMesa, 
  getTamposDoProduto, 
  temVariacaoParaTampo, 
  iconesCategoria 
} from '../../utils/orcamentoHelpers';
import MostruarioPintura from '../../assets/MostruarioPintura';
import MostruarioCordas from '../../assets/MostruarioCorda';
import MostruarioTecidos from '../../assets/MostruarioTecido';

const COLOR_LISTS = { pintura: MostruarioPintura, cordas: MostruarioCordas, tecidos: MostruarioTecidos };

export const ProdutoCard = memo(function ProdutoCard({ produto, onClick }) {
  const handleClick = useCallback(() => onClick(produto), [produto, onClick]);
  
  return (
    <div className="modal-card" onClick={handleClick}>
      <div className="modal-card__img">
        {produto.img
          ? <img src={produto.img} alt={produto.nome} className="modal-card__img-el" loading="lazy" decoding="async" />
          : <span className="modal-card__emoji">{iconesCategoria[produto.status] || '📦'}</span>
        }
      </div>
      <div className="modal-card__body">
        <p className="modal-card__nome">{produto.nome}</p>
        <p className="modal-card__status">{iconesCategoria[produto.status] || ''} {produto.status}</p>
      </div>
    </div>
  );
});

export default function ModalSeletorProduto({ aberto, onFechar, onSelecionar, itemInicial, listaProdutos }) {
  const [step, setStep] = useState('grid');
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [produtoSel, setProdutoSel] = useState(null);
  const [tampoSel, setTampoSel] = useState(null);
  const [medidaIdx, setMedidaIdx] = useState(0);
  const [qtd, setQtd] = useState(1);
  const [selecoesCor, setSelecoesCor] = useState({});
  const [abaCor, setAbaCor] = useState('pintura');

  const [buscaDebounced, setBuscaDebounced] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setBuscaDebounced(busca);
    }, 300);
    return () => clearTimeout(handler);
  }, [busca]);

  useEffect(() => {
    if (!aberto) return;
    if (itemInicial?.nomeProduto && listaProdutos) {
      const p = listaProdutos.find(p => p.nome === itemInicial.nomeProduto) || null;
      setProdutoSel(p);
      if (p) {
        const t = getTamposDoProduto(p);
        setTampoSel(itemInicial._tampo && t?.includes(itemInicial._tampo) ? itemInicial._tampo : (t?.find(tp => temVariacaoParaTampo(p, tp)) || t?.[0] || null));
      }
      setMedidaIdx(itemInicial._medidaIdx || 0);
      setQtd(itemInicial.qtd || 1);
      setSelecoesCor(itemInicial._cores || {});
    } else {
      setProdutoSel(null);
      setTampoSel(null);
      setMedidaIdx(0);
      setQtd(1);
      setSelecoesCor({});
    }
    setStep('grid');
    setBusca('');
    setFiltroCategoria('Todos');
    setAbaCor('pintura');
  }, [aberto, itemInicial, listaProdutos]);

  const categorias = useMemo(() => {
    if (!listaProdutos) return [];
    const m = {};
    listaProdutos.forEach(p => { m[p.status] = (m[p.status] || 0) + 1; });
    const entries = Object.entries(m).map(([n, c]) => ({ nome: n, count: c }));
    return [
      { nome: 'Todos', count: listaProdutos.length },
      ...entries.sort((a, b) => a.nome.localeCompare(b.nome))
    ];
  }, [listaProdutos]);

  const produtosFiltrados = useMemo(() => {
    if (!listaProdutos) return [];
    const buscaLower = buscaDebounced.toLowerCase();
    return listaProdutos.filter(p => {
      const mc = filtroCategoria === 'Todos' || p.status === filtroCategoria;
      const mb = buscaDebounced === '' || 
                 (p.nome && p.nome.toLowerCase().includes(buscaLower)) || 
                 (p.descricao && p.descricao.toLowerCase().includes(buscaLower));
      return mc && mb;
    });
  }, [filtroCategoria, buscaDebounced, listaProdutos]);

  const handleProdutoClick = useCallback((produto) => {
    setProdutoSel(produto);
    const eM = ehMesa(produto.status);
    const tampos = getTamposDoProduto(produto);
    if (eM && tampos) {
      setTampoSel(tampos.find(t => temVariacaoParaTampo(produto, t)) || tampos[0] || null);
    } else {
      setTampoSel(null);
    }
    setMedidaIdx(0);
    setQtd(1);
    setSelecoesCor({});
    setAbaCor('pintura');
    setStep('detail');
  }, []);

  const handleTampoClick = useCallback((t) => {
    if (!temVariacaoParaTampo(produtoSel, t)) return;
    setTampoSel(t);
    setMedidaIdx(0);
  }, [produtoSel]);

  const selecionarCor = useCallback((item) => {
    setSelecoesCor(prev => {
      const n = { ...prev };
      if (n[item.cat]?.id === item.id) {
        const { [item.cat]: _, ...rest } = n;
        return rest;
      }
      return { ...n, [item.cat]: item };
    });
  }, []);

  const eMesa = useMemo(() => ehMesa(produtoSel?.status), [produtoSel?.status]);
  const tamposExibidos = useMemo(() => getTamposDoProduto(produtoSel), [produtoSel]);
  
  const varsFiltradas = useMemo(() => {
    const variacoes = produtoSel?.variacoes || [];
    if (eMesa && tampoSel) {
      return variacoes.filter(v => v.tampo === tampoSel);
    }
    return variacoes;
  }, [eMesa, tampoSel, produtoSel]);

  const varAtual = varsFiltradas[medidaIdx] || varsFiltradas[0];
  const imgAtual = varAtual?.img || produtoSel?.img;

  const handleConfirmar = useCallback(() => {
    if (!varAtual?.preco || !produtoSel) return;
    const detalhes = [];
    if (varAtual.tampo) detalhes.push(`Tampo: ${varAtual.tampo}`);
    if (varAtual.medida) detalhes.push(varAtual.medida);
    if (selecoesCor.pintura) detalhes.push(`Alumínio: ${selecoesCor.pintura.nome}`);
    if (selecoesCor.corda) detalhes.push(`Corda: ${selecoesCor.corda.nome}`);
    if (selecoesCor.tecido) detalhes.push(`Tecido: ${selecoesCor.tecido.nome}`);
    
    onSelecionar({
      nomeProduto: produtoSel.nome,
      image: imgAtual || '',
      unitarioPadrao: varAtual.preco,
      nomeExtra: detalhes.join(' / '),
      qtd,
      _tampo: varAtual.tampo || '',
      _medidaIdx: medidaIdx,
      _cores: { ...selecoesCor },
    });
  }, [varAtual, produtoSel, selecoesCor, imgAtual, qtd, medidaIdx, onSelecionar]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Kasaleve</p>
            <h2 className="modal-title">{step === 'grid' ? 'Selecionar Produto' : produtoSel?.nome}</h2>
          </div>
          <button className="modal-close-btn" onClick={onFechar}>✕</button>
        </div>

        {step === 'grid' ? (
          <>
            <div className="modal-search-wrap">
              <input
                type="text"
                placeholder="Buscar produto por nome..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="modal-search-input"
              />
            </div>
            <div className="modal-filtros-wrap">
              {categorias.map(c => (
                <button
                  key={c.nome}
                  onClick={() => setFiltroCategoria(c.nome)}
                  className={`modal-filtro-btn${filtroCategoria === c.nome ? ' modal-filtro-btn--ativo' : ''}`}
                >
                  {c.nome !== 'Todos' && `${iconesCategoria[c.nome] || '📦'} `}{c.nome} ({c.count})
                </button>
              ))}
            </div>
            <div className="modal-grid-wrap">
              <div className="modal-grid">
                {produtosFiltrados.map(p => (
                  <ProdutoCard key={p.id} produto={p} onClick={handleProdutoClick} />
                ))}
              </div>
              {produtosFiltrados.length === 0 && (
                <div className="modal-empty-state">
                  <p style={{ fontSize: 32, margin: '0 0 8px' }}>🔍</p>
                  <p style={{ margin: 0, fontSize: 13 }}>Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="modal-detail-wrap">
            <div className="modal-detail-img-wrap">
              {imgAtual
                ? <img src={imgAtual} alt={produtoSel?.nome} className="modal-detail-img" loading="eager" />
                : <span style={{ fontSize: 64 }}>{iconesCategoria[produtoSel?.status] || '📦'}</span>
              }
            </div>
            <div className="modal-detail-content">
              <span className="modal-badge">{iconesCategoria[produtoSel?.status]} {produtoSel?.status}</span>
              <h3 className="modal-nome">{produtoSel?.nome}</h3>
              <p className="modal-desc">{produtoSel?.descricao}</p>

              {eMesa && tamposExibidos && tamposExibidos.length > 1 && (
                <>
                  <label className="modal-section-label">Tipo de Tampo:</label>
                  <div className="modal-pill-row">
                    {tamposExibidos.map(t => {
                      const disp = temVariacaoParaTampo(produtoSel, t);
                      return (
                        <button
                          key={t}
                          onClick={() => handleTampoClick(t)}
                          disabled={!disp}
                          className={`modal-pill${tampoSel === t ? ' modal-pill--active' : ''}${!disp ? ' modal-pill--disabled' : ''}`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {varsFiltradas.length > 1 && (
                <>
                  <label className="modal-section-label">Medida / Variação:</label>
                  <div className="modal-pill-row">
                    {varsFiltradas.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setMedidaIdx(i)}
                        className={`modal-pill${medidaIdx === i ? ' modal-pill--active' : ''}`}
                      >
                        {v.medida}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="modal-cores-section">
                <div className="modal-cores-tabs">
                  {Object.keys(COLOR_LISTS).map(k => (
                    <button
                      key={k}
                      onClick={() => setAbaCor(k)}
                      className={`modal-cor-tab${abaCor === k ? ' modal-cor-tab--active' : ''}`}
                    >
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                      {selecoesCor[k] && <span className="modal-tab-check">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="modal-cor-grid">
                  {COLOR_LISTS[abaCor].map(c => (
                    <div
                      key={c.id}
                      className={`modal-cor-chip${selecoesCor[abaCor]?.id === c.id ? ' modal-cor-chip--active' : ''}`}
                      onClick={() => selecionarCor({ ...c, cat: abaCor })}
                      title={c.nome}
                    >
                      <div className="modal-cor-swatch" style={{ backgroundColor: c.hex }}></div>
                      <span className="modal-cor-nome">{c.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-price-row">
                <div className="modal-qty-box">
                  <label>Qtd:</label>
                  <input type="number" min="1" value={qtd} onChange={e => setQtd(Number(e.target.value))} />
                </div>
                <div className="modal-price-final">
                  <span className="modal-price-label">Valor Unitário:</span>
                  <span className="modal-price-valor">
                    {varAtual?.preco ? varAtual.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="modal-btn-back" onClick={() => setStep('grid')}>← Voltar</button>
                <button className="modal-btn-confirm" onClick={handleConfirmar} disabled={!varAtual?.preco}>
                  Confirmar Seleção
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}