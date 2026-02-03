import React from 'react';
import '../css/Home.css';
import MenuHome from '../components/MenuHome';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <MenuHome className="MenuHome" />
      <div className='TelaMeio'>

        <div className='TDbuttons'>
          <Link className='text' to="/clienti"><button className='ClienteH BTN'  >Cadastro de Cliente</button></Link>
          <Link className='text' to={"/Orcamneto"}><button route={'/clienti'} className='OrcamentoH BTN'>Orçamento</button></Link>
          <Link className='text' to={"/Foto"}><button className='FotoH BTN'>Fotos</button></Link>
          <Link className='text' to={"/cadastroPro"}><button className='ProdutoH BTN'>Cadastro de Produto</button></Link>
        </div>
        <div className="PTmensagem">
          <h2>Welcome to the Home Page!</h2>
          <p>This is where you can find the latest updates and features.</p>
        </div>
      </div>
    </>
  );
}
export default Home;