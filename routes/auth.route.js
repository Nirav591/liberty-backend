const express = require('express');
const { createUser, loginUser, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const {checkUsernameOrEmail} = require('../middlewares/verify-signup');
const router = express.Router();

router.post('/sign-up', checkUsernameOrEmail, createUser)
      .post('/sign-in', loginUser)
      .post('/forgot-password', forgotPassword)
      .post('/reset-password', resetPassword);
      
module.exports = router;