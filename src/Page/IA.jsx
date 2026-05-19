import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from './Context/AuthContext';
import BTNVolta from "../components/BTNVolta";
import MenuPage from "../components/MenuPage";
import MenuHome from "../components/MenuHome";
import "../css/IA.css";

// ─── mock data ───────Teste mas vai ser substituido por "API"─────────────────────────────────────
const MOCK_LEADS = [
  { id:1, nome:"Carlos Mendes",   telefone:"(11) 99812-3456", status:"quente",   etapa:"Quer ligação",      ultima:"Tenho interesse, pode me ligar?",    tempo:"2min",  avatar:"CM" },
  { id:2, nome:"Ana Ferreira",    telefone:"(11) 97654-8901", status:"quente",   etapa:"Atendimento avançado", ultima:"Qual o prazo de entrega?",          tempo:"5min",  avatar:"AF" },
  { id:3, nome:"Roberto Lima",    telefone:"(21) 98765-4321", status:"morno",    etapa:"Negociando",        ultima:"Fica muito acima do meu orçamento.",  tempo:"18min", avatar:"RL" },
  { id:4, nome:"Juliana Costa",   telefone:"(11) 91234-5678", status:"quente",   etapa:"Quer ligação",      ultima:"Pode enviar o catálogo completo?",    tempo:"1min",  avatar:"JC" },
  { id:5, nome:"Marcos Oliveira", telefone:"(31) 99876-5432", status:"morno",    etapa:"Atendimento avançado", ultima:"Tenho um projeto para área externa.",tempo:"32min", avatar:"MO" },
  { id:6, nome:"Fernanda Silva",  telefone:"(11) 95555-1234", status:"frio",     etapa:"Primeiro contato",  ultima:"Ok, vou pensar.",                    tempo:"2h",    avatar:"FS" },
  { id:7, nome:"Lucas Pereira",   telefone:"(41) 98899-0011", status:"fechado",  etapa:"Fechado",           ultima:"Fechado! Pode gerar o pedido.",       tempo:"1d",    avatar:"LP" },
  { id:8, nome:"Patrícia Souza",  telefone:"(11) 97788-3344", status:"quente",   etapa:"Negociando",        ultima:"Se der 10% de desconto fecho.",       tempo:"8min",  avatar:"PS" },
];

const MOCK_TREINOS = [
  { id:1, pergunta:"Qual o prazo de entrega?",          resposta:"Nosso prazo médio é de 30 a 45 dias úteis após confirmação do pedido. 😊",  aprovado:true  },
  { id:2, pergunta:"Vocês fazem frete grátis?",         resposta:"O frete é calculado sobre 8,5% do valor total do pedido.",                  aprovado:true  },
  { id:3, pergunta:"Tem produto disponível em estoque?",resposta:"Trabalhamos sob encomenda para garantir personalização total!",              aprovado:false },
];

const EVOLUCAO = [
  { mes:"Jan", leads:12, atendidos:9,  fechados:3  },
  { mes:"Fev", leads:18, atendidos:14, fechados:5  },
  { mes:"Mar", leads:25, atendidos:20, fechados:8  },
  { mes:"Abr", leads:22, atendidos:17, fechados:6  },
  { mes:"Mai", leads:31, atendidos:26, fechados:11 },
  { mes:"Jun", leads:38, atendidos:30, fechados:14 },
  { mes:"Jul", leads:42, atendidos:36, fechados:18 },
];

const STATUS_COLOR = { quente:"#e05c5c", morno:"#f0a500", frio:"#5b8dee", fechado:"#2d7d52" };
const STATUS_BG    = { quente:"#fdf0ee", morno:"#fff8e6", frio:"#eff4ff",  fechado:"#edf7f2" };

// ─── sub-components ───────────────────────────────────────
function PulsingDot({ color = "#2d7d52" }) {
  return (
    <span className="ia-pulse-wrap">
      <span className="ia-pulse-ring" style={{ borderColor: color }} />
      <span className="ia-pulse-dot"  style={{ background: color }} />
    </span>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="ia-stat" style={{ "--accent": accent }}>
      <div className="ia-stat__icon">{icon}</div>
      <div className="ia-stat__body">
        <p className="ia-stat__label">{label}</p>
        <p className="ia-stat__value">{value}</p>
        {sub && <p className="ia-stat__sub">{sub}</p>}
      </div>
      <div className="ia-stat__bar" />
    </div>
  );
}

// mini bar chart pure CSS
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.leads));
  return (
    <div className="ia-chart">
      {data.map((d, i) => (
        <div key={i} className="ia-chart__col">
          <div className="ia-chart__bars">
            <div className="ia-chart__bar ia-chart__bar--leads"
              style={{ height: `${(d.leads / max) * 100}%`, animationDelay: `${i * 0.06}s` }} />
            <div className="ia-chart__bar ia-chart__bar--atendidos"
              style={{ height: `${(d.atendidos / max) * 100}%`, animationDelay: `${i * 0.06 + 0.03}s` }} />
            <div className="ia-chart__bar ia-chart__bar--fechados"
              style={{ height: `${(d.fechados / max) * 100}%`, animationDelay: `${i * 0.06 + 0.06}s` }} />
          </div>
          <span className="ia-chart__label">{d.mes}</span>
        </div>
      ))}
      <div className="ia-chart__legend">
        <span><i style={{ background: "#5b8dee" }} />Leads</span>
        <span><i style={{ background: "#f0a500" }} />Atendidos</span>
        <span><i style={{ background: "#2d7d52" }} />Fechados</span>
      </div>
    </div>
  );
}

// donut chart pure CSS
function DonutChart({ fechados, total }) {
  const pct   = Math.round((fechados / total) * 100);
  const circ  = 2 * Math.PI * 40;
  const dash  = (pct / 100) * circ;
  return (
    <div className="ia-donut">
      <svg viewBox="0 0 100 100" className="ia-donut__svg">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0ec" strokeWidth="12" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#2d7d52" strokeWidth="12"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="ia-donut__arc"
        />
      </svg>
      <div className="ia-donut__center">
        <span className="ia-donut__pct">{pct}%</span>
        <span className="ia-donut__sub">conversão</span>
      </div>
    </div>
  );
}

// ─── ABAS ─────────────────────────────────────────────────
function TabDashboard({ iaAtiva, setIaAtiva, leads }) {
  const quentes  = leads.filter(l => l.status === "quente").length;
  const ligacoes = leads.filter(l => l.etapa  === "Quer ligação").length;
  const fechados = leads.filter(l => l.status === "fechado").length;
  const total    = leads.length;

  return (
    <div className="ia-tab-content">
      {/* Status da IA */}
      <div className="ia-status-card">
        <div className="ia-status-card__left">
          <PulsingDot color={iaAtiva ? "#2d7d52" : "#e05c5c"} />
          <div>
            <p className="ia-status-card__title">
              IA Kasaleve — WhatsApp
            </p>
            <p className="ia-status-card__desc">
              {iaAtiva ? "Respondendo leads automaticamente" : "Pausada — leads não estão sendo respondidos"}
            </p>
          </div>
        </div>
        <div className="ia-status-card__right">
          <button
            className={`ia-toggle ${iaAtiva ? "ia-toggle--on" : "ia-toggle--off"}`}
            onClick={() => setIaAtiva(v => !v)}
          >
            <span className="ia-toggle__knob" />
          </button>
          <span className="ia-toggle__label">{iaAtiva ? "Ativa" : "Pausada"}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="ia-stats-grid">
        <StatCard icon="🔥" label="Leads quentes"     value={quentes}  sub="precisam de atenção" accent="#e05c5c" />
        <StatCard icon="📞" label="Querem ligação"    value={ligacoes} sub="aguardando contato"  accent="#f0a500" />
        <StatCard icon="✅" label="Fechamentos"       value={fechados} sub="este mês"            accent="#2d7d52" />
        <StatCard icon="💬" label="Total de leads"    value={total}    sub="no pipeline"         accent="#5b8dee" />
      </div>

      {/* Gráficos */}
      <div className="ia-charts-row">
        <div className="ia-chart-card">
          <h3 className="ia-chart-card__title">Evolução mensal</h3>
          <BarChart data={EVOLUCAO} />
        </div>
        <div className="ia-chart-card ia-chart-card--narrow">
          <h3 className="ia-chart-card__title">Taxa de conversão</h3>
          <DonutChart fechados={fechados} total={total} />
          <div className="ia-donut-stats">
            <div><span>{total}</span><label>leads</label></div>
            <div><span>{fechados}</span><label>fechados</label></div>
          </div>
        </div>
      </div>

      {/* Últimas mensagens */}
      <div className="ia-recent">
        <h3 className="ia-section-title">Atividade recente</h3>
        <div className="ia-recent-list">
          {leads.filter(l => l.status !== "frio").slice(0, 4).map(l => (
            <div key={l.id} className="ia-recent-item">
              <div className="ia-avatar" style={{ background: STATUS_COLOR[l.status] }}>
                {l.avatar}
              </div>
              <div className="ia-recent-item__body">
                <p className="ia-recent-item__nome">{l.nome}</p>
                <p className="ia-recent-item__msg">"{l.ultima}"</p>
              </div>
              <div className="ia-recent-item__right">
                <span className="ia-badge" style={{ background: STATUS_BG[l.status], color: STATUS_COLOR[l.status] }}>
                  {l.etapa}
                </span>
                <span className="ia-recent-item__tempo">{l.tempo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabLeads({ leads }) {
  const [filtro, setFiltro] = useState("todos");
  const filtered = filtro === "todos" ? leads : leads.filter(l => l.status === filtro);

  return (
    <div className="ia-tab-content">
      <div className="ia-leads-toolbar">
        <h3 className="ia-section-title" style={{ marginBottom: 0 }}>Pipeline de Leads</h3>
        <div className="ia-filter-chips">
          {["todos","quente","morno","frio","fechado"].map(f => (
            <button key={f}
              className={`ia-chip ${filtro === f ? "ia-chip--active" : ""}`}
              style={filtro === f && f !== "todos" ? { background: STATUS_BG[f], color: STATUS_COLOR[f], borderColor: STATUS_COLOR[f] } : {}}
              onClick={() => setFiltro(f)}
            >
              {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ia-chip__count">
                {f === "todos" ? leads.length : leads.filter(l => l.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ia-leads-list">
        {filtered.map((l, i) => (
          <div key={l.id} className="ia-lead-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="ia-avatar ia-avatar--lg" style={{ background: STATUS_COLOR[l.status] }}>
              {l.avatar}
            </div>
            <div className="ia-lead-card__body">
              <div className="ia-lead-card__top">
                <span className="ia-lead-card__nome">{l.nome}</span>
                <span className="ia-lead-card__tel">📱 {l.telefone}</span>
              </div>
              <p className="ia-lead-card__msg">"{l.ultima}"</p>
            </div>
            <div className="ia-lead-card__right">
              <span className="ia-badge"
                style={{ background: STATUS_BG[l.status], color: STATUS_COLOR[l.status] }}>
                {l.etapa}
              </span>
              <span className="ia-lead-card__tempo">{l.tempo} atrás</span>
              {(l.etapa === "Quer ligação" || l.status === "quente") && (
                <button className="ia-btn-call">📞 Ligar agora</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabTreino() {
  const [treinos, setTreinos]   = useState(MOCK_TREINOS);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [salvando, setSalvando] = useState(false);

  function handleAdd() {
    if (!pergunta.trim() || !resposta.trim()) return;
    setSalvando(true);
    setTimeout(() => {
      setTreinos(prev => [...prev, {
        id: Date.now(), pergunta, resposta, aprovado: false
      }]);
      setPergunta(""); setResposta(""); setSalvando(false);
    }, 800);
  }

  function toggleAprovado(id) {
    setTreinos(prev => prev.map(t => t.id === id ? { ...t, aprovado: !t.aprovado } : t));
  }

  function remover(id) {
    setTreinos(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="ia-tab-content">
      <div className="ia-treino-header">
        <div>
          <h3 className="ia-section-title" style={{ marginBottom: 4 }}>Treinamento da IA</h3>
          <p className="ia-section-sub">Ensine à IA como responder perguntas frequentes dos leads.</p>
        </div>
        <div className="ia-treino-stats">
          <span>✅ {treinos.filter(t => t.aprovado).length} aprovados</span>
          <span>⏳ {treinos.filter(t => !t.aprovado).length} pendentes</span>
        </div>
      </div>

      {/* Formulário */}
      <div className="ia-treino-form">
        <div className="ia-treino-form__icon">🤖</div>
        <div className="ia-treino-form__fields">
          <div className="ia-field">
            <label>Pergunta do Lead</label>
            <input
              placeholder='Ex: "Qual o prazo de entrega?"'
              value={pergunta}
              onChange={e => setPergunta(e.target.value)}
            />
          </div>
          <div className="ia-field">
            <label>Resposta da IA</label>
            <textarea
              rows={3}
              placeholder="Como a IA deve responder..."
              value={resposta}
              onChange={e => setResposta(e.target.value)}
            />
          </div>
          <button className={`ia-btn-treinar ${salvando ? "ia-btn-treinar--loading" : ""}`}
            onClick={handleAdd} disabled={salvando}>
            {salvando ? "⏳ Salvando..." : "➕ Adicionar ao treinamento"}
          </button>
        </div>
      </div>

      {/* Lista de treinos */}
      <div className="ia-treino-list">
        {treinos.map((t, i) => (
          <div key={t.id} className={`ia-treino-item ${t.aprovado ? "ia-treino-item--ok" : ""}`}
            style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="ia-treino-item__content">
              <p className="ia-treino-item__q">❓ {t.pergunta}</p>
              <p className="ia-treino-item__a">🤖 {t.resposta}</p>
            </div>
            <div className="ia-treino-item__actions">
              <button className={`ia-btn-aprovar ${t.aprovado ? "ia-btn-aprovar--on" : ""}`}
                onClick={() => toggleAprovado(t.id)}>
                {t.aprovado ? "✅ Aprovado" : "Aprovar"}
              </button>
              <button className="ia-btn-remover" onClick={() => remover(t.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function IA() {
  const { loggedin } = useContext(AuthContext);
  const [aba, setAba]         = useState("dashboard");
  const [iaAtiva, setIaAtiva] = useState(true);
  const [leads]               = useState(MOCK_LEADS);
  const [tick, setTick]       = useState(0);

  // simula contador de mensagens em tempo real
  useEffect(() => {
    if (!iaAtiva) return;
    const t = setInterval(() => setTick(v => v + 1), 4000);
    return () => clearInterval(t);
  }, [iaAtiva]);

  if (!loggedin) {
    return (
      <>
        <MenuHome />
        <div className="detail-page">
          <div className="detail-empty">
            <span>🔒</span>
            <p>Você precisa estar logado para acessar esta página.</p>
            <BTNVolta />
          </div>
        </div>
      </>
    );
  }

  const abas = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "leads",     label: "Leads",     icon: "👥" },
    { id: "treino",    label: "Treinar IA",icon: "🧠" },
  ];

  return (
    <>
      <MenuPage />
      <div className="ia-page">

        {/* ── Header ── */}
        <div className="ia-page-header">
          <BTNVolta />
          <div className="ia-page-header__titles">
            <p className="eyebrow">Inteligência Artificial · WhatsApp</p>
            <h1 className="ia-page-title">
              Monitor IA
              {iaAtiva && (
                <span className="ia-live-badge">
                  <PulsingDot color="#2d7d52" /> AO VIVO
                </span>
              )}
            </h1>
          </div>
          <div className="ia-msgs-counter">
            <span className="ia-msgs-counter__num">{127 + tick}</span>
            <span className="ia-msgs-counter__label">msgs respondidas hoje</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="ia-tabs">
          {abas.map(a => (
            <button key={a.id}
              className={`ia-tab ${aba === a.id ? "ia-tab--active" : ""}`}
              onClick={() => setAba(a.id)}>
              <span>{a.icon}</span> {a.label}
              {a.id === "leads" && (
                <span className="ia-tab__badge">
                  {leads.filter(l => l.etapa === "Quer ligação").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Conteúdo por aba ── */}
        {aba === "dashboard" && <TabDashboard iaAtiva={iaAtiva} setIaAtiva={setIaAtiva} leads={leads} />}
        {aba === "leads"     && <TabLeads leads={leads} />}
        {aba === "treino"    && <TabTreino />}

      </div>
    </>
  );
}