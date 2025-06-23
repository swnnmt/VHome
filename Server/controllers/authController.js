const User = require('../models/VHome_User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      balance: 0,
      count: 3
    });

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.topup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Số tiền nạp phải lớn hơn 0.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    const addedCount = Math.floor(amount / 5);
    user.balance += amount;
    user.count += addedCount;

    await user.save();

    res.json({
      message: 'Nạp tiền thành công!',
      balance: user.balance,
      addedCount,
      count: user.count
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi nạp tiền.', error: err.message });
  }
};
