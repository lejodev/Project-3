const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const product = require('./controller/routes/product');
const user = require('./controller/routes/user');
const order = require('./controller/routes/order');

require('dotenv').config();

const app = express();
app.use(express.json())

const JWTSecret = process.env.JWT_SECRET;

app.use(expressJWT({secret : JWTSecret, algorithms : ['HS256']}).unless({path : ['/api/user/signin', '/api/user/login', '/api/product/:id']}));

app.use('/api/product', product);
app.use('/api/user', user);
app.use('/api/order', order);

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})