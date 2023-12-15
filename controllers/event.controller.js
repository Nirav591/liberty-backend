const {pool} = require('../config/sql.config');
const emailValidator = require('email-validator');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.addEvent = async (req, res) => {
  try {
    const {title, dates, days, venue} = req.body;
    const {filename} = req.file;
    const imagePath = `uploads/${filename}`;

    const queryParams = [ title, dates, days, venue, imagePath ];
    let query = 'INSERT INTO events (title, dates, days, venue, image) VALUES (?, ?, ?, ?, ?)';
    
    pool.query(query, queryParams, async(err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }     
      return res.status(200).json({success:true, message: 'Event added successfully!' });            
    })
  } catch(err){
    return handleDatabaseError(res, err);
  }
} 

exports.getAllEvents = async (req, res) => {
  try {   
    let query = 'SELECT * FROM events';    
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