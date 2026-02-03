import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './Page/Home.jsx';
import Clienti from './Page/Clienti.jsx';
import Login from './Page/Login.jsx';
import CradastroPro from './Page/CadastroPro.jsx';
import Foto from './Page/Foto.jsx';
import Orcamneto from './Page/Orcamneto.jsx'

function AppRautes() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clienti" element={<Clienti />} />
                <Route path="/Login" element={<Login />} />
                <Route path='/cadastroPro' element={<CradastroPro/>} />
                <Route path="/Foto" element={<Foto/>} />
                <Route path="/Orcamneto" element={<Orcamneto/>} />
            </Routes>
        </BrowserRouter>

    );
}
export default AppRautes;