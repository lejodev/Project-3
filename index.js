const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const product = require('./controller/routes/product');
const user = require('./controller/routes/user')

require('dotenv').config();

const app = express();

app.use('/api/product', product);

var JWTSecret = process.env.JWT_SECRET;

var PORT = process.env.PORT || 3000;

console.log(JWTSecret);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})