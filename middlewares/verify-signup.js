const { pool } = require('../config/sql.config');

exports.checkUsernameOrEmail = (req, res, next) => {
   // Check username and email in parallel
    Promise.all([
      new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE name = ?', [req.body.name], (err, userByUsername) => {
          if (err) {
            return reject(err);
          }
          resolve(userByUsername.length > 0);
        });
      }),
      new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, userByEmail) => {
          if (err) {
            return reject(err);
          }
          resolve(userByEmail.length > 0);
        });
      }),
    ])
      .then(([usernameInUse, emailInUse]) => {
        if (usernameInUse) {
          return res.status(400).json({ message: 'Failed! Username is already in use!' });
        }
        if (emailInUse) {
          return res.status(400).json({ message: 'Failed! Email is already in use!' });
        }
        next(); // Move to the next middleware or route handler
      })
      .catch((err) => {
        return res.status(500).json({ error: 'Database query error' });
      });
};