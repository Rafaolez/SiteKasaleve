import React, { useState, useEffect, useCallback } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";

// ─── mock data ────────────────────────────────────────────
const API_CLIENTES = [
  { id: 1, nome: 'João Silva', telefone: '(11) 99999-1111', endereco: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01310-100', cpf: '123.456.789-00', ie: '1234567890' },
  { id: 2, nome: 'Maria Souza', telefone: '(19) 98888-2222', endereco: 'Av. Brasil, 456', cidade: 'Campinas', estado: 'SP', cep: '13010-050', cpf: '987.654.321-00', ie: '0987654321' },
  { id: 3, nome: 'Pedro Oliveira', telefone: '(16) 97777-3333', endereco: 'Rua do Comércio, 789', cidade: 'Ribeirão Preto', estado: 'SP', cep: '14010-040', cpf: '456.789.123-00', ie: '4567891230' },
];

const API_PRODUTOS = [
  { id: 1, nome: 'Mesa de Centro Alumínio', preco: 1290.00 },
  { id: 2, nome: 'Sofá Náutico 3 Lugares', preco: 3890.00 },
  { id: 3, nome: 'Chaise Lounge Premium', preco: 2450.00 },
  { id: 4, nome: 'Espreguiçadeira Slim', preco: 1780.00 },
  { id: 5, nome: 'Banqueta Bar Alumínio', preco: 890.00 },
  { id: 6, nome: 'Ombrelone 3m Articulado', preco: 1650.00 },
  { id: 7, nome: 'Poltrona Bistro', preco: 980.00 },
  { id: 8, nome: 'Tapete Exterior 2x3m', preco: 750.00 },
];

const FRETE_PERCENT = 0.085;
const fmtBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const gerarNumero = () => `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const ITEM_VAZIO = () => ({ id: Date.now(), produtoId: '', descricao: '', qtd: 1, unitario: 0 });

const CLIENTE_VAZIO = { nome: '', telefone: '', email: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cpf: '', ie: '' };

// ─── busca CEP via ViaCEP ─────────────────────────────────
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

// ════════════════════════════════════════════════════════
//  ETAPA 0 — "O cliente já existe?"
// ════════════════════════════════════════════════════════
function EtapaClienteExiste({ onSim, onNao }) {
  return (
    <div className="orc-bg">
      <BTNVolta />
      <div className="orc-gate">
        <div className="orc-gate__logo">
          <span className="orc-logo__name">KASALEVE</span>
          <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
        </div>
        <div className="orc-gate__card">
          <div className="orc-gate__icon">📋</div>
          <h2 className="orc-gate__title">Novo Orçamento</h2>
          <p className="orc-gate__question">O cliente já está cadastrado?</p>
          <div className="orc-gate__btns">
            <button className="orc-gate__btn orc-gate__btn--sim" onClick={onSim}>
              ✅ Sim, já é cadastrado
            </button>
            <button className="orc-gate__btn orc-gate__btn--nao" onClick={onNao}>
              ➕ Não, é novo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  ETAPA 1B — Formulário de novo cliente
// ════════════════════════════════════════════════════════
function EtapaNovoCliente({ onContinuar, onVoltar }) {
  const [form, setForm] = useState(CLIENTE_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepErro, setCepErro] = useState('');
  const [salvar, setSalvar] = useState(null); // null | true | false
  const [salvando, setSalvando] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

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

  function handleContinuar() {
    onContinuar(form, salvar);
  }

  // Se ainda não respondeu sobre salvar, mostra pergunta
  if (salvar === null) {
    return (
      <div className="orc-bg">
        <div className="orc-paper orc-paper--narrow">
          <button className="orc-back-link" onClick={onVoltar}>← Voltar</button>

          <header className="orc-header">
            <div className="orc-logo">
              <span className="orc-logo__name">KASALEVE</span>
              <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
            </div>
            <p className="orc-header__subtitle">Dados do novo cliente</p>
          </header>

          <hr className="orc-divider" />

          <section className="orc-section">
            <h2 className="orc-section__title">INFORMAÇÕES DO CLIENTE</h2>
            <p className="orc-section__hint">Todos os campos são opcionais. Preencha o que tiver disponível.</p>

            <div className="orc-novo-grid">
              <div className="orc-field orc-field--col2">
                <label>Nome completo</label>
                <input placeholder="Ex: João da Silva" value={form.nome} onChange={set('nome')} />
              </div>
              <div className="orc-field">
                <label>Telefone</label>
                <input placeholder="(11) 99999-0000" value={form.telefone} onChange={set('telefone')} />
              </div>
              <div className="orc-field">
                <label>E-mail</label>
                <input placeholder="email@exemplo.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="orc-field">
                <label>CPF / CNPJ</label>
                <input placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} />
              </div>
              <div className="orc-field">
                <label>Inscrição Estadual</label>
                <input placeholder="—" value={form.ie} onChange={set('ie')} />
              </div>
            </div>

            <hr className="orc-divider" />
            <h2 className="orc-section__title">ENDEREÇO</h2>

            <div className="orc-novo-grid">
              <div className="orc-field">
                <label>
                  CEP
                  {buscandoCep && <span className="orc-cep-spinner"> ⏳ buscando...</span>}
                </label>
                <input
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={handleCEP}
                  maxLength={9}
                />
                {cepErro && <span className="orc-cep-erro">{cepErro}</span>}
              </div>
              <div className="orc-field orc-field--col2">
                <label>Logradouro</label>
                <input placeholder="Rua, Av..." value={form.endereco} onChange={set('endereco')} />
              </div>
              <div className="orc-field">
                <label>Número</label>
                <input placeholder="123" value={form.numero} onChange={set('numero')} />
              </div>
              <div className="orc-field">
                <label>Complemento</label>
                <input placeholder="Apto, Sala..." value={form.complemento} onChange={set('complemento')} />
              </div>
              <div className="orc-field">
                <label>Bairro</label>
                <input placeholder="—" value={form.bairro} onChange={set('bairro')} />
              </div>
              <div className="orc-field">
                <label>Cidade</label>
                <input placeholder="—" value={form.cidade} onChange={set('cidade')} />
              </div>
              <div className="orc-field">
                <label>Estado</label>
                <input placeholder="SP" maxLength={2} value={form.estado} onChange={set('estado')} />
              </div>
            </div>
          </section>

          <hr className="orc-divider" />

          {/* Pergunta: salvar? */}
          <div className="orc-salvar-box">
            <div className="orc-salvar-box__icon">💾</div>
            <div>
              <p className="orc-salvar-box__title">Deseja salvar este cliente?</p>
              <p className="orc-salvar-box__sub">Você poderá encontrá-lo rapidamente em futuros orçamentos.</p>
            </div>
            <div className="orc-salvar-box__btns">
              <button className="orc-salvar-btn orc-salvar-btn--sim" onClick={() => setSalvar(true)}>
                ✅ Salvar cliente
              </button>
              <button className="orc-salvar-btn orc-salvar-btn--nao" onClick={() => setSalvar(false)}>
                ➡ Só orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmação de salvar
  return (
    <div className="orc-bg">
      <div className="orc-gate">
        <div className="orc-gate__card orc-gate__card--confirm">
          {salvar ? (
            <>
              <div className="orc-gate__icon">✅</div>
              <h2 className="orc-gate__title">Cliente será salvo</h2>
              <p className="orc-gate__question">
                {form.nome || 'Cliente'} foi adicionado à base de clientes.
              </p>
            </>
          ) : (
            <>
              <div className="orc-gate__icon">📄</div>
              <h2 className="orc-gate__title">Apenas orçamento</h2>
              <p className="orc-gate__question">Os dados não serão salvos no cadastro.</p>
            </>
          )}
          <div className="orc-gate__btns">
            <button className="orc-gate__btn orc-gate__btn--sim" onClick={handleContinuar}>
              Continuar para o orçamento →
            </button>
            <button className="orc-gate__btn orc-gate__btn--ghost" onClick={() => setSalvar(null)}>
              ← Voltar e editar dados
            </button>
          </div>
        </div>
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
  const [validade, setValidade] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [observacoes, setObs] = useState('');
  const [condicoes, setCondicoes] = useState('À vista ou 50% + 50% na entrega.');
  const [exportando, setExportando] = useState(false);

  // ── Clientes (só se vier do fluxo "Sim") ──
  const [clientes] = useState(API_CLIENTES);
  const [clienteId, setClienteId] = useState(clienteExistente ? String(clienteExistente.id) : '');
  const [editando, setEditando] = useState(false);

  // ── Dados do cliente (editável) ──
  const clienteBase = clienteExistente
    ? clientes.find(c => c.id === clienteExistente.id) || CLIENTE_VAZIO
    : clienteInicial || CLIENTE_VAZIO;

  const [dadosCliente, setDadosCliente] = useState(clienteBase);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepErro, setCepErro] = useState('');

  // Quando seleciona cliente diferente
  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  const setDado = (field) => (e) =>
    setDadosCliente(p => ({ ...p, [field]: e.target.value }));

  async function handleCEPEdit(e) {
    const val = e.target.value;
    setDadosCliente(p => ({ ...p, cep: val }));
    setCepErro('');
    if (val.replace(/\D/g, '').length === 8) {
      setBuscandoCep(true);
      const dados = await buscarCEP(val);
      setBuscandoCep(false);
      if (dados) setDadosCliente(p => ({ ...p, ...dados }));
      else setCepErro('CEP não encontrado.');
    }
  }

  // ── Produtos ──
  const [produtos] = useState(API_PRODUTOS);
  const [itens, setItens] = useState([ITEM_VAZIO()]);

  const addItem = () => setItens(p => [...p, ITEM_VAZIO()]);
  const removeItem = (id) => setItens(p => p.filter(i => i.id !== id));
  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (field === 'produtoId') {
        const p = produtos.find(p => p.id === Number(value));
        return { ...item, produtoId: value, unitario: p ? p.preco : 0 };
      }
      return { ...item, [field]: value };
    }));
  }, [produtos]);

  // ── Cálculos ──
  const totalItens = itens.reduce((acc, i) => acc + Number(i.qtd) * Number(i.unitario), 0);
  const frete = totalItens * FRETE_PERCENT;
  const totalFinal = totalItens + frete;

  // ── Exportação ──
  const handleExportar = async () => {
    const tipo = window.confirm(
      'Clique em OK para exportar como PDF\nClique em Cancelar para exportar como DOCX'
    ) ? 'pdf' : 'docx';
    setExportando(true);
    try {
      tipo === 'pdf' ? await exportarPDF() : await exportarDOCX();
    } finally { setExportando(false); }
  };

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, L = 15; let y = 20;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text('KASALEVE', W / 2, y, { align: 'center' }); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('projeto  •  conforto', W / 2, y, { align: 'center' }); y += 10;
    doc.setLineWidth(0.4); doc.line(L, y, W - L, y); y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text(`ORÇAMENTO Nº ${numero}`, L, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Emissão: ${dataEmissao}`, W - L, y, { align: 'right' }); y += 5;
    if (validade) doc.text(`Válido até: ${validade}`, W - L, y, { align: 'right' });
    if (vendedor) doc.text(`Vendedor: ${vendedor}`, L, y); y += 8;
    doc.line(L, y, W - L, y); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', L, y); y += 6;
    doc.setFont('helvetica', 'normal');
    if (dadosCliente.nome) { doc.text(`Nome: ${dadosCliente.nome}`, L, y); y += 5; }
    if (dadosCliente.endereco) { doc.text(`Endereço: ${dadosCliente.endereco}, ${dadosCliente.numero || ''}`, L, y); y += 5; }
    if (dadosCliente.cidade) { doc.text(`Cidade: ${dadosCliente.cidade} - ${dadosCliente.estado}`, L, y); y += 5; }
    if (dadosCliente.cpf) { doc.text(`CPF/CNPJ: ${dadosCliente.cpf}   IE: ${dadosCliente.ie || ''}`, L, y); y += 5; }
    y += 4; doc.line(L, y, W - L, y); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Nº', L, y); doc.text('Produto', L + 10, y);
    doc.text('Cores/Desc.', L + 80, y); doc.text('Qtd', L + 130, y);
    doc.text('Unit.', L + 148, y); doc.text('Total', L + 168, y);
    y += 2; doc.line(L, y, W - L, y); y += 5;
    doc.setFont('helvetica', 'normal');
    itens.forEach((item, idx) => {
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      const tot = Number(item.qtd) * Number(item.unitario);
      doc.text(String(idx + 1), L, y);
      doc.text(prod ? prod.nome.slice(0, 30) : '-', L + 10, y);
      doc.text((item.descricao || '-').slice(0, 25), L + 80, y);
      doc.text(String(item.qtd), L + 130, y);
      doc.text(fmtBRL(item.unitario), L + 140, y);
      doc.text(fmtBRL(tot), L + 163, y); y += 6;
    });
    y += 2; doc.line(L, y, W - L, y); y += 6;
    const cL = W - 60, cV = W - L;
    doc.text('Total dos Itens:', cL, y); doc.text(fmtBRL(totalItens), cV, y, { align: 'right' }); y += 6;
    doc.text('Frete (8,5%):', cL, y); doc.text(fmtBRL(frete), cV, y, { align: 'right' }); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL GERAL:', cL, y); doc.text(fmtBRL(totalFinal), cV, y, { align: 'right' }); y += 8;
    doc.setFont('helvetica', 'normal'); doc.line(L, y, W - L, y); y += 6;
    doc.setFont('helvetica', 'bold'); doc.text('CONDIÇÕES DE PAGAMENTO', L, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.text(condicoes, L, y, { maxWidth: W - 30 }); y += 10;
    if (observacoes) {
      doc.setFont('helvetica', 'bold'); doc.text('OBSERVAÇÕES', L, y); y += 5;
      doc.setFont('helvetica', 'normal'); doc.text(observacoes, L, y, { maxWidth: W - 30 });
    }
    doc.save(`Orcamento_${numero}.pdf`);
  };

  const exportarDOCX = async () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle } = await import('docx');
    const bold = (t, s = 22) => new TextRun({ text: t, bold: true, size: s });
    const normal = (t, s = 20) => new TextRun({ text: t, bold: false, size: s });
    const p = (ch, al = AlignmentType.LEFT) => new Paragraph({ children: ch, alignment: al });
    const cb = { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }, left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }, right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } };
    const cell = (t, o = {}) => new TableCell({ borders: cb, children: [p([o.bold ? bold(t, o.size || 20) : normal(t, o.size || 20)])] });
    const itemRows = itens.map((item, idx) => {
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      const tot = Number(item.qtd) * Number(item.unitario);
      return new TableRow({ children: [cell(String(idx + 1)), cell(prod ? prod.nome : '-'), cell(item.descricao || '-'), cell(String(item.qtd)), cell(fmtBRL(item.unitario)), cell(fmtBRL(tot))] });
    });
    const doc = new Document({
      sections: [{
        children: [
          p([bold('KASALEVE', 36)], AlignmentType.CENTER),
          p([normal('projeto  •  conforto', 22)], AlignmentType.CENTER), p([]),
          p([bold(`ORÇAMENTO Nº ${numero}  |  Emissão: ${dataEmissao}`)]),
          vendedor ? p([normal(`Vendedor: ${vendedor}`)]) : p([]), p([]),
          p([bold('DADOS DO CLIENTE')]),
          ...(dadosCliente.nome ? [p([normal(`Nome: ${dadosCliente.nome}`)])] : []),
          ...(dadosCliente.endereco ? [p([normal(`Endereço: ${dadosCliente.endereco}, ${dadosCliente.numero || ''}`)])] : []),
          ...(dadosCliente.cidade ? [p([normal(`Cidade: ${dadosCliente.cidade} - ${dadosCliente.estado}`)])] : []),
          ...(dadosCliente.cpf ? [p([normal(`CPF/CNPJ: ${dadosCliente.cpf}   IE: ${dadosCliente.ie || ''}`)])] : []),
          p([]),
          p([bold('ITENS DO ORÇAMENTO')]),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
              new TableRow({ tableHeader: true, children: [cell('Nº', { bold: true }), cell('Produto', { bold: true }), cell('Cores/Desc.', { bold: true }), cell('Qtd', { bold: true }), cell('Unit.', { bold: true }), cell('Total', { bold: true })] }),
              ...itemRows,
            ]
          }), p([]),
          p([normal(`Total dos Itens: ${fmtBRL(totalItens)}`)], AlignmentType.RIGHT),
          p([normal(`Frete (8,5%): ${fmtBRL(frete)}`)], AlignmentType.RIGHT),
          p([bold(`TOTAL GERAL: ${fmtBRL(totalFinal)}`, 24)], AlignmentType.RIGHT), p([]),
          p([bold('CONDIÇÕES DE PAGAMENTO')]), p([normal(condicoes)]), p([]),
          ...(observacoes ? [p([bold('OBSERVAÇÕES')]), p([normal(observacoes)])] : []),
          p([]), p([normal('_______________________________')], AlignmentType.CENTER),
          p([normal('Assinatura / Kasaleve')], AlignmentType.CENTER),
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `Orcamento_${numero}.docx`; a.click();
    URL.revokeObjectURL(url);
  };

  const enderecoCompleto = [dadosCliente.cidade, dadosCliente.estado].filter(Boolean).join(' - ');

  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <button className="orc-back-link" onClick={onVoltar}>← Recomeçar</button>

        {/* ── CABEÇALHO ── */}
        <header className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">KASALEVE</span>
            <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
          </div>
          <div className="orc-header__info">
            <div className="orc-header__num">Orçamento Nº <strong>{numero}</strong></div>
            <div className="orc-header__date">Emissão: {dataEmissao}</div>
          </div>
        </header>

        <hr className="orc-divider" />

        {/* ── METADADOS ── */}
        <section className="orc-meta">
          <div className="orc-field">
            <label>Válido até</label>
            <input type="date" value={validade} onChange={e => setValidade(e.target.value)} />
          </div>
          <div className="orc-field">
            <label>Vendedor / Representante</label>
            <input type="text" placeholder="Nome do vendedor" value={vendedor} onChange={e => setVendedor(e.target.value)} />
          </div>
        </section>

        <hr className="orc-divider" />

        {/* ── CLIENTE ── */}
        <section className="orc-section">
          <div className="orc-section__header">
            <h2 className="orc-section__title">DADOS DO CLIENTE</h2>
            <button
              className={`orc-btn-editar ${editando ? 'orc-btn-editar--on' : ''}`}
              onClick={() => setEditando(v => !v)}
            >
              {editando ? '✓ Concluir edição' : '✏️ Editar dados'}
            </button>
          </div>

          {/* Select cliente (só no fluxo "sim") */}
          {clienteExistente !== null && (
            <div className="orc-field orc-field--full" style={{ marginBottom: 12 }}>
              <label>Selecionar cliente</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">— Selecione —</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="orc-cliente-grid">
            {/* Nome */}
            <div className="orc-field orc-field--full">
              <label>Nome</label>
              <input
                readOnly={!editando}
                value={dadosCliente.nome || ''}
                onChange={setDado('nome')}
                placeholder="—"
                className={editando ? '' : 'orc-readonly'}
              />
            </div>
            {/* Telefone + Email */}
            <div className="orc-field">
              <label>Telefone</label>
              <input readOnly={!editando} value={dadosCliente.telefone || ''} onChange={setDado('telefone')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>E-mail</label>
              <input readOnly={!editando} value={dadosCliente.email || ''} onChange={setDado('email')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            {/* CEP */}
            <div className="orc-field">
              <label>
                CEP {editando && buscandoCep && <span className="orc-cep-spinner"> ⏳</span>}
              </label>
              {editando ? (
                <input value={dadosCliente.cep || ''} onChange={handleCEPEdit} placeholder="00000-000" maxLength={9} />
              ) : (
                <input readOnly value={dadosCliente.cep || ''} placeholder="—" className="orc-readonly" />
              )}
              {cepErro && <span className="orc-cep-erro">{cepErro}</span>}
            </div>
            {/* Endereço */}
            <div className="orc-field orc-field--full">
              <label>Endereço</label>
              <input readOnly={!editando} value={dadosCliente.endereco || ''} onChange={setDado('endereco')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>Número</label>
              <input readOnly={!editando} value={dadosCliente.numero || ''} onChange={setDado('numero')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>Complemento</label>
              <input readOnly={!editando} value={dadosCliente.complemento || ''} onChange={setDado('complemento')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>Bairro</label>
              <input readOnly={!editando} value={dadosCliente.bairro || ''} onChange={setDado('bairro')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>Cidade / UF</label>
              <input readOnly value={enderecoCompleto || dadosCliente.cidade || ''} placeholder="—" className="orc-readonly" />
            </div>
            <div className="orc-field">
              <label>CPF / CNPJ</label>
              <input readOnly={!editando} value={dadosCliente.cpf || ''} onChange={setDado('cpf')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
            <div className="orc-field">
              <label>Inscrição Estadual</label>
              <input readOnly={!editando} value={dadosCliente.ie || ''} onChange={setDado('ie')} placeholder="—" className={editando ? '' : 'orc-readonly'} />
            </div>
          </div>
        </section>

        <hr className="orc-divider" />

        {/* ── ITENS ── */}
        <section className="orc-section">
          <h2 className="orc-section__title">ITENS DO ORÇAMENTO</h2>
          <table className="orc-table">
            <thead>
              <tr>
                <th className="col-num">Nº</th>
                <th className="col-prod">Produto</th>
                <th className="col-desc">Cores / Descrição</th>
                <th className="col-qtd">Qtd</th>
                <th className="col-unit">Valor Unit.</th>
                <th className="col-total">Total</th>
                <th className="col-del"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => {
                const totalItem = Number(item.qtd) * Number(item.unitario);
                return (
                  <tr key={item.id}>
                    <td className="col-num center">{idx + 1}</td>
                    <td className="col-prod">
                      <select value={item.produtoId} onChange={e => updateItem(item.id, 'produtoId', e.target.value)}>
                        <option value="">— Selecione —</option>
                        {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                      </select>
                    </td>
                    <td className="col-desc">
                      <input type="text" placeholder="Ex: corda branca / tecido areia"
                        value={item.descricao}
                        onChange={e => updateItem(item.id, 'descricao', e.target.value)} />
                    </td>
                    <td className="col-qtd">
                      <input type="number" min="1" value={item.qtd}
                        onChange={e => updateItem(item.id, 'qtd', e.target.value)} />
                    </td>
                    <td className="col-unit right">{item.unitario > 0 ? fmtBRL(item.unitario) : '—'}</td>
                    <td className="col-total right">{totalItem > 0 ? fmtBRL(totalItem) : '—'}</td>
                    <td className="col-del center">
                      {itens.length > 1 && (
                        <button className="orc-btn-del" onClick={() => removeItem(item.id)}>✕</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="orc-btn-add" onClick={addItem}>+ Adicionar Item</button>
        </section>

        <hr className="orc-divider" />

        {/* ── TOTAIS ── */}
        <section className="orc-totais">
          <div className="orc-totais__row"><span>Valor Total dos Itens</span><span>{fmtBRL(totalItens)}</span></div>
          <div className="orc-totais__row"><span>Frete (8,5%)</span><span>{fmtBRL(frete)}</span></div>
          <div className="orc-totais__row orc-totais__row--final"><span>TOTAL GERAL (Produtos + Frete)</span><span>{fmtBRL(totalFinal)}</span></div>
        </section>

        <hr className="orc-divider" />

        {/* ── CONDIÇÕES ── */}
        <section className="orc-section orc-two-col">
          <div className="orc-field orc-field--full">
            <label>Condições de Pagamento</label>
            <textarea rows={3} value={condicoes} onChange={e => setCondicoes(e.target.value)} />
          </div>
          <div className="orc-field orc-field--full">
            <label>Observações</label>
            <textarea rows={3} value={observacoes} onChange={e => setObs(e.target.value)} placeholder="Prazo de entrega, detalhes especiais..." />
          </div>
        </section>

        <hr className="orc-divider" />

        {/* ── ASSINATURA ── */}
        <div className="orc-assinatura">
          <div className="orc-assinatura__linha">
            <div className="orc-assinatura__slot"><div className="orc-assinatura__traço" /><span>Assinatura do Cliente</span></div>
            <div className="orc-assinatura__slot"><div className="orc-assinatura__traço" /><span>Kasaleve — Vendedor</span></div>
          </div>
        </div>

        {/* ── EXPORTAR ── */}
        <div className="orc-footer">
          <button className={`orc-btn-export ${exportando ? 'orc-btn-export--loading' : ''}`}
            onClick={handleExportar} disabled={exportando}>
            {exportando ? '⏳ Gerando arquivo...' : '📄 Exportar Orçamento'}
          </button>
          <p className="orc-footer__hint">Você escolherá entre PDF e DOCX ao clicar.</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  RAIZ — controla o fluxo de etapas
// ════════════════════════════════════════════════════════
export default function Orcamento() {
  // etapa: 'gate' | 'novo' | 'orcamento'
  const [etapa, setEtapa] = useState('gate');
  const [clienteInicial, setClienteInicial] = useState(null);
  const [clienteExistente, setClienteExistente] = useState(null); // null = fluxo novo, obj = fluxo sim

  function handleSim() {
    setClienteExistente({});   // sinaliza fluxo "existente"
    setEtapa('orcamento');
  }

  function handleNao() {
    setEtapa('novo');
  }

  function handleNovoClienteContinuar(dados, salvar) {
    setClienteInicial(dados);
    setClienteExistente(null);
    setEtapa('orcamento');
  }

  function handleVoltar() {
    setEtapa('gate');
    setClienteInicial(null);
    setClienteExistente(null);
  }

  if (etapa === 'gate')
    return <EtapaClienteExiste onSim={handleSim} onNao={handleNao} />;

  if (etapa === 'novo')
    return <EtapaNovoCliente onContinuar={handleNovoClienteContinuar} onVoltar={() => setEtapa('gate')} />;

  return (
    <TelaOrcamento
      clienteInicial={clienteInicial}
      clienteExistente={clienteExistente}
      onVoltar={handleVoltar}
    />
  );
}