import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import professoresRoutes from "./routes/professores.routes.js";
import alunosRoutes from "./routes/alunos.routes.js";
import disciplinasRoutes from "./routes/disciplinas.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: true })); // libera para qualquer origem (ajuste conforme necessidade)
app.use(express.json());         // parse JSON

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API Users MySQL" });
});

app.use("/api", professoresRoutes);
app.use("/api", alunosRoutes);
app.use("/api/disciplinas", disciplinasRoutes);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
