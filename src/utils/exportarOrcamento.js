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
  totalProdutos,
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
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('SUBTOTAL:', c4, y + 6);
  doc.setFillColor(225, 225, 225); doc.rect(c6 - 55, y, 55, 9, 'F');
  doc.setDrawColor(150); doc.rect(c6 - 55, y, 55, 9);
  doc.text(fmtBRL(totalProdutos), c6 - 52, y + 6); y += 18;

  const colDivisor = L + 55;
  doc.setDrawColor(0); doc.setLineWidth(0.3); doc.rect(L, y, R - L, 8);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('TERMOS E CONDIÇÕES GERAIS', (L + R) / 2, y + 5.5, { align: 'center' }); y += 8;

  if (descontoPerc > 0) {
    doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(200, 30, 30);
    doc.text('DESCONTO', L + 2, y + 6);
    doc.text(`- ${fmtBRL(valorDesconto)}`, colDivisor + 3, y + 6);
    doc.setTextColor(0, 0, 0); y += 9;
  }

  doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('FRETE', L + 2, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(semFrete ? 'ISENTO ' : fmtBRL(valorFrete), colDivisor + 3, y + 6); y += 9;

  doc.rect(L, y, R - L, 9); doc.line(colDivisor, y, colDivisor, y + 9);
  doc.setFont('helvetica', 'bold'); doc.text('VALOR PRODUTOS + FRETE', L + 2, y + 6);
  doc.text(fmtBRL(totalGeral), colDivisor + 3, y + 6); y += 9;

  doc.rect(L, y, R - L, 10); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  doc.text('Orçamento válido por 5 úteis dias após o envio.', L + 2, y + 6); y += 10;

  doc.rect(L, y, R - L, 8); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text('TERMOS E CONDIÇÕES:', (L + R) / 2, y + 5.5, { align: 'center' }); y += 14;

  doc.setFontSize(8.5);
  TERMOS_PADRAO.forEach(t => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold'); const tituloW = doc.getTextWidth(t.titulo + ': ');
    doc.text(`${t.titulo}:`, L, y); doc.setFont('helvetica', 'normal');
    const linhas = doc.splitTextToSize(t.texto, (R - L) - tituloW - 2);
    doc.text(linhas[0], L + tituloW, y);
    for (let k = 1; k < linhas.length; k++) { y += 4; doc.text(linhas[k], L, y); }
    y += 6;
  });

  if (observacoes) {
    if (y > 250) { doc.addPage(); y = 20; }
    y += 4; doc.setDrawColor(150); doc.line(L, y, R, y); y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('OBSERVAÇÕES ESPECÍFICAS:', L, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    const obsLines = doc.splitTextToSize(observacoes, R - L); doc.text(obsLines, L, y); y += obsLines.length * 4;
  }

  y = Math.max(y + 20, 270);
  doc.setLineWidth(0.3); doc.setDrawColor(0);
  doc.line((L + R) / 2 - 40, y - 4, (L + R) / 2 + 40, y - 4);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('Assinatura / Kasaleve', (L + R) / 2, y, { align: 'center' });
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
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle, ShadingType, ImageRun } = await import('docx');

  const RED = 'C81E1E';
  const DARK = '3C3C3C';
  const BLUE = '2563EB';
  const GRAY_BG = 'E1E1E1';
  const TEXT = '1A1A1A';
  const MUTED = '555555';
  const WHITE = 'FFFFFF';

  const bold = (t, o = {}) => new TextRun({ text: t, bold: true, color: o.color || TEXT, size: o.size || 20, font: 'Arial' });
  const normal = (t, o = {}) => new TextRun({ text: t, color: o.color || TEXT, size: o.size || 20, font: 'Arial' });
  const italic = (t, o = {}) => new TextRun({ text: t, italics: true, color: o.color || MUTED, size: o.size || 20, font: 'Arial' });
  const p = (children, align = AlignmentType.LEFT, sp = {}) => new Paragraph({ children, alignment: align, spacing: { before: sp.before || 0, after: sp.after || 0, line: 240 } });

  const bThin = { top: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, left: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }, right: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' } };
  const bDark = { top: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 2, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 2, color: '000000' } };
  const bNone = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  const bThickRight = { ...bThin, right: { style: BorderStyle.SINGLE, size: 8, color: '999999' } };

  const sGray = { type: ShadingType.CLEAR, fill: GRAY_BG };
  const sDark = { type: ShadingType.CLEAR, fill: DARK };
  const sWhite = { type: ShadingType.CLEAR, fill: WHITE };

  const extractBase64 = (dataUrl) => {
    if (!dataUrl) return null;
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const mimeMatch = parts[0].match(/data:image\/(\w+);/);
    const type = mimeMatch ? mimeMatch[1] : 'png';
    return { data: parts[1], type };
  };

  const cFull = (label, val, gray = true) => new TableCell({
    borders: bThin, columnSpan: 2, shading: gray ? sGray : sWhite,
    children: [p([bold(label + ' ', { size: 16 }), normal(val || '', { size: 18 })])]
  });
  const cHalf = (label, val, gray = true) => new TableCell({
    borders: bThin, shading: gray ? sGray : sWhite, width: { size: 50, type: WidthType.PERCENTAGE },
    children: [p([bold(label + ' ', { size: 16 }), normal(val || '', { size: 18 })])]
  });
  const row2 = (l1, v1, l2, v2, g = true) => new TableRow({ children: [cHalf(l1, v1, g), cHalf(l2, v2, g)] });

    // Funções auxiliares que faltavam para os termos de condições
  const tLabel = (txt) => new TableCell({
    borders: bDark, width: { size: 35, type: WidthType.PERCENTAGE }, shading: sGray,
    children: [p([bold(txt, { size: 18 })])]
  });
  const tValue = (txt) => new TableCell({
    borders: bDark, width: { size: 65, type: WidthType.PERCENTAGE },
    children: [p([normal(txt, { size: 18 })])]
  });

  const hCell = (txt, align = AlignmentType.LEFT, w) => {
    const o = { borders: bThin, shading: sDark, verticalAlign: 'center', children: [p([bold(txt, { color: WHITE, size: 16 })], align)] };
    if (w) o.width = { size: w, type: WidthType.PERCENTAGE };
    return new TableCell(o);
  };

  const dCell = (children, align = AlignmentType.LEFT, w, thickRight = false) => {
    const o = { borders: thickRight ? bThickRight : bThin, verticalAlign: 'center', children };
    if (w) o.width = { size: w, type: WidthType.PERCENTAGE };
    return new TableCell(o);
  };

  const itemRows = [];
  for (const item of itens) {
    const desc = [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' — ');
    const u = getUnitario(item);
    const tot = Number(item.qtd) * u;

    let imgParagraph = p([normal('—', { size: 14, color: 'CCCCCC' })], AlignmentType.CENTER);
    if (item.image) {
      try {
        const b64 = await getBase64ImageFromUrl(item.image);
        const extracted = extractBase64(b64);
        if (extracted) {
          const imgType = (extracted.type === 'jpg' || extracted.type === 'jpeg') ? 'jpg' : 'png';
          imgParagraph = p([new ImageRun({
            data: extracted.data,
            transformation: { width: 45, height: 45 },
            type: imgType
          })], AlignmentType.CENTER);
        }
      } catch (e) { /* fallback */ }
    }

    itemRows.push(new TableRow({
      children: [
        dCell([imgParagraph], AlignmentType.CENTER, 10),
        dCell([p([normal(item.nomeProduto || '—', { size: 16 })])], AlignmentType.LEFT, 17),
        dCell([p([normal(desc || '—', { size: 16 })])], AlignmentType.LEFT, 38),
        dCell([p([normal(String(item.qtd), { size: 16 })])], AlignmentType.CENTER, 10),
        dCell([p([normal(fmtBRL(u), { size: 16 })])], AlignmentType.RIGHT, 12, true),
        dCell([p([normal(fmtBRL(tot), { size: 16 })])], AlignmentType.RIGHT, 13),
      ]
    }));
  }

  const freteTexto = semFrete ? 'ISENTO ' : fmtBRL(valorFrete);

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 600, right: 600, bottom: 500, left: 600 } }
      },
      children: [
        p([bold('kasaleve', { size: 48, color: '2A2A2A' })], AlignmentType.LEFT, { after: 0 }),
        p([normal('projeto  •  conforto', { size: 18, color: MUTED })], AlignmentType.LEFT, { after: 0 }),
        p([bold(DADOS_EMPRESA.razaoSocial, { size: 14 })], AlignmentType.RIGHT, { after: 0 }),
        p([normal(DADOS_EMPRESA.endereco, { size: 14, color: MUTED })], AlignmentType.RIGHT, { after: 0 }),
        p([normal(DADOS_EMPRESA.site, { size: 14, color: BLUE })], AlignmentType.RIGHT, { after: 0 }),
        p([normal(DADOS_EMPRESA.telefone, { size: 14, color: MUTED })], AlignmentType.RIGHT, { after: 200 }),
        
        p([bold('ORÇAMENTO', { size: 38, color: RED })], AlignmentType.LEFT),
        p([bold('Enviado em: ', { size: 18 }), bold(dataEmissao, { size: 18 })], AlignmentType.RIGHT, { after: 200 }),

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
        p([], AlignmentType.LEFT, { before: 200, after: 200 }),

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
        p([], AlignmentType.LEFT, { before: 200, after: 200 }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            ...(descontoPerc > 0 ? [new TableRow({ children: [tLabel('DESCONTO'), tValue(`- ${fmtBRL(valorDesconto)}`)] })] : []),
            new TableRow({ children: [tLabel('FRETE'), tValue(freteTexto)] }),
            new TableRow({ children: [tLabel('VALOR PRODUTOS + FRETE'), tValue(fmtBRL(totalGeral))] }),
          ]
        }),
        p([italic('Orçamento válido por 5 úteis dias após o envio.', { size: 16 })], AlignmentType.LEFT, { before: 100, after: 300 }),

        p([bold('TERMOS E CONDIÇÕES:', { size: 20 })], AlignmentType.CENTER, { after: 100 }),
        ...TERMOS_PADRAO.flatMap(t => [
            p([bold(t.titulo + ': ', { size: 17 }), normal(t.texto, { size: 17, color: '333333' })], AlignmentType.JUSTIFIED, { before: 40, after: 60 })
        ]),

        ...(observacoes ? [
          p([bold('OBSERVAÇÕES ESPECÍFICAS:', { size: 18 })], AlignmentType.LEFT, { before: 200, after: 100 }),
          p([normal(observacoes, { size: 17 })], AlignmentType.LEFT)
        ] : []),

        p([], AlignmentType.CENTER, { before: 800 }),
        p([normal('________________________________________________', { color: '999999' })], AlignmentType.CENTER),
        p([bold('Assinatura / Kasaleve', { size: 18 })], AlignmentType.CENTER),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Orcamento_${numero}.docx`;
  a.click();
};