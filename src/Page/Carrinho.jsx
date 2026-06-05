import "../css/carrinho.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── DADOS DE CORES (mesmos do Mostrador) ──────────────────────────────────────

const CORDAS = [
  { id:'c1',  nome:'Verde Musgo',   codigo:'#70292', hex:'#4a5e3a', cat:'corda' },
  { id:'c2',  nome:'Azul Marinho',  codigo:'#70581', hex:'#1e2f5a', cat:'corda' },
  { id:'c3',  nome:'Mescla Areia',  codigo:'#84202', hex:'#c8b89a', cat:'corda' },
  { id:'c4',  nome:'Cinza',         codigo:'#70276', hex:'#7a8190', cat:'corda' },
  { id:'c5',  nome:'Atenas',        codigo:'#93278', hex:'#d4a017', cat:'corda' },
  { id:'c6',  nome:'Ocre',          codigo:'#82354', hex:'#c85820', cat:'corda' },
  { id:'c7',  nome:'Preto',         codigo:'#70268', hex:'#1a1a1a', cat:'corda' },
  { id:'c8',  nome:'Mescla Marrom', codigo:'#76554', hex:'#9e7c5e', cat:'corda' },
  { id:'c9',  nome:'Mescla Duna',   codigo:'#95562', hex:'#c4b49a', cat:'corda' },
  { id:'c10', nome:'Vinho',         codigo:'#70300', hex:'#8b2e3e', cat:'corda' },
  { id:'c11', nome:'Dark Brown',    codigo:'#8804-7',hex:'#3d1f0d', cat:'corda' },
  { id:'c12', nome:'Verde Olivia',  codigo:'#83782', hex:'#6b7c52', cat:'corda' },
];

const TECIDOS = [
  { id:'t1',  nome:'Linho Natural',     fabricante:'Karsten — Aquablock', hex:'#c4b89a', cat:'tecido' },
  { id:'t2',  nome:'Cinza Chumbo',      fabricante:'Karsten — Aquablock', hex:'#7a8190', cat:'tecido' },
  { id:'t3',  nome:'Marrom Terroso',    fabricante:'Karsten — Aquablock', hex:'#8c6b4a', cat:'tecido' },
  { id:'t4',  nome:'Verde Floresta',    fabricante:'Karsten — Aquablock', hex:'#3a5c30', cat:'tecido' },
  { id:'t5',  nome:'Cinza Mesclado',    fabricante:'Karsten — Aquablock', hex:'#929292', cat:'tecido' },
  { id:'t6',  nome:'Azul Naval',        fabricante:'Karsten — Aquablock', hex:'#1e2f5a', cat:'tecido' },
  { id:'t7',  nome:'Branco Gelo',       fabricante:'Karsten — Aquablock', hex:'#e8e4dc', cat:'tecido' },
  { id:'t8',  nome:'Cinza Prata',       fabricante:'Karsten — Aquablock', hex:'#b0b4b8', cat:'tecido' },
  { id:'t9',  nome:'Areia Quente',      fabricante:'Fiama — Aquatec',     hex:'#c8a87a', cat:'tecido' },
  { id:'t10', nome:'Verde Oliva',       fabricante:'Fiama — Aquatec',     hex:'#6b7c52', cat:'tecido' },
  { id:'t11', nome:'Marrom Escuro',     fabricante:'Fiama — Aquatec',     hex:'#3d2010', cat:'tecido' },
  { id:'t12', nome:'Cinza Médio',       fabricante:'Fiama — Aquatec',     hex:'#909090', cat:'tecido' },
  { id:'t13', nome:'Bege Neutro',       fabricante:'Fiama — Aquatec',     hex:'#d4c4a8', cat:'tecido' },
  { id:'t14', nome:'Café',              fabricante:'Fiama — Aquatec',     hex:'#7c5038', cat:'tecido' },
  { id:'t15', nome:'Cinza Azulado',     fabricante:'Fiama — Aquatec',     hex:'#6a7a8c', cat:'tecido' },
  { id:'t16', nome:'Verde Musgo Claro', fabricante:'Fiama — Aquatec',     hex:'#88a060', cat:'tecido' },
];

const COURINOS = [
  { id:'co1', nome:'Couro Grafite',    fabricante:'York', hex:'#2a2a2a', cat:'courino' },
  { id:'co2', nome:'Couro Cobre',      fabricante:'York', hex:'#7a3010', cat:'courino' },
  { id:'co3', nome:'Couro Marrom',     fabricante:'York', hex:'#4a2010', cat:'courino' },
  { id:'co4', nome:'Couro Bege Claro', fabricante:'York', hex:'#c8b090', cat:'courino' },
];

const PINTURA = [
  { id:'p1', nome:'Fendi',        hex:'#8a7a58', cat:'pintura' },
  { id:'p2', nome:'Marrom',       hex:'#6a3820', cat:'pintura' },
  { id:'p3', nome:'Verde Olivia', hex:'#6b7c52', cat:'pintura' },
  { id:'p4', nome:'Verde Musgo',  hex:'#3a5c30', cat:'pintura' },
  { id:'p5', nome:'Off White',    hex:'#e8e4d8', cat:'pintura' },
  { id:'p6', nome:'Cinza',        hex:'#7a8190', cat:'pintura' },
  { id:'p7', nome:'Preto',        hex:'#1a1a1a', cat:'pintura' },
  { id:'p8', nome:'Bege',         hex:'#c8b890', cat:'pintura' },
  { id:'p9', nome:'Terra Cota',   hex:'#c05030', cat:'pintura' },
];

// ─── PRODUTOS ─────────────────────────────────────────────────────────────────

const produtos = [
  { id:1, nome:'Cadeira Náutica Premium', descricao:'Design moderno com acabamento em alumínio e corda náutica.', preco:890.00,  img:'https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png' },
  { id:2, nome:'Poltrona Outdoor',        descricao:'Conforto e durabilidade para ambientes externos.',            preco:1200.00, img:'https://assets.betalabs.net/production/flexform/item-images/0894f1dc61428b63aedb64174a7abf93.png' },
  { id:3, nome:'Chaise Lounge',           descricao:'Ideal para áreas de lazer e piscinas.',                      preco:1550.00, img:'https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png' },
  { id:4, nome:'Cadeira Bistro',          descricao:'Leve e elegante, perfeita para varandas.',                   preco:650.00,  img:'https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png' },
  { id:5, nome:'Mesa de Centro',          descricao:'Acabamento fino em alumínio escovado.',                      preco:980.00,  img:'https://assets.betalabs.net/production/flexform/item-images/42935cae51c7b264fa8e85d5b5667838.png' },
  { id:6, nome:'Espreguiçadeira',         descricao:'Reclinável com tecido resistente à UV.',                     preco:1390.00, img:'https://assets.betalabs.net/production/flexform/item-images/d7865373a4d304c30b39f1f279353165.png' },
];

const formatPrice = (v) => v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

// ─── MODAL DE PERSONALIZAÇÃO ──────────────────────────────────────────────────

function ModalPersonalizacao({ aberto, onFechar, onConfirmar, selecoes, setSelecoes }) {
  const [aba, setAba] = useState('pintura');
  const [busca, setBusca] = useState('');

  if (!aberto) return null;

  function selecionar(item) {
    setSelecoes(prev => {
      const novo = { ...prev };
      if (novo[item.cat]?.id === item.id) {
        delete novo[item.cat];
      } else {
        novo[item.cat] = item;
      }
      return novo;
    });
  }

  function filtrar(lista) {
    if (!busca.trim()) return lista;
    return lista.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase()));
  }

  const temSelecao = Object.keys(selecoes).length > 0;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-drawer" onClick={e => e.stopPropagation()}>

        {/* Cabeçalho do modal */}
        <div className="modal-header">
          <div className="modal-header__info">
            <p className="modal-eyebrow">Kasaleve — Paleta de Cores</p>
            <h2 className="modal-title">Personalizar produto</h2>
          </div>
          <div className="modal-header__right">
            <div className="modal-search">
              <span>🔍</span>
              <input
                placeholder="Buscar cor..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <button className="modal-close" onClick={onFechar}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {[
            { id:'pintura', label:'Alumínio',  count: PINTURA.length },
            { id:'cordas',  label:'Cordas',    count: CORDAS.length },
            { id:'tecidos', label:'Tecidos',   count: TECIDOS.length + COURINOS.length },
          ].map(a => (
            <button
              key={a.id}
              className={`modal-tab ${aba === a.id ? 'modal-tab--active' : ''}`}
              onClick={() => setAba(a.id)}
            >
              {a.label}
              <span className="modal-tab__count">{a.count}</span>
            </button>
          ))}
        </div>

        {/* Corpo do modal com grid de cores */}
        <div className="modal-body">

          {/* ABA PINTURA */}
          {aba === 'pintura' && (
            <div className="modal-aba">
              <p className="modal-aba__desc">Escolha a cor da estrutura em alumínio com pintura eletrostática</p>
              <div className="modal-grid-pintura">
                {filtrar(PINTURA).map(item => {
                  const sel = selecoes.pintura?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`modal-chip-pintura ${sel ? 'modal-chip--sel' : ''}`}
                      onClick={() => selecionar(item)}
                    >
                      <div className="modal-chip-pintura__placa" style={{ background: item.hex }}>
                        {sel && <span className="modal-chip__check">✓</span>}
                      </div>
                      <p className="modal-chip__nome">{item.nome}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA CORDAS */}
          {aba === 'cordas' && (
            <div className="modal-aba">
              <p className="modal-aba__desc">Escolha a cor da corda náutica do assento e encosto</p>
              <div className="modal-grid-cordas">
                {filtrar(CORDAS).map(item => {
                  const sel = selecoes.corda?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`modal-chip-corda ${sel ? 'modal-chip--sel' : ''}`}
                      onClick={() => selecionar(item)}
                    >
                      <div className="modal-chip-corda__swatch" style={{ background: item.hex }}>
                        {sel && <span className="modal-chip__check">✓</span>}
                      </div>
                      <div className="modal-chip-corda__info">
                        <p className="modal-chip__nome">{item.nome}</p>
                        <p className="modal-chip__cod">{item.codigo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA TECIDOS */}
          {aba === 'tecidos' && (
            <div className="modal-aba">
              <p className="modal-aba__desc">Escolha o tecido para assentos e almofadas</p>

              <p className="modal-fab-label">Karsten — Aquablock &amp; Fiama — Aquatec</p>
              <div className="modal-grid-tecidos">
                {filtrar(TECIDOS).map(item => {
                  const sel = selecoes.tecido?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`modal-chip-tecido ${sel ? 'modal-chip--sel' : ''}`}
                      onClick={() => selecionar(item)}
                    >
                      <div
                        className="modal-chip-tecido__faixa"
                        style={{ background: `linear-gradient(135deg, ${item.hex}dd, ${item.hex}, ${item.hex}aa)` }}
                      >
                        {sel && <span className="modal-chip__check">✓</span>}
                      </div>
                      <div className="modal-chip-tecido__info">
                        <p className="modal-chip__nome">{item.nome}</p>
                        <p className="modal-chip__fab">{item.fabricante}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="modal-fab-label" style={{ marginTop: '20px' }}>York — Courino</p>
              <div className="modal-grid-courinos">
                {filtrar(COURINOS).map(item => {
                  const sel = selecoes.courino?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`modal-chip-courino ${sel ? 'modal-chip--sel' : ''}`}
                      onClick={() => selecionar(item)}
                    >
                      <div
                        className="modal-chip-courino__faixa"
                        style={{ background: `linear-gradient(160deg, ${item.hex}cc, ${item.hex}, ${item.hex}88)` }}
                      >
                        {sel && <span className="modal-chip__check">✓</span>}
                      </div>
                      <p className="modal-chip__nome" style={{ padding: '6px 8px 8px' }}>{item.nome}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do modal */}
        <div className="modal-footer">
          <button
            className="modal-btn-limpar"
            onClick={() => setSelecoes({})}
            disabled={!temSelecao}
          >
            Limpar seleção
          </button>
          <button
            className="modal-btn-confirmar"
            onClick={onConfirmar}
          >
            {temSelecao
              ? `Confirmar ${Object.keys(selecoes).length} ${Object.keys(selecoes).length === 1 ? 'cor' : 'cores'}`
              : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PREVIEW DA COMBINAÇÃO ────────────────────────────────────────────────────

function PreviewCombinacao({ selecoes, onEditar }) {
  const temSelecao = Object.keys(selecoes).length > 0;

  return (
    <div className="preview-box">
      <div className="preview-box__header">
        <p className="preview-box__title">Personalização</p>
        {temSelecao && (
          <button className="preview-box__edit" onClick={onEditar}>
            ✏️ Editar
          </button>
        )}
      </div>

      {!temSelecao ? (
        <div className="preview-vazio">
          <div className="preview-vazio__icon">🎨</div>
          <p>Nenhuma cor selecionada ainda</p>
        </div>
      ) : (
        <>
          {/* Barras de preview */}
          <div className="preview-barras">
            {selecoes.pintura && (
              <div className="preview-barra" style={{ background: selecoes.pintura.hex }}>
                <span className="preview-barra__label">Alumínio</span>
                <span className="preview-barra__nome">{selecoes.pintura.nome}</span>
              </div>
            )}
            {selecoes.corda && (
              <div className="preview-barra" style={{ background: selecoes.corda.hex }}>
                <span className="preview-barra__label">Corda</span>
                <span className="preview-barra__nome">{selecoes.corda.nome}</span>
              </div>
            )}
            {selecoes.tecido && (
              <div className="preview-barra" style={{ background: selecoes.tecido.hex }}>
                <span className="preview-barra__label">Tecido</span>
                <span className="preview-barra__nome">{selecoes.tecido.nome}</span>
              </div>
            )}
            {selecoes.courino && (
              <div className="preview-barra" style={{ background: selecoes.courino.hex }}>
                <span className="preview-barra__label">Courino</span>
                <span className="preview-barra__nome">{selecoes.courino.nome}</span>
              </div>
            )}
          </div>

          {/* Paleta compacta (bolinhas) */}
          <div className="preview-paleta">
            {Object.values(selecoes).map(s => (
              <div
                key={s.id}
                className="preview-paleta__dot"
                style={{ background: s.hex }}
                title={s.nome}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── TELA DE DETALHE ──────────────────────────────────────────────────────────

function TelaDetalhe({ produto, onVoltar }) {
  const [selecoes, setSelecoes] = useState({});
  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal() { setModalAberto(true); }
  function fecharModal() { setModalAberto(false); }
  function confirmarSelecao() { setModalAberto(false); }

  return (
    <>
      <div className="detalhe-page">

        {/* Header */}
        <div className="detalhe-header">
          <button className="btn-back-det" onClick={onVoltar}>← Voltar</button>
          <div className="detalhe-header__title-group">
            <p className="eyebrow">Personalização</p>
            <h1 className="detalhe-title">{produto.nome}</h1>
          </div>
        </div>

        {/* Body */}
        <div className="detalhe-body">

          {/* Imagem */}
          <div className="detalhe-img-wrap">
            <img src={produto.img} alt={produto.nome} className="detalhe-img" loading="lazy" />
            <div className="detalhe-price-tag">{formatPrice(produto.preco)}</div>
          </div>

          {/* Configurador */}
          <div className="detalhe-config">
            <p className="detalhe-config__label">Configure seu produto</p>
            <p className="detalhe-config__sub">Escolha as cores de cada componente para criar sua combinação exclusiva</p>

            {/* Preview da combinação escolhida */}
            <PreviewCombinacao selecoes={selecoes} onEditar={abrirModal} />

            {/* Botão de personalização */}
            <button className="btn-personalizar" onClick={abrirModal}>
              🎨 Escolher cores
            </button>

            <button className="btn-confirmar">
              🛒 Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Modal de personalização */}
      <ModalPersonalizacao
        aberto={modalAberto}
        onFechar={fecharModal}
        onConfirmar={confirmarSelecao}
        selecoes={selecoes}
        setSelecoes={setSelecoes}
      />
    </>
  );
}

// ─── TELA PRINCIPAL ───────────────────────────────────────────────────────────

function Carrinho() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const navigate = useNavigate();

  if (produtoSelecionado) {
    return (
      <TelaDetalhe
        produto={produtoSelecionado}
        onVoltar={() => setProdutoSelecionado(null)}
      />
    );
  }

  return (
    <div className="loja-page">
      <MenuPage />
      <div className="loja-container">

        {/* Header */}
        <div className="loja-header">
          <BTNVolta />
          <div className="loja-header__title-group">
            <p className="eyebrow">Catálogo</p>
            <h1 className="loja-title">Nossos Produtos</h1>
          </div>
          <div>
            <button className="btn-comprar" onClick={() => navigate('/Carrinho/Catalogo')}>
              Catálogo →
            </button>
          </div>
          <p className="loja-count">{produtos.length} produtos</p>
        </div>

        {/* Grid de produtos */}
        <div className="loja-grid">
          {produtos.map((p, i) => (
            <div
              className="produto-card"
              key={p.id}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="produto-card__img-wrap">
                <img src={p.img} alt={p.nome} className="produto-card__img" loading="lazy" />
              </div>
              <div className="produto-card__body">
                <p className="produto-card__nome">{p.nome}</p>
                <p className="produto-card__desc">{p.descricao}</p>
                <div className="produto-card__footer">
                  <span className="produto-card__preco">{formatPrice(p.preco)}</span>
                  <button className="btn-comprar" onClick={() => setProdutoSelecionado(p)}>
                    Personalizar →
                  </button>
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