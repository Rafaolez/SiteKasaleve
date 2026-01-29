import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Buscar from '../components/Buscar';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";

function Clienti() {
  const { loggedin } = useContext(AuthContext);
  const [client, setCliente] = React.useState([]);

async function getCliente() {
    try {
      const res = await fetch('https://fakestoreapi.com/users');
      const json = await res.json();
      setCliente(json);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCliente();
  }, []);

 if (!loggedin) {
    return (
      <div className="body">
        <BTNVolta />
        <h2>Você precisa estar logado para acessar esta página.</h2>
      </div>
      
    );
  }

  return (
    <div className='Pia'>
      <MenuPage />

      <div className='CaixaBTN'>
        <BTNVolta />
        <div>
          <span className="BTNPC 0">Cadastro de Cliente</span>
          <span className="BTNPC 1">Cadastro de Cliente</span>
          <span className="BTNPC 2">Cadastro de Cliente</span>
          <span className="BTNPC 3">Cadastro de Cliente</span>
          <Buscar />
        </div>
      </div>

      <div className='ConteudiGeral'>
        <div className='ConteudoName'>
          <div className='CL Nome'><h3>Nome do Cliente</h3></div>
          <hr />
          <div className='CL CPF'><h3>CPF/CNPJ</h3></div>
          <hr />
          <div className='CL Status'><h3>Status</h3></div>
          <hr />
          <div className=' Btn321'></div>
        </div>

        {client.map(item => (
          <div className='Conteudo' key={item.id}>
            <div className='CL Nome'>
              {item.name.firstname} {item.name.lastname}
            </div>
            <hr />
            <div className='CL CPF'>
              {item.email}
            </div>
            <hr />
            <div className='CL Status'>
              Ativo
            </div>
            <hr />
            <div className='Btn321'>
              <button className='BTNC DE'>Detalhes</button>
              <button className='BTNC ED'>Editar</button>
              <button className='BTNC EX'>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Clienti;