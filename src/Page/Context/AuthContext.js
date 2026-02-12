import { createContext, useState } from "react";
import React, { useEffect } from 'react';

export const AuthContext = createContext(0);

function AuthProvider({ children }) {

    const [loggedin, setLoggedin] = useState(true);
    const [id, setId] = useState()
    const [error, setError] = useState(null);
    const [user, SetUser] = useState(false);
    const [client, setCliente] = React.useState([]);
    const [IdPegaCliente, setIdPegaCliente] = useState(null);
      const clienteSelecionado = client.find( item => item.id === IdPegaCliente);


    //Função de login

    async function Login(username, password) {
        // lógica de login
        setError(null);
        if (username != "" && password != "") {
            await fetch("https://fakestoreapi.com/auth/login", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=UTF-8'
                },
                //metodo de login
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                //PEGA AS INFORMAÇÕES DO JEITO QUE A API DEVOLVE
                .then(res => res.json())
                .then(json => {
                    if (json.Id) {
                        setId(json.Id)
                        SetUser(json);
                        setLoggedin(true);
                    }
                    else {
                        setError(json.message || 'Email ou senha incorretos.');
                    }
                })
                .catch(err => setError('Erro ao conectar com o servidor.'));
        } else {
            setError('Por favor, preencha todos os campos.');
        }
    }

    //DeltalhePGCliente

    async function getCliente() {
        try {
          const res = await fetch('https://fakestoreapi.com/users');
          const json = await res.json();
          setCliente(json);
        } catch (err) {
          console.log(err);
        }
      }

    return (
        <AuthContext.Provider value={{
            loggedin: loggedin,
            Login,
            error: error,
            user: user,
            setLoggedin,
            id: id,

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




