// ═══════════════════════════════════════════════════════════════
// SISTEMA DE RESPOSTAS INTELIGENTES DA IA
// ═══════════════════════════════════════════════════════════════

const BASE_DE_CONHECIMENTO = [
  {
    palavrasChave: ['preço', 'valor', 'quanto custa', 'tabela', 'custo', 'preco'],
    respostas: [
      "Sobre valores, trabalhamos com tabelas específicas. Para te passar o exato, qual modelo você teve interesse?",
      "Os preços variam conforme a linha. Posso te enviar nosso catálogo atualizado ou você já tem algo em vista?",
      "Consigo te fazer um orçamento rápido agora. Me diz qual produto e a quantidade, ok?"
    ],
    intencao: 'preco'
  },
  {
    palavrasChave: ['prazo', 'tempo', 'entrega', 'demora', 'chega', 'frete'],
    respostas: [
      "Nosso prazo padrão de produção é de 15 a 20 dias úteis, dependendo do volume. Faz sentido para o seu projeto?",
      "A entrega costuma sair rápida! Geralmente em até 10 dias após a confirmação do pagamento. Quer que eu verifique o estoque?",
      "Se for algo do nosso estoque rápido, consigo despachar em até 48h. O que você está precisando?"
    ],
    intencao: 'prazo'
  },
  {
    palavrasChave: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'ola'],
    respostas: [
      "Olá! Tudo bem? Aqui é da Kasaleve. Em que posso te ajudar hoje? 😊",
      "Oi, seja muito bem-vindo(a)! Estou à disposição. Viu algum produto que gostou?",
      "Hey! Que bom ter você aqui. Como posso auxiliar no seu projeto?"
    ],
    intencao: 'saudacao'
  },
  {
    palavrasChave: ['desconto', 'promoção', 'negociar', 'mais barato', 'promocao'],
    respostas: [
      "Conseguimos simular condições especiais para projetos maiores. Quantos itens você está levando em consideração?",
      "Para pagamento à vista, temos um desconto padrão na tabela. Quer que eu calcule já?",
      "Entendo! Vou precisar anotar seus dados para pedir uma aprovação de desconto especial. Qual seu nome?"
    ],
    intencao: 'desconto'
  },
  {
    palavrasChave: ['catálogo', 'pdf', 'enviar', 'material', 'informações', 'catalogo'],
    respostas: [
      "Claro! Vou gerar um PDF personalizado para você agora mesmo. Só me confirma seu e-mail ou WhatsApp?",
      "Posso te mandar todo o material por aqui mesmo. Qual linha te interessa mais?",
      "Já estou preparando o catálogo. Vou te enviar no final desta conversa, tá bom?"
    ],
    intencao: 'catalogo'
  },
  {
    palavrasChave: ['obrigado', 'valeu', 'thanks', 'agradeço', 'obrigada'],
    respostas: [
      "Por nada! Estou à disposição. Se precisar de mais alguma coisa, é só chamar! 😊",
      "Foi um prazer ajudar! Qualquer dúvida, estou por aqui.",
      "Disponha! Estou sempre disponível para te auxiliar."
    ],
    intencao: 'agradecimento'
  }
];

const RESPOSTAS_FALLBACK = [
  "Entendi perfeitamente. Vou anotar isso aqui e já repasso para o setor responsável. Mais alguma coisa?",
  "Show de bola! Para não esquecer nenhum detalhe, vou registrar isso no seu atendimento. Pode continuar...",
  "Pode deixar comigo. Vou verificar isso com calma e já te retorno, combinado? 📝",
  "Ótimo ponto! Me dá uns minutinhos que vou checar no nosso sistema e te dou uma resposta exata."
];

function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function calcularScore(mensagem, palavrasChave) {
  const msgNorm = normalizarTexto(mensagem);
  let matches = 0;
  for (const palavra of palavrasChave) {
    if (msgNorm.includes(normalizarTexto(palavra))) matches++;
  }
  return matches > 0 ? matches * 10 : 0;
}

function escolherRespostaAleatoria(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function gerarRespostaIA(mensagemDoUsuario) {
  return new Promise((resolve) => {
    let melhorMatch = null;
    let melhorScore = 0;

    for (const item of BASE_DE_CONHECIMENTO) {
      const score = calcularScore(mensagemDoUsuario, item.palavrasChave);
      if (score > melhorScore) {
        melhorScore = score;
        melhorMatch = item;
      }
    }

    let respostaEscolhida;
    if (melhorMatch && melhorScore >= 10) {
      respostaEscolhida = escolherRespostaAleatoria(melhorMatch.respostas);
    } else {
      respostaEscolhida = escolherRespostaAleatoria(RESPOSTAS_FALLBACK);
    }

    const tempoDigitacao = Math.floor(Math.random() * 2000) + 1500;
    setTimeout(() => resolve(respostaEscolhida), tempoDigitacao);
  });
}