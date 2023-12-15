const {pool} = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.addProduct = async (req, res) => {  
  try {
    const {name, short_description, description} = req.body;

    const imagePaths = req.files?.map(file => `uploads/${file.filename}`);
    // const imagePaths = `uploads/${filename}`;

    const query = 'INSERT INTO products (name, short_description, description, image) VALUES (?, ?, ?, ?)';
    const queryParams = [name, short_description, description, JSON.stringify(imagePaths)];

    pool.query(query, queryParams, (err, result) => {
      if (err) {
        return handleDatabaseError(res, err);
      }
        return res.status(200).json({ message: 'Product added successfully!' });         
    }
    );     
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};


exports.getAllProducts = async (req, res) => {
  try {   
    let query = 'SELECT * FROM products';    
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


exports.getProductById = async (req, res) => {
  try { 
    const id = req.params.id;  
    let query = 'SELECT * FROM products WHERE id = ?';    
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