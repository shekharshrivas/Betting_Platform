const Event = require("../models/event");
const Bet = require("../models/bet");
const User = require("../models/user");

exports.placeBet = async (req, res) => {
  try {
    const { eventId, userId, betAmount } = req.body; // Match keys with frontend
    console.log(eventId, userId, betAmount);

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the user exists
    const user = await User.findById(userId); // Corrected to use `userId`
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userId == event.owner._id){
      return res.status(404).json({message: "Event owner can not bet on event own by him"})
    }

    if (user.balance < betAmount) { 
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Create the bet
    const bet = new Bet({
      eventId,
      userId,
      betamount: betAmount,
    });
    await bet.save();

    user.balance -= betAmount; // Use `user` to update balance
    await user.save();

    event.eventBetCount += 1; // Increment event bet count
    await event.save();

    res.status(201).json({ message: "Bet placed successfully.", bet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};


exports.getBetHistory = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch bets for the user and populate related event details
    const bets = await Bet.find({ userId })
      .select("betamount betstatus returnamount") // Select fields from the Bet table
      .populate({
        path: "eventId", // Populate the eventId field
        select: "title description returnration", // Select fields from the Event table
      });

    res.json(bets); // Return the bets with populated event details
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

