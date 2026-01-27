import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';

function Clienti() {
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
          </div>
        </div>

        <div className='Conteudo'>
          <div className='Nome'>
            <h2>Nome do Cliente:</h2>
          </div>

          <div className='CPF'>
            <h2>CPF/CNPJ</h2>
          </div>

          <div className='Status'>
            <h2>Status</h2>
          </div>

          <div className='Btn321'>
            <h2>BTN</h2>
          </div>

        </div>


      </div>
    </>
  );
}
export default Clienti;