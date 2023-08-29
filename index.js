const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(express.json())
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

const PORT = process.env.PORT;

app.get('/', function (req, res) {
   res.send('Hello Swapnil Every thinngig good');
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});