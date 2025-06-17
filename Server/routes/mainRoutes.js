const express = require('express');
const mainRouter = express.Router();
const { createBrand, getBrandDetails, getAllBrands, addPaintAndTileToBrand } = require('../controllers/brandController');
const { createDesign, getDesignsByUserId, updateDesignById } = require('../controllers/designController');
const upload = require('../middlewares/multerConfig'); 

mainRouter.post('/brands', createBrand);
mainRouter.get('/brands/:id', getBrandDetails);
mainRouter.get('/brands', getAllBrands);
mainRouter.put('/brands/:brandId/add-items', addPaintAndTileToBrand);

// xử lý multipart/form-data với ảnh
mainRouter.post('/designs', upload, createDesign);
mainRouter.get('/designs/user/:id_user', getDesignsByUserId);
mainRouter.put('/designs/:id_design',upload,updateDesignById);
module.exports = mainRouter;
