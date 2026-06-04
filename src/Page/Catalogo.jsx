import { useNavigate } from 'react-router-dom';

function Catalogo() {
    const navigate = useNavigate();

    return (
        <>
            <button className="btn-comprar" onClick={() => navigate('/Carrinho')}> Volta </button>
            <h1>Hello Word</h1>
            <h2>Teste para emviar no git </h2>
        </>
    )

}
export default Catalogo;