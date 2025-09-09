import { Router } from "express";
import { body, validationResult } from "express-validator";
import {
  criarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno,
} from "../controllers/alunos.controller.js";

const router = Router();

// CREATE
const createValidators = [
  body("nome").isString().trim().isLength({ min: 2 }).withMessage("Nome inválido."),
  body("idade").isInt({ min: 0 }).withMessage("Idade inválida.")
];
router.post("/alunos", createValidators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return criarAluno(req, res);
});

// READ
router.get("/alunos", listarAlunos);

// UPDATE (campos opcionais)
const updateValidators = [
  body("nome").optional().isString().trim().isLength({ min: 2 }).withMessage("Nome inválido."),
  body("idade").optional().isInt({ min: 0 }).withMessage("Idade inválida.")
];
router.put("/alunos/:id", updateValidators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return atualizarAluno(req, res);
});
router.patch("/alunos/:id", updateValidators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return atualizarAluno(req, res);
});

// DELETE
router.delete("/alunos/:id", excluirAluno);

export default router;
