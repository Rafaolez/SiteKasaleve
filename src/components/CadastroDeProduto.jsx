import { useState } from "react";
import "../css/CadastroDeCliente.css"; // Reaproveitando o mesmo CSS

// Adicionada a propriedade onVoltar para o componente pai controlar o botão
function CadastroDeProduto({ onVoltar }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoriaId: "",
    precoCusto: "",
    precoVenda: "",
    ativo: "true", // Por padrão ativo
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loadingSave, setLoadingSave] = useState(false);

  // Lista simulada de categorias (No real, busque isso da sua API)
  const categorias = [
    { id: 1, nome: "Vestuário" },
    { id: 2, nome: "Calçados" },
    { id: 3, nome: "Acessórios" },
  ];

  // Máscara para moeda brasileira
  function applyCurrencyMask(value) {
    const digits = value.replace(/\D/g, "");
    const numberValue = parseFloat(digits) / 100;
    if (isNaN(numberValue)) return "";
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let masked = value;

    if (name === "precoCusto" || name === "precoVenda") {
      masked = applyCurrencyMask(value);
    }

    setFormData((prev) => ({ ...prev, [name]: masked }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!formData.nome.trim()) e.nome = "O nome do produto é obrigatório.";
    
    // Valida preço de venda (removendo a máscara para validar)
    const precoVendaDigits = formData.precoVenda.replace(/\D/g, "");
    if (!precoVendaDigits || parseFloat(precoVendaDigits) <= 0) {
      e.precoVenda = "O preço de venda é obrigatório.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (validate()) {
      setLoadingSave(true);
      
      // Limpa as máscaras para enviar números reais para a API (C#)
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : null,
        precoCusto: parseFloat(formData.precoCusto.replace(/\D/g, "")) / 100 || 0,
        precoVenda: parseFloat(formData.precoVenda.replace(/\D/g, "")) / 100,
        ativo: formData.ativo === "true",
        // A data de cadastro e o ID serão gerados pelo Backend (C#)
      };

      try {
        // 🔥 AQUI É ONDE VOCÊ MANDA PARA O BANCO NO FRONTEND
        const response = await fetch("https://sua-api.com/api/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          showToast("Produto cadastrado com sucesso!", "success");
          handleReset();
        } else {
          showToast("Erro ao cadastrar produto.", "error");
        }
      } catch (err) {
        showToast("Erro de conexão com o servidor.", "error");
      } finally {
        setLoadingSave(false);
      }
    } else {
      showToast("Corrija os campos destacados.", "error");
    }
  }

  function handleReset() {
    setFormData({ nome: "", descricao: "", categoriaId: "", precoCusto: "", precoVenda: "", ativo: "true" });
    setErrors({});
    setSubmitted(false);
  }

  function showToast(message, type) {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  }

  function fieldClass(name) {
    let cls = "form-group";
    if (formData[name]) cls += " form-group--filled";
    if (errors[name] && submitted) cls += " form-group--error";
    return cls;
  }

  return (
    <div className="cadastro-cliente">
      {/* Toast */}
      <div className={`cdcli-toast ${toast.show ? "cdcli-toast--visible" : ""} cdcli-toast--${toast.type}`}>
        <span className="cdcli-toast__icon">{toast.type === "success" ? "✓" : "!"}</span>
        <span className="cdcli-toast__msg">{toast.message}</span>
      </div>

      {/* Header */}
      <div className="cc-header">
        <div>
          <h2 className="cc-header__title">Novo Produto</h2>
          <p className="cc-header__sub">Preencha os dados do item para adicioná-lo ao catálogo.</p>
        </div>
        <span className={`cc-status ${formData.ativo === "true" ? "cc-status--ativo" : "cc-status--inativo"}`}>
          <span className="cc-status__dot"></span>
          {formData.ativo === "true" ? "Ativo" : "Inativo"}
        </span>
      </div>

      <form className="cc-form" onSubmit={handleSubmit} noValidate>
        {/* Dados do Produto */}
        <fieldset className="cc-section">
          <legend className="cc-section__legend">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
            Informações do Produto
          </legend>

          <div className="cc-row cc-row--1">
            <div className={fieldClass("nome")}>
              <label className="cc-label">Nome do Produto <span className="cc-req">*</span></label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} maxLength={255} className="cc-input" placeholder="Ex: Camiseta Polo" autoFocus />
              {errors.nome && submitted && <span className="cc-err">{errors.nome}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--1">
            <div className={fieldClass("descricao")}>
              <label className="cc-label">Descrição</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} maxLength={500} className="cc-input" placeholder="Detalhes do produto, material, etc..." rows="3"></textarea>
            </div>
          </div>

          <div className="cc-row cc-row--3">
            <div className={fieldClass("categoriaId")}>
              <label className="cc-label">Categoria</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className="cc-input cc-select">
                <option value="">Selecione</option>
                {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
              </select>
            </div>
            <div className={fieldClass("precoCusto")}>
              <label className="cc-label">Preço de Custo</label>
              <input type="text" inputMode="numeric" name="precoCusto" value={formData.precoCusto} onChange={handleChange} className="cc-input" placeholder="R$ 0,00" />
            </div>
            <div className={fieldClass("precoVenda")}>
              <label className="cc-label">Preço de Venda <span className="cc-req">*</span></label>
              <input type="text" inputMode="numeric" name="precoVenda" value={formData.precoVenda} onChange={handleChange} className="cc-input" placeholder="R$ 0,00" />
              {errors.precoVenda && submitted && <span className="cc-err">{errors.precoVenda}</span>}
            </div>
          </div>

          <div className="cc-row cc-row--1 cc-row--narrow">
            <div className={`form-group ${formData.ativo ? "form-group--filled" : ""}`}>
              <label className="cc-label">Status</label>
              <select name="ativo" value={formData.ativo} onChange={handleChange} className="cc-input cc-select">
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Ações */}
        {/* Alterado para space-between para jogar o botão Voltar para a esquerda */}
        <div className="cc-actions" style={{ justifyContent: 'space-between' }}>
          
          {/* Botão Voltar */}
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onVoltar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Voltar
          </button>

          {/* Grupo dos botões Limpar e Salvar na direita */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="cc-btn cc-btn--ghost" onClick={handleReset}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Limpar
            </button>
            <button type="submit" className="cc-btn cc-btn--primary" disabled={loadingSave}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {loadingSave ? "Salvando..." : "Salvar Produto"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default CadastroDeProduto;