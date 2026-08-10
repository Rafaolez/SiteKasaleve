import React, { useState, useCallback, useMemo } from 'react';
import '../css/Tarefas.css';
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import MenuDeLado from '../components/MenuDeLado';

// ─── constantes ──────────────────────────────────────────
const HOJE = new Date();
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const PRIORIDADES = {
    urgente: { label: 'Urgente', cor: '#e05c5c', bg: '#fdf0ee', icon: '🔴' },
    alta: { label: 'Alta', cor: '#f0a500', bg: '#fff8e6', icon: '🟠' },
    media: { label: 'Média', cor: '#f5c800', bg: '#fffce6', icon: '🟡' },
    baixa: { label: 'Baixa', cor: '#2d7d52', bg: '#edf7f2', icon: '🟢' },
};

const STATUS_LIST = {
    nao_iniciada: { label: 'Não iniciada', cor: '#b0b0a8', icon: '⬜' },
    andamento: { label: 'Em andamento', cor: '#5b8dee', icon: '🔵' },
    aguardando: { label: 'Aguardando', cor: '#f0a500', icon: '⏳' },
    concluida: { label: 'Concluída', cor: '#2d7d52', icon: '✅' },
    cancelada: { label: 'Cancelada', cor: '#e05c5c', icon: '❌' },
};

const TIPOS = {
    chefe: { label: 'Do chefe', cor: '#5b8dee', bg: '#eff4ff', icon: '👔' },
    pessoal: { label: 'Pessoal', cor: '#9b59b6', bg: '#f5edff', icon: '👤' },
};

// ─── mock inicial ─────────────────────────────────────────
const gerarId = () => Math.random().toString(36).slice(2, 9);
const hoje = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);

const TAREFAS_INICIAIS = [
    {
        id: gerarId(), titulo: 'Fechar orçamento João', tipo: 'chefe', prioridade: 'urgente', status: 'andamento',
        data: fmt(hoje), hora: '10:00', tempo: 60, setor: 'Vendas', responsavel: 'Ana',
        checklist: [{ id: gerarId(), texto: 'Ligar cliente', ok: true }, { id: gerarId(), texto: 'Calcular valor', ok: false }, { id: gerarId(), texto: 'Enviar PDF', ok: false }],
        comentarios: ['Cliente pediu alteração no tampo.'], recorrente: false, descricao: 'Orçamento de mesas e cadeiras para varanda.'
    },
    {
        id: gerarId(), titulo: 'Organizar estoque', tipo: 'chefe', prioridade: 'alta', status: 'nao_iniciada',
        data: fmt(hoje), hora: '14:00', tempo: 90, setor: 'Estoque', responsavel: 'Carlos',
        checklist: [], comentarios: [], recorrente: true, recorrencia: 'semanal', descricao: ''
    },
    {
        id: gerarId(), titulo: 'Responder e-mails', tipo: 'pessoal', prioridade: 'media', status: 'nao_iniciada',
        data: fmt(hoje), hora: '09:00', tempo: 30, setor: '', responsavel: '',
        checklist: [{ id: gerarId(), texto: 'E-mail fornecedor', ok: false }, { id: gerarId(), texto: 'E-mail cliente Ribeirão', ok: false }],
        comentarios: [], recorrente: false, descricao: ''
    },
    {
        id: gerarId(), titulo: 'Reunião equipe vendas', tipo: 'chefe', prioridade: 'alta', status: 'concluida',
        data: fmt(new Date(hoje.getTime() - 86400000)), hora: '08:00', tempo: 60, setor: 'Vendas', responsavel: 'Ana',
        checklist: [], comentarios: ['Reunião realizada com sucesso.'], recorrente: true, recorrencia: 'semanal', descricao: ''
    },
    {
        id: gerarId(), titulo: 'Atualizar tabela de preços', tipo: 'pessoal', prioridade: 'baixa', status: 'nao_iniciada',
        data: fmt(new Date(hoje.getTime() + 86400000)), hora: '16:00', tempo: 45, setor: '', responsavel: '',
        checklist: [], comentarios: [], recorrente: false, descricao: ''
    },
];

// ─── helpers ─────────────────────────────────────────────
function diasAtraso(data) {
    const d = new Date(data + 'T00:00:00');
    const h = new Date(); h.setHours(0, 0, 0, 0);
    const diff = Math.floor((h - d) / 86400000);
    return diff;
}

function cargaDia(tarefas) {
    const pts = tarefas.reduce((a, t) => {
        const peso = { urgente: 4, alta: 3, media: 2, baixa: 1 }[t.prioridade] || 1;
        return a + peso + (t.tempo || 30) / 60;
    }, 0);
    if (pts <= 4) return { label: 'Leve', cor: '#2d7d52', bg: '#edf7f2' };
    if (pts <= 9) return { label: 'Médio', cor: '#f0a500', bg: '#fff8e6' };
    return { label: 'Pesado', cor: '#e05c5c', bg: '#fdf0ee' };
}

// ─── Modal de tarefa ──────────────────────────────────────
function ModalTarefa({ tarefa, onClose, onSave, onDelete }) {
    const [form, setForm] = useState({ ...tarefa });
    const [novoCheck, setNovoCheck] = useState('');
    const [novoComent, setNovoComent] = useState('');

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    function toggleCheck(id) {
        setForm(p => ({ ...p, checklist: p.checklist.map(c => c.id === id ? { ...c, ok: !c.ok } : c) }));
    }
    function addCheck() {
        if (!novoCheck.trim()) return;
        setForm(p => ({ ...p, checklist: [...p.checklist, { id: gerarId(), texto: novoCheck, ok: false }] }));
        setNovoCheck('');
    }
    function removeCheck(id) {
        setForm(p => ({ ...p, checklist: p.checklist.filter(c => c.id !== id) }));
    }
    function addComent() {
        if (!novoComent.trim()) return;
        setForm(p => ({ ...p, comentarios: [...p.comentarios, novoComent] }));
        setNovoComent('');
    }

    const atraso = diasAtraso(form.data);
    const checkOk = form.checklist.filter(c => c.ok).length;
    const checkPct = form.checklist.length ? Math.round(checkOk / form.checklist.length * 100) : 0;

    return (
        <div className="tk-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="tk-modal">

                {/* header */}
                <div className="tk-modal__header" style={{ borderLeft: `4px solid ${PRIORIDADES[form.prioridade].cor}` }}>
                    <div className="tk-modal__tipo">
                        <span style={{ background: TIPOS[form.tipo].bg, color: TIPOS[form.tipo].cor }} className="tk-badge">
                            {TIPOS[form.tipo].icon} {TIPOS[form.tipo].label}
                        </span>
                        {atraso > 0 && form.status !== 'concluida' && (
                            <span className="tk-badge tk-badge--atraso">🔴 ATRASADA HÁ {atraso} DIA{atraso > 1 ? 'S' : ''}</span>
                        )}
                    </div>
                    <button className="tk-modal__close" onClick={onClose}>✕</button>
                </div>

                <div className="tk-modal__body">
                    {/* título */}
                    <input className="tk-modal__titulo" value={form.titulo} onChange={set('titulo')} placeholder="Título da tarefa..." />

                    {/* linha de meta */}
                    <div className="tk-modal__meta">
                        <div className="tk-field">
                            <label>Prioridade</label>
                            <select value={form.prioridade} onChange={set('prioridade')}>
                                {Object.entries(PRIORIDADES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                            </select>
                        </div>
                        <div className="tk-field">
                            <label>Status</label>
                            <select value={form.status} onChange={set('status')}>
                                {Object.entries(STATUS_LIST).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                            </select>
                        </div>
                        <div className="tk-field">
                            <label>Tipo</label>
                            <select value={form.tipo} onChange={set('tipo')}>
                                {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                            </select>
                        </div>
                        <div className="tk-field">
                            <label>Data</label>
                            <input type="date" value={form.data} onChange={set('data')} />
                        </div>
                        <div className="tk-field">
                            <label>Hora</label>
                            <input type="time" value={form.hora} onChange={set('hora')} />
                        </div>
                        <div className="tk-field">
                            <label>Tempo est. (min)</label>
                            <input type="number" min="5" step="5" value={form.tempo} onChange={set('tempo')} />
                        </div>
                        <div className="tk-field">
                            <label>Responsável</label>
                            <input value={form.responsavel} onChange={set('responsavel')} placeholder="Nome..." />
                        </div>
                        <div className="tk-field">
                            <label>Setor</label>
                            <input value={form.setor} onChange={set('setor')} placeholder="Setor..." />
                        </div>
                    </div>

                    {/* descrição */}
                    <div className="tk-field tk-field--full">
                        <label>Descrição</label>
                        <textarea rows={2} value={form.descricao} onChange={set('descricao')} placeholder="Detalhes da tarefa..." />
                    </div>

                    {/* recorrência */}
                    <div className="tk-recor">
                        <label className="tk-recor__check">
                            <input type="checkbox" checked={form.recorrente} onChange={e => setForm(p => ({ ...p, recorrente: e.target.checked }))} />
                            <span>Tarefa recorrente</span>
                        </label>
                        {form.recorrente && (
                            <select value={form.recorrencia || 'semanal'} onChange={set('recorrencia')} className="tk-recor__sel">
                                <option value="diaria">Diária</option>
                                <option value="semanal">Semanal</option>
                                <option value="quinzenal">Quinzenal</option>
                                <option value="mensal">Mensal</option>
                            </select>
                        )}
                    </div>

                    {/* checklist */}
                    <div className="tk-checklist">
                        <div className="tk-checklist__header">
                            <span className="tk-section-title">Checklist</span>
                            {form.checklist.length > 0 && (
                                <div className="tk-progress">
                                    <div className="tk-progress__bar">
                                        <div className="tk-progress__fill" style={{ width: `${checkPct}%` }} />
                                    </div>
                                    <span>{checkOk}/{form.checklist.length} — {checkPct}%</span>
                                </div>
                            )}
                        </div>
                        <div className="tk-checklist__list">
                            {form.checklist.map(c => (
                                <div key={c.id} className="tk-check-item">
                                    <input type="checkbox" checked={c.ok} onChange={() => toggleCheck(c.id)} />
                                    <span className={c.ok ? 'tk-check-item__text--done' : ''}>{c.texto}</span>
                                    <button onClick={() => removeCheck(c.id)} className="tk-check-item__del">✕</button>
                                </div>
                            ))}
                        </div>
                        <div className="tk-checklist__add">
                            <input placeholder="Nova subtarefa..." value={novoCheck} onChange={e => setNovoCheck(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addCheck()} />
                            <button onClick={addCheck}>+</button>
                        </div>
                    </div>

                    {/* comentários */}
                    <div className="tk-comentarios">
                        <span className="tk-section-title">Comentários</span>
                        <div className="tk-comentarios__list">
                            {form.comentarios.map((c, i) => (
                                <div key={i} className="tk-coment-item">
                                    <span className="tk-coment-item__avatar">👤</span>
                                    <p>{c}</p>
                                </div>
                            ))}
                        </div>
                        <div className="tk-comentarios__add">
                            <input placeholder="Adicionar comentário..." value={novoComent}
                                onChange={e => setNovoComent(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addComent()} />
                            <button onClick={addComent}>Enviar</button>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="tk-modal__footer">
                    <button className="tk-btn tk-btn--danger" onClick={() => onDelete(tarefa.id)}>🗑 Excluir</button>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="tk-btn tk-btn--ghost" onClick={onClose}>Cancelar</button>
                        <button className="tk-btn tk-btn--primary" onClick={() => onSave(form)}>💾 Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Card de tarefa ───────────────────────────────────────
function CardTarefa({ t, onClick }) {
    const atraso = diasAtraso(t.data);
    const atrasada = atraso > 0 && t.status !== 'concluida' && t.status !== 'cancelada';
    const pri = PRIORIDADES[t.prioridade];
    const chk = t.checklist.length;
    const chkOk = t.checklist.filter(c => c.ok).length;

    return (
        <div
            className={`tk-card ${atrasada ? 'tk-card--atrasada' : ''} ${t.status === 'concluida' ? 'tk-card--concluida' : ''}`}
            style={{ borderLeft: `3px solid ${pri.cor}` }}
            onClick={() => onClick(t)}
        >
            <div className="tk-card__top">
                <span className="tk-card__tipo" style={{ color: TIPOS[t.tipo].cor }}>{TIPOS[t.tipo].icon}</span>
                <span className="tk-card__titulo">{t.titulo}</span>
                <span className="tk-card__hora">{t.hora}</span>
            </div>

            <div className="tk-card__meta">
                <span className="tk-badge tk-badge--sm" style={{ background: pri.bg, color: pri.cor }}>
                    {pri.icon} {pri.label}
                </span>
                <span className="tk-badge tk-badge--sm" style={{ background: '#f5f5f0', color: STATUS_LIST[t.status].cor }}>
                    {STATUS_LIST[t.status].icon} {STATUS_LIST[t.status].label}
                </span>
                {t.tempo && <span className="tk-card__tempo">⏱ {t.tempo}min</span>}
                {t.recorrente && <span className="tk-card__tempo">🔁</span>}
            </div>

            {chk > 0 && (
                <div className="tk-card__progress">
                    <div className="tk-progress__bar tk-progress__bar--sm">
                        <div className="tk-progress__fill" style={{ width: `${Math.round(chkOk / chk * 100)}%` }} />
                    </div>
                    <span>{chkOk}/{chk}</span>
                </div>
            )}

            {atrasada && (
                <div className="tk-card__atraso">🔴 Atrasada há {atraso} dia{atraso > 1 ? 's' : ''}</div>
            )}
        </div>
    );
}

// ─── Calendário mini ──────────────────────────────────────
function CalendarioMini({ dataSel, onSelect, tarefas }) {
    const [mes, setMes] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));

    const dias = useMemo(() => {
        const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
        const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
        const arr = [];
        for (let i = 0; i < primeiro; i++) arr.push(null);
        for (let d = 1; d <= total; d++) {
            const iso = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            arr.push({ d, iso, temTarefa: tarefas.some(t => t.data === iso) });
        }
        return arr;
    }, [mes, tarefas]);

    return (
        <div className="tk-cal-mini">
            <div className="tk-cal-mini__nav">
                <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}>‹</button>
                <span>{MESES[mes.getMonth()].slice(0, 3)} {mes.getFullYear()}</span>
                <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}>›</button>
            </div>
            <div className="tk-cal-mini__grid">
                {DIAS_SEMANA.map(d => <span key={d} className="tk-cal-mini__dow">{d.slice(0, 1)}</span>)}
                {dias.map((d, i) => d === null
                    ? <span key={`e${i}`} />
                    : (
                        <button key={d.iso}
                            className={`tk-cal-mini__day ${d.iso === dataSel ? 'tk-cal-mini__day--sel' : ''} ${d.iso === fmt(hoje) ? 'tk-cal-mini__day--hoje' : ''}`}
                            onClick={() => onSelect(d.iso)}
                        >
                            {d.d}
                            {d.temTarefa && <span className="tk-cal-mini__dot" />}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function Tarefas() {
    const [tarefas, setTarefas] = useState(TAREFAS_INICIAIS);
    const [dataSel, setDataSel] = useState(fmt(hoje));
    const [modalTarefa, setModal] = useState(null);
    const [novaOpen, setNovaOpen] = useState(false);
    const [filtros, setFiltros] = useState({ tipo: 'todos', status: 'todos', prioridade: 'todos' });
    const [vista, setVista] = useState('semana'); // semana | mes | lista
    const [modoFoco, setModoFoco] = useState(false);
    const [busca, setBusca] = useState('');

    // ── semana atual ──
    const semana = useMemo(() => {
        const sel = new Date(dataSel + 'T00:00:00');
        const dow = sel.getDay();
        const inicio = new Date(sel); inicio.setDate(sel.getDate() - dow);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(inicio); d.setDate(inicio.getDate() + i);
            return fmt(d);
        });
    }, [dataSel]);

    // ── tarefas filtradas ──
    const tarefasDodia = useCallback((data) => {
        return tarefas
            .filter(t => {
                const atraso = diasAtraso(t.data);
                // atraso: puxa para hoje se não concluída
                const dataEfetiva = (atraso > 0 && t.status !== 'concluida' && t.status !== 'cancelada')
                    ? fmt(hoje) : t.data;
                if (dataEfetiva !== data) return false;
                if (filtros.tipo !== 'todos' && t.tipo !== filtros.tipo) return false;
                if (filtros.status !== 'todos' && t.status !== filtros.status) return false;
                if (filtros.prioridade !== 'todos' && t.prioridade !== filtros.prioridade) return false;
                if (busca && !t.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => {
                const po = { urgente: 0, alta: 1, media: 2, baixa: 3 };
                return (po[a.prioridade] || 3) - (po[b.prioridade] || 3) || a.hora.localeCompare(b.hora);
            });
    }, [tarefas, filtros, busca]);

    // ── actions ──
    function salvarTarefa(form) {
        setTarefas(prev => prev.map(t => t.id === form.id ? form : t));
        setModal(null);
    }

    function excluirTarefa(id) {
        setTarefas(prev => prev.filter(t => t.id !== id));
        setModal(null);
    }

    function criarTarefa() {
        const nova = {
            id: gerarId(), titulo: 'Nova tarefa', tipo: 'pessoal', prioridade: 'media',
            status: 'nao_iniciada', data: dataSel, hora: '09:00', tempo: 30,
            setor: '', responsavel: '', checklist: [], comentarios: [], recorrente: false, descricao: '',
        };
        setTarefas(prev => [...prev, nova]);
        setModal(nova);
    }

    function concluirRapido(id, e) {
        e.stopPropagation();
        setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'concluida' ? 'nao_iniciada' : 'concluida' } : t));
    }

    const tarefasHoje = tarefasDodia(fmt(hoje));
    const carga = cargaDia(tarefasHoje);
    const totalAtrasadas = tarefas.filter(t => diasAtraso(t.data) > 0 && t.status !== 'concluida' && t.status !== 'cancelada').length;
    const totalHoje = tarefasHoje.length;
    const concluidas = tarefasHoje.filter(t => t.status === 'concluida').length;

    // ── Modo foco ──
    if (modoFoco) {
        const focoTarefas = tarefasDodia(fmt(hoje)).filter(t => t.status !== 'concluida' && t.status !== 'cancelada');
        return (
            <div className="tk-foco">
                <div className="tk-foco__header">
                    <div>
                        <p className="tk-foco__label">Modo Foco — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <h1 className="tk-foco__title">Suas tarefas de hoje</h1>
                    </div>
                    <button className="tk-btn tk-btn--ghost" onClick={() => setModoFoco(false)}>← Voltar</button>
                </div>
                <div className="tk-foco__carga" style={{ background: carga.bg, color: carga.cor }}>
                    Carga do dia: <strong>{carga.label}</strong>
                </div>
                <div className="tk-foco__list">
                    {focoTarefas.length === 0
                        ? <div className="tk-empty">🎉 Nenhuma tarefa pendente para hoje!</div>
                        : focoTarefas.map(t => (
                            <div key={t.id} className="tk-foco__card" onClick={() => setModal(t)}
                                style={{ borderLeft: `4px solid ${PRIORIDADES[t.prioridade].cor}` }}>
                                <div className="tk-foco__card-left">
                                    <button className="tk-check-rapido" onClick={e => concluirRapido(t.id, e)}>⬜</button>
                                    <div>
                                        <p className="tk-foco__card-titulo">{t.titulo}</p>
                                        <p className="tk-foco__card-meta">{t.hora} · ⏱ {t.tempo}min · {PRIORIDADES[t.prioridade].icon} {PRIORIDADES[t.prioridade].label}</p>
                                    </div>
                                </div>
                                <span className="tk-badge" style={{ background: PRIORIDADES[t.prioridade].bg, color: PRIORIDADES[t.prioridade].cor }}>
                                    {PRIORIDADES[t.prioridade].icon}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <MenuPage />
            <div className="tk-page">

                {/* ── SIDEBAR ── */}
                <aside className="tk-sidebar">
                    <BTNVolta />

                    <div className="tk-sidebar__section">
                        <p className="tk-sidebar__label">Menu rápido</p>
                        <button className="tk-btn tk-btn--primary tk-btn--full" onClick={criarTarefa}>
                            + Nova Tarefa
                        </button>
                        <button className="tk-btn tk-btn--foco tk-btn--full" onClick={() => setModoFoco(true)}>
                            🎯 Modo Foco
                        </button>
                    </div>

                    {/* Calendário mini */}
                    <CalendarioMini dataSel={dataSel} onSelect={setDataSel} tarefas={tarefas} />

                    {/* Stats */}
                    <div className="tk-sidebar__section">
                        <p className="tk-sidebar__label">Hoje</p>
                        <div className="tk-mini-stats">
                            <div className="tk-mini-stat"><span>{totalHoje}</span><label>Total</label></div>
                            <div className="tk-mini-stat"><span style={{ color: '#2d7d52' }}>{concluidas}</span><label>Feitas</label></div>
                            <div className="tk-mini-stat"><span style={{ color: '#e05c5c' }}>{totalAtrasadas}</span><label>Atrasadas</label></div>
                        </div>
                        <div className="tk-carga-pill" style={{ background: carga.bg, color: carga.cor }}>
                            Carga: <strong>{carga.label}</strong>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="tk-sidebar__section">
                        <p className="tk-sidebar__label">Filtros</p>
                        <div className="tk-filtros">
                            <select value={filtros.tipo} onChange={e => setFiltros(p => ({ ...p, tipo: e.target.value }))}>
                                <option value="todos">Todos os tipos</option>
                                <option value="chefe">👔 Do chefe</option>
                                <option value="pessoal">👤 Pessoal</option>
                            </select>
                            <select value={filtros.status} onChange={e => setFiltros(p => ({ ...p, status: e.target.value }))}>
                                <option value="todos">Todos os status</option>
                                {Object.entries(STATUS_LIST).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                            </select>
                            <select value={filtros.prioridade} onChange={e => setFiltros(p => ({ ...p, prioridade: e.target.value }))}>
                                <option value="todos">Todas prioridades</option>
                                {Object.entries(PRIORIDADES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Legenda */}
                    <div className="tk-sidebar__section">
                        <p className="tk-sidebar__label">Legenda</p>
                        <div className="tk-legenda">
                            {Object.entries(PRIORIDADES).map(([k, v]) => (
                                <div key={k} className="tk-legenda__item">
                                    <span className="tk-legenda__dot" style={{ background: v.cor }} />{v.icon} {v.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── CONTEÚDO CENTRAL ── */}
                <main className="tk-main">

                    {/* header */}
                    <div className="tk-main__header">
                        <div>
                            <p className="tk-eyebrow">Agenda</p>
                            <h1 className="tk-title">Tarefas</h1>
                        </div>
                        <div className="tk-main__controls">
                            <div className="tk-search">
                                <span>🔍</span>
                                <input placeholder="Buscar tarefa..." value={busca} onChange={e => setBusca(e.target.value)} />
                            </div>
                            <div className="tk-vista-chips">
                                {['semana', 'mes', 'lista'].map(v => (
                                    <button key={v} className={`tk-chip ${vista === v ? 'tk-chip--active' : ''}`} onClick={() => setVista(v)}>
                                        {v === 'semana' ? 'Semana' : v === 'mes' ? 'Mês' : 'Lista'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── VISTA SEMANA ── */}
                    {vista === 'semana' && (
                        <div className="tk-semana">
                            <div className="tk-semana__nav">
                                <button onClick={() => setDataSel(fmt(new Date(new Date(dataSel + 'T00:00:00').getTime() - 7 * 86400000)))}>‹ Semana anterior</button>
                                <button className="tk-btn tk-btn--ghost" onClick={() => setDataSel(fmt(hoje))}>Hoje</button>
                                <button onClick={() => setDataSel(fmt(new Date(new Date(dataSel + 'T00:00:00').getTime() + 7 * 86400000)))}>Próxima semana ›</button>
                            </div>
                            <div className="tk-semana__grid">
                                {semana.map(dia => {
                                    const d = new Date(dia + 'T00:00:00');
                                    const isHoje = dia === fmt(hoje);
                                    const isSel = dia === dataSel;
                                    const tfs = tarefasDodia(dia);
                                    return (
                                        <div key={dia}
                                            className={`tk-dia ${isHoje ? 'tk-dia--hoje' : ''} ${isSel ? 'tk-dia--sel' : ''}`}
                                            onClick={() => setDataSel(dia)}
                                        >
                                            <div className="tk-dia__header">
                                                <span className="tk-dia__dow">{DIAS_SEMANA[d.getDay()]}</span>
                                                <span className={`tk-dia__num ${isHoje ? 'tk-dia__num--hoje' : ''}`}>{d.getDate()}</span>
                                                {tfs.length > 0 && <span className="tk-dia__count">{tfs.length}</span>}
                                            </div>
                                            <div className="tk-dia__cards">
                                                {tfs.slice(0, 3).map(t => (
                                                    <div key={t.id} className="tk-dia__pill"
                                                        style={{ background: PRIORIDADES[t.prioridade].bg, color: PRIORIDADES[t.prioridade].cor, borderLeft: `2px solid ${PRIORIDADES[t.prioridade].cor}` }}
                                                        onClick={e => { e.stopPropagation(); setModal(t); }}>
                                                        <button className="tk-dia__check" onClick={e => concluirRapido(t.id, e)}>
                                                            {t.status === 'concluida' ? '✅' : '⬜'}
                                                        </button>
                                                        <span className={t.status === 'concluida' ? 'tk-riscado' : ''}>{t.titulo}</span>
                                                    </div>
                                                ))}
                                                {tfs.length > 3 && <div className="tk-dia__mais">+{tfs.length - 3} mais</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* tarefas do dia selecionado */}
                            <div className="tk-dia-detalhe">
                                <div className="tk-dia-detalhe__header">
                                    <h3>
                                        {new Date(dataSel + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </h3>
                                    <button className="tk-btn tk-btn--primary" onClick={criarTarefa}>+ Adicionar</button>
                                </div>
                                {tarefasDodia(dataSel).length === 0
                                    ? <div className="tk-empty">Nenhuma tarefa para este dia.</div>
                                    : tarefasDodia(dataSel).map(t => (
                                        <div key={t.id} style={{ position: 'relative' }}>
                                            <button className="tk-check-rapido-ext" onClick={e => concluirRapido(t.id, e)}
                                                title={t.status === 'concluida' ? 'Desfazer' : 'Concluir'}>
                                                {t.status === 'concluida' ? '✅' : '⬜'}
                                            </button>
                                            <CardTarefa t={t} onClick={setModal} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {/* ── VISTA MÊS ── */}
                    {vista === 'mes' && (
                        <div className="tk-mes-wrap">
                            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Clique em um dia para ver as tarefas.</p>
                            <CalendarioMini dataSel={dataSel} onSelect={d => { setDataSel(d); setVista('semana'); }} tarefas={tarefas} />
                        </div>
                    )}

                    {/* ── VISTA LISTA ── */}
                    {vista === 'lista' && (
                        <div className="tk-lista">
                            {tarefas
                                .filter(t => {
                                    if (filtros.tipo !== 'todos' && t.tipo !== filtros.tipo) return false;
                                    if (filtros.status !== 'todos' && t.status !== filtros.status) return false;
                                    if (filtros.prioridade !== 'todos' && t.prioridade !== filtros.prioridade) return false;
                                    if (busca && !t.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
                                    return true;
                                })
                                .sort((a, b) => {
                                    const po = { urgente: 0, alta: 1, media: 2, baixa: 3 };
                                    return (po[a.prioridade] || 3) - (po[b.prioridade] || 3) || a.data.localeCompare(b.data);
                                })
                                .map(t => (
                                    <div key={t.id} style={{ position: 'relative' }}>
                                        <button className="tk-check-rapido-ext" onClick={e => concluirRapido(t.id, e)}>
                                            {t.status === 'concluida' ? '✅' : '⬜'}
                                        </button>
                                        <CardTarefa t={t} onClick={setModal} />
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </main>

                {/* Modal */}
                {modalTarefa && (
                    <ModalTarefa
                        tarefa={modalTarefa}
                        onClose={() => setModal(null)}
                        onSave={salvarTarefa}
                        onDelete={excluirTarefa}
                    />
                )}
            </div>
        </>
    );
}