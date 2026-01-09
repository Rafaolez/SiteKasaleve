import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './Page/Home.jsx';
import Clienti from './Page/Clienti.jsx';
import Login from './Page/Login.jsx';

function AppRautes() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clienti" element={<Clienti />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </BrowserRouter>

    );
}
export default AppRautes;