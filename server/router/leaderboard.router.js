const Router = require("express").Router;
const router = new Router();

const { LeaderboardController } = require("../controllers");

router.post("/", async (req, res) => {
  try {
    const { username, difficulty, score } = req.body;

    if (!username) {
      throw new Error("Invalid username"); // TODO BadRequest
    }
    if (!difficulty) {
      throw new Error("Invalid difficulty"); // TODO BadRequest
    }
    if (!score) {
      throw new Error("Invalid score"); // TODO BadRequest
    }

    const entry = await LeaderboardController.addScore(
      username,
      difficulty,
      score
    );
    res.json(entry);
  } catch (e) {
    const code = e.status || 500;
    res.status(code).json({
      code,
      err: e.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const leaderboard = await LeaderboardController.getLeaderboard();
    res.json(leaderboard.groupBy("difficulty"));
  } catch (e) {
    const code = e.status || 500;
    res.status(code).json({
      code,
      err: e.message
    });
  }
});

module.exports = router;
