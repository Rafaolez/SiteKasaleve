import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";
import ProdutosAPILocal from '../assets/ProdutosAPILocal';
import ProdutosApiLocalLojista from '../assets/ProdutosApiLocalLojista';

const produtos = ProdutosAPILocal;
const produtosLojista = ProdutosApiLocalLojista;

// ─── DADOS DA EMPRESA ──
const DADOS_EMPRESA = {
  nome: 'kasaleve',
  subtitulo: 'projeto • conforto',
  razaoSocial: 'Kasaleve Industria Decor Moveis LTDA',
  endereco: 'Avenida Craveiro e Cravinho 1001 - Parque Industrial Fuad Razuk - Pederneiras SP',
  site: 'www.kasaleve.com.br',
  telefone: '14 9.9893.9852',
};

const API_CLIENTES = [
  { id: 1, nome: 'João Silva', telefone: '(11) 99999-1111', endereco: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01310-100', cpf: '123.456.789-00', ie: '1234567890', bairro: 'Centro' },
  { id: 2, nome: 'Maria Souza', telefone: '(19) 98888-2222', endereco: 'Av. Brasil, 456', cidade: 'Pederneiras', estado: 'SP', cep: '16400-000', cpf: '987.654.321-00', ie: '0987654321', bairro: 'Jardim' },
];

// ─── PERFIS DE PREÇO (somente 2) ──
const PERFIS_PRECO = [
  { id: 'padrao', label: 'Padrão' },
  { id: 'lojista', label: 'Lojista' },
];

const FRETE_PERCENT = 0.085;

// ─── CIDADES DA REGIÃO DE PEDERNEIRAS (FRETE ISENTO) ──
const CIDADES_SEM_FRETE = [
  'Pederneiras', 'Bauru', 'Agudos', 'Lençóis Paulista', 'Piratininga',
  'Avaí', 'Bocaina', 'Ubirajara', 'Iacanga', 'Arealva',
  'Duartina', 'Pongaí', 'Macatuba', 'Bariri', 'Boracéia',
  'Areiópolis', 'Getulina', 'Igaraçu do Tietê',
];
function ehRegiaoSemFrete(cidade) {
  if (!cidade) return false;
  const c = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  return CIDADES_SEM_FRETE.some(m => m.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase() === c);
}

const fmtBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const gerarNumero = () => `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const ITEM_VAZIO = () => ({ id: Date.now() + Math.random(), nomeProduto: '', nomeExtra: '', qtd: 1, unitarioPadrao: 0, image: '', _tampo: '', _medidaIdx: 0, _cores: {} });
const CLIENTE_VAZIO = { nome: '', telefone: '', email: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cpf: '', ie: '', vendedora: '' };

const TERMOS_PADRAO = [
  { titulo: 'Descrição dos Móveis', texto: 'O VENDEDOR declara que os móveis fornecidos serão fabricados conforme as especificações descritas neste documento.' },
  { titulo: 'Data de Entrega', texto: 'A KASALEVE se compromete a entregar os móveis conforme o cronograma acordado.' },
  { titulo: 'Qualidade e Durabilidade', texto: 'Os móveis serão fabricados com materiais de qualidade e durabilidade adequadas. A KASALEVE garante que os móveis atenderão aos padrões exigidos.' },
  { titulo: 'Pagamento e Sinal', texto: 'O COMPRADOR se compromete a não desistir do pedido após confirmação e o pagamento do sinal.' },
  { titulo: 'Rescisão e Penalidades', texto: 'Em caso de descumprimento das obrigações, as partes poderão rescindir o contrato mediante notificação por escrito. O COMPRADOR estará sujeito a penalidades em caso de desistência após o pagamento do sinal.' },
  { titulo: 'Foro', texto: 'Fica eleito o foro da cidade de [informar a cidade do cliente] para dirimir quaisquer questões decorrentes deste contrato.' },
];

// ─── DADOS DE CORES ──
const PINTURA = [
  { id: 'p1', nome: 'Fendi', hex: '#8a7a58', cat: 'pintura' },
  { id: 'p5', nome: 'Off White', hex: '#e8e4d8', cat: 'pintura' },
  { id: 'p7', nome: 'Preto', hex: '#1a1a1a', cat: 'pintura' },
];
const CORDAS = [
  { id: 'c1', nome: 'Verde Musgo', hex: '#4a5e3a', cat: 'corda' },
  { id: 'c7', nome: 'Preto', hex: '#1a1a1a', cat: 'corda' },
  { id: 'c3', nome: 'Mescla Areia', hex: '#c8b89a', cat: 'corda' },
];
const TECIDOS = [
  { id: 't1', nome: 'Linho Natural', hex: '#c4b89a', cat: 'tecido' },
  { id: 't6', nome: 'Azul Naval', hex: '#1e2f5a', cat: 'tecido' },
];
const COLOR_LISTS = { pintura: PINTURA, cordas: CORDAS, tecidos: TECIDOS };

const TAMPOS_PADRAO = ['Ripado', 'Pizza', 'Alumínio'];
const STATUS_MESA = ['Mesa de Centro', 'Mesa de Canto', 'Mesa', 'Mesa de Jantar', 'Champanheira', 'Bistrô'];

const iconesCategoria = {
  'Sofá': '🛋️', 'Poltrona': '💺', 'Mesa de Centro': '◀▶', 'Mesa de Canto': '◇', 'Mesa': '◻',
  'Chaise': '☀', 'Cadeira': '🪑', 'Banqueta': '🔘', 'Modular': '⬡', 'Puff': '◉',
  'Balanço': '🌙', 'Espreguiçadeira': '∽', 'Acessório': '⚙', 'Champanheira': '🥂',
  'Bistrô': '🍽️', 'Mesa de Jantar': '▫', 'Tapete': '🟫', 'Caminha': '🐕',
};

// ─── HELPERS ──
async function buscarCEP(cep) {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const j = await r.json();
    if (j.erro) return null;
    return { endereco: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf };
  } catch { return null; }
}

const getBase64ImageFromUrl = async (imageUrl) => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
};

function ehMesa(status) { return STATUS_MESA.includes(status); }

function getTamposDoProduto(produto) {
  if (!produto || !ehMesa(produto.status)) return null;
  const existentes = [...new Set((produto.variacoes || []).filter(v => v.tampo).map(v => v.tampo))];
  return existentes.length > 0 ? existentes : TAMPOS_PADRAO;
}

function temVariacaoParaTampo(produto, tampo) {
  return (produto.variacoes || []).some(v => v.tampo === tampo);
}

// ════════════════════════════════════════════════════════
//  MODAL SELETOR DE PRODUTO
// ════════════════════════════════════════════════════════
function ModalSeletorProduto({ aberto, onFechar, onSelecionar, itemInicial, listaProdutos }) {
  const [step, setStep] = useState('grid');
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [produtoSel, setProdutoSel] = useState(() => {
    if (!itemInicial?.nomeProduto || !listaProdutos) return null;
    return listaProdutos.find(p => p.nome === itemInicial.nomeProduto) || null;
  });
  const [tampoSel, setTampoSel] = useState(() => {
    if (!produtoSel) return null;
    const t = getTamposDoProduto(produtoSel);
    if (itemInicial?._tampo && t?.includes(itemInicial._tampo)) return itemInicial._tampo;
    return t?.find(tp => temVariacaoParaTampo(produtoSel, tp)) || t?.[0] || null;
  });
  const [medidaIdx, setMedidaIdx] = useState(itemInicial?._medidaIdx || 0);
  const [qtd, setQtd] = useState(itemInicial?.qtd || 1);
  const [selecoesCor, setSelecoesCor] = useState(itemInicial?._cores || {});
  const [abaCor, setAbaCor] = useState('pintura');

  const categorias = useMemo(() => {
    if (!listaProdutos) return [];
    const m = {}; listaProdutos.forEach(p => { m[p.status] = (m[p.status] || 0) + 1; });
    return [{ nome: 'Todos', count: listaProdutos.length }, ...Object.entries(m).map(([n, c]) => ({ nome: n, count: c }))].sort((a, b) => {
      if (a.nome === 'Todos') return -1; if (b.nome === 'Todos') return 1; return a.nome.localeCompare(b.nome);
    });
  }, [listaProdutos]);

  const produtosFiltrados = useMemo(() => {
    if (!listaProdutos) return [];
    return listaProdutos.filter(p => {
      const mc = filtroCategoria === 'Todos' || p.status === filtroCategoria;
      const mb = busca === '' || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase());
      return mc && mb;
    });
  }, [filtroCategoria, busca, listaProdutos]);

  if (!aberto) return null;

  function selecionarCor(item) {
    setSelecoesCor(prev => { const n = { ...prev }; if (n[item.cat]?.id === item.id) delete n[item.cat]; else n[item.cat] = item; return n; });
  }

  function handleProdutoClick(produto) {
    setProdutoSel(produto);
    const eM = ehMesa(produto.status);
    const tampos = getTamposDoProduto(produto);
    if (eM && tampos) {
      setTampoSel(tampos.find(t => temVariacaoParaTampo(produto, t)) || tampos[0] || null);
    } else { setTampoSel(null); }
    setMedidaIdx(0); setQtd(1); setSelecoesCor({}); setAbaCor('pintura');
    setStep('detail');
  }

  function handleTampoClick(t) {
    if (!temVariacaoParaTampo(produtoSel, t)) return;
    setTampoSel(t); setMedidaIdx(0);
  }

  const eMesa = ehMesa(produtoSel?.status);
  const tamposExibidos = getTamposDoProduto(produtoSel);
  const varsFiltradas = eMesa && tampoSel ? (produtoSel?.variacoes || []).filter(v => v.tampo === tampoSel) : (produtoSel?.variacoes || []);
  const varAtual = varsFiltradas[medidaIdx] || varsFiltradas[0];
  const imgAtual = varAtual?.img || produtoSel?.img;

  function handleConfirmar() {
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
  }

  const S = {
    overlay: { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
    box: { background: '#fff', width: '100%', maxWidth: 920, maxHeight: '92vh', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    header: { padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
    eyebrow: { fontSize: 10, color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', margin: 0, fontFamily: "'Sora', sans-serif" },
    title: { fontSize: 18, fontWeight: 600, margin: '2px 0 0', fontFamily: "'Sora', sans-serif", color: '#1a1a1a' },
    closeBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', padding: '4px 8px', borderRadius: 4, transition: 'color 0.15s' },
    searchWrap: { padding: '12px 24px', borderBottom: '1px solid #eee', flexShrink: 0 },
    searchInput: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, fontFamily: "'Sora', sans-serif", outline: 'none', transition: 'border-color 0.2s' },
    filtrosWrap: { padding: '8px 24px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: '1px solid #eee', flexShrink: 0, scrollbarWidth: 'none' },
    filtroBtn: (ativo) => ({ padding: '5px 12px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 500, transition: 'all 0.15s', borderColor: ativo ? '#1a1a1a' : '#ddd', background: ativo ? '#1a1a1a' : '#fff', color: ativo ? '#fff' : '#666' }),
    gridWrap: { flex: 1, overflowY: 'auto', padding: '16px 24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 12 },
    card: { border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', background: '#fff' },
    cardImg: { height: 115, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    cardImgEl: { width: '100%', height: '100%', objectFit: 'cover' },
    cardBody: { padding: '8px 10px 10px' },
    cardNome: { fontSize: 11, fontWeight: 600, margin: '0 0 2px', lineHeight: 1.3, fontFamily: "'Sora', sans-serif", color: '#1a1a1a' },
    cardStatus: { fontSize: 9, color: '#999', margin: 0, fontFamily: "'Sora', sans-serif" },
    emptyState: { textAlign: 'center', padding: 50, color: '#aaa' },
    detailWrap: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    detailImgWrap: { width: '100%', height: 220, background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
    detailImg: { maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 4 },
    detailContent: { padding: '20px 24px', flex: 1, overflowY: 'auto' },
    badge: { display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontFamily: "'Sora', sans-serif" },
    nome: { fontSize: 22, fontWeight: 700, margin: '0 0 4px', fontFamily: "'Sora', sans-serif", color: '#1a1a1a' },
    desc: { fontSize: 12, color: '#777', margin: '0 0 18px', fontFamily: "'Sora', sans-serif", lineHeight: 1.5 },
    sectionLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: 8, fontFamily: "'Sora', sans-serif", letterSpacing: 0.3 },
    pillRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
    pill: (ativo, dispo) => ({ padding: '7px 16px', borderRadius: 6, border: '1.5px solid', fontSize: 12, cursor: dispo ? 'pointer' : 'not-allowed', fontFamily: "'Sora', sans-serif", fontWeight: 500, transition: 'all 0.15s', borderColor: ativo ? '#1a1a1a' : '#ddd', background: ativo ? '#1a1a1a' : '#fff', color: ativo ? '#fff' : (!dispo ? '#ccc' : '#555'), opacity: dispo ? 1 : 0.5 }),
    corTabs: { display: 'flex', gap: 4, marginBottom: 10 },
    corTab: (ativo) => ({ padding: '5px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 500, transition: 'all 0.15s', background: ativo ? '#1a1a1a' : '#f0f0ee', color: ativo ? '#fff' : '#777' }),
    corChips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
    corChip: (sel) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, border: '1.5px solid', borderColor: sel ? '#1a1a1a' : '#e8e8e8', background: sel ? '#f8f8f6' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }),
    corSwatch: (hex, sel) => ({ width: 24, height: 24, borderRadius: 6, background: hex, border: sel ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }),
    corNome: { fontSize: 11, fontWeight: 500, fontFamily: "'Sora', sans-serif", color: '#333' },
    paleta: { display: 'flex', gap: 6, marginBottom: 16 },
    paletaDot: (hex) => ({ width: 26, height: 26, borderRadius: '50%', background: hex, border: '2px solid #fff', boxShadow: '0 0 0 1px #ddd', flexShrink: 0 }),
    priceRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8, padding: '16px 0 0', borderTop: '1px solid #eee' },
    priceLabel: { fontSize: 10, color: '#999', margin: 0, fontFamily: "'Sora', sans-serif" },
    priceValue: { fontSize: 24, fontWeight: 700, margin: '2px 0 0', fontFamily: "'Sora', sans-serif", color: '#1a1a1a' },
    qtyBox: { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' },
    qtyBtn: { width: 34, height: 34, border: 'none', background: '#f8f8f6', fontSize: 16, cursor: 'pointer', fontFamily: "'Sora', sans-serif", color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyVal: { width: 42, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, fontFamily: "'Sora', sans-serif", borderLeft: '1px solid #eee', borderRight: '1px solid #eee' },
    footer: { padding: '14px 24px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 },
    btnBack: { padding: '10px 20px', border: '1px solid #ddd', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif", color: '#555', fontWeight: 500 },
    btnConfirm: (ok) => ({ padding: '10px 28px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: "'Sora', sans-serif", background: ok ? '#1a1a1a' : '#ccc', color: '#fff', transition: 'opacity 0.15s' }),
  };

  return (
    <div style={S.overlay} onClick={onFechar}>
      <div style={S.box} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <div>
            <p style={S.eyebrow}>Kasaleve</p>
            <h2 style={S.title}>{step === 'grid' ? 'Selecionar Produto' : produtoSel?.nome}</h2>
          </div>
          <button style={S.closeBtn} onClick={onFechar} onMouseEnter={e => e.target.style.color = '#1a1a1a'} onMouseLeave={e => e.target.style.color = '#888'}>✕</button>
        </div>
        {step === 'grid' ? (
          <>
            <div style={S.searchWrap}>
              <input type="text" placeholder="Buscar produto por nome..." value={busca} onChange={e => setBusca(e.target.value)} style={S.searchInput} onFocus={e => e.target.style.borderColor = '#1a1a1a'} onBlur={e => e.target.style.borderColor = '#ddd'} />
            </div>
            <div style={S.filtrosWrap}>
              {categorias.map(c => (
                <button key={c.nome} onClick={() => setFiltroCategoria(c.nome)} style={S.filtroBtn(filtroCategoria === c.nome)}>
                  {c.nome !== 'Todos' && `${iconesCategoria[c.nome] || '📦'} `}{c.nome} ({c.count})
                </button>
              ))}
            </div>
            <div style={S.gridWrap}>
              <div style={S.grid}>
                {produtosFiltrados.map(p => (
                  <div key={p.id} style={S.card} onClick={() => handleProdutoClick(p)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={S.cardImg}>
                      {p.img ? <img src={p.img} alt={p.nome} style={S.cardImgEl} /> : <span style={{ fontSize: 36 }}>{iconesCategoria[p.status] || '📦'}</span>}
                    </div>
                    <div style={S.cardBody}>
                      <p style={S.cardNome}>{p.nome}</p>
                      <p style={S.cardStatus}>{iconesCategoria[p.status] || ''} {p.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              {produtosFiltrados.length === 0 && (
                <div style={S.emptyState}>
                  <p style={{ fontSize: 32, margin: '0 0 8px' }}>🔍</p>
                  <p style={{ margin: 0, fontSize: 13 }}>Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={S.detailWrap}>
              <div style={S.detailImgWrap}>
                {imgAtual ? <img src={imgAtual} alt={produtoSel?.nome} style={S.detailImg} /> : <span style={{ fontSize: 64 }}>{iconesCategoria[produtoSel?.status] || '📦'}</span>}
              </div>
              <div style={S.detailContent}>
                <span style={S.badge}>{iconesCategoria[produtoSel?.status]} {produtoSel?.status}</span>
                <h3 style={S.nome}>{produtoSel?.nome}</h3>
                <p style={S.desc}>{produtoSel?.descricao}</p>
                {eMesa && tamposExibidos && tamposExibidos.length > 1 && (
                  <><label style={S.sectionLabel}>Tipo de Tampo:</label>
                  <div style={S.pillRow}>{tamposExibidos.map(t => { const disp = temVariacaoParaTampo(produtoSel, t); return (<button key={t} onClick={() => handleTampoClick(t)} disabled={!disp} style={S.pill(tampoSel === t, disp)}>{t}{!disp && ' ✕'}</button>); })}</div></>
                )}
                {varsFiltradas.length > 1 && (
                  <><label style={S.sectionLabel}>{eMesa ? 'Medida:' : 'Variação:'}</label>
                  <div style={S.pillRow}>{varsFiltradas.map((v, i) => (<button key={i} onClick={() => setMedidaIdx(i)} style={S.pill(medidaIdx === i, true)}>{v.medida || `Opção ${i + 1}`}</button>))}</div></>
                )}
                <label style={S.sectionLabel}>Personalização de Cores:</label>
                <div style={S.corTabs}>
                  {[{ id: 'pintura', label: 'Alumínio' }, { id: 'cordas', label: 'Cordas' }, { id: 'tecidos', label: 'Tecidos' }].map(a => (
                    <button key={a.id} onClick={() => setAbaCor(a.id)} style={S.corTab(abaCor === a.id)}>{a.label}</button>
                  ))}
                </div>
                <div style={S.corChips}>
                  {COLOR_LISTS[abaCor].map(item => {
                    const sel = selecoesCor[item.cat]?.id === item.id;
                    return (<div key={item.id} onClick={() => selecionarCor(item)} style={S.corChip(sel)}><div style={S.corSwatch(item.hex, sel)}>{sel && '✓'}</div><span style={S.corNome}>{item.nome}</span></div>);
                  })}
                </div>
                {Object.keys(selecoesCor).length > 0 && (
                  <div style={S.paleta}>{Object.values(selecoesCor).map(s => <div key={s.id} style={S.paletaDot(s.hex)} title={s.nome} />)}</div>
                )}
                <div style={S.priceRow}>
                  <div><p style={S.priceLabel}>Preço unitário</p><p style={S.priceValue}>{varAtual?.preco ? fmtBRL(varAtual.preco) : '—'}</p></div>
                  <div style={S.qtyBox}>
                    <button style={S.qtyBtn} onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
                    <span style={S.qtyVal}>{qtd}</span>
                    <button style={S.qtyBtn} onClick={() => setQtd(q => q + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
            <div style={S.footer}>
              <button style={S.btnBack} onClick={() => setStep('grid')}>← Voltar</button>
              <button style={S.btnConfirm(!!varAtual?.preco)} onClick={handleConfirmar} disabled={!varAtual?.preco}>Confirmar Seleção</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  ETAPA 0 — Cliente já existe?
// ════════════════════════════════════════════════════════
function EtapaClienteExiste({ onSim, onNao }) {
  return (
    <div className="orc-bg">
      <BTNVolta />
      <div className="orc-gate">
        <div className="orc-gate__logo">
          <span className="orc-logo__name">kasaleve</span>
          <span className="orc-logo__tag">projeto • conforto</span>
        </div>
        <div className="orc-gate__card">
          <h2>Novo Orçamento</h2>
          <p>Deseja selecionar um cliente cadastrado ou criar um novo?</p>
          <div className="orc-gate__btns">
            <button className="orc-gate__btn orc-gate__btn--sim" onClick={onSim}>Selecionar Existente</button>
            <button className="orc-gate__btn orc-gate__btn--nao" onClick={onNao}>Novo Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  ETAPA 1B — Novo cliente
// ════════════════════════════════════════════════════════
function EtapaNovoCliente({ onContinuar, onVoltar }) {
  const [form, setForm] = useState(CLIENTE_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepErro, setCepErro] = useState('');
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  async function handleCEP(e) {
    const val = e.target.value; setForm(p => ({ ...p, cep: val })); setCepErro('');
    if (val.replace(/\D/g, '').length === 8) {
      setBuscandoCep(true); const dados = await buscarCEP(val); setBuscandoCep(false);
      if (dados) setForm(p => ({ ...p, ...dados })); else setCepErro('CEP não encontrado.');
    }
  }
  return (
    <div className="orc-bg">
      <div className="orc-paper orc-paper--narrow">
        <button className="orc-back-link" onClick={onVoltar}>← Voltar</button>
        <h2 className="orc-form-title">Cadastro de Cliente</h2>
        <p className="orc-section__hint">Todos os campos são opcionais — preencha o que tiver disponível.</p>
        <div className="orc-cliente-grid">
          <div className="orc-field w-full"><label>Nome Completo</label><input className="orc-input" value={form.nome} onChange={set('nome')} placeholder="Ex: João da Silva" /></div>
          <div className="orc-field"><label>Telefone</label><input className="orc-input" value={form.telefone} onChange={set('telefone')} placeholder="(11) 99999-0000" /></div>
          <div className="orc-field"><label>E-mail</label><input className="orc-input" value={form.email} onChange={set('email')} placeholder="email@exemplo.com" /></div>
          <div className="orc-field"><label>CPF/CNPJ</label><input className="orc-input" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" /></div>
          <div className="orc-field"><label>CEP {buscandoCep && <span className="orc-cep-spinner">⏳</span>}</label><input className="orc-input" value={form.cep} onChange={handleCEP} maxLength={9} placeholder="00000-000" />{cepErro && <small className="orc-cep-erro">{cepErro}</small>}</div>
          <div className="orc-field w-full"><label>Endereço</label><input className="orc-input" value={form.endereco} onChange={set('endereco')} placeholder="Rua, Av..." /></div>
          <div className="orc-field"><label>Número</label><input className="orc-input" value={form.numero} onChange={set('numero')} /></div>
          <div className="orc-field"><label>Bairro</label><input className="orc-input" value={form.bairro} onChange={set('bairro')} /></div>
          <div className="orc-field"><label>Cidade</label><input className="orc-input" value={form.cidade} onChange={set('cidade')} /></div>
          <div className="orc-field"><label>Estado</label><input className="orc-input" value={form.estado} onChange={set('estado')} maxLength={2} placeholder="SP" /></div>
        </div>
        <div className="orc-form-footer"><button className="orc-gate__btn orc-gate__btn--sim" onClick={() => onContinuar(form)}>Continuar para o orçamento →</button></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  TELA PRINCIPAL — Orçamento
// ════════════════════════════════════════════════════════
function TelaOrcamento({ clienteInicial, clienteExistente, onVoltar }) {
  const [numero] = useState(gerarNumero);
  const [dataEmissao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [observacoes, setObs] = useState('');
  const [perfilId, setPerfilId] = useState('padrao');
  const [clientes] = useState(API_CLIENTES);
  const [clienteId, setClienteId] = useState(clienteExistente ? String(clienteExistente.id) : '');
  const [dadosCliente, setDadosCliente] = useState(clienteInicial || CLIENTE_VAZIO);
  const [itens, setItens] = useState([ITEM_VAZIO()]);
  const [editandoItemId, setEditandoItemId] = useState(null);

  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  // Limpa itens ao trocar de tabela de preço (preços diferentes)
  useEffect(() => { setItens([ITEM_VAZIO()]); }, [perfilId]);

  const setDado = (field) => (e) => setDadosCliente(p => ({ ...p, [field]: e.target.value }));
  const addItem = () => setItens(p => [...p, ITEM_VAZIO()]);
  const removeItem = (id) => setItens(p => p.filter(i => i.id !== id));
  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => item.id !== id ? item : { ...item, [field]: value }));
  }, []);
  const selecionarProdutoParaItem = useCallback((dados) => {
    if (!editandoItemId) return;
    setItens(prev => prev.map(item => item.id !== editandoItemId ? item : { ...item, ...dados }));
    setEditandoItemId(null);
  }, [editandoItemId]);
  const abrirModalPara = (id) => setEditandoItemId(id);

  // Lista de produtos conforme perfil selecionado
  const listaAtual = perfilId === 'lojista' ? produtosLojista : produtos;

  // Preço direto da lista (sem desconto, cada lista já tem seu preço)
  const getUnitario = (item) => item.unitarioPadrao;
  const totalProdutos = itens.reduce((acc, i) => acc + Number(i.qtd) * getUnitario(i), 0);

  // Frete: isento para região de Pederneiras
  const semFrete = ehRegiaoSemFrete(dadosCliente.cidade);
  const valorFrete = semFrete ? 0 : totalProdutos * FRETE_PERCENT;
  const totalGeral = totalProdutos + valorFrete;
  const perfilAtual = PERFIS_PRECO.find(p => p.id === perfilId) || PERFIS_PRECO[0];
  const itemEditando = editandoItemId ? itens.find(i => i.id === editandoItemId) : null;

  // ────────────────────────────────────────────
  //  EXPORTAÇÃO PDF
  // ────────────────────────────────────────────
  const handleExportar = async () => {
    const tipo = window.confirm('OK para PDF, Cancelar para DOCX') ? 'pdf' : 'docx';
    if (tipo === 'pdf') await exportarPDF();
    else await exportarDOCX();
  };

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const L = 15, R = 195; let y = 18;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(26); doc.setTextColor(40, 40, 40); doc.text('kasaleve', L, y + 8);
    doc.setFontSize(11); doc.setTextColor(90, 90, 90); doc.text('projeto  •  conforto', L, y + 15);
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.8); doc.line(L, y + 18, L + 75, y + 18);
    doc.setFontSize(8); doc.setTextColor(60, 60, 60); doc.text(DADOS_EMPRESA.razaoSocial, R, y, { align: 'right' });
    const enderecoLines = doc.splitTextToSize(DADOS_EMPRESA.endereco, 85);
    doc.text(enderecoLines, R, y + 4, { align: 'right' });
    doc.setTextColor(37, 99, 235); doc.text(DADOS_EMPRESA.site, R, y + 4 + enderecoLines.length * 3.6, { align: 'right' });
    doc.setTextColor(60, 60, 60); doc.text(DADOS_EMPRESA.telefone, R, y + 4 + enderecoLines.length * 3.6 + 4, { align: 'right' });
    y += 30;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(200, 30, 30); doc.text('ORÇAMENTO', L, y);
    doc.setFontSize(10); doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.text(`Enviado em: ${dataEmissao}`, R, y, { align: 'right' }); y += 8;

    const rowH = 9;
    const grayRow = (label, value, x1, w) => {
      doc.setFillColor(225, 225, 225); doc.rect(x1, y, w, rowH, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 0, 0); doc.text(label, x1 + 2, y + 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(String(value || ''), x1 + 2, y + 7.5);
    };

    grayRow('CLIENTE:', dadosCliente.nome, L, R - L); y += rowH + 1;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 0, 0); doc.text('ENDEREÇO:', L, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(`${dadosCliente.endereco || ''} ${dadosCliente.numero || ''}`, L + 22, y + 4); y += rowH + 3;
    const halfW = (R - L - 2) / 2;
    grayRow('CIDADE:', `${dadosCliente.cidade || ''} ${dadosCliente.estado ? '- ' + dadosCliente.estado : ''}`, L, halfW);
    grayRow('CEP:', dadosCliente.cep, L + halfW + 2, halfW); y += rowH + 1;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('CNPJ/CPF:', L, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(dadosCliente.cpf || '', L + 22, y + 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('IE/RG:', L + halfW + 2, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(dadosCliente.ie || '', L + halfW + 18, y + 4); y += rowH + 3;
    grayRow('CONTATO:', dadosCliente.telefone, L, halfW);
    grayRow('VENDEDORA:', dadosCliente.vendedora, L + halfW + 2, halfW); y += rowH + 8;

    const c1 = L, c2 = L + 14, c3 = R - 75, c4 = R - 55, c5 = R - 30, c6 = R;
    const headerH = 10;
    doc.setFillColor(60, 60, 60); doc.rect(c1, y, c6 - c1, headerH, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('ITEM', c1 + 2, y + 6.5); doc.text('DESCRIÇÃO', c2 + 2, y + 6.5);
    doc.text('QUANTIDADE', c3 + 2, y + 6.5); doc.text('VALOR UNIT.', c4 + 2, y + 6.5);
    doc.text('VALOR TOTAL', c6 - 2, y + 6.5, { align: 'right' }); y += headerH;
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'normal');

    const lineCols = (yTop, h) => {
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.rect(c1, yTop, c6 - c1, h);
      doc.line(c2, yTop, c2, yTop + h); doc.line(c3, yTop, c3, yTop + h); doc.line(c4, yTop, c4, yTop + h);
      doc.setDrawColor(150, 150, 150); doc.setLineWidth(0.5); doc.line(c5, yTop, c5, yTop + h);
    };

    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      const descCompleta = [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
      const unitario = getUnitario(item);
      const totalItem = Number(item.qtd) * unitario;
      const descLines = doc.splitTextToSize(descCompleta || '-', (c3 - c2) - 4);
      const rowHgt = Math.max(12, descLines.length * 4 + 6);
      if (item.image) { try { const imgData = await getBase64ImageFromUrl(item.image); if (imgData) doc.addImage(imgData, 'JPEG', c1 + 1, y + 1, 10, 10); } catch {} }
      doc.setFontSize(9); doc.text(descLines, c2 + 2, y + 5);
      doc.text(String(item.qtd), c3 + 2, y + 6);
      doc.text(fmtBRL(unitario), c4 + 2, y + 6);
      doc.text(fmtBRL(totalItem), c6 - 2, y + 6, { align: 'right' });
      lineCols(y, rowHgt); y += rowHgt;
      if (y > 265) { doc.addPage(); y = 20; }
    }

    y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('TOTAL:', c4, y + 6);
    doc.setFillColor(225, 225, 225); doc.rect(c6 - 55, y, 55, 9, 'F');
    doc.setDrawColor(150); doc.rect(c6 - 55, y, 55, 9);
    doc.text(`R$ ${totalProdutos.toFixed(2).replace('.', ',')}`, c6 - 52, y + 6); y += 18;

    const colDivisor = L + 55;
    doc.setDrawColor(0); doc.setLineWidth(0.3); doc.rect(L, y, R - L, 8);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TERMOS E CONDIÇÕES GERAIS', (L + R) / 2, y + 5.5, { align: 'center' }); y += 8;

    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('FRETE', L + 2, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(semFrete ? 'ISENTO (entrega local)' : `R$ ${valorFrete.toFixed(2).replace('.', ',')}`, colDivisor + 3, y + 6); y += 9;

    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.text('VALOR PRODUTOS + FRETE', L + 2, y + 6);
    doc.text(`R$ ${totalGeral.toFixed(2).replace('.', ',')}`, colDivisor + 3, y + 6); y += 9;

    doc.rect(L, y, R - L, 10); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    doc.text('Orçamento válido por 5 úteis dias após o envio.', L + 2, y + 6); y += 10;

    doc.rect(L, y, R - L, 8); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TERMOS E CONDIÇÕES:', (L + R) / 2, y + 5.5, { align: 'center' }); y += 14;

    doc.setFontSize(8.5);
    TERMOS_PADRAO.forEach(t => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold'); const tituloW = doc.getTextWidth(t.titulo + ': ');
      doc.text(`${t.titulo}:`, L, y); doc.setFont('helvetica', 'normal');
      const linhas = doc.splitTextToSize(t.texto, (R - L) - tituloW - 2);
      doc.text(linhas[0], L + tituloW, y);
      for (let k = 1; k < linhas.length; k++) { y += 4; doc.text(linhas[k], L, y); }
      y += 6;
    });

    if (observacoes) {
      if (y > 250) { doc.addPage(); y = 20; }
      y += 4; doc.setDrawColor(150); doc.line(L, y, R, y); y += 6;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('OBSERVAÇÕES ESPECÍFICAS:', L, y); y += 5;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      const obsLines = doc.splitTextToSize(observacoes, R - L); doc.text(obsLines, L, y); y += obsLines.length * 4;
    }

    y = Math.max(y + 20, 270);
    doc.setLineWidth(0.3); doc.setDrawColor(0);
    doc.line((L + R) / 2 - 40, y - 4, (L + R) / 2 + 40, y - 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('Assinatura / Kasaleve', (L + R) / 2, y, { align: 'center' });
    doc.save(`Orcamento_${numero}.pdf`);
  };

  const exportarDOCX = async () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle, ShadingType } = await import('docx');
    const bold = (t, opts = {}) => new TextRun({ text: t, bold: true, color: opts.color, size: opts.size });
    const normal = (t, opts = {}) => new TextRun({ text: t, color: opts.color, size: opts.size });
    const p = (children, align = AlignmentType.LEFT) => new Paragraph({ children, alignment: align });
    const grayShade = { type: ShadingType.CLEAR, fill: 'E1E1E1' };
    const cellBorder = { top: { style: BorderStyle.SINGLE, size: 2, color: '999999' }, bottom: { style: BorderStyle.SINGLE, size: 2, color: '999999' }, left: { style: BorderStyle.SINGLE, size: 2, color: '999999' }, right: { style: BorderStyle.SINGLE, size: 2, color: '999999' } };
    const labelCell = (label, value, gray = true) => new TableCell({ borders: cellBorder, shading: gray ? grayShade : undefined, children: [p([bold(label + ' ', { size: 16 })]), p([normal(value || '', { size: 18 })])] });

    const itemRows = itens.map((item) => {
      const descCompleta = [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
      const unitario = getUnitario(item); const total = Number(item.qtd) * unitario;
      return new TableRow({ children: [
        new TableCell({ borders: cellBorder, children: [p([normal(item.nomeProduto || '-', { size: 16 })])] }),
        new TableCell({ borders: cellBorder, children: [p([normal(descCompleta || '-', { size: 16 })])] }),
        new TableCell({ borders: cellBorder, children: [p([normal(String(item.qtd), { size: 16 })], AlignmentType.CENTER)] }),
        new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(unitario), { size: 16 })], AlignmentType.RIGHT)] }),
        new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(total), { size: 16 })], AlignmentType.RIGHT)] }),
      ]});
    });

    const termosParagraphs = TERMOS_PADRAO.flatMap(t => [p([bold(t.titulo + ': ', { size: 17 }), normal(t.texto, { size: 17 })]), p([])]);
    const freteTexto = semFrete ? 'ISENTO (entrega local)' : fmtBRL(valorFrete);

    const doc = new Document({ sections: [{ children: [
      p([bold('kasaleve', { size: 44 })]), p([normal('projeto  •  conforto', { size: 18 })]), p([]),
      p([bold('ORÇAMENTO', { color: 'C81E1E', size: 32 })], AlignmentType.LEFT),
      p([bold(`Enviado em: ${dataEmissao}`, { size: 18 })], AlignmentType.RIGHT), p([]),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ children: [labelCell('CLIENTE:', dadosCliente.nome)] }),
        new TableRow({ children: [labelCell('ENDEREÇO:', `${dadosCliente.endereco || ''} ${dadosCliente.numero || ''}`, false)] }),
        new TableRow({ children: [labelCell('CIDADE:', `${dadosCliente.cidade || ''} ${dadosCliente.estado ? '- ' + dadosCliente.estado : ''}`), labelCell('CEP:', dadosCliente.cep)] }),
        new TableRow({ children: [labelCell('CNPJ/CPF:', dadosCliente.cpf, false), labelCell('IE/RG:', dadosCliente.ie, false)] }),
        new TableRow({ children: [labelCell('CONTATO:', dadosCliente.telefone), labelCell('VENDEDORA:', dadosCliente.vendedora)] }),
      ]}), p([]),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ children: ['ITEM','DESCRIÇÃO','QTD','VALOR UNIT.','VALOR TOTAL'].map(h => new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold(h, { color: 'FFFFFF', size: 16 })], h === 'QTD' ? AlignmentType.CENTER : h.includes('VALOR') ? AlignmentType.RIGHT : AlignmentType.LEFT)] })) }),
        ...itemRows,
      ]}), p([]),
      p([bold('TOTAL: '), normal(fmtBRL(totalProdutos))], AlignmentType.RIGHT), p([]),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([bold('TERMOS E CONDIÇÕES GERAIS')], AlignmentType.CENTER)] })] }),
        new TableRow({ children: [new TableCell({ borders: cellBorder, children: [p([bold('FRETE')])] }), new TableCell({ borders: cellBorder, children: [p([normal(freteTexto)])] })] }),
        new TableRow({ children: [new TableCell({ borders: cellBorder, children: [p([bold('VALOR PRODUTOS + FRETE')])] }), new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(totalGeral))])] })] }),
        new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([normal('Orçamento válido por 5 úteis dias após o envio.', { size: 16 })])] })] }),
        new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([bold('TERMOS E CONDIÇÕES:')], AlignmentType.CENTER)] })] }),
      ]}), p([]), ...termosParagraphs,
      ...(observacoes ? [p([]), p([bold('OBSERVAÇÕES ESPECÍFICAS:')]), p([normal(observacoes)])] : []),
      p([]), p([]), p([normal('_______________________________')], AlignmentType.CENTER), p([normal('Assinatura / Kasaleve')], AlignmentType.CENTER),
    ]}]});

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `Orcamento_${numero}.docx`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <button className="orc-back-link" onClick={onVoltar}>← Recomeçar</button>
        <header className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">kasaleve</span>
            <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
            <div className="orc-logo__underline" />
          </div>
          <div className="orc-empresa-info">
            <p>{DADOS_EMPRESA.razaoSocial}</p><p>{DADOS_EMPRESA.endereco}</p>
            <p className="orc-empresa-info__link">{DADOS_EMPRESA.site}</p><p>{DADOS_EMPRESA.telefone}</p>
          </div>
        </header>

        <div className="orc-titulo-row">
          <h1 className="orc-titulo-orcamento">ORÇAMENTO</h1>
          <div className="orc-enviado-em">Enviado em: <strong>{dataEmissao}</strong></div>
        </div>

        <section className="orc-perfil-section">
          <span className="orc-perfil-label">Tabela de preço:</span>
          <div className="orc-perfil-btns">
            {PERFIS_PRECO.map(p => (
              <button key={p.id} className={`orc-perfil-btn${perfilId === p.id ? ' orc-perfil-btn--ativo' : ''}`} onClick={() => setPerfilId(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <span className="orc-perfil-hint" style={{ color: semFrete ? '#16a34a' : '#2563eb' }}>
            {semFrete ? '✓ Entrega local — frete isento' : 'Frete calculado automaticamente'}
          </span>
        </section>

        <section className="orc-cliente-bloco">
          {clienteExistente !== null && (
            <div className="orc-select-cliente">
              <select className="orc-input" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">— Selecione um cliente para preencher —</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          )}
          <div className="orc-row orc-row--gray"><label>CLIENTE:</label><input value={dadosCliente.nome} onChange={setDado('nome')} placeholder="Nome do cliente" /></div>
          <div className="orc-row"><label>ENDEREÇO:</label><input value={dadosCliente.endereco} onChange={setDado('endereco')} placeholder="Rua, número..." /></div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--gray orc-row--half"><label>CIDADE:</label><input value={dadosCliente.cidade} onChange={setDado('cidade')} placeholder="Cidade - UF" /></div>
            <div className="orc-row orc-row--gray orc-row--half"><label>CEP:</label><input value={dadosCliente.cep} onChange={setDado('cep')} placeholder="00000-000" /></div>
          </div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--half"><label>CNPJ/CPF:</label><input value={dadosCliente.cpf} onChange={setDado('cpf')} placeholder="000.000.000-00" /></div>
            <div className="orc-row orc-row--half"><label>IE/RG:</label><input value={dadosCliente.ie} onChange={setDado('ie')} placeholder="—" /></div>
          </div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--gray orc-row--half"><label>CONTATO:</label><input value={dadosCliente.telefone} onChange={setDado('telefone')} placeholder="(11) 99999-0000" /></div>
            <div className="orc-row orc-row--gray orc-row--half"><label>VENDEDORA:</label><input value={dadosCliente.vendedora} onChange={setDado('vendedora')} placeholder="Nome da vendedora" /></div>
          </div>
        </section>

        <section className="orc-section">
          <table className="orc-table">
            <thead><tr>
              <th className="col-img center">Img</th><th className="col-item">Item</th><th className="col-desc">Descrição</th>
              <th className="col-qtd center">Qtd</th><th className="col-unit right">Unit.</th><th className="col-total right">Total</th><th className="col-del"></th>
            </tr></thead>
            <tbody>
              {itens.map((item) => {
                const unitario = getUnitario(item);
                return (
                  <tr key={item.id}>
                    <td className="center">
                      {item.image ? <img src={item.image} className="orc-table-img" alt="" /> : <span style={{ color: '#ccc', fontSize: 16 }}>—</span>}
                    </td>
                    <td>
                      {item.nomeProduto ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>{item.nomeProduto}</span>
                          <button onClick={() => abrirModalPara(item.id)} title="Alterar produto" style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}>✎</button>
                        </div>
                      ) : (
                        <button onClick={() => abrirModalPara(item.id)} style={{
                          padding: '6px 10px', border: '1px dashed #bbb', background: '#fafafa', cursor: 'pointer',
                          fontSize: 11, color: '#777', borderRadius: 4, fontFamily: "'Sora', sans-serif", transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#bbb'; e.currentTarget.style.color = '#777'; }}
                        >+ Selecionar</button>
                      )}
                    </td>
                    <td>
                      <div className="orc-desc-cell">
                        {item.nomeExtra && <span className="orc-desc-nome">{item.nomeExtra}</span>}
                        <input type="text" value={item.nomeExtra} onChange={e => updateItem(item.id, 'nomeExtra', e.target.value)} placeholder="Cores, medidas, obs..." className="orc-desc-extra" />
                      </div>
                    </td>
                    <td className="center"><input type="number" min="1" value={item.qtd} onChange={e => updateItem(item.id, 'qtd', Number(e.target.value))} /></td>
                    <td className="right orc-unit-cell">
                      {unitario > 0 ? <span className="orc-unit-valor">{fmtBRL(unitario)}</span> : '—'}
                    </td>
                    <td className="right">{unitario > 0 ? fmtBRL(item.qtd * unitario) : '—'}</td>
                    <td className="center">{itens.length > 1 && <button className="orc-btn-del" onClick={() => removeItem(item.id)}>✕</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="orc-btn-add" onClick={addItem}>+ Adicionar Item</button>
          <div className="orc-total-row">
            <span>TOTAL:</span>
            <span className="orc-total-valor">{fmtBRL(totalProdutos)}</span>
          </div>
        </section>

        <section className="orc-termos-box">
          <div className="orc-termos-box__titulo">TERMOS E CONDIÇÕES GERAIS</div>
          <div className="orc-termos-box__linha">
            <span className="orc-termos-box__label">FRETE</span>
            <span>{semFrete ? 'ISENTO (entrega local)' : fmtBRL(valorFrete)}</span>
          </div>
          <div className="orc-termos-box__linha">
            <span className="orc-termos-box__label">VALOR PRODUTOS + FRETE</span>
            <span>{fmtBRL(totalGeral)}</span>
          </div>
          <div className="orc-termos-box__validade">Orçamento válido por 5 úteis dias após o envio.</div>
          <div className="orc-termos-box__titulo">TERMOS E CONDIÇÕES:</div>
          <div className="orc-termos-box__texto">
            {TERMOS_PADRAO.map((t, i) => (<p key={i}><strong>{t.titulo}:</strong> {t.texto}</p>))}
          </div>
        </section>

        <section className="orc-section">
          <div className="orc-field">
            <label>Adicionar Observações ao Documento</label>
            <textarea className="orc-input" rows={3} placeholder="Digite aqui observações específicas para este projeto..." value={observacoes} onChange={e => setObs(e.target.value)} />
          </div>
        </section>

        <div className="orc-assinatura-box">
          <div className="orc-assinatura-line">Assinatura / Kasaleve</div>
        </div>

        <button className="orc-btn-export" onClick={handleExportar}>GERAR ARQUIVO (PDF / DOCX)</button>
      </div>

      <ModalSeletorProduto
        aberto={editandoItemId !== null}
        onFechar={() => setEditandoItemId(null)}
        onSelecionar={selecionarProdutoParaItem}
        itemInicial={itemEditando}
        listaProdutos={listaAtual}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  RAIZ
// ════════════════════════════════════════════════════════
export default function Orcamento() {
  const [etapa, setEtapa] = useState('gate');
  const [clienteInicial, setClienteInicial] = useState(null);
  const [clienteExistente, setClienteExistente] = useState(null);

  const handleSim = () => { setClienteExistente({}); setEtapa('orcamento'); };
  const handleNao = () => setEtapa('novo');
  const handleNovo = (dados) => { setClienteInicial(dados); setClienteExistente(null); setEtapa('orcamento'); };
  const handleVoltar = () => { setEtapa('gate'); setClienteInicial(null); setClienteExistente(null); };

  if (etapa === 'gate') return <EtapaClienteExiste onSim={handleSim} onNao={handleNao} />;
  if (etapa === 'novo') return <EtapaNovoCliente onContinuar={handleNovo} onVoltar={() => setEtapa('gate')} />;
  return <TelaOrcamento clienteInicial={clienteInicial} clienteExistente={clienteExistente} onVoltar={handleVoltar} />;
}