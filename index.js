const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // for generating unique filenames

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure AWS SDK with your credentials and region

AWS.config.update({
  accessKeyId: 'ASIAS6VEKOOH7OOR4YKC',
  secretAccessKey: 'v5eQ+sOtqYI7+LYLT/Jy4OOam7nwuo8LeFhT7zXY',
  region: 'ap-southeast-2', // e.g., 'us-east-1'
});

const s3 = new AWS.S3();

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

    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;

    // Upload the file to AWS S3
    const params = {
      Bucket:  "cyclic-lonely-cow-life-jacket-ap-southeast-2",
      Key: `uploads/${mediaType}s/${uniqueFilename}`,
      Body: file.buffer,
    };

    await s3.upload(params).promise();

    const data = new Data({
      mediaTitle,
      date,
      mediaSource,
      mediaType,
      keywords,
      // Save the S3 URL to the image field
      image: `https://cyclic-lonely-cow-life-jacket-ap-southeast-2/${params.Key}`,
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
    
    // Modify the data to include image URLs
    const dataWithImageUrls = data.map(item => {
      return {
        ...item.toObject(),
        image: item.image, // The S3 image URL is already stored in the 'image' field
      };
    });

    res.json(dataWithImageUrls);
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
