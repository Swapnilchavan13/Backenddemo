const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Grid = require('gridfs-stream');
const app = express();
const PORT = process.env.PORT;

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

const DataSchema = new mongoose.Schema({
  mediaTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  mediaSource: {
    type: [String],
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId, // Using GridFS ObjectId reference
    ref: 'uploads.files', // GridFS collection name
    required: true,
  },
});

const Data = mongoose.model('Data', DataSchema);

const conn = mongoose.connection;
const gfs = Grid(conn.db, mongoose.mongo);

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

app.get('/images/:fileId', (req, res) => {
  try {
    const fileId = req.params.fileId;

    const readStream = gfs.createReadStream({ _id: fileId });

    readStream.pipe(res);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
