// repositories/PlanetRepository.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api_database",
  password: "password",
  port: 5432,
});

const PlanetRepository = {
  createPlanet: (planetData) => {
    const {
      name,
      texture_path,
      dump_path,
      clouds_path,
      specularity_path,
      description,
    } = planetData;
    return pool.query(
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
  },

  getAllPlanets: () => {
    return pool.query("SELECT * FROM planets");
  },

  createQuestion: (planetId, question_text) => {
    return pool.query(
      `INSERT INTO questions (planet_id, question_text) VALUES ($1, $2) RETURNING *`,
      [planetId, question_text]
    );
  },

  getQuestionsByPlanetId: (planetId) => {
    return pool.query("SELECT * FROM questions WHERE planet_id = $1", [
      planetId,
    ]);
  },

  createAnswer: (questionId, answer_text) => {
    return pool.query(
      `INSERT INTO answers (question_id, answer_text) VALUES ($1, $2) RETURNING *`,
      [questionId, answer_text]
    );
  },

  getAnswersByQuestionId: (questionId) => {
    return pool.query("SELECT * FROM answers WHERE question_id = $1", [
      questionId,
    ]);
  },
};

module.exports = PlanetRepository;
