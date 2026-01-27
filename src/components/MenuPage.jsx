import { Link } from "react-router-dom";
import Logo from '../Imagens/LogoKasaLeveBranca.png';
import "../css/MenuPage.css";

function MenuPage() {
    return (
        <>
            <div className="cima">
                <img src={Logo} alt="Logo" className="logo" />
                <div className="CaminhoPage">
                    <Link className='text' to="/clienti"><screen className='Cliente text0'  >Cadastro de Cliente</screen></Link>
                    <Link className='text' to={"/"}><screen  className='Orcamento text0'>Orçamento</screen></Link>
                    <Link className='text' to={"/"}><screen className='Foto text0'>Fotos</screen></Link>
                    <Link className='text' to={"/"}><screen className='Produto text0'>Cadastro de Produto</screen></Link>
                </div>
            </div>
        </>
    );
}
export default MenuPage;
