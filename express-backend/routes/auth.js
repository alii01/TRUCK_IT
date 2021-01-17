const express = require('express');
const authController = require('../controllers/auth');
const fareController=require('../controllers/fare')
const router = express.Router();

router.post('/signup',authController.createUser);
router.post('/login',authController.loginUser);
router.post('/fareCalculation',authController.fareCalculation);

module.exports= router;