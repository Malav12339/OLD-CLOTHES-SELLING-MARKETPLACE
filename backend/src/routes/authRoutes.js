const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateUser = require('../middlewares/authMiddleware');
const { addReport, getReports, updateReportStatus } = require('../controllers/userReportsController');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/admin/signup', authController.adminSignup)
router.post('/admin/login', authController.adminLogin);
router.post('/report', validateUser, addReport)

router.get('/name', validateUser, authController.getName);
router.get('/reports', validateUser, getReports);

router.put('/reports/:id/status', updateReportStatus)

module.exports = router;