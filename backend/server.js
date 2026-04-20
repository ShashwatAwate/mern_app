const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // IMPORTANT for POST requests

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema
const MsgSchema = new mongoose.Schema({
  text: String
});

const Message = mongoose.model('Message', MsgSchema);

// Get one message
app.get('/api/message', async (req, res) => {
  let msg = await Message.findOne();

  if (!msg) {
    msg = await Message.create({ text: 'Hello from MongoDB Atlas!' });
  }

  res.json({ message: msg.text });
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Add new message
app.post('/api/message', async (req, res) => {
  try {
    const newMsg = await Message.create({
      text: req.body.text
    });

    res.json({
      success: true,
      message: newMsg
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log('Server running')
);