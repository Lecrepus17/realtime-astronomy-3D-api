// index.js
const express = require("express");
const PlanetController = require("./controllers/PlanetController");

const app = express();
const port = 4000;

app.use(express.json());

app.post("/planets", PlanetController.addPlanet);
app.get("/planets", PlanetController.getAllPlanets);
app.post("/planets/:planetId/questions", PlanetController.addQuestion);
app.get(
  "/planets/:planetId/questions",
  PlanetController.getQuestionsByPlanetId
);
app.post("/questions/:questionId/answers", PlanetController.addAnswer);
app.get(
  "/questions/:questionId/answers",
  PlanetController.getAnswersByQuestionId
);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
