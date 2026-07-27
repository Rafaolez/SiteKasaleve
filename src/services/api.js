// Camada única de acesso à API do backend (BancoDados_Kasaleve_SistemaTudo).
// Centraliza a URL base, o envio de cookies de autenticação e o tratamento de erros
// para que as telas não precisem repetir fetch/try-catch em todo lugar.

// Configure a URL do backend em um arquivo .env na raiz do projeto React:
//   REACT_APP_API_URL=https://localhost:7000
// (ajuste a porta conforme o profile HTTPS exibido pelo Visual Studio ao rodar o backend)
const BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7000';

class ApiError extends Error {
  constructor(message, status, dados) {
    super(message);
    this.status = status;
    this.dados = dados;
  }
}

async function request(path, options = {}) {
  const resposta = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // envia/recebe o cookie httpOnly de autenticação
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  // 204 No Content não tem corpo para ler
  if (resposta.status === 204) return null;

  let dados = null;
  const texto = await resposta.text();
  if (texto) {
    try { dados = JSON.parse(texto); } catch { dados = texto; }
  }

  if (!resposta.ok) {
    const mensagem = (dados && (dados.message || dados.title)) || 'Erro ao comunicar com o servidor.';
    throw new ApiError(mensagem, resposta.status, dados);
  }

  return dados;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' })
};

export { ApiError };
