const express = require('express');
const { verifyAdmin } = require('../middlewares/verify-admin');
const { addEvent, getAllEvents } = require('../controllers/event.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

router.post('/', upload.single('image'), verifyAdmin, addEvent)
      .get('/', getAllEvents);
     
      
module.exports = router;