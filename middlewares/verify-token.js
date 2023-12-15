const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }
  const secretKey = process.env.JWTtoken;
  
  try{
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id;   
    next();
  }catch(err){
    res.status(401).json({message: 'Unauthorized!'});  
  }  
};