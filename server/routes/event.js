const express = require("express");
const { getEvents, createEvent, updateEventStatus } = require("../controllers/eventController");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.put("/status", updateEventStatus);

module.exports = router;
