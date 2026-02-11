import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Buscar from '../components/Buscar';
import PGBTDetalhe from '../components/PGBTDetalhe';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";

function Clienti() {
  const { loggedin } = useContext(AuthContext);
  const [client, setCliente] = React.useState([]);
  const [test, setTest] = React.useState(true);
  const [IdPegaCliente, setIdPegaCliente] = useState(null);

  const clienteSelecionado = client.find(
    item => item.id === IdPegaCliente
  );


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
    <>

      {test ?
        <div className='Pia'>
          <MenuPage />

          <div className='CaixaBTN'>
            <BTNVolta />
            <div>
              <span className="BTNPC 0">Cadastro de Cliente</span>
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
                  <button onClick={() => { setTest(false); setIdPegaCliente(item.id); }} className='BTNC DE'>Detalhes</button>
                  <button className='BTNC ED'>Editar</button>
                  <button className='BTNC EX'>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        :
        <div>
          <h1>Detalhes do Cliente</h1>
          <p>Aqui você pode encontrar informações detalhadas sobre o cliente selecionado.</p>
          <button onClick={() => setTest(true)} className='BTNC Voltar'>Voltar</button>

          <div>
            {clienteSelecionado && (
              <div className='CXDetalhe'>
                <div className='CXDetalheInfo CXDetalhe254'>
                  {clienteSelecionado.name.firstname} {clienteSelecionado.name.lastname}
                </div>

                <hr/>

                <div className='CXDetalheCPF CXDetalhe254'>
                  {clienteSelecionado.email}
                </div>

                <hr/>

                <div className='CXDetalheStatus CXDetalhe254'>
                  Ativo
                </div>

                <hr/>

                <div className='CXDetalheOutro CXDetalhe254'>
                  <h1>Endereço: efjoejoe efojeofj</h1>
                </div>
              </div>
            )}
          </div>

          <div className='CXDetalheBTNS'>
            <button onClick={() => setTest(true)} className='BTNCD Voltar'>Voltar</button>
            <button className='BTNCD ED'>Editar</button>
            <button className='BTNCD EX'>Excluir</button>
          </div>

        </div>
      }


    </>
  );
}
export default Clienti;

