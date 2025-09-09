import { pool } from "../db.js";

/**
 * Campos da tabela:
 * id, nome, email (UNIQUE), disciplina, titulacao (DEFAULT 'Graduado'),
 * telefone, carga_horaria_semanal (DEFAULT 20), criado_em (TIMESTAMP)
 */

// GET /api/professores
export async function listarProfessores(req, res) {
  const [rows] = await pool.query(
    `SELECT id, nome, email, disciplina, titulacao, telefone,
            carga_horaria_semanal, criado_em
     FROM professores
     ORDER BY id DESC`
  );
  res.json(rows);
}

// GET /api/professores/:id
export async function obterProfessor(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT id, nome, email, disciplina, titulacao, telefone,
            carga_horaria_semanal, criado_em
     FROM professores
     WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: "Professor não encontrado" });
  }
  res.json(rows[0]);
}

// POST /api/professores
export async function criarProfessor(req, res) {
  const {
    nome,
    email,
    disciplina,
    titulacao = "Graduado",
    telefone = null,
    carga_horaria_semanal = 20,
  } = req.body;

  if (!nome || !email || !disciplina) {
    return res.status(400).json({ message: "nome, email e disciplina são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO professores
       (nome, email, disciplina, titulacao, telefone, carga_horaria_semanal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, disciplina, titulacao, telefone, carga_horaria_semanal]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      email,
      disciplina,
      titulacao,
      telefone,
      carga_horaria_semanal,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao criar professor" });
  }
}

// PUT /api/professores/:id
export async function atualizarProfessor(req, res) {
  const { id } = req.params;
  const {
    nome,
    email,
    disciplina,
    titulacao,
    telefone,
    carga_horaria_semanal,
  } = req.body;

  // Atualização dinâmica: inclui só os campos enviados
  const fields = [];
  const values = [];

  if (nome !== undefined) { fields.push("nome = ?"); values.push(nome); }
  if (email !== undefined) { fields.push("email = ?"); values.push(email); }
  if (disciplina !== undefined) { fields.push("disciplina = ?"); values.push(disciplina); }
  if (titulacao !== undefined) { fields.push("titulacao = ?"); values.push(titulacao); }
  if (telefone !== undefined) { fields.push("telefone = ?"); values.push(telefone); }
  if (carga_horaria_semanal !== undefined) {
    fields.push("carga_horaria_semanal = ?");
    values.push(carga_horaria_semanal);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Nenhum campo para atualizar" });
  }

  values.push(id);

  try {
    const [result] = await pool.query(
      `UPDATE professores SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    res.json({ message: "Atualizado com sucesso" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar professor" });
  }
}

// DELETE /api/professores/:id
export async function excluirProfessor(req, res) {
  const { id } = req.params;
  const [result] = await pool.query("DELETE FROM professores WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Professor não encontrado" });
  }
  res.json({ message: "Excluído com sucesso" });
}
