import { useEffect, useState } from "react";
import "./CrudProfessores.css";

const API = "http://localhost:4000/api/professores";

export default function CrudProfessores() {
    const [lista, setLista] = useState([]);
    const [form, setForm] = useState({
        id: null,
        nome: "",
        email: "",
        disciplina: "",
        titulacao: "",
        telefone: "",
        carga_horaria_semanal: "",
    });

    const emEdicao = form.id !== null;

    useEffect(() => {
        async function carregarProfessores() {
            const res = await fetch(API);
            const dados = await res.json();
            setLista(dados || []);
        }
        carregarProfessores();
    }, [lista]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    function limparForm() {
        setForm({ id: null, nome: "", email: "", disciplina: "", titulacao: "", telefone: "", carga_horaria_semanal: "" });
    }

    async function criarProfessores() {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: form.nome,
                email: form.email,
                disciplina: form.disciplina,
                titulacao: form.titulacao,
                telefone: form.telefone,
                carga_horaria_semanal: Number(form.carga_horaria_semanal)
            }),
        });
        const novo = await res.json();
        setLista((antiga) => [novo, ...antiga]);
        limparForm();
    }

    async function atualizarProfessores() {
        const res = await fetch(`${API}/${form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: form.nome,
                email: form.email,
                disciplina: form.disciplina,
                titulacao: form.titulacao,
                telefone: form.telefone,
                carga_horaria_semanal: Number(form.carga_horaria_semanal)
            }),
        });
        const atualizado = await res.json();

        setLista((itens) =>
            itens.map((p) => (p.id === atualizado.id ? atualizado : p))
        );
        limparForm();
    }

    async function removerProfessores(id) {
        const confirmar = window.confirm("Tem certeza que deseja remover este professor?");
        if (!confirmar) return;

        await fetch(`${API}/${id}`, { method: "DELETE" });
        setLista((itens) => itens.filter((a) => a.id !== id));
    }

    function iniciarEdicao(professores) {
        setForm(professores);
    }

    function onSubmit(e) {
        e.preventDefault();
        if (emEdicao) atualizarProfessores();
        else criarProfessores();
    }

    return (
        <div className="card crud">
            <h2 className="crud__title">Gestão de Professores</h2>
            <p className="crud__subtitle">CRUD simples de professores consumindo API.</p>

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
                            placeholder="Ex.: Marcos Guilherme"
                        />
                    </div>

                    <div className="form-field">
                        <label className="label">E-mail</label>
                        <input
                            className="input"
                            type="text"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="exemplo@gmail.com"
                        />
                    </div>

                    <div className="form-field">
                        <label className="label">Disciplina</label>
                        <input
                            className="input"
                            type="text"
                            name="disciplina"
                            value={form.disciplina}
                            onChange={handleChange}
                            placeholder="Ex: Geografia"
                        />
                    </div>

                    <div className="form-field">
                        <label className="label">Titulação</label>
                        <input
                            className="input"
                            type="text"
                            name="titulacao"
                            value={form.titulacao}
                            onChange={handleChange}
                            placeholder="Ex: Graduado, Especialista, Mestre, Doutor"
                        />
                    </div>

                    <div className="form-field">
                        <label className="label">Telefone</label>
                        <input
                            className="input"
                            type="text"
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            placeholder="Ex: (24) 99900-0000"
                        />
                    </div>

                    <div className="form-field">
                        <label className="label">Carga Horária Semanal</label>
                        <input
                            className="input"
                            type="number"
                            name="carga_horaria_semanal"
                            value={form.carga_horaria_semanal}
                            onChange={handleChange}
                            placeholder="Ex: 24"
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
                            <td className="td" colSpan={3}>— Nenhum professor cadastrado —</td>
                        </tr>
                    ) : (
                        lista.map((p) => (
                            <tr key={p.id}>
                                <td className="td">{p.nome}</td>
                                <td className="td">{p.email}</td>
                                <td className="td">{p.disciplina}</td>
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
