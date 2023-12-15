const {pool} = require('../config/sql.config');
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');


const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};


exports.createUser = async (req, res) => {
  try {
    if (!emailValidator.validate(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hash };
    pool.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.status(200).json(user);
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
};

exports.loginUser = (req, res) => {
  pool.query('SELECT * FROM users WHERE email = ?', [req.body.email], async (err, user) => {
    try {
      if (user.length === 0) {
        return res.status(401).json({ message: 'No such user email' });
      }
      const JWTtoken = process.env.JWTtoken;
      const token = jwt.sign({ id: user[0].id }, JWTtoken, {
        algorithm: 'HS256',
        expiresIn: '24h', // 24 hours
      });

      const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password);
      if (isPasswordValid) {
        return res.status(200).json({
          message: 'Login successful!',
          name: user[0].name,
          email: user[0].email,
          role: user[0].role,
          token: token,
        });
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      return handleDatabaseError(res, err);
    }
  });
};


// Function to send a reset password email
const sendResetPasswordMail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'nicolas93@ethereal.email',
        pass: 'nQ2NgGsN1jVyBy5YSQ'
    }
  });
  const mailOptions = {
    from: '<nicolas93@ethereal.email>',
    to: email,
    subject: 'Reset Password',
    html: `<p> Please copy the link and <a href="http://localhost:3000/reset-password?token=${token}">reset your password</a>.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return true;
  } catch (err) {
    console.error('Error sending email: ', err);
    return false;
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    try {
      if (user.length === 0) {
        return res.status(401).json({ message: 'No such user email' });
      }

      const token = jwt.sign({ email: user[0].email }, 'secret_Key');
      const sent = await sendResetPasswordMail(user[0].email, token);

      if (sent) {
        pool.query('UPDATE users SET token = ? WHERE email = ?', [token, email], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          if (result.affectedRows === 1) {
            return res.status(200).json({ message: 'Please check your mailbox!' });
          } else {
            console.error('No rows were updated.');
            return res.status(400).json({ message: 'No rows were updated.' });
          }
        });
      } else {
        return res.status(500).json({ error: 'Something went wrong while sending email.' });
      }
    } catch (err) {
      return handleDatabaseError(res, err);
    }
  });
};

exports.resetPassword = (req, res) => {
  const { password, token } = req.body;

  pool.query('SELECT * FROM users WHERE token = ?', [token], async (err, user) => {
    try {
      if (user.length === 0) {
        return res.status(400).json({ message: 'Token has expired.' });
      }

      const hash = await bcrypt.hash(password, 10);
      pool.query('UPDATE users SET password = ? WHERE email = ?', [hash, user[0].email], (result) => {
        return res.status(200).json({ message: 'User password has been reset.' });
      });
    } catch (err) {
      return handleDatabaseError(res, err);
    }
  });
};
