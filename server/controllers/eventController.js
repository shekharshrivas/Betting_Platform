const Event = require("../models/event");
const Bet = require("../models/bet");
const User = require("../models/user");

exports.getEvents = async (req, res) => {
  try {
    // Find events with status "open" and select required fields
    const events = await Event.find({ status: "open" })
      .select("title description returnration status")
      .populate("owner", "username");

    // Transform the data to include only required fields
    const formattedEvents = events.map(event => ({
      eventId: event._id,
      title: event.title,
      description: event.description,
      returnration: event.returnration,
      owner: event.owner.username, // Include owner's username only
    }));

    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, returnration, userId } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const event = new Event({ 
      title, 
      description, 
      returnration, 
      owner: userId // Use the provided userId as the event owner
    });

    await event.save();

    res.status(201).json({ message: "Event created successfully.", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};


exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Only proceed if status is being updated to "completed"
    if (status === "completed") {
      const bets = await Bet.find({ eventId });
      let totalReturn = 0;

      for (const bet of bets) {
        if (bet.betstatus === "pending") {
          if (bet.betOn === event.winner) {
            // User wins the bet
            const returnAmount = bet.betamount * event.returnration;
            bet.returnamount = returnAmount;
            bet.betstatus = "won";
            await bet.save();

            const user = await User.findById(bet.userId);
            user.balance += returnAmount;
            user.totalwinnings += returnAmount;
            await user.save();

            totalReturn += returnAmount; // Keep track of total winnings
          } else {
            // User loses the bet, update event owner's balance
            const owner = await User.findById(event.owner);
            const winningAmount = bet.betamount * event.returnration;

            owner.balance += winningAmount; // Event owner earns the losing bet amount
            await owner.save();

            bet.betstatus = "lost";
            await bet.save();
          }
        }
      }
    }

    // Update the event status to "completed"
    event.status = status;
    await event.save();

    res.json({ message: "Event status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};
