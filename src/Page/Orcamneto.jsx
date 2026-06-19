import React, { useState, useEffect, useCallback } from 'react';
import '../css/Orcamneto.css';
import BTNVolta from "../components/BTNVolta";

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
  { id: 2, nome: 'Maria Souza', telefone: '(19) 98888-2222', endereco: 'Av. Brasil, 456', cidade: 'Campinas', estado: 'SP', cep: '13010-050', cpf: '987.654.321-00', ie: '0987654321', bairro: 'Jardim' },
];

// ─── PERFIS DE PREÇO ──
const PERFIS_PRECO = [
  { id: 'padrao', label: 'Padrão', desconto: 0 },
  { id: 'lojista', label: 'Lojista', desconto: 0.10 },
  { id: 'arquiteto', label: 'Arquiteto', desconto: 0.15 },
];

const FRETE_PERCENT = 0.085;
const fmtBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const gerarNumero = () => `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
const ITEM_VAZIO = () => ({ id: Date.now() + Math.random(), produtoId: '', nomeExtra: '', qtd: 1, unitarioPadrao: 0, image: '' });
const CLIENTE_VAZIO = { nome: '', telefone: '', email: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cpf: '', ie: '', vendedora: '' };

const TERMOS_PADRAO = [
  { titulo: 'Descrição dos Móveis', texto: 'O VENDEDOR declara que os móveis fornecidos serão fabricados conforme as especificações descritas neste documento.' },
  { titulo: 'Data de Entrega', texto: 'A KASALEVE se compromete a entregar os móveis conforme o cronograma acordado.' },
  { titulo: 'Qualidade e Durabilidade', texto: 'Os móveis serão fabricados com materiais de qualidade e durabilidade adequadas. A KASALEVE garante que os móveis atenderão aos padrões exigidos.' },
  { titulo: 'Pagamento e Sinal', texto: 'O COMPRADOR se compromete a não desistir do pedido após confirmação e o pagamento do sinal.' },
  { titulo: 'Rescisão e Penalidades', texto: 'Em caso de descumprimento das obrigações, as partes poderão rescindir o contrato mediante notificação por escrito. O COMPRADOR estará sujeito a penalidades em caso de desistência após o pagamento do sinal.' },
  { titulo: 'Foro', texto: 'Fica eleito o foro da cidade de [informar a cidade do cliente] para dirimir quaisquer questões decorrentes deste contrato.' },
];

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

// Calcula o preço unitário com base no perfil
function calcPrecoUnitario(unitarioPadrao, perfilId) {
  const perfil = PERFIS_PRECO.find(p => p.id === perfilId) || PERFIS_PRECO[0];
  return unitarioPadrao * (1 - perfil.desconto);
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
          <div className="orc-field">
            <label>CEP {buscandoCep && <span className="orc-cep-spinner">⏳</span>}</label>
            <input className="orc-input" value={form.cep} onChange={handleCEP} maxLength={9} placeholder="00000-000" />
            {cepErro && <small className="orc-cep-erro">{cepErro}</small>}
          </div>
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
//  TELA PRINCIPAL — Orçamento
// ════════════════════════════════════════════════════════
function TelaOrcamento({ clienteInicial, clienteExistente, onVoltar }) {
  const [numero] = useState(gerarNumero);
  const [dataEmissao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [observacoes, setObs] = useState('');

  // ── Perfil de preço selecionado ──
  const [perfilId, setPerfilId] = useState('padrao');

  const [clientes] = useState(API_CLIENTES);
  const [clienteId, setClienteId] = useState(clienteExistente ? String(clienteExistente.id) : '');
  const [dadosCliente, setDadosCliente] = useState(clienteInicial || CLIENTE_VAZIO);

  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => { setProdutos(data); setLoadingProdutos(false); })
      .catch(() => setLoadingProdutos(false));
  }, []);

  useEffect(() => {
    if (!clienteId) return;
    const c = clientes.find(c => c.id === Number(clienteId));
    if (c) setDadosCliente(c);
  }, [clienteId, clientes]);

  const setDado = (field) => (e) => setDadosCliente(p => ({ ...p, [field]: e.target.value }));

  const [itens, setItens] = useState([ITEM_VAZIO()]);
  const addItem = () => setItens(p => [...p, ITEM_VAZIO()]);
  const removeItem = (id) => setItens(p => p.filter(i => i.id !== id));

  const updateItem = useCallback((id, field, value) => {
    setItens(prev => prev.map(item => {
      if (item.id !== id) return item;
      if (field === 'produtoId') {
        const p = produtos.find(p => p.id === Number(value));
        return { ...item, produtoId: value, unitarioPadrao: p ? p.price : 0, image: p ? p.image : '' };
      }
      return { ...item, [field]: value };
    }));
  }, [produtos]);

  // Preço unitário efetivo = preço padrão com desconto do perfil
  const getUnitario = (item) => calcPrecoUnitario(item.unitarioPadrao, perfilId);

  const totalProdutos = itens.reduce((acc, i) => acc + Number(i.qtd) * getUnitario(i), 0);
  const valorFrete = totalProdutos * FRETE_PERCENT;
  const totalGeral = totalProdutos + valorFrete;

  const perfilAtual = PERFIS_PRECO.find(p => p.id === perfilId) || PERFIS_PRECO[0];

  // ────────────────────────────────────────────
  //  EXPORTAÇÃO
  // ────────────────────────────────────────────
  const handleExportar = async () => {
    const tipo = window.confirm('OK para PDF, Cancelar para DOCX') ? 'pdf' : 'docx';
    if (tipo === 'pdf') await exportarPDF();
    else await exportarDOCX();
  };

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const L = 15, R = 195;
    let y = 18;

    // ═══ CABEÇALHO ═══
    doc.setFont('helvetica', 'normal'); doc.setFontSize(26);
    doc.setTextColor(40, 40, 40);
    doc.text('kasaleve', L, y + 8);
    doc.setFontSize(11); doc.setTextColor(90, 90, 90);
    doc.text('projeto  •  conforto', L, y + 15);
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.8);
    doc.line(L, y + 18, L + 75, y + 18);

    doc.setFontSize(8); doc.setTextColor(60, 60, 60); doc.setFont('helvetica', 'normal');
    doc.text(DADOS_EMPRESA.razaoSocial, R, y, { align: 'right' });
    const enderecoLines = doc.splitTextToSize(DADOS_EMPRESA.endereco, 85);
    doc.text(enderecoLines, R, y + 4, { align: 'right' });
    doc.setTextColor(37, 99, 235);
    doc.text(DADOS_EMPRESA.site, R, y + 4 + enderecoLines.length * 3.6, { align: 'right' });
    doc.setTextColor(60, 60, 60);
    doc.text(DADOS_EMPRESA.telefone, R, y + 4 + enderecoLines.length * 3.6 + 4, { align: 'right' });

    y += 30;

    // ═══ TÍTULO + DATA ═══
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.setTextColor(200, 30, 30);
    doc.text('ORÇAMENTO', L, y);
    doc.setFontSize(10); doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold');
    doc.text(`Enviado em: ${dataEmissao}`, R, y, { align: 'right' });

    y += 8;

    // ═══ BLOCO CLIENTE ═══
    const rowH = 9;
    const grayRow = (label, value, x1, _x2, w) => {
      doc.setFillColor(225, 225, 225);
      doc.rect(x1, y, w, rowH, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
      doc.text(label, x1 + 2, y + 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      doc.text(String(value || ''), x1 + 2, y + 7.5);
    };

    grayRow('CLIENTE:', dadosCliente.nome, L, R, R - L);
    y += rowH + 1;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
    doc.text('ENDEREÇO:', L, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(`${dadosCliente.endereco || ''} ${dadosCliente.numero || ''}`, L + 22, y + 4);
    y += rowH + 3;

    const halfW = (R - L - 2) / 2;
    grayRow('CIDADE:', `${dadosCliente.cidade || ''} ${dadosCliente.estado ? '- ' + dadosCliente.estado : ''}`, L, L + halfW, halfW);
    grayRow('CEP:', dadosCliente.cep, L + halfW + 2, R, halfW);
    y += rowH + 1;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('CNPJ/CPF:', L, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(dadosCliente.cpf || '', L + 22, y + 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('IE/RG:', L + halfW + 2, y + 4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(dadosCliente.ie || '', L + halfW + 18, y + 4);
    y += rowH + 3;

    grayRow('CONTATO:', dadosCliente.telefone, L, L + halfW, halfW);
    grayRow('VENDEDORA:', dadosCliente.vendedora, L + halfW + 2, R, halfW);
    y += rowH + 8;

    // ═══ TABELA DE ITENS ═══
    const c1 = L, c2 = L + 14, c3 = R - 75, c4 = R - 55, c6 = R;

    const headerH = 10;
    doc.setFillColor(60, 60, 60);
    doc.rect(c1, y, c6 - c1, headerH, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('ITEM', c1 + 2, y + 6.5);
    doc.text('DESCRIÇÃO', c2 + 2, y + 6.5);
    doc.text('QUANTIDADE', c3 + 2, y + 6.5);
    doc.text('VALOR UNIT.', c4 + 2, y + 6.5);
    doc.text('VALOR TOTAL', c6 - 2, y + 6.5, { align: 'right' });
    y += headerH;
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'normal');

    const c5 = R - 30; // separador Unit. | Total

    const lineCols = (yTop, h) => {
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2);
      doc.rect(c1, yTop, c6 - c1, h);
      doc.line(c2, yTop, c2, yTop + h);
      doc.line(c3, yTop, c3, yTop + h);
      doc.line(c4, yTop, c4, yTop + h);
      // separador mais visível entre Unit. e Total
      doc.setDrawColor(150, 150, 150); doc.setLineWidth(0.5);
      doc.line(c5, yTop, c5, yTop + h);
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2);
    };

    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      const nomeProduto = prod ? prod.title : '';
      // Descrição = nome do produto + texto extra do usuário
      const descCompleta = [nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
      const unitario = getUnitario(item);
      const totalItem = Number(item.qtd) * unitario;
      const descLines = doc.splitTextToSize(descCompleta || '-', (c3 - c2) - 4);
      const rowHgt = Math.max(12, descLines.length * 4 + 6);

      if (item.image) {
        try {
          const imgData = await getBase64ImageFromUrl(item.image);
          if (imgData) doc.addImage(imgData, 'JPEG', c1 + 1, y + 1, 10, 10);
        } catch { /* ignore */ }
      }
      doc.setFontSize(9);
      doc.text(descLines, c2 + 2, y + 5);
      doc.text(String(item.qtd), c3 + 2, y + 6);
      doc.text(fmtBRL(unitario), c4 + 2, y + 6);
      doc.text(fmtBRL(totalItem), c6 - 2, y + 6, { align: 'right' });

      lineCols(y, rowHgt);
      y += rowHgt;

      if (y > 265) { doc.addPage(); y = 20; }
    }

    y += 6;

    // ═══ TOTAL ═══
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TOTAL:', c4, y + 6);
    doc.setFillColor(225, 225, 225);
    doc.rect(c6 - 55, y, 55, 9, 'F');
    doc.setDrawColor(150); doc.rect(c6 - 55, y, 55, 9);
    doc.text(`R$ ${totalProdutos.toFixed(2).replace('.', ',')}`, c6 - 52, y + 6);
    y += 18;

    // ═══ TERMOS E CONDIÇÕES GERAIS ═══
    const colDivisor = L + 55;

    doc.setDrawColor(0); doc.setLineWidth(0.3);
    doc.rect(L, y, R - L, 8);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TERMOS E CONDIÇÕES GERAIS', (L + R) / 2, y + 5.5, { align: 'center' });
    y += 8;

    doc.rect(L, y, R - L, 9);
    doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('FRETE', L + 2, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`R$ ${valorFrete.toFixed(2).replace('.', ',')}`, colDivisor + 3, y + 6);
    y += 9;

    doc.rect(L, y, R - L, 9);
    doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
    doc.text('VALOR PRODUTOS + FRETE', L + 2, y + 6);
    doc.text(`R$ ${totalGeral.toFixed(2).replace('.', ',')}`, colDivisor + 3, y + 6);
    y += 9;

    doc.rect(L, y, R - L, 10);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    doc.text('Orçamento válido por 5 úteis dias após o envio.', L + 2, y + 6);
    y += 10;

    doc.rect(L, y, R - L, 8);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('TERMOS E CONDIÇÕES:', (L + R) / 2, y + 5.5, { align: 'center' });
    y += 14;

    doc.setFontSize(8.5);
    TERMOS_PADRAO.forEach(t => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      const tituloW = doc.getTextWidth(t.titulo + ': ');
      doc.text(`${t.titulo}:`, L, y);
      doc.setFont('helvetica', 'normal');
      const linhas = doc.splitTextToSize(t.texto, (R - L) - tituloW - 2);
      doc.text(linhas[0], L + tituloW, y);
      for (let k = 1; k < linhas.length; k++) {
        y += 4;
        doc.text(linhas[k], L, y);
      }
      y += 6;
    });

    if (observacoes) {
      if (y > 250) { doc.addPage(); y = 20; }
      y += 4;
      doc.setDrawColor(150);
      doc.line(L, y, R, y);
      y += 6;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.text('OBSERVAÇÕES ESPECÍFICAS:', L, y);
      y += 5;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      const obsLines = doc.splitTextToSize(observacoes, R - L);
      doc.text(obsLines, L, y);
      y += obsLines.length * 4;
    }

    if (y > 260) { doc.addPage(); y = 250; } else { y = Math.max(y + 20, 270); }
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

    const labelCell = (label, value, gray = true) => new TableCell({
      borders: cellBorder,
      shading: gray ? grayShade : undefined,
      children: [
        p([bold(label + ' ', { size: 16 })]),
        p([normal(value || '', { size: 18 })]),
      ],
    });

    const itemRows = itens.map((item) => {
      const prod = produtos.find(p => p.id === Number(item.produtoId));
      const nomeProduto = prod ? prod.title : '-';
      const descCompleta = [nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
      const unitario = getUnitario(item);
      const total = Number(item.qtd) * unitario;
      return new TableRow({
        children: [
          new TableCell({ borders: cellBorder, children: [p([normal(nomeProduto, { size: 16 })])] }),
          new TableCell({ borders: cellBorder, children: [p([normal(descCompleta, { size: 16 })])] }),
          new TableCell({ borders: cellBorder, children: [p([normal(String(item.qtd), { size: 16 })], AlignmentType.CENTER)] }),
          new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(unitario), { size: 16 })], AlignmentType.RIGHT)] }),
          new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(total), { size: 16 })], AlignmentType.RIGHT)] }),
        ]
      });
    });

    const termosParagraphs = TERMOS_PADRAO.flatMap(t => [
      p([bold(t.titulo + ': ', { size: 17 }), normal(t.texto, { size: 17 })]),
      p([]),
    ]);

    const doc = new Document({
      sections: [{
        children: [
          p([bold('kasaleve', { size: 44 })]),
          p([normal('projeto  •  conforto', { size: 18 })]),
          p([]),
          p([bold('ORÇAMENTO', { color: 'C81E1E', size: 32 })], AlignmentType.LEFT),
          p([bold(`Enviado em: ${dataEmissao}`, { size: 18 })], AlignmentType.RIGHT),
          p([]),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [labelCell('CLIENTE:', dadosCliente.nome)] }),
              new TableRow({ children: [labelCell('ENDEREÇO:', `${dadosCliente.endereco || ''} ${dadosCliente.numero || ''}`, false)] }),
              new TableRow({ children: [
                labelCell('CIDADE:', `${dadosCliente.cidade || ''} ${dadosCliente.estado ? '- ' + dadosCliente.estado : ''}`),
                labelCell('CEP:', dadosCliente.cep),
              ]}),
              new TableRow({ children: [
                labelCell('CNPJ/CPF:', dadosCliente.cpf, false),
                labelCell('IE/RG:', dadosCliente.ie, false),
              ]}),
              new TableRow({ children: [
                labelCell('CONTATO:', dadosCliente.telefone),
                labelCell('VENDEDORA:', dadosCliente.vendedora),
              ]}),
            ],
          }),
          p([]),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [
                new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold('ITEM', { color: 'FFFFFF', size: 16 })])] }),
                new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold('DESCRIÇÃO', { color: 'FFFFFF', size: 16 })])] }),
                new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold('QTD', { color: 'FFFFFF', size: 16 })], AlignmentType.CENTER)] }),
                new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold('VALOR UNIT.', { color: 'FFFFFF', size: 16 })], AlignmentType.RIGHT)] }),
                new TableCell({ borders: cellBorder, shading: { type: ShadingType.CLEAR, fill: '3C3C3C' }, children: [p([bold('VALOR TOTAL', { color: 'FFFFFF', size: 16 })], AlignmentType.RIGHT)] }),
              ]}),
              ...itemRows,
            ],
          }),
          p([]),
          p([bold('TOTAL: '), normal(fmtBRL(totalProdutos))], AlignmentType.RIGHT),
          p([]),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([bold('TERMOS E CONDIÇÕES GERAIS')], AlignmentType.CENTER)] })] }),
              new TableRow({ children: [
                new TableCell({ borders: cellBorder, children: [p([bold('FRETE')])] }),
                new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(valorFrete))])] }),
              ]}),
              new TableRow({ children: [
                new TableCell({ borders: cellBorder, children: [p([bold('VALOR PRODUTOS + FRETE')])] }),
                new TableCell({ borders: cellBorder, children: [p([normal(fmtBRL(totalGeral))])] }),
              ]}),
              new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([normal('Orçamento válido por 5 úteis dias após o envio.', { size: 16 })])] })] }),
              new TableRow({ children: [new TableCell({ borders: cellBorder, columnSpan: 2, children: [p([bold('TERMOS E CONDIÇÕES:')], AlignmentType.CENTER)] })] }),
            ],
          }),
          p([]),
          ...termosParagraphs,

          ...(observacoes ? [
            p([]),
            p([bold('OBSERVAÇÕES ESPECÍFICAS:')]),
            p([normal(observacoes)]),
          ] : []),

          p([]), p([]),
          p([normal('_______________________________')], AlignmentType.CENTER),
          p([normal('Assinatura / Kasaleve')], AlignmentType.CENTER),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Orcamento_${numero}.docx`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="orc-bg">
      <div className="orc-paper">
        <button className="orc-back-link" onClick={onVoltar}>← Recomeçar</button>

        {/* ═══ CABEÇALHO ═══ */}
        <header className="orc-header">
          <div className="orc-logo">
            <span className="orc-logo__name">kasaleve</span>
            <span className="orc-logo__tag">projeto <span className="orc-logo__dot">•</span> conforto</span>
            <div className="orc-logo__underline" />
          </div>
          <div className="orc-empresa-info">
            <p>{DADOS_EMPRESA.razaoSocial}</p>
            <p>{DADOS_EMPRESA.endereco}</p>
            <p className="orc-empresa-info__link">{DADOS_EMPRESA.site}</p>
            <p>{DADOS_EMPRESA.telefone}</p>
          </div>
        </header>

        <div className="orc-titulo-row">
          <h1 className="orc-titulo-orcamento">ORÇAMENTO</h1>
          <div className="orc-enviado-em">Enviado em: <strong>{dataEmissao}</strong></div>
        </div>

        {/* ═══ SELETOR DE PERFIL DE PREÇO ═══ */}
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
                {p.desconto > 0 && (
                  <span className="orc-perfil-badge">-{(p.desconto * 100).toFixed(0)}%</span>
                )}
              </button>
            ))}
          </div>
          {perfilAtual.desconto > 0 && (
            <span className="orc-perfil-hint">
              Preço com {(perfilAtual.desconto * 100).toFixed(0)}% de desconto aplicado
            </span>
          )}
        </section>

        {/* ═══ BLOCO CLIENTE ═══ */}
        <section className="orc-cliente-bloco">
          {clienteExistente !== null && (
            <div className="orc-select-cliente">
              <select className="orc-input" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                <option value="">— Selecione um cliente para preencher —</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          )}

          <div className="orc-row orc-row--gray">
            <label>CLIENTE:</label>
            <input value={dadosCliente.nome} onChange={setDado('nome')} placeholder="Nome do cliente" />
          </div>
          <div className="orc-row">
            <label>ENDEREÇO:</label>
            <input value={dadosCliente.endereco} onChange={setDado('endereco')} placeholder="Rua, número..." />
          </div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--gray orc-row--half">
              <label>CIDADE:</label>
              <input value={dadosCliente.cidade} onChange={setDado('cidade')} placeholder="Cidade - UF" />
            </div>
            <div className="orc-row orc-row--gray orc-row--half">
              <label>CEP:</label>
              <input value={dadosCliente.cep} onChange={setDado('cep')} placeholder="00000-000" />
            </div>
          </div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--half">
              <label>CNPJ/CPF:</label>
              <input value={dadosCliente.cpf} onChange={setDado('cpf')} placeholder="000.000.000-00" />
            </div>
            <div className="orc-row orc-row--half">
              <label>IE/RG:</label>
              <input value={dadosCliente.ie} onChange={setDado('ie')} placeholder="—" />
            </div>
          </div>
          <div className="orc-row-split">
            <div className="orc-row orc-row--gray orc-row--half">
              <label>CONTATO:</label>
              <input value={dadosCliente.telefone} onChange={setDado('telefone')} placeholder="(11) 99999-0000" />
            </div>
            <div className="orc-row orc-row--gray orc-row--half">
              <label>VENDEDORA:</label>
              <input value={dadosCliente.vendedora} onChange={setDado('vendedora')} placeholder="Nome da vendedora" />
            </div>
          </div>
        </section>

        {/* ═══ TABELA DE PRODUTOS ═══ */}
        <section className="orc-section">
          {loadingProdutos && <small className="orc-loading-hint">Carregando produtos da API...</small>}

          <table className="orc-table">
            <thead>
              <tr>
                <th className="col-img center">Img</th>
                <th className="col-item">Item</th>
                <th className="col-desc">Descrição</th>
                <th className="col-qtd center">Qtd</th>
                <th className="col-unit right">Unit.</th>
                <th className="col-total right">Total</th>
                <th className="col-del"></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => {
                const prod = produtos.find(p => p.id === Number(item.produtoId));
                const nomeProduto = prod ? prod.title : '';
                const unitario = getUnitario(item);
                return (
                  <tr key={item.id}>
                    <td className="center">
                      {item.image && <img src={item.image} className="orc-table-img" alt="" />}
                    </td>
                    <td>
                      <select
                        value={item.produtoId}
                        onChange={e => updateItem(item.id, 'produtoId', e.target.value)}
                        disabled={loadingProdutos}
                      >
                        <option value="">Selecione...</option>
                        {produtos.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </td>
                    <td>
                      {/* Descrição = nome do produto (readonly) + campo extra editável */}
                      <div className="orc-desc-cell">
                        {nomeProduto && (
                          <span className="orc-desc-nome">{nomeProduto}</span>
                        )}
                        <input
                          type="text"
                          value={item.nomeExtra}
                          onChange={e => updateItem(item.id, 'nomeExtra', e.target.value)}
                          placeholder="Cores, medidas, observações..."
                          className="orc-desc-extra"
                        />
                      </div>
                    </td>
                    <td className="center">
                      <input
                        type="number"
                        min="1"
                        value={item.qtd}
                        onChange={e => updateItem(item.id, 'qtd', Number(e.target.value))}
                      />
                    </td>
                    <td className="right orc-unit-cell">
                      {unitario > 0 ? (
                        <>
                          <span className="orc-unit-valor">{fmtBRL(unitario)}</span>
                          {perfilAtual.desconto > 0 && item.unitarioPadrao > 0 && (
                            <span className="orc-unit-original">{fmtBRL(item.unitarioPadrao)}</span>
                          )}
                        </>
                      ) : '-'}
                    </td>
                    <td className="right">{unitario > 0 ? fmtBRL(item.qtd * unitario) : '-'}</td>
                    <td className="center">
                      {itens.length > 1 && (
                        <button className="orc-btn-del" onClick={() => removeItem(item.id)}>✕</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button className="orc-btn-add" onClick={addItem} disabled={loadingProdutos}>+ Adicionar Item</button>

          <div className="orc-total-row">
            <span>TOTAL:</span>
            <span className="orc-total-valor">{fmtBRL(totalProdutos)}</span>
          </div>
        </section>

        {/* ═══ TERMOS (preview na tela) ═══ */}
        <section className="orc-termos-box">
          <div className="orc-termos-box__titulo">TERMOS E CONDIÇÕES GERAIS</div>
          <div className="orc-termos-box__linha">
            <span className="orc-termos-box__label">FRETE</span>
            <span>{fmtBRL(valorFrete)}</span>
          </div>
          <div className="orc-termos-box__linha">
            <span className="orc-termos-box__label">VALOR PRODUTOS + FRETE</span>
            <span>{fmtBRL(totalGeral)}</span>
          </div>
          <div className="orc-termos-box__validade">Orçamento válido por 5 úteis dias após o envio.</div>
          <div className="orc-termos-box__titulo">TERMOS E CONDIÇÕES:</div>
          <div className="orc-termos-box__texto">
            {TERMOS_PADRAO.map((t, i) => (
              <p key={i}><strong>{t.titulo}:</strong> {t.texto}</p>
            ))}
          </div>
        </section>

        {/* ═══ OBSERVAÇÕES ═══ */}
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

        {/* ═══ ASSINATURA ═══ */}
        <div className="orc-assinatura-box">
          <div className="orc-assinatura-line">Assinatura / Kasaleve</div>
        </div>

        <button className="orc-btn-export" onClick={handleExportar}>GERAR ARQUIVO (PDF / DOCX)</button>
      </div>
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