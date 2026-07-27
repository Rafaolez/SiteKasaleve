import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';
import CadastroDeClienete from '../components/CadastroDeClienete';
//isso pega as iniciais do cliente para criar o avatar, caso o cliente se chame "João Silva", ele vai pegar "J" e "S" e mostrar no avatar. Se o nome for só "Maria", ele vai mostrar "M". Se o nome for vazio, não mostra nada.
const initials = (first = '', last = '') =>
  `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

//avataColo = um cirador de avatar colorido, igual gmail, mas com cores pré-definidas para manter a 
// harmonia visual. Ele gera um hash simples a partir do nome do cliente para escolher uma cor da paleta. Assim, 
// cada cliente tem uma cor consistente em toda a aplicação, facilitando a identificação visual.

const avatarColor = (str = '') => {
  const palette = ['#4f86f7', '#f7874f', '#4fcf8a', '#f74f6a', '#a04ff7', '#f7c94f'];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
};

function Avatar({ first, last }) {
  const bg = avatarColor(`${first}${last}`);
  return (
    <div className="avatar" style={{ background: bg }}>
      {initials(first, last)}
    </div>
  );
}

function StatusBadge({ status = 'Ativo' }) {
  return (
    <span className={`badge badge--${status.toLowerCase()}`}>
      <span className="badge__dot" />
      {status}
    </span>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <div>
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
}

function Clienti() {
  const { loggedin, getCliente, client = [], setIdPegaCliente } = useContext(AuthContext);
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => { getCliente(); }, []);

  if (!loggedin) {
    return (
      <div className="locked">
        <MenuPage />
        <BTNVolta />
        <div className="locked__content">
          <span className="locked__icon">🔒</span>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (addMode) {
    return (
      <>
        <MenuPage />
        <div className="page">
          <button className="btn-back" onClick={() => setAddMode(false)}>
            ← Voltar
          </button>
          <CadastroDeClienete/>
        </div>
      </>
    );
  }
  
//anda não funciona o filtro, mas já tem a estrutura pronta, só falta implementar a lógica de filtragem com base no status do cliente. Por enquanto, o filtro "Todos" mostra todos os clientes, e os outros filtros não fazem nada. Vou deixar isso para a próxima etapa de desenvolvimento.
  const filters = ['Todos', 'Ativo', 'Inativo', 'Pendente'];

  const filtered = client.filter(item => {
    const fullName = `${item.name.firstname} ${item.name.lastname}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <MenuPage />
      <div className="page">

        {/* ── Topo ── */}
        <div className="page__header">
          <div className="page__header-left">
            <BTNVolta />
            <div className="page__title-group">
              <p className="page__eyebrow">Gestão de Clientes</p>
              <h1 className="page__title">Clientes</h1>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setAddMode(true)}>+ Novo Cliente</button>
        </div>

        {/* ── Stats ── */}
        <div className="cli-stats-row">
          <StatCard label="Total de clientes" value={client.length} icon="👥" />
          <StatCard label="Ativos" value={client.length} icon="✅" />
          <StatCard label="Novos este mês" value={Math.min(client.length, 5)} icon="📈" />
        </div>

        {/* ── Busca + Filtros ── */}
        <div className="cli-toolbar">
          <div className="search-box">
            <span className="search-box__icon">🔍</span>
            <input
              className="search-box__input"
              type="text"
              placeholder="Buscar por nome ou e-mail…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            {filters.map(f => (
              <button
                key={f}
                className={`chip ${activeFilter === f ? 'chip--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="table-wrap">
          <div className="cli-table-head">
            <span>Cliente</span>
            <span>E-mail</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {filtered.length === 0 ? (
            <div className="table-empty">
              <span>◎</span>
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div className="cli-table-row" key={item.id} style={{ animationDelay: `${i * 0.04}s` }}>

                <div className="table-row__name">
                  <Avatar first={item.name.firstname} last={item.name.lastname} />
                  <div>
                    <p className="table-row__fullname">
                      {item.name.firstname} {item.name.lastname}
                    </p>
                    <p className="table-row__id">#{item.id}</p>
                  </div>
                </div>

                <div className="cli-table-row__email">{item.email}</div>

                <div><StatusBadge status="Ativo" /></div>

                <div className="table-row__actions">
                  <Link to="/DetalheCliente" className="link-clean">
                    <button className="btn-action btn-action--detail" onClick={() => setIdPegaCliente(item.id)}>
                      👁 Detalhes
                    </button>
                  </Link>
                  <Link to="/editarCliente" className="link-clean">
                    <button className="btn-action btn-action--edit" onClick={() => setIdPegaCliente(item.id)}>
                      ✏️ Editar
                    </button>
                  </Link>
                  <button className="btn-action btn-action--delete">
                    🗑 Excluir
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        <p className="table-count">{filtered.length} de {client.length} clientes</p>
      </div>
    </>
  );
}

export default Clienti;

//meu código antigo, caso queira comparar ou pegar algo que eu tirei; 

{/*import '../css/Cliente.css';
import BTNVolta from '../components/BTNVolta';
import MenuPage from '../components/MenuPage';
import Buscar from '../components/Buscar';
import PGBTDetalhe from './PGBTDetalhe';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Context/AuthContext";
import { Link } from 'react-router-dom';

function Clienti() {
  const { loggedin, getCliente, client, setIdPegaCliente } = useContext(AuthContext);
  
  const [AddCliente, setAddCliente] = useState(true);


  

  useEffect(() => {
    getCliente();
  }, []);

  if (!loggedin) {
    return (
      <div className="body">
        <BTNVolta />
        <h2>Você precisa estar logado para acessar esta página.</h2>
      </div>

    );
  }

  return (
    <>
      {AddCliente ?
        <div className='Pia'>
          <MenuPage />

          <div className='CaixaBTN'>
            <BTNVolta />
            <div>
              <button onClick={() => { setAddCliente(false) }} className='BTNAddCima'>Add</button>
              <Buscar />
            </div>
          </div>

          <div className='ConteudiGeral'>
            <div className='ConteudoName'>
              <div className='CL Nome'><h3>Nome do Cliente</h3></div>
              <hr />
              <div className='CL CPF'><h3>CPF/CNPJ</h3></div>
              <hr />
              <div className='CL Status'><h3>Status</h3></div>
              <hr />
              <div className=' Btn321'></div>
            </div>

            {client.map(item => (
              <div className='Conteudo' key={item.id}>
                <div className='CL Nome'>
                  {item.name.firstname} {item.name.lastname}
                </div>
                <hr />
                <div className='CL CPF'>
                  {item.email}
                </div>
                <hr />
                <div className='CL Status'>
                  Ativo
                </div>
                <hr />
                <div className='Btn321'>
                  <Link className='text' to={"/DetalheCliente"}><button route={'/Detalhe'} onClick={() => { setIdPegaCliente(item.id) }} className='BTNC DE'>Detalhes</button></Link>
                  <Link className='text' to={"/editarCliente"}><button className='BTNC ED' route={'/editarCliente'} onClick={() => { setIdPegaCliente(item.id) }}>Editar</button></Link>
                  <button className='BTNC EX'>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        :
        <div>
          <h1>Add Cliente</h1>
          <button onClick={() => setAddCliente(true)} className='BTNCD Voltar'>Voltar</button>
        </div>
      } 


    </>
  );
}
export default Clienti;

*/}