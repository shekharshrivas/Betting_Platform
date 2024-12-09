const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  betamount: { type: Number, required: true },
  betOn: {type: Boolean, default:true},
  betstatus: { type: String, enum: ["pending", "won", "lost"], default: "pending" },
  returnamount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Bet", betSchema);
