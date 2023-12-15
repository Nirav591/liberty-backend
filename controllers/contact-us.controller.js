const {pool} = require('../config/sql.config');
const emailValidator = require('email-validator');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.addContactUS = async (req, res) => {
  try {
    const {name, email, phone, message} = req.body;

    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const queryParams = [ name, email, phone, message ];
    let query = 'INSERT INTO contact_us (name, email, phone, message) VALUES (?, ?, ?, ?)';
    
    pool.query(query, queryParams, async(err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }     
      return res.status(200).json({success:true, message: 'Contact details added successfully!' });            
    })
  } catch(err){
    return handleDatabaseError(res, err);
  }
} 

exports.getAllContacts = async (req, res) => {
  try {   
    let query = 'SELECT * FROM contact_us';    
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