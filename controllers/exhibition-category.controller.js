const {pool} = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.addCategory = async (req, res) => {  
  try {
    const {category} = req.body;

    const query = 'INSERT INTO exhibition_category (category) VALUES (?)';
    const queryParams = [category];

    pool.query(query, queryParams, (err, result) => {
      if (err) {
        return handleDatabaseError(res, err);
      }
        return res.status(200).json({ message: 'Exhibition Category added successfully!' });         
    }
    );     
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};


exports.getAllCategory = async (req, res) => {
  try {   
    let query = 'SELECT * FROM exhibition_category';    
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

exports.getCategoryById = async (req, res) => {
  try {   
    const id = req.params.id;
    let query = 'SELECT * FROM exhibition_category WHERE id = ?';    
    pool.query(query, [id], async(err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }     
      return res.status(200).json(result);            
    })
  } catch(err){
    return handleDatabaseError(res, err);
  }
}