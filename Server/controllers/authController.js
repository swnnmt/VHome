const User = require('../models/VHome_User')

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' })

    const user = await User.create({ name, email, password }) 
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email và password
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ user: userData });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password'); // loại bỏ mật khẩu khi trả về

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
