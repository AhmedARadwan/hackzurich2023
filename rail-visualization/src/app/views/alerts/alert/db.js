// db.js
const mongoose = require('mongoose');

// Replace 'mongodb://localhost:27020/alerts' with your MongoDB connection URL
const mongoDBUrl = 'mongodb://localhost:27020/alerts';

mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

module.exports = db;
