import { useState, useEffect, useCallback } from "react";
import "../css/CadastroDeCliente.css";

// Sua função de busca de CEP
async function buscarCEP(cep) {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const j = await r.json();
    if (j.erro) return null;
    return { endereco: j.logradouro, bairro: j.bairro, cidade: j.localidade, estado: j.uf };
  } catch { return null; }
}

// Validação real de CPF (algoritmo completo)
function validarCPF(digits) {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(digits[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(digits[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(digits[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  return resto === parseInt(digits[10]);
}

// Validação real de CNPJ (algoritmo completo)
function validarCNPJ(digits) {
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += parseInt(digits[i]) * pesos1[i];
  let resto = soma % 11;
  const dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== parseInt(digits[12])) return false;
  soma = 0;
  for (let i = 0; i < 13; i++) soma += parseInt(digits[i]) * pesos2[i];
  resto = soma % 11;
  const dv2 = resto < 2 ? 0 : 11 - resto;
  return dv2 === parseInt(digits[13]);
}

function CadastroDeCliente() {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpfCnpj: "",
    rg: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(null); // true | false | null

  // Estado de validação do CPF/CNPJ em tempo real
  const [docValidation, setDocValidation] = useState({ status: "idle", message: "" });

  const estadosBrasil = [
    "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
    "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
    "RO","RR","RS","SC","SE","SP","TO",
  ];

  // --- Máscaras ---
  function applyCpfCnpjMask(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }

  function applyTelefoneMask(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 13);
    }
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
  }

  function applyCepMask(value) {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  }

  function applyRgMask(value) {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 9).replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  // --- Validação CPF/CNPJ em tempo real ---
  useEffect(() => {
    const digits = formData.cpfCnpj.replace(/\D/g, "");

    if (digits.length === 0) {
      setDocValidation({ status: "idle", message: "" });
      return;
    }

    if (digits.length <= 11) {
      // Está digitando CPF
      if (digits.length < 11) {
        setDocValidation({ status: "typing", message: `CPF: ${digits.length}/11 dígitos` });
      } else if (validarCPF(digits)) {
        setDocValidation({ status: "valid", message: "CPF válido" });
      } else {
        setDocValidation({ status: "invalid", message: "CPF inválido" });
      }
    } else {
      // Está digitando CNPJ
      if (digits.length < 14) {
        setDocValidation({ status: "typing", message: `CNPJ: ${digits.length}/14 dígitos` });
      } else if (validarCNPJ(digits)) {
        setDocValidation({ status: "valid", message: "CNPJ válido" });
      } else {
        setDocValidation({ status: "invalid", message: "CNPJ inválido" });
      }
    }
  }, [formData.cpfCnpj]);

  // --- Busca CEP ---
  const fetchCep = useCallback(async (cep) => {
    setLoadingCep(true);
    setCepFound(null);
    const data = await buscarCEP(cep);
    if (data) {
      setFormData((prev) => ({
        ...prev,
        endereco: data.endereco || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
      }));
      setCepFound(true);
    } else if (cep.replace(/\D/g, "").length === 8) {
      setCepFound(false);
    }
    setLoadingCep(false);
  }, []);

  useEffect(() => {
    const digits = formData.cep.replace(/\D/g, "");
    if (digits.length === 8) {
      // Pequeno delay para não disparar a cada tecla rápido demais
      const timer = setTimeout(() => fetchCep(formData.cep), 300);
      return () => clearTimeout(timer);
    } else {
      setCepFound(null);
    }
  }, [formData.cep, fetchCep]);

  // --- Handlers ---
  function handleChange(e) {
    const { name, value } = e.target;
    let masked = value;
    if (name === "cpfCnpj") masked = applyCpfCnpjMask(value);
    else if (name === "telefone") masked = applyTelefoneMask(value);
    else if (name === "cep") masked = applyCepMask(value);
    else if (name === "rg") masked = applyRgMask(value);

    setFormData((prev) => ({ ...prev, [name]: masked }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!formData.nome.trim()) e.nome = "O nome do cliente é obrigatório.";
    else if (formData.nome.trim().length > 255) e.nome = "Máximo de 255 caracteres.";

    if (formData.sobrenome && formData.sobrenome.length > 255) e.sobrenome = "Máximo de 255 caracteres.";

    if (formData.cpfCnpj) {
      const d = formData.cpfCnpj.replace(/\D/g, "");
      if (d.length !== 11 && d.length !== 14) e.cpfCnpj = "Complete o CPF ou CNPJ.";
      else if (d.length === 11 && !validarCPF(d)) e.cpfCnpj = "CPF inválido.";
      else if (d.length === 14 && !validarCNPJ(d)) e.cpfCnpj = "CNPJ inválido.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Formato de email inválido.";

    if (formData.cep && formData.cep.replace(/\D/g, "").length !== 8) e.cep = "CEP incompleto.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (validate()) {
      console.log("Dados para enviar:", formData);
      showToast("Cliente cadastrado com sucesso!", "success");
    } else {
      showToast("Corrija os campos destacados.", "error");
    }
  }

  function handleReset() {
    setFormData({ nome: "", sobrenome: "", cpfCnpj: "", rg: "", email: "", telefone: "", cep: "", endereco: "", bairro: "", cidade: "", estado: "", status: "Ativo" });
    setErrors({});
    setSubmitted(false);
    setDocValidation({ status: "idle", message: "" });
    setCepFound(null);
  }

  function showToast(message, type) {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }

  // Helper para classe de campo
  function fieldClass(name) {
    let cls = "form-group";
    if (formData[name]) cls += " form-group--filled";
    if (errors[name] && submitted) cls += " form-group--error";
    return cls;
  }

  return (
    <div className="cadastro-cliente">
      {/* Toast */}
      <div className={`toast ${toast.show ? "toast--visible" : ""} toast--${toast.type}`}>
        <span className="toast__icon">{toast.type === "success" ? "✓" : "!"}</span>
        <span className="toast__msg">{toast.message}</span>
      </div>

      {/* Header */}
      <div className="cc-header">
        <div>
          <h2 className="cc-header__title">Novo Cliente</h2>
          <p className="cc-header__sub">Preencha os dados para cadastrar um novo cliente no sistema.</p>
        </div>
        <span className="cc-status cc-status--ativo">
          <span className="cc-status__dot"></span>
          {formData.status}
        </span>
      </div>

      <form className="cc-form" onSubmit={handleSubmit} noValidate>

        {/* Dados Pessoais */}
        <fieldset className="cc-section">
          <legend className="cc-section__legend">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Dados Pessoais
          </legend>

          <div className="cc-row cc-row--2">
            <div className={fieldClass("nome")}>
              <label className="cc-label">Nome do Cliente <span className="cc-req">*</span></label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} maxLength={255} className="cc-input" placeholder="Digite o nome" autoFocus />
              {errors.nome && submitted && <span className="cc-err">{errors.nome}</span>}
            </div>
            <div className={fieldClass("sobrenome")}>
              <label className="cc-label">Sobrenome</label>
              <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} maxLength={255} className="cc-input" placeholder="Digite o sobrenome" />
              {errors.sobrenome && submitted && <span className="cc-err">{errors.sobrenome}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--3">
            <div className={`form-group ${formData.cpfCnpj ? "form-group--filled" : ""} ${errors.cpfCnpj && submitted ? "form-group--error" : ""}`}>
              <label className="cc-label">CPF / CNPJ</label>
              <div className="cc-input-wrap">
                <input type="text" name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} maxLength={18} className="cc-input cc-input--has-indicator" placeholder="000.000.000-00" />
                {docValidation.status !== "idle" && (
                  <span className={`doc-indicator doc-indicator--${docValidation.status}`}>
                    {docValidation.status === "valid" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {docValidation.status === "invalid" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    )}
                    {docValidation.status === "typing" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    )}
                  </span>
                )}
              </div>
              <span className={`doc-hint doc-hint--${docValidation.status}`}>{docValidation.message}</span>
              {errors.cpfCnpj && submitted && <span className="cc-err">{errors.cpfCnpj}</span>}
            </div>

            <div className={fieldClass("rg")}>
              <label className="cc-label">RG</label>
              <input type="text" name="rg" value={formData.rg} onChange={handleChange} maxLength={12} className="cc-input" placeholder="00.000.000-0" />
              {errors.rg && submitted && <span className="cc-err">{errors.rg}</span>}
            </div>

            <div className={fieldClass("email")}>
              <label className="cc-label">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={255} className="cc-input" placeholder="email@exemplo.com" />
              {errors.email && submitted && <span className="cc-err">{errors.email}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--1">
            <div className={fieldClass("telefone")}>
              <label className="cc-label">Telefone</label>
              <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} maxLength={15} className="cc-input" placeholder="(00) 00000-0000" />
              {errors.telefone && submitted && <span className="cc-err">{errors.telefone}</span>}
            </div>
          </div>
        </fieldset>

        {/* Endereço */}
        <fieldset className="cc-section">
          <legend className="cc-section__legend">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Endereço
          </legend>

          <div className="cc-row cc-row--1 cc-row--narrow">
            <div className={`form-group ${formData.cep ? "form-group--filled" : ""} ${errors.cep && submitted ? "form-group--error" : ""}`}>
              <label className="cc-label">CEP</label>
              <div className="cc-input-wrap">
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} maxLength={9} className="cc-input cc-input--has-indicator" placeholder="00000-000" />
                {loadingCep && <span className="cep-spinner"></span>}
                {!loadingCep && cepFound === true && (
                  <span className="doc-indicator doc-indicator--valid">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
                {!loadingCep && cepFound === false && (
                  <span className="doc-indicator doc-indicator--invalid">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </span>
                )}
              </div>
              {!loadingCep && cepFound === false && <span className="cc-err">CEP não encontrado</span>}
              {errors.cep && submitted && <span className="cc-err">{errors.cep}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--1">
            <div className={fieldClass("endereco")}>
              <label className="cc-label">Endereço</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} maxLength={255} className="cc-input" placeholder="Rua, Avenida, Número" />
              {errors.endereco && submitted && <span className="cc-err">{errors.endereco}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--3">
            <div className={fieldClass("bairro")}>
              <label className="cc-label">Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} maxLength={100} className="cc-input" placeholder="Bairro" />
              {errors.bairro && submitted && <span className="cc-err">{errors.bairro}</span>}
            </div>
            <div className={fieldClass("cidade")}>
              <label className="cc-label">Cidade</label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} maxLength={100} className="cc-input" placeholder="Cidade" />
              {errors.cidade && submitted && <span className="cc-err">{errors.cidade}</span>}
            </div>
            <div className={fieldClass("estado")}>
              <label className="cc-label">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="cc-input cc-select">
                <option value="">Selecione</option>
                {estadosBrasil.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {errors.estado && submitted && <span className="cc-err">{errors.estado}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--1 cc-row--narrow">
            <div className={`form-group ${formData.status ? "form-group--filled" : ""}`}>
              <label className="cc-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="cc-input cc-select">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Ações */}
        <div className="cc-actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={handleReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Limpar
          </button>
          <button type="submit" className="cc-btn cc-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Salvar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroDeCliente;