const express = require("express");
const { getUserInfo, addBalance } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUserInfo);
router.post("/addbalance", addBalance);

module.exports = router;
