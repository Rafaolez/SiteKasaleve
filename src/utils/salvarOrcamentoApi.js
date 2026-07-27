import { api, ApiError } from '../services/api';

// Monta o payload esperado pela API (OrcamentoInputDto) a partir do estado
// da tela de Orçamento e envia para o backend, dentro de uma transação
// no servidor (ou salva tudo — orçamento + itens —, ou nada é salvo).
export async function salvarOrcamento({ clienteId, itens, getUnitario, valorFrete, observacoes, corAluminio, corCorda, corTecido }) {
  if (!clienteId) {
    throw new Error('Selecione um cliente já cadastrado no sistema para salvar o orçamento (o cadastro rápido ainda não gera um ID do banco).');
  }

  const itensValidos = itens.filter(i => (i.nomeProduto || '').trim().length > 0);
  if (itensValidos.length === 0) {
    throw new Error('Adicione ao menos um item com produto selecionado antes de salvar.');
  }

  const payload = {
    clienteId: Number(clienteId),
    corAluminio: corAluminio || null,
    corCorda: corCorda || null,
    corTecido: corTecido || null,
    valorFrete: Number(valorFrete) || 0,
    observacoes: observacoes || null,
    // O catálogo exibido no site (assets/ProdutosAPILocal.js) ainda é local e não
    // corresponde 1:1 à tabela Produto do banco, então o item é salvo com o nome
    // livre + preço já calculado (com desconto aplicado) no momento do orçamento.
    itens: itensValidos.map(item => ({
      produtoId: null,
      nomeProdutoLivre: [item.nomeProduto, item.nomeExtra].filter(Boolean).join(' - '),
      quantidade: Number(item.qtd) || 1,
      valorUnitario: getUnitario(item),
      descricaoItem: item.descontoItem > 0 ? `Desconto aplicado: ${item.descontoItem}%` : null
    }))
  };

  try {
    return await api.post('/api/orcamentos', payload);
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.dados?.message || err.message);
    }
    throw err;
  }
}
