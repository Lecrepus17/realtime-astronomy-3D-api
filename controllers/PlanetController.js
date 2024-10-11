// controllers/PlanetController.js
const PlanetService = require("../services/PlanetService");
const upload = require("../providers/FileProvider");

const PlanetController = {
  addPlanet: [
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
        const newPlanet = await PlanetService.createPlanet({
          name,
          texture_path,
          dump_path,
          clouds_path,
          specularity_path,
          description,
        });
        res.status(201).json(newPlanet);
      } catch (err) {
        console.error("Erro ao adicionar planeta:", err.message);
        res.status(500).send("Erro no servidor");
      }
    },
  ],

  getAllPlanets: async (req, res) => {
    try {
      const planets = await PlanetService.getAllPlanets();
      res.json(planets);
    } catch (err) {
      console.error("Erro ao buscar planetas:", err);
      res.status(500).send("Erro no servidor");
    }
  },

  addQuestion: async (req, res) => {
    const { planetId } = req.params;
    const { question_text } = req.body;

    try {
      const newQuestion = await PlanetService.createQuestion(
        planetId,
        question_text
      );
      res.status(201).json(newQuestion);
    } catch (err) {
      console.error("Erro ao adicionar pergunta:", err.message);
      res.status(500).send("Erro no servidor");
    }
  },

  getQuestionsByPlanetId: async (req, res) => {
    const { planetId } = req.params;

    try {
      const questions = await PlanetService.getQuestionsByPlanetId(planetId);
      res.json(questions);
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err.message);
      res.status(500).send("Erro no servidor");
    }
  },

  addAnswer: async (req, res) => {
    const { questionId } = req.params;
    const { answer_text } = req.body;

    try {
      const newAnswer = await PlanetService.createAnswer(
        questionId,
        answer_text
      );
      res.status(201).json(newAnswer);
    } catch (err) {
      console.error("Erro ao adicionar resposta:", err.message);
      res.status(500).send("Erro no servidor");
    }
  },

  getAnswersByQuestionId: async (req, res) => {
    const { questionId } = req.params;

    try {
      const answers = await PlanetService.getAnswersByQuestionId(questionId);
      res.json(answers);
    } catch (err) {
      console.error("Erro ao buscar respostas:", err.message);
      res.status(500).send("Erro no servidor");
    }
  },
};

module.exports = PlanetController;
