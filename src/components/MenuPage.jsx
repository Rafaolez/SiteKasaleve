import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from '../Imagens/LogoKasaLeveBranca.png';
import "../css/MenuPage.css";
import React, { useContext } from 'react';
import { AuthContext } from "../Page/Context/AuthContext";

function MenuPage() {
  const { loggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Função para verificar se o link está ativo
  const isActive = (path) => location.pathname === path;

  // Links mostrados apenas para usuários logados
  const privateLinks = [
    { to: "/clienti", label: "Clientes" },
    { to: "/Orcamneto", label: "Orçamento" },
    { to: "/Foto", label: "Fotos" },
    { to: "/cadastroPro", label: "Produtos" },
  ];

  // Links mostrados para visitantes
  const publicLinks = [
    { to: "/Foto", label: "Fotos" },
  ];

  const linksToShow = loggedin ? privateLinks : publicLinks;

  return (
    <header className="mp-header">
      {/* Botão Voltar */}
      <button className="mp-back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Voltar
      </button>

      {/* Logo Central */}
      <Link to="/" className="mp-logo-link">
        <img src={Logo} alt="Kasaleve" className="mp-logo" />
      </Link>

      {/* Navegação */}
      <nav className="mp-nav">
        {linksToShow.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`mp-nav-link ${isActive(link.to) ? 'mp-nav-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default MenuPage;