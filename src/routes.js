import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './Page/Home.jsx';
import Clienti from './Page/Clienti.jsx';
import Login from './Page/Login.jsx';
import CradastroPro from './Page/CadastroPro.jsx';
import Foto from './Page/Foto.jsx';
import Orcamneto from './Page/Orcamento.js'
import PGBTDetalhe from './Page/PGBTDetalhe.jsx';
import PGBTEditar from './Page/PGBTEditar.jsx';
import Carrinho from './Page/Carrinho.jsx'; 
import IA from './Page/IA.jsx';
import Tarefas from './Page/Tarefas.jsx';
import Catalogo from './Page/Catalogo.jsx';

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
                <Route path="/DetalheCliente" element={<PGBTDetalhe/>} />
                <Route path="/Carrinho" element={<Carrinho/>} />
                <Route path="/editarCliente" element={<PGBTEditar/>} />
                <Route path="/Monitoramento/IA" element={<IA />} />
                <Route path="/Tarefas" element={<Tarefas />} />
                <Route path="/Carrinho/Catalogo" element={ <Catalogo />} />
                
            </Routes>
        </BrowserRouter>

    );
}
export default AppRautes;