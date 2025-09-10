import { pool } from "../db.js";

// GET /professores
export async function listarProfessores(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.id, p.nome, p.email, p.titulacao, p.telefone, p.carga_horaria_semanal,
         p.disciplina_id,
         d.nome AS disciplina
       FROM professores p
       LEFT JOIN disciplinas d ON d.id = p.disciplina_id
       ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ erro: "Falha ao listar professores" });
  }
}

// GET /professores/:id
export async function obterProfessor(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         p.id, p.nome, p.email, p.titulacao, p.telefone, p.carga_horaria_semanal,
         p.disciplina_id,
         d.nome AS disciplina
       FROM professores p
       LEFT JOIN disciplinas d ON d.id = p.disciplina_id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: "Professor não encontrado" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "Falha ao obter professor" });
  }
}

// POST /professores
export async function criarProfessor(req, res) {
  try {
    const {
      nome,
      email,
      disciplina_id,
      titulacao = "Graduado",
      telefone = null,
      carga_horaria_semanal = 20,
    } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: "nome e email são obrigatórios" });
    }
    if (!disciplina_id) {
      return res.status(400).json({ erro: "disciplina_id é obrigatório" });
    }

    const [disc] = await pool.query(
      "SELECT id FROM disciplinas WHERE id = ?",
      [disciplina_id]
    );
    if (disc.length === 0) {
      return res.status(400).json({ erro: "disciplina_id inválido" });
    }

    const [result] = await pool.query(
      `INSERT INTO professores
        (nome, email, disciplina_id, titulacao, telefone, carga_horaria_semanal)
       VALUES (?,?,?,?,?,?)`,
      [nome, email, disciplina_id, titulacao, telefone, carga_horaria_semanal]
    );

    const [created] = await pool.query(
      `SELECT p.id, p.nome, p.email, p.titulacao, p.telefone, p.carga_horaria_semanal,
              p.disciplina_id, d.nome AS disciplina
       FROM professores p
       LEFT JOIN disciplinas d ON d.id = p.disciplina_id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe professor com esse email" });
    }
    res.status(500).json({ erro: "Falha ao criar professor" });
  }
}

// PUT /professores/:id
export async function atualizarProfessor(req, res) {
  try {
    const { id } = req.params;
    const {
      nome,
      email,
      disciplina_id,
      titulacao,
      telefone,
      carga_horaria_semanal,
    } = req.body;

    if (disciplina_id !== undefined) {
      const [disc] = await pool.query(
        "SELECT id FROM disciplinas WHERE id = ?",
        [disciplina_id]
      );
      if (disc.length === 0) {
        return res.status(400).json({ erro: "disciplina_id inválido" });
      }
    }

    const campos = [];
    const valores = [];

    if (nome !== undefined) { campos.push("nome = ?"); valores.push(nome); }
    if (email !== undefined) { campos.push("email = ?"); valores.push(email); }
    if (disciplina_id !== undefined) { campos.push("disciplina_id = ?"); valores.push(disciplina_id); }
    if (titulacao !== undefined) { campos.push("titulacao = ?"); valores.push(titulacao); }
    if (telefone !== undefined) { campos.push("telefone = ?"); valores.push(telefone); }
    if (carga_horaria_semanal !== undefined) { campos.push("carga_horaria_semanal = ?"); valores.push(carga_horaria_semanal); }

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nada para atualizar" });
    }

    valores.push(id);

    const [result] = await pool.query(
      `UPDATE professores SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }

    const [updated] = await pool.query(
      `SELECT p.id, p.nome, p.email, p.titulacao, p.telefone, p.carga_horaria_semanal,
              p.disciplina_id, d.nome AS disciplina
       FROM professores p
       LEFT JOIN disciplinas d ON d.id = p.disciplina_id
       WHERE p.id = ?`,
      [id]
    );

    res.json(updated[0]);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe professor com esse email" });
    }
    res.status(500).json({ erro: "Falha ao atualizar professor" });
  }
}

// DELETE /professores/:id
export async function excluirProfessor(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM professores WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Professor não encontrado" });
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ erro: "Falha ao excluir professor" });
  }
}
