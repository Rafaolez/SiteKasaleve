import React, { useState, useEffect, useCallback } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";

// ─────────────────────────────────────────
// MOCK API — substitua pelas chamadas reais
// ─────────────────────────────────────────
//isos vai sari so para testar a logica 
const API_CLIENTES = [
  { id: 1, nome: 'João Silva', endereco: 'Rua das Flores, 123', cidade: 'São Paulo - SP', cpf: '123.456.789-00', ie: '1234567890' },
  { id: 2, nome: 'Maria Souza', endereco: 'Av. Brasil, 456', cidade: 'Campinas - SP', cpf: '987.654.321-00', ie: '0987654321' },
  { id: 3, nome: 'Pedro Oliveira', endereco: 'Rua do Comércio, 789', cidade: 'Ribeirão Preto - SP', cpf: '456.789.123-00', ie: '4567891230' },
];
//isos vai sari so para testar a logica 
const API_PRODUTOS = [
  { id: 1, nome: 'Mesa de Centro Alumínio', preco: 1290.00,  },
  { id: 2, nome: 'Sofá Náutico 3 Lugares', preco: 3890.00 },
  { id: 3, nome: 'Chaise Lounge Premium', preco: 2450.00 },
  { id: 4, nome: 'Espreguiçadeira Slim', preco: 1780.00 },
  { id: 5, nome: 'Banqueta Bar Alumínio', preco: 890.00 },
  { id: 6, nome: 'Ombrelone 3m Articulado', preco: 1650.00 },
  { id: 7, nome: 'Poltrona Bistro', preco: 980.00 },
  { id: 8, nome: 'Tapete Exterior 2x3m', preco: 750.00 },
];



const FRETE_PERCENT = 0.085;

const ITEM_VAZIO = { id: Date.now(), produtoId: '', descricao: '', qtd: 1, unitario: 0 };

const fmtBRL = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const gerarNumero = () =>
  `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────
export default function Orcamento() {

  const [produto, setProduto] = useState([]);
    async function getProduto() {
            try {
                const res = await fetch('https://fakestoreapi.com/products');
                const json = await res.json();
                setProduto(json);
            } catch (err) {
                console.log(err);
            }
        }
    
        useEffect(() => { getProduto(); }, []);


  // --- Estado global ---
  const [numero] = useState(gerarNumero);
  const [dataEmissao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [validade, setValidade] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [observacoes, setObs] = useState('');
  const [condicoes, setCondicoes] = useState('À vista ou 50% + 50% na entrega.');

  // --- Clientes ---
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [cliente, setCliente] = useState(null);

  // --- Produtos ---
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }]);

  // --- Exportação ---
  const [exportando, setExportando] = useState(false);

  // ── Simula fetch de clientes ──
  useEffect(() => {
    setTimeout(() => setClientes(API_CLIENTES), 300);
  }, []);

  // ── Simula fetch de produtos ──
  useEffect(() => {
    setTimeout(() => setProdutos(API_PRODUTOS), 300);
  }, []);

  // ── Atualiza dados do cliente ──
  useEffect(() => {
    const c = clientes.find((c) => c.id === Number(clienteId)) || null;
    setCliente(c);
  }, [clienteId, clientes]);

  // ──────────────────────────────
  // Itens helpers
  // ──────────────────────────────
  const addItem = () =>
    setItens((prev) => [...prev, { ...ITEM_VAZIO, id: Date.now() }]);

  const removeItem = (id) =>
    setItens((prev) => prev.filter((i) => i.id !== id));

  const updateItem = useCallback((id, field, value) => {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'produtoId') {
          const p = produtos.find((p) => p.id === Number(value));
          return { ...item, produtoId: value, unitario: p ? p.preco : 0 };
        }
        return { ...item, [field]: value };
      })
    );
  }, [produtos]);

  // ──────────────────────────────
  // Cálculos
  // ──────────────────────────────
  const totalItens = itens.reduce(
    (acc, i) => acc + Number(i.qtd) * Number(i.unitario), 0
  );
  const frete = totalItens * FRETE_PERCENT;
  const totalFinal = totalItens + frete;

  // ──────────────────────────────
  // Exportação
  // ──────────────────────────────
  const handleExportar = async () => {
    const tipo = window.confirm(
      'Clique em OK para exportar como PDF\nClique em Cancelar para exportar como DOCX'
    )
      ? 'pdf'
      : 'docx';

    setExportando(true);
    try {
      if (tipo === 'pdf') await exportarPDF();
      else await exportarDOCX();
    } finally {
      setExportando(false);
    }
  };

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const W = 210;
    let y = 20;
    const L = 15;

    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('KASALEVE', W / 2, y, { align: 'center' });
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('projeto  •  conforto', W / 2, y, { align: 'center' });
    y += 10;

    doc.setLineWidth(0.4);
    doc.line(L, y, W - L, y);
    y += 6;

    // Número / Data
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`ORÇAMENTO Nº ${numero}`, L, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Emissão: ${dataEmissao}`, W - L, y, { align: 'right' });
    y += 5;
    if (validade) doc.text(`Válido até: ${validade}`, W - L, y, { align: 'right' });
    if (vendedor) doc.text(`Vendedor: ${vendedor}`, L, y);
    y += 8;

    doc.line(L, y, W - L, y);
    y += 6;

    // Cliente
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS DO CLIENTE', L, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    if (cliente) {
      doc.text(`Nome: ${cliente.nome}`, L, y); y += 5;
      doc.text(`Endereço: ${cliente.endereco}`, L, y); y += 5;
      doc.text(`Cidade: ${cliente.cidade}`, L, y); y += 5;
      doc.text(`CPF/CNPJ: ${cliente.cpf}    IE: ${cliente.ie}`, L, y); y += 5;
    }
    y += 4;
    doc.line(L, y, W - L, y);
    y += 6;

    // Itens — cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.text('Nº', L, y);
    doc.text('Produto', L + 10, y);
    doc.text('Cores/Desc.', L + 80, y);
    doc.text('Qtd', L + 130, y);
    doc.text('Unit.', L + 148, y);
    doc.text('Total', L + 168, y);
    y += 2;
    doc.line(L, y, W - L, y);
    y += 5;
    doc.setFont('helvetica', 'normal');

    itens.forEach((item, idx) => {
      const prod = produtos.find((p) => p.id === Number(item.produtoId));
      const total = Number(item.qtd) * Number(item.unitario);
      doc.text(String(idx + 1), L, y);
      doc.text(prod ? prod.nome.slice(0, 30) : '-', L + 10, y);
      doc.text((item.descricao || '-').slice(0, 25), L + 80, y);
      doc.text(String(item.qtd), L + 130, y);
      doc.text(fmtBRL(item.unitario), L + 140, y);
      doc.text(fmtBRL(total), L + 163, y);
      y += 6;
    });

    y += 2;
    doc.line(L, y, W - L, y);
    y += 6;

    // Totais
    const colLabel = W - 60;
    const colValue = W - L;
    doc.text('Total dos Itens:', colLabel, y);
    doc.text(fmtBRL(totalItens), colValue, y, { align: 'right' }); y += 6;
    doc.text(`Frete (8,5%):`, colLabel, y);
    doc.text(fmtBRL(frete), colValue, y, { align: 'right' }); y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL GERAL:', colLabel, y);
    doc.text(fmtBRL(totalFinal), colValue, y, { align: 'right' }); y += 8;

    doc.setFont('helvetica', 'normal');
    doc.line(L, y, W - L, y); y += 6;

    // Condições
    doc.setFont('helvetica', 'bold');
    doc.text('CONDIÇÕES DE PAGAMENTO', L, y); y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(condicoes, L, y, { maxWidth: W - 30 }); y += 10;

    if (observacoes) {
      doc.setFont('helvetica', 'bold');
      doc.text('OBSERVAÇÕES', L, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(observacoes, L, y, { maxWidth: W - 30 });
    }

    doc.save(`Orcamento_${numero}.pdf`);
  };

  const exportarDOCX = async () => {
    const {
      Document, Packer, Paragraph, Table, TableRow, TableCell,
      TextRun, AlignmentType, WidthType, BorderStyle, HeadingLevel,
    } = await import('docx');

    const bold = (text, size = 22) => new TextRun({ text, bold: true, size });
    const normal = (text, size = 20) => new TextRun({ text, bold: false, size });
    const p = (children, alignment = AlignmentType.LEFT) =>
      new Paragraph({ children, alignment });

    const cellBorder = {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    };
    const cell = (text, opts = {}) => new TableCell({
      borders: cellBorder,
      children: [p([opts.bold ? bold(text, opts.size || 20) : normal(text, opts.size || 20)])],
      width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    });


    
    // Linhas de itens
    const itemRows = itens.map((item, idx) => {
      const prod = produtos.find((p) => p.id === Number(item.produtoId));
      const total = Number(item.qtd) * Number(item.unitario);
      return new TableRow({
        children: [
          cell(String(idx + 1)),
          cell(prod ? prod.nome : '-'),
          cell(item.descricao || '-'),
          cell(String(item.qtd)),
          cell(fmtBRL(item.unitario)),
          cell(fmtBRL(total)),
        ]
      });
    });

    const doc = new Document({
      sections: [{
        children: [
          // Cabeçalho
          p([bold('KASALEVE', 36)], AlignmentType.CENTER),
          p([normal('projeto  •  conforto', 22)], AlignmentType.CENTER),
          p([]),
          p([bold(`ORÇAMENTO Nº ${numero}  |  Emissão: ${dataEmissao}`)]),
          //validade ? p([normal(`Válido até: ${validade}`)]) : p([]),
          vendedor ? p([normal(`Vendedor: ${vendedor}`)]) : p([]),
          p([]),

          // Cliente
          p([bold('DADOS DO CLIENTE')]),
          ...(cliente ? [
            p([normal(`Nome: ${cliente.nome}`)]),
            p([normal(`Endereço: ${cliente.endereco}`)]),
            p([normal(`Cidade: ${cliente.cidade}`)]),
            p([normal(`CPF/CNPJ: ${cliente.cpf}   IE: ${cliente.ie}`)]),
          ] : [p([normal('Nenhum cliente selecionado.')])]),
          p([]),

          // Tabela de itens
          p([bold('ITENS DO ORÇAMENTO')]),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true, children: [
                  cell('Nº', { bold: true }),
                  cell('Produto', { bold: true }),
                  cell('Cores/Desc.', { bold: true }),
                  cell('Qtd', { bold: true }),
                  cell('Unit.', { bold: true }),
                  cell('Total', { bold: true }),
                ]
              }),
              ...itemRows,
            ],
          }),
          p([]),

          // Totais
          p([normal(`Total dos Itens: ${fmtBRL(totalItens)}`)], AlignmentType.RIGHT),
          p([normal(`Frete (8,5%): ${fmtBRL(frete)}`)], AlignmentType.RIGHT),
          p([bold(`TOTAL GERAL: ${fmtBRL(totalFinal)}`, 24)], AlignmentType.RIGHT),
          p([]),

          // Condições
          p([bold('CONDIÇÕES DE PAGAMENTO')]),
          p([normal(condicoes)]),
          p([]),

          // Observações
          ...(observacoes ? [p([bold('OBSERVAÇÕES')]), p([normal(observacoes)])] : []),
          p([]),
          p([normal('_______________________________')], AlignmentType.CENTER),
          p([normal('Assinatura / Kasaleve')], AlignmentType.CENTER),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orcamento_${numero}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ──────────────────────────────
  // RENDER
  // ──────────────────────────────
  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <BTNVolta />
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
            <label>Data</label>
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
          <h2 className="orc-section__title">DADOS DO CLIENTE</h2>
          <div className="orc-cliente-grid">
            <div className="orc-field orc-field--full">
              <label>Cliente</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">— Selecione o cliente —</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="orc-field orc-field--full">
              <label>Endereço</label>
              <input readOnly value={cliente?.endereco || ''} placeholder="Preenchido automaticamente" />
            </div>
            <div className="orc-field">
              <label>Cidade / UF</label>
              <input readOnly value={cliente?.cidade || ''} placeholder="—" />
            </div>
            <div className="orc-field">
              <label>CPF / CNPJ</label>
              <input readOnly value={cliente?.cpf || ''} placeholder="—" />
            </div>
            <div className="orc-field">
              <label>Inscrição Estadual</label>
              <input readOnly value={cliente?.ie || ''} placeholder="—" />
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
                      <select
                        value={item.produtoId}
                        onChange={e => updateItem(item.id, 'produtoId', e.target.value)}
                      >
                        <option value="">— Selecione —</option>
                        {produtos.map(p => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </td>
                    <td className="col-desc">
                      <input
                        type="text"
                        placeholder="Ex: corda branca / tecido areia"
                        value={item.descricao}
                        onChange={e => updateItem(item.id, 'descricao', e.target.value)}
                      />
                    </td>
                    <td className="col-qtd">
                      <input
                        type="number" min="1"
                        value={item.qtd}
                        onChange={e => updateItem(item.id, 'qtd', e.target.value)}
                      />
                    </td>
                    <td className="col-unit right">
                      {item.unitario > 0 ? fmtBRL(item.unitario) : '—'}
                    </td>
                    <td className="col-total right">
                      {totalItem > 0 ? fmtBRL(totalItem) : '—'}
                    </td>
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
          <div className="orc-totais__row">
            <span>Valor Total dos Itens</span>
            <span>{fmtBRL(totalItens)}</span>
          </div>
          <div className="orc-totais__row">
            <span>Frete (8,5%)</span>
            <span>{fmtBRL(frete)}</span>
          </div>
          <div className="orc-totais__row orc-totais__row--final">
            <span>TOTAL GERAL (Produtos + Frete)</span>
            <span>{fmtBRL(totalFinal)}</span>
          </div>
        </section>

        <hr className="orc-divider" />

        {/* ── CONDIÇÕES E OBSERVAÇÕES ── */}
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
            <div className="orc-assinatura__slot">
              <div className="orc-assinatura__traço" />
              <span>Assinatura do Cliente</span>
            </div>
            <div className="orc-assinatura__slot">
              <div className="orc-assinatura__traço" />
              <span>Kasaleve — Vendedor</span>
            </div>
          </div>
        </div>

        {/* ── EXPORTAR ── */}
        <div className="orc-footer">
          <button
            className={`orc-btn-export ${exportando ? 'orc-btn-export--loading' : ''}`}
            onClick={handleExportar}
            disabled={exportando}
          >
            {exportando ? '⏳ Gerando arquivo...' : '📄 Exportar Orçamento'}
          </button>
          <p className="orc-footer__hint">Você escolherá entre PDF e DOCX ao clicar.</p>
        </div>

      </div>
    </div>
  );
}