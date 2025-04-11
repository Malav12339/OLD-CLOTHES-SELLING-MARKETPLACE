const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateUser = require('../middlewares/authMiddleware');
const isProductOwner = require('../middlewares/productMiddleware');
const upload = require('../config/multer');

router.get('/', productController.getAllProducts);

router.get('/categories', productController.getCategories)
router.get('/subcategories', productController.getSubCategories)
router.post('/addCategory', validateUser, productController.addCategory)
router.post('/addSubcategory', validateUser, productController.addSubcategory)

router.get('/:id', productController.getProduct);
router.post('/', validateUser, upload.single("image"), productController.createProduct);

// new added
router.patch('/:id', validateUser, isProductOwner, productController.editProduct)
router.delete('/:id', validateUser, isProductOwner, productController.deleteProduct);

// router.delete('/:id', productController.deleteProduct)

module.exports = router;