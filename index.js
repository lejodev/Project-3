const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const delilah = require('./controller/routes/delilahRoutes');

require('dotenv').config();

const app = express();

app.use('/delilah', delilah);

var JWTSecret = process.env.JWT_SECRET;

var PORT = process.env.PORT || 3000;

console.log(JWTSecret);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})