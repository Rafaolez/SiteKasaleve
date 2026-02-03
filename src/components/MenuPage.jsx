import { Link } from "react-router-dom";
import Logo from '../Imagens/LogoKasaLeveBranca.png';
import "../css/MenuPage.css";

function MenuPage() {
    return (
        <>
            <div className="cima">
                <img src={Logo} alt="Logo" className="logo" />
                <div className="CaminhoPage">
                    <Link className='text' to="/clienti"><screen className='ClienteMP text0MP'  >Cadastro de Cliente</screen></Link>
                    <Link className='text' to={"/Orcamneto"}><screen  className='OrcamentoMP text0MP'>Orçamento</screen></Link>
                    <Link className='text' to={"/Foto"}><screen className='FotoMP text0MP'>Fotos</screen></Link>
                    <Link className='text' to={"/cadastroPro"}><screen className='ProdutoMP text0MP'>Cadastro de Produto</screen></Link>
                </div>
            </div>
        </>
    );
}
export default MenuPage;
