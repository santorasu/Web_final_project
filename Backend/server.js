const express = require('express');
const bcrypt = require('bcryptjs'); 
const cors = require('cors'); 
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./user.js');
connectDb = require('./db.js');
const Ticket = require('./ticket.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors()); 

mongoose.connect(process.env.MONGO)
.then(() => console.log('MongoDB Atlas connected!'))
.catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving user' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
  
    // Generate JWT token (and include user's name in the response)
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  
    res.status(200).json({ message: 'Login successful', token, name: user.name });
  });
  

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

app.post('/purchase', async (req, res) => {
    const { start, destination, date, price } = req.body;
  
    // Validate input data
    if (!start || !destination || !date || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Create and save a new ticket purchase
      const ticket = new Ticket({
        // user: req.user.id,  // retrieved from the verified JWT token
        startLocation: start,
        destination,
        date,
        price
      });
      await ticket.save();
      console.log(ticket);
  
      res.status(200).json({ message: `Ticket for ${destination} on ${date} purchased successfully!` });
    } catch (error) {
      console.error("Purchase error:", error);
      res.status(500).json({ message: 'Error processing purchase' });
    }
  });
  
  

app.listen(port, () => {
    connectDb();
    console.log(`Server running on port ${port}`);
});
