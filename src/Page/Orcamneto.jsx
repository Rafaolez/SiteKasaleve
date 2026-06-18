import React, { useState, useEffect, useCallback } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";

// ─── MOCK DATA & CONFIG ───────────────────────────────────────
const API_CLIENTES = [
  { id: 1, nome: 'João Silva', telefone: '(11) 99999-1111', endereco: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01310-100', cpf: '123.456.789-00', ie: '1234567890' },
  { id: 2, nome: 'Maria Souza', telefone: '(19) 98888-2222', endereco: 'Av. Brasil, 456', cidade: 'Campinas', estado: 'SP', cep: '13010-050', cpf: '987.654.321-00', ie: '0987654321' },
];

const DADOS_EMPRESA = {
  nome: 'KASALEVE',
  subtitulo: 'PROJETO • CONFORTO',
  cnpj: '00.000.000/0001-00',
  telefone: '(11) 99999-9999',
  email: 'contato@kasaleve.com.br'
};

const FRETE_PERCENT = 0.085;
const fmtBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const gerarNumero = () => `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const ITEM_VAZIO = () => ({ id: Date.now(), produtoId: '', descricao: '', qtd: 1, unitario: 0, image: '' });
const CLIENTE_VAZIO = { nome: '', telefone: '', email: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cpf: '', ie: '' };

// ─── HELPERS ─────────────────────────────────────────────────
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
  } catch (error) { return null; }
};

// ════════════════════════════════════════════════════════
//  FLUXO: CLIENTE EXISTE?
// ════════════════════════════════════════════════════════
function EtapaClienteExiste({ onSim, onNao }) {
  return (
    <div className="orc-bg">
      <BTNVolta />
      <div className="orc-gate">
        <div className="orc-gate__card">
          <h2>Novo Orçamento</h2>
          <p style={{color:'#666', marginBottom:'20px'}}>Deseja selecionar um cliente cadastrado ou criar um novo?</p>
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
//  FLUXO: NOVO CLIENTE
// ════════════════════════════════════════════════════════
function EtapaNovoCliente({ onContinuar, onVoltar }) {
  const [form, setForm] = useState(CLIENTE_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepErro, setCepErro] = useState('');
  const [salvar, setSalvar] = useState(null);

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

  if (salvar === null) {
    return (
      <div className="orc-bg">
        <div className="orc-paper" style={{maxWidth:'600px'}}>
          <button className="orc-back-link" onClick={onVoltar}>← Voltar</button>
          <h2 style={{marginBottom:'20px'}}>Cadastro de Cliente</h2>
          <div className="orc-cliente-grid">
            <div className="orc-field w-full"><label>Nome Completo</label><input className="orc-input" value={form.nome} onChange={set('nome')} /></div>
            <div className="orc-field"><label>Telefone</label><input className="orc-input" value={form.telefone} onChange={set('telefone')} /></div>
            <div className="orc-field"><label>E-mail</label><input className="orc-input" value={form.email} onChange={set('email')} /></div>
            <div className="orc-field"><label>CPF/CNPJ</label><input className="orc-input" value={form.cpf} onChange={set('cpf')} /></div>
            <div className="orc-field"><label>CEP {buscandoCep && '...'}</label><input className="orc-input" value={form.cep} onChange={handleCEP} maxLength={9} />{cepErro && <small style={{color:'red'}}>{cepErro}</small>}</div>
            <div className="orc-field w-full"><label>Endereço</label><input className="orc-input" value={form.endereco} onChange={set('endereco')} /></div>
            <div className="orc-field"><label>Número</label><input className="orc-input" value={form.numero} onChange={set('numero')} /></div>
            <div className="orc-field"><label>Cidade</label><input className="orc-input" value={form.cidade} onChange={set('cidade')} /></div>
            <div className="orc-field"><label>Estado</label><input className="orc-input" value={form.estado} onChange={set('estado')} maxLength={2} /></div>
          </div>
          <div style={{marginTop:'20px', textAlign:'right'}}>
            <button className="orc-gate__btn orc-gate__btn--sim" onClick={() => setSalvar(true)}>Salvar e Continuar</button>
          </div>
        </div>
      </div>
    );
  }
  onContinuar(form, salvar);
  return null;
}

// ════════════════════════════════════════════════════════
//  TELA PRINCIPAL
// ════════════════════════════════════════════════════════
function TelaOrcamento({ clienteInicial, clienteExistente, onVoltar }) {
  const [numero] = useState(gerarNumero);
  const [dataEmissao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [vendedor, setVendedor] = useState('');
  const [observacoes, setObs] = useState('');
  
  // Dados do cliente
  const [clientes] = useState(API_CLIENTES);
  const [clienteId, setClienteId] = useState(clienteExistente ? String(clienteExistente.id) : '');
  const [dadosCliente, setDadosCliente] = useState(clienteInicial || CLIENTE_VAZIO);
  const [editando, setEditando] = useState(false);

  // Produtos
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => { setProdutos(data); setLoadingProdutos(false); })
      .catch(err => { console.error(err); setLoadingProdutos(false); });
  }, []);

  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  // Itens
  const [itens, setItens] = useState([ITEM_VAZIO()]);
  const addItem = () => setItens(p => [...p, ITEM_VAZIO()]);
  const removeItem = (id) => setItens(p => p.filter(i => i.id !== id));

  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (field === 'produtoId') {
        const p = produtos.find(p => p.id === Number(value));
        return { ...item, produtoId: value, unitario: p ? p.price : 0, image: p ? p.image : '' };
      }
      return { ...item, [field]: value };
    }));
  }, [produtos]);

  // Cálculos
  const totalProdutos = itens.reduce((acc, i) => acc + Number(i.qtd) * Number(i.unitario), 0);
  const valorFrete = totalProdutos * FRETE_PERCENT;
  const totalGeral = totalProdutos + valorFrete;

  // Exportação
  const handleExportar = async () => {
    const tipo = window.confirm('OK para PDF, Cancelar para DOCX') ? 'pdf' : 'docx';
    if (tipo === 'pdf') await exportarPDF();
    else await exportarDOCX();
  };

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210; 
    const L = 20; // Margem Esquerda
    const R = 190; // Margem Direita
    let y = 20;

    // === 1. HEADER (Empresa + Vendedor) ===
    // Esquerda: Kasaleve Info
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
    doc.text(DADOS_EMPRESA.nome, L, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(DADOS_EMPRESA.subtitulo, L, y); y += 4;
    doc.setFontSize(8); doc.setTextColor(80);
    doc.text(`CNPJ: ${DADOS_EMPRESA.cnpj}`, L, y); y += 3;
    doc.text(`Tel: ${DADOS_EMPRESA.telefone}`, L, y); y += 3;
    doc.text(`Email: ${DADOS_EMPRESA.email}`, L, y); y += 5;
    doc.setTextColor(0);

    // Direita: Orçamento + Vendedor
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(`ORÇAMENTO Nº ${numero}`, R, y - 15, { align: 'right' });
    doc.text(`DATA: ${dataEmissao}`, R, y - 11, { align: 'right' });
    doc.text(`VENDEDOR(A): ${vendedor.toUpperCase() || 'NÃO INFORMADO'}`, R, y - 7, { align: 'right' });
    
    // Linha divisória header
    doc.setDrawColor(0); doc.setLineWidth(0.5);
    doc.line(L, y, R, y); y += 10;

    // === 2. CLIENTE ===
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('CLIENTE', L, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(`NOME: ${dadosCliente.nome || ''}`, L, y); y += 5;
    doc.text(`ENDEREÇO: ${dadosCliente.endereco || ''}, ${dadosCliente.numero || ''} - ${dadosCliente.bairro || ''}`, L, y); y += 5;
    doc.text(`${dadosCliente.cidade || ''} - ${dadosCliente.estado || ''}   CEP: ${dadosCliente.cep || ''}`, L, y); y += 5;
    doc.text(`TEL: ${dadosCliente.telefone || ''}   CPF/CNPJ: ${dadosCliente.cpf || ''}`, L, y); y += 5;
    doc.text(`EMAIL: ${dadosCliente.email || ''}`, L, y); y += 10;

    // === 3. TABELA DE PRODUTOS ===
    // Definição de larguras de coluna para alinhamento perfeito
    const col = {
      item: L,
      desc: L + 12,
      qtd: L + 95,
      unit: L + 110,
      total: L + 135
    };

    doc.setLineWidth(0.2); doc.setDrawColor(0);
    // Linha Superior
    doc.line(col.item, y, R, y); y += 2;

    // Cabeçalhos
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('ITEM', col.item, y);
    doc.text('DESCRIÇÃO DO PRODUTO / SERVIÇO', col.desc, y);
    doc.text('QTD', col.qtd, y);
    doc.text('V. UNITÁRIO', col.unit, y);
    doc.text('TOTAL', col.total, y);
    
    // Linha Inferior Cabeçalho (Linhas retas agora!)
    doc.line(col.item, y + 2, R, y + 2); y += 6;
    doc.setFont('helvetica', 'normal');

    // Loop Itens
    for (const item of itens) {
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      if (!prod) continue;
      
      const totalItem = Number(item.qtd) * Number(item.unitario);
      
      // Imagem (miniatura)
      if (item.image) {
        try {
           const imgData = await getBase64ImageFromUrl(item.image);
           if(imgData) doc.addImage(imgData, 'JPEG', col.item + 1, y - 2, 6, 6);
        } catch(e){}
      }

      // Textos
      doc.text(String(itens.indexOf(item) + 1), col.item, y);
      
      // Produto e Descrição Customizada
      const nomeProd = prod.title;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.text(nomeProd, col.desc, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      if (item.descricao) {
        doc.text(`Obs: ${item.descricao}`, col.desc, y + 4);
        y += 2; // Espaço extra se tiver descrição
      }

      doc.text(String(item.qtd), col.qtd, y);
      doc.text(fmtBRL(item.unitario), col.unit, y, { align: 'right' });
      doc.text(fmtBRL(totalItem), col.total, y, { align: 'right' });

      y += 8; // Altura da linha
    }
    // Linha Final Tabela
    doc.line(col.item, y, R, y); y += 10;

    // === 4. TOTAIS ===
    const totX = 140; // Onde começa a tabela de totais
    doc.setFontSize(9);
    
    // Frete
    doc.text('FRETE', totX + 2, y);
    doc.text(fmtBRL(valorFrete), R, y, { align: 'right' });
    doc.line(totX, y - 3, R, y - 3); doc.line(totX, y + 2, R, y + 2);
    y += 6;

    // Total Geral (Fundo Preto)
    doc.setFillColor(0); doc.rect(totX, y - 2, R - totX, 7, 'F');
    doc.setTextColor(255); doc.setFont('helvetica', 'bold');
    doc.text('VALOR PRODUTOS + FRETE', totX + 2, y + 2);
    doc.text(fmtBRL(totalGeral), R - 2, y + 2, { align: 'right' });
    doc.setTextColor(0); doc.setFont('helvetica', 'normal'); y += 15;

    // === 5. TERMOS E CONDIÇÕES ===
    doc.line(L, y, R, y); y += 10;
    
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('TERMOS E CONDIÇÕES GERAIS', (L+R)/2, y, { align: 'center' }); y += 8;
    
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    const termos = [
      "1. O presente orçamento é válido por 5 dias úteis após o envio.",
      "2. Os valores podem sofrer reajuste após o prazo de validade.",
      "3. O frete não está incluso nos valores dos produtos, salvo acordo contrário.",
      "4. O prazo de entrega começa a contar a partir da aprovação do pedido e pagamento.",
      "5. Pagamento: 50% na aprovação e 50% antes do envio/entrega.",
      "6. Garantia de 90 dias contra defeitos de fabricação."
    ];

    termos.forEach(t => {
      const lines = doc.splitTextToSize(t, W - 40);
      doc.text(lines, L, y); y += (lines.length * 4) + 1;
    });

    // === 6. OBSERVAÇÕES (Divisória) ===
    if (observacoes) {
      y += 5;
      // Divisória pontilhada ou tracejada
      doc.setDrawColor(150); doc.setLineDash([2, 2]); 
      doc.line(L, y, R, y); doc.setLineDash([]); doc.setDrawColor(0); y += 8;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text('OBSERVAÇÕES ESPECÍFICAS:', L, y); y += 5;
      
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      const obsLines = doc.splitTextToSize(observacoes, W - 40);
      doc.text(obsLines, L, y); y += (obsLines.length * 4);
    }

    // === 7. ASSINATURA ===
    y = 280; // Perto do rodapé
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('Assinatura / Kasaleve', (L+R)/2, y, { align: 'center' });
    doc.line((L+R)/2 - 40, y - 4, (L+R)/2 + 40, y - 4);

    doc.save(`Orcamento_${numero}.pdf`);
  };

  const exportarDOCX = async () => {
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle } = await import('docx');
    const bold = (t) => new TextRun({ text: t, bold: true });
    const normal = (t) => new TextRun({ text: t });
    const p = (ch, al = AlignmentType.LEFT) => new Paragraph({ children: ch, alignment: al });
    const cell = (t, opts={}) => new TableCell({ width: { size: opts.w || 100, type: WidthType.AUTO }, children: [p([opts.bold ? bold(t) : normal(t)])], shading: opts.bg ? { fill: opts.bg } : undefined });
    const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };

    const itemRows = itens.map((item, idx) => {
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      const total = Number(item.qtd) * Number(item.unitario);
      return new TableRow({ 
        children: [
          cell(String(idx+1), { w: 5 }), 
          cell(prod ? prod.title : '-', { w: 40 }), 
          cell(item.descricao || '', { w: 40 }), 
          cell(String(item.qtd), { w: 10 }), 
          cell(fmtBRL(item.unitario), { w: 20 }), 
          cell(fmtBRL(total), { w: 20 })
        ] 
      });
    });

    const doc = new Document({
      sections: [{
        children: [
          p([bold("KASALEVE"), normal("  •  PROJETO CONFORTO")]),
          p([`CNPJ: ${DADOS_EMPRESA.cnpj}   Tel: ${DADOS_EMPRESA.telefone}`], AlignmentType.CENTER),
          p([]),
          p([`ORÇAMENTO Nº ${numero}   •   DATA: ${dataEmissao}`], AlignmentType.RIGHT),
          p([`VENDEDOR(A): ${vendedor.toUpperCase() || ''}`], AlignmentType.RIGHT),
          p([]),
          p([bold("DADOS DO CLIENTE")]),
          p([`NOME: ${dadosCliente.nome}`]),
          p([`ENDEREÇO: ${dadosCliente.endereco}, ${dadosCliente.numero} - ${dadosCliente.cidade}/${dadosCliente.estado}`]),
          p([`TELEFONE: ${dadosCliente.telefone}   CPF: ${dadosCliente.cpf}`]),
          p([]),
          p([bold("ITENS DO ORÇAMENTO")]),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [cell('ITEM', {bold:true,w:5}), cell('PRODUTO', {bold:true,w:40}), cell('DESCRIÇÃO', {bold:true,w:40}), cell('QTD', {bold:true,w:10}), cell('V.UNIT', {bold:true,w:20}), cell('TOTAL', {bold:true,w:20})] }),
              ...itemRows
            ]
          }),
          p([]),
          new Table({
            width: { size: 40, type: WidthType.PERCENTAGE }, alignment: AlignmentType.RIGHT,
            rows: [
              new TableRow({ children: [cell('FRETE'), cell(fmtBRL(valorFrete), {bold:true})] }),
              new TableRow({ children: [cell('VALOR PRODUTOS + FRETE', {bold:true}), cell(fmtBRL(totalGeral), {bold:true, bg:"000000", color:"FFFFFF"})] })
            ]
          }),
          p([]),
          p([bold("TERMOS E CONDIÇÕES GERAIS")], AlignmentType.CENTER),
          p(["1. O presente orçamento é válido por 5 dias úteis após o envio."]),
          p(["2. Os valores podem sofrer reajuste após o prazo de validade."]),
          p(["3. O frete não está incluso nos valores dos produtos, salvo acordo contrário."]),
          p(["4. O prazo de entrega começa a contar a partir da aprovação do pedido e pagamento."]),
          p(["5. Pagamento: 50% na aprovação e 50% antes do envio/entrega."]),
          p(["6. Garantia de 90 dias contra defeitos de fabricação."]),
          observacoes ? p([bold("OBSERVAÇÕES ESPECÍFICAS: "), normal(observacoes)]) : p([]),
          p([]),
          p(["_______________________________"], AlignmentType.CENTER),
          p(["Assinatura / Kasaleve"], AlignmentType.CENTER),
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Orcamento_${numero}.docx`; a.click();
  };

  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <button className="orc-back-link" onClick={onVoltar}>← Recomeçar</button>

        {/* HEADER SITE */}
        <header className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">{DADOS_EMPRESA.nome}</span>
            <span className="orc-logo__tag">{DADOS_EMPRESA.subtitulo}</span>
            <div style={{fontSize:'9px', color:'#666', marginTop:'4px'}}>
              CNPJ: {DADOS_EMPRESA.cnpj} | Tel: {DADOS_EMPRESA.telefone}
            </div>
          </div>
          <div className="orc-meta-group">
            <div className="orc-meta-row">Orçamento Nº <span className="orc-meta-val">{numero}</span></div>
            <div className="orc-meta-row">Emissão: <span className="orc-meta-val">{dataEmissao}</span></div>
            <div className="orc-meta-row" style={{marginTop:'5px'}}>
              <label style={{fontSize:'9px', marginRight:'5px'}}>Vendedor(a):</label>
              <input 
                type="text" 
                style={{border:'none', borderBottom:'1px solid #ccc', width:'120px', fontSize:'12px', outline:'none'}}
                placeholder="Digite seu nome"
                value={vendedor}
                onChange={e => setVendedor(e.target.value)}
              />
            </div>
            <div className="orc-validade-box">Válido por 5 úteis dias</div>
          </div>
        </header>

        <div className="orc-divider"></div>

        {/* CLIENTE */}
        <section className="orc-section">
          <h2 className="orc-section__title">DADOS DO CLIENTE</h2>
          
          {clienteExistente !== null && (
            <div className="orc-field" style={{marginBottom:'10px'}}>
              <select className="orc-input" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">— Selecione um cliente —</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          )}

          <div className="orc-cliente-grid">
            <div className="orc-field w-full"><label>Nome Completo</label><input className="orc-input" value={dadosCliente.nome} readOnly={!editando} onChange={e => setDadosCliente(p=>({...p, nome:e.target.value}))} /></div>
            <div className="orc-field"><label>Telefone</label><input className="orc-input" value={dadosCliente.telefone} readOnly={!editando} onChange={e => setDadosCliente(p=>({...p, telefone:e.target.value}))} /></div>
            <div className="orc-field"><label>Cidade / UF</label><input className="orc-input" value={`${dadosCliente.cidade} / ${dadosCliente.estado}`} readOnly /></div>
            <div className="orc-field"><label>CPF / CNPJ</label><input className="orc-input" value={dadosCliente.cpf} readOnly={!editando} onChange={e => setDadosCliente(p=>({...p, cpf:e.target.value}))} /></div>
            <div className="orc-field w-full"><label>Endereço Completo</label><input className="orc-input" value={`${dadosCliente.endereco}, ${dadosCliente.numero} - ${dadosCliente.bairro}`} readOnly /></div>
          </div>
        </section>

        {/* ITENS */}
        <section className="orc-section">
          <h2 className="orc-section__title">DETALHAMENTO DOS PRODUTOS</h2>
          {loadingProdutos && <small style={{display:'block', marginBottom:'10px'}}>Carregando produtos...</small>}
          
          <table className="orc-table">
            <thead>
              <tr>
                <th className="col-img center">Img</th>
                <th className="col-item">Produto</th>
                <th className="col-desc">Descrição Personalizada</th>
                <th className="col-qtd center">Qtd</th>
                <th className="col-unit right">V. Unitário</th>
                <th className="col-total right">Total</th>
                <th className="col-del"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => (
                <tr key={item.id}>
                  <td className="center">{item.image && <img src={item.image} className="orc-table-img" alt=""/>}</td>
                  <td>
                    <select value={item.produtoId} onChange={e => updateItem(item.id, 'produtoId', e.target.value)} disabled={loadingProdutos}>
                      <option value="">Selecione...</option>
                      {produtos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </td>
                  <td><input value={item.descricao} onChange={e => updateItem(item.id, 'descricao', e.target.value)} placeholder="Cores, medidas..." /></td>
                  <td className="center"><input type="number" min="1" value={item.qtd} onChange={e => updateItem(item.id, 'qtd', Number(e.target.value))} /></td>
                  <td className="right">{item.unitario > 0 ? fmtBRL(item.unitario) : '-'}</td>
                  <td className="right">{fmtBRL(item.qtd * item.unitario)}</td>
                  <td className="center">{itens.length > 1 && <button className="orc-btn-del" onClick={() => removeItem(item.id)}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="orc-btn-add" onClick={addItem} disabled={loadingProdutos}>+ Adicionar Item</button>
        </section>

        {/* TOTAIS */}
        <div className="orc-footer-area">
          <table className="orc-totais-table">
            <tbody>
              <tr>
                <td className="label">FRETE</td>
                <td className="value">{fmtBRL(valorFrete)}</td>
              </tr>
              <tr className="final-row">
                <td className="label" style={{color:'#fff'}}>VALOR PRODUTOS + FRETE</td>
                <td className="value" style={{color:'#fff', textAlign:'right'}}>{fmtBRL(totalGeral)}</td>
              </tr>
            </tbody>
          </table>

          {/* TERMOS + DIVISÓRIA + OBSERVAÇÕES */}
          <div className="orc-termos">
            <h3 className="orc-termos__title">TERMOS E CONDIÇÕES GERAIS</h3>
            <div className="orc-termos__validade">Orçamento válido por 5 úteis dias após o envio.</div>
            
            <div className="orc-termos__text">
              <p>1. O presente orçamento é válido por 5 dias úteis após o envio. Os valores podem sofrer reajuste após este prazo.</p>
              <p>2. O frete não está incluso nos valores dos produtos, salvo acordo contrário expresso neste documento.</p>
              <p>3. O prazo de entrega começa a contar a partir da aprovação definitiva do pedido e pagamento.</p>
              <p>4. Pagamento: 50% na aprovação e 50% antes do envio/entrega.</p>
              <p>5. Garantia de 90 dias contra defeitos de fabricação.</p>
            </div>

            {/* DIVISÓRIA VISUAL ENTRE TERMOS E OBSERVAÇÕES */}
            {observacoes && (
              <div className="orc-obs-divider"></div>
            )}

            {observacoes && (
              <div className="orc-obs-section">
                <h4 style={{fontSize:'11px', textTransform:'uppercase', color:'#555', marginBottom:'5px', fontWeight:'700'}}>Observações Específicas:</h4>
                <p style={{fontSize:'11px', whiteSpace:'pre-wrap', lineHeight:'1.5'}}>{observacoes}</p>
              </div>
            )}

            <div className="orc-assinatura-box">
              <div className="orc-assinatura-line">Assinatura / Kasaleve</div>
            </div>
          </div>

          <div className="orc-field" style={{marginTop:'15px'}}>
            <label>Adicionar Observações ao Documento:</label>
            <textarea 
              className="orc-input" 
              rows={3} 
              placeholder="Digite aqui observações específicas para este projeto (ex: Prazo extra, detalhes de entrega)..."
              value={observacoes}
              onChange={e => setObs(e.target.value)}
            />
          </div>
        </div>

        <button className="orc-btn-export" onClick={handleExportar}>GERAR ARQUIVO (PDF / DOCX)</button>
      </div>
    </div>
  );
}

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