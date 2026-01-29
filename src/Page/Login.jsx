import BTNVolta from "../components/BTNVolta";
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

//   ×͜×