import React, { useState } from 'react';
import '../css/Mostrador.css';
import MenuPage from '../components/MenuPage';
import { useNavigate } from 'react-router-dom';

// ─── DATA ────────────────────────────────────────────────

export const CORDAS = [
  { id:'c1',  nome:'Verde Musgo',    codigo:'#70292', hex:'#4a5e3a', cat:'corda' },
  { id:'c2',  nome:'Azul Marinho',   codigo:'#70581', hex:'#1e2f5a', cat:'corda' },
  { id:'c3',  nome:'Mescla Areia',   codigo:'#84202', hex:'#c8b89a', cat:'corda' },
  { id:'c4',  nome:'Cinza',          codigo:'#70276', hex:'#7a8190', cat:'corda' },
  { id:'c5',  nome:'Atenas',         codigo:'#93278', hex:'#d4a017', cat:'corda' },
  { id:'c6',  nome:'Ocre',           codigo:'#82354', hex:'#c85820', cat:'corda' },
  { id:'c7',  nome:'Preto',          codigo:'#70268', hex:'#1a1a1a', cat:'corda' },
  { id:'c8',  nome:'Mescla Marrom',  codigo:'#76554', hex:'#9e7c5e', cat:'corda' },
  { id:'c9',  nome:'Mescla Duna',    codigo:'#95562', hex:'#c4b49a', cat:'corda' },
  { id:'c10', nome:'Vinho',          codigo:'#70300', hex:'#8b2e3e', cat:'corda' },
  { id:'c11', nome:'Dark Brown',     codigo:'#8804-7', hex:'#3d1f0d', cat:'corda' },
  { id:'c12', nome:'Verde Olivia',   codigo:'#83782', hex:'#6b7c52', cat:'corda' },
];

export const TECIDOS_TRADICIONAL = [
  { id:'t1',  nome:'Linho Natural',      fabricante:'Karsten — Aquablock', hex:'#c4b89a', cat:'tecido' },
  { id:'t2',  nome:'Cinza Chumbo',       fabricante:'Karsten — Aquablock', hex:'#7a8190', cat:'tecido' },
  { id:'t3',  nome:'Marrom Terroso',     fabricante:'Karsten — Aquablock', hex:'#8c6b4a', cat:'tecido' },
  { id:'t4',  nome:'Verde Floresta',     fabricante:'Karsten — Aquablock', hex:'#3a5c30', cat:'tecido' },
  { id:'t5',  nome:'Cinza Mesclado',     fabricante:'Karsten — Aquablock', hex:'#929292', cat:'tecido' },
  { id:'t6',  nome:'Azul Naval',         fabricante:'Karsten — Aquablock', hex:'#1e2f5a', cat:'tecido' },
  { id:'t7',  nome:'Branco Gelo',        fabricante:'Karsten — Aquablock', hex:'#e8e4dc', cat:'tecido' },
  { id:'t8',  nome:'Cinza Prata',        fabricante:'Karsten — Aquablock', hex:'#b0b4b8', cat:'tecido' },
  { id:'t9',  nome:'Areia Quente',       fabricante:'Fiama — Aquatec',     hex:'#c8a87a', cat:'tecido' },
  { id:'t10', nome:'Verde Oliva',        fabricante:'Fiama — Aquatec',     hex:'#6b7c52', cat:'tecido' },
  { id:'t11', nome:'Marrom Escuro',      fabricante:'Fiama — Aquatec',     hex:'#3d2010', cat:'tecido' },
  { id:'t12', nome:'Cinza Médio',        fabricante:'Fiama — Aquatec',     hex:'#909090', cat:'tecido' },
  { id:'t13', nome:'Bege Neutro',        fabricante:'Fiama — Aquatec',     hex:'#d4c4a8', cat:'tecido' },
  { id:'t14', nome:'Café',               fabricante:'Fiama — Aquatec',     hex:'#7c5038', cat:'tecido' },
  { id:'t15', nome:'Cinza Azulado',      fabricante:'Fiama — Aquatec',     hex:'#6a7a8c', cat:'tecido' },
  { id:'t16', nome:'Verde Musgo Claro',  fabricante:'Fiama — Aquatec',     hex:'#88a060', cat:'tecido' },
  { id:'t17', nome:'Cinza Claro',        fabricante:'Fiama — Aquatec',     hex:'#c0c4c8', cat:'tecido' },
  { id:'t18', nome:'Terra Queimada',     fabricante:'Fiama — Aquatec',     hex:'#b85030', cat:'tecido' },
  { id:'t19', nome:'Azul Jeans',         fabricante:'Fiama — Aquatec',     hex:'#3a4e6a', cat:'tecido' },
  { id:'t20', nome:'Bege Rosado',        fabricante:'Fiama — Aquatec',     hex:'#d4b8a0', cat:'tecido' },
  { id:'t21', nome:'Marrom Tabaco',      fabricante:'Fiama — Aquatec',     hex:'#6e4a28', cat:'tecido' },
  { id:'t22', nome:'Grafite',            fabricante:'Fiama — Aquatec',     hex:'#4a4a4a', cat:'tecido' },
  { id:'t23', nome:'Verde Lima',         fabricante:'Fiama — Aquatec',     hex:'#7ab240', cat:'tecido' },
];

export const COURINOS = [
  { id:'co1', nome:'Couro Grafite',     fabricante:'York', hex:'#2a2a2a', cat:'courino' },
  { id:'co2', nome:'Couro Cobre',       fabricante:'York', hex:'#7a3010', cat:'courino' },
  { id:'co3', nome:'Couro Marrom',      fabricante:'York', hex:'#4a2010', cat:'courino' },
  { id:'co4', nome:'Couro Bege Claro',  fabricante:'York', hex:'#c8b090', cat:'courino' },
];

export const PINTURA = [
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


// ─── Componentes ─────────────────────────────────────────

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="mos-section-header">
      <div className="mos-section-header__line" />
      <div>
        <p className="mos-eyebrow">{eyebrow}</p>
        <h2 className="mos-section-title">{title}</h2>
        {sub && <p className="mos-section-sub">{sub}</p>}
      </div>
    </div>
  );
}

function CardCorda({ item, onSelect, selecionado }) {
  const sel = selecionado?.id === item.id;
  return (
    <div
      className={`mos-card-corda ${sel ? 'mos-card-corda--sel' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="mos-card-corda__top">
        <div className="mos-card-corda__swatch-bar" style={{ background: item.hex }} />
        <div className="mos-card-corda__img">
          <div className="mos-corda-visual">
            <div className="mos-corda-visual__rope" style={{ background: item.hex }} />
            <div className="mos-corda-visual__knot" style={{ background: item.hex }} />
          </div>
          <div className="mos-card-corda__dot" style={{ background: item.hex }} />
        </div>
      </div>
      <div className="mos-card-corda__info">
        <p className="mos-card-corda__nome">{item.nome}</p>
        <p className="mos-card-corda__cod">{item.codigo}</p>
      </div>
      {sel && <div className="mos-card-corda__check">✓</div>}
    </div>
  );
}

function CardTecido({ item, onSelect, selecionado }) {
  const sel = selecionado?.id === item.id;
  return (
    <div
      className={`mos-card-tecido ${sel ? 'mos-card-tecido--sel' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div
        className="mos-card-tecido__faixa"
        style={{ background: `linear-gradient(135deg, ${item.hex}dd, ${item.hex}, ${item.hex}aa)` }}
      >
        <div className="mos-card-tecido__texture" />
        <span className="mos-card-tecido__label">{item.nome}</span>
      </div>
      <div className="mos-card-tecido__info">
        <p className="mos-card-tecido__nome">{item.nome}</p>
        <p className="mos-card-tecido__fab">{item.fabricante}</p>
      </div>
      {sel && <div className="mos-card-sel-check">✓</div>}
    </div>
  );
}

function CardPintura({ item, onSelect, selecionado }) {
  const sel = selecionado?.id === item.id;
  return (
    <div
      className={`mos-card-pintura ${sel ? 'mos-card-pintura--sel' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="mos-card-pintura__top">
        <div className="mos-card-pintura__swatch-bar" style={{ background: item.hex }} />
        <div className="mos-card-pintura__placa" style={{ background: item.hex }}>
          <div className="mos-card-pintura__texture" />
        </div>
      </div>
      <div className="mos-card-pintura__nome">{item.nome}</div>
      {sel && <div className="mos-card-sel-check">✓</div>}
    </div>
  );
}

function CardCourino({ item, onSelect, selecionado }) {
  const sel = selecionado?.id === item.id;
  return (
    <div
      className={`mos-card-courino ${sel ? 'mos-card-courino--sel' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div
        className="mos-card-courino__faixa"
        style={{ background: `linear-gradient(160deg, ${item.hex}cc, ${item.hex}, ${item.hex}88)` }}
      >
        <div className="mos-card-courino__sheen" />
        <span className="mos-card-courino__label">{item.nome}</span>
      </div>
      {sel && <div className="mos-card-sel-check">✓</div>}
    </div>
  );
}

function PainelSelecao({ selecoes, onRemover }) {
  if (Object.keys(selecoes).length === 0) return null;

  const categorias = {
    corda:   { label: 'Corda Náutica',        items: [] },
    tecido:  { label: 'Tecido',                items: [] },
    courino: { label: 'Courino',               items: [] },
    pintura: { label: 'Pintura Eletrostática', items: [] },
  };
  Object.values(selecoes).forEach(s => {
    if (categorias[s.cat]) categorias[s.cat].items.push(s);
  });

  return (
    <div className="mos-painel">
      <h3 className="mos-painel__title">Seleção atual</h3>
      {Object.entries(categorias).map(([cat, { label, items }]) =>
        items.length > 0 ? (
          <div key={cat} className="mos-painel__grupo">
            <p className="mos-painel__grupo-label">{label}</p>
            {items.map(item => (
              <div key={item.id} className="mos-painel__item">
                <div className="mos-painel__dot" style={{ background: item.hex }} />
                <span>{item.nome}</span>
                <button onClick={() => onRemover(cat)} className="mos-painel__del">✕</button>
              </div>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}

// ─── PRINCIPAL ───────────────────────────────────────────
export default function Mostrador() {
  const [aba, setAba] = useState('cordas');
  const [selecoes, setSelecoes] = useState({});
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

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

  function removerSelecao(cat) {
    setSelecoes(prev => {
      const novo = { ...prev };
      delete novo[cat];
      return novo;
    });
  }

  function filtrar(lista) {
    if (!busca.trim()) return lista;
    return lista.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase()));
  }

  const abas = [
    { id:'cordas',  label:'Cordas Náuticas',      count: CORDAS.length },
    { id:'tecidos', label:'Tecidos',               count: TECIDOS_TRADICIONAL.length + COURINOS.length },
    { id:'pintura', label:'Pintura Eletrostática', count: PINTURA.length },
  ];

  const totalSel = Object.keys(selecoes).length;

  return (
    <>
      <MenuPage />
      <div className="mos-page">

        {/* ── HEADER ── */}
        <div className="mos-header">
          <div className="mos-header__left">
            <button className="btn-comprar" onClick={() => navigate('/Carrinho')}>← Volta</button>
            <div className="mos-header__titles">
              <p className="mos-eyebrow">Kasaleve — Paleta de Cores</p>
              <h1 className="mos-title">Mostrador de Cores</h1>
              <p className="mos-subtitle">Selecione as combinações para seu projeto</p>
            </div>
          </div>
          <div className="mos-header__right">
            {totalSel > 0 && (
              <div className="mos-sel-badge">
                {totalSel} {totalSel === 1 ? 'item selecionado' : 'itens selecionados'}
              </div>
            )}
            <div className="mos-search">
              <span>🔍</span>
              <input
                placeholder="Buscar cor ou material..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── AVISO ── */}
        <div className="mos-aviso">
          <span>ℹ️</span>
          <p>Todas as cores disponíveis sob encomenda · <strong>lp.kasaleve.com.br</strong></p>
        </div>

        <div className="mos-body">

          {/* ── CONTEÚDO ── */}
          <div className="mos-content">

            {/* Tabs */}
            <div className="mos-tabs">
              {abas.map(a => (
                <button key={a.id}
                  className={`mos-tab ${aba === a.id ? 'mos-tab--active' : ''}`}
                  onClick={() => setAba(a.id)}>
                  {a.label}
                  <span className="mos-tab__count">{a.count}</span>
                </button>
              ))}
            </div>

            {/* ── ABA CORDAS ── */}
            {aba === 'cordas' && (
              <div className="mos-aba">
                <SectionHeader
                  eyebrow="Kasaleve — Paleta de Cores"
                  title="Paleta Completa — Vol. I"
                  sub="Cordas náuticas disponíveis para personalização"
                />
                <div className="mos-grid-cordas">
                  {filtrar(CORDAS).map(item => (
                    <CardCorda
                      key={item.id}
                      item={item}
                      selecionado={selecoes.corda}
                      onSelect={selecionar}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── ABA TECIDOS ── */}
            {aba === 'tecidos' && (
              <div className="mos-aba">
                <SectionHeader
                  eyebrow="Kasaleve — Paleta de Cores"
                  title="Coleção de Tecidos"
                  sub="Mostrador — Tradicional"
                />
                <div className="mos-fabricantes">
                  <div className="mos-fabricante-info">
                    <h4 className="mos-fab-nome">Karsten — Linha Aquablock</h4>
                    <p className="mos-fab-desc">Tecidos impermeáveis com alta resistência, fácil limpeza e excelente durabilidade, ideais para áreas internas e externas.</p>
                  </div>
                  <div className="mos-fabricante-info">
                    <h4 className="mos-fab-nome">Fiama — Linha Aquatec</h4>
                    <p className="mos-fab-desc">Tecidos que unem estética e funcionalidade, com variedade de cores, texturas e composições para ambientes sofisticados.</p>
                  </div>
                </div>
                <div className="mos-grid-tecidos">
                  {filtrar(TECIDOS_TRADICIONAL).map(item => (
                    <CardTecido
                      key={item.id}
                      item={item}
                      selecionado={selecoes.tecido}
                      onSelect={selecionar}
                    />
                  ))}
                </div>

                <div className="mos-sep" />

                <SectionHeader
                  eyebrow="Kasaleve — Paleta de Cores"
                  title="Coleção de Tecidos"
                  sub="Mostrador — Courino"
                />
                <div className="mos-fabricante-info">
                  <h4 className="mos-fab-nome">York</h4>
                  <p className="mos-fab-desc">Material sintético que combina sofisticação, resistência e praticidade. Acabamento elegante, toque confortável e fácil manutenção.</p>
                </div>
                <div className="mos-grid-courinos">
                  {filtrar(COURINOS).map(item => (
                    <CardCourino
                      key={item.id}
                      item={item}
                      selecionado={selecoes.courino}
                      onSelect={selecionar}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── ABA PINTURA ── */}
            {aba === 'pintura' && (
              <div className="mos-aba">
                <SectionHeader
                  eyebrow="Kasaleve — Paleta de Cores"
                  title="Paleta Completa — Vol. II"
                  sub="Mostrador — Pintura Eletrostática"
                />
                <div className="mos-grid-pintura">
                  {filtrar(PINTURA).map(item => (
                    <CardPintura
                      key={item.id}
                      item={item}
                      selecionado={selecoes.pintura}
                      onSelect={selecionar}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── PAINEL LATERAL ── */}
          <aside className="mos-aside">
            <PainelSelecao selecoes={selecoes} onRemover={removerSelecao} />

            {totalSel === 0 && (
              <div className="mos-aside-empty">
                <div className="mos-aside-empty__icon">🎨</div>
                <p>Clique em uma cor para selecionar</p>
              </div>
            )}

            {totalSel > 0 && (
              <button className="mos-btn-limpar" onClick={() => setSelecoes({})}>
                Limpar seleção
              </button>
            )}

            {/* Preview da combinação */}
            {(selecoes.corda || selecoes.pintura || selecoes.tecido || selecoes.courino) && (
              <div className="mos-preview">
                <p className="mos-preview__title">Preview da combinação</p>
                <div className="mos-preview__mostra">
                  {selecoes.pintura && (
                    <div className="mos-preview__aluminum" style={{ background: selecoes.pintura.hex }}>
                      <span>Alumínio</span>
                    </div>
                  )}
                  {selecoes.corda && (
                    <div className="mos-preview__rope" style={{ background: selecoes.corda.hex }}>
                      <span>Corda</span>
                    </div>
                  )}
                  {selecoes.tecido && (
                    <div className="mos-preview__fabric" style={{ background: selecoes.tecido.hex }}>
                      <span>Tecido</span>
                    </div>
                  )}
                  {selecoes.courino && (
                    <div className="mos-preview__fabric" style={{ background: selecoes.courino.hex }}>
                      <span>Courino</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rodapé */}
            <div className="mos-aside-footer">
              <p className="mos-aside-footer__brand">kasaleve</p>
              <p className="mos-aside-footer__tag">projeto • conforto</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}