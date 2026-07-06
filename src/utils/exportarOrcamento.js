
import { DADOS_EMPRESA, TERMOS_PADRAO, fmtBRL, getBase64ImageFromUrl } from './orcamentoHelpers';

export const handleExportar = async (dados) => {
  const tipo = window.confirm('OK para PDF, Cancelar para DOCX') ? 'pdf' : 'docx';
  if (tipo === 'pdf') await exportarPDF(dados);
  else await exportarDOCX(dados);
};

export const exportarPDF = async ({ 
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
}) => {
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

  const c1 = L, c2 = c1 + 32, c6 = R, c5 = c6 - 25, c4 = c5 - 25, c3 = c4 - 18;
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

  const topPad = 7;
  const bottomPad = 5;
  const lineH = 5.5;

  for (let i = 0; i < itens.length; i++) {
    const item = itens[i];
    const descCompleta = [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
    const unitario = getUnitario(item);
    const totalItem = Number(item.qtd) * unitario;
    const descLines = doc.splitTextToSize(descCompleta || '-', (c3 - c2) - 6);

    const imgSize = 28;
    const alturaTexto = descLines.length * lineH + topPad + bottomPad;
    const alturaImagem = imgSize + 6;
    const rowHgt = Math.max(14, alturaTexto, alturaImagem);

    if (y + rowHgt > 275) { doc.addPage(); y = 20; }

    if (item.image) {
      try {
        let imgData = item.image;
        if (!imgData.startsWith('data:')) imgData = await getBase64ImageFromUrl(item.image);
        if (imgData) {
          const format = imgData.includes('png') ? 'PNG' : 'JPEG';
          const imgY = y + (rowHgt - imgSize) / 2;
          doc.addImage(imgData, format, c1 + 1.5, imgY, imgSize, imgSize);
        }
      } catch (err) { console.error("Erro ao adicionar imagem ao PDF:", err); }
    }

    doc.setFontSize(11);
    doc.text(descLines, c2 + 3, y + topPad);
    const valY = y + topPad + 1;
    doc.text(String(item.qtd), c3 + 2, valY);
    doc.text(fmtBRL(unitario), c4 + 2, valY);
    doc.text(fmtBRL(totalItem), c6 - 2, valY, { align: 'right' });
    lineCols(y, rowHgt);
    y += rowHgt;
  }

  y += 6;
  if (y > 250) { doc.addPage(); y = 20; }
  const totalW = 75; const totalX = R - totalW;
  const tRow = (label, value, isBold, color) => {
    if (color) doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal'); doc.setFontSize(isBold ? 12 : 10);
    doc.text(label, totalX, y); doc.text(value, R, y, { align: 'right' });
    doc.setTextColor(0, 0, 0); y += 6;
  };

  if (descontoPerc > 0) tRow('DESCONTO:', `- ${fmtBRL(valorDesconto)}`, false, [200, 30, 30]);
  tRow('FRETE:', semFrete ? 'ISENTO' : fmtBRL(valorFrete), false);
  y += 2; tRow('TOTAL GERAL:', fmtBRL(totalGeral), true);

  y += 10;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('TERMOS E CONDIÇÕES GERAIS', L, y); y += 6;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  doc.text('• Validade: Orçamento válido por 5 dias úteis após o envio.', L, y); y += 4.5;
  TERMOS_PADRAO.forEach(t => {
    const txt = doc.splitTextToSize(`• ${t.titulo}: ${t.texto}`, R - L);
    doc.text(txt, L, y); y += txt.length * 4.2;
  });

  if (observacoes) {
    y += 6; doc.setFont('helvetica', 'bold'); doc.text('OBSERVAÇÕES:', L, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.text(doc.splitTextToSize(observacoes, R - L), L, y);
  }

  doc.save(`Orcamento_${numero}.pdf`);
};

export const exportarDOCX = async ({ 
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
}) => {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ImageRun } = await import('docx');

  const bNone = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  const BLUE = '2563EB', RED = 'C81E1E', MUTED = '5A5A5A';

  const bold = (t, opts = {}) => new TextRun({ text: t, bold: true, font: 'Helvetica', size: 20, ...opts });
  const normal = (t, opts = {}) => new TextRun({ text: t, font: 'Helvetica', size: 18, ...opts });
  const p = (children, align = AlignmentType.LEFT, spacing = { before: 120, after: 120 }) => new Paragraph({ children, alignment: align, spacing });

  const cFull = (label, val, gray) => new TableCell({
    shading: gray ? { fill: 'F3F4F6' } : undefined,
    margins: { top: 100, bottom: 100, left: 100 },
    children: [p([bold(label, { size: 14 }), normal(' ' + (val || ''), { size: 18 })], AlignmentType.LEFT, { before: 0, after: 0 })]
  });

  const row2 = (l1, v1, l2, v2, gray) => new TableRow({
    children: [
      cFull(l1, v1, gray),
      cFull(l2, v2, gray),
    ]
  });

  const hCell = (t, align, w) => new TableCell({
    width: { size: w, type: WidthType.PERCENTAGE },
    shading: { fill: '3C3C3C' },
    verticalAlign: 'center',
    children: [p([bold(t, { color: 'FFFFFF', size: 16 })], align, { before: 100, after: 100 })]
  });

  const tTitle = (t) => new TableCell({ shading: { fill: 'EEEEEE' }, columnSpan: 2, children: [p([bold(t, { size: 18 })], AlignmentType.LEFT)] });
  const tLabel = (t) => new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [p([bold(t + ':', { size: 16 })])] });
  const tValue = (t) => new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [p([normal(t, { size: 16 })])] });

  const itemRows = [];
  for (const item of itens) {
    const unit = getUnitario(item);
    const tot = item.qtd * unit;
    let imgRun = null;
    if (item.image) {
      try {
        let b64 = item.image;
        if (!b64.startsWith('data:')) b64 = await getBase64ImageFromUrl(item.image);
        if (b64) {
          const buffer = Uint8Array.from(atob(b64.split(',')[1]), c => c.charCodeAt(0));
          imgRun = new ImageRun({ data: buffer, transformation: { width: 80, height: 80 } });
        }
      } catch (e) { console.error(e); }
    }

    itemRows.push(new TableRow({
      children: [
        new TableCell({ children: imgRun ? [p([imgRun], AlignmentType.CENTER)] : [] }),
        new TableCell({ children: [p([bold(item.nomeProduto || '', { size: 18 })])] }),
        new TableCell({ children: [p([normal(item.nomeExtra || '', { size: 16 })])] }),
        new TableCell({ children: [p([normal(String(item.qtd), { size: 18 })], AlignmentType.CENTER)] }),
        new TableCell({ children: [p([normal(fmtBRL(unit), { size: 18 })], AlignmentType.RIGHT)] }),
        new TableCell({ children: [p([bold(fmtBRL(tot), { size: 18 })], AlignmentType.RIGHT)] }),
      ]
    }));
  }

  const freteTexto = semFrete ? 'ISENTO' : fmtBRL(valorFrete);

  const doc = new Document({
    sections: [{
      children: [
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
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                hCell('Img', AlignmentType.CENTER, 10),
                hCell('ITEM', AlignmentType.LEFT, 17),
                hCell('DESCRIÇÃO', AlignmentType.LEFT, 38),
                hCell('QTD', AlignmentType.CENTER, 10),
                hCell('VALOR UNIT.', AlignmentType.RIGHT, 12),
                hCell('VALOR TOTAL', AlignmentType.RIGHT, 13),
              ]
            }),
            ...itemRows,
          ]
        }),
        p([]),
        ...(descontoPerc > 0 ? [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [
                    p([bold('DESCONTO', { size: 20, color: RED })]),
                  ]
                }),
                new TableCell({
                  borders: bNone, width: { size: 35, type: WidthType.PERCENTAGE }, children: [
                    p([normal(`- ${fmtBRL(valorDesconto)}`, { size: 20, color: RED })], AlignmentType.RIGHT),
                  ]
                }),
              ]
            })]
          }),
        ] : []),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [p([bold('FRETE:', { size: 20 })])] }),
                new TableCell({ borders: bNone, width: { size: 35, type: WidthType.PERCENTAGE }, children: [p([normal(freteTexto, { size: 20 })], AlignmentType.RIGHT)] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: bNone, width: { size: 65, type: WidthType.PERCENTAGE }, children: [p([bold('VALOR PRODUTOS + FRETE:', { size: 22 })])] }),
                new TableCell({ borders: bNone, width: { size: 35, type: WidthType.PERCENTAGE }, children: [p([bold(fmtBRL(totalGeral), { size: 22 })], AlignmentType.RIGHT)] }),
              ]
            }),
          ]
        }),
        p([]),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [tTitle('TERMOS E CONDIÇÕES GERAIS')] }),
            new TableRow({ children: [tLabel('Validade'), tValue('Orçamento válido por 5 dias úteis após o envio.')] }),
            ...TERMOS_PADRAO.map(t => new TableRow({ children: [tLabel(t.titulo), tValue(t.texto)] })),
          ]
        }),
        p([]),
        ...(observacoes ? [
          p([bold('OBSERVAÇÕES ESPECÍFICAS:', { size: 18 })]),
          p([normal(observacoes, { size: 18 })]),
          p([]),
        ] : []),
        p([]),
        p([bold('_________________________________________', { size: 18 })], AlignmentType.CENTER),
        p([bold('Assinatura / Kasaleve', { size: 18, color: MUTED })], AlignmentType.CENTER),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `Orcamento_${numero}.docx`; a.click();
  URL.revokeObjectURL(url);
};
