import "../css/Login.css";
import { AuthContext } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import Logo from "../Imagens/logomarcaKasalevePretp.jpeg";

// Ícones SVG
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

// Imagens de fundo (Substitua pelas suas imagens reais se quiser)
const BG_IMAGES = [
  "/Imagens/Produtos/CarroLoginPt1.jpg", // Escritório moderno
  "/Imagens/Produtos/CarroLoginPt2.jpg", // Reunião
  "/Imagens/Produtos/CarroLoginPt3.jpg", // Trabalho em equipe
];

function Login() {
  const { Login, error, loggedin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Controle do Carrossel de Fundo
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    if (loggedin) navigate("/");
  }, [loggedin, navigate]);

  // Efeito para trocar a imagem de fundo a cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  async function RealizaLogin(e) {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    await Login(username, password);
    setLoading(false);
    
    if(!error) {
      setUsername('');
      setPassword('');
    }
  }

  return (
    <div className="login-page">
      
      {/* ── Carrossel de Fundo ── */}
      <div className="login-carousel">
        {BG_IMAGES.map((img, index) => (
          <div
            key={index}
            className="login-carousel__slide"
            style={{
              backgroundImage: `url(${img})`,
              opacity: currentBg === index ? 1 : 0
            }}
          />
        ))}
        
        {/* Sobreposição escura para garantira leitura do card */}
        <div className="login-carousel__overlay"></div>
        
        {/* Indicadores de posição (bolinhas) */}
        <div className="login-carousel__indicators">
          {BG_IMAGES.map((_, index) => (
            <span 
              key={index} 
              className={`login-carousel__dot ${currentBg === index ? 'login-active' : ''}`}
              onClick={() => setCurrentBg(index)}
            />
          ))}
        </div>
      </div>

      {/* ── Card de Login ── */}
      <div className="login-card">
        
        {/* Logo */}
        <div className="login-logo">
          <img src={Logo} alt="Logo Kasaleve" className="login-logo__img" />
        </div>

        {/* Textos */}
        <div className="login-heading">
          <h1 className="login-heading__title">Bem-vindo de volta</h1>
          <p className="login-heading__subtitle">Insira suas credenciais para acessar o painel</p>
        </div>

        {/* Formulário */}
        <form className="login-form" onSubmit={RealizaLogin}>
          
          <div className="login-field">
            <label className="login-field__label">Usuário</label>
            <div className="login-field__wrap">
              <span className="login-field__icon"><IconUser /></span>
              <input
                className="login-field__input"
                type="text"
                placeholder="seu.usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-field__row">
              <label className="login-field__label">Senha</label>
              <button type="button" className="login-forgot-btn" onClick={() => alert('Funcionalidade em desenvolvimento')}>
                Esqueceu a senha?
              </button>
            </div>
            <div className="login-field__wrap">
              <span className="login-field__icon"><IconLock /></span>
              <input
                className="login-field__input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
              >
                {showPass ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Lembrar-me */}
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="login-remember__input"
            />
            <span className="login-remember__checkmark"></span>
            <span className="login-remember__text">Lembrar meu acesso</span>
          </label>

          {/* Erro */}
          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
            disabled={loading || !username || !password}
          >
            {loading ? <span className="login-btn__spinner" /> : 'Entrar no sistema'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;




{/*import BTNVolta from "../components/BTNVolta";
import "../css/Login.css";
import { AuthContext } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';


function Login() {
    const { Login, error, loggedin } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedin) {
            navigate("/");
        }}, [loggedin, navigate]);

    function RealizaLogin() {
        Login(username, password);
        setUsername('');
        setPassword('');
    }

    return (
        <div className="body">
            <BTNVolta />
            <div className="CXPrincipal">
                <div className="LogoLogin">
                    <img className="ImgLogoLogin" src="https://i.ibb.co/0j2V7vD/Logo.png" alt="Logo" border="0" />
                </div>
                <div className="CXINPUT">
                    <input className="INPUT Login" type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input className="INPUT Senha" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label className="LBLLembreme" >Lembre-me <input className="selckt" type="checkbox" name="Lembre-me" ></input> </label>
                </div>
                <div className="CXBTNLogin">
                    <button className="INPUT BTNLogin" onClick={RealizaLogin} >Entrar</button>
                    {error && <span>{error}</span>}
                </div>
            </div>
        </div>
    );
}
export default Login;
*/}
//   ×͜×/}