const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { createReadStream } = require('fs');
const { createModel } = require('mongoose-gridfs');

const PORT = process.env.PORT;

mongoose.set('strictQuery', false);

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Models
const Data = require('./models/data');

// GridFS Model for Images
const Image = createModel({
  modelName: 'Image',
  connection: mongoose.connection,
});

// Middleware
app.use(express.json({ limit: '50mb' }));
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

app.post('/data', upload.single('image'), async (req, res) => {
  try {
    const { mediaTitle, date, mediaSource, mediaType, keywords } = req.body;
    const imageStream = createReadStream(req.file.path);

    const imageModel = new Image();
    const writeStream = imageModel.write({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    imageStream.pipe(writeStream);

    writeStream.on('close', async () => {
      const data = new Data({
        mediaTitle,
        date,
        mediaSource,
        mediaType,
        keywords,
        imageFileId: imageModel.id,
      });

      await data.save();
      res.json(data);
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

app.get('/main', async (req, res) => {
  try {
    const data = await Data.find();

    const dataWithBase64Image = await Promise.all(data.map(async result => {
      const image = await Image.readById(result.imageFileId);
      const base64Image = image.toString('base64');
      return { ...result._doc, image: base64Image };
    }));

    res.json(dataWithBase64Image);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Server Error');
  }
});

// Rest of your code for other routes

// Start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
