import React from 'react';
import '../css/Home.css';
import MenuHome from '../components/MenuHome';
import { Link } from 'react-router-dom';
import ImgMG from '../Imagens/MG_2755.jpg';

const navItems = [
    { to: "/clienti",     label: "Cliente"            },
    { to: "/Orcamneto",   label: "Orçamento"           },
    { to: "/Foto",        label: "Fotos"               },
    { to: "/cadastroPro", label: "Cadastro de Produto" },
    { to: "/Carrinho",    label: "Carrinho"            },
];

function Home() {
    return (
        <div className="home-page">
            <MenuHome />

            <div className="home-split">

                {/* ── ESQUERDA: botões ── */}
                <aside className="home-left">
                    <nav className="home-nav">
                        {navItems.map((item, i) => (
                            <Link
                                to={item.to}
                                className="home-nav__link"
                                key={item.to}
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                <button className="home-nav__btn">
                                    {item.label}
                                </button>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* ── DIREITA: foto + texto ── */}
                <section className="home-right">
                    <img
                        className="home-right__img"
                        src={ImgMG}
                        alt="Kasaleve móveis"
                    />
                    <div className="home-right__overlay" />

                    <div className="home-right__content">
                        <p className="home-right__quote">
                            Fazer bem feito é o nosso padrão.
                        </p>
                        <p className="home-right__body">
                            Na Kasaleve, acreditamos no trabalho artesanal, na colaboração
                            e no orgulho de entregar móveis que transformam ambientes e
                            histórias. Cada função é essencial para o resultado final.
                        </p>
                    </div>

                    <div className="home-right__badge">
                        <span className="home-right__badge-icon">⚠</span>
                        Site apenas para Funcionário
                    </div>
                </section>

            </div>
        </div>
    );
}

export default Home;


{/*import React from 'react';
import '../css/Home.css';
import MenuHome from '../components/MenuHome';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <MenuHome className="MenuHome" />
      <div className='TelaMeio'>

        <div className='TDbuttons'>
          <Link className='text' to="/clienti"><button className='ClienteH BTN'  >Cadastro de Cliente</button></Link>
          <Link className='text' to={"/Orcamneto"}><button route={'/clienti'} className='OrcamentoH BTN'>Orçamento</button></Link>
          <Link className='text' to={"/Foto"}><button className='FotoH BTN'>Fotos</button></Link>
          <Link className='text' to={"/cadastroPro"}><button className='ProdutoH BTN'>Cadastro de Produto</button></Link>
          <Link className='text' to={"/Carrinho"}><button className='CarrinhoH BTN'>Carrinho</button></Link>
        </div>
        <div className="PTmensagem">
          <h2>Welcome to the Home Page!</h2>
          <p>This is where you can find the latest updates and features.</p>
        </div>
      </div>
    </>
  );
}
export default Home;*/}