const express = require('express');
const { addContactUS, getAllContacts } = require('../controllers/contact-us.controller');
const { verifyAdmin } = require('../middlewares/verify-admin');
const router = express.Router();

router.post('/', addContactUS)
      .get('/', verifyAdmin, getAllContacts);
     
      
module.exports = router;