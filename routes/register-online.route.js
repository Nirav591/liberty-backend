const express = require('express');
const { registerOnline, getAllOnlineReg } = require('../controllers/register-online.controller');
const { verifyAdmin } = require('../middlewares/verify-admin');
const router = express.Router();

router.post('/', registerOnline)
      .get('/', verifyAdmin, getAllOnlineReg);
     
      
module.exports = router;