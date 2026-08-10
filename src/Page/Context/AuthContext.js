import { createContext, useState, useEffect } from "react";
import { api, ApiError } from "../../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    // Começa como "carregando" e confirma com o backend se já existe uma sessão
    // válida (cookie httpOnly) antes de decidir o estado de login — isso evita
    // both um "flash" de conteúdo protegido e a necessidade de guardar token no
    // localStorage (mais seguro contra roubo de token via XSS).
   
   
    /*const [loggedin, setLoggedin] = useState(() => !!localStorage.getItem('token'));
    const [role, setRole] = useState(() => localStorage.getItem('role') || null);//Quando tiver a API, somente par isso*/

    const [loggedin, setLoggedin] = useState(true);
    const [role, setRole] = useState("Programador"); // quando não estiver fincionando*/

    const [carregandoSessao, setCarregandoSessao] = useState(true);

    const [id, setId] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Dados do Cliente
    const [client, setCliente] = useState([]);
    const [IdPegaCliente, setIdPegaCliente] = useState(null);
    const clienteSelecionado = client.find(item => item.id === IdPegaCliente);

    // Ao carregar o app, verifica se já existe uma sessão ativa no backend.
    useEffect(() => {
        (async () => {
            try {
                const usuario = await api.get('/api/auth/me');
                aplicarUsuarioLogado(usuario);
            } catch {
                // Sem sessão ativa — comportamento normal para quem ainda não logou.
            } finally {
                setCarregandoSessao(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function aplicarUsuarioLogado(usuario) {
        setUser(usuario);
        setId(usuario.usuarioId);
        setRole(usuario.cargo || 'Vendedora');
        setLoggedin(true);
    }

    async function Login(username, password) {
        setError(null);

        if (!username || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // O backend espera "Email" — o campo de usuário do formulário deve
            // conter o email cadastrado.
            const usuario = await api.post('/api/auth/login', { email: username, senha: password });
            aplicarUsuarioLogado(usuario);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                setError('Email ou senha incorretos.');
            } else {
                setError('Erro ao conectar com o servidor.');
            }
        }
    }

    // Função de Logout (Boa prática adicionar)
    async function Logout() {
        try {
            await api.post('/api/auth/logout');
        } catch {
            // mesmo se a chamada falhar, limpa o estado local
        }
        setLoggedin(false);
        setRole(null);
        setUser(null);
        setId(null);
    }

    async function getCliente() {
        try {
            const clientes = await api.get('/api/clientes');
            setCliente(clientes);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
        }
    }

    return (
        <AuthContext.Provider value={{
            loggedin,
            carregandoSessao,
            Login,
            Logout, // Disponibilizando o logout
            error,
            user,
            role,   // NOVO: Disponibilizando o cargo para a Home
            setLoggedin,
            id,
            client,
            getCliente,
            setIdPegaCliente,
            IdPegaCliente,
            clienteSelecionado,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
