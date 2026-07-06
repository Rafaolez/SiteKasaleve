
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'; // Adicione o useContext aqui
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta"; // Garanta que este import exista para a etapa de seleção
import { AuthContext } from './Context/AuthContext'; // Adicione esta linha


// Utils & Helpers
import { 
  DADOS_EMPRESA, 
  API_CLIENTES, 
  PERFIS_PRECO, 
  FRETE_PERCENT, 
  ehRegiaoSemFrete, 
  fmtBRL, 
  gerarNumero, 
  ITEM_VAZIO, 
  CLIENTE_VAZIO 
} from '../utils/orcamentoHelpers';
import { handleExportar } from '../utils/exportarOrcamento';

// Assets
import ProdutosAPILocal from '../assets/ProdutosAPILocal';
import ProdutosApiLocalLojista from '../assets/ProdutosApiLocalLojista';

// Componentes
import TelaBloqueadaOrcamento from '../components/Orcamneto/TelaBloqueadaOrcamento';
import ModalSeletorProduto from '../components/Orcamneto/ModalSeletorProduto';
import EtapaNovoCliente from '../components/Orcamneto/EtapaNovoCliente';
import ItemRow from '../components/Orcamneto/ItemRow';


export default function TelaOrcamento({ clienteInicial, clienteExistente, onVoltar }) {
  // ─── ESTADOS ───
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

  // ─── EFEITOS ───
  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  useEffect(() => { 
    setItens([ITEM_VAZIO()]); 
  }, [perfilId]);

  // ─── CALLBACKS DE MANIPULAÇÃO ───
  const setDado = useCallback((field) => (e) => {
    setDadosCliente(p => ({ ...p, [field]: e.target.value }));
  }, []);

  const addItem = useCallback(() => setItens(p => [...p, ITEM_VAZIO()]), []);
  
  const removeItem = useCallback((id) => setItens(p => p.filter(i => i.id !== id)), []);
  
  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => item.id !== id ? item : { ...item, [field]: value }));
  }, []);

  const selecionarProdutoParaItem = useCallback((dados) => {
    if (!editandoItemId) return;
    setItens(prev => prev.map(item => {
      if (item.id !== editandoItemId) return item;
      const descontoAtual = item.descontoItem || 0;
      return { ...item, ...dados, descontoItem: descontoAtual };
    }));
    setEditandoItemId(null);
  }, [editandoItemId]);

  const abrirModalPara = useCallback((id) => setEditandoItemId(id), []);

  const getUnitario = useCallback((item) => {
    const base = item.unitarioPadrao || 0;
    if (item.descontoItem > 0 && item.descontoItem <= 100) {
      return Math.round(base * (1 - item.descontoItem / 100) * 100) / 100;
    }
    return base;
  }, []);

  // ─── CÁLCULOS ───
  const { totalProdutos, semFrete, valorFrete, valorDesconto, totalGeral } = useMemo(() => {
    const total = itens.reduce((acc, i) => {
        const unit = getUnitario(i);
        return acc + (Number(i.qtd) || 0) * unit;
    }, 0);
    const sf = ehRegiaoSemFrete(dadosCliente.cidade);
    const frete = sf ? 0 : total * FRETE_PERCENT;
    const desc = (descontoPerc > 0 && descontoPerc <= 100) ? total * (descontoPerc / 100) : 0;
    const subtotal = total - desc;
    return { 
      totalProdutos: total, 
      semFrete: sf, 
      valorFrete: frete, 
      valorDesconto: desc, 
      totalGeral: subtotal + frete 
    };
  }, [itens, dadosCliente.cidade, descontoPerc, getUnitario]);

  const listaAtual = useMemo(() => 
    perfilId === 'lojista' ? ProdutosApiLocalLojista : ProdutosAPILocal,
  [perfilId]);
  
  const itemEditando = useMemo(
    () => editandoItemId ? itens.find(i => i.id === editandoItemId) : null,
    [editandoItemId, itens]
  );

  const exportar = useCallback(() => handleExportar({
    dataEmissao,
    dadosCliente,
    itens,
    getUnitario,
    totalGeral,
    valorFrete,
    valorDesconto,
    descontoPerc,
    semFrete,
    observacoes,
    numero
  }), [dataEmissao, dadosCliente, itens, getUnitario, totalGeral, valorFrete, valorDesconto, descontoPerc, semFrete, observacoes, numero]);

  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <button className="orc-back-link" onClick={onVoltar}>← Voltar</button>

        {/* CABEÇALHO */}
        <div className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">kasaleve<span className="orc-logo__dot">.</span></span>
            <span className="orc-logo__tag">projeto • conforto</span>
            <div className="orc-logo__underline"></div>
          </div>
          <div className="orc-empresa-info">
            <p>{DADOS_EMPRESA.razaoSocial}</p>
            <p>{DADOS_EMPRESA.endereco}</p>
            <p><a href={`https://${DADOS_EMPRESA.site}`} className="orc-empresa-info__link" target="_blank" rel="noreferrer">{DADOS_EMPRESA.site}</a></p>
            <p>{DADOS_EMPRESA.telefone}</p>
          </div>
        </div>

        <div className="orc-titulo-row">
          <span className="orc-titulo-orcamento">ORÇAMENTO</span>
          <span className="orc-enviado-em">Enviado em: <strong>{dataEmissao}</strong></span>
        </div>

        {/* PERFIL DE PREÇO */}
        <div className="orc-perfil-section">
          <span className="orc-perfil-label">Tabela de preço:</span>
          <div className="orc-perfil-btns">
            {PERFIS_PRECO.map(pf => (
              <button
                key={pf.id}
                onClick={() => setPerfilId(pf.id)}
                className={`orc-perfil-btn${perfilId === pf.id ? ' orc-perfil-btn--ativo' : ''}`}
              >
                {pf.label}
                {pf.id === 'lojista' && <span className="orc-perfil-badge">ESPECIAL</span>}
              </button>
            ))}
          </div>
          {perfilId === 'lojista' && <span className="orc-perfil-hint">✓ Preços exclusivos para lojistas aplicados</span>}
        </div>

        {/* CLIENTE */}
        <EtapaNovoCliente 
          dadosCliente={dadosCliente}
          setDado={setDado}
          clienteExistente={clienteExistente}
          clienteId={clienteId}
          setClienteId={setClienteId}
          clientes={clientes}
        />

        {/* TABELA DE ITENS */}
        <div className="orc-section">
          <table className="orc-table">
            <thead>
              <tr>
                <th className="center col-img">Img</th>
                <th className="col-item">Item</th>
                <th className="col-desc">Descrição</th>
                <th className="center col-qtd">Qtd</th>
                <th className="center col-desc-item">Desc.</th>
                <th className="right col-unit">Valor Unit.</th>
                <th className="right col-total">Total</th>
                <th className="center col-del"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  unitario={getUnitario(item)}
                  onAbrirModal={abrirModalPara}
                  onUpdateItem={updateItem}
                  onRemoveItem={removeItem}
                  isLast={idx === itens.length - 1}
                />
              ))}
            </tbody>
          </table>
          <button className="orc-btn-add" onClick={addItem}>+ Adicionar item</button>
        </div>

        {/* RESUMO DE VALORES */}
        <div className="orc-resumo">
          <div className="orc-resumo__header">Resumo de Valores</div>
          
          <div className="orc-resumo__row orc-resumo__row--alt">
            <span className="orc-resumo__label">Subtotal Produtos</span>
            <span className="orc-resumo__valor">{fmtBRL(totalProdutos)}</span>
          </div>

          <div className="orc-resumo__row">
            <span className="orc-resumo__label">
              Desconto
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={descontoPerc || ''}
                onChange={e => setDescontoPerc(Math.min(100, Math.max(0, Number(e.target.value))))}
                placeholder="0"
                className="orc-resumo__desc-input"
              />
              <span className="orc-resumo__desc-pct">%</span>
            </span>
            <span className="orc-resumo__desc-valor">
              {descontoPerc > 0 ? `- ${fmtBRL(valorDesconto)}` : '—'}
            </span>
          </div>

          <div className="orc-resumo__row orc-resumo__row--alt">
            <span className="orc-resumo__label">Frete</span>
            {semFrete ? (
              <span className="orc-resumo__frete-isenso">ISENTO</span>
            ) : (
              <span className="orc-resumo__valor">{fmtBRL(valorFrete)}</span>
            )}
          </div>

          <div className="orc-resumo__row orc-resumo__row--total">
            <span className="orc-resumo__label">Total Geral</span>
            <span className="orc-resumo__valor">{fmtBRL(totalGeral)}</span>
          </div>
          
          <div className="orc-resumo__validade">Orçamento válido por 5 dias úteis.</div>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="orc-section">
          <label className="orc-section-title">Observações Específicas:</label>
          <textarea
            className="orc-textarea"
            value={observacoes}
            onChange={e => setObs(e.target.value)}
            placeholder="Ex: Condições de pagamento, prazos de entrega específicos, etc..."
          />
        </div>

        {/* AÇÕES FINAIS */}
        <div className="orc-final-actions">
          <button className="orc-btn-export" onClick={exportar}>
            💾 Gerar Orçamento (PDF/DOCX)
          </button>
        </div>

        <div className="orc-footer-brand">
          <p>Obrigado pela preferência!</p>
          <div className="orc-footer-line"></div>
        </div>
      </div>

      <ModalSeletorProduto
        aberto={!!editandoItemId}
        onFechar={() => setEditandoItemId(null)}
        onSelecionar={selecionarProdutoParaItem}
        itemInicial={itemEditando}
        listaProdutos={listaAtual}
      />
    </div>
    
  );
  
}
