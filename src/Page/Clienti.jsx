import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Buscar from '../components/Buscar';
import PGBTDetalhe from './PGBTDetalhe';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function Clienti() {
  const { loggedin, getCliente, client, setIdPegaCliente } = useContext(AuthContext);
  
  const [AddCliente, setAddCliente] = useState(true);


  

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
    <>

      {AddCliente ?
        <div className='Pia'>
          <MenuPage />

          <div className='CaixaBTN'>
            <BTNVolta />
            <div>
              <button onClick={() => { setAddCliente(false) }} className='BTNC DE'>Add</button>
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
                  <Link className='text' to={"/Detalhe"}><button route={'/Detalhe'} onClick={() => { setIdPegaCliente(item.id) }} className='BTNC DE'>Detalhes</button></Link>
                  <button className='BTNC ED'>Editar</button>
                  <button className='BTNC EX'>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        :
        <div>
          <h1>Add Cliente</h1>
          <button onClick={() => setAddCliente(true)} className='BTNCD Voltar'>Voltar</button>
        </div>
      } 


    </>
  );
}
export default Clienti;

