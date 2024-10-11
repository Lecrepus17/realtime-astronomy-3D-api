// services/PlanetService.js
const PlanetRepository = require("../repositories/PlanetRepository");

const PlanetService = {
  createPlanet: async (data) => {
    const result = await PlanetRepository.createPlanet(data);
    return result.rows[0];
  },

  getAllPlanets: async () => {
    const result = await PlanetRepository.getAllPlanets();
    return result.rows;
  },

  createQuestion: async (planetId, question_text) => {
    const result = await PlanetRepository.createQuestion(
      planetId,
      question_text
    );
    return result.rows[0];
  },

  getQuestionsByPlanetId: async (planetId) => {
    const result = await PlanetRepository.getQuestionsByPlanetId(planetId);
    return result.rows;
  },

  createAnswer: async (questionId, answer_text) => {
    const result = await PlanetRepository.createAnswer(questionId, answer_text);
    return result.rows[0];
  },

  getAnswersByQuestionId: async (questionId) => {
    const result = await PlanetRepository.getAnswersByQuestionId(questionId);
    return result.rows;
  },
};

module.exports = PlanetService;
