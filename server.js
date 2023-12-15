const express = require('express');
const app = express();  
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoute = require('./routes/auth.route');
const contactUSRoute = require('./routes/contact-us.route');
const exhibitionCatRoute = require('./routes/exhibition-category.route');
const exhibitionImgRoute = require('./routes/exhibition-image.route');
const productRoute = require('./routes/product.route');
const eventRoute = require('./routes/event.route');
const registerOnlineRoute = require('./routes/register-online.route');

const { verifyToken } = require('./middlewares/verify-token');

app.use(cors());

app.use(express.json());
const port = process.env.PORT;

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
});


app.use('/auth', authRoute);
app.use('/contact-us', verifyToken, contactUSRoute);
app.use('/exhibition-category', verifyToken, exhibitionCatRoute);
app.use('/exhibition-image', verifyToken, exhibitionImgRoute);
app.use('/product', verifyToken, productRoute);
app.use('/event', verifyToken, eventRoute);
app.use('/register-online', verifyToken, registerOnlineRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})