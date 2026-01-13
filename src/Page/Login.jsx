import BTNVolta from "../components/BTNVolta";
import "../css/Login.css";



function Login() {
    return (
        <>
            <BTNVolta />
            <div className="CXPrincipal">
                <div className="LogoLogin">
                    <img className="ImgLogoLogin" src="https://i.ibb.co/0j2V7vD/Logo.png" alt="Logo" border="0" />
                </div>
                <div className="CXINPUT">
                    <input className="INPUT Login" type="text" placeholder="Usuário" />
                    <input className="INPUT Senha" type="password" placeholder="Senha" />
                    <label className="LBLLembreme" >Lembre-me <input className="selckt" type="checkbox" name="Lembre-me" ></input> </label>
                </div>
                <div className="CXBTNLogin">
                    <button className="INPUT BTNLogin" onClick={console.log} >Entrar</button>
                </div>
            </div>
        </>
    );
}
export default Login;

//   ×͜×