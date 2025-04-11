const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const validateUser = require('../middlewares/authMiddleware');

router.post('/:productId', validateUser, wishlistController.addToWishlist);
router.delete('/:productId', validateUser, wishlistController.removeFromWishlist);
router.get('/', validateUser, wishlistController.getWishlist);

module.exports = router;