const express = require('express');
const router = express.Router();
const {removeReportedProduct,  removeReportedSeller} = require("../controllers/adminController")

router.put('/products/:id', removeReportedProduct)
router.put('/users/:id', removeReportedSeller)

module.exports = router;