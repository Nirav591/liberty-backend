const {pool} = require('../config/sql.config');
const emailValidator = require('email-validator');
const QRCode = require('qrcode');
const { createCanvas } = require('canvas');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.registerOnline = async (req, res) => {
  try {
    const {email, phone} = req.body;

    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const queryParams = [ email, phone ];
    let query = 'INSERT INTO register_online (email, phone) VALUES (?, ?)';
    
    pool.query(query, queryParams, async(err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }     

      const qrCodeData = `Email: ${email}, Phone: ${phone}`;
      const canvas = createCanvas(200, 200);
      await QRCode.toCanvas(canvas, qrCodeData);

      // Convert canvas to a data URL
      const qrCodeDataURL = canvas.toDataURL();
      
      return res.status(200).json({success:true, qrCodeDataURL: qrCodeDataURL, message: 'Register successfully!' });            
    })
  } catch(err){
    return handleDatabaseError(res, err);
  }
} 

exports.getAllOnlineReg = async (req, res) => {
  try {   
    let query = 'SELECT * FROM register_online';    
    pool.query(query, async(err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }     
      return res.status(200).json(result);            
    })
  } catch(err){
    return handleDatabaseError(res, err);
  }
}
