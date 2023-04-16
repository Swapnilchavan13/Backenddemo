require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/books');
const Auth = require('./models/auths');
const AuthA = require('./models/auths');
const otpGenerator = require('otp-generator');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// parse application/json
app.use(express.json());

// Add cors middleware
app.use(cors());

app.get('/', (req, res) => {
    res.send({title: 'Backend is Runnning...'});
});


app.get('/data', async (req,res) => {
    const book = await Book.find();

    if (book) {
        res.json(book);
    } else {
        res.send("Something Went wrong.");
    }
});


// Route to add a new book
app.post('/data', async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            body: req.body.body,
            discription:req.body.discription,
            image:req.body.image
        });
        await book.save();
        res.json(book);
    } catch (error) {
        console.log("Err", + error);
        res.status(500).send('Server Error');
    }
});

app.get('/a',(req, res) => {
    res.send({title: 'Auth is Runnning...'});
});

app.get('/auth', async (req,res) => {
    const auth = await Auth.find();

    if (auth) {
        res.json(auth);
    } else {
        res.send("Something Went wrong.");
    }
});

app.post('/auth', async (req, res) => {
    try {
        const auth = new Auth({
            hospital_id : req.body.hospital_id,
            aadhaar_num : req.body.aadhaar_num,
            otp : req.body.otp
        })
        await auth.save();
        res.json("Otp Authentication Done");
    } catch (error) {
        console.log("Err", + error);
        res.status(500).send('Server Error');
    }
});


app.post('/autha', async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    console.log('OTP generated:', otp);
    const autha = new AuthA({
      aadhaar_num : req.body.aadhaar_num,
      otp: otp
    })
    await autha.save();
    res.json({ message: "OTP generated and saved" ,otp });
  } catch (error) {
    console.log("Err", + error);
    res.status(500).send('Server Error');
  }
});
   

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});
