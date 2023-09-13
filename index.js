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

const Address = require('./models/address');
const Business = require('./models/business')
const Campaign = require('./models/campaign')
const Signup = require('./models/signup')


app.get('/', function (req, res) {
   res.send('Hello Swapnil Everything is good');
})

app.post('/signup', async (req, res) => {
  try {
    const newSignup = await Signup.create(req.body);
    res.status(201).json(newSignup);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

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

// Update an address without specifying an ID
app.put('/address', async (req, res) => {
  try {
    // Assuming you have a unique identifier for the address, e.g., email
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Id is required to update address' });
    }

    // Find the address by id and update it
    const updatedAddress = await Address.findOneAndUpdate(
      { _id },
      req.body,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ error: 'Id not found' });
    }

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Add Business Data
app.post('/business', async (req, res) => {
  try {
    const newBusinesses = await Business.create(req.body);
    res.status(201).json(newBusinesses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Get All business Data
app.get('/business', async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/business', async (req, res) => {
  try {
    // Assuming you have a unique identifier for the address, e.g., id
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Id is required to update address' });
    }

    // Find the Business by id and update it
    const updatedBusiness = await Business.findOneAndUpdate(
      { _id },
      req.body,
      { new: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ error: 'Id not found' });
    }

    res.json(updatedBusiness);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/campaign', async (req, res) => {
  try {
    const newCampaigns = await Campaign.create(req.body);
    res.status(201).json(newCampaigns);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Get All campaign Data
app.get('/campaign', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an address without specifying an ID
app.put('/campaign', async (req, res) => {
  try {
    // Assuming you have a unique identifier for the address, e.g., id
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Id is required to update address' });
    }

    // Find the Campaign by id and update it
    const updatedCampaign = await Campaign.findOneAndUpdate(
      { _id },
      req.body,
      { new: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Id not found' });
    }

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});