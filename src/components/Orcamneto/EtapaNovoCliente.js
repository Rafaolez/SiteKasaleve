
import React from 'react';

export default function EtapaNovoCliente({ dadosCliente, setDado, clienteExistente, clienteId, setClienteId, clientes }) {
  return (
    <div className="orc-cliente-bloco">
      {clienteExistente && (
        <div className="orc-select-cliente">
          <div className="orc-row">
            <label>Cliente</label>
            <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="orc-input" style={{ padding: '4px 6px', border: '1px solid var(--border)', borderRadius: '2px' }}>
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="orc-row orc-row--gray">
        <label>Nome</label>
        <input value={dadosCliente.nome} onChange={setDado('nome')} placeholder="Nome do cliente" />
      </div>
      <div className="orc-row">
        <label>Endereço</label>
        <input value={dadosCliente.endereco} onChange={setDado('endereco')} placeholder="Rua, Av..." />
      </div>
      <div className="orc-row-split">
        <div className="orc-row orc-row--half orc-row--gray">
          <label>Cidade</label>
          <input value={dadosCliente.cidade} onChange={setDado('cidade')} placeholder="Cidade" />
        </div>
        <div className="orc-row orc-row--half orc-row--gray">
          <label>Estado</label>
          <input value={dadosCliente.estado} onChange={setDado('estado')} placeholder="UF" maxLength={2} />
        </div>
      </div>
      <div className="orc-row-split">
        <div className="orc-row orc-row--half">
          <label>CPF/CNPJ</label>
          <input value={dadosCliente.cpf} onChange={setDado('cpf')} placeholder="000.000.000-00" />
        </div>
        <div className="orc-row orc-row--half">
          <label>IE/RG</label>
          <input value={dadosCliente.ie} onChange={setDado('ie')} placeholder="" />
        </div>
      </div>
      <div className="orc-row-split">
        <div className="orc-row orc-row--half orc-row--gray">
          <label>Telefone</label>
          <input value={dadosCliente.telefone} onChange={setDado('telefone')} placeholder="(00) 00000-0000" />
        </div>
        <div className="orc-row orc-row--half orc-row--gray">
          <label>Vendedora</label>
          <input value={dadosCliente.vendedora} onChange={setDado('vendedora')} placeholder="Nome da vendedora" />
        </div>
      </div>
    </div>
  );
}
