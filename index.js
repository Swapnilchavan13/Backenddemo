const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json())
app.use(cors());

const PORT = process.env.PORT;

mongoose.set('strictQuery', false);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const Upload = require('./models/upload');
const Address = required('./models/address');


app.get('/', function (req, res) {
   res.send('Hello Swapnil Everything is good');
})


app.post('/address', async (req, res) => {
  try {
    const newAddress = await Address.create(req.body);
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all addresses
app.get('/address', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});