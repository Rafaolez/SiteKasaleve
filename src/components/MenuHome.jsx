import { Link, useLocation } from "react-router-dom";
import "../css/menuhome.css";
import Logo from '../Imagens/LogoKasaLeveBranca.png';

function MenuHome() {
  const location = useLocation();

  return (
    <header className="mh-header">
      {/* Logo */}
      <Link to="/" className="mh-logo-link">
        <img src={Logo} alt="Kasaleve" className="mh-logo" />
      </Link>

      {/* Tagline central */}
      <p className="mh-tagline">
        projeto <span className="mh-tagline__dot">·</span> conforto <span className="mh-tagline__dot">·</span> qualidade
      </p>

      {/* Ações */}
      <div className="mh-actions">
        <Link to="/Login" className="mh-btn-login">
          Entrar
          <span className="mh-btn-login__arrow">→</span>
        </Link>
      </div>
    </header>
  );
}

export default MenuHome;