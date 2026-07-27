
// ─── DADOS DA EMPRESA ──
export const DADOS_EMPRESA = {
  nome: 'kasaleve',
  subtitulo: 'projeto • conforto',
  razaoSocial: 'Kasaleve Industria Decor Moveis LTDA',
  endereco: 'Avenida Craveiro e Cravinho 1001 - Parque Industrial Fuad Razuk - Pederneiras SP',
  site: 'www.kasaleve.com.br',
  telefone: '14 9.9893.9852',
};

export const API_CLIENTES = [
  { id: 1, nome: 'João Silva', telefone: '(11) 99999-1111', endereco: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01310-100', cpf: '123.456.789-00', ie: '1234567890', bairro: 'Centro' },
  { id: 2, nome: 'Maria Souza', telefone: '(19) 98888-2222', endereco: 'Av. Brasil, 456', cidade: 'Pederneiras', estado: 'SP', cep: '16400-000', cpf: '987.654.321-00', ie: '0987654321', bairro: 'Jardim' },
];

// ─── PERFIS DE PREÇO (somente 2) ──
export const PERFIS_PRECO = [
  { id: 'padrao', label: 'Padrão' },
  { id: 'lojista', label: 'Lojista' },
];

export const FRETE_PERCENT = 0.085;

// ─── CIDADES DA REGIÃO DE PEDERNEIRAS (FRETE ISENTO) ──
export const CIDADES_SEM_FRETE = [
  'Pederneiras', 'Bauru', 'Agudos', 'Lençóis Paulista', 'Piratininga',
  'Avaí', 'Bocaina', 'Ubirajara', 'Iacanga', 'Arealva',
  'Duartina', 'Pongaí', 'Macatuba', 'Bariri', 'Boracéia',
  'Areiópolis', 'Getulina', 'Igaraçu do Tietê', 'Grosfillex',
];

const CIDADES_SEM_FRETE_NORM = new Set(
  CIDADES_SEM_FRETE.map(m => m.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase())
);

export function ehRegiaoSemFrete(cidade) {
  if (!cidade) return false;
  const c = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  return CIDADES_SEM_FRETE_NORM.has(c);
}

export const fmtBRL = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const gerarNumero = () => `KL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

export const ITEM_VAZIO = () => ({ id: Date.now() + Math.random(), nomeProduto: '', nomeExtra: '', qtd: 1, unitarioPadrao: 0, image: '', _tampo: '', _medidaIdx: 0, _cores: {}, descontoItem: 0 });

export const CLIENTE_VAZIO = { nome: '', telefone: '', email: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cpf: '', ie: '', vendedora: '' };

export const TERMOS_PADRAO = [
  { titulo: 'Descrição dos Móveis', texto: 'O VENDEDOR declara que os móveis fornecidos serão fabricados conforme as especificações descritas neste documento.' },
  { titulo: 'Data de Entrega', texto: 'A KASALEVE se compromete a entregar os móveis conforme o cronograma acordado.' },
  { titulo: 'Qualidade e Durabilidade', texto: 'Os móveis serão fabricados com materiais de qualidade e durabilidade adequadas. A KASALEVE garante que os móveis atenderão aos padrões exigidos.' },
  { titulo: 'Pagamento e Sinal', texto: 'O COMPRADOR se compromete a não desistir do pedido após confirmação e o pagamento do sinal.' },
  { titulo: 'Rescisão e Penalidades', texto: 'Em caso de descumprimento das obrigações, as partes poderão rescindir o contrato mediante notificação por escrito. O COMPRADOR estará sujeito a penalidades em caso de desistência após o pagamento do sinal.' },
  { titulo: 'Foro', texto: 'Fica eleito o foro da cidade de [informar a cidade do cliente] para dirimir quaisquer questões decorrentes deste contrato.' },
];

export const TAMPOS_PADRAO = ['Ripado', 'Pizza', 'Alumínio'];
export const STATUS_MESA = ['Mesa de Centro', 'Mesa de Canto', 'Mesa', 'Mesa de Jantar', 'Champanheira', 'Bistrô'];

export const iconesCategoria = {
  'Sofá': '🛋️', 'Poltrona': '💺', 'Mesa de Centro': '◀▶', 'Mesa de Canto': '◇', 'Mesa': '◻',
  'Chaise': '☀', 'Cadeira': '🪑', 'Banqueta': '🔘', 'Modular': '⬡', 'Puff': '◉',
  'Balanço': '🌙', 'Espreguiçadeira': '∽', 'Acessório': '⚙', 'Champanheira': '🥂',
  'Bistrô': '🍽️', 'Mesa de Jantar': '▫', 'Tapete': '🟫', 'Caminha': '🐕',
};

export async function buscarCEP(cep) {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const j = await r.json();
    if (j.erro) return null;
    return { endereco: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf };
  } catch { return null; }
}

export const getBase64ImageFromUrl = async (imageUrl) => {
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

export function ehMesa(status) { return STATUS_MESA.includes(status); }

export function getTamposDoProduto(produto) {
  if (!produto || !ehMesa(produto.status)) return null;
  const existentes = [...new Set((produto.variacoes || []).filter(v => v.tampo).map(v => v.tampo))];
  return existentes.length > 0 ? existentes : TAMPOS_PADRAO;
}

export function temVariacaoParaTampo(produto, tampo) {
  return (produto.variacoes || []).some(v => v.tampo === tampo);
}