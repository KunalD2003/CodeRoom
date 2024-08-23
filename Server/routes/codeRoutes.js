const express = require('express');
const router = express.Router();
const { compileCode } = require('../controllers/codeController');

router.post('/collaborate', compileCode);

module.exports = router;
