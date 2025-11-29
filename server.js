const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error(err));

    
// 🟢 Add this right below the connection 👇
mongoose.connection.on('connected', () => {
  console.log(`✅ Connected to MongoDB database: ${mongoose.connection.name}`);
});

// 📝 Routes

// ➕ Sign Up
app.post('/signup', async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ fullname, email, phone, password });
        await user.save();
        res.json({ message: 'Signup successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔐 Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 💬 Contact Message
app.post('/contact', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        const newMsg = new Message({ name, phone, email, message });
        await newMsg.save();
        res.json({ message: 'Message saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
