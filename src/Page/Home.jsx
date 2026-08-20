import React, { useEffect, useRef, useState, useContext } from 'react';
import '../css/Home.css';
import MenuHome from '../components/MenuHome';
import { Link } from 'react-router-dom';
import ImgMG from '../Imagens/CarroHomePt01.jpg';
import ImgMG2 from '../Imagens/ImagemCarrocel.jpg';
import ImgMG3 from '../Imagens/CarroHome.jpg';
import { AuthContext } from './Context/AuthContext';

// ─── Todos os itens de navegação possíveis ────────────────
const allNavItems = [
  { to: "/Estoque",    label:"Estoque", icon:"", desc:"Gerencie o seu Estoque", color: "#E8F4FD", accent: "#ab2e2e" },
  { to: "/clienti", label: "Clientes", icon: "👥", desc: "Gerencie sua base de clientes", color: "#E8F4FD", accent: "#2E86AB" },
  { to: "/Orcamneto", label: "Orçamento", icon: "📋", desc: "Crie e acompanhe orçamentos", color: "#FFF8E7", accent: "#F4A261" },
  { to: "/Foto", label: "Fotos", icon: "🖼️", desc: "Galeria de projetos e produtos", color: "#F0FDF4", accent: "#2D9B5A" },
  { to: "/cadastroPro", label: "Cadastro de Produto", icon: "📦", desc: "Gerencie o catálogo de produtos", color: "#F5F0FF", accent: "#7C3AED" },
  { to: "/Carrinho", label: "Carrinho", icon: "🛒", desc: "Personalize e finalize pedidos", color: "#FFF1F2", accent: "#E11D48" },
  { to: "/Monitoramento/IA", label: "Monitorar IA", icon: "🤖", desc: "Painel de IA do WhatsApp", color: "#F0F9FF", accent: "#0369A1" },
  { to: "/Tarefas", label: "Tarefas", icon: "✅", desc: "Agenda e gestão de tarefas", color: "#FFFBEB", accent: "#D97706" },
  { to: "/Checklist", label: "Checklists", icon: "🗒️", desc: "Crie e acompanhe checklists", color: "#EEF2FF", accent: "#4338CA" },
  { to: "/CameraTeste", label: "Camera Teste", icon: "📷", desc: "Teste a câmera do dispositivo", color: "#FDF2F8", accent: "#DB2777" },
];

// ─── Função que retorna os menus liberados para cada cargo ─
const getItemsByRole = (role, isLoggedIn) => {
  // Se não estiver logado, vê só o básico
  if (!isLoggedIn) {
    return allNavItems.filter(item => ["/Foto", "/Orcamneto", "/Carrinho"].includes(item.to));
  }

  // Mapeamento de permissões por cargo (usando os "to" dos menus)
  const permissions = {
    "Programador": [
      "/Estoque", "/clienti", "/Orcamneto", "/Foto", "/cadastroPro", "/Carrinho", 
      "/Monitoramento/IA", "/Tarefas", "/CameraTeste",
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

  // Pega as rotas liberadas para o cargo, ou um array vazio se o cargo não existir
  const allowedRoutes = permissions[role] || [];

  // Filtra e retorna apenas os itens que o usuário tem permissão de ver
  return allNavItems.filter(item => allowedRoutes.includes(item.to));
};

// ─── Slides do carrossel ──────────────────────────────────
const slides = [
  { image: ImgMG, tag: "Artesanato", title: "Móveis que contam histórias", desc: "Cada peça é criada com atenção e dedicação para transformar ambientes." },
  { image: ImgMG2, tag: "Qualidade", title: "Feito para durar gerações", desc: "Materiais nobres e acabamento impecável definem o padrão Kasaleve." },
  { image: ImgMG3, tag: "Design", title: "Projeto, conforto e elegância", desc: "Soluções personalizadas que combinam funcionalidade e beleza." },
];

// ─── Carrossel moderno ────────────────────────────────────
function Carousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setActive(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const slide = slides[active];

  return (
    <div className="hm-carousel">
      {slides.map((s, i) => (
        <div key={i} className={`hm-carousel__slide ${i === active ? 'hm-carousel__slide--active' : ''}`}>
          <img src={s.image} alt={s.title} className="hm-carousel__image" />
        </div>
      ))}

      <div className="hm-carousel__overlay" />

      <div className={`hm-carousel__content ${animating ? 'hm-carousel__content--fade' : ''}`}>
        <span className="hm-carousel__tag">{slide.tag}</span>
        <h2 className="hm-carousel__title">{slide.title}</h2>
        <p className="hm-carousel__desc">{slide.desc}</p>
      </div>

      <div className="hm-carousel__controls">
        <button className="hm-carousel__arrow" onClick={() => goTo((active - 1 + slides.length) % slides.length)} aria-label="Anterior">‹</button>
        <div className="hm-carousel__dots">
          {slides.map((_, i) => (
            <button key={i} className={`hm-carousel__dot ${i === active ? 'hm-carousel__dot--active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <button className="hm-carousel__arrow" onClick={() => goTo((active + 1) % slides.length)} aria-label="Próximo">›</button>
      </div>

      <div className="hm-carousel__counter">
        <span className="hm-carousel__counter-current">{String(active + 1).padStart(2, '0')}</span>
        <span className="hm-carousel__counter-sep" />
        <span className="hm-carousel__counter-total">{String(slides.length).padStart(2, '0')}</span>
      </div>

      <div className="hm-carousel__badge">
        <span className="hm-carousel__badge-dot" />
        Apenas para Funcionários
      </div>
    </div>
  );
}

// ─── Card de navegação ────────────────────────────────────
function NavCard({ item, index }) {
  return (
    <Link to={item.to} className="hm-nav-link" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="hm-nav-card" style={{ '--card-bg': item.color, '--card-accent': item.accent }}>
        <div className="hm-nav-card__icon-wrap">
          <span className="hm-nav-card__icon">{item.icon}</span>
        </div>
        <div className="hm-nav-card__text">
          <p className="hm-nav-card__label">{item.label}</p>
          <p className="hm-nav-card__desc">{item.desc}</p>
        </div>
        <span className="hm-nav-card__arrow">→</span>
      </div>
    </Link>
  );
}

// ─── MAIN ────────────────────────────────────────────────
export default function Home() {
  const { loggedin, role } = useContext(AuthContext);

  // Chama a função passando o cargo e se está logado
  const items = getItemsByRole(role, loggedin);

  return (
    <div className="hm-page">
      <MenuHome />
      <div className="hm-split">
        
        <aside className="hm-left">
          <div className="hm-brand">
            <div className="hm-brand__bar" />
            <div>
              <p className="hm-brand__eyebrow">Sistema de Gestão</p>
              <h1 className="hm-brand__title">kasaleve</h1>
              <p className="hm-brand__tag">projeto <span>·</span> conforto</p>
            </div>
          </div>

          <nav className="hm-nav">
            {items.map((item, i) => (
              <NavCard key={item.to} item={item} index={i} />
            ))}
          </nav>

          {!loggedin && (
            <Link to="/login" className="hm-login-link">
              Área restrita → Entrar
            </Link>
          )}
        </aside>

        <Carousel />
      </div>
    </div>
  );
}