import "../css/carrinho.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';
import ProdutosAPILocal from '../assets/ProdutosAPILocal';

// ─── DADOS DE CORES ──────────────────────────────────────────────────────────
const PINTURA = [
  { id: 'p1', nome: 'Fendi', hex: '#8a7a58', cat: 'pintura' },
  { id: 'p5', nome: 'Off White', hex: '#e8e4d8', cat: 'pintura' },
  { id: 'p7', nome: 'Preto', hex: '#1a1a1a', cat: 'pintura' },
];
const CORDAS = [
  { id: 'c1', nome: 'Verde Musgo', codigo: '#70292', hex: '#4a5e3a', cat: 'corda' },
  { id: 'c7', nome: 'Preto', codigo: '#70268', hex: '#1a1a1a', cat: 'corda' },
  { id: 'c3', nome: 'Mescla Areia', codigo: '#84202', hex: '#c8b89a', cat: 'corda' },
];
const TECIDOS = [
  { id: 't1', nome: 'Linho Natural', fabricante: 'Karsten', hex: '#c4b89a', cat: 'tecido' },
  { id: 't6', nome: 'Azul Naval', fabricante: 'Karsten', hex: '#1e2f5a', cat: 'tecido' },
];

// ─── CONSTANTES DE MESA ───────────────────────────────────────────────────────
const TAMPOS_PADRAO = ['Ripado', 'Pizza', 'Alumínio'];
const STATUS_MESA = ['Mesa de Centro', 'Mesa de Canto', 'Mesa', 'Mesa de Jantar', 'Champanheira', 'Bistrô'];


const formatPrice = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtPDF = (v) => Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const iconesCategoria = {
  'Sofá': '🛋️', 'Poltrona': '💺', 'Mesa de Centro': '◀▶', 'Mesa de Canto': '◇', 'Mesa': '◻',
  'Chaise': '☀', 'Cadeira': '🪑', 'Banqueta': '🔘', 'Modular': '⬡', 'Puff': '◉',
  'Balanço': '🌙', 'Espreguiçadeira': '∽', 'Acessório': '⚙', 'Champanheira': '🥂',
  'Bistrô': '🍽️', 'Mesa de Jantar': '▫', 'Tapete': '🟫', 'Caminha': '🐕',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ehMesa(status) { return STATUS_MESA.includes(status); }

function getTamposDoProduto(produto) {
  if (!ehMesa(produto.status)) return null;
  const existentes = [...new Set((produto.variacoes || []).filter(v => v.tampo).map(v => v.tampo))];
  return existentes.length > 0 ? existentes : TAMPOS_PADRAO;
}

function temVariacaoParaTampo(produto, tampo) {
  return (produto.variacoes || []).some(v => v.tampo === tampo);
}

// ─── MODAL DE CORES ──────────────────────────────────────────────────────────
function ModalPersonalizacao({ aberto, onFechar, onConfirmar, selecoes, setSelecoes }) {
  const [aba, setAba] = useState('pintura');
  if (!aberto) return null;
  function selecionar(item) {
    setSelecoes(prev => { const n = { ...prev }; if (n[item.cat]?.id === item.id) delete n[item.cat]; else n[item.cat] = item; return n; });
  }
  const listas = { pintura: PINTURA, cordas: CORDAS, tecidos: TECIDOS };
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-drawer" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div><p className="modal-eyebrow">Kasaleve</p><h2 className="modal-title">Escolher Cores</h2></div>
          <button className="modal-close" onClick={onFechar}>✕</button>
        </div>
        <div className="modal-tabs">
          {[{ id: 'pintura', label: 'Alumínio' }, { id: 'cordas', label: 'Cordas' }, { id: 'tecidos', label: 'Tecidos' }].map(a => (
            <button key={a.id} className={`modal-tab ${aba === a.id ? 'modal-tab--active' : ''}`} onClick={() => setAba(a.id)}>{a.label}</button>
          ))}
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            {listas[aba].map(item => (
              <div key={item.id} className={`modal-chip-pintura ${selecoes[item.cat]?.id === item.id ? 'modal-chip--sel' : ''}`} onClick={() => selecionar(item)}>
                <div className="modal-chip-pintura__placa" style={{ background: item.hex }}>{selecoes[item.cat]?.id === item.id && '✓'}</div>
                <p>{item.nome}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-limpar" onClick={() => setSelecoes({})}>Limpar</button>
          <button className="modal-btn-confirmar" onClick={onConfirmar}>Confirmar Seleção</button>
        </div>
      </div>
    </div>
  );
}

// ─── PREVIEW DA COMBINAÇÃO ───────────────────────────────────────────────────
function PreviewCombinacao({ selecoes, onEditar }) {
  const tem = Object.keys(selecoes).length > 0;
  return (
    <div className="preview-box">
      <div className="preview-box__header">
        <p className="preview-box__title">Sua Seleção</p>
        {tem && <button className="preview-box__edit" onClick={onEditar}>✏️ Editar</button>}
      </div>
      {!tem ? <div className="preview-vazio"><p>Nenhuma cor selecionada</p></div> : (
        <>
          <div className="preview-barras">
            {selecoes.pintura && <div className="preview-barra" style={{ background: selecoes.pintura.hex }}><span>Alumínio</span><b>{selecoes.pintura.nome}</b></div>}
            {selecoes.corda && <div className="preview-barra" style={{ background: selecoes.corda.hex, color: '#fff' }}><span>Corda</span><b>{selecoes.corda.nome}</b></div>}
            {selecoes.tecido && <div className="preview-barra" style={{ background: selecoes.tecido.hex }}><span>Tecido</span><b>{selecoes.tecido.nome}</b></div>}
          </div>
          <div className="preview-paleta">{Object.values(selecoes).map(s => (<div key={s.id} className="preview-paleta__dot" style={{ background: s.hex }} title={s.nome} />))}</div>
        </>
      )}
    </div>
  );
}

// ─── PDF INDUSTRIAL ──────────────────────────────────────────────────────────
async function gerarPDF(itensCarrinho) {
  const { default: jsPDF } = await import('jspdf');
  const imagens = {};
  await Promise.all(itensCarrinho.map(async (item) => {
    const src = item.varImg || item.img;
    if (src && !imagens[item.cartId]) {
      try { const r = await fetch(src); const b = await r.blob(); imagens[item.cartId] = await new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(b); }); } catch { imagens[item.cartId] = null; }
    }
  }));
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const M = 15, W = 180, R = M + W; let y = M;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, M - 5, R, M - 5); doc.setLineWidth(0.25); doc.line(M, M - 3, R, M - 3);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(0, 0, 0); doc.text('KASALEVE IND. DECOR MOVEIS LTDA', M, y + 4); y += 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80); doc.text('Pederneiras - SP  |  CNPJ: 00.000.000/0001-00  |  www.kasaleve.com.br', M, y + 2); y += 4;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, y + 2, R, y + 2); y += 8;
  const numOrc = `ORC-${String(Date.now()).slice(-6)}`, dataHoje = new Date().toLocaleDateString('pt-BR');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(`ORCAMENTO: ${numOrc}`, M, y); doc.text(`DATA: ${dataHoje}`, R, y, { align: 'right' }); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(100, 100, 100); doc.text('Validade: 5 dias uteis a partir da emissao.', M, y); doc.setTextColor(0, 0, 0); y += 8;

  // ── Colunas redistribuídas (sem PERSONALIZAÇÃO) ──
  // IMG: 15→33 (18mm) | PRODUTO: 35→128 (93mm) | QTD: 130→148 (18mm) | UNITÁRIO: 150→174 (24mm) | TOTAL: 178→192 (14mm)
  const cImg = M;                // 15
  const cProd = M + 20;          // 35
  const cQtd = M + 115;          // 130
  const cUnit = M + 135;         // 150
  const cTot = R - 3;            // 192
  const unitTotalDivX = M + 161; // 176 — linha divisória entre UNITÁRIO e TOTAL
  const colLines = [M + 18, cQtd - 2, cUnit - 2]; // linhas verticais leves: 33, 128, 148

  doc.setFillColor(30, 30, 30); doc.rect(M, y, W, 8, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
  doc.text('IMG', cImg + 4, y + 5.5);
  doc.text('PRODUTO', cProd, y + 5.5);
  doc.text('QTD', cQtd, y + 5.5);
  doc.text('UNITARIO', cUnit, y + 5.5);
  doc.text('TOTAL', cTot, y + 5.5, { align: 'right' });
  y += 8;

  const totalProdutos = itensCarrinho.reduce((a, i) => a + (i.preco * i.qtd), 0);
  const rowH = 18, imgS = 14, imgP = 2;

  itensCarrinho.forEach((item, idx) => {
    if (y + rowH > 270) {
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(M, 287, R, 287);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(140, 140, 140);
      doc.text(`${numOrc}  |  Kasaleve  |  Pag. ${doc.getNumberOfPages()}`, M + W / 2, 291, { align: 'center' });
      doc.addPage(); y = M;
    }

    // Fundo zebrado
    if (idx % 2 !== 0) { doc.setFillColor(243, 243, 243); doc.rect(M, y, W, rowH, 'F'); }

    // Borda externa
    doc.setDrawColor(170, 170, 170); doc.setLineWidth(0.2); doc.rect(M, y, W, rowH);

    // Linhas verticais leves (IMG | PRODUTO | QTD | UNITÁRIO)
    doc.setDrawColor(190, 190, 190); doc.setLineWidth(0.15);
    colLines.forEach(x => doc.line(x, y, x, y + rowH));

    // Linha divisória forte entre UNITÁRIO e TOTAL
    doc.setDrawColor(60, 60, 60); doc.setLineWidth(0.5);
    doc.line(unitTotalDivX, y, unitTotalDivX, y + rowH);

    // Imagem
    if (imagens[item.cartId]) {
      doc.addImage(imagens[item.cartId], 'JPEG', cImg + imgP, y + imgP, imgS, imgS);
    } else {
      doc.setFillColor(230, 230, 230); doc.rect(cImg + imgP, y + imgP, imgS, imgS, 'F');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(150, 150, 150);
      doc.text('IMG', cImg + imgP + imgS / 2, y + imgP + imgS / 2 + 2, { align: 'center' });
    }

    const tY = y + 7;

    // Nome do produto (maxWidth expandido sem coluna PERSONALIZAÇÃO)
    doc.setTextColor(0, 0, 0); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(item.nome, cProd, tY, { maxWidth: cQtd - 2 - cProd - 2 });

    // Detalhes (tampo, medida, cores) na mesma coluna PRODUTO
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(60, 60, 60);
    const p = [];
    if (item.tampo) p.push(`Tampo: ${item.tampo}`);
    if (item.medida) p.push(item.medida);
    if (item.personalizacao?.pintura) p.push(`AL: ${item.personalizacao.pintura.nome}`);
    if (item.personalizacao?.corda) p.push(`CO: ${item.personalizacao.corda.nome}`);
    if (item.personalizacao?.tecido) p.push(`TE: ${item.personalizacao.tecido.nome}`);
    if (p.length > 0) doc.text(p.join(' / '), cProd, tY + 5, { maxWidth: cQtd - 2 - cProd - 4 });

    // Quantidade
    doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text(String(item.qtd), cQtd + 2, tY + 2);

    // Valor unitário (alinhado à direita, antes da linha divisória)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
    doc.text(fmtPDF(item.preco), unitTotalDivX - 3, tY + 2, { align: 'right' });

    // Valor total (alinhado à direita, após a linha divisória)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text(fmtPDF(item.preco * item.qtd), cTot, tY + 2, { align: 'right' });

    y += rowH;
  });

  // ── TOTAIS ──
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(M, y, R, y); y += 10;
  const frete = totalProdutos * 0.085, bX = cQtd - 2, bW = R - bX;

  doc.setDrawColor(150, 150, 150); doc.setLineWidth(0.2); doc.setFillColor(248, 248, 248); doc.rect(bX, y, bW, 10, 'FD');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30); doc.text('SUBTOTAL', bX + 5, y + 6.5);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0); doc.text(`R$ ${fmtPDF(totalProdutos)}`, R - 4, y + 6.5, { align: 'right' }); y += 10;

  doc.setFillColor(248, 248, 248); doc.rect(bX, y, bW, 10, 'FD'); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(30, 30, 30); doc.text('FRETE ESTIMADO', bX + 5, y + 6.5);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0); doc.text(`R$ ${fmtPDF(frete)}`, R - 4, y + 6.5, { align: 'right' }); y += 14;

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(bX, y - 4, R, y - 4); doc.setFillColor(25, 25, 25); doc.rect(bX, y, bW, 12, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255); doc.text('TOTAL GERAL', bX + 5, y + 8);
  doc.text(`R$ ${fmtPDF(totalProdutos + frete)}`, R - 4, y + 8, { align: 'right' }); y += 20;

  // ── OBSERVAÇÕES ──
  doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('OBSERVACOES:', M, y); y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(50, 50, 50);
  ['- Valores sujeitos a alteracao apos o prazo de validade.', '- Frete estimado. Valor final definido apos confirmacao de endereco.', '- Producao iniciada apos aprovacao do orcamento e sinal conforme combinado.', '- Prazo de producao: a combinar.'].forEach(o => { doc.text(o, M, y + 3); y += 3.8; });

  // ── ASSINATURAS ──
  y = Math.max(y + 18, 248);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.25); doc.line(M, y, M + 65, y); doc.line(R - 65, y, R, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.text('CLIENTE', M + 32, y + 5, { align: 'center' }); doc.text('KASALEVE', R - 32, y + 5, { align: 'center' });

  // ── RODAPÉ ──
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(M, 287, R, 287);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(140, 140, 140);
  doc.text(`${numOrc}  |  Gerado em ${dataHoje}  |  Kasaleve Industria Decor Moveis LTDA  |  Pederneiras - SP`, M + W / 2, 291, { align: 'center' });

  doc.save(`Orcamento_${numOrc}.pdf`);
}

// ─── TELA DE DETALHE ──────────────────────────────────────────────────────────
function TelaDetalhe({ produto, onVoltar, onAddCarrinho }) {
  const { loggedin } = useContext(AuthContext);
  const [selecoes, setSelecoes] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [qtd, setQtd] = useState(1);

  const eMesa = ehMesa(produto.status);
  const tamposExibidos = getTamposDoProduto(produto);

  const [tampoSel, setTampoSel] = useState(() => {
    if (!eMesa || !tamposExibidos) return null;
    return tamposExibidos.find(t => temVariacaoParaTampo(produto, t)) || tamposExibidos[0] || null;
  });

  const [medidaIdx, setMedidaIdx] = useState(0);

  const varsFiltradas = eMesa && tampoSel
    ? produto.variacoes.filter(v => v.tampo === tampoSel)
    : produto.variacoes || [];

  const varAtual = varsFiltradas[medidaIdx] || varsFiltradas[0] || produto.variacoes?.[0];
  const imgAtual = varAtual?.img || produto.img;
  const tampoDisponivel = eMesa && tampoSel ? temVariacaoParaTampo(produto, tampoSel) : true;

  const [imgFade, setImgFade] = useState(false);
  const [imgSrc, setImgSrc] = useState(imgAtual);
  useEffect(() => { setImgFade(true); const t = setTimeout(() => { setImgSrc(imgAtual); setImgFade(false); }, 150); return () => clearTimeout(t); }, [imgAtual]);

  const handleTampo = (t) => { if (!tampoDisponivel || !temVariacaoParaTampo(produto, t)) return; setTampoSel(t); setMedidaIdx(0); };

  const multiplasVars = (produto.variacoes || []).length > 1;
  const tamposMulti = tamposExibidos && tamposExibidos.length > 1;
  const medidasMulti = varsFiltradas.length > 1;
  const temMedidaSemTampo = !eMesa && produto.variacoes?.some(v => v.medida);

  function adicionar() {
    if (!varAtual?.preco) return;
    onAddCarrinho({ ...produto, preco: varAtual.preco, medida: varAtual.medida || '', tampo: varAtual.tampo || '', varImg: varAtual.img || '', img: imgAtual, qtd, personalizacao: selecoes, cartId: Date.now() });
    onVoltar();
  }

  const descAtual = [varAtual?.tampo, varAtual?.medida].filter(Boolean).join(' — ');

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container detalhe-container">
        <button className="btn-voltar-det" onClick={onVoltar}>← Voltar</button>
        <div className="detalhe-grid">
          <div className="detalhe-img-box">
            {imgSrc ? (
              <img key={imgSrc} src={imgSrc} alt={produto.nome} className={`detalhe-img ${imgFade ? 'detalhe-img--fading' : ''}`} />
            ) : (
              <div className="detalhe-img-placeholder"><span>{iconesCategoria[produto.status] || '📦'}</span><p>{produto.nome}</p></div>
            )}
          </div>
          <div className="detalhe-info">
            <span className="detalhe-categoria-badge">{iconesCategoria[produto.status]} {produto.status}</span>
            <h1 className="detalhe-nome">{produto.nome}</h1>
            <p className="detalhe-desc">{produto.descricao}</p>
            {loggedin ? (
              <>
                {eMesa && tamposMulti && (
                  <div className="detalhe-variacoes">
                    <label className="detalhe-variacoes__label">Tipo de Tampo:</label>
                    <div className="detalhe-variacoes__opts">
                      {tamposExibidos.map(t => {
                        const disp = temVariacaoParaTampo(produto, t);
                        return (
                          <button key={t} className={`detalhe-variacao-btn ${!disp ? 'detalhe-variacao-btn--disabled' : ''} ${tampoSel === t ? 'detalhe-variacao-btn--active' : ''}`} onClick={() => handleTampo(t)} disabled={!disp}>
                            {t}
                            {!disp && <span className="detalhe-variacao-btn__unavail">Indisponível</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {eMesa && medidasMulti && tampoDisponivel && (
                  <div className="detalhe-variacoes">
                    <label className="detalhe-variacoes__label">Medida:</label>
                    <div className="detalhe-variacoes__opts">
                      {varsFiltradas.map((v, i) => (
                        <button key={i} className={`detalhe-variacao-btn ${medidaIdx === i ? 'detalhe-variacao-btn--active' : ''}`} onClick={() => setMedidaIdx(i)}>
                          {v.medida || `Opção ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!eMesa && multiplasVars && (
                  <div className="detalhe-variacoes">
                    <label className="detalhe-variacoes__label">{temMedidaSemTampo ? 'Medida:' : 'Variação:'}</label>
                    <div className="detalhe-variacoes__opts">
                      {produto.variacoes.map((v, i) => (
                        <button key={i} className={`detalhe-variacao-btn ${medidaIdx === i ? 'detalhe-variacao-btn--active' : ''}`} onClick={() => setMedidaIdx(i)}>
                          {v.medida || `Opção ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {tampoDisponivel && varAtual?.preco ? (
                  <p className="detalhe-preco">
                    {formatPrice(varAtual.preco)}
                    {descAtual && <span className="detalhe-preco__medida"> — {descAtual}</span>}
                  </p>
                ) : (
                  <div className="detalhe-preco-unavail">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    <span>Preço indisponível para este tampo</span>
                  </div>
                )}
                <div className="qtd-selector">
                  <span>Quantidade:</span>
                  <div className="qtd-box">
                    <button onClick={() => setQtd(qtd > 1 ? qtd - 1 : 1)}>-</button>
                    <span>{qtd}</span>
                    <button onClick={() => setQtd(qtd + 1)}>+</button>
                  </div>
                </div>
                <div className="detalhe-separador" />
                <PreviewCombinacao selecoes={selecoes} onEditar={() => setModalAberto(true)} />
                <button className="btn-personalizar" onClick={() => setModalAberto(true)}>🎨 Alterar Cores</button>
                <button className="btn-add-carrinho" onClick={adicionar} disabled={!tampoDisponivel || !varAtual?.preco}>Adicionar ao Carrinho</button>
              </>
            ) : (
              <div className="detalhe-login-teaser">
                <div className="teaser-icon">🔒</div>
                <h3>Área Restrita</h3>
                <p>Faça login para ver preços e montar seu pedido.</p>
                <Link to="/Login" className="teaser-btn">Fazer Login <span>→</span></Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalPersonalizacao aberto={modalAberto} onFechar={() => setModalAberto(false)} onConfirmar={() => setModalAberto(false)} selecoes={selecoes} setSelecoes={setSelecoes} />
    </div>
  );
}

// ─── TAG DE COR ───────────────────────────────────────────────────────────────
function CorTag({ label, cor }) {
  return (<span className="cart-cor-tag"><span className="cart-cor-tag__dot" style={{ background: cor.hex }} />{label}: {cor.nome}</span>);
}

// ─── TELA DO CARRINHO ────────────────────────────────────────────────────────
function TelaCheckout({ carrinho, setCarrinho, onVoltar }) {
  const [cupom, setCupom] = useState(''); const [cupomAplicado, setCupomAplicado] = useState(false); const [notas, setNotas] = useState('');
  const subtotal = carrinho.reduce((a, i) => a + (i.preco * i.qtd), 0);
  const desconto = cupomAplicado ? subtotal * 0.05 : 0;
  const frete = carrinho.length > 0 ? (subtotal - desconto) * 0.085 : 0;
  const total = subtotal - desconto + frete;
  const totalItens = carrinho.reduce((a, i) => a + i.qtd, 0);
  function alterarQtd(cid, d) { setCarrinho(p => p.map(i => { if (i.cartId === cid) { const n = i.qtd + d; return n > 0 ? { ...i, qtd: n } : null; } return i; }).filter(Boolean)); }
  function removerItem(cid) { setCarrinho(p => p.filter(i => i.cartId !== cid)); }
  function aplicarCupom() { if (cupom.trim().toUpperCase() === 'KASALEVE5') setCupomAplicado(true); }
  function finalizar() { if (!carrinho.length) return; gerarPDF(carrinho); setCarrinho([]); setCupomAplicado(false); setCupom(''); setNotas(''); alert("Orçamento gerado com sucesso!"); onVoltar(); }
  return (
    <div className="loja-page"><MenuPage /><div className="cart-page">
      <div className="cart-breadcrumb"><button className="cart-breadcrumb__link" onClick={onVoltar}>Loja</button><span className="cart-breadcrumb__sep">/</span><span className="cart-breadcrumb__current">Carrinho</span></div>
      {carrinho.length === 0 ? (
        <div className="cart-empty"><div className="cart-empty__icon">🛒</div><h2 className="cart-empty__title">Seu carrinho está vazio</h2><p className="cart-empty__text">Explore nosso catálogo e adicione produtos para montar seu orçamento.</p><button className="cart-empty__btn" onClick={onVoltar}>Explorar Produtos</button></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-items__header"><h1 className="cart-items__title">Carrinho</h1><span className="cart-items__count">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span></div>
            <div className="cart-list">{carrinho.map(item => (
              <div className="cart-item" key={item.cartId}>
                <div className="cart-item__img-wrap">{item.img ? <img src={item.img} alt={item.nome} className="cart-item__img" /> : <div className="cart-item__img-placeholder"><span>{iconesCategoria[item.status] || '📦'}</span></div>}</div>
                <div className="cart-item__info">
                  <div className="cart-item__top"><div><h3 className="cart-item__name">{item.nome}</h3><div className="cart-item__vars">{item.tampo && <span className="cart-item__tampo">{item.tampo}</span>}{item.medida && <span className="cart-item__medida">{item.medida}</span>}</div></div><button className="cart-item__remove" onClick={() => removerItem(item.cartId)} title="Remover"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div>
                  <div className="cart-item__cores">{item.personalizacao?.pintura && <CorTag label="Alumínio" cor={item.personalizacao.pintura} />}{item.personalizacao?.corda && <CorTag label="Corda" cor={item.personalizacao.corda} />}{item.personalizacao?.tecido && <CorTag label="Tecido" cor={item.personalizacao.tecido} />}</div>
                  <div className="cart-item__bottom"><div className="cart-item__qty"><button className="cart-qty-btn" onClick={() => alterarQtd(item.cartId, -1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg></button><span className="cart-qty-value">{item.qtd}</span><button className="cart-qty-btn" onClick={() => alterarQtd(item.cartId, 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button></div><div className="cart-item__price"><span className="cart-item__unit">{formatPrice(item.preco)} un.</span><span className="cart-item__total">{formatPrice(item.preco * item.qtd)}</span></div></div>
                </div>
              </div>
            ))}</div>
            <div className="cart-coupon"><div className="cart-coupon__input-wrap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg><input type="text" className="cart-coupon__input" placeholder="Código de cupom" value={cupom} onChange={e => setCupom(e.target.value)} disabled={cupomAplicado} /></div><button className="cart-coupon__btn" onClick={aplicarCupom} disabled={cupomAplicado}>{cupomAplicado ? 'Aplicado ✓' : 'Aplicar'}</button></div>
            <div className="cart-notes"><label className="cart-notes__label">Observações do pedido</label><textarea className="cart-notes__textarea" placeholder="Ex: Entregar após as 14h..." value={notas} onChange={e => setNotas(e.target.value)} rows={3} /></div>
          </div>
          <div className="cart-summary"><div className="cart-summary__card"><h2 className="cart-summary__title">Resumo do Pedido</h2><div className="cart-summary__rows"><div className="cart-summary__row"><span>Subtotal ({totalItens} itens)</span><span>{formatPrice(subtotal)}</span></div>{cupomAplicado && <div className="cart-summary__row cart-summary__row--discount"><span>Desconto (5%)</span><span>-{formatPrice(desconto)}</span></div>}<div className="cart-summary__row"><span>Frete estimado</span><span>{formatPrice(frete)}</span></div></div><div className="cart-summary__divider" /><div className="cart-summary__total"><span>Total</span><span className="cart-summary__total-value">{formatPrice(total)}</span></div><p className="cart-summary__frete-note">*Frete calculado automaticamente.</p><button className="cart-summary__btn" onClick={finalizar}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>Gerar Orçamento PDF</button><button className="cart-summary__btn-sec" onClick={onVoltar}>Continuar Comprando</button><div className="cart-summary__badges"><div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg><span>Frete calculado</span></div><div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><span>Orçamento seguro</span></div><div className="cart-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /></svg><span>Personalizado</span></div></div></div></div>
        </div>
      )}
    </div></div>
  );
}

// ─── TELA PRINCIPAL ──────────────────────────────────────────────────────────
function Carrinho() {
  const { loggedin } = useContext(AuthContext);
  const produtos = ProdutosAPILocal;
  const [tela, setTela] = useState('lista');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  const categorias = useMemo(() => {
    const m = {}; produtos.forEach(p => { m[p.status] = (m[p.status] || 0) + 1; });
    return [{ nome: 'Todos', count: produtos.length }, ...Object.entries(m).map(([n, c]) => ({ nome: n, count: c }))].sort((a, b) => { if (a.nome === 'Todos') return -1; if (b.nome === 'Todos') return 1; return a.nome.localeCompare(b.nome); });
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const mc = filtroAtivo === 'Todos' || p.status === filtroAtivo;
      const mb = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase());
      return mc && mb;
    });
  }, [filtroAtivo, busca, produtos]);

  if (tela === 'checkout') return <TelaCheckout carrinho={carrinho} setCarrinho={setCarrinho} onVoltar={() => setTela('lista')} />;
  if (tela === 'detalhe' && produtoSelecionado) return <TelaDetalhe produto={produtoSelecionado} onVoltar={() => setTela('lista')} onAddCarrinho={(i) => setCarrinho(p => [...p, i])} />;

  return (
    <div className="loja-page"><MenuPage /><div className="loja-container">
      <div className="loja-header"><BTNVolta /><div className="loja-header__text"><p className="eyebrow">Catálogo Kasaleve</p><h1 className="loja-title">{loggedin ? 'Monte seu Pedido' : 'Conheça nossos Produtos'}</h1></div><div className="loja-header__actions">{loggedin && carrinho.length > 0 && (<button className="btn-ver-carrinho" onClick={() => setTela('checkout')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>Ver Carrinho ({carrinho.length}) →</button>)}</div></div>
      <div className="loja-search"><svg className="loja-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg><input type="text" className="loja-search__input" placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />{busca && <button className="loja-search__clear" onClick={() => setBusca('')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}</div>
      <div className="loja-filtros"><div className="loja-filtros__scroll">{categorias.map(c => (<button key={c.nome} className={`loja-filtro-btn ${filtroAtivo === c.nome ? 'loja-filtro-btn--active' : ''}`} onClick={() => setFiltroAtivo(c.nome)}>{c.nome !== 'Todos' && <span className="loja-filtro-btn__icon">{iconesCategoria[c.nome] || '📦'}</span>}<span className="loja-filtro-btn__label">{c.nome}</span><span className="loja-filtro-btn__count">{c.count}</span></button>))}</div></div>
      <div className="loja-resultados"><span>{produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</span>{(filtroAtivo !== 'Todos' || busca) && <button className="loja-resultados__clear" onClick={() => { setFiltroAtivo('Todos'); setBusca(''); }}>Limpar filtros<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}</div>
      {produtosFiltrados.length > 0 ? (
        <div className="loja-grid">{produtosFiltrados.map((p, i) => (
          <div className="produto-card" key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="produto-card__img-wrap">{p.img ? <img src={p.img} alt={p.nome} className="produto-card__img" /> : <div className="produto-card__img-placeholder"><span className="produto-card__placeholder-icon">{iconesCategoria[p.status] || '📦'}</span><span className="produto-card__placeholder-name">{p.nome}</span></div>}<span className="produto-card__badge">{p.status}</span></div>
            <div className="produto-card__body"><h3 className="produto-card__nome">{p.nome}</h3><p className="produto-card__desc">{p.descricao}</p>{loggedin && (p.variacoes?.length > 1) && <div className="produto-card__variacoes-info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>{p.variacoes.length} variações disponíveis</div>}<div className="produto-card__footer">{loggedin ? (<><div className="produto-card__preco-row"><span className="produto-card__preco">{formatPrice(p.variacoes?.[0]?.preco || 0)}</span>{p.variacoes?.length > 1 && <span className="produto-card__preco-range">a partir de</span>}</div><button className="btn-comprar" onClick={() => { setProdutoSelecionado(p); setTela('detalhe'); }}>Personalizar →</button></>) : (<Link to="/Login" className="btn-login-catalogo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>Desbloquear preço</Link>)}</div></div>
          </div>
        ))}</div>
      ) : (
        <div className="loja-empty-search"><div className="loja-empty-search__icon">🔍</div><h3>Nenhum produto encontrado</h3><p>Tente alterar os filtros ou o termo de busca.</p><button className="loja-empty-search__btn" onClick={() => { setFiltroAtivo('Todos'); setBusca(''); }}>Ver todos os produtos</button></div>
      )}
    </div></div>
  );
}

export default Carrinho;