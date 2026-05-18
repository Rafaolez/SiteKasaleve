import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import MenuHome from "../components/MenuHome";
import { AuthContext } from './Context/AuthContext';
import { useContext } from "react";

function IA() {
const { loggedin } = useContext(AuthContext);

    if(!loggedin){
        return(
            <>
             <MenuPage />
            <div className="detail-page">
                <div className="detail-empty">
                    <span></span>
                    <p>Você precisa estar logado para acessar esta página.</p>
                    <BTNVolta />
                </div>
            </div>
            </>
        );
    }




    return (
        <>
            <MenuPage />
            <div className="foto-page">
                <div className="foto-header">
                    <BTNVolta />
                    <div className="foto-header__titles">
                        <p className="eyebrow">Monitoramento da IA</p>
                        <h1 className="foto-title">Fotos</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IA;