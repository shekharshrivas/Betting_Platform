const express = require("express");
const { getUserInfo, addBalance } = require("../controllers/userController");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/me", getUserInfo);
router.post("/add-balance", addBalance);

module.exports = router;
