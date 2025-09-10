import { useEffect, useState } from "react";
import "./CrudProfessores.css";

const API_PROF = "http://localhost:4000/api/professores";
const API_DISC = "http://localhost:4000/api/disciplinas?apenasAtivas=1";

export default function CrudProfessores() {
  const [lista, setLista] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    email: "",
    disciplina_id: "",
    titulacao: "",
    telefone: "",
    carga_horaria_semanal: "",
  });

  const emEdicao = form.id !== null;

  // Helpers
  async function carregarProfessores() {
    const res = await fetch(API_PROF);
    const dados = await res.json();
    setLista(dados || []);
  }
  async function carregarDisciplinas() {
    const res = await fetch(API_DISC);
    const dados = await res.json();
    setDisciplinas(dados || []);
  }

  // Carregamento inicial
  useEffect(() => {
    carregarProfessores();
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
      email: "",
      disciplina_id: "",
      titulacao: "",
      telefone: "",
      carga_horaria_semanal: "",
    });
  }

  async function criarProfessores() {
    if (!form.nome.trim()) { alert("Informe o nome."); return; }
    if (!form.email.trim()) { alert("Informe o e-mail."); return; }
    if (!form.disciplina_id) { alert("Selecione a disciplina."); return; }

    const res = await fetch(API_PROF, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        email: form.email,
        disciplina_id: Number(form.disciplina_id), // ← envia o ID
        titulacao: form.titulacao,
        telefone: form.telefone,
        carga_horaria_semanal: form.carga_horaria_semanal,
      }),
    });
    const novo = await res.json();
    setLista((antiga) => [novo, ...antiga]);
    limparForm();
  }

  async function atualizarProfessores() {
    const res = await fetch(`${API_PROF}/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        email: form.email,
        disciplina_id: form.disciplina_id ? Number(form.disciplina_id) : null,
        titulacao: form.titulacao,
        telefone: form.telefone,
        carga_horaria_semanal: form.carga_horaria_semanal,
      }),
    });
    const atualizado = await res.json();
    setLista((itens) => itens.map((a) => (a.id === atualizado.id ? atualizado : a)));
    limparForm();
  }

  async function removerProfessores(id) {
    const confirmar = window.confirm("Tem certeza que deseja remover este professor?");
    if (!confirmar) return;

    await fetch(`${API_PROF}/${id}`, { method: "DELETE" });
    setLista((itens) => itens.filter((a) => a.id !== id));
  }

  function iniciarEdicao(p) {
    // Quando editar, manter o disciplina_id; se vier nulo, usar "" para o select
    setForm({
      id: p.id,
      nome: p.nome || "",
      email: p.email || "",
      disciplina_id: p.disciplina_id ?? "",
      titulacao: p.titulacao || "",
      telefone: p.telefone || "",
      carga_horaria_semanal: p.carga_horaria_semanal ?? "",
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (emEdicao) atualizarProfessores();
    else criarProfessores();
  }

  return (
    <div className="card crud">
      <h2 className="crud__title">Gestão de Professores</h2>
      <p className="crud__subtitle">CRUD simples de Professores consumindo API.</p>

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

          <div className="form-field">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite um e-mail"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="label">Disciplina</label>
            <select
              className="input"
              name="disciplina_id"
              value={form.disciplina_id}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {disciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="label">Titulação</label>
            <input
              className="input"
              type="text"
              name="titulacao"
              value={form.titulacao}
              onChange={handleChange}
              placeholder="Ex.: Graduado"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="label">Telefone</label>
            <input
              className="input"
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="Digite um telefone"
            />
          </div>

          <div className="form-field">
            <label className="label">Carga Horária Semanal</label>
            <input
              className="input"
              type="text"
              name="carga_horaria_semanal"
              value={form.carga_horaria_semanal}
              onChange={handleChange}
              placeholder="Digite a carga horária semanal"
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
            <th className="th">Nome</th>
            <th className="th">E-mail</th>
            <th className="th">Disciplina</th>
            <th className="th">Titulação</th>
            <th className="th">Telefone</th>
            <th className="th">Carga Horária Semanal</th>
            <th className="th">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td className="td" colSpan={7}>— Nenhum professor cadastrado —</td>
            </tr>
          ) : (
            lista.map((p) => (
              <tr key={p.id}>
                <td className="td">{p.nome}</td>
                <td className="td">{p.email}</td>
                <td className="td">{p.disciplina}</td> {/* nome retornado pelo JOIN */}
                <td className="td">{p.titulacao}</td>
                <td className="td">{p.telefone}</td>
                <td className="td">{p.carga_horaria_semanal}</td>
                <td className="td">
                  <div className="row-actions">
                    <button className="btn btn-small" onClick={() => iniciarEdicao(p)}>Editar</button>
                    <button className="btn btn-small" onClick={() => removerProfessores(p.id)}>Remover</button>
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