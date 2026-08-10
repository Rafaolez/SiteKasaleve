import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Page/Context/AuthContext'; 
import '../css/MenuDeLado.css';

function MenuDeLado() {
  // 1. Pega o status de login e o cargo do Contexto
  const { loggedin, role } = useContext(AuthContext);
  const [menuAberto, setMenuAberto] = useState(false);

  const alternarMenu = () => setMenuAberto(!menuAberto);
  const fecharMenu = () => setMenuAberto(false);

  const TodaNavegacao = [
    { to: "/Estoque",    label:"Estoque", icon:"📦", desc:"Gerencie o seu Estoque", color: "#E8F4FD", accent: "#ab2e2e" },
    { to: "/clienti", label: "Clientes", icon: "👥", desc: "Gerencie sua base de clientes", color: "#E8F4FD", accent: "#2E86AB" },
    { to: "/Orcamneto", label: "Orçamento", icon: "📋", desc: "Crie e acompanhe orçamentos", color: "#FFF8E7", accent: "#F4A261" },
    { to: "/Foto", label: "Fotos", icon: "🖼️", desc: "Galeria de projetos e produtos", color: "#F0FDF4", accent: "#2D9B5A" },
    { to: "/cadastroPro", label: "Cadastro de Produto", icon: "🏷️", desc: "Gerencie o catálogo de produtos", color: "#F5F0FF", accent: "#7C3AED" },
    { to: "/Carrinho", label: "Carrinho", icon: "🛒", desc: "Personalize e finalize pedidos", color: "#FFF1F2", accent: "#E11D48" },
    { to: "/Monitoramento/IA", label: "Monitorar IA", icon: "🤖", desc: "Painel de IA do WhatsApp", color: "#F0F9FF", accent: "#0369A1" },
    { to: "/Tarefas", label: "Tarefas", icon: "✅", desc: "Agenda e gestão de tarefas", color: "#FFFBEB", accent: "#D97706" },
    { to: "/Checklist", label: "Checklists", icon: "🗒️", desc: "Crie e acompanhe checklists", color: "#EEF2FF", accent: "#4338CA" },
  ];

  const getItemsByRole = (roleUsuario, isLoggedIn) => {
    // Se não estiver logado, vê só o básico
    if (!isLoggedIn) {
      return TodaNavegacao.filter(item => ["/Foto", "/Orcamneto", "/Carrinho"].includes(item.to));
    }

    // Mapeamento de permissões por cargo
    const permissions = {
      "Programador": [
        "/Estoque", "/clienti", "/Orcamneto", "/Foto", "/cadastroPro", "/Carrinho", 
        "/Monitoramento/IA", "/Tarefas", "/Checklist" 
      ],
      "Chefa": [
        "/cadastroPro", "/clienti", "/Orcamneto", "/Carrinho", "/Foto", "/Estoque" 
      ],
      "GerenteVendas": [
        "/Orcamneto", "/cadastroPro", "/clienti", "/Carrinho", "/Foto", "/Estoque"
      ],
      "Vendedora": [
        "/Orcamneto", "/clienti", "/Foto", "/Carrinho"
      ],
    };

    // Padroniza para evitar erros de maiúsculas/minúsculas
    const roleFormatado = (roleUsuario || '').toLowerCase().trim();
    
    // Encontra as permissões do cargo (tudo minúsculo para bater)
    const permissoesCargo = Object.keys(permissions).find(key => key.toLowerCase() === roleFormatado);
    const allowedRoutes = permissoesCargo ? permissions[permissoesCargo] : [];

    // Filtra e retorna apenas os itens que o usuário tem permissão de ver
    return TodaNavegacao.filter(item => allowedRoutes.includes(item.to));
  };

  // 2. CHAMA A FUNÇÃO para gerar a lista final de links que vão aparecer
  const itensMenu = getItemsByRole(role, loggedin);

  return (
    <>
      {/* Botão flutuante para mobile */}
      <button className="botao-menu-mobile" onClick={alternarMenu} aria-label="Abrir menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {menuAberto ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>}
        </svg>
      </button>

      {/* Fundo escuro quando o menu está aberto no mobile */}
      {menuAberto && <div className="overlay-menu" onClick={fecharMenu}></div>}

      {/* Menu Lateral */}
      <aside className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <div className="logo-area">
          <h2>Kasaleve</h2>
        </div>

        <nav className="navegacao-menu">
          {/* 3. AQUI MUDOU: Agora mapeia sobre itensMenu (que já está filtrado) */}
          {itensMenu.map((link, index) => (
            <NavLink 
              key={index} 
              to={link.to} 
              className={({ isActive }) => isActive ? "link-menu ativo" : "link-menu"}
              onClick={fecharMenu} // Fecha o menu ao clicar em um link (usabilidade mobile)
            >
              <span className="icone-link">{link.icon}</span>
              <span className="texto-link">{link.label}</span>
            </NavLink>
          ))}

          {/* Link de Sair/Login separado na parte inferior */}
          <NavLink 
            to="/Login" 
            className="link-menu sair"
            onClick={fecharMenu}
          >
            <span className="icone-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </span>
            <span className="texto-link">Sair</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default MenuDeLado;