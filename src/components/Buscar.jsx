import '../css/Buscar.css';
import React, { useEffect, useState } from 'react';


function Buscar() {

    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(false);
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState([]);

    function SeleUser(user) {
        const nomeCompleto = `${user.name.firstname} ${user.name.lastname}`;

        setBusca(nomeCompleto);     // completa o input
        setFiltro([]);           // fecha a lista
    }



    async function getUsuarios() {
        await fetch('https://fakestoreapi.com/users', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => (res.ok == true) ? res.json() : false)
            .then(json => setUsuarios(json))
            .catch(error => setError(true))
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    useEffect(() => {
        if (!busca) {
            setFiltro([]);
            return;
        }

        const resultado = usuarios.filter((item) =>
            `${item.name.firstname} ${item.name.lastname}`
                .toLowerCase()
                .includes(busca.toLowerCase())
        );

        setFiltro(resultado);
    }, [busca, usuarios]);


    return (
        <>
            <div className='CaixaBTN'>
                <input
                    className="InputBusca"
                    type="text"
                    placeholder="Buscar usuários"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {filtro.length > 0 && (
                    <ul className="lista-resultados">
                        {filtro.map((user) => (
                            <li key={user.id} className="item" onClick={() => SeleUser(user)}>
                                {user.name.firstname} {user.name.lastname}
                            </li>
                        ))}
                    </ul>
                )}
                {busca && filtro.length === 0 && <div className="spinner" />}
            </div>
        </>);

}

export default Buscar;