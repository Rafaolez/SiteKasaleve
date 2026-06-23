import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [loggedin, setLoggedin] = useState(false); // Mudei para false para poder testar o login
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

            // CORREÇÃO: A FakeStoreAPI retorna um "token", não um "Id"
            if (json.token) {
                localStorage.setItem('token', json.token); // Boa prática salvar o token
                setUser(json);
                setLoggedin(true);
            } else {
                setError(json.message || 'Email ou senha incorretos.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor.');
        }
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
            error,
            user,
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