import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    // Inicia verificando se já tem token salvo (para não deslogar ao recarregar)
    const [loggedin, setLoggedin] = useState(true);
    const [role, setRole] = useState("Programador"); // */ 
     /*const [loggedin, setLoggedin] = useState(() => !!localStorage.getItem('token'));
     const [role, setRole] = useState(() => localStorage.getItem('role') || null); // NOVO: Estado do cargo*/

    const [id, setId] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Dados do Cliente
    const [client, setCliente] = useState([]);
    const [IdPegaCliente, setIdPegaCliente] = useState(null);
    const clienteSelecionado = client.find(item => item.id === IdPegaCliente);

    async function Login(username, password) {
        setError(null);

        if (!username || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const res = await fetch("https://fakestoreapi.com/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const json = await res.json();

            if (json.token) {
                localStorage.setItem('token', json.token);
                setUser(json);
                setLoggedin(true);

                // ─── LÓGICA FALSA DE CARGO ───
                // Define o cargo baseado no nome de usuário digitado
                let assignedRole = "Vendedora"; // Padrão para qualquer usuário desconhecido

                if (username.toLowerCase() === "Programador") {
                    assignedRole = "Programador";
                } else if (username.toLowerCase() === "Chefa") {
                    assignedRole = "Chefa";
                } else if (username.toLowerCase() === "GerenteVendas") {
                    assignedRole = "GerenteVendas";
                }else if (username.toLowerCase() === "Vendedora") {
                    assignedRole = "Vendedora";
                }

                setRole(assignedRole);
                localStorage.setItem('role', assignedRole); // Salva o cargo
                // ─────────────────────────────

            } else {
                setError(json.message || 'Email ou senha incorretos.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor.');
        }
    }

    // Função de Logout (Boa prática adicionar)
    function Logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setLoggedin(false);
        setRole(null);
        setUser(null);
    }

    async function getCliente() {
        try {
            const res = await fetch('https://fakestoreapi.com/users');
            const json = await res.json();
            setCliente(json);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
        }
    }

    return (
        <AuthContext.Provider value={{
            loggedin,
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