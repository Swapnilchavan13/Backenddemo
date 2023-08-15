const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Grid = require('gridfs-stream');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

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

app.use(express.json());
app.use(cors());

connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

const conn = mongoose.connection;
const gfs = Grid(conn.db, mongoose.mongo);

// Route to add a new data entry
app.post('/data', upload.single('image'), async (req, res) => {
  try {
    const { mediaTitle, date, mediaSource, mediaType, keywords } = req.body;
    const image = req.file;

    const writeStream = gfs.createWriteStream({
      filename: image.originalname,
      metadata: {
        mediaTitle,
        date,
        mediaSource,
        mediaType,
        keywords,
      },
    });

    image.buffer.pipe(writeStream);

    writeStream.on('close', async (file) => {
      console.log('File saved in GridFS:', file._id);

      const newData = new Data({
        mediaTitle,
        date,
        mediaSource,
        mediaType,
        keywords,
        image: file._id,
      });

      await newData.save();
      res.json(newData);
    });

    writeStream.on('error', (err) => {
      console.log('Error saving file:', err);
      res.status(500).send('Server Error');
    });
  } catch (error) {
    console.log('Error:', error);
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
