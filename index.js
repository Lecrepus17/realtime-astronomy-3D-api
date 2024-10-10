const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 4000;

// Middleware para receber dados em JSON
app.use(express.json());

// Configuração da pool de conexões com PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api_database",
  password: "password",
  port: 5432,
});

// Configuração do multer para salvar os arquivos localmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Define o diretório de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Define o nome do arquivo
  },
});

const upload = multer({ storage: storage });

// Rota POST para adicionar um planeta com upload de arquivos
app.post(
  "/planets",
  upload.fields([
    { name: "texture", maxCount: 1 },
    { name: "dump", maxCount: 1 },
    { name: "clouds", maxCount: 1 },
    { name: "specularity", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, description } = req.body;

    const texture_path = req.files["texture"]
      ? req.files["texture"][0].path
      : null;
    const dump_path = req.files["dump"] ? req.files["dump"][0].path : null;
    const clouds_path = req.files["clouds"]
      ? req.files["clouds"][0].path
      : null;
    const specularity_path = req.files["specularity"]
      ? req.files["specularity"][0].path
      : null;

    try {
      const result = await pool.query(
        `INSERT INTO planets (name, texture_path, dump_path, clouds_path, specularity_path, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          name,
          texture_path,
          dump_path,
          clouds_path,
          specularity_path,
          description,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Erro ao adicionar planeta:", err.message);
      res.status(500).send("Erro no servidor");
    }
  }
);

// Rota GET para visualizar todos os planetas
app.get("/planets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM planets");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar planetas:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota POST para adicionar uma pergunta sobre um planeta
app.post("/planets/:planetId/questions", async (req, res) => {
  const { planetId } = req.params;
  const { question_text } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO questions (planet_id, question_text)
       VALUES ($1, $2) RETURNING *`,
      [planetId, question_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao adicionar pergunta:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota GET para visualizar perguntas sobre um planeta
app.get("/planets/:planetId/questions", async (req, res) => {
  const { planetId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM questions WHERE planet_id = $1",
      [planetId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota POST para adicionar uma resposta a uma pergunta
app.post("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { answer_text } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO answers (question_id, answer_text)
       VALUES ($1, $2) RETURNING *`,
      [questionId, answer_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao adicionar resposta:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota GET para visualizar respostas de uma pergunta
app.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar respostas:", err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
