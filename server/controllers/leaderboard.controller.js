const { sequelize, Leaderboard } = require("../models");

const addScore = async (username, difficulty, time) => {
  return Leaderboard.create({
    username,
    difficulty,
    time
  });
};

const getLeaderboard = async () => {
  return Leaderboard.findAll({
    attributes: {
      exclude: ["time"],
      include: [[sequelize.fn("MIN", sequelize.col("time")), "time"]]
    },
    order: [[sequelize.fn("MIN", sequelize.col("time")), "ASC"]],
    group: ["difficulty", "username"]
  });
};

module.exports = { addScore, getLeaderboard };
