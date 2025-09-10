// src/routes/disciplinas.routes.js
import { Router } from "express";
import {
  listarDisciplinas,
  obterDisciplina,
  criarDisciplina,
  atualizarDisciplina,
  removerDisciplina,
} from "../controllers/disciplinas.controller.js";

const router = Router();

// Base: /api/disciplinas
router.get("/", listarDisciplinas);
router.get("/:id", obterDisciplina);
router.post("/", criarDisciplina);
router.put("/:id", atualizarDisciplina);
router.delete("/:id", removerDisciplina);

export default router;
