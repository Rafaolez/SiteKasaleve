import "../css/Login.css";
import { AuthContext } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';

function Login() {
    const { Login, error, loggedin } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedin) navigate("/");
    }, [loggedin, navigate]);

    async function RealizaLogin() {
        setLoading(true);
        await Login(username, password);
        setLoading(false);
        setUsername('');
        setPassword('');
    }

    function handleKey(e) {
        if (e.key === 'Enter') RealizaLogin();
    }

    return (
        <div className="login-page">

            {/* ── Card ── */}
            <div className="login-card">

                {/* Logo */}
                <div className="login-logo">
                    <img
                        src="https://i.ibb.co/0j2V7vD/Logo.png"
                        alt="Logo"
                        className="login-logo__img"
                    />
                </div>

                {/* Title */}
                <div className="login-heading">
                    <p className="login-heading__eyebrow">Bem-vindo de volta</p>
                    <h1 className="login-heading__title">Entrar na conta</h1>
                </div>

                {/* Fields */}
                <div className="login-fields">

                    <div className="login-field">
                        <label className="login-field__label">Usuário</label>
                        <div className="login-field__wrap">
                            <span className="login-field__icon">👤</span>
                            <input
                                className="login-field__input"
                                type="text"
                                placeholder="Digite seu usuário"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={handleKey}
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-field__label">Senha</label>
                        <div className="login-field__wrap">
                            <span className="login-field__icon">🔑</span>
                            <input
                                className="login-field__input"
                                type={showPass ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={handleKey}
                                autoComplete="current-password"
                            />
                            <button
                                className="login-field__toggle"
                                onClick={() => setShowPass(p => !p)}
                                tabIndex={-1}
                                type="button"
                            >
                                {showPass ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>

                    {/* Remember */}
                    <label className="login-remember">
                        <input
                            className="login-remember__check"
                            type="checkbox"
                            checked={remember}
                            onChange={e => setRemember(e.target.checked)}
                        />
                        <span className="login-remember__box">
                            {remember && <span className="login-remember__tick">✓</span>}
                        </span>
                        Lembre-me
                    </label>

                </div>

                {/* Error */}
                {error && (
                    <div className="login-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Button */}
                <button
                    className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
                    onClick={RealizaLogin}
                    disabled={loading || !username || !password}
                >
                    {loading ? <span className="login-btn__spinner" /> : 'Entrar'}
                </button>

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