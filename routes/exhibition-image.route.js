const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addImage, getAllCategoryImage } = require('../controllers/exhibition-image.controller');
const { verifyAdmin } = require('../middlewares/verify-admin');
const router = express.Router();


const createUploadsFolder = () => {
      const uploadsPath = path.resolve(__dirname, '../uploads');
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath);
      }
    };
    
createUploadsFolder();
    
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        createUploadsFolder();
        cb(null, path.resolve(__dirname, '../uploads'));
      },
      filename: (req, file, cb) => {      
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + fileExtension;
        cb(null, fileName);
      },
    });
    
const upload = multer({ storage });
    

router.post('/', upload.single('image'), verifyAdmin, addImage)
      .get('/', getAllCategoryImage);
     
      
module.exports = router;