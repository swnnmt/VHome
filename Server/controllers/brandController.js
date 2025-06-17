const Brand = require('../models/VHome_brand'); // Đường dẫn tới file schema của bạn

// POST /brands
const createBrand = async (req, res) => {
  try {
    // Lấy dữ liệu từ body request
    const { name, banner, paints, tiles } = req.body;
    // Kiểm tra dữ liệu bắt buộc
    if (!name || !banner) {
      return res.status(400).json({ message: 'Name và banner là bắt buộc' });
    }
    // Tạo instance mới
    const newBrand = new Brand({
      name,
      banner,
      paints,
      tiles,
    });
    // Lưu vào DB
    const savedBrand = await newBrand.save();
    return res.status(201).json(savedBrand);
  } catch (error) {
    console.error('Create brand error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getBrandDetails = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Tìm brand theo id
    const brand = await Brand.findById(brandId).select('paints tiles name banner');

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Trả về paints và tiles (có thể kèm name, banner nếu cần)
    return res.json(brand);
  } catch (error) {
    console.error('Get brand details error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find(); // Lấy tất cả brands
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// thêm màu sơn vs mẫu gạchgạch
const addPaintAndTileToBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { paints, tiles } = req.body;

    // Kiểm tra brand tồn tại
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand không tồn tại' });
    }

    const updateData = {};
    const pushData = {};

    // Xử lý paints: phải là mảng và có phần tử hợp lệ
    if (Array.isArray(paints) && paints.length > 0) {
      const validPaints = paints.filter(p => p.colorCode && p.price !== undefined);
      if (validPaints.length > 0) {
        pushData.paints = { $each: validPaints };
      }
    }

    // Xử lý tiles: phải là mảng và có phần tử hợp lệ
    if (Array.isArray(tiles) && tiles.length > 0) {
      const validTiles = tiles.filter(t => t.image && t.price !== undefined);
      if (validTiles.length > 0) {
        pushData.tiles = { $each: validTiles };
      }
    }

    if (Object.keys(pushData).length === 0) {
      return res.status(400).json({ message: 'Không có paint hoặc tile hợp lệ để thêm' });
    }

    updateData.$push = pushData;

    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error('Lỗi thêm paints/tiles:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = {
  createBrand, getBrandDetails, 
  getAllBrands, addPaintAndTileToBrand
};
