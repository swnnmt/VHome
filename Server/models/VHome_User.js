const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  count: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VHome_User', userSchema, 'VHome_User');
