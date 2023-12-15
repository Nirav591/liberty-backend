const { pool } = require('../config/sql.config');
const { promisify } = require('util');
const queryAsync = promisify(pool.query).bind(pool);

exports.verifyAdmin = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await queryAsync('SELECT * FROM users WHERE id = ?', [userId]);

    if (user.length) {
      if (user[0].role === 'admin') {
        next();
      } else {
        res.json({
          message: 'Require Admin Role!',
        });
      }
    } else {
      return res.status(400).send('No such user found');
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};