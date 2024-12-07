const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');




const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // Allow React app origin

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
// MONGO_URI = "mongodb+srv://shekharshrivas07:YqcUDBU7IMy2bcgI@demo.lf9yo.mongodb.net/?retryWrites=true&w=majority&appName=Demo"
MONGO_URI="mongodb://localhost:27017/"
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
    userId: {type: Number, default: 101},
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: {type: Number, default: 500},
    totalwinnings: {type: Number, default: 0}
}));

const Event = mongoose.model('Event', new mongoose.Schema({
    eventId: {type: Number, default: 1001},
    title: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    teamwinner: {type: String, required: false},
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}));

const Bet = mongoose.model('Bet', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    bettingTeam:{type:Boolean, required: true},
    amount: { type: Number, required: true },
    winningamount : {type: Number, required:true},
    createdAt: { type: Date, default: Date.now },
}));

app.get('/leaderboard', async (req, res)=>{
    try {
        console.log("api called")
        const leaderboard = await User.find().sort({ totalwinnings: -1 }).limit(20);
        // const leaderboard = {'username':TextDecoderStream, 'totalwinnings':890}

        res.status(200).send(leaderboard);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// User Routes
app.post('/register', async (req, res) => {
    try {
        // Find the user with the highest current userId (sorted descending)
        const latestUser = await User.findOne().sort({ userId: -1 });

        // If no user exists, the first user will get userId = 10001
        const userId = latestUser ? latestUser.userId + 1 : 10001;

        const userData = {
            ...req.body,
            userId: userId
        };

        // Create and save the new user
        const user = new User(userData);
        await user.save();

        res.status(201).send(user); 
    } catch (err) {
        console.error(err);
        res.status(400).send(err); 
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.send(user);
        console.log("vallidation successful")
    } else {
        res.status(400).send({ error: 'Invalid credentials' });
    }
});

// POST /events - Create a new event
app.post('/events', async (req, res) => {
    const { eventId, title, team1, team2, teamwinner, status } = req.body;

    // Validate input fields
    if (!eventId || !title || !team1 || !team2 || !status) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const eventTeamwinner = teamwinner || '';

    try {
        // Create a new event
        const newEvent = new Event({
            eventId,
            title,
            team1,
            team2,
            teamwinner:eventTeamwinner,
            status
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();
        res.status(201).json({
            message: 'Event created successfully.',
            event: savedEvent
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Failed to create event.', error: error.message });
    }
});

app.patch('/events/:id', async (req, res) => {
    const eventId = req.params.id;
    const updatedData = req.body;

    try {
        // Find the event by ID and update it with the new data
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            updatedData,
            { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` applies the validation rules
        );

        // If the event is not found, send a 404 response
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Respond with the updated event
        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
});


app.get('/events', async (req, res) => {
    try {
      const events = await Event.find(); // Fetch events from MongoDB
      res.send(events); // Send events as JSON response
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  })

// Fetch Event by ID
app.get('/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Event ID format' });
      }
  
      const event = await Event.findById(id);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.post('/bets', async (req, res) => {
    const { userId, eventId, bettingTeam, amount } = req.body;

    try {
        // Find the user and the event
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);

        // Check if the user has sufficient balance
        if (user.balance < amount) {
            return res.status(400).send({ message: 'Insufficient balance' });
        }

        // Deduct the bet amount from the user's balance
        user.balance -= amount;
        await user.save();

        // Calculate the winning amount (this can be adjusted according to the betting rules)
        let winningAmount = 0;
        if (event.status === 'Completed') {
            if (
                (bettingTeam && event.teamwinner === event.team1) || 
                (!bettingTeam && event.teamwinner === event.team2)
            ) {
                winningAmount = amount * 2; // Example: double the bet if the user wins
                user.balance += winningAmount; // Add winnings to user's balance
                user.totalwinnings += winningAmount; // Update total winnings
                await user.save();
            }
        }

        // Create a new bet record
        const bet = new Bet({
            userId,
            eventId,
            bettingTeam,
            amount,
            winningamount: winningAmount,
        });

        await bet.save();

        // Respond with the created bet and updated user details
        res.status(201).send({
            bet,
            user: { balance: user.balance, totalwinnings: user.totalwinnings },
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});


app.get('/bets', async (req, res) => {
    const bets = await Bet.find().populate('userId').populate('eventId');
    res.send(bets);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));