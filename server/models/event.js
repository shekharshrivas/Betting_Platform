const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  returnration: { type: Number, required: true },
  status: { type: String, enum: ["open", "completed"], default: "open" },
  winner: { type: Boolean, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventbetcount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Event", eventSchema);
