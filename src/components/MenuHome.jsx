import { Link } from "react-router-dom";
import "../css/menuhome.css";

function MenuHome() {
    return (
        <>
            <div className="cima">
                <img src={"https://pt-br.legacy.reactjs.org/docs/handling-events.html"} alt="Logo" className="logo" />
                <div className="divButton">
                    <Link className="BTNLogin" to={"/Login"}><button className="BTNLogin" onClick={() => console.log('Button Pressed')}>Entrar</button></Link>
                </div>
            </div>
        </>
    );
}
export default MenuHome;