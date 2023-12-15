const {pool} = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.addImage = async (req, res) => {  
  try {
    const {category_id} = req.body;
    const {filename} = req.file;
    const imagePath = `uploads/${filename}`;

    const query = 'INSERT INTO exhibition_image (category_id, image) VALUES (?, ?)';
    const queryParams = [category_id, imagePath];

    pool.query(query, queryParams, (err, result) => {
      if (err) {
        return handleDatabaseError(res, err);
      }
        return res.status(200).json({ message: 'Exhibition Image added successfully!' });         
    }
    );     
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};


exports.getAllCategoryImage = async (req, res) => {
  try {   
    const id = req.query.category_id;
    let query = 'SELECT * FROM exhibition_image WHERE category_id = ?';    
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