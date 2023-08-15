const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const otpGenerator = require('otp-generator');

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Models
const Data = require('./models/data');
const Book = require('./models/books');
const Auth = require('./models/auths');

// Middleware
app.use(express.json());
app.use(cors());

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

// Routes
app.get('/', (req, res) => {
  res.send({ title: 'Backend is Running...' });
});

// Route to add a new data entry
app.post('/data', upload.single('file'), async (req, res) => {
  try {
    const { mediaTitle, date, mediaSource, mediaType, keywords } = req.body;
    const file = req.file;

    // Save the uploaded file to the local file system
    const filePath = `uploads/${mediaType}s/${Date.now()}-${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer); // Write the buffer to the file

    const data = new Data({
      mediaTitle,
      date,
      mediaSource,
      mediaType,
      keywords,
      image: fs.readFileSync(filePath),
    });

    await data.save();
    res.json(data);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

app.get('/main', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

// ... (other routes)

// Start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
