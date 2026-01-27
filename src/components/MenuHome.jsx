import { Link } from "react-router-dom";
import "../css/menuhome.css";
import Logo from '../Imagens/LogoKasaLeveBranca.png';

function MenuHome() {
    return (
        <>
            <div className="cima">
                <img src={Logo} alt="Logo" className="logo" />
                <div className="divButton">
                    <Link className="BTNLogin" to={"/Login"}><button className="BTNLogin" onClick={() => console.log('Button Pressed')}>Entrar</button></Link>
                </div>
            </div>
        </>
    );
}
export default MenuHome;