import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import "../css/IA.css";
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import { gerarRespostaIA } from "../assets/aiResponder";
import Toast from "../components/Toast";

// ═══════════════════════════════════════
// MOCKS
// ═══════════════════════════════════════
const LEADS_MOCK = [
  { id: 1, nome: 'João Silva', msg: 'Vocês tem a cadeira Náutica branca?', tempo: '2 min', status: 'pendente', prioridade: 'alta' },
  { id: 2, nome: 'Maria Souza', msg: 'Qual o prazo de entrega para Ribeirão Preto?', tempo: '15 min', status: 'pendente', prioridade: 'media' },
  { id: 3, nome: 'Pedro Alves', msg: 'Quero desconto para 10 poltronas', tempo: '1h', status: 'pendente', prioridade: 'alta' },
  { id: 4, nome: 'Ana Costa', msg: 'Bom dia! Gostaria de ver o catálogo', tempo: '2h', status: 'atendido', prioridade: 'baixa' },
  { id: 5, nome: 'Carlos Lima', msg: 'Quanto custa a mesa de centro?', tempo: '3h', status: 'atendido', prioridade: 'media' },
];

const BARRAS_MOCK = [
  { label: 'Preço', valor: 45, cor: '#4f46e5', icone: '💰' },
  { label: 'Prazo', valor: 25, cor: '#059669', icone: '📦' },
  { label: 'Desconto', valor: 15, cor: '#d97706', icone: '🏷️' },
  { label: 'Catálogo', valor: 15, cor: '#2563eb', icone: '📄' },
];

const LINHA_MOCK = [
  { dia: 'Seg', valor: 30 }, { dia: 'Ter', valor: 45 }, { dia: 'Qua', valor: 35 },
  { dia: 'Qui', valor: 60 }, { dia: 'Sex', valor: 55 }, { dia: 'Sáb', valor: 80 }, { dia: 'Dom', valor: 70 },
];

const CATEGORIAS = [
  { value: 'saudacao', label: 'Saudação', cor: '#4f46e5' },
  { value: 'preco', label: 'Preço', cor: '#059669' },
  { value: 'prazo', label: 'Prazo/Entrega', cor: '#d97706' },
  { value: 'desconto', label: 'Desconto', cor: '#dc2626' },
  { value: 'catalogo', label: 'Catálogo', cor: '#2563eb' },
  { value: 'produto', label: 'Produto', cor: '#7c3aed' },
  { value: 'outro', label: 'Outro', cor: '#6b7280' },
];

const BASE_INICIAL = [
  { id: 1, chave: 'cadeira náutica', resp: 'Sim, temos a cadeira Náutica em várias cores! Branca, Preta e Natural.', img: 'https://images.pexels.com/photos/2178450/pexels-photo-2178450.jpeg?auto=compress&cs=tinysrgb&w=200', categoria: 'produto', usos: 12, ativa: true },
  { id: 2, chave: 'prazo entrega', resp: 'Nosso prazo médio é de 15 a 20 dias úteis, dependendo do volume.', img: '', categoria: 'prazo', usos: 8, ativa: true },
  { id: 3, chave: 'desconto quantidade', resp: 'Para compras acima de 5 unidades, oferecemos desconto progressivo!', img: '', categoria: 'desconto', usos: 5, ativa: true },
];

export default function GestaoIA() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dados Compartilhados
  const [iaAtiva, setIaAtiva] = useState(true);
  const [leads, setLeads] = useState(LEADS_MOCK);
  const [baseDados, setBaseDados] = useState(BASE_INICIAL);
  const [respostasIA, setRespostasIA] = useState(12);
  const [logs, setLogs] = useState([
    { id: 1, hora: '14:32', acao: 'IA respondeu automaticamente a "Maria Souza"', tipo: 'auto' },
    { id: 2, hora: '14:15', acao: 'Nova regra adicionada: "desconto quantidade"', tipo: 'regra' },
    { id: 3, hora: '13:50', acao: 'IA pausada pelo operador', tipo: 'sistema' },
  ]);

  // States do Chat (Tab Atendimento)
  const [ativo, setAtivo] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [buscaLead, setBuscaLead] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // States do Treinamento (Tab Laboratório)
  const [tPalavra, setTPalavra] = useState('');
  const [tResposta, setTResposta] = useState('');
  const [tImagem, setTImagem] = useState('');
  const [tCategoria, setTCategoria] = useState('outro');
  const [editandoRegra, setEditandoRegra] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((mensagem, tipo = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const addLog = useCallback((acao, tipo) => {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [{ id: Date.now(), hora, acao, tipo }, ...prev]);
  }, []);

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => { if (ativo) setTimeout(() => inputRef.current?.focus(), 100); }, [ativo]);

  // Lógica IA
  const pensarIA = useCallback(async (msg) => {
    for (const item of baseDados.filter(r => r.ativa)) {
      const palavras = item.chave.toLowerCase().split(' ');
      if (palavras.every(p => msg.toLowerCase().includes(p))) {
        setBaseDados(prev => prev.map(r => r.id === item.id ? { ...r, usos: r.usos + 1 } : r));
        return { texto: item.resp, img: item.img, origem: 'base_personalizada' };
      }
    }
    try {
      const resposta = await gerarRespostaIA(msg);
      return { texto: resposta, img: null, origem: 'base_geral' };
    } catch { return { texto: "Erro ao processar.", img: null, origem: 'erro' }; }
  }, [baseDados]);

  // Ações Chat
  const selectLead = useCallback((l) => {
    setAtivo(l);
    setMsgs([{ id: Date.now(), remetente: 'cliente', texto: l.msg, horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
  }, []);

  const usarIA = useCallback(async () => {
    if (!iaAtiva || !ativo || typing) return;
    setTyping(true);
    const ultimaMsg = msgs.filter(m => m.remetente === 'cliente').pop()?.texto || '';
    const result = await pensarIA(ultimaMsg);
    
    setMsgs(prev => [...prev, { id: Date.now(), remetente: 'ia', texto: result.texto, img: result.img, origem: result.origem, horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
    setTyping(false);
    setLeads(prev => prev.map(l => l.id === ativo.id ? { ...l, status: 'atendido' } : l));
    setRespostasIA(prev => prev + 1);
    addLog(`IA respondeu automaticamente a "${ativo.nome}"`, 'auto');
    addToast('Lead respondido pela IA!', 'success');
  }, [iaAtiva, ativo, typing, msgs, pensarIA, addToast, addLog]);

  const enviarManual = useCallback(() => {
    if (!input.trim() || !ativo) return;
    setMsgs(prev => [...prev, { id: Date.now(), remetente: 'humano', texto: input, horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
    setLeads(prev => prev.map(l => l.id === ativo.id ? { ...l, status: 'atendido' } : l));
    addLog(`Resposta manual enviada para "${ativo.nome}"`, 'manual');
    setInput('');
  }, [input, ativo, addLog]);

  // Ações Treinamento
  const treinar = useCallback(() => {
    if (!tPalavra.trim() || !tResposta.trim()) return addToast('Preencha gatilho e resposta!', 'error');
    if (editandoRegra) {
      setBaseDados(prev => prev.map(r => r.id === editandoRegra.id ? { ...r, chave: tPalavra, resp: tResposta, img: tImagem, categoria: tCategoria } : r));
      addLog(`Regra editada: "${tPalavra}"`, 'regra');
      addToast('Regra atualizada!', 'success');
      setEditandoRegra(null);
    } else {
      setBaseDados(prev => [...prev, { id: Date.now(), chave: tPalavra, resp: tResposta, img: tImagem, categoria: tCategoria, usos: 0, ativa: true }]);
      addLog(`Nova regra adicionada: "${tPalavra}"`, 'regra');
      addToast('Nova regra treinada!', 'success');
    }
    setTPalavra(''); setTResposta(''); setTImagem(''); setTCategoria('outro');
  }, [tPalavra, tResposta, tImagem, tCategoria, editandoRegra, addToast, addLog]);

  const editarRegra = useCallback((item) => {
    setEditandoRegra(item); setTPalavra(item.chave); setTResposta(item.resp); setTImagem(item.img); setTCategoria(item.categoria);
  }, []);

  const deleteRegra = useCallback((id) => {
    setBaseDados(prev => prev.filter(i => i.id !== id));
    setConfirmDelete(null);
    addLog('Regra removida da base', 'regra');
    addToast('Regra removida!', 'warning');
  }, [addToast, addLog]);

  // Dados derivados
  const contadores = useMemo(() => ({
    pendentes: leads.filter(l => l.status === 'pendente').length,
    atendidos: leads.filter(l => l.status === 'atendido').length,
  }), [leads]);

  const leadsFiltrados = useMemo(() => {
    return leads.filter(l => !buscaLead || l.nome.toLowerCase().includes(buscaLead.toLowerCase()) || l.msg.toLowerCase().includes(buscaLead.toLowerCase()));
  }, [leads, buscaLead]);

  // Dados Gráficos
  const svgW = 100, svgH = 100, svgPd = 8;
  const maxV = Math.max(...LINHA_MOCK.map(d => d.valor));
  const pontosLinha = LINHA_MOCK.map((d, i) => ({ x: svgPd + (i / (LINHA_MOCK.length - 1)) * (svgW - svgPd * 2), y: svgH - svgPd - ((d.valor / maxV) * (svgH - svgPd * 2)) }));
  const polylinePoints = pontosLinha.map(p => `${p.x},${p.y}`).join(' ');

  const getCategoriaInfo = (cat) => CATEGORIAS.find(c => c.value === cat) || CATEGORIAS[6];

  // ═══════════════════════════════════════
  // RENDER DAS TABS
  // ═══════════════════════════════════════

  // 1. DASHBOARD
  const renderDashboard = () => (
    <div className="tab-page fade-in">
      <div className="page-header">
        <div>
          <h2>Visão Geral da IA</h2>
          <p className="text-muted">Acompanhe as métricas e o desempenho em tempo real.</p>
        </div>
        <div className="status-card-main">
          <span className={`status-dot-main ${iaAtiva ? 'on' : 'off'}`}></span>
          <div>
            <strong>{iaAtiva ? 'Automação Ativa' : 'Automação Pausada'}</strong>
            <span className="text-muted">Clique para alterar</span>
          </div>
          <button className={`toggle-switch ${iaAtiva ? 'active' : ''}`} onClick={() => { setIaAtiva(!iaAtiva); addLog(!iaAtiva ? 'IA Ativada' : 'IA Pausada', 'sistema'); }}>
            <div className="toggle-knob"></div>
          </button>
        </div>
      </div>

      <div className="kpi-grid-modern">
        <div className="kpi-modern"><span className="kpi-number">{contadores.pendentes}</span><span className="kpi-label">Pendentes</span></div>
        <div className="kpi-modern"><span className="kpi-number primary">{respostasIA}</span><span className="kpi-label">Respostas IA</span></div>
        <div className="kpi-modern"><span className="kpi-number green">2.1s</span><span className="kpi-label">Tempo Médio</span></div>
        <div className="kpi-modern"><span className="kpi-number yellow">{baseDados.length}</span><span className="kpi-label">Regras Ativas</span></div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Volume de Atendimentos (7 dias)</h3>
          <div className="chart-area-box">
            <svg className="svg-chart" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
              <defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" /><stop offset="100%" stopColor="#4f46e5" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`${svgPd},${svgH - svgPd} ${polylinePoints} ${svgW - svgPd},${svgH - svgPd}`} fill="url(#grad)" />
              <polyline points={polylinePoints} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
              {pontosLinha.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#4f46e5" strokeWidth="2" />)}
            </svg>
          </div>
          <div className="chart-labels">{LINHA_MOCK.map((d, i) => <span key={i}>{d.dia}<b>{d.valor}</b></span>)}</div>
        </div>
        <div className="chart-card">
          <h3>Intenções Detectadas</h3>
          <div className="bars-container">
            {BARRAS_MOCK.map((b, i) => (
              <div key={i} className="bar-item">
                <div className="bar-info"><span>{b.icone} {b.label}</span><b>{b.valor}%</b></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${b.valor}%`, background: b.cor }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 2. ATENDIMENTO (LEADS)
  const renderAtendimento = () => (
    <div className="tab-page fade-in chat-layout">
      <div className="leads-sidebar">
        <div className="sidebar-header">
          <h3>Leads ({leadsFiltrados.length})</h3>
          <div className="search-box-clean">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Buscar..." value={buscaLead} onChange={e => setBuscaLead(e.target.value)} />
          </div>
        </div>
        <div className="leads-list-clean">
          {leadsFiltrados.map(l => (
            <div key={l.id} className={`lead-card-clean ${ativo?.id === l.id ? 'active' : ''}`} onClick={() => selectLead(l)}>
              <div className="lead-avatar-clean" style={{ background: l.status === 'atendido' ? '#d1fae5' : '#e0e7ff', color: l.status === 'atendido' ? '#059669' : '#4f46e5' }}>
                {l.status === 'atendido' ? '✓' : l.nome.charAt(0)}
              </div>
              <div className="lead-info-clean">
                <strong>{l.nome}</strong>
                <p>{l.msg}</p>
              </div>
              <span className="lead-time-clean">{l.tempo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main-clean">
        {ativo ? (
          <>
            <div className="chat-top-clean">
              <strong>{ativo.nome}</strong>
              <span className={`badge-status ${ativo.status}`}>{ativo.status === 'pendente' ? 'Pendente' : 'Atendido'}</span>
            </div>
            <div className="messages-area-clean">
              {msgs.map((m, i) => (
                <div key={i} className={`msg-clean ${m.remetente}`}>
                  {(m.remetente === 'ia' || m.remetente === 'humano') && <span className="msg-sender">{m.remetente === 'ia' ? 'Kasaleve IA' : 'Você'}</span>}
                  <div className="msg-bubble-clean">{m.texto}</div>
                  {m.img && <img src={m.img} className="msg-img-clean" alt="" />}
                  <span className="msg-time-clean">{m.horario}</span>
                </div>
              ))}
              {typing && <div className="msg-clean ia"><span className="msg-sender">Kasaleve IA</span><div className="msg-bubble-clean typing-clean"><span></span><span></span><span></span></div></div>}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-clean">
              <button className="btn-ai-clean" onClick={usarIA} disabled={!iaAtiva || typing}>
                {typing ? 'Pensando...' : '✨ Responder com IA'}
              </button>
              <div className="input-wrapper-clean">
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviarManual()} placeholder="Resposta manual..." />
                <button onClick={enviarManual} disabled={!input.trim()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3>Selecione um lead</h3>
            <p>Escolha uma conversa ao lado para começar</p>
          </div>
        )}
      </div>
    </div>
  );

  // 3. LABORATÓRIO
  const renderLaboratorio = () => (
    <div className="tab-page fade-in">
      <div className="page-header">
        <div>
          <h2>Laboratório de Treinamento</h2>
          <p className="text-muted">Ensine a IA a responder perguntas específicas sobre seu negócio.</p>
        </div>
      </div>

      <div className="train-box">
        <h3>{editandoRegra ? '✏️ Editando Regra' : '➕ Nova Regra'}</h3>
        <div className="train-grid">
          <div className="field-clean">
            <label>Gatilho (Palavra-chave)</label>
            <input value={tPalavra} onChange={e => setTPalavra(e.target.value)} placeholder="Ex: cadeira náutica" />
          </div>
          <div className="field-clean lg">
            <label>Resposta da IA</label>
            <input value={tResposta} onChange={e => setTResposta(e.target.value)} placeholder="O que a IA deve responder..." />
          </div>
          <div className="field-clean">
            <label>Categoria</label>
            <select value={tCategoria} onChange={e => setTCategoria(e.target.value)}>
              {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="field-clean">
            <label>URL Imagem (opcional)</label>
            <input value={tImagem} onChange={e => setTImagem(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="train-actions">
          <button className="btn-save" onClick={treinar}>{editandoRegra ? 'Salvar Alterações' : 'Adicionar Regra'}</button>
          {editandoRegra && <button className="btn-cancel-clean" onClick={() => { setEditandoRegra(null); setTPalavra(''); setTResposta(''); setTImagem(''); }}>Cancelar</button>}
        </div>
      </div>

      <div className="rules-grid">
        {baseDados.map(item => {
          const cat = getCategoriaInfo(item.categoria);
          return (
            <div key={item.id} className={`rule-item-modern ${!item.ativa ? 'disabled' : ''}`}>
              <div className="rule-top">
                <span className="rule-cat" style={{ color: cat.cor, background: cat.cor + '15' }}>{cat.label}</span>
                <div className="rule-btns">
                  <button onClick={() => setBaseDados(p => p.map(r => r.id === item.id ? { ...r, ativa: !r.ativa } : r))}>{item.ativa ? '⏸' : '▶'}</button>
                  <button onClick={() => editarRegra(item)}>✎</button>
                  {confirmDelete === item.id ? (
                    <div className="confirm-popup"><span>Excluir?</span><button onClick={() => deleteRegra(item.id)}>Sim</button><button onClick={() => setConfirmDelete(null)}>Não</button></div>
                  ) : (
                    <button onClick={() => setConfirmDelete(item.id)}>✕</button>
                  )}
                </div>
              </div>
              <h4>"{item.chave}"</h4>
              <p>{item.resp}</p>
              {item.img && <img src={item.img} className="rule-img-modern" alt="" />}
              <div className="rule-footer"><span>📊 Usado {item.usos} vezes</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 4. HISTÓRICO / STATUS
  const renderHistorico = () => (
    <div className="tab-page fade-in">
      <div className="page-header">
        <div>
          <h2>Histórico de Ações</h2>
          <p className="text-muted">Log completo de tudo que aconteceu no sistema.</p>
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? <p className="text-muted">Nenhuma ação registrada ainda.</p> : 
          logs.map(log => (
            <div key={log.id} className={`log-item ${log.tipo}`}>
              <span className="log-time">{log.hora}</span>
              <span className={`log-icon ${log.tipo}`}>{log.tipo === 'auto' ? '🤖' : log.tipo === 'manual' ? '👤' : log.tipo === 'regra' ? '🧠' : '⚙️'}</span>
              <span className="log-text">{log.acao}</span>
            </div>
          ))
        }
      </div>
    </div>
  );

  return (
    <>
      <MenuPage />
      <div className="gestao-container">
        <BTNVolta />
        <div className="toast-container">{toasts.map(t => <Toast key={t.id} mensagem={t.mensagem} tipo={t.tipo} onClose={() => setToasts(prev => prev.filter(to => to.id !== t.id))} />)}</div>

        <div className="main-tabs-nav">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Atendimento
            {contadores.pendentes > 0 && <span className="tab-badge">{contadores.pendentes}</span>}
          </button>
          <button className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a6 6 0 0 0-6 6v2h20v-2a6 6 0 0 0-6-6z"/></svg>
            Laboratório
          </button>
          <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Histórico
          </button>
        </div>

        <div className="tab-content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'leads' && renderAtendimento()}
          {activeTab === 'training' && renderLaboratorio()}
          {activeTab === 'logs' && renderHistorico()}
        </div>
      </div>
    </>
  );
}