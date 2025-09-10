import { useEffect, useState } from "react";
import "./CrudDisciplinas.css";

const API_DIS = "http://localhost:4000/api/disciplinas";

export default function CrudDisciplinas() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
  });

  const emEdicao = form.id !== null;

  // Helpers

  async function carregarDisciplinas() {
    const res = await fetch(API_DIS);
    const dados = await res.json();
    setLista(dados || []);
  }

  // Carregamento inicial
  useEffect(() => {
    carregarDisciplinas();
  }, []); // ← evita loop

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function limparForm() {
    setForm({
      id: null,
      nome: "",
    });
  }

  async function criarDisciplinas() {
    if (!form.nome.trim()) { alert("Informe a disciplina"); return; }

    const res = await fetch(API_DIS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
      }),
    });
    const novo = await res.json();
    setLista((antiga) => [novo, ...antiga]);
    limparForm();
  }

  async function atualizarDisciplinas() {
    const res = await fetch(`${API_DIS}/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
      }),
    });
    const atualizado = await res.json();
    setLista((itens) => itens.map((a) => (a.id === atualizado.id ? atualizado : a)));
    limparForm();
  }

  async function removerDisciplinas(id) {
    const confirmar = window.confirm("Tem certeza que deseja remover está disciplina?");
    if (!confirmar) return;

    await fetch(`${API_DIS}/${id}`, { method: "DELETE" });
    setLista((itens) => itens.filter((a) => a.id !== id));
  }

  function iniciarEdicao(d) {
    // Quando editar, manter o disciplina_id; se vier nulo, usar "" para o select
    setForm({
      id: d.id,
      nome: d.nome || "",
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (emEdicao) atualizarDisciplinas();
    else criarDisciplinas();
  }

  return (
    <div className="card crud">
      <h2 className="crud__title">Gestão de Disciplinas</h2>
      <p className="crud__subtitle">CRUD simples de disciplinas consumindo API.</p>

      {/* FORMULÁRIO */}
      <form onSubmit={onSubmit} className="crud__form">
        <div className="form-row">
          <div className="form-field">
            <label className="label">Nome</label>
            <input
              className="input"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite um nome"
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">
            {emEdicao ? "Atualizar" : "Adicionar"}
          </button>
          <button type="button" onClick={limparForm} className="btn btn-ghost">
            Limpar
          </button>
        </div>
      </form>

      {/* LISTA */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Disciplinas</th>
            <th className="th">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td className="td" colSpan={7}>— Nenhuma disciplina cadastrada —</td>
            </tr>
          ) : (
            lista.map((d) => (
              <tr key={p.id}>
                <td className="td">{d.nome}</td>
                <td className="td">
                  <div className="row-actions">
                    <button className="btn btn-small" onClick={() => iniciarEdicao(d)}>Editar</button>
                    <button className="btn btn-small" onClick={() => removerDisciplinas(d.id)}>Remover</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}