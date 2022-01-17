const LeaderboardRouter = require("./leaderboard.router");

const Router = require("express").Router;
const router = new Router();

router.use("/leaderboard", LeaderboardRouter);

module.exports = router;
