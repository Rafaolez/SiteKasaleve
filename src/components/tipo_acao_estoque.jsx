import React from "react";
import '../css/tipo_acao_estoque.css';

function TipoAcaoEstoque() {
    return (
        <div className="tipo-acao-estoque-container">

            <div className="VertodasVariacaoestoque">
                <h2>Variações de Estoque</h2>
                <br/>
                
            </div>

            <div className="Cadastroestoque">
                <h2>Cadastro de Item no Estoque</h2>
            </div>

            <div className="CadastroNovoestoque">
                <h2>Cadastro Nova Variação</h2>
            </div>

        </div>

    );
}

export default TipoAcaoEstoque;