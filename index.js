const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const otpGenerator = require('otp-generator');

const PORT = process.env.PORT;

mongoose.set('strictQuery', false);

const app = express();

const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // Set the maximum file size to 15MB

// Models
const Data = require('./models/data');
const Book = require('./models/books');
const Auth = require('./models/auths');
const Upload = require('./models/upload');

// Middleware

app.use(express.json({ limit: '50mb' }))
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


AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const s3 = new AWS.S3();


// Route to get all books
// Routes
app.get('/', (req, res) => {
  res.send({ title: 'Backend is Running...' });
});

app.get('/book-data', async (req, res) => {
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
app.get('/book-data/:id', async (req, res) => {
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
  }
});

app.get('/main', async (req, res) => {
    try {
      const data = await Data.find();

  res.status(500).send('Server Error');
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
app.post('/book-data', async (req, res) => {
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
    res.status(500).send('Server Error');
  }
});


app.post('/upload', upload.single('upload'), async (req, res) => {
  const file = req.file;

  try {
    // Upload image to AWS S3
    const params = {
      Bucket: 'cyclic-lonely-cow-life-jacket-ap-southeast-2', // Replace with your S3 bucket name
      Key: Date.now() + '-' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const s3Response = await s3.upload(params).promise();

    // Save image data and S3 URL to MongoDB
    const uploadedImage = new Upload({
      data: file.buffer,
      contentType: file.mimetype,
      s3Url: s3Response.Location, // Save the S3 URL
    });

    await uploadedImage.save();

    res.status(200).json({ message: 'Image uploaded successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading the image.' });
  }
});

// Rest of your code for '/a', '/auth', and '/autha' routes

    // console.log("Error:", error);
// Start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
