import { pool } from "../db.js";

// CREATE
export async function criarAluno(req, res) {
  const { nome, idade } = req.body;
  const idadeNum = Number(idade);

  if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
    return res.status(400).json({ error: "Nome inválido." });
  }
  if (!Number.isInteger(idadeNum) || idadeNum < 0) {
    return res.status(400).json({ error: "Idade inválida." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO alunos (nome, idade) VALUES (?, ?)",
      [nome.trim(), idadeNum]
    );
    const [row] = await pool.query(
      "SELECT id, nome, idade, criado_em FROM alunos WHERE id = ?",
      [result.insertId]
    );
    return res.status(201).json(row[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar aluno." });
  }
}

// READ
export async function listarAlunos(_req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome, idade FROM alunos ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar alunos." });
  }
}

// UPDATE (PUT/PATCH) - nome e/ou idade
export async function atualizarAluno(req, res) {
  const { id } = req.params;
  const { nome, idade } = req.body;

  try {
    const [exists] = await pool.query("SELECT id FROM alunos WHERE id = ? LIMIT 1", [id]);
    if (exists.length === 0) return res.status(404).json({ error: "Aluno não encontrado." });

    const fields = [];
    const params = [];
    if (nome != null) {
      if (typeof nome !== "string" || nome.trim().length < 2) {
        return res.status(400).json({ error: "Nome inválido." });
      }
      fields.push("nome = ?");
      params.push(nome.trim());
    }
    if (idade != null) {
      const idadeNum = Number(idade);
      if (!Number.isInteger(idadeNum) || idadeNum < 0) {
        return res.status(400).json({ error: "Idade inválida." });
      }
      fields.push("idade = ?");
      params.push(idadeNum);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar." });
    }

    params.push(id);
    await pool.query(`UPDATE alunos SET ${fields.join(", ")} WHERE id = ?`, params);

    const [row] = await pool.query(
      "SELECT id, nome, idade FROM alunos WHERE id = ?",
      [id]
    );
    return res.json(row[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar aluno." });
  }
}

// DELETE
export async function excluirAluno(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM alunos WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Aluno não encontrado." });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir aluno." });
  }
}
