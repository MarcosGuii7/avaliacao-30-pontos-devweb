import { Router } from "express";
import {
  listarProfessores,
  obterProfessor,
  criarProfessor,
  atualizarProfessor,
  excluirProfessor,
} from "../controllers/professores.controller.js";

const router = Router();

router.get("/professores", listarProfessores);
router.get("/professores/:id", obterProfessor);
router.post("/professores", criarProfessor);
router.put("/professores/:id", atualizarProfessor);
router.delete("/professores/:id", excluirProfessor);

export default router;
