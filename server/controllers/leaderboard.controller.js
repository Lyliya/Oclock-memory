const { Leaderboard } = require("../models");

const addScore = async (username, difficulty, time) => {
  return Leaderboard.create({
    username,
    difficulty,
    time
  });
};

const getLeaderboard = async () => {
  return Leaderboard.findAll({
    order: [["time", "ASC"]],
    group: ["username"]
  });
};

module.exports = { addScore, getLeaderboard };
