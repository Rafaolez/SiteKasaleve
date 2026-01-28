import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Buscar from '../components/Buscar';
import React, { useState, useEffect } from 'react';

function Clienti() {

  const [client, setCliente] = React.useState([]);

  async function getCliente() {
    await fetch('https://fakestoreapi.com/users', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        setCliente(json);
      })

      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCliente();
  }, []);

  return (
    <>
      <div className='Pia'>
        <div><MenuPage /></div>
        <div className='CaixaBTN'>
          <BTNVolta />
          <div>
            <span className="BTNPC 0">Cadastro de Cliente</span>
            <samp className="BTNPC 1">Cadastro de Cliente</samp>
            <samp className="BTNPC 2">Cadastro de Cliente</samp>
            <samp className="BTNPC 3">Cadastro de Cliente</samp>
            <Buscar className="Buscar" />
          </div>
        </div>

        <div className='ConteudiGeral'>
          <div className='ConteudoName '>
            <div className='CL Nome'>
              <h3>Nome do Cliente:</h3>
            </div>
            <hr />
            <div className='CL CPF'>
              <h3>CPF/CNPJ</h3>
            </div>
            <hr />
            <div className='CL Status'>
              <h3>Status</h3>
            </div>
            <hr />
            <div className='Btn321'>
              <h2></h2>
            </div>
          </div>
          {client.map((item) => (
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
                <h>Ativo</h>
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
    </>
  );

}
export default Clienti;