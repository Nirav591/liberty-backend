const express = require('express');
const { addCategory, getAllCategory, getCategoryById } = require('../controllers/exhibition-category.controller');
const { verifyAdmin } = require('../middlewares/verify-admin');
const router = express.Router();

 
router.post('/', verifyAdmin, addCategory)
      .get('/:id', getCategoryById)
      .get('/', getAllCategory);
     
      
module.exports = router;