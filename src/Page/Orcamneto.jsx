import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";
import ProdutosAPILocal from '../assets/ProdutosAPILocal';
import ProdutosApiLocalLojista from '../assets/ProdutosApiLocalLojista';

import MostruarioPintura from '../assets/MostruarioPintura';
import MostruarioCordas from '../assets/MostruarioCorda';
import MostruarioTecidos from '../assets/MostruarioTecido';

const produtos = ProdutosAPILocal;
const produtosLojista = ProdutosApiLocalLojista;

const PINTURA = MostruarioPintura;
const CORDAS = MostruarioCordas;
const TECIDOS = MostruarioTecidos;

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

// Pre-compute normalized set for O(1) lookup
const CIDADES_SEM_FRETE_NORM = new Set(
  CIDADES_SEM_FRETE.map(m => m.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase())
);

function ehRegiaoSemFrete(cidade) {
  if (!cidade) return false;
  const c = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  return CIDADES_SEM_FRETE_NORM.has(c);
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
//  CARD DE PRODUTO — memoizado para evitar re-renders
// ════════════════════════════════════════════════════════
const ProdutoCard = memo(function ProdutoCard({ produto, onClick }) {
  return (
    <div
      className="modal-card"
      onClick={() => onClick(produto)}
    >
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

// ════════════════════════════════════════════════════════
//  MODAL SELETOR DE PRODUTO
// ════════════════════════════════════════════════════════
function ModalSeletorProduto({ aberto, onFechar, onSelecionar, itemInicial, listaProdutos }) {
  const [step, setStep] = useState('grid');
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [produtoSel, setProdutoSel] = useState(null);
  const [tampoSel, setTampoSel] = useState(null);
  const [medidaIdx, setMedidaIdx] = useState(0);
  const [qtd, setQtd] = useState(1);
  const [selecoesCor, setSelecoesCor] = useState({});
  const [abaCor, setAbaCor] = useState('pintura');

  // Reset state when modal opens
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
  }, [aberto]);

  const categorias = useMemo(() => {
    if (!listaProdutos) return [];
    const m = {};
    listaProdutos.forEach(p => { m[p.status] = (m[p.status] || 0) + 1; });
    return [
      { nome: 'Todos', count: listaProdutos.length },
      ...Object.entries(m).map(([n, c]) => ({ nome: n, count: c }))
    ].sort((a, b) => {
      if (a.nome === 'Todos') return -1;
      if (b.nome === 'Todos') return 1;
      return a.nome.localeCompare(b.nome);
    });
  }, [listaProdutos]);

  const produtosFiltrados = useMemo(() => {
    if (!listaProdutos) return [];
    const buscaLower = busca.toLowerCase();
    return listaProdutos.filter(p => {
      const mc = filtroCategoria === 'Todos' || p.status === filtroCategoria;
      const mb = busca === '' || p.nome.toLowerCase().includes(buscaLower) || p.descricao.toLowerCase().includes(buscaLower);
      return mc && mb;
    });
  }, [filtroCategoria, busca, listaProdutos]);

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
      if (n[item.cat]?.id === item.id) delete n[item.cat];
      else n[item.cat] = item;
      return n;
    });
  }, []);

  const eMesa = ehMesa(produtoSel?.status);
  const tamposExibidos = getTamposDoProduto(produtoSel);
  const varsFiltradas = eMesa && tampoSel
    ? (produtoSel?.variacoes || []).filter(v => v.tampo === tampoSel)
    : (produtoSel?.variacoes || []);
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
          <>
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
                            className={`modal-pill${tampoSel === t ? ' modal-pill--ativo' : ''}${!disp ? ' modal-pill--disabled' : ''}`}
                          >
                            {t}{!disp && ' ✕'}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {varsFiltradas.length > 1 && (
                  <>
                    <label className="modal-section-label">{eMesa ? 'Medida:' : 'Variação:'}</label>
                    <div className="modal-pill-row">
                      {varsFiltradas.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setMedidaIdx(i)}
                          className={`modal-pill${medidaIdx === i ? ' modal-pill--ativo' : ''}`}
                        >
                          {v.medida || `Opção ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <label className="modal-section-label">Personalização de Cores:</label>
                <div className="modal-cor-tabs">
                  {[{ id: 'pintura', label: 'Alumínio' }, { id: 'cordas', label: 'Cordas' }, { id: 'tecidos', label: 'Tecidos' }].map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAbaCor(a.id)}
                      className={`modal-cor-tab${abaCor === a.id ? ' modal-cor-tab--ativo' : ''}`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <div className="modal-cor-chips">
                  {COLOR_LISTS[abaCor].map(item => {
                    const sel = selecoesCor[item.cat]?.id === item.id;
                    return (
                      <div key={item.id} onClick={() => selecionarCor(item)} className={`modal-cor-chip${sel ? ' modal-cor-chip--sel' : ''}`}>
                        <div className={`modal-cor-swatch${sel ? ' modal-cor-swatch--sel' : ''}`} style={{ background: item.hex }}>
                          {sel && '✓'}
                        </div>
                        <span className="modal-cor-nome">{item.nome}</span>
                      </div>
                    );
                  })}
                </div>
                {Object.keys(selecoesCor).length > 0 && (
                  <div className="modal-paleta">
                    {Object.values(selecoesCor).map(s => (
                      <div key={s.id} className="modal-paleta-dot" style={{ background: s.hex }} title={s.nome} />
                    ))}
                  </div>
                )}
                <div className="modal-price-row">
                  <div>
                    <p className="modal-price-label">Preço unitário</p>
                    <p className="modal-price-value">{varAtual?.preco ? fmtBRL(varAtual.preco) : '—'}</p>
                  </div>
                  <div className="modal-qty-box">
                    <button className="modal-qty-btn" onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
                    <span className="modal-qty-val">{qtd}</span>
                    <button className="modal-qty-btn" onClick={() => setQtd(q => q + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-back" onClick={() => setStep('grid')}>← Voltar</button>
              <button
                className={`modal-btn-confirm${varAtual?.preco ? '' : ' modal-btn-confirm--disabled'}`}
                onClick={handleConfirmar}
                disabled={!varAtual?.preco}
              >
                Confirmar Seleção
              </button>
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
  const set = useCallback((field) => (e) => setForm(p => ({ ...p, [field]: e.target.value })), []);

  async function handleCEP(e) {
    const val = e.target.value;
    setForm(p => ({ ...p, cep: val }));
    setCepErro('');
    if (val.replace(/\D/g, '').length === 8) {
      setBuscandoCep(true);
      const dados = await buscarCEP(val);
      setBuscandoCep(false);
      if (dados) setForm(p => ({ ...p, ...dados }));
      else setCepErro('CEP não encontrado.');
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
        <div className="orc-form-footer">
          <button className="orc-gate__btn orc-gate__btn--sim" onClick={() => onContinuar(form)}>Continuar para o orçamento →</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  LINHA DA TABELA — memoizada
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
//  LINHA DA TABELA — memoizada
// ════════════════════════════════════════════════════════
const ItemRow = memo(function ItemRow({ item, unitario, onAbrirModal, onUpdateItem, onRemoveItem, isLast }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateItem(item.id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          // ── Produto já preenchido: campo editável + botão pra trocar do catálogo ──
          <div className="orc-item-cell">
            <input
              type="text"
              value={item.nomeProduto}
              onChange={e => onUpdateItem(item.id, 'nomeProduto', e.target.value)}
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
          // ── Vazio: botão de destaque pro catálogo + opção de digitar manualmente ──
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
              onChange={e => onUpdateItem(item.id, 'nomeProduto', e.target.value)}
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
            onChange={e => onUpdateItem(item.id, 'nomeExtra', e.target.value)}
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
          onChange={e => onUpdateItem(item.id, 'qtd', Number(e.target.value))}
        />
      </td>
      <td className="right orc-unit-cell">
        <input
          type="number"
          step="0.01"
          min="0"
          value={unitario || 0}
          onChange={e => onUpdateItem(item.id, 'unitarioPadrao', Number(e.target.value))}
          style={{ textAlign: 'right', width: '100%', border: '1px solid #eee', borderRadius: '4px', padding: '4px' }}
        />
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
// ════════════════════════════════════════════════════════
//  TELA PRINCIPAL — Orçamento
// ════════════════════════════════════════════════════════
function TelaOrcamento({ clienteInicial, clienteExistente, onVoltar }) {
  const [numero] = useState(gerarNumero);
  const [dataEmissao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [observacoes, setObs] = useState('');
  const [descontoPerc, setDescontoPerc] = useState(0);
  const [perfilId, setPerfilId] = useState('padrao');
  const [clientes] = useState(API_CLIENTES);
  const [clienteId, setClienteId] = useState(clienteExistente ? String(clienteExistente.id) : '');
  const [dadosCliente, setDadosCliente] = useState(clienteInicial || CLIENTE_VAZIO);
  const [itens, setItens] = useState(() => [ITEM_VAZIO()]);
  const [editandoItemId, setEditandoItemId] = useState(null);

  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  // Limpa itens ao trocar de tabela de preço (preços diferentes)
  useEffect(() => { setItens([ITEM_VAZIO()]); }, [perfilId]);

  const setDado = useCallback((field) => (e) => setDadosCliente(p => ({ ...p, [field]: e.target.value })), []);
  const addItem = useCallback(() => setItens(p => [...p, ITEM_VAZIO()]), []);
  const removeItem = useCallback((id) => setItens(p => p.filter(i => i.id !== id)), []);
  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => item.id !== id ? item : { ...item, [field]: value }));
  }, []);
  const selecionarProdutoParaItem = useCallback((dados) => {
    if (!editandoItemId) return;
    setItens(prev => prev.map(item => item.id !== editandoItemId ? item : { ...item, ...dados }));
    setEditandoItemId(null);
  }, [editandoItemId]);

  const abrirModalPara = useCallback((id) => setEditandoItemId(id), []);

  // Lista de produtos conforme perfil selecionado
  const listaAtual = perfilId === 'lojista' ? produtosLojista : produtos;

  // Preço direto da lista (sem desconto, cada lista já tem seu preço)
  const getUnitario = useCallback((item) => item.unitarioPadrao, []);

  const { totalProdutos, semFrete, valorFrete, valorDesconto, subtotalComDesconto, totalGeral } = useMemo(() => {
    const total = itens.reduce((acc, i) => acc + Number(i.qtd) * i.unitarioPadrao, 0);
    const sf = ehRegiaoSemFrete(dadosCliente.cidade);
    const frete = sf ? 0 : total * FRETE_PERCENT;
    const desc = (descontoPerc > 0 && descontoPerc <= 100) ? total * (descontoPerc / 100) : 0;
    const subtotal = total - desc;
    return { totalProdutos: total, semFrete: sf, valorFrete: frete, valorDesconto: desc, subtotalComDesconto: subtotal, totalGeral: subtotal + frete };
  }, [itens, dadosCliente.cidade, descontoPerc]);

  const perfilAtual = PERFIS_PRECO.find(p => p.id === perfilId) || PERFIS_PRECO[0];
  const itemEditando = useMemo(
    () => editandoItemId ? itens.find(i => i.id === editandoItemId) : null,
    [editandoItemId, itens]
  );

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

    // ── Colunas com mais espaço, evitando overflow ──
const c1 = L, c2 = c1 + 18, c6 = R, c5 = c6 - 25, c4 = c5 - 25, c3 = c4 - 18;
const headerH = 10;
doc.setFillColor(60, 60, 60); doc.rect(c1, y, c6 - c1, headerH, 'F');
doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
doc.text('ITEM', c1 + 2, y + 6.5); doc.text('DESCRIÇÃO', c2 + 2, y + 6.5);
doc.text('QTD', c3 + 2, y + 6.5); doc.text('VALOR UNIT.', c4 + 2, y + 6.5);
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

  // Altura da linha: maior valor entre imagem, texto da descrição e um mínimo confortável
  const imgSize = 17;
  const alturaTexto = descLines.length * 4 + 10; // padding de cima e baixo garantido
  const alturaImagem = imgSize + 6;
  const rowHgt = Math.max(14, alturaTexto, alturaImagem);

  if (item.image) {
    try {
      let imgData = item.image;
      if (!imgData.startsWith('data:')) {
        imgData = await getBase64ImageFromUrl(item.image);
      }
      if (imgData) {
        const format = imgData.includes('png') ? 'PNG' : 'JPEG';
        const imgY = y + (rowHgt - imgSize) / 2;
        doc.addImage(imgData, format, c1 + 1.5, imgY, imgSize, imgSize);
      }
    } catch (err) { console.error("Erro ao adicionar imagem ao PDF:", err); }
  }

  doc.setFontSize(9);
  // Descrição alinhada ao topo com padding
  doc.text(descLines, c2 + 2, y + 6);

  // Valores centralizados verticalmente na linha
  const centerY = y + rowHgt / 2 + 1.5;
  doc.text(String(item.qtd), c3 + 2, centerY);
  doc.text(fmtBRL(unitario), c4 + 2, centerY);
  doc.text(fmtBRL(totalItem), c6 - 2, centerY, { align: 'right' });

  lineCols(y, rowHgt); y += rowHgt;
  if (y > 260) { doc.addPage(); y = 20; }
}

    y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('TOTAL:', c4, y + 6);
    doc.setFillColor(225, 225, 225); doc.rect(c6 - 55, y, 55, 9, 'F');
    doc.setDrawColor(150); doc.rect(c6 - 55, y, 55, 9);
    doc.text(fmtBRL(subtotalComDesconto), c6 - 52, y + 6); y += 18;

    const colDivisor = L + 55;
    doc.setDrawColor(0); doc.setLineWidth(0.3); doc.rect(L, y, R - L, 8);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TERMOS E CONDIÇÕES GERAIS', (L + R) / 2, y + 5.5, { align: 'center' }); y += 8;

    // Desconto (aparece na caixa de termos, antes do frete, se houver)
    if (descontoPerc > 0) {
      doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(200, 30, 30);
      doc.text(`DESCONTO (${descontoPerc}%)`, L + 2, y + 6);
      doc.text(`- ${fmtBRL(valorDesconto)}`, colDivisor + 3, y + 6);
      doc.setTextColor(0, 0, 0); y += 9;
    }

    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('FRETE', L + 2, y + 6);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);

    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('FRETE', L + 2, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(semFrete ? 'ISENTO (entrega local)' : fmtBRL(valorFrete), colDivisor + 3, y + 6); y += 9;

    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.text('VALOR PRODUTOS + FRETE', L + 2, y + 6);
    doc.text(fmtBRL(totalGeral), colDivisor + 3, y + 6); y += 9;

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
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle, ShadingType, ImageRun } = await import('docx');

    // ── Cores ──
    const RED = 'C81E1E';
    const DARK = '3C3C3C';
    const BLUE = '2563EB';
    const GRAY_BG = 'E1E1E1';
    const TEXT = '1A1A1A';
    const MUTED = '555555';
    const WHITE = 'FFFFFF';

    // ── Helpers texto ──
    const bold = (t, o = {}) => new TextRun({ text: t, bold: true, color: o.color || TEXT, size: o.size || 20, font: 'Arial' });
    const normal = (t, o = {}) => new TextRun({ text: t, color: o.color || TEXT, size: o.size || 20, font: 'Arial' });
    const italic = (t, o = {}) => new TextRun({ text: t, italics: true, color: o.color || MUTED, size: o.size || 20, font: 'Arial' });
    const p = (children, align = AlignmentType.LEFT, sp = {}) => new Paragraph({ children, alignment: align, spacing: { before: sp.before || 0, after: sp.after || 0, line: 240 } });

    // ── Bordas ──
    const bThin = { top: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' } };
    const bDark = { top: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 2, color: '000000' } };
    const bNone = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
    const bThickRight = { ...bThin, right: { style: BorderStyle.SINGLE, size: 8, color: '999999' } };

    // ── Shading ──
    const sGray = { type: ShadingType.CLEAR, fill: GRAY_BG };
    const sDark = { type: ShadingType.CLEAR, fill: DARK };
    const sWhite = { type: ShadingType.CLEAR, fill: WHITE };

    // ── Extrair base64 puro de data URL ──
    const extractBase64 = (dataUrl) => {
      if (!dataUrl) return null;
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const mimeMatch = parts[0].match(/data:image\/(\w+);/);
      const type = mimeMatch ? mimeMatch[1] : 'png';
      return { data: parts[1], type };
    };

    // ── Células cliente ──
    const cFull = (label, val, gray = true) => new TableCell({
      borders: bThin, columnSpan: 2, shading: gray ? sGray : sWhite,
      children: [p([bold(label + ' ', { size: 16 }), normal(val || '', { size: 18 })])]
    });
    const cHalf = (label, val, gray = true) => new TableCell({
      borders: bThin, shading: gray ? sGray : sWhite, width: { size: 50, type: WidthType.PERCENTAGE },
      children: [p([bold(label + ' ', { size: 16 }), normal(val || '', { size: 18 })])]
    });
    const row2 = (l1, v1, l2, v2, g = true) => new TableRow({ children: [cHalf(l1, v1, g), cHalf(l2, v2, g)] });

    // ── Células header itens ──
    const hCell = (txt, align = AlignmentType.LEFT, w) => {
      const o = { borders: bThin, shading: sDark, verticalAlign: 'center', children: [p([bold(txt, { color: WHITE, size: 16 })], align)] };
      if (w) o.width = { size: w, type: WidthType.PERCENTAGE };
      return new TableCell(o);
    };

    // ── Células dados itens ──
    const dCell = (children, align = AlignmentType.LEFT, w, thickRight = false) => {
      const o = { borders: thickRight ? bThickRight : bThin, verticalAlign: 'center', children };
      if (w) o.width = { size: w, type: WidthType.PERCENTAGE };
      return new TableCell(o);
    };

    // ── Montar linhas de itens COM IMAGENS ──
    const itemRows = [];
    for (const item of itens) {
      const desc = [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
      const u = getUnitario(item);
      const tot = Number(item.qtd) * u;

      // Tentar carregar imagem do produto
      let imgParagraph = p([normal('—', { size: 14, color: 'CCCCCC' })], AlignmentType.CENTER);
      if (item.image) {
        try {
          const b64 = await getBase64ImageFromUrl(item.image);
          const extracted = extractBase64(b64);
          if (extracted) {
            const imgType = (extracted.type === 'jpg' || extracted.type === 'jpeg') ? 'jpg' : 'png';
            imgParagraph = p([new ImageRun({
              data: extracted.data,
              transformation: { width: 28, height: 28 },
              type: imgType
            })], AlignmentType.CENTER);
          }
        } catch (e) { /* fallback para traço */ }
      }

      itemRows.push(new TableRow({
        children: [
          dCell([imgParagraph], AlignmentType.CENTER, 8),
          dCell([p([normal(item.nomeProduto || '—', { size: 16 })])], AlignmentType.LEFT, 17),
          dCell([p([normal(desc || '—', { size: 16 })])], AlignmentType.LEFT, 40),
          dCell([p([normal(String(item.qtd), { size: 16 })])], AlignmentType.CENTER, 10),
          dCell([p([normal(fmtBRL(u), { size: 16 })])], AlignmentType.RIGHT, 12, true),
          dCell([p([normal(fmtBRL(tot), { size: 16 })])], AlignmentType.RIGHT, 13),
        ]
      }));
    }

    // ── Células termos ──
    const tTitle = (txt) => new TableCell({
      borders: bDark, columnSpan: 2, shading: sWhite,
      children: [p([bold(txt, { size: 20 })], AlignmentType.CENTER)]
    });
    const tLabel = (txt) => new TableCell({
      borders: bDark, width: { size: 35, type: WidthType.PERCENTAGE }, shading: sGray,
      children: [p([bold(txt, { size: 18 })])]
    });
    const tValue = (txt) => new TableCell({
      borders: bDark, width: { size: 65, type: WidthType.PERCENTAGE },
      children: [p([normal(txt, { size: 18 })])]
    });

    // ── Parágrafos de termos ──
    const termosP = TERMOS_PADRAO.flatMap(t => [
      p([bold(t.titulo + ': ', { size: 17 }), normal(t.texto, { size: 17, color: '333333' })], AlignmentType.JUSTIFIED, { before: 40, after: 60 })
    ]);

    const freteTexto = semFrete ? 'ISENTO (entrega local)' : fmtBRL(valorFrete);

    // ══════════════════════════════════════════
    //  MONTAR DOCUMENTO
    // ══════════════════════════════════════════
    const doc = new Document({
      sections: [{
        properties: {
          page: { margin: { top: 600, right: 600, bottom: 500, left: 600 } }
        },
        children: [
          // ── CABEÇALHO: Logo esquerda + Empresa direita ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: bNone, width: { size: 50, type: WidthType.PERCENTAGE }, children: [
                    p([bold('kasaleve', { size: 48, color: '2A2A2A' })], AlignmentType.LEFT, { after: 0 }),
                    p([normal('projeto  •  conforto', { size: 18, color: MUTED })], AlignmentType.LEFT, { after: 0 }),
                  ]
                }),
                new TableCell({
                  borders: bNone, width: { size: 50, type: WidthType.PERCENTAGE }, verticalAlign: 'top', children: [
                    p([bold(DADOS_EMPRESA.razaoSocial, { size: 14 })], AlignmentType.RIGHT, { after: 0 }),
                    p([normal(DADOS_EMPRESA.endereco, { size: 14, color: MUTED })], AlignmentType.RIGHT, { after: 0 }),
                    p([normal(DADOS_EMPRESA.site, { size: 14, color: BLUE })], AlignmentType.RIGHT, { after: 0 }),
                    p([normal(DADOS_EMPRESA.telefone, { size: 14, color: MUTED })], AlignmentType.RIGHT, { after: 0 }),
                  ]
                }),
              ]
            })]
          }),
          p([]),

          // ── TÍTULO ORÇAMENTO + Data ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: bNone, width: { size: 50, type: WidthType.PERCENTAGE }, children: [
                    p([bold('ORÇAMENTO', { size: 38, color: RED })], AlignmentType.LEFT),
                  ]
                }),
                new TableCell({
                  borders: bNone, width: { size: 50, type: WidthType.PERCENTAGE }, children: [
                    p([bold('Enviado em: ', { size: 18 }), bold(dataEmissao, { size: 18 })], AlignmentType.RIGHT),
                  ]
                }),
              ]
            })]
          }),
          p([]),

          // ── DADOS DO CLIENTE ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [cFull('CLIENTE:', dadosCliente.nome, true)] }),
              new TableRow({ children: [cFull('ENDEREÇO:', `${dadosCliente.endereco || ''} ${dadosCliente.numero || ''}`, false)] }),
              row2('CIDADE:', `${dadosCliente.cidade || ''} ${dadosCliente.estado ? '- ' + dadosCliente.estado : ''}`, 'CEP:', dadosCliente.cep, true),
              row2('CNPJ/CPF:', dadosCliente.cpf, 'IE/RG:', dadosCliente.ie, false),
              row2('CONTATO:', dadosCliente.telefone, 'VENDEDORA:', dadosCliente.vendedora, true),
            ]
          }),
          p([]),

          // ── TABELA DE ITENS COM IMAGENS ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  hCell('Img', AlignmentType.CENTER, 8),
                  hCell('ITEM', AlignmentType.LEFT, 17),
                  hCell('DESCRIÇÃO', AlignmentType.LEFT, 40),
                  hCell('QTD', AlignmentType.CENTER, 10),
                  hCell('VALOR UNIT.', AlignmentType.RIGHT, 12),
                  hCell('VALOR TOTAL', AlignmentType.RIGHT, 13),
                ]
              }),
              ...itemRows,
            ]
          }),
          p([]),



          // ── DESCONTO (só aparece se > 0) ──
          ...(descontoPerc > 0 ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [new TableRow({
                children: [
                  new TableCell({
                    borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [
                      p([bold(`DESCONTO (${descontoPerc}%):`, { size: 20, color: RED })], AlignmentType.RIGHT, { before: 40 })
                    ]
                  }),
                  new TableCell({
                    borders: bThin, shading: sGray, width: { size: 35, type: WidthType.PERCENTAGE }, children: [
                      p([bold(`- ${fmtBRL(valorDesconto)}`, { size: 20, color: RED })], AlignmentType.RIGHT, { before: 40 })
                    ]
                  }),
                ]
              })]
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [new TableRow({
                children: [
                  new TableCell({
                    borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [
                      p([bold('SUBTOTAL:', { size: 22 })], AlignmentType.RIGHT, { before: 40 })
                    ]
                  }),
                  new TableCell({
                    borders: bThin, shading: sGray, width: { size: 35, type: WidthType.PERCENTAGE }, children: [
                      p([bold(fmtBRL(subtotalComDesconto), { size: 22 })], AlignmentType.RIGHT, { before: 40 })
                    ]
                  }),
                ]
              })]
            }),
          ] : []),
          p([]),

          // ── TOTAL (Já com desconto aplicado) ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [
                    p([bold('TOTAL:', { size: 22 })], AlignmentType.RIGHT, { before: 40 })
                  ]
                }),
                new TableCell({
                  borders: bThin, shading: sGray, width: { size: 35, type: WidthType.PERCENTAGE }, children: [
                    p([bold(fmtBRL(subtotalComDesconto), { size: 22 })], AlignmentType.RIGHT, { before: 40 })
                  ]
                }),
              ]
            })]
          }),
          p([]),

          // ── TERMOS E CONDIÇÕES GERAIS ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [tTitle('TERMOS E CONDIÇÕES GERAIS')] }),
              // Desconto integrado na tabela de termos
              ...(descontoPerc > 0 ? [new TableRow({
                children: [
                  new TableCell({ borders: bDark, width: { size: 35, type: WidthType.PERCENTAGE }, shading: sGray, children: [p([bold(`DESCONTO (${descontoPerc}%)`, { size: 18, color: RED })])] }),
                  new TableCell({ borders: bDark, width: { size: 65, type: WidthType.PERCENTAGE }, children: [p([normal(`- ${fmtBRL(valorDesconto)}`, { size: 18, color: RED })])] })
                ]
              })] : []),
              new TableRow({ children: [tLabel('FRETE'), tValue(freteTexto)] }),
              new TableRow({ children: [tLabel('VALOR PRODUTOS + FRETE'), tValue(fmtBRL(totalGeral))] }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: bDark, columnSpan: 2, children: [
                      p([italic('Orçamento válido por 5 úteis dias após o envio.', { size: 16 })])
                    ]
                  })
                ]
              }),
              new TableRow({ children: [tTitle('TERMOS E CONDIÇÕES:')] }),
            ]
          }),
          p([]),

          // ── TEXTO DOS TERMOS ──
          ...termosP,
          p([]),

          // ── OBSERVAÇÕES ──
          ...(observacoes ? [
            p([bold('OBSERVAÇÕES ESPECÍFICAS:', { size: 18 })], AlignmentType.LEFT, { before: 80, after: 30 }),
            p([normal(observacoes, { size: 18 })], AlignmentType.JUSTIFIED),
          ] : []),

          // ── ASSINATURA ──
          p([]),
          p([]),
          p([normal('_______________________________', { size: 20, color: '000000' })], AlignmentType.CENTER, { before: 400 }),
          p([normal('Assinatura / Kasaleve', { size: 18, color: MUTED })], AlignmentType.CENTER),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orcamento_${numero}.docx`;
    a.click();
    URL.revokeObjectURL(url);
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
              <button
                key={p.id}
                className={`orc-perfil-btn${perfilId === p.id ? ' orc-perfil-btn--ativo' : ''}`}
                onClick={() => setPerfilId(p.id)}
              >
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
              <th className="col-img center">Img</th>
              <th className="col-item">Item</th>
              <th className="col-desc">Descrição</th>
              <th className="col-qtd center">Qtd</th>
              <th className="col-unit right">Unit.</th>
              <th className="col-total right">Total</th>
              <th className="col-del"></th>
            </tr></thead>
            <tbody>
              {itens.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  unitario={item.unitarioPadrao}
                  onAbrirModal={abrirModalPara}
                  onUpdateItem={updateItem}
                  onRemoveItem={removeItem}
                  isLast={itens.length <= 1}
                />
              ))}
            </tbody>
          </table>
          <button className="orc-btn-add" onClick={addItem}>+ Adicionar Item</button>
          <div className="orc-total-row">
            <span>TOTAL:</span>
            <span className="orc-total-valor">{fmtBRL(subtotalComDesconto)}</span>
          </div>

          <div className="orc-desconto-box">
            <label>Desconto:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={descontoPerc || ''}
              onChange={e => setDescontoPerc(Math.min(100, Math.max(0, Number(e.target.value))))}
              placeholder="0"
            />
            <span className="pct">%</span>
            {descontoPerc > 0 && <span className="val">− {fmtBRL(valorDesconto)}</span>}
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
            <textarea
              className="orc-input"
              rows={3}
              placeholder="Digite aqui observações específicas para este projeto..."
              value={observacoes}
              onChange={e => setObs(e.target.value)}
            />
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

  const handleSim = useCallback(() => { setClienteExistente({}); setEtapa('orcamento'); }, []);
  const handleNao = useCallback(() => setEtapa('novo'), []);
  const handleNovo = useCallback((dados) => { setClienteInicial(dados); setClienteExistente(null); setEtapa('orcamento'); }, []);
  const handleVoltar = useCallback(() => { setEtapa('gate'); setClienteInicial(null); setClienteExistente(null); }, []);

  if (etapa === 'gate') return <EtapaClienteExiste onSim={handleSim} onNao={handleNao} />;
  if (etapa === 'novo') return <EtapaNovoCliente onContinuar={handleNovo} onVoltar={() => setEtapa('gate')} />;
  return <TelaOrcamento clienteInicial={clienteInicial} clienteExistente={clienteExistente} onVoltar={handleVoltar} />;
}