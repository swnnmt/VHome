const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const mainRoutes= require('./routes/mainRoutes');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use('/tiles', express.static('tiles'));
app.use('/design', express.static('design')); // để client truy cập ảnh qua URL
app.use('/designed', express.static('designed'));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(authRoutes);
app.use(mainRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
