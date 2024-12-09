const express = require("express");
const { placeBet, getBetHistory } = require("../controllers/betController");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.post("/", placeBet);
router.get("/history", getBetHistory);

module.exports = router;
