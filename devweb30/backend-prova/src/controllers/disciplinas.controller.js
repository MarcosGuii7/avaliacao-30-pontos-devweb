// src/controllers/disciplinas.controller.js
import { pool } from "../db.js";

// Lista todas (para o dropdown use GET /api/disciplinas?apenasAtivas=1)
export async function listarDisciplinas(req, res) {
  try {
    const apenasAtivas = req.query.apenasAtivas === "1";
    const [rows] = await pool.query(
      `SELECT id, nome, ativo FROM disciplinas
       ${apenasAtivas ? "WHERE ativo = 1" : ""} 
       ORDER BY nome`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Falha ao listar disciplinas" });
  }
}

// Busca por id
export async function obterDisciplina(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, nome, ativo FROM disciplinas WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: "Não encontrada" });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "Falha ao buscar disciplina" });
  }
}

// Cria
export async function criarDisciplina(req, res) {
  try {
    const { nome, ativo = 1 } = req.body;
    if (!nome) return res.status(400).json({ erro: "nome é obrigatório" });

    const [result] = await pool.query(
      "INSERT INTO disciplinas (nome, ativo) VALUES (?, ?)",
      [nome, ativo ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, nome, ativo: !!ativo });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Já existe disciplina com esse nome" });
    }
    res.status(500).json({ erro: "Falha ao criar disciplina" });
  }
}

// Atualiza
export async function atualizarDisciplina(req, res) {
  try {
    const { id } = req.params;
    const { nome, ativo } = req.body;

    const campos = [];
    const valores = [];
    if (nome !== undefined) { campos.push("nome = ?"); valores.push(nome); }
    if (ativo !== undefined) { campos.push("ativo = ?"); valores.push(ativo ? 1 : 0); }
    if (campos.length === 0) return res.status(400).json({ erro: "Nada para atualizar" });

    valores.push(id);
    const [result] = await pool.query(
      `UPDATE disciplinas SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Não encontrada" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ erro: "Falha ao atualizar disciplina" });
  }
}

// Remove
export async function removerDisciplina(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM disciplinas WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Não encontrada" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ erro: "Falha ao remover disciplina" });
  }
}
