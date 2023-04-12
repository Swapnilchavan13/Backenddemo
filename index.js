require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/books');

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

// Route to get book by id
app.get('/data/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.json(book);
    } catch (error) {
        console.log("Err", + error);
        res.status(500).send('Server Error');
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

app.post('/auth', async (req, res) => {
    try {
        const auth = new Auth({
            mobile: req.body.mobile,
            adhar: req.body.adhar,
            otp:req.body.otp,
        });
        await auth.save();
        res.json(auth);
    } catch (error) {
        console.log("Err", + error);
        res.status(500).send('Server Error');
    }
});

//delete by id

app.delete('/data/:_id', async (req, res) => {
    try {
        const book = await Book.findById(req.params._id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await book.remove();
        res.json({ message: 'Book removed successfully' });
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
