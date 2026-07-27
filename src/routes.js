import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './Page/Home.jsx';
import Clienti from './Page/Clienti.jsx';
import Login from './Page/Login.jsx';
import CradastroPro from './Page/CadastroPro.jsx';
import Foto from './Page/Foto.jsx';
import Orcamneto from './Page/Orcamento.js'
import OrcamnetoTeste from './Page/testetstet.jsx'
import PGBTDetalhe from './Page/PGBTDetalhe.jsx';
import PGBTEditar from './Page/PGBTEditar.jsx';
import Carrinho from './Page/Carrinho.jsx'; 
import IA from './Page/IA.jsx';
import Tarefas from './Page/Tarefas.jsx';
import Catalogo from './Page/Catalogo.jsx';
import Checklist from './Page/Checklist.jsx';

function AppRautes() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clienti" element={<Clienti />} />
                <Route path="/Login" element={<Login />} />
                <Route path='/cadastroPro' element={<CradastroPro/>} />
                <Route path="/Foto" element={<Foto/>} />
                <Route path="OrcamnetoTeste" element={<Orcamneto/>} />
                <Route path="/Orcamneto" element={<OrcamnetoTeste/>} />
                <Route path="/DetalheCliente" element={<PGBTDetalhe/>} />
                <Route path="/Carrinho" element={<Carrinho/>} />
                <Route path="/editarCliente" element={<PGBTEditar/>} />
                <Route path="/Monitoramento/IA" element={<IA />} />
                <Route path="/Tarefas" element={<Tarefas />} />
                <Route path="/Carrinho/Catalogo" element={ <Catalogo />} />
                <Route path="/Checklist" element={<Checklist />} />
                
            </Routes>
        </BrowserRouter>

    );
}
export default AppRautes;