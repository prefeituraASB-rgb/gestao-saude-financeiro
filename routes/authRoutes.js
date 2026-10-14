const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/setup-inicial-admin', authController.criarPrimeiroUsuarioAdmin);

module.exports = router;
