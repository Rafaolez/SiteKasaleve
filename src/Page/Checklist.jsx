import React, { useState, useEffect, useCallback, useContext } from 'react';
import '../css/Checklist.css';
import BTNVolta from '../components/BTNVolta';
import { AuthContext } from './Context/AuthContext';
import { api } from '../services/api';

export default function Checklist() {
  const { loggedin } = useContext(AuthContext);
  const [checklists, setChecklists] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [novosItens, setNovosItens] = useState(['']);
  const [salvando, setSalvando] = useState(false);

  const carregarChecklists = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await api.get('/api/checklists');
      setChecklists(dados);
    } catch (err) {
      setErro(err.message || 'Não foi possível carregar os checklists.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (loggedin) carregarChecklists();
  }, [loggedin, carregarChecklists]);

  if (!loggedin) {
    return (
      <div className="chk-bg">
        <BTNVolta />
        <div className="chk-bloqueado">Faça login para acessar os checklists.</div>
      </div>
    );
  }

  function atualizarItem(idx, valor) {
    setNovosItens(prev => prev.map((v, i) => (i === idx ? valor : v)));
  }

  function adicionarLinhaItem() {
    setNovosItens(prev => [...prev, '']);
  }

  function removerLinhaItem(idx) {
    setNovosItens(prev => prev.filter((_, i) => i !== idx));
  }

  async function criarChecklist(e) {
    e.preventDefault();
    const itensPreenchidos = novosItens.map(v => v.trim()).filter(Boolean);
    if (!titulo.trim() || itensPreenchidos.length === 0) return;

    setSalvando(true);
    try {
      await api.post('/api/checklists', {
        titulo: titulo.trim(),
        itens: itensPreenchidos.map((descricao, ordem) => ({ descricao, ordem }))
      });
      setTitulo('');
      setNovosItens(['']);
      await carregarChecklists();
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o checklist.');
    } finally {
      setSalvando(false);
    }
  }

  async function alternarItem(itemId, concluidoAtual) {
    // Atualização otimista: reflete na tela antes da confirmação do servidor.
    setChecklists(prev => prev.map(c => ({
      ...c,
      itens: c.itens.map(i => i.checklistItemId === itemId ? { ...i, concluido: !concluidoAtual } : i)
    })));
    try {
      await api.patch(`/api/checklists/itens/${itemId}`, { concluido: !concluidoAtual });
    } catch (err) {
      setErro(err.message || 'Não foi possível atualizar o item.');
      carregarChecklists(); // desfaz a atualização otimista em caso de erro
    }
  }

  async function excluirChecklist(id) {
    try {
      await api.delete(`/api/checklists/${id}`);
      setChecklists(prev => prev.filter(c => c.checklistId !== id));
    } catch (err) {
      setErro(err.message || 'Não foi possível excluir o checklist.');
    }
  }

  return (
    <div className="chk-bg">
      <BTNVolta />
      <div className="chk-paper">
        <h1 className="chk-titulo">Checklists</h1>

        <form className="chk-form-novo" onSubmit={criarChecklist}>
          <h3>Novo checklist</h3>
          <input
            className="chk-input"
            placeholder="Título do checklist"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          {novosItens.map((valor, idx) => (
            <div className="chk-item-linha" key={idx}>
              <input
                className="chk-input"
                placeholder={`Item ${idx + 1}`}
                value={valor}
                onChange={e => atualizarItem(idx, e.target.value)}
              />
              {novosItens.length > 1 && (
                <button type="button" className="chk-btn-remover" onClick={() => removerLinhaItem(idx)}>×</button>
              )}
            </div>
          ))}
          <button type="button" className="chk-btn-add" onClick={adicionarLinhaItem}>+ Adicionar item</button>
          <button type="submit" className="chk-btn-salvar" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar checklist'}
          </button>
        </form>

        {erro && <p className="chk-erro">{erro}</p>}

        <h3>Meus checklists</h3>
        {carregando ? (
          <p>Carregando...</p>
        ) : checklists.length === 0 ? (
          <p>Nenhum checklist cadastrado ainda.</p>
        ) : (
          <div className="chk-lista">
            {checklists.map(c => (
              <div className="chk-card" key={c.checklistId}>
                <div className="chk-card-header">
                  <span className={c.concluido ? 'chk-badge-concluido' : 'chk-badge-pendente'}>
                    {c.concluido ? 'Concluído' : 'Em andamento'}
                  </span>
                  <h4>{c.titulo}</h4>
                  <button className="chk-btn-excluir" onClick={() => excluirChecklist(c.checklistId)}>Excluir</button>
                </div>
                <ul className="chk-itens">
                  {c.itens.map(item => (
                    <li key={item.checklistItemId}>
                      <label>
                        <input
                          type="checkbox"
                          checked={item.concluido}
                          onChange={() => alternarItem(item.checklistItemId, item.concluido)}
                        />
                        <span className={item.concluido ? 'chk-item-riscado' : ''}>{item.descricao}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
