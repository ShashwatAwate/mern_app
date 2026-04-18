const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const MsgSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model('Message', MsgSchema);

app.get('/api/message', async (req, res) => {
  let msg = await Message.findOne();
  if (!msg) msg = await Message.create({ text: 'Hello from MongoDB Atlas!' });
  res.json({ message: msg.text });
});

app.listen(process.env.PORT || 5000, () => console.log('Server running'));