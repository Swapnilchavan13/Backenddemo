const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const otpGenerator = require('otp-generator');

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const app = express();


const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({ storage: storage, limits: { fileSize: 15 * 1024 * 1024 } }); // Set the maximum file size to 15MB


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

// Route to get all books
app.get('/data', async (req, res) => {
  try {
    const book = await Book.find();
    if (book) {
      res.json(book);
    } else {
      res.send('Something Went wrong.');
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

// Route to get book by id
app.get('/data/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

// Route to add a new data entry
app.post('/data', upload.single('image'), async (req, res) => {
  try {
    const { mediaTitle, date, mediaSource, mediaType, keywords } = req.body;
    const image = req.file.buffer; // Get the image data from the multer file object

    const data = new Data({
      mediaTitle,
      date,
      mediaSource,
      mediaType,
      keywords,
      image,
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
  
      // Encode the image to base64 before sending it to the frontend
      const dataWithBase64Image = data.map(result => {
        const base64Image = result.image.toString('base64');
        return { ...result._doc, image: base64Image };
      });
  
      res.json(dataWithBase64Image);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send('Server Error');
    }
  });

// Route to add a new book
app.post('/data', async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      body: req.body.body,
      description: req.body.description,
      image: req.body.image,
    });
    await book.save();
    res.json(book);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

// Rest of your code for '/a', '/auth', and '/autha' routes

// Start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
