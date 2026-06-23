import "../css/carrinho.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';

// ─── DADOS DE CORES ──────────────────────────────────────────────────────────
const PINTURA = [
  { id:'p1', nome:'Fendi', hex:'#8a7a58', cat:'pintura' },
  { id:'p5', nome:'Off White', hex:'#e8e4d8', cat:'pintura' },
  { id:'p7', nome:'Preto', hex:'#1a1a1a', cat:'pintura' },
];
const CORDAS = [
  { id:'c1', nome:'Verde Musgo', codigo:'#70292', hex:'#4a5e3a', cat:'corda' },
  { id:'c7', nome:'Preto', codigo:'#70268', hex:'#1a1a1a', cat:'corda' },
  { id:'c3', nome:'Mescla Areia', codigo:'#84202', hex:'#c8b89a', cat:'corda' },
];
const TECIDOS = [
  { id:'t1', nome:'Linho Natural', fabricante:'Karsten', hex:'#c4b89a', cat:'tecido' },
  { id:'t6', nome:'Azul Naval', fabricante:'Karsten', hex:'#1e2f5a', cat:'tecido' },
];

const produtos = [
  { id:1, nome:'Cadeira Náutica Premium', descricao:'Design moderno com acabamento em alumínio e corda náutica.', preco:890.00, img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id:2, nome:'Poltrona Outdoor', descricao:'Conforto e durabilidade para ambientes externos.', preco:1200.00, img:'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id:3, nome:'Mesa de Centro', descricao:'Acabamento fino em alumínio escovado.', preco:980.00, img:'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const formatPrice = (v) => v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

// Função formatadora específica para o jsPDF (sem o R$ para permitir alinhamento manual perfeito)
const fmtPDF = (v) => Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ─── MODAL DE CORES ──────────────────────────────────────────────────────────
function ModalPersonalizacao({ aberto, onFechar, onConfirmar, selecoes, setSelecoes }) {
  const [aba, setAba] = useState('pintura');
  if (!aberto) return null;
  function selecionar(item) {
    setSelecoes(prev => {
      const novo = { ...prev };
      if (novo[item.cat]?.id === item.id) delete novo[item.cat]; else novo[item.cat] = item;
      return novo;
    });
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
          {[{ id:'pintura', label:'Alumínio' }, { id:'cordas', label:'Cordas' }, { id:'tecidos', label:'Tecidos' }].map(a => (
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

// ─── PREVIEW DA COMBINAÇÃO (Que você pediu para voltar) ─────────────────────
function PreviewCombinacao({ selecoes, onEditar }) {
  const temSelecao = Object.keys(selecoes).length > 0;
  return (
    <div className="preview-box">
      <div className="preview-box__header">
        <p className="preview-box__title">Sua Seleção</p>
        {temSelecao && <button className="preview-box__edit" onClick={onEditar}>✏️ Editar</button>}
      </div>
      {!temSelecao ? (
        <div className="preview-vazio"><p>Nenhuma cor selecionada</p></div>
      ) : (
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

// ─── LÓGICA DO PDF (Idêntico à 2ª imagem que você enviou) ─────────────────
async function gerarPDF(itensCarrinho) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const L = 15, R = 195;
  let y = 25;

  // 1. Título
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(200, 30, 30);
  doc.text('ORÇAMENTO', L, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
  const dataHoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Pederneiras, ${dataHoje}`, R, y, { align: 'right' });
  y += 15;

  // 2. Cabeçalho da Tabela
  const colDesc = L + 15, colQtd = R - 75, colUnit = R - 55, colTotal = R - 2;
  doc.setFillColor(60, 60, 60); doc.rect(L, y, R - L, 10, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.text('ITEM', L + 2, y + 6.5);
  doc.text('DESCRIÇÃO', colDesc + 2, y + 6.5);
  doc.text('QTD', colQtd + 2, y + 6.5);
  doc.text('VALOR UNIT.', colUnit + 2, y + 6.5);
  doc.text('VALOR TOTAL', colTotal, y + 6.5, { align: 'right' });
  y += 10;

  // 3. Linhas da Tabela (Zebra)
  itensCarrinho.forEach((item, index) => {
    let detalhes = [];
    if (item.personalizacao?.pintura) detalhes.push(`Alumínio: ${item.personalizacao.pintura.nome}`);
    if (item.personalizacao?.corda) detalhes.push(`Corda: ${item.personalizacao.corda.nome}`);
    if (item.personalizacao?.tecido) detalhes.push(`Tecido: ${item.personalizacao.tecido.nome}`);
    const descCompleta = detalhes.length > 0 ? `${item.nome}\n${detalhes.join(' | ')}` : item.nome;
    
    const linhas = doc.splitTextToSize(descCompleta, (colUnit - colDesc) - 8);
    const altLinha = Math.max(12, linhas.length * 4.5 + 4);

    if (index % 2 !== 0) { doc.setFillColor(225, 225, 225); doc.rect(L, y, R - L, altLinha, 'F'); }
    
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.rect(L, y, R - L, altLinha);
    doc.line(colDesc, y, colDesc, y + altLinha);
    doc.line(colQtd, y, colQtd, y + altLinha);
    
    // Traço grosso (O segredo do layout Kasaleve)
    doc.setDrawColor(120, 120, 120); doc.setLineWidth(0.8);
    doc.line(colTotal - 32, y, colTotal - 32, y + altLinha);

    doc.setTextColor(0, 0, 0); doc.setFontSize(9); doc.text(String(index + 1), L + 2, y + 5);
    
    doc.setFont('helvetica', 'bold'); doc.text(item.nome, colDesc + 2, y + 5);
    if (detalhes.length > 0) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(80, 80, 80);
      doc.text(detalhes.join(' | '), colDesc + 2, y + 10, { maxWidth: (colUnit - colDesc) - 8 });
      doc.setTextColor(0, 0, 0);
    }

    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    const yTexto = detalhes.length > 0 ? 7 : 5;
    doc.text(String(item.qtd), colQtd + 2, y + yTexto);
    doc.text(fmtPDF(item.preco), colUnit + 2, y + yTexto, { align: 'right' });
    doc.text(fmtPDF(item.preco * item.qtd), colTotal, y + yTexto, { align: 'right' });

    y += altLinha;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  // 4. Blocos de Total
  y += 10;
  const totalProdutos = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
  const valorFrete = totalProdutos * 0.085;

  const drawTotalRow = (label, valor, yPos) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    doc.text(label, colUnit, yPos + 6);
    doc.setFillColor(240, 240, 240); doc.rect(colTotal - 35, yPos, 35, 9, 'F');
    doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.5); doc.rect(colTotal - 35, yPos, 35, 9);
    doc.text(`R$ ${fmtPDF(valor)}`, colTotal - 32, yPos + 6, { align: 'right' });
  };

  drawTotalRow('TOTAL:', totalProdutos, y); y += 14;
  drawTotalRow('FRETE:', valorFrete, y); y += 20;

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5); doc.line(colTotal - 50, y - 2, colTotal, y - 2);
  doc.setFontSize(11); doc.text('TOTAL GERAL:', colTotal - 50, y + 6);
  doc.setFontSize(14); doc.text(`R$ ${fmtPDF(totalProdutos + valorFrete)}`, colTotal, y + 6, { align: 'right' });

  // 5. Termos e Assinatura
  y += 25;
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5);
  doc.setFillColor(245, 245, 245); doc.rect(L, y, R - L, 9, 'F'); doc.rect(L, y, R - L, 9);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('TERMOS E CONDIÇÕES GERAIS', (L + R) / 2, y + 6, { align: 'center' });
  y += 9;
  doc.setFillColor(255, 255, 255); doc.rect(L, y, R - L, 25, 'F'); doc.rect(L, y, R - L, 25);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  const termos = "Orçamento válido por 05 (cinco) dias úteis a partir da data de emissão. Após este prazo, os valores e condições aqui descritos poderão sofrer alterações sem prévio aviso.";
  doc.splitTextToSize(termos, R - L - 20).forEach(linha => { doc.text(linha, L + 10, y + 6); y += 4.5; });

  y = Math.max(y + 30, 260);
  doc.setLineWidth(0.3); doc.line((L + R) / 2 - 40, y, (L + R) / 2 + 40, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('Assinatura / Kasaleve', (L + R) / 2, y + 5, { align: 'center' });

  doc.save(`Orcamento_Kasaleve_${Date.now()}.pdf`);
}

// ─── TELA DE DETALHE ──────────────────────────────────────────────────────────
function TelaDetalhe({ produto, onVoltar, onAddCarrinho }) {
  const { loggedin } = useContext(AuthContext);
  const [selecoes, setSelecoes] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [qtd, setQtd] = useState(1);

  function adicionar() {
    onAddCarrinho({ ...produto, qtd, personalizacao: selecoes, cartId: Date.now() });
    onVoltar();
  }

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container detalhe-container">
        <button className="btn-voltar-det" onClick={onVoltar}>← Voltar</button>
        <div className="detalhe-grid">
          <div className="detalhe-img-box"><img src={produto.img} alt={produto.nome} className="detalhe-img" /></div>
          <div className="detalhe-info">
            <h1 className="detalhe-nome">{produto.nome}</h1>
            <p className="detalhe-desc">{produto.descricao}</p>
            {loggedin ? (
              <>
                <p className="detalhe-preco">{formatPrice(produto.preco)}</p>
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
                <button className="btn-add-carrinho" onClick={adicionar}>Adicionar ao Carrinho</button>
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

// ─── TELA DO CARRINHO (Visual de Orçamento) ──────────────────────────────────
function TelaCheckout({ carrinho, setCarrinho, onVoltar }) {
  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  function finalizar() {
    if(carrinho.length === 0) return;
    gerarPDF(carrinho);
    setCarrinho([]);
    alert("Orçamento gerado com sucesso!");
    onVoltar();
  }

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="orc-bg">
        <div className="orc-paper" style={{ maxWidth: '100%' }}>
          <button className="orc-back-link" onClick={onVoltar}>← Continuar comprando</button>
          <header className="orc-header">
            <div className="orc-logo">
              <span className="orc-logo__name">kasaleve</span>
              <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
              <div className="orc-logo__underline" />
            </div>
            <div className="orc-empresa-info">
              <p>Kasaleve Industria Decor Moveis LTDA</p>
              <p className="orc-empresa-info__link">www.kasaleve.com.br</p>
            </div>
          </header>
          <div className="orc-titulo-row">
            <h1 className="orc-titulo-orcamento">ORÇAMENTO</h1>
            <div className="orc-enviado-em">Enviado em: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></div>
          </div>
          <section className="orc-section">
            {carrinho.length === 0 ? (
              <div className="carrinho-vazio">Seu orçamento está vazio.</div>
            ) : (
              <table className="orc-table">
                <thead>
                  <tr>
                    <th className="col-img center">Img</th>
                    <th className="col-item">Item</th>
                    <th className="col-desc">Descrição (Personalização)</th>
                    <th className="col-qtd center">Qtd</th>
                    <th className="col-unit right">Unit.</th>
                    <th className="col-total right">Total</th>
                    <th className="col-del"></th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map((item, index) => (
                    <tr key={item.cartId}>
                      <td className="center"><img src={item.img} className="orc-table-img" alt="" /></td>
                      <td><div className="orc-desc-nome">{item.nome}</div></td>
                      <td>
                        <div className="orc-desc-extra" style={{ fontSize: '11px', color: '#555' }}>
                          {item.personalizacao?.pintura && <span style={{marginRight: 8}}>🔵 Alumínio: {item.personalizacao.pintura.nome}</span>}
                          {item.personalizacao?.corda && <span style={{marginRight: 8}}>🟢 Corda: {item.personalizacao.corda.nome}</span>}
                          {item.personalizacao?.tecido && <span>🟤 Tecido: {item.personalizacao.tecido.nome}</span>}
                        </div>
                      </td>
                      <td className="center">{item.qtd}</td>
                      <td className="right orc-unit-cell">{formatPrice(item.preco)}</td>
                      <td className="right">{formatPrice(item.preco * item.qtd)}</td>
                      <td className="center"><button className="orc-btn-del" onClick={() => setCarrinho(prev => prev.filter(i => i.cartId !== item.cartId))}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <div className="orc-total-row">
            <span>TOTAL:</span>
            <span className="orc-total-valor">{formatPrice(total)}</span>
          </div>
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button className="btn-finalizar" onClick={finalizar}>GERAR ORÇAMENTO PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TELA PRINCIPAL ────────────────────────────────────────────────────
function Carrinho() {
  const { loggedin } = useContext(AuthContext);
  const [tela, setTela] = useState('lista');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const navigate = useNavigate();

  if (tela === 'checkout') return <TelaCheckout carrinho={carrinho} setCarrinho={setCarrinho} onVoltar={() => setTela('lista')} />;
  if (tela === 'detalhe' && produtoSelecionado) return <TelaDetalhe produto={produtoSelecionado} onVoltar={() => setTela('lista')} onAddCarrinho={(item) => setCarrinho(prev => [...prev, item])} />;

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container">
        <div className="loja-header">
          <BTNVolta />
          <div className="loja-header__text">
            <p className="eyebrow">Catálogo Kasaleve</p>
            <h1 className="loja-title">{loggedin ? 'Monte seu Pedido' : 'Conheça nossos Produtos'}</h1>
          </div>
          <div className="loja-header__actions">
            {loggedin && carrinho.length > 0 && <button className="btn-ver-carrinho" onClick={() => setTela('checkout')}>Ver Orçamento ({carrinho.length}) →</button>}
          </div>
        </div>
        <div className="loja-grid">
          {produtos.map((p, i) => (
            <div className="produto-card" key={p.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="produto-card__img-wrap"><img src={p.img} alt={p.nome} className="produto-card__img" /></div>
              <div className="produto-card__body">
                <h3 className="produto-card__nome">{p.nome}</h3>
                <p className="produto-card__desc">{p.descricao}</p>
                <div className="produto-card__footer">
                  {loggedin ? (
                    <>
                      <span className="produto-card__preco">{formatPrice(p.preco)}</span>
                      <button className="btn-comprar" onClick={() => { setProdutoSelecionado(p); setTela('detalhe'); }}>Personalizar →</button>
                    </>
                  ) : (
                    <Link to="/Login" className="btn-login-catalogo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Desbloquear preço</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;