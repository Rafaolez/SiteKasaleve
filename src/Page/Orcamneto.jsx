import React, { useEffect, useState } from 'react';

/* ─── helpers ─── */
const fmtBR = (n) => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;
const uid   = ()  => Math.random().toString(36).slice(2, 8);
const hoje  = ()  => new Date().toLocaleDateString('pt-BR');
const numOrc = () => `ORC-${Date.now().toString().slice(-6)}`;
const emptyLinha = () => ({ _key: uid(), prodId: '', title: '', image: '', customDesc: '', qty: 1, price: '' });

/* ─── miniatura ─── */
function ProdThumb({ src, alt }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{
        width: 52, height: 52, borderRadius: 8,
        background: '#f4f3ef', border: '1px dashed #ccc',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, margin: '0 auto', flexShrink: 0,
      }}>📦</div>
    );
  }
  return (
    <img
      src={src} alt={alt || ''}
      onError={() => setErr(true)}
      loading="lazy"
      style={{
        width: 52, height: 52, objectFit: 'contain',
        borderRadius: 8, background: '#f4f3ef',
        border: '1px solid #e0e0dc', display: 'block',
        margin: '0 auto', flexShrink: 0,
      }}
    />
  );
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════ */
export default function Orcamento() {
  const [produtos,    setProdutos]   = useState([]);
  const [loadingApi,  setLoadingApi] = useState(true);
  const [numero]                     = useState(numOrc);
  const [validade,    setValidade]   = useState('');
  const [condicao,    setCondicao]   = useState('');
  const [obs,         setObs]        = useState('');
  const [desconto,    setDesconto]   = useState('');
  const [linhas,      setLinhas]     = useState([emptyLinha()]);
  const [cli, setCli] = useState({
    nome:'', empresa:'', email:'', telefone:'',
    cpfCnpj:'', endereco:'', cidade:'', estado:'', cep:'',
  });

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(r => r.json()).then(setProdutos)
      .catch(console.error).finally(() => setLoadingApi(false));
  }, []);

  const subtotal  = linhas.reduce((a, l) => a + (parseFloat(l.price)||0) * (parseInt(l.qty)||0), 0);
  const descVal   = parseFloat(desconto) || 0;
  const total     = Math.max(0, subtotal - descVal);

  const addLinha    = ()        => setLinhas(p => [...p, emptyLinha()]);
  const removeLinha = key       => setLinhas(p => p.filter(l => l._key !== key));
  const setField    = (k,f,v)   => setLinhas(p => p.map(l => l._key===k ? {...l,[f]:v} : l));

  const selectProd = (key, prodId) => {
    const p = produtos.find(x => String(x.id) === prodId);
    setLinhas(prev => prev.map(l => {
      if (l._key !== key) return l;
      if (!p) return { ...l, prodId:'', title:'', image:'', price:'' };
      return { ...l, prodId: String(p.id), title: p.title, image: p.image, price: p.price };
    }));
  };

  /* ─── estilos inline ─── */
  const S = styles;

  return (
    <>
      {/* CSS global injetado uma vez */}
      <style>{GLOBAL_CSS}</style>

      <div style={S.bg}>
        <div style={S.paper}>

          {/* ══ TOPO PRETO ══ */}
          <div style={S.top}>
            <div>
              <div style={S.topName}>ORÇAMENTO</div>
              <div style={S.topSub}>Proposta Comercial</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={S.topLabel}>NÚMERO</div>
              <div style={S.topNum}>{numero}</div>
            </div>
          </div>

          {/* ══ FAIXA DOURADA ══ */}
          <div style={S.metaBar}>
            <div style={S.metaItem}>
              <span style={S.metaLabel}>Emitido em</span>
              <span style={S.metaVal}>{hoje()}</span>
            </div>
            <div style={S.metaItem}>
              <span style={S.metaLabel}>Validade</span>
              <input className="orc-meta-input" type="date" value={validade}
                onChange={e => setValidade(e.target.value)} />
            </div>
            <div style={S.metaItem}>
              <span style={S.metaLabel}>Pagamento</span>
              <input className="orc-meta-input" type="text" placeholder="ex: 30/60 dias"
                value={condicao} onChange={e => setCondicao(e.target.value)} />
            </div>
          </div>

          {/* ══ BODY ══ */}
          <div style={S.body}>

            {/* CLIENTE */}
            <section>
              <div style={S.sectionTitle}>Dados do cliente</div>
              <div style={S.cliGrid}>
                {[
                  {f:'nome',      l:'Nome completo',  s:2},
                  {f:'empresa',   l:'Empresa / Razão Social'},
                  {f:'email',     l:'E-mail',          s:2},
                  {f:'telefone',  l:'Telefone'},
                  {f:'cpfCnpj',   l:'CPF / CNPJ',      s:2},
                  {f:'endereco',  l:'Endereço'},
                  {f:'cidade',    l:'Cidade',           s:2},
                  {f:'estado',    l:'Estado (UF)',      pl:'SP'},
                  {f:'cep',       l:'CEP'},
                ].map(({f,l,s,pl}) => (
                  <div key={f} style={{ gridColumn: s ? `span ${s}` : 'span 1' }}>
                    <label style={S.fieldLabel}>{l}</label>
                    <input className="orc-input" type="text" placeholder={pl||''}
                      value={cli[f]} onChange={e => setCli({...cli,[f]:e.target.value})} />
                  </div>
                ))}
              </div>
            </section>

            <hr style={S.hr} />

            {/* ITENS */}
            <section>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={S.sectionTitle}>Itens do orçamento</div>
                {loadingApi && <span style={S.loadingTag}>carregando catálogo…</span>}
              </div>

              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr style={{ background:'#f4f3ef' }}>
                      <th style={{...S.th, width:72}}>Imagem</th>
                      <th style={{...S.th, minWidth:170}}>Produto</th>
                      <th style={{...S.th, minWidth:160}}>Descrição</th>
                      <th style={{...S.th, width:60, textAlign:'center'}}>Qtd</th>
                      <th style={{...S.th, width:100, textAlign:'right'}}>Unitário</th>
                      <th style={{...S.th, width:100, textAlign:'right'}}>Total</th>
                      <th style={{...S.th, width:36}} />
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((linha, i) => {
                      const lineTotal = (parseFloat(linha.price)||0) * (parseInt(linha.qty)||0);
                      return (
                        <tr key={linha._key} className="orc-item-row"
                          style={{ borderBottom: i < linhas.length-1 ? '1px solid #ebebе7' : 'none' }}>

                          {/* IMAGEM */}
                          <td style={{ padding:'8px 10px', textAlign:'center' }}>
                            <ProdThumb src={linha.image} alt={linha.title} />
                          </td>

                          {/* PRODUTO */}
                          <td style={{ padding:'8px 10px' }}>
                            <select className="orc-select-prod"
                              value={linha.prodId}
                              onChange={e => selectProd(linha._key, e.target.value)}>
                              <option value="">— selecionar —</option>
                              {produtos.map(p => (
                                <option key={p.id} value={String(p.id)}>
                                  {p.title.length > 46 ? p.title.slice(0,46)+'…' : p.title}
                                </option>
                              ))}
                            </select>
                            {linha.title && (
                              <p style={S.prodHint}>
                                {linha.title.length > 52 ? linha.title.slice(0,52)+'…' : linha.title}
                              </p>
                            )}
                          </td>

                          {/* DESCRIÇÃO — vazia para o usuário preencher */}
                          <td style={{ padding:'8px 10px' }}>
                            <textarea className="orc-desc-ta" rows={2}
                              placeholder="Descreva o item…"
                              value={linha.customDesc}
                              onChange={e => setField(linha._key,'customDesc',e.target.value)} />
                          </td>

                          {/* QTD */}
                          <td style={{ padding:'8px 10px', textAlign:'center' }}>
                            <input className="orc-num-input orc-num-center"
                              type="number" min="1" value={linha.qty}
                              onChange={e => setField(linha._key,'qty',e.target.value)} />
                          </td>

                          {/* PREÇO */}
                          <td style={{ padding:'8px 10px', textAlign:'right' }}>
                            <input className="orc-num-input orc-num-right"
                              type="number" step="0.01" min="0"
                              value={linha.price} placeholder="0,00"
                              onChange={e => setField(linha._key,'price',e.target.value)} />
                          </td>

                          {/* TOTAL */}
                          <td style={{ padding:'8px 10px', textAlign:'right',
                            fontWeight:600, color:'#1a1a18',
                            fontVariantNumeric:'tabular-nums', fontSize:12, whiteSpace:'nowrap' }}>
                            {lineTotal > 0 ? fmtBR(lineTotal) : '—'}
                          </td>

                          {/* DEL */}
                          <td style={{ padding:'8px 6px', textAlign:'center' }}>
                            <button className="orc-btn-del"
                              onClick={() => removeLinha(linha._key)}>×</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button className="orc-btn-add" onClick={addLinha}>
                + Adicionar item
              </button>
            </section>

            <hr style={S.hr} />

            {/* TOTAIS */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
              {[
                { label:'Subtotal', val: fmtBR(subtotal) },
              ].map(r => (
                <div key={r.label} style={S.totRow}>
                  <span>{r.label}</span><span>{r.val}</span>
                </div>
              ))}
              <div style={S.totRow}>
                <span>Desconto (R$)</span>
                <input className="orc-num-input orc-num-right" type="number"
                  min="0" step="0.01" value={desconto} placeholder="0,00"
                  onChange={e => setDesconto(e.target.value)}
                  style={{ width:100 }} />
              </div>
              <div style={{ ...S.totRow, ...S.totFinal }}>
                <span>Total</span><span>{fmtBR(total)}</span>
              </div>
            </div>

            <hr style={S.hr} />

            {/* OBSERVAÇÕES */}
            <section>
              <div style={S.sectionTitle}>Observações</div>
              <textarea className="orc-input" rows={3}
                placeholder="Prazos de entrega, garantias, condições especiais…"
                value={obs} onChange={e => setObs(e.target.value)}
                style={{ resize:'vertical', minHeight:60 }} />
            </section>

          </div>{/* /body */}

          {/* ══ RODAPÉ ══ */}
          <div style={S.footer}>
            <div style={{ display:'flex', gap:56 }}>
              {['Fornecedor','Cliente'].map(n => (
                <div key={n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:180 }}>
                  <div style={{ width:'100%', borderTop:'1px solid #d0d0cc' }} />
                  <span style={{ fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#888' }}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
              <button className="orc-btn-export" onClick={() => window.print()}>
                🖨 Imprimir / PDF
              </button>
              <p style={{ fontSize:11, color:'#888', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:'#2d7d52' }} />
                Imagens incluídas no PDF
              </p>
            </div>
          </div>

        </div>{/* /paper */}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   ESTILOS JS (objetos inline — não dependem de arquivo externo)
════════════════════════════════════════════ */
const styles = {
  bg: {
    minHeight:'100vh', background:'#f0efe9',
    padding:'40px 16px 80px', display:'flex', justifyContent:'center',
    fontFamily:"'Sora', 'Segoe UI', sans-serif", color:'#1a1a18',
  },
  paper: {
    background:'#fff', width:'100%', maxWidth:920,
    borderRadius:16, overflow:'hidden',
    boxShadow:'0 2px 40px rgba(0,0,0,.12)',
    display:'flex', flexDirection:'column',
    animation:'orc-fadeUp .4s ease both',
  },
  top: {
    background:'#1a1a18', padding:'32px 48px',
    display:'flex', justifyContent:'space-between', alignItems:'flex-end',
  },
  topName: {
    fontFamily:"'Lora', 'Georgia', serif",
    fontSize:30, fontWeight:600, color:'#fff', letterSpacing:3,
  },
  topSub: { fontSize:11, color:'#666', letterSpacing:2, textTransform:'uppercase', marginTop:5 },
  topLabel: { fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#555', marginBottom:4 },
  topNum: { fontSize:24, fontWeight:600, color:'#fff', fontVariantNumeric:'tabular-nums', letterSpacing:1 },
  metaBar: {
    background:'#faf6ef', borderBottom:'1px solid #e8dfc8',
    padding:'14px 48px', display:'flex', gap:36, flexWrap:'wrap', alignItems:'center',
  },
  metaItem:  { display:'flex', flexDirection:'column', gap:3 },
  metaLabel: { fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#9a7c4f', fontWeight:600 },
  metaVal:   { fontSize:13, color:'#1a1a18', fontWeight:500 },
  body:      { padding:'36px 48px', display:'flex', flexDirection:'column', gap:26 },
  hr:        { border:'none', borderTop:'1px solid #e8e8e4' },
  sectionTitle: {
    fontSize:9, letterSpacing:'2.5px', textTransform:'uppercase',
    color:'#888', fontWeight:600, marginBottom:14,
  },
  cliGrid: {
    display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px 20px',
  },
  fieldLabel: {
    display:'block', fontSize:9, fontWeight:600,
    letterSpacing:'1.5px', textTransform:'uppercase', color:'#888', marginBottom:4,
  },
  loadingTag: { fontSize:11, color:'#bbb', fontStyle:'italic' },
  tableWrap: {
    border:'1px solid #d0d0cc', borderRadius:10,
    overflow:'hidden', overflowX:'auto',
  },
  table: { width:'100%', borderCollapse:'collapse', fontSize:12 },
  th: {
    fontSize:9, fontWeight:600, letterSpacing:'1.5px',
    textTransform:'uppercase', color:'#888',
    padding:'10px 12px', textAlign:'left',
    borderBottom:'1px solid #d0d0cc', whiteSpace:'nowrap',
  },
  prodHint: {
    fontSize:10, color:'#aaa', marginTop:5,
    lineHeight:1.3, overflow:'hidden',
    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
  },
  totRow: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    width:300, fontSize:13, color:'#4a4a47',
  },
  totFinal: {
    borderTop:'1.5px solid #d0d0cc', paddingTop:9,
    marginTop:2, fontSize:16, fontWeight:600, color:'#1a1a18',
  },
  footer: {
    background:'#f5f4f0', borderTop:'1px solid #d0d0cc',
    padding:'24px 48px', display:'flex',
    justifyContent:'space-between', alignItems:'center',
    gap:24, flexWrap:'wrap',
  },
};

/* ════════════════════════════════════════════
   CSS GLOBAL — injetado via <style> tag
   (classes de inputs, hover states, print, etc.)
════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600&display=swap');

@keyframes orc-fadeUp {
  from { opacity:0; transform:translateY(16px) }
  to   { opacity:1; transform:translateY(0) }
}

.orc-input, .orc-input[type="text"], .orc-input[type="email"] {
  width:100%;
  border:1px solid #d0d0cc;
  border-radius:6px;
  padding:8px 10px;
  font-size:13px;
  font-family:'Sora','Segoe UI',sans-serif;
  color:#1a1a18;
  background:#fff;
  outline:none;
  transition:border-color .15s, box-shadow .15s;
}
.orc-input:focus {
  border-color:#1a1a18;
  box-shadow:0 0 0 2px rgba(26,26,24,.06);
}
.orc-input::placeholder { color:#b8b8b0; }

.orc-meta-input {
  border:none; background:transparent;
  font-size:13px; font-family:'Sora','Segoe UI',sans-serif;
  color:#1a1a18; font-weight:500; outline:none; padding:0; cursor:pointer;
}
.orc-meta-input::placeholder { color:#b8b8b0; }

.orc-select-prod {
  width:100%; border:1px solid #d0d0cc; border-radius:6px;
  padding:5px 7px; font-size:11px;
  font-family:'Sora','Segoe UI',sans-serif;
  color:#1a1a18; background:#fff; cursor:pointer; outline:none;
  transition:border-color .15s;
}
.orc-select-prod:focus {
  border-color:#1a1a18;
  box-shadow:0 0 0 2px rgba(26,26,24,.06);
}

.orc-desc-ta {
  width:100%; border:1px solid #e8e8e4; border-radius:6px;
  padding:5px 7px; font-size:11px;
  font-family:'Sora','Segoe UI',sans-serif;
  color:#1a1a18; background:transparent; resize:vertical;
  min-height:44px; outline:none; transition:border-color .15s;
}
.orc-desc-ta:focus { border-color:#1a1a18; background:#fff; box-shadow:0 0 0 2px rgba(26,26,24,.06); }
.orc-desc-ta::placeholder { color:#b8b8b0; }

.orc-num-input {
  border:1px solid #d0d0cc; border-radius:6px;
  padding:5px 7px; font-size:12px;
  font-family:'Sora','Segoe UI',sans-serif;
  color:#1a1a18; background:#fff; width:100%; outline:none;
  transition:border-color .15s; -moz-appearance:textfield;
}
.orc-num-input::-webkit-inner-spin-button { display:none; }
.orc-num-center { text-align:center; width:52px; }
.orc-num-right  { text-align:right; }
.orc-num-input:focus { border-color:#1a1a18; box-shadow:0 0 0 2px rgba(26,26,24,.06); }
.orc-num-input::placeholder { color:#b8b8b0; }

.orc-item-row td { border-bottom:1px solid #ebebе7; }
.orc-item-row:last-child td { border-bottom:none !important; }
.orc-item-row:hover td { background:#fafaf8; }

.orc-btn-del {
  background:none; border:none; color:#ccc;
  font-size:18px; font-weight:300; cursor:pointer;
  padding:2px 7px; border-radius:4px; line-height:1; transition:color .15s, background .15s;
}
.orc-btn-del:hover { color:#b83232; background:#fdf0ee; }

.orc-btn-add {
  align-self:flex-start; background:none;
  border:1px dashed #d0d0cc; color:#888;
  font-size:12px; font-family:'Sora','Segoe UI',sans-serif;
  padding:7px 16px; border-radius:6px; cursor:pointer; margin-top:10px;
  transition:border-color .15s, color .15s, background .15s;
}
.orc-btn-add:hover { border-color:#1a1a18; color:#1a1a18; background:#f7f6f2; }

.orc-btn-export {
  background:#1a1a18; color:#fff; border:none;
  border-radius:6px; padding:12px 28px;
  font-size:13px; font-weight:600;
  font-family:'Sora','Segoe UI',sans-serif;
  letter-spacing:.3px; cursor:pointer;
  box-shadow:0 2px 12px rgba(0,0,0,.18);
  transition:background .18s, transform .18s;
}
.orc-btn-export:hover { background:#333; transform:translateY(-1px); }

/* ── PRINT / PDF ─────────────────────────── */
@media print {
  body { background:none !important; }

  /* esconde controles */
  .orc-btn-add, .orc-btn-del, .orc-btn-export,
  .orc-meta-input, .orc-num-input, .orc-select-prod { display:none !important; }

  /* garante impressão de imagens e fundo preto do topo */
  * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }

  /* campos ficam como texto */
  .orc-input, .orc-desc-ta {
    border:none !important; background:transparent !important;
    box-shadow:none !important; padding:2px 0 !important; resize:none;
  }
}
`;