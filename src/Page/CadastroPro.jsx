import React, { useContext, useEffect, useRef, useState } from 'react';
import '../css/Orcamneto.css';

/* ─── helpers ─── */
const fmt = (n) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
const uid = () => Math.random().toString(36).slice(2, 8);
const today = () => new Date().toLocaleDateString('pt-BR');

/* ─── produto vazio ─── */
const emptyLine = () => ({
  _key: uid(),
  id: '',
  title: '',
  image: '',
  customDesc: '',
  price: '',
  qty: 1,
});

/* ─── componentes menores ─── */
function ProductImageCell({ src, alt }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="orc-img-placeholder">
        <span>📦</span>
      </div>
    );
  }
  return (
    <img
      className="orc-prod-thumb"
      src={src}
      alt={alt || 'produto'}
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

function StatusBadge({ label, type = 'blue' }) {
  return (
    <span className={`badge badge--${type}`}>
      <span className="badge__dot" />
      {label}
    </span>
  );
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════ */
export default function Orcamento() {
  const [produtos, setProdutos] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);

  /* linhas do orçamento */
  const [linhas, setLinhas] = useState([emptyLine()]);

  /* cabeçalho */
  const [numero] = useState(`ORC-${Date.now().toString().slice(-6)}`);
  const [validade, setValidade] = useState('');
  const [condicao, setCondicao] = useState('');
  const [obs, setObs] = useState('');

  /* cliente */
  const [cliente, setCliente] = useState({
    nome: '', empresa: '', email: '', telefone: '', cpfCnpj: '',
    endereco: '', cidade: '', estado: '', cep: '',
  });

  /* desconto */
  const [desconto, setDesconto] = useState('');

  /* ── busca produtos da API ── */
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((r) => r.json())
      .then((data) => setProdutos(data))
      .catch(console.error)
      .finally(() => setLoadingApi(false));
  }, []);

  /* ── cálculos ── */
  const subtotal = linhas.reduce((acc, l) => {
    const p = parseFloat(l.price) || 0;
    const q = parseInt(l.qty) || 0;
    return acc + p * q;
  }, 0);
  const descontoVal = parseFloat(desconto) || 0;
  const total = Math.max(0, subtotal - descontoVal);

  /* ── linhas: helpers ── */
  const addLinha = () => setLinhas((prev) => [...prev, emptyLine()]);

  const removeLinha = (key) =>
    setLinhas((prev) => prev.filter((l) => l._key !== key));

  const updateLinha = (key, field, value) =>
    setLinhas((prev) =>
      prev.map((l) => (l._key === key ? { ...l, [field]: value } : l))
    );

  const selectProduto = (key, produtoId) => {
    const p = produtos.find((x) => String(x.id) === produtoId);
    if (!p) {
      updateLinha(key, 'id', '');
      updateLinha(key, 'title', '');
      updateLinha(key, 'image', '');
      updateLinha(key, 'price', '');
      return;
    }
    setLinhas((prev) =>
      prev.map((l) =>
        l._key === key
          ? {
              ...l,
              id: String(p.id),
              title: p.title,
              image: p.image,
              price: p.price,
              customDesc: l.customDesc, // mantém desc customizada
            }
          : l
      )
    );
  };

  /* ── print/export ── */
  const handlePrint = () => window.print();

  return (
    <div className="orc-bg">
      <div className="orc-paper">

        {/* ══ CABEÇALHO ══ */}
        <div className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">ORÇAMENTO</span>
            <span className="orc-logo__tag">
              <span className="orc-logo__dot">●</span>
              Proposta Comercial
            </span>
          </div>
          <div className="orc-header__info">
            <p className="orc-header__num">
              Nº <strong>{numero}</strong>
            </p>
            <p className="orc-header__date">Emitido em {today()}</p>
          </div>
        </div>

        <hr className="orc-divider" />

        {/* ══ META ══ */}
        <div className="orc-section">
          <p className="orc-section__title">Condições Gerais</p>
          <div className="orc-meta">
            <div className="orc-field">
              <label>Validade</label>
              <input
                type="date"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
              />
            </div>
            <div className="orc-field">
              <label>Condição de Pagamento</label>
              <input
                type="text"
                placeholder="ex: 30/60/90 dias"
                value={condicao}
                onChange={(e) => setCondicao(e.target.value)}
              />
            </div>
          </div>
        </div>

        <hr className="orc-divider" />

        {/* ══ CLIENTE ══ */}
        <div className="orc-section">
          <p className="orc-section__title">Dados do Cliente</p>
          <div className="orc-cliente-grid">
            {[
              { f: 'nome', l: 'Nome Completo', span: 2 },
              { f: 'empresa', l: 'Empresa' },
              { f: 'email', l: 'E-mail', span: 2 },
              { f: 'telefone', l: 'Telefone' },
              { f: 'cpfCnpj', l: 'CPF / CNPJ' },
              { f: 'endereco', l: 'Endereço', span: 2 },
              { f: 'cidade', l: 'Cidade' },
              { f: 'estado', l: 'Estado' },
              { f: 'cep', l: 'CEP' },
            ].map(({ f, l, span }) => (
              <div
                key={f}
                className={`orc-field${span ? ` orc-field--col${span}` : ''}`}
              >
                <label>{l}</label>
                <input
                  type="text"
                  value={cliente[f]}
                  onChange={(e) =>
                    setCliente((prev) => ({ ...prev, [f]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="orc-divider" />

        {/* ══ ITENS ══ */}
        <div className="orc-section">
          <div className="orc-section__header">
            <p className="orc-section__title">Itens do Orçamento</p>
            {loadingApi && (
              <span className="orc-loading-tag">carregando produtos…</span>
            )}
          </div>

          <div className="orc-table-wrap">
            <table className="orc-table orc-items-table">
              <thead>
                <tr>
                  <th className="col-img">Imagem</th>
                  <th className="col-prod">Produto</th>
                  <th className="col-desc">Descrição</th>
                  <th className="col-qtd center">Qtd</th>
                  <th className="col-unit right">Unit.</th>
                  <th className="col-total right">Total</th>
                  <th className="col-del" />
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => {
                  const lineTotal =
                    (parseFloat(linha.price) || 0) * (parseInt(linha.qty) || 0);
                  return (
                    <tr key={linha._key} className="orc-item-row">
                      {/* IMAGEM */}
                      <td className="col-img td-img">
                        <ProductImageCell src={linha.image} alt={linha.title} />
                      </td>

                      {/* PRODUTO – select */}
                      <td className="col-prod">
                        <select
                          value={linha.id}
                          onChange={(e) =>
                            selectProduto(linha._key, e.target.value)
                          }
                          className="orc-select-prod"
                        >
                          <option value="">— selecionar —</option>
                          {produtos.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                              {p.title.length > 48
                                ? p.title.slice(0, 48) + '…'
                                : p.title}
                            </option>
                          ))}
                        </select>
                        {linha.title && (
                          <p className="orc-prod-subtitle">{linha.title}</p>
                        )}
                      </td>

                      {/* DESCRIÇÃO – editável pelo usuário */}
                      <td className="col-desc">
                        <textarea
                          className="orc-desc-input"
                          rows={2}
                          placeholder="Descrição personalizada…"
                          value={linha.customDesc}
                          onChange={(e) =>
                            updateLinha(linha._key, 'customDesc', e.target.value)
                          }
                        />
                      </td>

                      {/* QTD */}
                      <td className="col-qtd center">
                        <input
                          type="number"
                          min="1"
                          value={linha.qty}
                          onChange={(e) =>
                            updateLinha(linha._key, 'qty', e.target.value)
                          }
                          className="orc-qty-input"
                        />
                      </td>

                      {/* UNIT */}
                      <td className="col-unit right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={linha.price}
                          onChange={(e) =>
                            updateLinha(linha._key, 'price', e.target.value)
                          }
                          className="orc-price-input"
                          placeholder="0,00"
                        />
                      </td>

                      {/* TOTAL */}
                      <td className="col-total right orc-line-total">
                        {lineTotal > 0 ? fmt(lineTotal) : '—'}
                      </td>

                      {/* DEL */}
                      <td className="col-del center">
                        <button
                          className="orc-btn-del"
                          onClick={() => removeLinha(linha._key)}
                          title="Remover item"
                        >
                          ×
                        </button>
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
        </div>

        <hr className="orc-divider" />

        {/* ══ TOTAIS ══ */}
        <div className="orc-totais">
          <div className="orc-totais__row">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="orc-totais__row">
            <span>Desconto (R$)</span>
            <span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                className="orc-discount-input"
                placeholder="0,00"
              />
            </span>
          </div>
          <div className="orc-totais__row orc-totais__row--final">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        <hr className="orc-divider" />

        {/* ══ OBSERVAÇÕES ══ */}
        <div className="orc-section">
          <p className="orc-section__title">Observações</p>
          <div className="orc-field">
            <textarea
              rows={3}
              placeholder="Informações adicionais, prazos de entrega, garantias…"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        <hr className="orc-divider" />

        {/* ══ ASSINATURA ══ */}
        <div className="orc-assinatura">
          <div className="orc-assinatura__linha">
            <div className="orc-assinatura__slot">
              <div className="orc-assinatura__traço" />
              <span>Fornecedor</span>
            </div>
            <div className="orc-assinatura__slot">
              <div className="orc-assinatura__traço" />
              <span>Cliente</span>
            </div>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <div className="orc-footer">
          <button className="orc-btn-export" onClick={handlePrint}>
            🖨 Imprimir / Salvar PDF
          </button>
          <p className="orc-footer__hint">
            As imagens dos produtos aparecem no PDF gerado
          </p>
        </div>

      </div>
    </div>
  );
}




{/*import '../css/CadastroPro.css';
import React, { useContext, useEffect } from 'react';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Logo from '../Imagens/LogoKasaLeveBranca.png';
import { AuthContext } from "./Context/AuthContext";

function CradastroPro() {
    const { loggedin } = useContext(AuthContext);
    const [produto, setProduto] = React.useState([]);

    async function getProduto() {
        await fetch('https://fakestoreapi.com/products', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => {
                setProduto(json);
            })

            .catch(err => console.log(err))
    }

    useEffect(() => {
        getProduto();
    }, []);

    if (!loggedin) {
        return (
            <div className="body">
                <BTNVolta />
                <h2>Você precisa estar logado para acessar esta página.</h2>
            </div>

        );
    }

    return (
        <>
            <div className="CadastroPro">
                <div><MenuPage /></div>
                <div><BTNVolta /></div>
                <div className='Produto'>
                    <div className='ConteudiProduto'>
                        <div className='PR  FotoProduto FotoProdtText'> <h3>Foto</h3></div>
                        <hr />
                        <div className='PR ProdutoNameText'>
                            <h3>Nome do Cliente:</h3>
                        </div>
                        <hr />
                        <div className='PR PriceText'>
                            <h3>Preço</h3>
                        </div>
                        <hr />
                        <div className='PR DescricaoText'>
                            <h3>Descricao</h3>
                        </div>
                        <hr />
                        <div className='Btn321Produto'>
                            <h2></h2>
                        </div>
                    </div>
                    {produto.map((item) => (
                        <div className='ConteudoProdutoApi' key={item.id}>
                            <div className=' FotoProduto FotoProdtText'>  <img src={Logo} alt="Logo" className="ImgProdct" /> </div>
                            <hr />
                            <div className='PR ProdutoNamePro ProdutoNameText'>{item.title} </div>
                            <hr />
                            <div className='PR Price PriceText'> {item.price} </div>
                            <hr />
                            <div className='PR DescricaoText DescricaoPro'> {item.description} </div>
                            <hr />
                            <div className='Btn321Produto'>
                                <button className='BTNCP DE'>Detalhes</button>
                                <button className='BTNCP ED'>Editar</button>
                                <button className='BTNCP EX'>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CradastroPro;*/}