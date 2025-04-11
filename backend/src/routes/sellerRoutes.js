const express = require("express")
const { sellerInfo, sellerProducts, getUserData } = require("../controllers/sellerInfoController")
const router = express.Router()

router.get('/sellerInfo/:id', sellerInfo)
router.get('/sellerProds', sellerProducts)
router.get('/userInfo', getUserData)

module.exports = router